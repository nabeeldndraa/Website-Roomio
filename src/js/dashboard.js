// js/dashboard.js

// Fungsi helper untuk format Rupiah (membuat Rp 1250000 menjadi Rp 1.250.000)
function formatRupiah(angka) {
    if (isNaN(angka) || angka === null || angka === 0) return 'Rp 0';
    
    // Konversi ke string dan tambahkan titik sebagai pemisah ribuan
    let number_string = angka.toFixed(0).toString(),
        sisa    = number_string.length % 3,
        rupiah  = number_string.substr(0, sisa),
        ribuan  = number_string.substr(sisa).match(/\d{3}/g);
        
    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    
    // Optional: Jika ingin format "Rp X,X jt"
    if (angka >= 1000000) {
        return 'Rp ' + (angka / 1000000).toFixed(1).replace('.', ',') + ' jt';
    }
    
    return 'Rp ' + rupiah;
}

async function loadDashboardData() {
    try {
        const response = await fetch('api/dashboard_stats.php');
        const result = await response.json();

        if (result.status === 'success') {
            const data = result.data;

            // 1. Update Card Statistik (Menggunakan ID dari host-dashboard.html)
            document.getElementById('totalListings').textContent = data.totalListings;
            document.getElementById('totalBooked').textContent = data.totalBooked;
            document.getElementById('totalViews').textContent = data.totalViews;
            
            // Mengupdate pendapatan dengan format Rupiah/jt
            document.getElementById('totalRevenue').textContent = formatRupiah(data.totalRevenue);
            
            // 2. Logika Tampilan Listing (Tab 'Semua Listing')
            const noListings = document.getElementById('noListings');
            
            if (noListings) {
                if (data.totalListings > 0) {
                    noListings.classList.add('d-none'); // Sembunyikan pesan jika ada listing
                    // TO DO: Panggil fungsi untuk memuat detail listing di sini
                    // loadHostListings(data.totalListings); 
                } else {
                    noListings.classList.remove('d-none'); // Tampilkan pesan jika belum ada listing
                }
            }

        } else {
            console.error('API Error:', result.message);
            // alert('Gagal memuat data dashboard: ' + result.message);
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // alert('Terjadi kesalahan koneksi ke server.');
    }
}