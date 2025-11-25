<?php
// Pastikan semua detail ini benar
$host = "localhost"; 
$user = "root";      
$pass = "";          
$db = "db_roomio";

// Coba koneksi
$koneksi = new mysqli($host, $user, $pass, $db);

// --- CEK JIKA KONEKSI GAGAL ---
if ($koneksi->connect_error) {
    // Skrip akan berhenti dan menampilkan alasan kegagalan
    die("Koneksi Database Gagal: " . $koneksi->connect_error . 
        " | Cek detail di db_connect.php.");
}

// Set karakter set (disarankan)
$koneksi->set_charset("utf8mb4");

?>