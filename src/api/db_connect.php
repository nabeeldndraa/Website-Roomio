<?php
// Konfigurasi Database
$db_host = "localhost";
$db_user = "root";
$db_pass = ""; // Kosongkan jika tidak ada password
$db_name = "db_roomio";

// Buat koneksi
$koneksi = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Cek koneksi
if ($koneksi->connect_error) {
    if (headers_sent()) {
        die("Koneksi database gagal: " . $koneksi->connect_error);
    } else {
        http_response_code(500);
        die(json_encode([
            'status' => 'error',
            'message' => 'Koneksi database gagal: ' . $koneksi->connect_error
        ]));
    }
}

// Set charset ke UTF-8
$koneksi->set_charset("utf8mb4");
?>