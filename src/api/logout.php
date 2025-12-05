<?php
// api/logout.php
session_start();
header('Content-Type: application/json');

// Hapus semua session
session_unset();
session_destroy();

echo json_encode([
    'status' => 'success',
    'message' => 'Logout berhasil'
]);
?>