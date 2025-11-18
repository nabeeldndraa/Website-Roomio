<?php
// Tiga baris debug (HAPUS SETELAH BERHASIL)
error_reporting(E_ALL); 
ini_set('display_errors', 1);
// --- END DEBUG ---

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'pemilik') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Akses ditolak. Anda harus login sebagai Host.']);
    exit;
}

include 'db_connect.php'; 

$id_user_host = $_SESSION['user_id'];
$listings = [];

$sql = "
    SELECT 
        p.id_properti, 
        p.nama_properti AS title, 
        p.tipe_properti, 
        p.tipe_kos,
        p.alamat,
        k.id_kamar,
        k.harga,
        k.satuan_harga,
        k.status, 
        k.kamar_tersedia,
        f.url_foto
    FROM 
        properti p
    JOIN 
        kamar k ON p.id_properti = k.id_properti
    LEFT JOIN 
        foto_properti f ON p.id_properti = f.id_properti
    WHERE 
        p.id_user = ?
    GROUP BY
        p.id_properti, p.nama_properti, p.tipe_properti, p.tipe_kos, p.alamat, k.id_kamar, k.harga, k.satuan_harga, k.status, k.kamar_tersedia, f.url_foto
    ORDER BY
        p.id_properti DESC
";

$stmt = $koneksi->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Query error: ' . $koneksi->error]);
    $koneksi->close();
    exit;
}

$stmt->bind_param("i", $id_user_host);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $listings[] = [
        'id' => $row['id_properti'],
        'title' => $row['title'],
        'type' => $row['tipe_properti'] . ($row['tipe_kos'] ? ' (' . $row['tipe_kos'] . ')' : ''),
        'address' => $row['alamat'],
        'price' => (float)$row['harga'],
        'price_unit' => $row['satuan_harga'],
        'status' => $row['status'],
        'available_rooms' => (int)$row['kamar_tersedia'],
        'image_url' => $row['url_foto'] ? $row['url_foto'] : 'assets/images/default.png',
        'kamar_id' => $row['id_kamar']
    ];
}
$stmt->close();
$koneksi->close();

echo json_encode([
    'status' => 'success',
    'data' => $listings
]);
?>