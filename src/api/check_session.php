<?php
// api/check_session.php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

// Cek apakah user sudah login
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'status' => 'success',
        'logged_in' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_nama'],
            'role' => $_SESSION['user_role']
        ]
    ]);
} else {
    echo json_encode([
        'status' => 'success',
        'logged_in' => false
    ]);
}
?>