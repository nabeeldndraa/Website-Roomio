<?php
// api/update_listing.php - FIXED VERSION
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

// Log function untuk debugging
function debugLog($message) {
    $logFile = __DIR__ . '/update_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

try {
    debugLog("=== UPDATE REQUEST ===");
    debugLog("Session ID: " . session_id());
    
    // ✅ CEK SEMUA KEMUNGKINAN SESSION KEY
    $id_user = null;
    
    if (isset($_SESSION['user_id'])) {
        $id_user = $_SESSION['user_id'];
        debugLog("Found user_id in session: $id_user");
    } elseif (isset($_SESSION['id_user'])) {
        $id_user = $_SESSION['id_user'];
        debugLog("Found id_user in session: $id_user");
    }
    
    if (!$id_user) {
        debugLog("ERROR: No user session found");
        debugLog("Session contents: " . print_r($_SESSION, true));
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized - Silakan login terlebih dahulu'
        ]);
        exit;
    }
    
    // ✅ VALIDASI INPUT
    if (!isset($_POST['id_properti'])) {
        throw new Exception('ID properti tidak ditemukan');
    }
    
    $id_properti = intval($_POST['id_properti']);
    $id_kamar = isset($_POST['id_kamar']) ? intval($_POST['id_kamar']) : null;
    
    debugLog("User ID: $id_user");
    debugLog("Properti ID: $id_properti");
    debugLog("Kamar ID: $id_kamar");
    
    // ✅ VALIDASI KEPEMILIKAN
    $check_sql = "SELECT id_user FROM properti WHERE id_properti = ?";
    $check_stmt = $koneksi->prepare($check_sql);
    $check_stmt->bind_param("i", $id_properti);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows === 0) {
        debugLog("ERROR: Properti tidak ditemukan");
        throw new Exception('Properti tidak ditemukan');
    }
    
    $owner = $check_result->fetch_assoc();
    $owner_id = intval($owner['id_user']);
    
    debugLog("Owner ID: $owner_id, Current User: $id_user");
    
    if ($owner_id !== intval($id_user)) {
        debugLog("ERROR: Access denied - not the owner");
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Anda tidak memiliki akses untuk mengedit properti ini'
        ]);
        exit;
    }
    
    // ✅ START TRANSACTION
    $koneksi->begin_transaction();
    
    // ✅ PARSING KATEGORI (tipe_properti dari frontend: "kos-putra", "kos-putri", "kos-campur", "kontrakan")
    $category = $_POST['tipe_properti'] ?? '';
    $tipe_properti = '';
    $tipe_kos = null;
    
    debugLog("Category from form: $category");
    
    if ($category === 'kontrakan') {
        $tipe_properti = 'Kontrakan';
        $tipe_kos = null;
    } elseif (strpos($category, 'kos-') === 0) {
        $tipe_properti = 'Kos';
        
        if ($category === 'kos-putra') {
            $tipe_kos = 'Putra';
        } elseif ($category === 'kos-putri') {
            $tipe_kos = 'Putri';
        } elseif ($category === 'kos-campur') {
            $tipe_kos = 'Campur';
        }
    }
    
    debugLog("Parsed - tipe_properti: $tipe_properti, tipe_kos: " . ($tipe_kos ?? 'NULL'));
    
    // Update data properti
    $nama_properti = $_POST['nama_properti'] ?? '';
    $alamat = $_POST['alamat'] ?? '';
    $kota = $_POST['kota'] ?? '';
    $deskripsi = $_POST['deskripsi'] ?? '';
    $latitude = isset($_POST['latitude']) ? floatval($_POST['latitude']) : 0;
    $longitude = isset($_POST['longitude']) ? floatval($_POST['longitude']) : 0;
    $rules = $_POST['rules'] ?? '';
    
    debugLog("Updating properti...");
    debugLog("nama_properti: $nama_properti");
    debugLog("deskripsi length: " . strlen($deskripsi));
    
    // ✅ UPDATE DENGAN TIPE_KOS
    $update_properti = "UPDATE properti SET 
                        nama_properti = ?,
                        tipe_properti = ?,
                        tipe_kos = ?,
                        alamat = ?,
                        kecamatan = ?,
                        deskripsi = ?,
                        latitude = ?,
                        longitude = ?,
                        rules = ?
                        WHERE id_properti = ?";
    
    $stmt = $koneksi->prepare($update_properti);
    $stmt->bind_param("sssssddssi", 
        $nama_properti, 
        $tipe_properti, 
        $tipe_kos,
        $alamat, 
        $kota, 
        $deskripsi, 
        $latitude, 
        $longitude, 
        $rules,
        $id_properti
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Gagal update properti: " . $stmt->error);
    }
    
    debugLog("✅ Properti updated successfully");
    
    // ✅ UPDATE DATA KAMAR
    if ($id_kamar) {
        $harga = isset($_POST['harga']) ? floatval($_POST['harga']) : 0;
        $deposit = isset($_POST['deposit']) ? floatval($_POST['deposit']) : 0;
        $jumlah_kamar = isset($_POST['jumlah_kamar']) ? intval($_POST['jumlah_kamar']) : 0;
        $kamar_tersedia = isset($_POST['kamar_tersedia']) ? intval($_POST['kamar_tersedia']) : 0;
        $room_size = $_POST['room_size'] ?? '';
        
        // Handle fasilitas
        $fasilitas_kamar = '';
        if (isset($_POST['fasilitas_kamar']) && is_array($_POST['fasilitas_kamar'])) {
            $fasilitas_kamar = json_encode($_POST['fasilitas_kamar'], JSON_UNESCAPED_UNICODE);
        }
        
        debugLog("Updating kamar ID: $id_kamar");
        debugLog("fasilitas_kamar: $fasilitas_kamar");
        
        $update_kamar = "UPDATE kamar SET 
                        harga = ?,
                        deposit = ?,
                        jumlah_kamar = ?,
                        kamar_tersedia = ?,
                        room_size = ?,
                        fasilitas_kamar = ?
                        WHERE id_kamar = ?";
        
        $stmt_kamar = $koneksi->prepare($update_kamar);
        $stmt_kamar->bind_param("dddiisi", 
            $harga, 
            $deposit, 
            $jumlah_kamar, 
            $kamar_tersedia, 
            $room_size, 
            $fasilitas_kamar,
            $id_kamar
        );
        
        if (!$stmt_kamar->execute()) {
            throw new Exception("Gagal update kamar: " . $stmt_kamar->error);
        }
        
        debugLog("✅ Kamar updated successfully");
    }
    
    // ✅ HANDLE UPLOAD FOTO BARU
    if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
        debugLog("Processing image uploads...");
        
        $upload_dir = __DIR__ . '/../uploads/';
        
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $uploaded_count = 0;
        
        foreach ($_FILES['images']['name'] as $key => $filename) {
            if ($_FILES['images']['error'][$key] === UPLOAD_ERR_OK) {
                $tmp_name = $_FILES['images']['tmp_name'][$key];
                $file_extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                
                // Validasi ekstensi
                $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
                if (!in_array($file_extension, $allowed_extensions)) {
                    debugLog("Skipping invalid file extension: $file_extension");
                    continue;
                }
                
                // Validasi ukuran file (max 5MB)
                if ($_FILES['images']['size'][$key] > 5 * 1024 * 1024) {
                    debugLog("Skipping file too large: " . $_FILES['images']['size'][$key]);
                    continue;
                }
                
                $new_filename = uniqid() . '_' . time() . '.' . $file_extension;
                $destination = $upload_dir . $new_filename;
                
                if (move_uploaded_file($tmp_name, $destination)) {
                    $url_foto = 'uploads/' . $new_filename;
                    
                    $insert_foto = "INSERT INTO foto_properti (id_properti, url_foto) VALUES (?, ?)";
                    $stmt_foto = $koneksi->prepare($insert_foto);
                    $stmt_foto->bind_param("is", $id_properti, $url_foto);
                    
                    if ($stmt_foto->execute()) {
                        $uploaded_count++;
                        debugLog("✅ Photo uploaded: $url_foto");
                    } else {
                        debugLog("❌ Failed to insert photo to DB: " . $stmt_foto->error);
                    }
                } else {
                    debugLog("❌ Failed to move uploaded file: $filename");
                }
            } else {
                debugLog("❌ Upload error for $filename: " . $_FILES['images']['error'][$key]);
            }
        }
        
        debugLog("Total photos uploaded: $uploaded_count");
    }
    
    // ✅ COMMIT TRANSACTION
    $koneksi->commit();
    debugLog("✅ Transaction committed successfully");
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Listing berhasil diupdate!'
    ]);
    
} catch (Exception $e) {
    if (isset($koneksi)) {
        $koneksi->rollback();
    }
    
    debugLog("❌ ERROR: " . $e->getMessage());
    
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal update listing: ' . $e->getMessage()
    ]);
}

if (isset($koneksi)) {
    $koneksi->close();
}
?>