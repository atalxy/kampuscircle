// Kullanıcı kimlik doğrulama işlemleri
class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        // Sayfa yüklendiğinde oturum durumunu kontrol et
        this.checkAuth();
        // Form olaylarını dinle
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Giriş formu
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Kayıt formu
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Çıkış butonu
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    checkAuth() {
        const authRequiredPages = ['profile.html', 'add-event.html', 'add-ad.html', 'new-topic.html'];
        const currentPage = window.location.pathname.split('/').pop();

        if (authRequiredPages.includes(currentPage) && !this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.updateAuthUI();
    }

    updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');

        if (this.currentUser) {
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                const userName = userMenu.querySelector('.user-name');
                if (userName) userName.textContent = this.currentUser.name;
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const user = this.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Kullanıcı bilgilerini güncelle
                this.currentUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                };

                // Oturum bilgilerini kaydet
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                
                this.showNotification('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
                
                // Ana sayfaya yönlendir
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showNotification('E-posta veya şifre hatalı!', 'error');
            }
        } catch (error) {
            console.error('Giriş yapılırken hata oluştu:', error);
            this.showNotification('Giriş yapılırken bir hata oluştu!', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Şifre kontrolü
        if (password !== confirmPassword) {
            this.showNotification('Şifreler eşleşmiyor!', 'error');
            return;
        }

        // E-posta kontrolü
        if (this.users.some(user => user.email === email)) {
            this.showNotification('Bu e-posta adresi zaten kullanılıyor!', 'error');
            return;
        }

        try {
            // Yeni kullanıcı oluştur
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };

            // Kullanıcıyı kaydet
            this.users.push(newUser);
            localStorage.setItem('users', JSON.stringify(this.users));

            this.showNotification('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
            
            // Giriş sayfasına yönlendir
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } catch (error) {
            console.error('Kayıt olurken hata oluştu:', error);
            this.showNotification('Kayıt olurken bir hata oluştu!', 'error');
        }
    }

    logout() {
        if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
            // Oturum bilgilerini temizle
            localStorage.removeItem('currentUser');
            this.currentUser = null;
            
            // Ana sayfaya yönlendir
            window.location.href = 'index.html';
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Auth sınıfını başlat
const auth = new Auth(); 