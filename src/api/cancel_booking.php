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
$id_sewa = $data['id_sewa'] ?? null;
$id_user = $_SESSION['user_id'];

if (!$id_sewa) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID sewa tidak ditemukan']);
    exit;
}

try {
    // Get id_penyewa for current user
    $sql_penyewa = "SELECT id_penyewa FROM penyewa WHERE id_user = ?";
    $stmt_penyewa = $koneksi->prepare($sql_penyewa);
    $stmt_penyewa->bind_param("i", $id_user);
    $stmt_penyewa->execute();
    $result_penyewa = $stmt_penyewa->get_result();
    
    if ($result_penyewa->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Data penyewa tidak ditemukan']);
        exit;
    }
    
    $penyewa = $result_penyewa->fetch_assoc();
    $id_penyewa = $penyewa['id_penyewa'];
    
    // Check if booking belongs to user and get payment status
    $sql_check = "SELECT s.id_sewa, s.id_kamar, s.status_sewa, p.status_bayar, p.id_bayar
                  FROM sewa s 
                  LEFT JOIN pembayaran p ON s.id_sewa = p.id_sewa
                  WHERE s.id_sewa = ? AND s.id_penyewa = ?";
    $stmt_check = $koneksi->prepare($sql_check);
    $stmt_check->bind_param("ii", $id_sewa, $id_penyewa);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();
    
    if ($result_check->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Booking tidak ditemukan atau bukan milik Anda']);
        exit;
    }
    
    $booking = $result_check->fetch_assoc();
    
    // Log current status for debugging
    error_log("Booking ID: $id_sewa, Status sewa: " . $booking['status_sewa'] . ", Payment status: " . ($booking['status_bayar'] ?? 'null'));
    
    // Check if already cancelled
    if ($booking['status_sewa'] === 'dibatalkan') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Booking sudah dibatalkan sebelumnya']);
        exit;
    }
    
    // Check if already completed
    if ($booking['status_sewa'] === 'selesai') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Booking sudah selesai, tidak dapat dibatalkan']);
        exit;
    }
    
    // Check if payment is already completed (lunas)
    if ($booking['status_bayar'] === 'lunas') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Booking tidak dapat dibatalkan karena pembayaran sudah lunas. Silakan hubungi pemilik kos.']);
        exit;
    }
    
    // Allow cancellation for any status except 'dibatalkan', 'selesai', and if payment is 'lunas'
    // This includes: 'pending', 'aktif', 'terisi', etc. as long as payment is not 'lunas'
    
    // Begin transaction
    $koneksi->begin_transaction();
    
    try {
        // Update booking status to cancelled
        $sql_update = "UPDATE sewa SET status_sewa = 'dibatalkan' WHERE id_sewa = ?";
        $stmt_update = $koneksi->prepare($sql_update);
        $stmt_update->bind_param("i", $id_sewa);
        
        if (!$stmt_update->execute()) {
            throw new Exception('Gagal mengupdate status booking');
        }
        
        // Update payment status to failed if exists
        if ($booking['id_bayar']) {
            $sql_payment = "UPDATE pembayaran SET status_bayar = 'gagal' WHERE id_sewa = ?";
            $stmt_payment = $koneksi->prepare($sql_payment);
            $stmt_payment->bind_param("i", $id_sewa);
            
            if (!$stmt_payment->execute()) {
                throw new Exception('Gagal mengupdate status pembayaran');
            }
            
            error_log("Payment status updated to 'gagal' for id_bayar: " . $booking['id_bayar']);
        }
        
        // Restore available rooms (increase by 1)
        $sql_restore = "UPDATE kamar SET kamar_tersedia = kamar_tersedia + 1 
                        WHERE id_kamar = ?";
        $stmt_restore = $koneksi->prepare($sql_restore);
        $stmt_restore->bind_param("i", $booking['id_kamar']);
        
        if (!$stmt_restore->execute()) {
            throw new Exception('Gagal mengembalikan ketersediaan kamar');
        }
        
        error_log("Room availability restored for id_kamar: " . $booking['id_kamar']);
        
        // Commit transaction
        $koneksi->commit();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Booking berhasil dibatalkan dan ketersediaan kamar telah dikembalikan'
        ]);
        
    } catch (Exception $e) {
        // Rollback on error
        $koneksi->rollback();
        error_log("Transaction rollback: " . $e->getMessage());
        throw $e;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    error_log("Error in cancel_booking.php: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}

$koneksi->close();
?>