<?php
// Pastikan nama file ini sesuai dengan yang dipanggil di JavaScript
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

// Debugging: Tampilkan error jika ada
error_reporting(E_ALL);
ini_set('display_errors', 1); // Ubah ke 1 jika ingin melihat error di browser

// 1. KONEKSI DATABASE
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'db_roomio'; // <--- JANGAN LUPA GANTI INI

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'DB Connection Error']));
}

// 2. AMBIL ID DARI PARAMETER URL
$id_kamar = 0;

if (isset($_GET['id'])) {
    $id_kamar = (int)$_GET['id'];
} elseif (isset($_GET['id_kamar'])) {
    $id_kamar = (int)$_GET['id_kamar'];
}

// Cek lagi apakah ID berhasil didapat
if ($id_kamar == 0) {
    // Debugging: Kasih tau user apa yang sebenarnya diterima PHP
    $input_yang_diterima = json_encode($_GET);
    die(json_encode([
        'status' => 'error', 
        'message' => 'ID Kamar tidak valid atau Kosong. Data yang diterima server: ' . $input_yang_diterima
    ]));
}

// 3. QUERY DATA UTAMA (JOIN PROPERTI + KAMAR)
// Sesuaikan nama kolom dengan database kamu yang tadi
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
            p.jumlah_views AS views,
            
            k.id_kamar,
            k.nama_kamar,
            k.tipe_kamar,
            k.harga,
            k.deposit,
            k.jumlah_kamar,
            k.kamar_tersedia,
            k.room_size,
            k.satuan_harga,
            k.status,
            k.fasilitas_kamar,
            k.total_views AS kamar_views
            
        FROM properti p
        JOIN kamar k ON p.id_properti = k.id_properti
        WHERE k.id_kamar = $id_kamar
        LIMIT 1";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // 4. QUERY AMBIL GALERI FOTO (Dari tabel foto_properti)
    $id_properti = $row['id_properti'];
    
    // Ganti 'nama_file' dengan nama kolom gambar asli di tabel foto_properti kamu
    // (misal: 'url_foto', 'gambar', 'file')
    $sql_foto = "SELECT url_foto FROM foto_properti WHERE id_properti = $id_properti"; 
    $res_foto = $conn->query($sql_foto);
    
    $gallery = [];
    if ($res_foto) {
        while($f = $res_foto->fetch_assoc()) {
            $gallery[] = $f['url_foto']; 
        }
    }
    
    // Jika tidak ada foto, kasih default
    if (empty($gallery)) {
        $gallery[] = "https://via.placeholder.com/600x400?text=No+Image";
    }

    // Bersihkan data fasilitas
    $fasilitas = !empty($row['fasilitas_kamar']) ? explode(',', $row['fasilitas_kamar']) : [];

    // Format Data JSON
    $data = [
        'status' => 'success',
        'data' => [
            'id' => $row['id_kamar'],
            'title' => $row['nama_properti'] . ' - ' . $row['nama_kamar'], // Ubah biar match JS
            'description' => $row['deskripsi'] ?? 'Fasilitas lengkap, lokasi strategis.',
            'location' => $row['alamat'],
            'price' => (int)$row['harga'],
            'deposit' => (int)$row['deposit'] ?? 0,
            'category' => $row['tipe_properti'],
            'type' => $row['tipe_kamar'], // Buat JS
            'roomSize' => $row['room_size'] ?? '3x4 m',
            'available' => (int)$row['kamar_tersedia'] ?? 0,
            'rooms' => (int)$row['jumlah_kamar'] ?? 0,
            'latitude' => (float)$row['latitude'] ?? 0,
            'longitude' => (float)$row['longitude'] ?? 0,
            'views' => (int)$row['views'] ?? 0,
            'facilities' => !empty($row['fasilitas_kamar']) ? explode(',', $row['fasilitas_kamar']) : [],
            'buildingFacilities' => !empty($row['fasilitas_umum']) ? explode(',', $row['fasilitas_umum']) : [],
            'rules' => !empty($row['rules']) ? explode(',', $row['rules']) : [],
            'main_image' => $gallery[0],
            'gallery' => $gallery,
            'rating' => 4.8,
            'reviews' => 12
        ]
    ];
    echo json_encode($data);

} else {
    echo json_encode(['status' => 'error', 'message' => 'Data tidak ditemukan']);
}
$conn->close();
?>