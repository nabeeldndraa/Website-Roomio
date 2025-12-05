// js/auth.js - Authentication Handler

// ========================================
// 1. CEK SESSION DARI SERVER
// ========================================
async function checkSession() {
    try {
        const response = await fetch('api/check_session.php', {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.logged_in) {
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;
        } else {
            localStorage.removeItem('user');
            return null;
        }
    } catch (error) {
        console.error('Error checking session:', error);
        return null;
    }
}

// ========================================
// 2. GET CURRENT USER (Sync)
// ========================================
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// ========================================
// 3. UPDATE UI BERDASARKAN AUTH STATUS
// ========================================
async function updateAuthUI() {
    const user = await checkSession();
    
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');
    const userNavLinks = document.getElementById('userNavLinks');
    const hostNavLinks = document.getElementById('hostNavLinks');
    const userName = document.getElementById('userName');
    
    if (user) {
        if (userInfo) userInfo.classList.remove('d-none');
        if (authButton) authButton.classList.add('d-none');
        if (userName) userName.textContent = user.name;
        
        if (userNavLinks) userNavLinks.classList.remove('d-none');
        
        if (user.role === 'pemilik') {
            if (hostNavLinks) hostNavLinks.classList.remove('d-none');
        }
        
        console.log('User logged in:', user);
    } else {
        if (userInfo) userInfo.classList.add('d-none');
        if (authButton) authButton.classList.remove('d-none');
        if (userNavLinks) userNavLinks.classList.add('d-none');
        if (hostNavLinks) hostNavLinks.classList.add('d-none');
        
        console.log('User not logged in');
    }
}

// ========================================
// 4. HANDLE LOGIN
// ========================================
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
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            localStorage.setItem('user', JSON.stringify(data.user));
            
            alert('Login berhasil!');
            
            if (data.user.role === 'pemilik') {
                window.location.href = 'host-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert(data.message || 'Login gagal');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Terjadi kesalahan saat login');
    }
}

// ========================================
// 5. HANDLE REGISTER
// ========================================
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
            body: JSON.stringify({ name, email, phone, password, role })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Registrasi berhasil! Silakan login.');
            
            const loginTab = document.querySelector('button[data-bs-target="#login"]');
            if (loginTab) {
                const tab = new bootstrap.Tab(loginTab);
                tab.show();
            }
            
            document.getElementById('loginEmail').value = email;
        } else {
            alert(data.message || 'Registrasi gagal');
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Terjadi kesalahan saat registrasi');
    }
}

// ========================================
// 6. LOGOUT
// ========================================
async function logout() {
    if (!confirm('Yakin ingin keluar?')) return;
    
    try {
        const response = await fetch('api/logout.php', {
            credentials: 'include'
        });
        
        localStorage.removeItem('user');
        
        alert('Logout berhasil!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// ========================================
// 7. SOCIAL LOGIN (Placeholder)
// ========================================
function socialLogin(provider) {
    alert(`Login dengan ${provider} akan segera tersedia!`);
}

// ========================================
// 8. REQUIRE AUTH (Proteksi Halaman)
// ========================================
async function requireAuth(requiredRole = null) {
    const user = await checkSession();
    
    if (!user) {
        alert('Anda harus login terlebih dahulu');
        window.location.href = 'auth.html';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        alert('Anda tidak memiliki akses ke halaman ini');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// ========================================
// 9. REQUIRE HOST (Khusus untuk Host Dashboard)
// ========================================
function requireHost() {
    // DEVELOPMENT MODE: Bypass untuk testing
    console.log('requireHost called - Development mode active');
    return true;
    
    // PRODUCTION: Uncomment code di bawah ini
    /*
    const user = getCurrentUser();
    
    if (!user) {
        alert('Anda harus login terlebih dahulu');
        window.location.href = 'auth.html';
        return false;
    }
    
    if (user.role !== 'pemilik') {
        alert('Halaman ini hanya untuk pemilik properti');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
    */
}

// ========================================
// 10. AUTO-UPDATE AUTH UI
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});

// Export functions
window.checkSession = checkSession;
window.getCurrentUser = getCurrentUser;
window.updateAuthUI = updateAuthUI;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.socialLogin = socialLogin;
window.requireAuth = requireAuth;
window.requireHost = requireHost;