<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database connection
$host = 'localhost';
$dbname = 'db_roomio';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get filter parameters
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $location = $_GET['location'] ?? '';
    $priceMin = isset($_GET['priceMin']) ? (int)$_GET['priceMin'] : 0;
    $priceMax = isset($_GET['priceMax']) ? (int)$_GET['priceMax'] : 999999999;
    
    // Build query - join properti with kamar and foto
    $sql = "SELECT 
                p.id_properti,
                p.nama_properti,
                p.tipe_properti,
                p.tipe_kos,
                p.alamat,
                p.kecamatan,
                p.deskripsi,
                p.latitude,
                p.longitude,
                k.id_kamar,
                k.nama_kamar,
                k.tipe_kamar,
                k.harga,
                k.deposit,
                k.room_size,
                k.satuan_harga,
                k.fasilitas_kamar,
                k.kamar_tersedia,
                k.jumlah_kamar,
                k.total_views,
                (SELECT url_foto FROM foto_properti WHERE id_properti = p.id_properti LIMIT 1) as url_foto
            FROM properti p
            INNER JOIN kamar k ON p.id_properti = k.id_properti
            WHERE k.status = 'tersedia'
            AND k.harga BETWEEN :priceMin AND :priceMax";
    
    // Add search filter
    if (!empty($search)) {
        $sql .= " AND (p.nama_properti LIKE :search 
                  OR p.alamat LIKE :search 
                  OR p.kecamatan LIKE :search)";
    }
    
    // Add category filter
    if (!empty($category)) {
        if ($category === 'kontrakan') {
            $sql .= " AND p.tipe_properti = 'Kontrakan'";
        } else {
            // For kos-putri, kos-putra, kos-campur
            $typeMap = [
                'kos-putri' => 'Putri',
                'kos-putra' => 'Putra',
                'kos-campur' => 'Campur',
                'kos-bebas' => 'Bebas'
            ];
            if (isset($typeMap[$category])) {
                $sql .= " AND p.tipe_kos = :categoryType";
            }
        }
    }
    
    // Add location filter
    if (!empty($location)) {
        $sql .= " AND p.kecamatan LIKE :location";
    }
    
    // Group by to avoid duplicates
    $sql .= " GROUP BY p.id_properti, k.id_kamar ORDER BY k.id_kamar DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':priceMin', $priceMin, PDO::PARAM_INT);
    $stmt->bindParam(':priceMax', $priceMax, PDO::PARAM_INT);
    
    if (!empty($search)) {
        $searchParam = "%$search%";
        $stmt->bindParam(':search', $searchParam);
    }
    
    if (!empty($category) && $category !== 'kontrakan') {
        $typeMap = [
            'kos-putri' => 'Putri',
            'kos-putra' => 'Putra',
            'kos-campur' => 'Campur',
            'kos-bebas' => 'Bebas'
        ];
        if (isset($typeMap[$category])) {
            $stmt->bindParam(':categoryType', $typeMap[$category]);
        }
    }
    
    if (!empty($location)) {
        $locationParam = "%$location%";
        $stmt->bindParam(':location', $locationParam);
    }
    
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format data for frontend
    $listings = [];
    
    foreach ($results as $row) {
        // Determine type display
        $typeDisplay = $row['tipe_properti'];
        if ($row['tipe_properti'] === 'Kos' && !empty($row['tipe_kos'])) {
            $typeDisplay = 'Kos ' . $row['tipe_kos'];
        }
        
        // Parse facilities
        $facilities = [];
        if (!empty($row['fasilitas_kamar'])) {
            $facilities = array_filter(array_map('trim', explode(',', $row['fasilitas_kamar'])));
        }
        
        // Use placeholder if no image
        $imageUrl = !empty($row['url_foto']) 
            ? $row['url_foto'] 
            : 'https://via.placeholder.com/400x300?text=No+Image';
        
        $listing = [
            'id' => (int)$row['id_kamar'],
            'property_id' => (int)$row['id_properti'],
            'title' => $row['nama_properti'] . ' - ' . $row['nama_kamar'],
            'type' => $typeDisplay,
            'location' => $row['alamat'],
            'address' => $row['alamat'],
            'price' => (int)$row['harga'],
            'deposit' => (int)$row['deposit'],
            'image' => $imageUrl,
            'rating' => 4.5,
            'reviews' => 10,
            'available' => (int)$row['kamar_tersedia'],
            'rooms' => (int)$row['jumlah_kamar'],
            'roomSize' => $row['room_size'] ?? '3x4m',
            'facilities' => $facilities,
            'views' => (int)$row['total_views'],
            'description' => $row['deskripsi'] ?? ''
        ];
        
        $listings[] = $listing;
    }
    
    // ✅ KIRIM ARRAY LANGSUNG (tidak pakai wrapper object)
    echo json_encode($listings);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>