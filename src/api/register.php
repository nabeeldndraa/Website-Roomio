<?php
// Selalu set header ke JSON
header('Content-Type: application/json');

// 1. Sertakan file koneksi
include 'db_connect.php';

// 2. Ambil data JSON yang dikirim oleh JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// 3. Validasi input dasar
if (empty($data['name']) || empty($data['email']) || empty($data['password']) || empty($data['phone']) || empty($data['role'])) {
    echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi.']);
    exit;
}

// 4. Ambil data ke variabel
$nama_lengkap = $data['name'];
$email = $data['email'];
$no_hp = $data['phone'];
$password = $data['password'];
$form_role = $data['role']; // Ini 'user', 'host', atau 'both'

// 5. Cek apakah email sudah terdaftar (PENTING!)
$stmt = $koneksi->prepare("SELECT id_user FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email ini sudah terdaftar.']);
    $stmt->close();
    $koneksi->close();
    exit;
}
$stmt->close();

// 6. Hash password (PENTING!)
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// 7. Tentukan role untuk database
$db_role = '';
if ($form_role == 'user') {
    $db_role = 'penyewa';
} else {
    // Baik 'host' atau 'both' kita set role utamanya 'pemilik'
    $db_role = 'pemilik';
}

// 8. Masukkan data ke tabel 'users'
$stmt = $koneksi->prepare("INSERT INTO users (nama_lengkap, username, email, no_hp, password, role) VALUES (?, ?, ?, ?, ?, ?)");
// Kita bisa gunakan email sebagai username default jika tidak ada field username di form
$username = $email; 
$stmt->bind_param("ssssss", $nama_lengkap, $username, $email, $no_hp, $hashed_password, $db_role);

if ($stmt->execute()) {
    // Jika berhasil, ambil ID user yang baru dibuat
    $id_user_baru = $koneksi->insert_id;
    
    // 9. (Logika Tambahan) Jika role 'user' atau 'both', buat juga entri di tabel 'penyewa'
    if ($form_role == 'user' || $form_role == 'both') {
        // Asumsi status default, bisa kamu sesuaikan
        $status_penyewa = 'Mahasiswa'; 
        $stmt_penyewa = $koneksi->prepare("INSERT INTO penyewa (id_user, status) VALUES (?, ?)");
        $stmt_penyewa->bind_param("is", $id_user_baru, $status_penyewa);
        $stmt_penyewa->execute();
        $stmt_penyewa->close();
    }
    
    echo json_encode(['status' => 'success', 'message' => 'Registrasi berhasil! Silakan login.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Registrasi gagal, terjadi error pada server.']);
}

$stmt->close();
$koneksi->close();
?>