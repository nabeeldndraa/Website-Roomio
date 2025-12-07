<?php
// api/approve_booking.php
header('Content-Type: application/json');
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$id_user = $_SESSION['user_id'];
$input = json_decode(file_get_contents('php://input'), true);
$id_sewa = $input['id_sewa'] ?? null;

if (!$id_sewa) {
    echo json_encode(['status' => 'error', 'message' => 'ID sewa required']);
    exit;
}

try {
    // Verify ownership dan cek status - FIXED
    $check = $koneksi->prepare("
        SELECT s.id_sewa, s.id_kamar, s.status_sewa, k.id_properti
        FROM sewa s
        JOIN kamar k ON s.id_kamar = k.id_kamar
        JOIN properti p ON k.id_properti = p.id_properti
        WHERE s.id_sewa = ? AND p.id_user = ?
    ");
    $check->bind_param("ii", $id_sewa, $id_user);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Booking not found']);
        exit;
    }
    
    $booking = $result->fetch_assoc();
    
    // Cek apakah status masih pending
    if ($booking['status_sewa'] !== 'pending') {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Booking sudah ' . $booking['status_sewa'] . ', tidak bisa disetujui lagi'
        ]);
        exit;
    }
    
    // Start transaction
    $koneksi->begin_transaction();
    
    // Update booking status to aktif
    $update = $koneksi->prepare("UPDATE sewa SET status_sewa = 'aktif' WHERE id_sewa = ?");
    $update->bind_param("i", $id_sewa);
    $update->execute();
    
    // Reduce available rooms
    $updateRoom = $koneksi->prepare("
        UPDATE kamar 
        SET kamar_tersedia = GREATEST(kamar_tersedia - 1, 0)
        WHERE id_kamar = ?
    ");
    $updateRoom->bind_param("i", $booking['id_kamar']);
    $updateRoom->execute();
    
    // Update payment status to lunas (if exists)
    $updatePayment = $koneksi->prepare("
        UPDATE pembayaran 
        SET status_bayar = 'lunas' 
        WHERE id_sewa = ?
    ");
    $updatePayment->bind_param("i", $id_sewa);
    $updatePayment->execute();
    
    $koneksi->commit();
    
    echo json_encode(['status' => 'success', 'message' => 'Booking berhasil disetujui']);
    
} catch (Exception $e) {
    if (isset($koneksi)) {
        $koneksi->rollback();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

if (isset($koneksi)) {
    $koneksi->close();
}
?>