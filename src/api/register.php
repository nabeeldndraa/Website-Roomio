<?php

header('Content-Type: application/json');


include 'db_connect.php';


$data = json_decode(file_get_contents('php:


if (empty($data['name']) || empty($data['email']) || empty($data['password']) || empty($data['phone']) || empty($data['role'])) {
    echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi.']);
    exit;
}


$nama_lengkap = $data['name'];
$email = $data['email'];
$no_hp = $data['phone'];
$password = $data['password'];
$form_role = $data['role'];


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


$hashed_password = password_hash($password, PASSWORD_BCRYPT);


$db_role = '';
if ($form_role == 'user') {
    $db_role = 'penyewa';
} else {

    $db_role = 'pemilik';
}


$stmt = $koneksi->prepare("INSERT INTO users (nama_lengkap, username, email, no_hp, password, role) VALUES (?, ?, ?, ?, ?, ?)");

$username = $email; 
$stmt->bind_param("ssssss", $nama_lengkap, $username, $email, $no_hp, $hashed_password, $db_role);

if ($stmt->execute()) {

    $id_user_baru = $koneksi->insert_id;
    

    if ($form_role == 'user' || $form_role == 'both') {

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