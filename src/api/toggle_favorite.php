<?php
// api/toggle_favorite.php
session_start();
header('Content-Type: application/json');
// PENTING: Ganti * dengan domain spesifik di production
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Debug: Log session info (hapus di production)
error_log("Session ID: " . session_id());
error_log("User ID from session: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'NOT SET'));

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

// Ambil data dari request
$data = json_decode(file_get_contents('php://input'), true);
$id_kamar = isset($data['id_kamar']) ? (int)$data['id_kamar'] : 0;
$id_user = (int)$_SESSION['user_id'];

if ($id_kamar == 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'ID kamar tidak valid'
    ]);
    exit;
}

// Cek apakah sudah ada di favorit
$check = $conn->prepare("SELECT id_favorit FROM favorit WHERE id_user = ? AND id_kamar = ?");
$check->bind_param("ii", $id_user, $id_kamar);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    // Sudah ada, hapus dari favorit
    $delete = $conn->prepare("DELETE FROM favorit WHERE id_user = ? AND id_kamar = ?");
    $delete->bind_param("ii", $id_user, $id_kamar);
    
    if ($delete->execute()) {
        echo json_encode([
            'status' => 'success',
            'action' => 'removed',
            'message' => 'Dihapus dari favorit'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal menghapus dari favorit'
        ]);
    }
} else {
    // Belum ada, tambahkan ke favorit
    $insert = $conn->prepare("INSERT INTO favorit (id_user, id_kamar) VALUES (?, ?)");
    $insert->bind_param("ii", $id_user, $id_kamar);
    
    if ($insert->execute()) {
        echo json_encode([
            'status' => 'success',
            'action' => 'added',
            'message' => 'Ditambahkan ke favorit'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal menambahkan ke favorit'
        ]);
    }
}

$conn->close();
?>