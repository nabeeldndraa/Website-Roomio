<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php';

$id_properti = $_GET['id'] ?? null;

if (!$id_properti) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID properti tidak ditemukan']);
    exit;
}

try {
    $sql = "SELECT 
                p.id_properti,
                p.nama_properti,
                p.tipe_properti,
                p.tipe_kos,
                p.alamat,
                p.kecamatan,
                p.deskripsi,
                p.rules,
                p.latitude,
                p.longitude,
                k.harga,
                k.deposit,
                k.jumlah_kamar,
                k.kamar_tersedia,
                k.room_size,
                k.fasilitas_kamar,
                u.username as host_name
            FROM properti p
            LEFT JOIN kamar k ON p.id_properti = k.id_properti
            LEFT JOIN users u ON p.id_user = u.id_user
            WHERE p.id_properti = ?
            LIMIT 1";
    
    $stmt = $koneksi->prepare($sql);
    $stmt->bind_param("i", $id_properti);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Properti tidak ditemukan']);
        exit;
    }
    
    $data = $result->fetch_assoc();
    
    // Ambil foto
    $sql_foto = "SELECT url_foto FROM foto_properti WHERE id_properti = ? ORDER BY id_foto LIMIT 4";
    $stmt_foto = $koneksi->prepare($sql_foto);
    $stmt_foto->bind_param("i", $id_properti);
    $stmt_foto->execute();
    $result_foto = $stmt_foto->get_result();
    
    $fotos = [];
    while ($foto = $result_foto->fetch_assoc()) {
        $fotos[] = $foto['url_foto'];
    }
    
    // Default image jika tidak ada foto
    if (empty($fotos)) {
        $fotos[] = 'assets/placeholder.jpg';
    }
    
    // Parse fasilitas
    $fasilitas = [];
    if (!empty($data['fasilitas_kamar'])) {
        $fasilitas = json_decode($data['fasilitas_kamar'], true) ?? [];
    }
    
    // Format tipe
    $type_display = $data['tipe_properti'];
    if ($data['tipe_properti'] === 'Kos' && $data['tipe_kos']) {
        $type_display = 'Kos ' . $data['tipe_kos'];
    }
    
    $response = [
        'status' => 'success',
        'data' => [
            'id' => $data['id_properti'],
            'title' => $data['nama_properti'],
            'type' => $type_display,
            'location' => $data['kecamatan'] . ', Jember',
            'address' => $data['alamat'],
            'price' => (int)$data['harga'],
            'deposit' => (int)($data['deposit'] ?? $data['harga']),
            'description' => $data['deskripsi'] ?? '',
            'rules' => $data['rules'] ? array_filter(explode("\n", trim($data['rules']))) : [],
            'rooms' => (int)$data['jumlah_kamar'],
            'available' => (int)$data['kamar_tersedia'],
            'roomSize' => $data['room_size'] ?? '-',
            'facilities' => $fasilitas,
            'images' => $fotos,
            'latitude' => (float)$data['latitude'],
            'longitude' => (float)$data['longitude'],
            'host_name' => $data['host_name'] ?? 'Pemilik',
            'rating' => 4.5,
            'reviews' => 0
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error', 
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$koneksi->close();
?>