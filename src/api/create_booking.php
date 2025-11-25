<?php
session_start();

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'User belum login']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

$id_user = $_SESSION['user_id'];
$id_properti = $data['id_properti'] ?? null;
$tanggal_masuk = $data['tanggal_masuk'] ?? null;
$durasi_bulan = $data['durasi_bulan'] ?? null;
$total_harga = $data['total_harga'] ?? null;

// Validation
if (!$id_properti || !$tanggal_masuk || !$durasi_bulan || !$total_harga) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap']);
    exit;
}

try {
    // Check if property exists and get kamar info
    $sql_check = "SELECT k.id_kamar, k.kamar_tersedia, k.harga, k.deposit, p.nama_properti 
                  FROM kamar k 
                  JOIN properti p ON k.id_properti = p.id_properti 
                  WHERE p.id_properti = ?
                  LIMIT 1";
    $stmt_check = $koneksi->prepare($sql_check);
    $stmt_check->bind_param("i", $id_properti);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();
    
    if ($result_check->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Properti tidak ditemukan']);
        exit;
    }
    
    $kamar = $result_check->fetch_assoc();
    $id_kamar = $kamar['id_kamar'];
    
    if ($kamar['kamar_tersedia'] < 1) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Kamar tidak tersedia']);
        exit;
    }
    
    // Calculate end date
    $tanggal_keluar = date('Y-m-d', strtotime($tanggal_masuk . " + {$durasi_bulan} months"));
    
    // Check if penyewa record exists, if not create one
    $sql_check_penyewa = "SELECT id_penyewa FROM penyewa WHERE id_user = ?";
    $stmt_check_penyewa = $koneksi->prepare($sql_check_penyewa);
    $stmt_check_penyewa->bind_param("i", $id_user);
    $stmt_check_penyewa->execute();
    $result_penyewa = $stmt_check_penyewa->get_result();
    
    if ($result_penyewa->num_rows === 0) {
        // Create penyewa record if doesn't exist
        $sql_insert_penyewa = "INSERT INTO penyewa (id_user, status) VALUES (?, 'Umum')";
        $stmt_insert_penyewa = $koneksi->prepare($sql_insert_penyewa);
        $stmt_insert_penyewa->bind_param("i", $id_user);
        $stmt_insert_penyewa->execute();
        $id_penyewa = $koneksi->insert_id;
    } else {
        $penyewa = $result_penyewa->fetch_assoc();
        $id_penyewa = $penyewa['id_penyewa'];
    }
    
    // Insert booking into sewa table
    // Sesuaikan dengan struktur tabel sewa Anda
    $sql_insert = "INSERT INTO sewa (id_penyewa, id_kamar, tgl_mulai, tgl_selesai, status_sewa) 
                   VALUES (?, ?, ?, ?, 'pending')";
    $stmt_insert = $koneksi->prepare($sql_insert);
    $stmt_insert->bind_param("iiss", $id_penyewa, $id_kamar, $tanggal_masuk, $tanggal_keluar);
    
    if ($stmt_insert->execute()) {
        $id_sewa = $koneksi->insert_id;
        
        // Insert payment record
        $sql_payment = "INSERT INTO pembayaran (id_sewa, jumlah_bayar, metode_bayar, status_bayar, tgl_bayar) 
                        VALUES (?, ?, 'transfer', 'pending', NOW())";
        $stmt_payment = $koneksi->prepare($sql_payment);
        $stmt_payment->bind_param("id", $id_sewa, $total_harga);
        $stmt_payment->execute();
        
        // Update available rooms (decrease by 1)
        $sql_update = "UPDATE kamar SET kamar_tersedia = kamar_tersedia - 1 
                       WHERE id_kamar = ? AND kamar_tersedia > 0";
        $stmt_update = $koneksi->prepare($sql_update);
        $stmt_update->bind_param("i", $id_kamar);
        $stmt_update->execute();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Booking berhasil dibuat',
            'data' => [
                'id_sewa' => $id_sewa,
                'tanggal_masuk' => $tanggal_masuk,
                'tanggal_keluar' => $tanggal_keluar,
                'durasi_bulan' => $durasi_bulan,
                'total_harga' => $total_harga
            ]
        ]);
    } else {
        throw new Exception('Gagal membuat booking: ' . $stmt_insert->error);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$koneksi->close();
?>