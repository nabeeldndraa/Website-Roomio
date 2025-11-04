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
    if (!user || (user.role !== 'host' && user.role !== 'both')) {
        alert('Anda harus menjadi host untuk mengakses halaman ini');
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
        if (userNavLinks) userNavLinks.classList.remove('d-none');
        
        if (user.role === 'host' || user.role === 'both') {
            if (hostNavLinks) hostNavLinks.classList.remove('d-none');
        }
    } else {
        if (userInfo) userInfo.classList.add('d-none');
        if (authButton) authButton.classList.remove('d-none');
        if (userNavLinks) userNavLinks.classList.add('d-none');
        if (hostNavLinks) hostNavLinks.classList.add('d-none');
    }
}

// Mock login function for demo
function mockLogin(email, password, name, role = 'user') {
    const user = {
        id: Date.now().toString(),
        name: name || email.split('@')[0],
        email: email,
        role: role,
        verified: true,
        avatar: null
    };
    
    setCurrentUser(user);
    return user;
}
