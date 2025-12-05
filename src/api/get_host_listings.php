<?php
error_reporting(E_ALL); 
ini_set('display_errors', 1);
session_start();
header('Content-Type: application/json');

// Development mode bypass
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 1; // ← ini harus user_id
    $_SESSION['user_role'] = 'pemilik';
    $_SESSION['username'] = 'test_owner';
}

// Cek autentikasi
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Akses ditolak.']);
    exit;
}

// Role validation
$allowed_roles = ['pemilik', 'host', 'owner'];
if (!in_array($_SESSION['user_role'], $allowed_roles)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Role tidak sesuai']);
    exit;
}

include 'db_connect.php'; 

$id_user_host = $_SESSION['user_id'];
$listings = [];

try {
    // DEVELOPMENT MODE: Tampilkan semua listing tanpa filter user
    // TODO: Hapus WHERE clause ini setelah sistem login beres
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
            (SELECT url_foto FROM foto_properti WHERE id_properti = p.id_properti LIMIT 1) as url_foto
        FROM 
            properti p
        LEFT JOIN 
            kamar k ON p.id_properti = k.id_properti
        WHERE p.id_user = ? 
        
        ORDER BY
            p.id_properti DESC
    ";

        $stmt = $koneksi->prepare($sql);
    if (!$stmt) {
        throw new Exception('Query preparation failed: ' . $koneksi->error);
    }

    // Bind parameter untuk placeholder `?`
    $stmt->bind_param("i", $id_user_host); // "i" untuk integer

    if (!$stmt->execute()) {
        throw new Exception('Query execution failed: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        // Format tipe properti
        $type_display = $row['tipe_properti'];
        if ($row['tipe_properti'] === 'Kos' && $row['tipe_kos']) {
            $type_display = 'Kos ' . $row['tipe_kos'];
        }
        
        $listings[] = [
            'id' => (int)$row['id_properti'],
            'title' => $row['nama_properti'],
            'type' => $type_display,
            'address' => $row['alamat'],
            'location' => $row['kecamatan'],
            'price' => (float)$row['harga'],
            'price_unit' => $row['satuan_harga'] ?? 'bulanan',
            'status' => $row['status'] ?? 'tersedia',
            'total_rooms' => (int)($row['jumlah_kamar'] ?? 0),
            'available_rooms' => (int)($row['kamar_tersedia'] ?? 0),
            'image_url' => $row['url_foto'] ? $row['url_foto'] : 'assets/placeholder.jpg',
            'kamar_id' => (int)$row['id_kamar'],
            'owner_id' => (int)$row['id_user'] // Debug info
        ];
    }
    
    $stmt->close();
    $koneksi->close();

    echo json_encode([
        'status' => 'success',
        'data' => $listings,
        'count' => count($listings),
        'current_user' => $id_user_host // Debug info
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>