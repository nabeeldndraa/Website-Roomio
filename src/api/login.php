<?php

session_start(); 

header('Content-Type: application/json');

include 'db_connect.php';

$data = json_decode(file_get_contents('php:

if (empty($data['email']) || empty($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Email dan password wajib diisi.']);
    exit;
}

$email = $data['email'];
$password = $data['password'];


$stmt = $koneksi->prepare("SELECT id_user, nama_lengkap, password, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {

    echo json_encode(['status' => 'error', 'message' => 'Email atau password salah.']);
} else {

    $user = $result->fetch_assoc();
    
    if (password_verify($password, $user['password'])) {

        

        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id_user'];
        $_SESSION['user_nama'] = $user['nama_lengkap'];
        $_SESSION['user_role'] = $user['role'];
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Login berhasil!',
            'user' => [
                'name' => $user['nama_lengkap'],
                'role' => $user['role']
            ]
        ]);
        
    } else {

        echo json_encode(['status' => 'error', 'message' => 'Email atau password salah.']);
    }
}

$stmt->close();
$koneksi->close();
?>