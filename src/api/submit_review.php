<?php
// api/submit_review.php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_connect.php';

try {
    // ✅ CEK LOGIN
    $id_user = null;
    if (isset($_SESSION['user_id'])) {
        $id_user = $_SESSION['user_id'];
    } elseif (isset($_SESSION['id_user'])) {
        $id_user = $_SESSION['id_user'];
    }
    
    if (!$id_user) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Anda harus login untuk memberikan ulasan'
        ]);
        exit;
    }
    
    // ✅ VALIDASI INPUT
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id_properti = isset($data['id_properti']) ? intval($data['id_properti']) : 0;
    $rating = isset($data['rating']) ? intval($data['rating']) : 0;
    $review_text = isset($data['review_text']) ? trim($data['review_text']) : '';
    
    if ($id_properti <= 0) {
        throw new Exception('ID properti tidak valid');
    }
    
    if ($rating < 1 || $rating > 5) {
        throw new Exception('Rating harus antara 1-5');
    }
    
    if (empty($review_text)) {
        throw new Exception('Ulasan tidak boleh kosong');
    }
    
    if (strlen($review_text) < 10) {
        throw new Exception('Ulasan minimal 10 karakter');
    }
    
    // ✅ CEK APAKAH USER SUDAH PERNAH REVIEW PROPERTI INI
    $check_sql = "SELECT id_review FROM reviews 
                  WHERE id_user = ? AND id_properti = ?";
    $check_stmt = $koneksi->prepare($check_sql);
    $check_stmt->bind_param("ii", $id_user, $id_properti);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        // UPDATE existing review
        $row = $check_result->fetch_assoc();
        $id_review = $row['id_review'];
        
        $update_sql = "UPDATE reviews 
                       SET rating = ?, review_text = ?, updated_at = NOW()
                       WHERE id_review = ?";
        $update_stmt = $koneksi->prepare($update_sql);
        $update_stmt->bind_param("isi", $rating, $review_text, $id_review);
        
        if ($update_stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Ulasan berhasil diperbarui',
                'action' => 'updated'
            ]);
        } else {
            throw new Exception('Gagal memperbarui ulasan');
        }
        
    } else {
        // INSERT new review
        $insert_sql = "INSERT INTO reviews (id_properti, id_user, rating, review_text) 
                       VALUES (?, ?, ?, ?)";
        $insert_stmt = $koneksi->prepare($insert_sql);
        $insert_stmt->bind_param("iiis", $id_properti, $id_user, $rating, $review_text);
        
        if ($insert_stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Ulasan berhasil ditambahkan',
                'action' => 'created'
            ]);
        } else {
            throw new Exception('Gagal menambahkan ulasan');
        }
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

if (isset($koneksi)) {
    $koneksi->close();
}
?>