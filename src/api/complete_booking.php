<?php
// api/complete_booking.php
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
    // Verify ownership - FIXED query sesuai struktur database
    $check = $koneksi->prepare("
        SELECT s.id_sewa, s.id_kamar
        FROM sewa s
        JOIN kamar k ON s.id_kamar = k.id_kamar
        JOIN properti p ON k.id_properti = p.id_properti
        WHERE s.id_sewa = ? AND p.id_user = ? AND s.status_sewa = 'aktif'
    ");
    $check->bind_param("ii", $id_sewa, $id_user);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Booking not found or not active']);
        exit;
    }
    
    $booking = $result->fetch_assoc();
    
    // Start transaction
    $koneksi->begin_transaction();
    
    // Update booking status
    $update = $koneksi->prepare("UPDATE sewa SET status_sewa = 'selesai' WHERE id_sewa = ?");
    $update->bind_param("i", $id_sewa);
    $update->execute();
    
    // Return available room
    $updateRoom = $koneksi->prepare("
        UPDATE kamar 
        SET kamar_tersedia = kamar_tersedia + 1 
        WHERE id_kamar = ?
    ");
    $updateRoom->bind_param("i", $booking['id_kamar']);
    $updateRoom->execute();
    
    $koneksi->commit();
    
    echo json_encode(['status' => 'success', 'message' => 'Booking completed']);
    
} catch (Exception $e) {
    $koneksi->rollback();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

$koneksi->close();
?>