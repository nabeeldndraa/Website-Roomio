<?php
error_reporting(E_ALL); 
ini_set('display_errors', 1);
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// DEVELOPMENT MODE - Set user_id manual
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 10; // ID user cindy dari screenshot
    $_SESSION['user_role'] = 'pemilik';
    $_SESSION['username'] = 'cindy';
}

// Cek autentikasi
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error', 
        'message' => 'Silakan login terlebih dahulu'
    ]);
    exit;
}

// Include database
require_once 'db_connect.php';

if (!isset($koneksi)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Koneksi database gagal'
    ]);
    exit;
}

$id_user_host = $_SESSION['user_id'];
$listings = [];

try {
    $sql = "
        SELECT 
            p.id_properti, 
            p.nama_properti, 
            p.tipe_properti, 
            p.tipe_kos,
            p.alamat,
            p.kecamatan,
            p.id_user,
            k.id_kamar,
            k.harga,
            k.satuan_harga,
            k.status, 
            k.jumlah_kamar,
            k.kamar_tersedia,
            (SELECT url_foto 
             FROM foto_properti 
             WHERE id_properti = p.id_properti 
             LIMIT 1) as url_foto
        FROM 
            properti p
        LEFT JOIN 
            kamar k ON p.id_properti = k.id_properti
        WHERE 
            p.id_user = ?
        ORDER BY
            p.id_properti DESC
    ";

    $stmt = $koneksi->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Gagal prepare query: ' . $koneksi->error);
    }

    $stmt->bind_param("i", $id_user_host);

    if (!$stmt->execute()) {
        throw new Exception('Gagal execute query: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $type_display = $row['tipe_properti'] ?? 'Tidak diketahui';
        if ($row['tipe_properti'] === 'Kos' && !empty($row['tipe_kos'])) {
            $type_display = 'Kos ' . $row['tipe_kos'];
        }
        
        $listings[] = [
            'id' => (int)$row['id_properti'],
            'title' => $row['nama_properti'] ?? 'Tanpa Nama',
            'type' => $type_display,
            'address' => $row['alamat'] ?? '-',
            'location' => $row['kecamatan'] ?? '-',
            'price' => (float)($row['harga'] ?? 0),
            'price_unit' => $row['satuan_harga'] ?? 'bulanan',
            'status' => $row['status'] ?? 'tersedia',
            'total_rooms' => (int)($row['jumlah_kamar'] ?? 0),
            'available_rooms' => (int)($row['kamar_tersedia'] ?? 0),
            'image_url' => !empty($row['url_foto']) ? $row['url_foto'] : '', // Kosongkan jika tidak ada
            'kamar_id' => $row['id_kamar'] ? (int)$row['id_kamar'] : null,
            'owner_id' => (int)$row['id_user']
        ];
    }
    
    $stmt->close();
    $koneksi->close();

    echo json_encode([
        'status' => 'success',
        'data' => $listings,
        'count' => count($listings),
        'current_user' => $id_user_host,
        'message' => count($listings) > 0 ? 'Data berhasil dimuat' : 'Belum ada listing'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>