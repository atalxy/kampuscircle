// Son eklenen içerikleri yükle
class HomePage {
    constructor() {
        this.latestContent = document.getElementById('latestContent');
        this.init();
    }

    init() {
        this.loadLatestContent();
    }

    loadLatestContent() {
        try {
            // Son eklenen etkinlikleri ve ilanları al
            const events = JSON.parse(localStorage.getItem('events')) || [];
            const ads = JSON.parse(localStorage.getItem('ads')) || [];

            // Tarihe göre sırala
            const sortedEvents = events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const sortedAds = ads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // En son 6 içeriği al
            const latestEvents = sortedEvents.slice(0, 3);
            const latestAds = sortedAds.slice(0, 3);

            // İçerikleri birleştir ve karıştır
            const allContent = [...latestEvents, ...latestAds]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6);

            this.displayLatestContent(allContent);
        } catch (error) {
            console.error('Son eklenen içerikler yüklenirken hata oluştu:', error);
        }
    }

    displayLatestContent(content) {
        if (!this.latestContent) return;

        if (content.length === 0) {
            this.latestContent.innerHTML = `
                <div class="no-content">
                    <i class="fas fa-info-circle"></i>
                    <p>Henüz içerik eklenmemiş.</p>
                </div>
            `;
            return;
        }

        this.latestContent.innerHTML = content.map(item => {
            if (item.type === 'event') {
                return this.createEventCard(item);
            } else {
                return this.createAdCard(item);
            }
        }).join('');
    }

    createEventCard(event) {
        const date = new Date(event.date);
        const formattedDate = date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return `
            <div class="latest-card">
                <div class="latest-image">
                    <img src="${event.image || 'https://source.unsplash.com/random/800x600/?event'}" alt="${event.title}">
                </div>
                <div class="latest-content">
                    <span class="latest-category">Etkinlik</span>
                    <h3 class="latest-title">${event.title}</h3>
                    <p class="latest-description">${event.description.substring(0, 100)}...</p>
                    <div class="latest-meta">
                        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="fas fa-users"></i> ${event.participants.length}</span>
                    </div>
                </div>
            </div>
        `;
    }

    createAdCard(ad) {
        const date = new Date(ad.createdAt);
        const formattedDate = date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return `
            <div class="latest-card">
                <div class="latest-image">
                    <img src="${ad.image || 'https://source.unsplash.com/random/800x600/?product'}" alt="${ad.title}">
                </div>
                <div class="latest-content">
                    <span class="latest-category">İlan</span>
                    <h3 class="latest-title">${ad.title}</h3>
                    <p class="latest-description">${ad.description.substring(0, 100)}...</p>
                    <div class="latest-meta">
                        <span><i class="fas fa-clock"></i> ${formattedDate}</span>
                        <span><i class="fas fa-tag"></i> ${ad.price} TL</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Sayfa yüklendiğinde HomePage sınıfını başlat
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});

class HomeManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadLatestEvents();
        this.loadLatestAds();
        this.setupEventListeners();
    }

    loadLatestEvents() {
        const eventsContainer = document.getElementById('latestEvents');
        if (!eventsContainer) return;

        // Etkinlikleri localStorage'dan al
        const events = JSON.parse(localStorage.getItem('events')) || [];
        
        // Tarihe göre sırala ve en son eklenen 3 etkinliği al
        const latestEvents = events
            .sort((a, b) => b.id - a.id)
            .slice(0, 3);

        if (latestEvents.length === 0) {
            eventsContainer.innerHTML = `
                <div class="no-content">
                    <i class="fas fa-calendar-times"></i>
                    <p>Henüz etkinlik bulunmuyor.</p>
                </div>
            `;
            return;
        }

        eventsContainer.innerHTML = latestEvents.map(event => `
            <div class="content-card">
                <img src="${event.image}" alt="${event.title}" class="content-image">
                <div class="content-info">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <div class="content-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(event.date)}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadLatestAds() {
        const adsContainer = document.getElementById('latestAds');
        if (!adsContainer) return;

        // İlanları localStorage'dan al
        const ads = JSON.parse(localStorage.getItem('ads')) || [];
        
        // Tarihe göre sırala ve en son eklenen 3 ilanı al
        const latestAds = ads
            .sort((a, b) => b.id - a.id)
            .slice(0, 3);

        if (latestAds.length === 0) {
            adsContainer.innerHTML = `
                <div class="no-content">
                    <i class="fas fa-newspaper"></i>
                    <p>Henüz ilan bulunmuyor.</p>
                </div>
            `;
            return;
        }

        adsContainer.innerHTML = latestAds.map(ad => `
            <div class="content-card">
                <img src="${ad.image}" alt="${ad.title}" class="content-image">
                <div class="content-info">
                    <h3>${ad.title}</h3>
                    <p>${ad.description}</p>
                    <div class="content-meta">
                        <span><i class="fas fa-tag"></i> ${ad.price} TL</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${ad.location}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Mobil menü
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenu && navLinks) {
            mobileMenu.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

        // localStorage değişikliklerini dinle
        window.addEventListener('storage', (e) => {
            if (e.key === 'events' || e.key === 'ads') {
                this.loadLatestEvents();
                this.loadLatestAds();
            }
        });
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }
}

// HomeManager sınıfını başlat
const homeManager = new HomeManager(); 