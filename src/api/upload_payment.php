<?php
session_start();
require_once 'db_connect.php';

// Cek login penyewa
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "User belum login"]);
    exit;
}

$id_sewa = $_POST['id_sewa'];
$jumlah_bayar = $_POST['jumlah_bayar'];
$metode_bayar = $_POST['metode_bayar'];

if (empty($_FILES['bukti_bayar']['name'])) {
    echo json_encode(["status" => "error", "message" => "Silakan upload bukti transfer"]);
    exit;
}

// Upload bukti
$target_dir = "../uploads/";
$filename = time() . "_" . basename($_FILES["bukti_bayar"]["name"]);
$target_file = $target_dir . $filename;

if (!move_uploaded_file($_FILES["bukti_bayar"]["tmp_name"], $target_file)) {
    echo json_encode(["status" => "error", "message" => "Gagal upload file"]);
    exit;
}

// Insert pembayaran
$sql = "INSERT INTO pembayaran (id_sewa, jumlah_bayar, metode_bayar, tgl_bayar, bukti_bayar, status_bayar) 
        VALUES (?, ?, ?, NOW(), ?, 'pending')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("idss", $id_sewa, $jumlah_bayar, $metode_bayar, $filename);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Pembayaran terkirim, menunggu verifikasi pemilik"]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menyimpan data pembayaran"]);
}
?>
