<?php
error_reporting(E_ALL); 
ini_set('display_errors', 1);
// ... Lanjutkan dengan session_start() dan header()
session_start(); // HARUS ADA DI BARIS INI
header('Content-Type: application/json');

// --- 1. Autentikasi dan Proteksi ---
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'pemilik') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Akses ditolak. Anda bukan Host.']);
    exit;
}

include 'db_connect.php'; 
$koneksi->begin_transaction(); 

$id_user_host = $_SESSION['user_id'];
$upload_dir = '../uploads/'; // Pastikan folder 'uploads' ada dan bisa ditulis

try {
    // --- 2. Ambil Data POST dari FormData ---
    $title = $_POST['title'] ?? null;
    $category_form = $_POST['category'] ?? null; // 'kos-putra', 'kontrakan', dll.
    $price = $_POST['price'] ?? 0;
    $deposit = $_POST['deposit'] ?? 0;
    $district = $_POST['district'] ?? null; // 'tegalboto', 'sumbersari', dll.
    $address = $_POST['address'] ?? null;
    $description = $_POST['description'] ?? null;
    $rooms = $_POST['rooms'] ?? 0;
    $available = $_POST['available'] ?? 0;
    $roomSize = $_POST['roomSize'] ?? null;
    $facilities = $_POST['facilities'] ?? '[]'; // JSON string dari fasilitas
    $rules = $_POST['rules'] ?? '';

    // Validasi dasar
    if (!$title || !$category_form || !$address || $price <= 0 || $rooms <= 0) {
        throw new Exception("Mohon lengkapi semua field wajib.");
    }
    
    // --- 3. Logika untuk memecah 'category' dari form ---
    $tipe_properti = 'Kos'; // Default
    $tipe_kos = NULL; // Default

    if ($category_form == 'kontrakan') {
        $tipe_properti = 'Kontrakan';
        $tipe_kos = NULL;
    } else if ($category_form == 'kos-putra') {
        $tipe_kos = 'Putra';
    } else if ($category_form == 'kos-putri') {
        $tipe_kos = 'Putri';
    } else if ($category_form == 'kos-campur') {
        $tipe_kos = 'Campur';
    }

    // --- 4. INSERT ke Tabel 'properti' (Sesuai ERD) ---
    $sql_properti = "INSERT INTO properti (id_user, nama_properti, tipe_properti, tipe_kos, alamat, kecamatan, deskripsi, rules, fasilitas_umum) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_properti = $koneksi->prepare($sql_properti);
    // Kita belum punya 'fasilitas_umum' dari form, jadi kita isi string kosong
    $fasilitas_umum_dummy = ''; 
    $stmt_properti->bind_param("issssssss", 
        $id_user_host, 
        $title,          // -> nama_properti
        $tipe_properti,  // -> tipe_properti
        $tipe_kos,       // -> tipe_kos
        $address,        // -> alamat
        $district,       // -> kecamatan
        $description,    // -> deskripsi
        $rules,          // -> rules (dari Langkah 1)
        $fasilitas_umum_dummy // -> fasilitas_umum
    );
    
    if (!$stmt_properti->execute()) {
        throw new Exception("Gagal menyimpan properti: " . $stmt_properti->error);
    }
    $id_properti_baru = $koneksi->insert_id; // Ambil ID properti yang baru dibuat
    $stmt_properti->close();

    // --- 5. INSERT ke Tabel 'kamar' (Sesuai ERD) ---
    // ERD Anda tidak memiliki id_user di 'kamar', YANG MANA ITU BENAR!
    // Kita akan hapus id_user dari query ini.
    $sql_kamar = "INSERT INTO kamar (id_properti, nama_kamar, tipe_kamar, harga, satuan_harga, status, fasilitas_kamar, total_views, deposit, jumlah_kamar, kamar_tersedia, room_size) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_kamar = $koneksi->prepare($sql_kamar);
    
// --- 5. INSERT ke Tabel 'kamar' (Sesuai ERD) ---

// Nilai default untuk kolom yang tidak ada di form
$satuan_harga_default = 'bulanan'; 
$status_default = 'tersedia'; // Menggunakan nilai yang benar dari ENUM Anda
$total_views_default = 0;

$sql_kamar = "INSERT INTO kamar (id_properti, nama_kamar, tipe_kamar, harga, satuan_harga, status, fasilitas_kamar, total_views, deposit, jumlah_kamar, kamar_tersedia, room_size) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt_kamar = $koneksi->prepare($sql_kamar);

// Urutan Tipe Data (12 Karakter): 
// i = integer, s = string, d = double/decimal
// Urutan yang benar: i s s d s s s i d i i s
$stmt_kamar->bind_param("issdsssidiss", 
    $id_properti_baru, 
    $title,          
    $category_form,  
    $price,          
    $satuan_harga_default,
    $status_default,     // <-- INI SEKARANG 's', BUKAN 'i'
    $facilities,     
    $total_views_default,
    $deposit,        // <-- INI SEKARANG 'd'
    $rooms,          
    $available,      
    $roomSize        
);

if (!$stmt_kamar->execute()) {
    // Jika masih ada error, tampilkan detail error SQL yang sesungguhnya
    throw new Exception("Gagal menyimpan detail kamar: " . $stmt_kamar->error);
}
$stmt_kamar->close();

    // --- 6. Handle File Uploads (Sesuai ERD) ---
    if (!empty($_FILES['images']['name'][0])) {
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $files = $_FILES['images'];
        // Menggunakan 'url_foto' dan 'deskripsi_foto' sesuai ERD
        $insert_foto_sql = "INSERT INTO foto_properti (id_properti, url_foto, deskripsi_foto) VALUES (?, ?, ?)";
        $stmt_foto = $koneksi->prepare($insert_foto_sql);
        $deskripsi_foto_default = 'Foto properti';

        foreach ($files['name'] as $index => $name) {
            if ($files['error'][$index] === UPLOAD_ERR_OK) {
                $file_tmp = $files['tmp_name'][$index];
                $file_ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
                $new_file_name = uniqid('img_', true) . '.' . $file_ext;
                $file_path = $upload_dir . $new_file_name;
                
                if (move_uploaded_file($file_tmp, $file_path)) {
                    $db_path = 'uploads/' . $new_file_name; // Path relatif
                    $stmt_foto->bind_param("iss", $id_properti_baru, $db_path, $deskripsi_foto_default);
                    $stmt_foto->execute();
                }
            }
        }
        $stmt_foto->close();
    }

    // --- 7. Commit Transaksi ---
    $koneksi->commit();
    echo json_encode(['status' => 'success', 'message' => 'Listing berhasil dipublikasikan!', 'id_properti' => $id_properti_baru]);

} catch (Exception $e) { 
    // --- 8. Rollback jika Gagal ---
    $koneksi->rollback();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal publikasi listing: ' . $e->getMessage()]);
} 

$koneksi->close();
