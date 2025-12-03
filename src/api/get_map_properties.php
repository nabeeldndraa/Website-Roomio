<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'db_connect.php';

try {
    // Query untuk mendapatkan semua properti dengan koordinat
    $sql = "SELECT 
                p.id_properti,
                p.nama_properti,
                p.tipe_properti,
                p.tipe_kos,
                p.alamat,
                p.kecamatan,
                p.latitude,
                p.longitude,
                k.harga,
                k.kamar_tersedia,
                f.url_foto
            FROM properti p
            LEFT JOIN kamar k ON p.id_properti = k.id_properti
            LEFT JOIN foto_properti f ON p.id_properti = f.id_properti
            WHERE p.latitude IS NOT NULL 
            AND p.longitude IS NOT NULL
            AND k.status = 'tersedia'
            GROUP BY p.id_properti";
    
    $result = $koneksi->query($sql);
    
    $properties = [];
    
    while ($row = $result->fetch_assoc()) {
        // Tentukan tipe display
        $typeDisplay = $row['tipe_properti'];
        if ($row['tipe_properti'] === 'Kos' && !empty($row['tipe_kos'])) {
            $typeDisplay = 'Kos ' . $row['tipe_kos'];
        }
        
        // Format harga
        $price = number_format($row['harga'], 0, ',', '.');
        
        $properties[] = [
            'id' => $row['id_properti'],
            'nama' => $row['nama_properti'],
            'type' => $typeDisplay,
            'alamat' => $row['alamat'],
            'kecamatan' => $row['kecamatan'],
            'latitude' => (float)$row['latitude'],
            'longitude' => (float)$row['longitude'],
            'harga' => $row['harga'],
            'harga_format' => 'Rp ' . $price,
            'kamar_tersedia' => (int)$row['kamar_tersedia'],
            'foto' => $row['url_foto'] ?? 'assets/placeholder.jpg'
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $properties,
        'count' => count($properties)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}

$koneksi->close();
?>