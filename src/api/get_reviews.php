<?php
// api/get_reviews.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db_connect.php';

try {
    $id_properti = isset($_GET['id_properti']) ? intval($_GET['id_properti']) : 0;
    
    if ($id_properti <= 0) {
        throw new Exception('ID properti tidak valid');
    }
    
    // ✅ GET AVERAGE RATING & TOTAL REVIEWS
    $stats_sql = "SELECT 
                    COUNT(*) as total_reviews,
                    AVG(rating) as avg_rating,
                    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5,
                    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
                    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
                    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
                    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1
                  FROM reviews 
                  WHERE id_properti = ?";
    
    $stats_stmt = $koneksi->prepare($stats_sql);
    $stats_stmt->bind_param("i", $id_properti);
    $stats_stmt->execute();
    $stats_result = $stats_stmt->get_result();
    $stats = $stats_result->fetch_assoc();
    
    // ✅ GET ALL REVIEWS WITH USER INFO
    $reviews_sql = "SELECT 
                        r.id_review,
                        r.rating,
                        r.review_text,
                        r.created_at,
                        r.updated_at,
                        u.nama_lengkap as user_name,
                        u.username
                    FROM reviews r
                    JOIN users u ON r.id_user = u.id_user
                    WHERE r.id_properti = ?
                    ORDER BY r.created_at DESC";
    
    $reviews_stmt = $koneksi->prepare($reviews_sql);
    $reviews_stmt->bind_param("i", $id_properti);
    $reviews_stmt->execute();
    $reviews_result = $reviews_stmt->get_result();
    
    $reviews = [];
    while ($row = $reviews_result->fetch_assoc()) {
        $reviews[] = [
            'id_review' => (int)$row['id_review'],
            'rating' => (int)$row['rating'],
            'review_text' => $row['review_text'],
            'user_name' => $row['user_name'],
            'username' => $row['username'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
            'time_ago' => timeAgo($row['created_at'])
        ];
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'statistics' => [
                'total_reviews' => (int)$stats['total_reviews'],
                'avg_rating' => round((float)$stats['avg_rating'], 1),
                'rating_5' => (int)$stats['rating_5'],
                'rating_4' => (int)$stats['rating_4'],
                'rating_3' => (int)$stats['rating_3'],
                'rating_2' => (int)$stats['rating_2'],
                'rating_1' => (int)$stats['rating_1']
            ],
            'reviews' => $reviews
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

// ✅ Helper function untuk format waktu
function timeAgo($datetime) {
    $time = strtotime($datetime);
    $diff = time() - $time;
    
    if ($diff < 60) {
        return 'Baru saja';
    } elseif ($diff < 3600) {
        $mins = floor($diff / 60);
        return $mins . ' menit yang lalu';
    } elseif ($diff < 86400) {
        $hours = floor($diff / 3600);
        return $hours . ' jam yang lalu';
    } elseif ($diff < 604800) {
        $days = floor($diff / 86400);
        return $days . ' hari yang lalu';
    } elseif ($diff < 2592000) {
        $weeks = floor($diff / 604800);
        return $weeks . ' minggu yang lalu';
    } else {
        return date('d M Y', $time);
    }
}

if (isset($koneksi)) {
    $koneksi->close();
}
?>