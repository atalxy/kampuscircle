// Mobil menü işlevselliği
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Sayfa kaydırıldığında navbar'ı güncelle
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = 'var(--white)';
            navbar.style.boxShadow = 'none';
        }
    });
});

// Kullanıcı oturum kontrolü
function checkAuth() {
    const user = localStorage.getItem('user');
    const authButtons = document.querySelectorAll('.auth-btn');
    
    if (user) {
        authButtons.forEach(btn => {
            if (btn.textContent === 'Giriş Yap') {
                btn.textContent = 'Profil';
                btn.href = 'profile.html';
            } else if (btn.textContent === 'Kayıt Ol') {
                btn.style.display = 'none';
            }
        });
    }
}

// Sayfa yüklendiğinde oturum kontrolü yap
checkAuth(); 