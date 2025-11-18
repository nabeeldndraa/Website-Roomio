// ---------------------------------
// BAGIAN 1: Manajemen Sesi (Milikmu)
// ---------------------------------

// Authentication management
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html'; // Arahkan ke beranda setelah logout
}

function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'auth.html'; // Arahkan ke login
        return false;
    }
    return true;
}

function requireHost() {
    const user = getCurrentUser();
    if (!user || (user.role !== 'pemilik')) { // Sesuaikan dengan database kita ('pemilik')
        alert('Anda harus menjadi pemilik untuk mengakses halaman ini');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function updateAuthUI() {
    const user = getCurrentUser();
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');
    const userNavLinks = document.getElementById('userNavLinks');
    const hostNavLinks = document.getElementById('hostNavLinks');
    const userName = document.getElementById('userName');
    
    if (user) {
        if (userInfo) userInfo.classList.remove('d-none');
        if (authButton) authButton.classList.add('d-none');
        if (userName) userName.textContent = user.name; // 'name' dari data user
        
        // Sesuaikan role-check dengan data dari database
        if (user.role === 'penyewa') {
            if (userNavLinks) userNavLinks.classList.remove('d-none');
        } else if (user.role === 'pemilik') {
            // Pemilik bisa jadi juga penyewa, tampilkan keduanya
            if (userNavLinks) userNavLinks.classList.remove('d-none');
            if (hostNavLinks) hostNavLinks.classList.remove('d-none');
        }
    } else {
        if (userInfo) userInfo.classList.add('d-none');
        if (authButton) authButton.classList.remove('d-none');
        if (userNavLinks) userNavLinks.classList.add('d-none');
        if (hostNavLinks) hostNavLinks.classList.add('d-none');
    }
}

// ---------------------------------
// BAGIAN 2: Aksi ke API (Gabungan)
// ---------------------------------

// Fungsi ini akan dipanggil oleh form login di auth.html
async function handleLogin(event) {
    event.preventDefault(); // Mencegah form reload halaman

    // Ambil data dari form
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json(); // Baca respons sebagai JSON

        if (data.status === 'success') {
            // === INI INTEGRASINYA ===
            // 'data.user' adalah objek yang dikirim oleh api/login.php
            // Kita panggil fungsi setCurrentUser (dari Bagian 1)
            setCurrentUser(data.user); 
            // -------------------------
            
            alert('Login berhasil! Selamat datang ' + data.user.name);
            window.location.href = 'index.html'; // Arahkan ke beranda
        } else {
            alert('Login gagal: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi.');
    }
}

// Fungsi ini akan dipanggil oleh form register di auth.html
async function handleRegister(event) {
    event.preventDefault(); // Mencegah form reload halaman

    // Ambil semua data dari form
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value; // 'user', 'host', atau 'both'

    try {
        const response = await fetch('api/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                password: password,
                role: role // Kirim role pilihan dari form
            })
        });

        const data = await response.json(); // Baca respons sebagai JSON

        if (data.status === 'success') {
            alert('Registrasi berhasil! Silakan login dengan akun Anda.');
            // Reload halaman auth untuk reset form dan pindah tab ke login
            window.location.reload(); 
        } else {
            alert('Registrasi gagal: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi.');
    }
}

// Fungsi lain (biarkan seperti di HTML-mu jika masih dipakai)
function socialLogin(provider) {
    alert('Fitur login dengan ' + provider + ' belum diimplementasikan.');
}

// Hapus fungsi mockLogin() yang lama, karena sudah diganti handleLogin