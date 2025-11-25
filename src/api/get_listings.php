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
                f.url_foto
            FROM properti p
            INNER JOIN kamar k ON p.id_properti = k.id_properti
            LEFT JOIN foto_properti f ON p.id_properti = f.id_properti
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
    $sql .= " GROUP BY p.id_properti, k.id_kamar, f.id_foto";
    
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
    
    // Check if ulasan table exists
    $tableExists = false;
    try {
        $checkTable = $pdo->query("SHOW TABLES LIKE 'ulasan'");
        $tableExists = $checkTable->rowCount() > 0;
    } catch(PDOException $e) {
        // Table doesn't exist, continue without reviews
    }
    
    // Format data for frontend
    $listings = [];
    $processedProperti = []; // Track processed properti to avoid duplicates
    
    foreach ($results as $row) {
        $propertiId = $row['id_properti'];
        
        // Skip if we already processed this properti (avoid duplicates from multiple photos)
        if (isset($processedProperti[$propertiId])) {
            continue;
        }
        
        // Get review statistics for this properti (only if table exists)
        $avgRating = 0;
        $reviewCount = 0;
        
        if ($tableExists) {
            try {
                $reviewSql = "SELECT 
                                COALESCE(AVG(r.rating), 0) as avg_rating,
                                COUNT(r.id_ulasan) as review_count
                              FROM sewa s
                              LEFT JOIN ulasan r ON s.id_sewa = r.id_sewa
                              WHERE s.id_kamar IN (
                                  SELECT id_kamar FROM kamar WHERE id_properti = :propertiId
                              )";
                $reviewStmt = $pdo->prepare($reviewSql);
                $reviewStmt->bindParam(':propertiId', $propertiId);
                $reviewStmt->execute();
                $reviewData = $reviewStmt->fetch(PDO::FETCH_ASSOC);
                $avgRating = $reviewData['avg_rating'];
                $reviewCount = $reviewData['review_count'];
            } catch(PDOException $e) {
                // If error, use default values
            }
        }
        
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
        
        $listing = [
            'id' => $propertiId,
            'title' => $row['nama_properti'],
            'type' => $typeDisplay,
            'location' => $row['kecamatan'] . ', Jember',
            'address' => $row['alamat'],
            'price' => (int)$row['harga'],
            'deposit' => (int)$row['deposit'],
            'image' => !empty($row['url_foto']) ? $row['url_foto'] : 'assets/placeholder.jpg',
            'rating' => round($avgRating, 1) > 0 ? round($avgRating, 1) : 4.5, // Default 4.5 if no reviews
            'reviews' => (int)$reviewCount,
            'available' => (int)$row['kamar_tersedia'],
            'rooms' => (int)$row['jumlah_kamar'],
            'roomSize' => $row['room_size'],
            'facilities' => $facilities,
            'views' => (int)$row['total_views'],
            'description' => $row['deskripsi']
        ];
        
        $listings[] = $listing;
        $processedProperti[$propertiId] = true;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $listings,
        'count' => count($listings)
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}