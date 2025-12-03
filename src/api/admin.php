<?php
// api/admin.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

session_start();

// === CEK ADMIN ===
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Akses ditolak. Admin only.']);
    exit;
}

// === KONEKSI DATABASE ===
try {
    $pdo = new PDO("mysql:host=localhost;dbname=roomio_db", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {

    // ==================================================================
    // 1. DASHBOARD STATISTIK
    // ==================================================================
    case 'dashboard_stats':
        $stats = [
            'total_pemilik'     => $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'pemilik'")->fetchColumn(),
            'total_penyewa'     => $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'penyewa'")->fetchColumn(),
            'total_properti'    => $pdo->query("SELECT COUNT(*) FROM properti")->fetchColumn(),
            'pending_properti'  => $pdo->query("SELECT COUNT(*) FROM properti WHERE status = 'pending'")->fetchColumn(),
            'approved_properti' => $pdo->query("SELECT COUNT(*) FROM properti WHERE status = 'approved'")->fetchColumn(),
            'rejected_properti' => $pdo->query("SELECT COUNT(*) FROM properti WHERE status = 'rejected'")->fetchColumn(),
            'total_transaksi'   => $pdo->query("SELECT COUNT(*) FROM pembayaran")->fetchColumn(),
            'pending_bayar'     => $pdo->query("SELECT COUNT(*) FROM pembayaran WHERE status_bayar = 'pending'")->fetchColumn(),
        ];
        echo json_encode(['success' => true, 'data' => $stats]);
        break;

    // ==================================================================
    // 2. LISTING PENDING (untuk approval)
    // ==================================================================
    case 'get_pending':
        $stmt = $pdo->prepare("
            SELECT p.*, u.nama_lengkap as nama_pemilik, u.no_hp 
            FROM properti p 
            JOIN users u ON p.id_user = u.id_user 
            WHERE p.status = 'pending'
            ORDER BY p.created_at DESC
        ");
        $stmt->execute();
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    // ==================================================================
    // 3. APPROVE LISTING
    // ==================================================================
    case 'approve_listing':
        $id_properti = $_POST['id_properti'] ?? 0;
        $stmt = $pdo->prepare("UPDATE properti SET status = 'approved' WHERE id_properti = ?");
        $success = $stmt->execute([$id_properti]);
        echo json_encode(['success' => $success]);
        break;

    // ==================================================================
    // 4. REJECT LISTING + ALASAN
    // ==================================================================
    case 'reject_listing':
        $id_properti = $_POST['id_properti'] ?? 0;
        $alasan = $_POST['alasan'] ?? '';
        $stmt = $pdo->prepare("UPDATE properti SET status = 'rejected', rejection_reason = ? WHERE id_properti = ?");
        $success = $stmt->execute([$alasan, $id_properti]);
        echo json_encode(['success' => $success]);
        break;

    // ==================================================================
    // 5. SEMUA LISTING (dengan filter status)
    // ==================================================================
    case 'get_all_listings':
        $status = $_GET['status'] ?? '';
        $sql = "SELECT p.*, u.nama_lengkap as nama_pemilik 
                FROM properti p 
                JOIN users u ON p.id_user = u.id_user";
        if (in_array($status, ['pending','approved','rejected'])) {
            $sql .= " WHERE p.status = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$status]);
        } else {
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        }
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    // ==================================================================
    // 6. DATA UNTUK PETA (semua properti yang approved)
    // ==================================================================
    case 'get_map_data':
        $stmt = $pdo->prepare("
            SELECT p.nama_properti, p.latitude, p.longitude, p.tipe_properti, p.harga,
                   k.jumlah_kamar, k.tipe_kamar
            FROM properti p
            LEFT JOIN kamar k ON p.id_properti = k.id_properti
            WHERE p.status = 'approved' AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
        ");
        $stmt->execute();
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    // ==================================================================
    // 7. SEMUA USER (pemilik & penyewa)
    // ==================================================================
    case 'get_users':
        $stmt = $pdo->query("SELECT id_user, nama_lengkap, username, email, no_hp, role, created_at FROM users ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    // ==================================================================
    // 8. TRANSAKSI / PEMBAYARAN
    // ==================================================================
    case 'get_transactions':
        $stmt = $pdo->prepare("
            SELECT pb.*, 
                   py.nama_lengkap as penyewa,
                   pm.nama_lengkap as pemilik,
                   pr.nama_properti
            FROM pembayaran pb
            JOIN penyewa py ON pb.id_penyewa = py.id_penyewa  
            JOIN users pm ON pb.id_pemilik = pm.id_user
            JOIN properti pr ON pb.id_properti = pr.id_properti
            ORDER BY pb.tgl_bayar DESC
        ");
        $stmt->execute();
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    // ==================================================================
    // 9. VERIFIKASI PEMBAYARAN
    // ==================================================================
    case 'verify_payment':
        $id_bayar = $_POST['id_bayar'] ?? 0;
        $status = $_POST['status'] ?? 'lunas'; // lunas / gagal
        $stmt = $pdo->prepare("UPDATE pembayaran SET status_bayar = ? WHERE id_bayar = ?");
        $success = $stmt->execute([$status, $id_bayar]);
        echo json_encode(['success' => $success]);
        break;

    // ==================================================================
    // DEFAULT
    // ==================================================================
    default:
        echo json_encode(['success' => false, 'message' => 'Action not found']);
}