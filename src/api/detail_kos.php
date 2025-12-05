<?php
include 'db_connect.php';

// Ambil ID dari URL
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo "<script>alert('ID tidak valid!'); window.history.back();</script>";
    exit;
}

$id = mysqli_real_escape_string($koneksi, $_GET['id']);

// Query ambil data kos berdasarkan ID
$sql = "SELECT * FROM kos WHERE id = '$id'";
$result = mysqli_query($koneksi, $sql);

if (mysqli_num_rows($result) == 0) {
    echo "<script>alert('Listing tidak ditemukan atau terjadi kesalahan');</script>";
    echo "<center><h3>Maaf, listing yang Anda cari tidak ada.</h3></center>";
    exit;
}

$data = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($data['nama_kos']) ?> - Detail Kos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-4">
    <div class="row">
        <div class="col-md-8">
            <img src="uploads/<?= $data['foto_utama'] ?>" class="img-fluid rounded" alt="<?= $data['nama_kos'] ?>">
        </div>
        <div class="col-md-4">
            <h2><?= htmlspecialchars($data['nama_kos']) ?></h2>
            <p class="text-muted">Oleh: <?= htmlspecialchars($data['nama_pemilik']) ?></p>
            <h4 class="text-primary">Rp <?= number_format($data['harga'], 0, ',', '.') ?> / bulan</h4>
            <p><strong>Alamat:</strong> <?= htmlspecialchars($data['alamat']) ?></p>
            <p><strong>Kategori:</strong> <?= ucfirst($data['kategori']) ?></p>
            <p><strong>Status:</strong> 
                <span class="badge bg-<?= $data['status']=='disetujui' ? 'success' : ($data['status']=='ditolak' ? 'danger' : 'warning') ?>">
                    <?= ucfirst($data['status']) ?>
                </span>
            </p>

            <div class="mt-4">
                <a href="index.php" class="btn btn-secondary">Kembali</a>
                <?php if($data['status'] == 'pending'): ?>
                    <a href="proses_status.php?id=<?= $data['id'] ?>&aksi=setujui" 
                       class="btn btn-success" onclick="return confirm('Setujui listing ini?')">
                       Setujui
                    </a>
                    <a href="proses_status.php?id=<?= $data['id'] ?>&aksi=tolak" 
                       class="btn btn-danger" onclick="return confirm('Tolak listing ini?')">
                       Tolak
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

</body>
</html>