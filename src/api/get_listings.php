<?php
// api/get_listings.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

// --- 1. KONEKSI DATABASE ---
$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'db_roomio'; // <--- JANGAN LUPA SESUAIKAN

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Koneksi Gagal: ' . $conn->connect_error]));
}

// --- 2. QUERY SQL (TEKNIK SUBQUERY) ---
// Kita ambil data properti & kamar, lalu "nitip" ambil 1 foto dari tabel sebelah

$sql = "SELECT 
            p.id_properti,
            p.nama_properti,
            p.alamat,
            p.tipe_properti,
            
            k.id_kamar,
            k.tipe_kamar,
            k.harga,
            k.fasilitas_kamar,
            
            -- BAGIAN INI MENGAMBIL FOTO DARI TABEL 'foto_properti'
            -- (SELECT nama_kolom_foto FROM nama_tabel WHERE foreign_key = p.id LIMIT 1)
            (SELECT url_foto FROM foto_properti WHERE id_properti = p.id_properti LIMIT 1) as foto_sampul
            
        FROM properti p
        JOIN kamar k ON p.id_properti = k.id_properti
        ORDER BY k.id_kamar DESC";

$result = $conn->query($sql);

if (!$result) {
    die(json_encode(['status' => 'error', 'message' => 'Query Error! Cek nama kolom di tabel foto.', 'detail' => $conn->error]));
}

$data = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        
        $fasilitas_array = !empty($row['fasilitas_kamar']) ? explode(',', $row['fasilitas_kamar']) : [];

        // --- LOGIKA GAMBAR ---
        // Jika foto_sampul ketemu, pakai itu. Jika tidak, pakai placeholder.
        $gambar = 'https://via.placeholder.com/400x300?text=No+Image';
        
        if (!empty($row['foto_sampul'])) {
            // Pastikan path gambarnya benar.
            // Jika di database cuma nama file (misal: "kamar1.jpg"), tambahkan folder di depannya
            // Contoh: $gambar = 'uploads/' . $row['foto_sampul'];
            $gambar = $row['foto_sampul']; 
        }

        $data[] = [
            'id' => $row['id_kamar'],
            'property_id' => $row['id_properti'],
            'title' => $row['nama_properti'] . ' - ' . $row['tipe_kamar'],
            'location' => $row['alamat'],
            'price' => (int)$row['harga'],
            'image' => $gambar,
            'category' => $row['tipe_properti'],
            'type' => $row['tipe_properti'], // Badge tipe kos
            'facilities' => $fasilitas_array,
            'rating' => 4.5,
            'reviews' => 10
        ];
    }
}

echo json_encode($data);
$conn->close();
?>