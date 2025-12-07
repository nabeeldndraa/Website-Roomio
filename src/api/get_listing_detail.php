<?php
// api/get_listing_detail.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

// 1. KONEKSI DATABASE
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'db_roomio';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'DB Connection Error']));
}

// 2. AMBIL ID
$id_kamar = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id_kamar == 0) {
    die(json_encode(['status' => 'error', 'message' => 'ID tidak valid']));
}

// 3. QUERY DATA KAMAR + PROPERTI
$sql = "SELECT 
            p.id_properti,
            p.nama_properti,
            p.alamat,
            p.tipe_properti,
            p.tipe_kos,
            p.deskripsi,
            p.fasilitas_umum,
            p.rules,
            p.latitude,
            p.longitude,
            
            k.id_kamar,
            k.nama_kamar,
            k.tipe_kamar,
            k.harga,
            k.deposit,
            k.jumlah_kamar,
            k.kamar_tersedia,
            k.room_size,
            k.fasilitas_kamar
            
        FROM properti p
        JOIN kamar k ON p.id_properti = k.id_properti
        WHERE k.id_kamar = $id_kamar
        LIMIT 1";

$result = $conn->query($sql);

if (!$result || $result->num_rows == 0) {
    die(json_encode(['status' => 'error', 'message' => 'Data tidak ditemukan']));
}

$row = $result->fetch_assoc();
$id_properti = $row['id_properti'];

// 4. AMBIL SEMUA FOTO
$sql_foto = "SELECT url_foto FROM foto_properti WHERE id_properti = $id_properti ORDER BY id_foto";
$res_foto = $conn->query($sql_foto);

$images = [];
if ($res_foto && $res_foto->num_rows > 0) {
    while($foto = $res_foto->fetch_assoc()) {
        $images[] = $foto['url_foto'];
    }
}

// Jika tidak ada foto, kasih placeholder
if (empty($images)) {
    $images[] = "https://via.placeholder.com/800x600?text=No+Image";
}

// ✅ FIX JUDUL DOUBLE
$title = $row['nama_properti'];
if (!empty($row['nama_kamar']) && stripos($row['nama_kamar'], $row['nama_properti']) === false) {
    // Jika nama_kamar tidak mengandung nama_properti, gabungkan
    $title = $row['nama_properti'] . ' - ' . $row['nama_kamar'];
} elseif (!empty($row['nama_kamar'])) {
    // Jika sudah mengandung, pakai nama_kamar saja
    $title = $row['nama_kamar'];
}

// Determine type display
$typeDisplay = $row['tipe_properti'];
if ($row['tipe_properti'] === 'Kos' && !empty($row['tipe_kos'])) {
    $typeDisplay = 'Kos ' . $row['tipe_kos'];
}

// ✅ QUERY RATING DARI DATABASE
$rating_sql = "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
               FROM reviews WHERE id_properti = $id_properti";
$rating_result = $conn->query($rating_sql);
$rating_data = $rating_result ? $rating_result->fetch_assoc() : null;

// Set default jika belum ada review
$avg_rating = ($rating_data && $rating_data['avg_rating']) 
    ? round((float)$rating_data['avg_rating'], 1) 
    : 0;
$total_reviews = ($rating_data && $rating_data['total_reviews']) 
    ? (int)$rating_data['total_reviews'] 
    : 0;

// 5. FORMAT RESPONSE (SESUAI YANG DIBUTUHKAN JS)
echo json_encode([
    'status' => 'success',
    'data' => [
        'id' => (int)$row['id_kamar'],
        'property_id' => (int)$id_properti,
        'title' => $title,
        'description' => $row['deskripsi'] ?? 'Fasilitas lengkap',
        'address' => $row['alamat'],
        'location' => $row['alamat'],
        'type' => $typeDisplay,
        'category' => $row['tipe_kamar'],
        'price' => (int)$row['harga'],
        'deposit' => (int)($row['deposit'] ?? 0),
        'roomSize' => $row['room_size'] ?? '3x4m',
        'available' => (int)($row['kamar_tersedia'] ?? 0),
        'rooms' => (int)($row['jumlah_kamar'] ?? 0),
        'latitude' => (float)($row['latitude'] ?? 0),
        'longitude' => (float)($row['longitude'] ?? 0),
        'rating' => $avg_rating,
        'reviews' => $total_reviews,
        'host_name' => 'Pemilik Kos',
        
        // ✅ BAGIAN PENTING: IMAGES ARRAY
        'images' => $images,
        
        'facilities' => !empty($row['fasilitas_kamar']) 
            ? array_map('trim', explode(',', $row['fasilitas_kamar']))
            : [],
        'rules' => !empty($row['rules']) 
            ? array_map('trim', explode("\n", $row['rules']))
            : []
    ]
], JSON_UNESCAPED_UNICODE);

$conn->close();
?>