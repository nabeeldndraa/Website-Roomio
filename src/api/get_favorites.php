<?php
// api/get_favorites.php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Cek apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Anda harus login terlebih dahulu'
    ]);
    exit;
}

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'db_roomio';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection error'
    ]);
    exit;
}

$id_user = $_SESSION['user_id'];

// Query untuk mengambil favorit user beserta detail properti
$sql = "SELECT 
            f.id_favorit,
            f.id_kamar,
            k.nama_kamar,
            k.harga,
            k.room_size,
            k.fasilitas_kamar,
            k.kamar_tersedia,
            p.id_properti,
            p.nama_properti,
            p.alamat,
            p.tipe_properti,
            p.tipe_kos,
            (SELECT url_foto FROM foto_properti WHERE id_properti = p.id_properti LIMIT 1) as image
        FROM favorit f
        JOIN kamar k ON f.id_kamar = k.id_kamar
        JOIN properti p ON k.id_properti = p.id_properti
        WHERE f.id_user = ?
        ORDER BY f.id_favorit DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_user);
$stmt->execute();
$result = $stmt->get_result();

$favorites = [];

while ($row = $result->fetch_assoc()) {
    // Determine type display
    $typeDisplay = $row['tipe_properti'];
    if ($row['tipe_properti'] === 'Kos' && !empty($row['tipe_kos'])) {
        $typeDisplay = 'Kos ' . $row['tipe_kos'];
    }
    
    // Check title double
    $title = $row['nama_properti'];
    if (!empty($row['nama_kamar']) && stripos($row['nama_kamar'], $row['nama_properti']) === false) {
        $title = $row['nama_properti'] . ' - ' . $row['nama_kamar'];
    } elseif (!empty($row['nama_kamar'])) {
        $title = $row['nama_kamar'];
    }
    
    // Parse facilities
    $facilities = [];
    if (!empty($row['fasilitas_kamar'])) {
        $facilities = array_filter(array_map('trim', explode(',', $row['fasilitas_kamar'])));
    }
    
    $favorites[] = [
        'id' => (int)$row['id_kamar'],
        'id_favorit' => (int)$row['id_favorit'],
        'property_id' => (int)$row['id_properti'],
        'title' => $title,
        'type' => $typeDisplay,
        'location' => $row['alamat'],
        'price' => (int)$row['harga'],
        'image' => $row['image'] ?? 'assets/no-image.jpg',
        'rating' => 4.5,
        'reviews' => rand(5, 50),
        'available' => (int)$row['kamar_tersedia'],
        'roomSize' => $row['room_size'] ?? '3x4m',
        'facilities' => $facilities
    ];
}

echo json_encode([
    'status' => 'success',
    'data' => $favorites
], JSON_UNESCAPED_UNICODE);

$conn->close();
?>