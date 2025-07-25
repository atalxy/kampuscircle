// Profil yönetimi sınıfı
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.GOOGLE_MAPS_API_KEY = 'AIzaSyD_278YXMt1ll1canRQN1nLrJmIg5B0_fg'; // API anahtarınızı buraya ekleyin
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadUserContent();
    }

    loadUserData() {
        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = JSON.parse(userData);
        this.displayUserData();
    }

    displayUserData() {
        document.getElementById('userName').textContent = this.currentUser.name || 'İsimsiz Kullanıcı';
        document.getElementById('userEmail').textContent = this.currentUser.email;
        document.getElementById('userAvatar').src = this.currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.name)}&background=4a90e2&color=fff`;

        // Form alanlarını doldur
        document.getElementById('name').value = this.currentUser.name || '';
        document.getElementById('email').value = this.currentUser.email || '';
        document.getElementById('bio').value = this.currentUser.bio || '';
        document.getElementById('phone').value = this.currentUser.phone || '';
        document.getElementById('location').value = this.currentUser.location || '';
    }

    setupEventListeners() {
        // Profil güncelleme formu
        document.getElementById('updateForm').addEventListener('submit', (e) => this.handleProfileUpdate(e));

        // Avatar değiştirme
        document.getElementById('avatarInput').addEventListener('change', (e) => this.handleAvatarChange(e));

        // Çıkış yapma
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        // Tab değiştirme
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            bio: document.getElementById('bio').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value
        };

        // Kullanıcı verilerini güncelle
        this.currentUser = { ...this.currentUser, ...formData };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Kullanıcı arayüzünü güncelle
        this.displayUserData();
        this.showNotification('Profil başarıyla güncellendi!', 'success');
    }

    handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentUser.avatar = e.target.result;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            document.getElementById('userAvatar').src = e.target.result;
            this.showNotification('Profil resmi güncellendi!', 'success');
        };
        reader.readAsDataURL(file);
    }

    handleLogout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    switchTab(tabId) {
        // Aktif tab'ı değiştir
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });

        // İçeriği değiştir
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabId}Content`).classList.add('active');

        // İlgili içeriği yükle
        switch(tabId) {
            case 'events':
                this.loadUserEvents();
                break;
            case 'ads':
                this.loadUserAds();
                break;
            case 'saved':
                this.loadSavedItems();
                break;
        }
    }

    loadUserContent() {
        this.loadUserEvents();
        this.loadUserAds();
        this.loadSavedItems();
    }

    loadUserEvents() {
        const events = JSON.parse(localStorage.getItem('events') || '[]')
            .filter(event => event.userId === this.currentUser.id || event.organizerId === this.currentUser.id);

        const eventsContainer = document.getElementById('userEvents');
        this.displayEvents(events, eventsContainer);
        document.getElementById('eventCount').textContent = `${events.length} Etkinlik`;
    }

    loadUserAds() {
        const ads = JSON.parse(localStorage.getItem('ads') || '[]')
            .filter(ad => ad.userId === this.currentUser.id || ad.authorId === this.currentUser.id);

        const adsContainer = document.getElementById('userAds');
        this.displayAds(ads, adsContainer);
        document.getElementById('adCount').textContent = `${ads.length} İlan`;
    }

    loadSavedItems() {
        const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]')
            .filter(item => item.userId === this.currentUser.id);

        const savedContainer = document.getElementById('savedItems');
        this.displaySavedItems(savedItems, savedContainer);
        document.getElementById('savedCount').textContent = `${savedItems.length} Kaydedilen`;
    }

    displayEvents(events, container) {
        if (events.length === 0) {
            container.innerHTML = this.getEmptyContentHTML('Etkinlik bulunamadı', 'Yeni bir etkinlik oluşturmak için tıklayın', 'events.html');
            return;
        }

        container.innerHTML = events.map(event => {
            // Konum bilgisini düzenle
            const location = this.formatLocation(event.location);
            
            return `
            <div class="event-card">
                <div class="event-slider">
                    ${event.images ? event.images.map(image => `
                        <img src="${image}" alt="${event.title}">
                    `).join('') : `
                        <img src="${event.image || 'https://via.placeholder.com/300x200'}" alt="${event.title}">
                    `}
                </div>
                <div class="event-content">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <div class="event-details">
                        <div class="event-meta">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(event.date)}</span>
                            <span><i class="fas fa-clock"></i> ${event.time || 'Belirtilmemiş'}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        </div>
                        <div class="event-contact">
                            <h4>İletişim Bilgileri</h4>
                            <p><i class="fas fa-envelope"></i> ${event.contactEmail || 'Belirtilmemiş'}</p>
                            <p><i class="fas fa-phone"></i> ${event.contactPhone || 'Belirtilmemiş'}</p>
                        </div>
                        <div class="event-map">
                            <iframe
                                width="100%"
                                height="200"
                                frameborder="0"
                                style="border:0"
                                src="https://www.google.com/maps/embed/v1/place?key=${this.GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="btn-edit" onclick="profileManager.editEvent('${event.id}')">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                        <button class="btn-delete" onclick="profileManager.deleteEvent('${event.id}')">
                            <i class="fas fa-trash"></i> Sil
                        </button>
                        <a href="mailto:${event.contactEmail}" class="btn-contact" ${!event.contactEmail ? 'disabled' : ''}>
                            <i class="fas fa-envelope"></i> İletişime Geç
                        </a>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    initializeSliders() {
        document.querySelectorAll('.event-slider').forEach(slider => {
            const images = slider.querySelectorAll('img');
            if (images.length <= 1) return;

            let currentIndex = 0;
            const interval = 5000; // 5 saniye

            // Otomatik geçiş
            setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                this.updateSlider(slider, currentIndex);
            }, interval);

            // Dokunma olayları
            let touchStartX = 0;
            let touchEndX = 0;

            slider.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });

            slider.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(slider, touchStartX, touchEndX);
            });
        });
    }

    updateSlider(slider, index) {
        const images = slider.querySelectorAll('img');
        images.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });
    }

    handleSwipe(slider, startX, endX) {
        const images = slider.querySelectorAll('img');
        const currentIndex = Array.from(images).findIndex(img => img.style.display === 'block');
        
        if (startX - endX > 50) { // Sola kaydırma
            const nextIndex = (currentIndex + 1) % images.length;
            this.updateSlider(slider, nextIndex);
        } else if (endX - startX > 50) { // Sağa kaydırma
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            this.updateSlider(slider, prevIndex);
        }
    }

    displayAds(ads, container) {
        if (ads.length === 0) {
            container.innerHTML = this.getEmptyContentHTML('İlan bulunamadı', 'Yeni bir ilan oluşturmak için tıklayın', 'ads.html');
            return;
        }

        container.innerHTML = ads.map(ad => `
            <div class="ad-card">
                <img src="${ad.image || 'https://via.placeholder.com/300x200'}" alt="${ad.title}">
                <div class="ad-content">
                    <h3>${ad.title}</h3>
                    <p>${ad.description}</p>
                    <div class="ad-meta">
                        <span><i class="fas fa-tag"></i> ${ad.price} TL</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${ad.location}</span>
                    </div>
                    <div class="ad-actions">
                        <button class="btn-edit" onclick="profileManager.editAd('${ad.id}')">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                        <button class="btn-delete" onclick="profileManager.deleteAd('${ad.id}')">
                            <i class="fas fa-trash"></i> Sil
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displaySavedItems(items, container) {
        if (items.length === 0) {
            container.innerHTML = this.getEmptyContentHTML('Kaydedilen öğe bulunamadı', 'İlanları kaydetmek için tıklayın', 'ads.html');
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="saved-card">
                <img src="${item.image || 'https://via.placeholder.com/300x200'}" alt="${item.title}">
                <div class="saved-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="saved-meta">
                        <span><i class="fas fa-tag"></i> ${item.price} TL</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                    </div>
                    <button class="btn-remove" onclick="profileManager.removeSavedItem('${item.id}')">
                        <i class="fas fa-bookmark"></i> Kaydı Kaldır
                    </button>
                </div>
            </div>
        `).join('');
    }

    getEmptyContentHTML(title, message, link) {
        return `
            <div class="no-content">
                <i class="fas fa-inbox"></i>
                <h3>${title}</h3>
                <p>${message}</p>
                <a href="${link}" class="btn-primary">
                    <i class="fas fa-plus"></i>
                    Yeni Oluştur
                </a>
            </div>
        `;
    }

    editEvent(eventId) {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const event = events.find(e => e.id === eventId);
        
        if (!event) {
            this.showNotification('Etkinlik bulunamadı!', 'error');
            return;
        }

        // Etkinlik düzenleme formunu göster
        const newTitle = prompt('Etkinlik başlığı:', event.title);
        if (!newTitle) return;

        const newDescription = prompt('Etkinlik açıklaması:', event.description);
        if (!newDescription) return;

        const newDate = prompt('Etkinlik tarihi (YYYY-MM-DD):', event.date);
        if (!newDate) return;

        const newTime = prompt('Etkinlik saati (HH:MM):', event.time);
        if (!newTime) return;

        const newLocation = prompt('Etkinlik konumu:', event.location);
        if (!newLocation) return;

        const newContactEmail = prompt('İletişim e-postası:', event.contactEmail);
        if (!newContactEmail) return;

        const newContactPhone = prompt('İletişim telefonu:', event.contactPhone);
        if (!newContactPhone) return;

        // Etkinliği güncelle
        event.title = newTitle;
        event.description = newDescription;
        event.date = newDate;
        event.time = newTime;
        event.location = newLocation;
        event.contactEmail = newContactEmail;
        event.contactPhone = newContactPhone;
        event.updatedAt = new Date().toISOString();

        // LocalStorage'ı güncelle
        const updatedEvents = events.map(e => e.id === eventId ? event : e);
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        // Arayüzü güncelle
        this.loadUserEvents();
        this.showNotification('Etkinlik başarıyla güncellendi!', 'success');
    }

    deleteEvent(eventId) {
        if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            const updatedEvents = events.filter(event => event.id !== eventId);
            localStorage.setItem('events', JSON.stringify(updatedEvents));
            
            // Kullanıcının etkinliklerini güncelle
            if (this.currentUser.events) {
                this.currentUser.events = this.currentUser.events.filter(id => id !== eventId);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
            
            this.loadUserEvents();
            this.showNotification('Etkinlik başarıyla silindi!', 'success');
        }
    }

    editAd(adId) {
        // İlan düzenleme sayfasına yönlendir
        window.location.href = `ad-edit.html?id=${adId}`;
    }

    deleteAd(adId) {
        if (confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
            const ads = JSON.parse(localStorage.getItem('ads') || '[]');
            const updatedAds = ads.filter(ad => ad.id !== adId);
            localStorage.setItem('ads', JSON.stringify(updatedAds));
            
            // Kullanıcının ilanlarını güncelle
            if (this.currentUser.ads) {
                this.currentUser.ads = this.currentUser.ads.filter(id => id !== adId);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
            
            this.loadUserAds();
            this.showNotification('İlan başarıyla silindi!', 'success');
        }
    }

    removeSavedItem(itemId) {
        if (confirm('Bu öğeyi kaydedilenlerden kaldırmak istediğinizden emin misiniz?')) {
            const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
            const updatedItems = savedItems.filter(item => item.id !== itemId);
            localStorage.setItem('savedItems', JSON.stringify(updatedItems));
            this.loadSavedItems();
            this.showNotification('Öğe kaydedilenlerden kaldırıldı!', 'success');
        }
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Konum formatını düzenleyen yeni metod
    formatLocation(location) {
        if (!location) return 'Konum belirtilmemiş';
        
        // Üniversite koordinatları ve adresleri
        const universityData = {
            'İstanbul Teknik Üniversitesi': {
                coordinates: '41.1048, 29.0253',
                address: 'İstanbul Teknik Üniversitesi, Ayazağa Kampüsü, Maslak, Sarıyer, İstanbul'
            },
            'Boğaziçi Üniversitesi': {
                coordinates: '41.0847, 29.0572',
                address: 'Boğaziçi Üniversitesi, Bebek Kampüsü, Bebek, Beşiktaş, İstanbul'
            },
            'İstanbul Üniversitesi': {
                coordinates: '41.0116, 28.9644',
                address: 'İstanbul Üniversitesi, Beyazıt Kampüsü, Beyazıt, Fatih, İstanbul'
            }
        };
        
        // Konum bilgisini temizle
        const cleanLocation = location.trim();
        
        // Üniversite bilgilerini bul
        for (const [university, data] of Object.entries(universityData)) {
            if (cleanLocation.includes(university)) {
                return data.address; // Adresi döndür
            }
        }
        
        // Eğer bilinen bir üniversite değilse, orijinal konumu döndür
        return cleanLocation;
    }
}

// Profil yöneticisini başlat
const profileManager = new ProfileManager(); 