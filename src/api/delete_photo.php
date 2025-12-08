<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
session_start();

require_once 'db_connect.php';

try {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('Unauthorized');
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $photoUrl = $data['photo_url'] ?? '';
    $idProperti = $data['id_properti'] ?? 0;
    
    if (empty($photoUrl) || empty($idProperti)) {
        throw new Exception('Data tidak lengkap');
    }
    
    // Verifikasi kepemilikan properti
    $sql = "SELECT id_user FROM properti WHERE id_properti = ?";
    $stmt = $koneksi->prepare($sql);
    $stmt->bind_param('i', $idProperti);
    $stmt->execute();
    $result = $stmt->get_result();
    $properti = $result->fetch_assoc();
    
    if (!$properti || $properti['id_user'] != $_SESSION['user_id']) {
        throw new Exception('Unauthorized');
    }
    
    // Hapus dari database
    $sql = "DELETE FROM foto_properti WHERE id_properti = ? AND url_foto = ?";
    $stmt = $koneksi->prepare($sql);
    $stmt->bind_param('is', $idProperti, $photoUrl);
    
    if ($stmt->execute()) {
        // Hapus file fisik jika ada
        if (strpos($photoUrl, 'uploads/') !== false) {
            $filePath = '../../' . $photoUrl;
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }
        
        echo json_encode(['status' => 'success', 'message' => 'Foto berhasil dihapus']);
    } else {
        throw new Exception('Gagal menghapus foto dari database');
    }
    
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

$koneksi->close();
?>