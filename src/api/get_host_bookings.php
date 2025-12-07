<?php
// api/get_host_bookings.php
header('Content-Type: application/json');
session_start();

// Include database connection
require_once 'db_connect.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized. Please login.'
    ]);
    exit;
}

$id_user = $_SESSION['user_id'];

try {
    // Get all bookings for properties owned by this user
    $query = "
        SELECT 
            s.id_sewa,
            k.id_properti,
            s.id_penyewa,
            s.tgl_mulai as tanggal_masuk,
            s.tgl_selesai as tanggal_keluar,
            TIMESTAMPDIFF(MONTH, s.tgl_mulai, s.tgl_selesai) as durasi_bulan,
            COALESCE(pb.jumlah_bayar, 0) as total_harga,
            s.status_sewa as status,
            COALESCE(pb.tgl_bayar, s.tgl_mulai) as created_at,
            COALESCE(pb.status_bayar, 'pending') as status_bayar,
            k.nama_kamar as property_title,
            p.alamat as property_address,
            COALESCE(
                (SELECT url_foto FROM foto_properti WHERE id_properti = k.id_properti LIMIT 1),
                'https://via.placeholder.com/300x200?text=No+Image'
            ) as image,
            u.nama_lengkap as user_name,
            u.email as user_email,
            COALESCE(u.no_hp, '-') as user_phone
        FROM sewa s
        JOIN kamar k ON s.id_kamar = k.id_kamar
        JOIN properti p ON k.id_properti = p.id_properti
        LEFT JOIN pembayaran pb ON s.id_sewa = pb.id_sewa
        JOIN users u ON s.id_penyewa = u.id_user
        WHERE p.id_user = ?
        ORDER BY 
            CASE s.status_sewa
                WHEN 'pending' THEN 0
                WHEN 'aktif' THEN 1
                WHEN 'selesai' THEN 2
                WHEN 'dibatalkan' THEN 3
                ELSE 4
            END,
            s.tgl_mulai DESC
    ";
    
    $stmt = $koneksi->prepare($query);
    
    if (!$stmt) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Query preparation failed: ' . $koneksi->error
        ]);
        exit;
    }
    
    $stmt->bind_param("i", $id_user);
    
    if (!$stmt->execute()) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Query execution failed: ' . $stmt->error
        ]);
        exit;
    }
    
    $result = $stmt->get_result();
    
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        // TIDAK mengubah status, kirim status asli dari database
        $bookings[] = [
            'id_sewa' => (int)$row['id_sewa'],
            'id_properti' => (int)$row['id_properti'],
            'id_penyewa' => (int)$row['id_penyewa'],
            'property_title' => $row['property_title'],
            'property_address' => $row['property_address'],
            'image' => $row['image'],
            'user_name' => $row['user_name'],
            'user_email' => $row['user_email'],
            'user_phone' => $row['user_phone'],
            'tanggal_masuk' => $row['tanggal_masuk'],
            'tanggal_keluar' => $row['tanggal_keluar'],
            'durasi_bulan' => (int)$row['durasi_bulan'],
            'total_harga' => (float)$row['total_harga'],
            'status' => $row['status'], // Status asli dari database
            'status_bayar' => $row['status_bayar'],
            'created_at' => $row['created_at']
        ];
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $bookings,
        'total' => count($bookings)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$koneksi->close();
?>