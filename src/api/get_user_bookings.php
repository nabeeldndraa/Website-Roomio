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

$id_user = $_SESSION['user_id'];

try {
    // Get id_penyewa from user
    $sql_penyewa = "SELECT id_penyewa FROM penyewa WHERE id_user = ?";
    $stmt_penyewa = $koneksi->prepare($sql_penyewa);
    $stmt_penyewa->bind_param("i", $id_user);
    $stmt_penyewa->execute();
    $result_penyewa = $stmt_penyewa->get_result();
    
    if ($result_penyewa->num_rows === 0) {
        // No bookings if no penyewa record
        echo json_encode([
            'status' => 'success',
            'data' => []
        ]);
        exit;
    }
    
    $penyewa = $result_penyewa->fetch_assoc();
    $id_penyewa = $penyewa['id_penyewa'];
    
    $sql = "SELECT 
                s.id_sewa,
                s.tgl_mulai,
                s.tgl_selesai,
                s.status_sewa,
                p.id_properti,
                p.nama_properti,
                p.tipe_properti,
                p.tipe_kos,
                p.alamat,
                p.kecamatan,
                k.harga,
                k.deposit,
                pb.jumlah_bayar,
                pb.status_bayar,
                pb.metode_bayar,
                f.url_foto
            FROM sewa s
            JOIN kamar k ON s.id_kamar = k.id_kamar
            JOIN properti p ON k.id_properti = p.id_properti
            LEFT JOIN pembayaran pb ON s.id_sewa = pb.id_sewa
            LEFT JOIN (
                SELECT id_properti, MIN(url_foto) as url_foto 
                FROM foto_properti 
                GROUP BY id_properti
            ) f ON p.id_properti = f.id_properti
            WHERE s.id_penyewa = ?
            ORDER BY s.tgl_mulai DESC";
    
    $stmt = $koneksi->prepare($sql);
    $stmt->bind_param("i", $id_penyewa);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        // Calculate duration in months
        $date1 = new DateTime($row['tgl_mulai']);
        $date2 = new DateTime($row['tgl_selesai']);
        $interval = $date1->diff($date2);
        $durasi_bulan = $interval->m + ($interval->y * 12);
        
        // Format type
        $type_display = $row['tipe_properti'];
        if ($row['tipe_properti'] === 'Kos' && $row['tipe_kos']) {
            $type_display = 'Kos ' . $row['tipe_kos'];
        }
        
        $bookings[] = [
            'id' => $row['id_sewa'],
            'id_properti' => $row['id_properti'],
            'title' => $row['nama_properti'],
            'type' => $type_display,
            'location' => $row['kecamatan'] . ', Jember',
            'address' => $row['alamat'],
            'price' => (int)$row['harga'],
            'deposit' => (int)$row['deposit'],
            'total_harga' => (float)($row['jumlah_bayar'] ?? 0),
            'checkIn' => $row['tgl_mulai'],
            'checkOut' => $row['tgl_selesai'],
            'duration' => $durasi_bulan,
            'status' => $row['status_sewa'],
            'status_bayar' => $row['status_bayar'] ?? 'pending',
            'metode_bayar' => $row['metode_bayar'] ?? 'transfer',
            'image' => $row['url_foto'] ?? 'assets/placeholder.jpg'
        ];
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $bookings
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$koneksi->close();
?>