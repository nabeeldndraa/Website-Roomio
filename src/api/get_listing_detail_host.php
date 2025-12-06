<?php
// api/get_listing_detail_host.php
// Khusus untuk Host Dashboard - menggunakan id_properti
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

require_once 'db_connect.php';

// Gunakan $koneksi dari db_connect.php
$conn = $koneksi;

// AMBIL ID PROPERTI
$id_properti = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id_properti == 0) {
    die(json_encode(['status' => 'error', 'message' => 'ID properti tidak valid']));
}

// QUERY DATA PROPERTI dengan KAMAR pertama (atau semua kamar)
$sql = "SELECT 
            p.id_properti,
            p.nama_properti,
            p.alamat,
            p.tipe_properti,
            p.deskripsi,
            p.fasilitas_umum,
            p.rules,
            p.latitude,
            p.longitude,
            p.tipe_kos,
            
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
        LEFT JOIN kamar k ON p.id_properti = k.id_properti
        WHERE p.id_properti = $id_properti
        ORDER BY k.id_kamar ASC
        LIMIT 1";

$result = $conn->query($sql);

if (!$result || $result->num_rows == 0) {
    die(json_encode([
        'status' => 'error', 
        'message' => 'Listing tidak ditemukan atau terjadi kesalahan'
    ]));
}

$row = $result->fetch_assoc();

// AMBIL SEMUA FOTO dari tabel foto_properti
$sql_foto = "SELECT url_foto FROM foto_properti WHERE id_properti = $id_properti ORDER BY id_foto";
$res_foto = $conn->query($sql_foto);

$images = [];
if ($res_foto && $res_foto->num_rows > 0) {
    while($foto = $res_foto->fetch_assoc()) {
        // Pastikan URL foto tidak kosong
        if (!empty($foto['url_foto'])) {
            $images[] = $foto['url_foto'];
        }
    }
}

// Jika tidak ada foto, kasih placeholder
if (empty($images)) {
    $images[] = "https://via.placeholder.com/800x600?text=No+Image+Available";
}

// AMBIL SEMUA KAMAR dari properti ini (untuk ditampilkan sebagai pilihan)
$sql_kamar = "SELECT * FROM kamar WHERE id_properti = $id_properti ORDER BY harga ASC";
$res_kamar = $conn->query($sql_kamar);

$rooms = [];
if ($res_kamar && $res_kamar->num_rows > 0) {
    while($kamar = $res_kamar->fetch_assoc()) {
        $rooms[] = [
            'id_kamar' => (int)$kamar['id_kamar'],
            'nama_kamar' => $kamar['nama_kamar'],
            'tipe_kamar' => $kamar['tipe_kamar'],
            'harga' => (int)$kamar['harga'],
            'deposit' => (int)($kamar['deposit'] ?? 0),
            'jumlah_kamar' => (int)$kamar['jumlah_kamar'],
            'kamar_tersedia' => (int)$kamar['kamar_tersedia'],
            'room_size' => $kamar['room_size'] ?? '-',
            'fasilitas' => !empty($kamar['fasilitas_kamar']) 
                ? explode(',', trim($kamar['fasilitas_kamar'])) 
                : []
        ];
    }
}

// Parse facilities dan rules
$fasilitas_umum = [];
if (!empty($row['fasilitas_umum'])) {
    $fasilitas_umum = array_map('trim', explode(',', $row['fasilitas_umum']));
}

$fasilitas_kamar = [];
if (!empty($row['fasilitas_kamar'])) {
    $fasilitas_kamar = array_map('trim', explode(',', $row['fasilitas_kamar']));
}

// Gabungkan fasilitas umum dan kamar
$all_facilities = array_unique(array_merge($fasilitas_umum, $fasilitas_kamar));

$rules = [];
if (!empty($row['rules'])) {
    $rules = array_map('trim', explode(',', $row['rules']));
}

// FORMAT RESPONSE sesuai kebutuhan listing-detail.html
echo json_encode([
    'status' => 'success',
    'data' => [
        'id' => (int)$id_properti,
        'property_id' => (int)$id_properti,
        'room_id' => (int)($row['id_kamar'] ?? 0),
        'title' => $row['nama_properti'],
        'room_name' => $row['nama_kamar'] ?? '',
        'description' => $row['deskripsi'] ?? 'Properti nyaman dengan fasilitas lengkap',
        'address' => $row['alamat'] ?? '',
        'location' => $row['alamat'] ?? '',
        'type' => $row['tipe_properti'] ?? 'Kos',
        'tipe_kos' => $row['tipe_kos'] ?? 'Campur',
        'category' => $row['tipe_kamar'] ?? $row['tipe_properti'] ?? '',
        'price' => (int)($row['harga'] ?? 0),
        'deposit' => (int)($row['deposit'] ?? 0),
        'roomSize' => $row['room_size'] ?? '-',
        'available' => (int)($row['kamar_tersedia'] ?? 0),
        'total_rooms' => (int)($row['jumlah_kamar'] ?? 0),
        'latitude' => (float)($row['latitude'] ?? -8.1598),
        'longitude' => (float)($row['longitude'] ?? 113.7144),
        'rating' => 4.8,
        'reviews' => 0,
        'host_name' => 'Pemilik Properti',
        
        // IMAGES ARRAY - INI YANG PENTING
        'images' => $images,
        
        // FACILITIES
        'facilities' => array_values($all_facilities),
        
        // RULES
        'rules' => $rules,
        
        // SEMUA KAMAR (opsional, untuk dropdown pilihan kamar)
        'available_rooms' => $rooms
    ]
]);

$conn->close();
?>