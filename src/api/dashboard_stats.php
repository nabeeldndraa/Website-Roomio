<?php
// Tiga baris debug (HAPUS SETELAH BERHASIL)
error_reporting(E_ALL); 
ini_set('display_errors', 1);
// --- END DEBUG ---

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'pemilik') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Akses ditolak. Silakan login sebagai Host.']);
    exit;
}

include 'db_connect.php'; 

$id_user_host = $_SESSION['user_id'];
$stats = [
    'totalListings' => 0,
    'totalBooked' => 0,
    'totalViews' => 0,
    'totalRevenue' => 0.00
];

// Query-query harus menggunakan JOIN ke tabel 'properti' karena id_user ada di sana
$queries = [
    // 1. Total Listings (Dihitung dari kamar JOIN properti)
    "totalListings" => "
        SELECT COUNT(t1.id_kamar) AS total 
        FROM kamar t1
        JOIN properti t2 ON t1.id_properti = t2.id_properti
        WHERE t2.id_user = ?
    ",
    // 2. Kamar Tersewa (Tabel sewa JOIN kamar JOIN properti)
    "totalBooked" => "
        SELECT COUNT(t1.id_sewa) AS total
        FROM sewa t1
        JOIN kamar t2 ON t1.id_kamar = t2.id_kamar
        JOIN properti t3 ON t2.id_properti = t3.id_properti
        WHERE t3.id_user = ? AND t1.status_sewa IN ('aktif', 'pending')
    ",
    // 3. Total Pendapatan (Tabel pembayaran JOIN sewa JOIN kamar JOIN properti)
    "totalRevenue" => "
        SELECT SUM(t1.jumlah_bayar) AS total
        FROM pembayaran t1
        JOIN sewa t2 ON t1.id_sewa = t2.id_sewa
        JOIN kamar t3 ON t2.id_kamar = t3.id_kamar
        JOIN properti t4 ON t3.id_properti = t4.id_properti
        WHERE t4.id_user = ? AND t1.status_bayar = 'lunas'
    ",
    // 4. Total Views (Dihitung dari kamar JOIN properti)
    "totalViews" => "
        SELECT SUM(t1.total_views) AS total 
        FROM kamar t1
        JOIN properti t2 ON t1.id_properti = t2.id_properti
        WHERE t2.id_user = ?
    "
];

foreach ($queries as $key => $sql) {
    $stmt = $koneksi->prepare($sql);
    if (!$stmt) {
         // Jika prepare gagal, mungkin ada masalah pada nama tabel atau kolom
         http_response_code(500);
         echo json_encode(['status' => 'error', 'message' => 'Query error: ' . $koneksi->error]);
         $koneksi->close();
         exit;
    }
    $stmt->bind_param("i", $id_user_host);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stats[$key] = $result['total'] ?? 0;
    $stmt->close();
}

$koneksi->close();

echo json_encode([
    'status' => 'success',
    'data' => [
        'totalListings' => (int)$stats['totalListings'],
        'totalBooked' => (int)$stats['totalBooked'],
        'totalViews' => (int)$stats['totalViews'],
        'totalRevenue' => (float)$stats['totalRevenue']
    ]
]);
?>