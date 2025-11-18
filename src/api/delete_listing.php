<?php
// api/delete_listing.php

session_start();
header('Content-Type: application/json');

// 1. Cek Autentikasi dan Method
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'pemilik') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Akses ditolak. Silakan login sebagai Host.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak diizinkan.']);
    exit;
}

include 'db_connect.php'; 
$id_user_host = $_SESSION['user_id'];

// Ambil ID Listing dari body request (JSON)
$data = json_decode(file_get_contents("php://input"), true);
$id_properti = $data['id_properti'] ?? null;

if (!$id_properti) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID Properti tidak ditemukan.']);
    exit;
}

$koneksi->begin_transaction();
$success = true;

try {
    // 1. Cek kepemilikan
    $check_sql = "SELECT id_properti FROM properti WHERE id_properti = ? AND id_user = ?";
    $check_stmt = $koneksi->prepare($check_sql);
    $check_stmt->bind_param("ii", $id_properti, $id_user_host);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows === 0) {
        throw new Exception("Akses ditolak atau properti tidak ditemukan.", 403);
    }
    $check_stmt->close();


    // 2. Hapus data dari tabel terkait yang memiliki FK ke properti
    // Contoh: hapus kamar yang terkait dengan properti ini.
    $sqls = [
        "DELETE FROM kamar WHERE id_properti = ?",
        "DELETE FROM foto_properti WHERE id_properti = ?",
        // Tambahkan tabel lain jika ada (misal: fasilitas, ulasan, dll.)
    ];

    foreach ($sqls as $sql) {
        $stmt = $koneksi->prepare($sql);
        $stmt->bind_param("i", $id_properti);
        if (!$stmt->execute()) {
            throw new Exception("Gagal menghapus data terkait.", 500);
        }
        $stmt->close();
    }
    
    // 3. Hapus Properti utama
    $sql_properti = "DELETE FROM properti WHERE id_properti = ?";
    $stmt_properti = $koneksi->prepare($sql_properti);
    $stmt_properti->bind_param("i", $id_properti);
    if (!$stmt_properti->execute()) {
         throw new Exception("Gagal menghapus properti utama.", 500);
    }
    $stmt_properti->close();

    // Commit transaksi jika semua berhasil
    $koneksi->commit();
    echo json_encode(['status' => 'success', 'message' => 'Listing berhasil dihapus.']);

} catch (Exception $e) {
    // Rollback jika ada yang gagal
    $koneksi->rollback();
    http_response_code($e->getCode() === 403 ? 403 : 500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage() . ' ' . $koneksi->error]);
}

$koneksi->close();
?>