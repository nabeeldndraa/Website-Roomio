<?php
// api/update_listing.php

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

// Ambil data dari POST menggunakan isset() untuk kompatibilitas yang lebih luas
$id_properti = isset($_POST['id_properti']) ? $_POST['id_properti'] : null;
$id_kamar = isset($_POST['id_kamar']) ? $_POST['id_kamar'] : null; 

$nama_properti = isset($_POST['nama_properti']) ? $_POST['nama_properti'] : '';
$deskripsi = isset($_POST['deskripsi']) ? $_POST['deskripsi'] : '';
$tipe_properti = isset($_POST['tipe_properti']) ? $_POST['tipe_properti'] : '';
$tipe_kos = isset($_POST['tipe_kos']) ? $_POST['tipe_kos'] : null;
$alamat = isset($_POST['alamat']) ? $_POST['alamat'] : '';
$kota = isset($_POST['kota']) ? $_POST['kota'] : '';

$nama_kamar = isset($_POST['nama_kamar']) ? $_POST['nama_kamar'] : '';
$harga = (float)(isset($_POST['harga']) ? $_POST['harga'] : 0);
$satuan_harga = isset($_POST['satuan_harga']) ? $_POST['satuan_harga'] : 'bulan';
$deposit = (float)(isset($_POST['deposit']) ? $_POST['deposit'] : 0);
$jumlah_kamar = (int)(isset($_POST['jumlah_kamar']) ? $_POST['jumlah_kamar'] : 0);
$kamar_tersedia = (int)(isset($_POST['kamar_tersedia']) ? $_POST['kamar_tersedia'] : 0);
$room_size = isset($_POST['room_size']) ? $_POST['room_size'] : '';

// Perubahan pada Fasilitas:
// Cek jika fasilitas_kamar dikirim sebagai array (saat mode edit, fasilitas bisa kosong)
$fasilitas_kamar_raw = isset($_POST['fasilitas_kamar']) ? $_POST['fasilitas_kamar'] : [];
$fasilitas_kamar = is_array($fasilitas_kamar_raw) ? implode(', ', $fasilitas_kamar_raw) : $fasilitas_kamar_raw;


if (!$id_properti || !$id_kamar) {
// ... kode selanjutnya (biarkan sama)
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID Properti atau ID Kamar tidak ditemukan.']);
    exit;
}

$koneksi->begin_transaction();
$success = true;

try {
    // 1. UPDATE TABEL properti
    $sql_properti = "
        UPDATE properti SET
            nama_properti = ?,
            deskripsi = ?,
            tipe_properti = ?,
            tipe_kos = ?,
            alamat = ?,
            kota = ?
        WHERE id_properti = ? AND id_user = ?
    ";
    $stmt_properti = $koneksi->prepare($sql_properti);
    $stmt_properti->bind_param("ssssssii", 
        $nama_properti, $deskripsi, $tipe_properti, $tipe_kos, $alamat, $kota, 
        $id_properti, $id_user_host
    );
    if (!$stmt_properti->execute()) {
        throw new Exception("Gagal mengupdate properti: " . $stmt_properti->error, 500);
    }
    $stmt_properti->close();

    // 2. UPDATE TABEL kamar
    $sql_kamar = "
        UPDATE kamar SET
            nama_kamar = ?,
            harga = ?,
            satuan_harga = ?,
            deposit = ?,
            jumlah_kamar = ?,
            kamar_tersedia = ?,
            room_size = ?,
            fasilitas_kamar = ?
        WHERE id_kamar = ?
    ";
    $stmt_kamar = $koneksi->prepare($sql_kamar);
    $stmt_kamar->bind_param("sdsdiisi", 
        $nama_kamar, $harga, $satuan_harga, $deposit, $jumlah_kamar, $kamar_tersedia, $room_size, $fasilitas_kamar,
        $id_kamar
    );
    if (!$stmt_kamar->execute()) {
        throw new Exception("Gagal mengupdate kamar: " . $stmt_kamar->error, 500);
    }

    // code images kamar
    $stmt_kamar->close();
    if (isset($_FILES['images'])) {
    }
    
    // Commit transaksi jika semua berhasil
    $koneksi->commit();
    echo json_encode(['status' => 'success', 'message' => 'Listing berhasil diperbarui!']);

} catch (Exception $e) {
    // Rollback jika ada yang gagal
    $koneksi->rollback();
    http_response_code($e->getCode() === 403 ? 403 : 500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

$koneksi->close();
?>