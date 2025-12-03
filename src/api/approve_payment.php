<?php
session_start();
require_once 'db_connect.php';

// Cek role pemilik
if ($_SESSION['role'] !== 'pemilik') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Akses ditolak"]);
    exit;
}

$id_bayar = $_POST['id_bayar'];
$id_sewa = $_POST['id_sewa'];

// Update pembayaran ke lunas
$conn->query("UPDATE pembayaran SET status_bayar = 'lunas' WHERE id_bayar = $id_bayar");

// Update status sewa ke aktif
$conn->query("UPDATE sewa SET status_sewa = 'aktif' WHERE id_sewa = $id_sewa");

echo json_encode(["status" => "success", "message" => "Pembayaran disetujui"]);
?>
