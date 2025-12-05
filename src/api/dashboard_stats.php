<?php
error_reporting(E_ALL); 
ini_set('display_errors', 1);
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
    'totalListings' => 0,     // Jumlah properti
    'totalRooms' => 0,        // Total semua kamar
    'availableRooms' => 0,    // Kamar tersedia
    'bookedRooms' => 0,       // Kamar tersewa (dihitung: totalRooms - availableRooms)
    'totalViews' => 0,
    'totalRevenue' => 0.00
];

// Query-query
$queries = [
    // 1. Total Listings (jumlah properti)
    "totalListings" => "
        SELECT COUNT(id_properti) AS total 
        FROM properti 
        WHERE id_user = ?
    ",
    
    // 2. Total Semua Kamar
    "totalRooms" => "
        SELECT COALESCE(SUM(jumlah_kamar), 0) AS total 
        FROM kamar t1
        JOIN properti t2 ON t1.id_properti = t2.id_properti
        WHERE t2.id_user = ?
    ",
    
    // 3. Kamar Tersedia
    "availableRooms" => "
        SELECT COALESCE(SUM(kamar_tersedia), 0) AS total 
        FROM kamar t1
        JOIN properti t2 ON t1.id_properti = t2.id_properti
        WHERE t2.id_user = ?
    ",
    
    // 4. Total Views
    "totalViews" => "
        SELECT COALESCE(SUM(total_views), 0) AS total 
        FROM kamar t1
        JOIN properti t2 ON t1.id_properti = t2.id_properti
        WHERE t2.id_user = ?
    ",
    
    // 5. Total Revenue (tetap sama)
    "totalRevenue" => "
        SELECT COALESCE(SUM(t1.jumlah_bayar), 0) AS total
        FROM pembayaran t1
        JOIN sewa t2 ON t1.id_sewa = t2.id_sewa
        JOIN kamar t3 ON t2.id_kamar = t3.id_kamar
        JOIN properti t4 ON t3.id_properti = t4.id_properti
        WHERE t4.id_user = ? 
          AND t1.status_bayar = 'lunas'
          AND t2.status_sewa = 'aktif'
          AND CURDATE() BETWEEN t2.tgl_mulai AND t2.tgl_selesai
    "
];

foreach ($queries as $key => $sql) {
    $stmt = $koneksi->prepare($sql);
    if (!$stmt) {
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

// HITUNG KAMAR TERSEWA: Total Kamar - Kamar Tersedia
$stats['bookedRooms'] = $stats['totalRooms'] - $stats['availableRooms'];

// Pastikan tidak negatif
if ($stats['bookedRooms'] < 0) {
    $stats['bookedRooms'] = 0;
}

$koneksi->close();

echo json_encode([
    'status' => 'success',
    'data' => [
        'totalListings' => (int)$stats['totalListings'],
        'totalRooms' => (int)$stats['totalRooms'],
        'availableRooms' => (int)$stats['availableRooms'],
        'totalBooked' => (int)$stats['bookedRooms'],  // ← PAKAI totalBooked BUKAN bookedRooms!
        'totalViews' => (int)$stats['totalViews'],
        'totalRevenue' => (float)$stats['totalRevenue']
    ],
    'debug_calculation' => [
        'formula' => 'bookedRooms = totalRooms - availableRooms',
        'calculation' => $stats['totalRooms'] . ' - ' . $stats['availableRooms'] . ' = ' . $stats['bookedRooms']
    ]
]);
?>