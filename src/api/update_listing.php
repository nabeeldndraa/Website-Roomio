<?php
// api/update_listing.php
header('Content-Type: application/json');
require_once 'db_connect.php';
session_start();

if (!isset($_SESSION['id_user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

if (!isset($_POST['id_properti'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID properti tidak ditemukan']);
    exit;
}

$id_properti = $_POST['id_properti'];
$id_kamar = $_POST['id_kamar'] ?? null;
$id_user = $_SESSION['id_user'];

// Validasi kepemilikan
$check_sql = "SELECT id_user FROM properti WHERE id_properti = ?";
$check_stmt = $koneksi->prepare($check_sql);
$check_stmt->bind_param("i", $id_properti);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Properti tidak ditemukan']);
    exit;
}

$owner = $check_result->fetch_assoc();
if ($owner['id_user'] != $id_user) {
    echo json_encode(['status' => 'error', 'message' => 'Anda tidak memiliki akses untuk mengedit properti ini']);
    exit;
}

try {
    $koneksi->begin_transaction();
    
    // Update data properti
    $nama_properti = $_POST['nama_properti'];
    $tipe_properti = $_POST['tipe_properti'];
    $alamat = $_POST['alamat'];
    $kota = $_POST['kota'];
    $deskripsi = $_POST['deskripsi'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    $rules = $_POST['rules'] ?? '';
    
    $update_properti = "UPDATE properti SET 
                        nama_properti = ?,
                        tipe_properti = ?,
                        alamat = ?,
                        kecamatan = ?,
                        deskripsi = ?,
                        latitude = ?,
                        longitude = ?,
                        rules = ?
                        WHERE id_properti = ?";
    
    $stmt = $koneksi->prepare($update_properti);
    $stmt->bind_param("sssssddsi", 
        $nama_properti, 
        $tipe_properti, 
        $alamat, 
        $kota, 
        $deskripsi, 
        $latitude, 
        $longitude, 
        $rules,
        $id_properti
    );
    $stmt->execute();
    
    // Update data kamar
    if ($id_kamar) {
        $harga = $_POST['harga'];
        $deposit = $_POST['deposit'];
        $jumlah_kamar = $_POST['jumlah_kamar'];
        $kamar_tersedia = $_POST['kamar_tersedia'];
        $room_size = $_POST['room_size'] ?? '';
        $fasilitas_kamar = isset($_POST['fasilitas_kamar']) ? implode(', ', $_POST['fasilitas_kamar']) : '';
        
        $update_kamar = "UPDATE kamar SET 
                        harga = ?,
                        deposit = ?,
                        jumlah_kamar = ?,
                        kamar_tersedia = ?,
                        room_size = ?,
                        fasilitas_kamar = ?
                        WHERE id_kamar = ?";
        
        $stmt_kamar = $koneksi->prepare($update_kamar);
        $stmt_kamar->bind_param("dddiisi", 
            $harga, 
            $deposit, 
            $jumlah_kamar, 
            $kamar_tersedia, 
            $room_size, 
            $fasilitas_kamar,
            $id_kamar
        );
        $stmt_kamar->execute();
    }
    
    // Handle upload foto baru
    if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
        $upload_dir = '../uploads/';
        
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        foreach ($_FILES['images']['name'] as $key => $filename) {
            if ($_FILES['images']['error'][$key] === UPLOAD_ERR_OK) {
                $tmp_name = $_FILES['images']['tmp_name'][$key];
                $file_extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                $new_filename = uniqid() . '_' . time() . '.' . $file_extension;
                $destination = $upload_dir . $new_filename;
                
                if (move_uploaded_file($tmp_name, $destination)) {
                    $url_foto = 'uploads/' . $new_filename;
                    
                    $insert_foto = "INSERT INTO foto_properti (id_properti, url_foto) VALUES (?, ?)";
                    $stmt_foto = $koneksi->prepare($insert_foto);
                    $stmt_foto->bind_param("is", $id_properti, $url_foto);
                    $stmt_foto->execute();
                }
            }
        }
    }
    
    $koneksi->commit();
    echo json_encode(['status' => 'success', 'message' => 'Listing berhasil diupdate!']);
    
} catch (Exception $e) {
    $koneksi->rollback();
    echo json_encode(['status' => 'error', 'message' => 'Gagal update listing: ' . $e->getMessage()]);
}

$koneksi->close();
?>