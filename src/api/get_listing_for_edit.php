<?php
// api/get_listing_for_edit.php

// Matikan semua error output
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

// Start output buffering
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db_connect.php';
session_start();

// Log function untuk debugging
function debugLog($message) {
    $logFile = __DIR__ . '/debug_edit.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

try {
    debugLog("=== NEW REQUEST ===");
    
    // Validasi ID properti
    if (!isset($_GET['id'])) {
        throw new Exception('ID tidak ditemukan');
    }

    $id_properti = intval($_GET['id']);
    debugLog("ID Properti: $id_properti");
    
    // Ambil user ID dari GET atau SESSION
    $id_user = null;
    
    if (isset($_GET['id_user'])) {
        $id_user = intval($_GET['id_user']);
        debugLog("ID User dari GET: $id_user");
    } else if (isset($_SESSION['id_user'])) {
        $id_user = intval($_SESSION['id_user']);
        debugLog("ID User dari SESSION: $id_user");
    }

    if (!$id_user) {
        debugLog("ERROR: User tidak terautentikasi");
        throw new Exception('User tidak terautentikasi. Silakan login kembali.');
    }

    // Cek koneksi database (variabel $koneksi dari db_connect.php)
    if (!isset($koneksi) || !$koneksi) {
        debugLog("ERROR: Database connection not found");
        throw new Exception('Koneksi database gagal');
    }

    // Query data properti dan kamar
    $sql = "SELECT 
                p.id_properti,
                p.id_user,
                p.nama_properti,
                p.tipe_properti,
                p.alamat,
                p.kecamatan,
                p.latitude,
                p.longitude,
                p.deskripsi,
                p.rules,
                k.id_kamar,
                k.nama_kamar,
                k.harga,
                k.deposit,
                k.jumlah_kamar,
                k.kamar_tersedia,
                k.room_size,
                k.fasilitas_kamar,
                k.status
            FROM properti p
            LEFT JOIN kamar k ON p.id_properti = k.id_properti
            WHERE p.id_properti = ?
            LIMIT 1";
    
    $stmt = $koneksi->prepare($sql);
    
    if (!$stmt) {
        debugLog("ERROR: Prepare failed - " . $koneksi->error);
        throw new Exception("Database error: " . $koneksi->error);
    }
    
    $stmt->bind_param("i", $id_properti);
    
    if (!$stmt->execute()) {
        debugLog("ERROR: Execute failed - " . $stmt->error);
        throw new Exception("Query error: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        debugLog("ERROR: Properti tidak ditemukan - ID: $id_properti");
        http_response_code(404);
        ob_clean();
        echo json_encode([
            'status' => 'error', 
            'message' => 'Listing tidak ditemukan. Mungkin sudah dihapus.'
        ]);
        exit;
    }
    
    $data = $result->fetch_assoc();
    debugLog("Data ditemukan - Owner ID: {$data['id_user']}, Request dari: $id_user");
    
    // Validasi kepemilikan
    if (intval($data['id_user']) !== intval($id_user)) {
        debugLog("ERROR: Akses ditolak - Owner: {$data['id_user']}, User: $id_user");
        http_response_code(403);
        ob_clean();
        echo json_encode([
            'status' => 'error',
            'message' => 'Anda tidak memiliki akses untuk mengedit properti ini.'
        ]);
        exit;
    }
    
    $stmt->close();
    
    // Query foto-foto
    $fotos = [];
    $sql_foto = "SELECT url_foto FROM foto_properti WHERE id_properti = ? ORDER BY id_foto ASC";
    $stmt_foto = $koneksi->prepare($sql_foto);
    
    if ($stmt_foto) {
        $stmt_foto->bind_param("i", $id_properti);
        if ($stmt_foto->execute()) {
            $result_foto = $stmt_foto->get_result();
            
            while ($row = $result_foto->fetch_assoc()) {
                $fotos[] = $row['url_foto'];
            }
            
            $stmt_foto->close();
        }
    }
    
    $data['fotos'] = $fotos;
    debugLog("Data berhasil dimuat - Total foto: " . count($fotos));
    
    // Hapus id_user dari response
    unset($data['id_user']);
    
    // Output JSON
    http_response_code(200);
    ob_clean();
    
    echo json_encode([
        'status' => 'success', 
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    debugLog("EXCEPTION: " . $e->getMessage());
    
    http_response_code(500);
    ob_clean();
    
    echo json_encode([
        'status' => 'error', 
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

if (isset($koneksi)) {
    $koneksi->close();
}

ob_end_flush();
?>