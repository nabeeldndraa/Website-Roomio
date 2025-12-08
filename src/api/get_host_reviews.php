<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Credentials: true');
session_start();

require_once 'db_connect.php';

try {
    // Cek apakah user sudah login
    if (!isset($_SESSION['user_id'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Anda belum login. Silakan login terlebih dahulu.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // Cek role - sesuaikan dengan struktur session Anda
    $user_role = $_SESSION['user_role'] ?? '';
    
    if ($user_role !== 'pemilik') {
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized. Hanya pemilik yang dapat mengakses. Role Anda: ' . $user_role
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $id_user = $_SESSION['user_id'];
    
    // Query dengan LEFT JOIN ke tabel foto_properti untuk mengambil foto pertama
    $sql = "SELECT 
                r.id_review,
                r.rating,
                r.review_text,
                r.created_at,
                p.id_properti,
                p.nama_properti as property_title,
                COALESCE(fp.url_foto, '') as property_image,
                u.nama_lengkap as reviewer_name,
                u.email as reviewer_email
            FROM reviews r
            INNER JOIN properti p ON r.id_properti = p.id_properti
            INNER JOIN users u ON r.id_user = u.id_user
            LEFT JOIN (
                SELECT id_properti, url_foto
                FROM foto_properti
                WHERE (id_properti, id_foto) IN (
                    SELECT id_properti, MIN(id_foto)
                    FROM foto_properti
                    GROUP BY id_properti
                )
            ) fp ON p.id_properti = fp.id_properti
            WHERE p.id_user = ?
            ORDER BY r.created_at DESC";
    
    $stmt = $koneksi->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $koneksi->error);
    }
    
    $stmt->bind_param('i', $id_user);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $reviews = [];
    
    while ($row = $result->fetch_assoc()) {
        $reviews[] = [
            'id_review' => $row['id_review'],
            'rating' => (int)$row['rating'],
            'review_text' => $row['review_text'],
            'created_at' => $row['created_at'],
            'id_properti' => $row['id_properti'],
            'property_title' => $row['property_title'],
            'property_image' => $row['property_image'] ?: '',
            'reviewer_name' => $row['reviewer_name'],
            'reviewer_email' => $row['reviewer_email']
        ];
    }
    
    $totalReviews = count($reviews);
    $avgRating = 0;
    $ratingDistribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
    
    if ($totalReviews > 0) {
        $sumRating = 0;
        foreach ($reviews as $review) {
            $sumRating += $review['rating'];
            $ratingDistribution[$review['rating']]++;
        }
        $avgRating = round($sumRating / $totalReviews, 1);
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $reviews,
        'statistics' => [
            'total_reviews' => $totalReviews,
            'average_rating' => (float)$avgRating,
            'rating_distribution' => $ratingDistribution
        ]
    ], JSON_UNESCAPED_UNICODE);
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

if (isset($koneksi)) {
    $koneksi->close();
}
?>