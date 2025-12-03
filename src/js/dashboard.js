


function formatRupiah(angka) {
    if (isNaN(angka) || angka === null || angka === 0) return 'Rp 0';
    

    let number_string = angka.toFixed(0).toString(),
        sisa    = number_string.length % 3,
        rupiah  = number_string.substr(0, sisa),
        ribuan  = number_string.substr(sisa).match(/\d{3}/g);
        
    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    

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


            document.getElementById('totalListings').textContent = data.totalListings;
            document.getElementById('totalBooked').textContent = data.totalBooked;
            document.getElementById('totalViews').textContent = data.totalViews;
            

            document.getElementById('totalRevenue').textContent = formatRupiah(data.totalRevenue);
            

            const noListings = document.getElementById('noListings');
            
            if (noListings) {
                if (data.totalListings > 0) {
                    noListings.classList.add('d-none');


                } else {
                    noListings.classList.remove('d-none');
                }
            }

        } else {
            console.error('API Error:', result.message);

        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);

    }
}