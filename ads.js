// İlan yönetimi sınıfı
class AdManager {
    constructor() {
        this.ads = [];
        this.init();
    }

    init() {
        // Sayfa yüklendiğinde ilanları yükle
        this.loadAds();
        // Form submit olaylarını dinle
        this.setupEventListeners();
    }

    setupEventListeners() {
        // İlan ekleme formu
        const adForm = document.getElementById('adForm');
        if (adForm) {
            adForm.addEventListener('submit', (e) => this.handleAdSubmit(e));
        }

        // İlan arama
        const searchInput = document.getElementById('adSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Kategori filtreleme
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => this.handleCategoryFilter(e));
        }

        // Fiyat filtreleme
        const priceFilter = document.getElementById('priceFilter');
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => this.handlePriceFilter(e));
        }
    }

    loadAds() {
        try {
            const ads = JSON.parse(localStorage.getItem('ads')) || [];
            this.ads = ads;
            this.displayAds();
        } catch (error) {
            console.error('İlanlar yüklenirken hata oluştu:', error);
            this.showNotification('İlanlar yüklenirken bir hata oluştu!', 'error');
        }
    }

    displayAds(filteredAds = null) {
        const adsContainer = document.getElementById('adsContainer');
        if (!adsContainer) return;

        const adsToDisplay = filteredAds || this.ads;
        
        if (adsToDisplay.length === 0) {
            adsContainer.innerHTML = `
                <div class="no-ads">
                    <i class="fas fa-box-open"></i>
                    <p>Henüz ilan bulunmuyor.</p>
                </div>
            `;
            return;
        }

        adsContainer.innerHTML = adsToDisplay.map(ad => this.createAdCard(ad)).join('');
    }

    createAdCard(ad) {
        const date = new Date(ad.createdAt);
        const formattedDate = date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return `
            <div class="ad-card" data-id="${ad.id}">
                <div class="ad-image">
                    <img src="${ad.image || 'img/default-ad.jpg'}" alt="${ad.title}">
                    <span class="ad-category">${ad.category}</span>
                    <span class="ad-price">${ad.price} TL</span>
                </div>
                <div class="ad-content">
                    <h3>${ad.title}</h3>
                    <p class="ad-description">${ad.description}</p>
                    <div class="ad-details">
                        <p><i class="fas fa-map-marker-alt"></i> ${ad.location}</p>
                        <p><i class="fas fa-clock"></i> ${formattedDate}</p>
                    </div>
                    <div class="ad-footer">
                        <span class="ad-seller">
                            <i class="fas fa-user"></i> ${ad.seller}
                        </span>
                        <div class="ad-actions">
                            <button class="btn btn-secondary" onclick="adManager.contactSeller('${ad.id}')">
                                <i class="fas fa-envelope"></i> İletişim
                            </button>
                            <button class="btn btn-primary" onclick="adManager.saveAd('${ad.id}')">
                                <i class="fas fa-bookmark"></i> Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async handleAdSubmit(e) {
        e.preventDefault();

        if (!auth.isAuthenticated()) {
            auth.showNotification('İlan eklemek için giriş yapmalısınız!', 'warning');
            return;
        }

        const formData = new FormData(e.target);
        const adData = {
            id: Date.now().toString(),
            title: formData.get('title'),
            description: formData.get('description'),
            price: formData.get('price'),
            category: formData.get('category'),
            location: formData.get('location'),
            condition: formData.get('condition'),
            seller: auth.currentUser.name,
            sellerId: auth.currentUser.id,
            image: formData.get('image') || 'img/default-ad.jpg',
            status: 'active',
            createdAt: new Date().toISOString()
        };

        try {
            this.ads.unshift(adData);
            localStorage.setItem('ads', JSON.stringify(this.ads));
            
            this.showNotification('İlan başarıyla eklendi!', 'success');
            setTimeout(() => window.location.href = 'ads.html', 1500);
        } catch (error) {
            console.error('İlan eklenirken hata oluştu:', error);
            this.showNotification('İlan eklenirken bir hata oluştu!', 'error');
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredAds = this.ads.filter(ad => 
            ad.title.toLowerCase().includes(searchTerm) ||
            ad.description.toLowerCase().includes(searchTerm) ||
            ad.location.toLowerCase().includes(searchTerm)
        );
        this.displayAds(filteredAds);
    }

    handleCategoryFilter(e) {
        const category = e.target.value;
        const filteredAds = category === 'all' 
            ? this.ads 
            : this.ads.filter(ad => ad.category === category);
        this.displayAds(filteredAds);
    }

    handlePriceFilter(e) {
        const priceRange = e.target.value;
        let filteredAds = [...this.ads];

        switch (priceRange) {
            case '0-100':
                filteredAds = this.ads.filter(ad => ad.price <= 100);
                break;
            case '100-500':
                filteredAds = this.ads.filter(ad => ad.price > 100 && ad.price <= 500);
                break;
            case '500-1000':
                filteredAds = this.ads.filter(ad => ad.price > 500 && ad.price <= 1000);
                break;
            case '1000+':
                filteredAds = this.ads.filter(ad => ad.price > 1000);
                break;
        }

        this.displayAds(filteredAds);
    }

    contactSeller(adId) {
        if (!auth.isAuthenticated()) {
            auth.showNotification('Satıcı ile iletişime geçmek için giriş yapmalısınız!', 'warning');
            return;
        }

        const ad = this.ads.find(a => a.id === adId);
        if (!ad) return;

        // E-posta gönderme işlemi simülasyonu
        this.showNotification(`Satıcı ${ad.seller} ile iletişime geçiliyor...`, 'info');
    }

    saveAd(adId) {
        if (!auth.isAuthenticated()) {
            auth.showNotification('İlanı kaydetmek için giriş yapmalısınız!', 'warning');
            return;
        }

        const savedAds = JSON.parse(localStorage.getItem('savedAds')) || {};
        const userSavedAds = savedAds[auth.currentUser.id] || [];

        if (userSavedAds.includes(adId)) {
            userSavedAds.splice(userSavedAds.indexOf(adId), 1);
            this.showNotification('İlan kaydedilenlerden kaldırıldı!', 'info');
        } else {
            userSavedAds.push(adId);
            this.showNotification('İlan kaydedildi!', 'success');
        }

        savedAds[auth.currentUser.id] = userSavedAds;
        localStorage.setItem('savedAds', JSON.stringify(savedAds));
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

// AdManager sınıfını başlat
const adManager = new AdManager(); 