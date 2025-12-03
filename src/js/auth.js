




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
    window.location.href = 'index.html';
}

function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'auth.html';
        return false;
    }
    return true;
}

function requireHost() {
    const user = getCurrentUser();
    if (!user || (user.role !== 'pemilik')) {
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
        if (userName) userName.textContent = user.name;
        

        if (user.role === 'penyewa') {
            if (userNavLinks) userNavLinks.classList.remove('d-none');
        } else if (user.role === 'pemilik') {

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


function getUserById(id) {

    const mockUsers = [
        { id: '1', name: 'Budi Santoso', email: 'budi@example.com', role: 'pemilik', phone: '081234567890', bio: 'Pemilik kos berpengalaman, ramah, respon cepat', joined: '2022' },
        { id: '2', name: 'Ibu Siti', email: 'siti@example.com', role: 'pemilik', phone: '081298765432', bio: 'Menyewakan beberapa properti dekat kampus', joined: '2021' },
        { id: '3', name: 'Ayu Lestari', email: 'ayu@example.com', role: 'penyewa', phone: '08135551234', bio: 'Mahasiswi yang sedang mencari kos nyaman', joined: '2023' }
    ];

    return mockUsers.find(u => String(u.id) === String(id)) || null;
}






async function handleLogin(event) {
    event.preventDefault();


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

        const data = await response.json();

        if (data.status === 'success') {



            setCurrentUser(data.user); 

            
            alert('Login berhasil! Selamat datang ' + data.user.name);
            window.location.href = 'index.html';
        } else {
            alert('Login gagal: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi.');
    }
}


async function handleRegister(event) {
    event.preventDefault();


    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

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
                role: role
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert('Registrasi berhasil! Silakan login dengan akun Anda.');

            window.location.reload(); 
        } else {
            alert('Registrasi gagal: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan koneksi.');
    }
}


function socialLogin(provider) {
    alert('Fitur login dengan ' + provider + ' belum diimplementasikan.');
}