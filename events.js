// Etkinlik yönetimi sınıfı
class EventManager {
    constructor() {
        this.events = [];
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        // Sayfa yüklendiğinde etkinlikleri yükle
        this.loadEvents();
        // Form submit olaylarını dinle
        this.setupEventListeners();
        this.setupModalListeners();
    }

    setupEventListeners() {
        // Etkinlik ekleme formu
        const eventForm = document.getElementById('eventForm');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => this.handleEventSubmit(e));
        }

        // Etkinlik arama
        const searchInput = document.getElementById('eventSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Kategori filtreleme
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentCategory = button.dataset.category;
                this.displayEvents();
            });
        });

        // Mobil menü
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenu && navLinks) {
            mobileMenu.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    }

    setupModalListeners() {
        const modal = document.getElementById('eventFormModal');
        const closeBtn = modal.querySelector('.close');

        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    showEventForm() {
        const modal = document.getElementById('eventFormModal');
        modal.style.display = 'block';
        
        // Tarih alanını 2025 yılı için sınırla
        const dateInput = document.getElementById('date');
        dateInput.min = '2025-01-01';
        dateInput.max = '2025-12-31';
    }

    loadEvents() {
        // Örnek etkinlik verileri
        this.events = [
            {
                id: 1,
                title: 'Yazılım Geliştirme Atölyesi',
                description: 'Web geliştirme ve mobil uygulama geliştirme konularında pratik yapma fırsatı!',
                category: 'academic',
                university: 'istanbul-teknik-universitesi',
                date: '2025-04-15',
                time: '14:00',
                location: 'Mühendislik Fakültesi, D-101',
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
                organizer: 'Bilgisayar Topluluğu',
                contact: {
                    email: 'bilgisayar@example.com',
                    phone: '0212 123 4567'
                },
                coordinates: {
                    lat: 41.1039,
                    lng: 29.0202
                }
            },
            {
                id: 2,
                title: 'Kampüs Müzik Festivali',
                description: 'Öğrenci gruplarının performansları ve canlı müzik!',
                category: 'culture',
                university: 'bogazici-universitesi',
                date: '2025-04-20',
                time: '18:00',
                location: 'Merkez Kampüs, Açık Hava Tiyatrosu',
                image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
                organizer: 'Müzik Kulübü',
                contact: {
                    email: 'muzik@example.com',
                    phone: '0212 123 4568'
                },
                coordinates: {
                    lat: 41.0878,
                    lng: 29.0433
                }
            },
            {
                id: 3,
                title: 'Kariyer Günleri',
                description: 'Şirket temsilcileriyle tanışma ve iş fırsatları!',
                category: 'career',
                university: 'istanbul-universitesi',
                date: '2025-04-25',
                time: '10:00',
                location: 'Kongre Merkezi',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
                organizer: 'Kariyer Merkezi',
                contact: {
                    email: 'kariyer@example.com',
                    phone: '0212 123 4569'
                },
                coordinates: {
                    lat: 41.0117,
                    lng: 28.9660
                }
            }
        ];

        this.displayEvents();
    }

    displayEvents() {
        const grid = document.getElementById('eventGrid');
        const filteredEvents = this.currentCategory === 'all' 
            ? this.events 
            : this.events.filter(event => event.category === this.currentCategory);

        grid.innerHTML = filteredEvents.map(event => `
            <div class="event-card">
                <img src="${event.image}" alt="${event.title}" class="event-image">
                <div class="event-content">
                    <span class="event-badge">${this.getCategoryName(event.category)}</span>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(event.date)}</span>
                        <span><i class="fas fa-clock"></i> ${event.time}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        <span><i class="fas fa-university"></i> ${this.getUniversityName(event.university)}</span>
                        <span><i class="fas fa-user"></i> ${event.organizer}</span>
                    </div>
                    <div class="event-contact">
                        <h4>İletişim Bilgileri</h4>
                        <p><i class="fas fa-envelope"></i> ${event.contact.email}</p>
                        <p><i class="fas fa-phone"></i> ${event.contact.phone}</p>
                    </div>
                    <div class="event-map">
                        <iframe
                            width="100%"
                            height="200"
                            frameborder="0"
                            style="border:0"
                            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD_278YXMt1ll1canRQN1nLrJmIg5B0_fg&q=${event.coordinates.lat},${event.coordinates.lng}"
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div class="event-actions">
                        <a href="#" class="btn btn-primary" onclick="eventManager.joinEvent(${event.id})">
                            <i class="fas fa-user-plus"></i> Katıl
                        </a>
                        <button class="btn btn-outline" onclick="eventManager.saveEvent(${event.id})">
                            <i class="fas fa-bookmark"></i> Kaydet
                        </button>
                        <button class="btn btn-outline" onclick="eventManager.editEvent(${event.id})">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                        <button class="btn btn-outline" onclick="eventManager.deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i> Sil
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getCategoryName(category) {
        const categories = {
            'academic': 'Akademik',
            'social': 'Sosyal',
            'sports': 'Spor',
            'culture': 'Kültür & Sanat',
            'career': 'Kariyer'
        };
        return categories[category] || category;
    }

    getUniversityName(university) {
        const universities = {
            'istanbul-teknik-universitesi': 'İstanbul Teknik Üniversitesi',
            'bogazici-universitesi': 'Boğaziçi Üniversitesi',
            'istanbul-universitesi': 'İstanbul Üniversitesi',
            'yildiz-teknik-universitesi': 'Yıldız Teknik Üniversitesi',
            'marmara-universitesi': 'Marmara Üniversitesi'
        };
        return universities[university] || university;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    async handleEventSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const eventData = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            university: formData.get('university'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            image: formData.get('image') ? URL.createObjectURL(formData.get('image')) : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
            organizer: 'Kullanıcı Adı', // Kullanıcı adı buraya gelecek
            contact: {
                email: formData.get('contactEmail'),
                phone: formData.get('contactPhone')
            },
            coordinates: {
                // Gerçek dünya koordinatları için konumdan geocoding API kullanılması gerekir.
                // Şimdilik yeni etkinlikler için varsayılan olarak Sultanahmet Meydanı koordinatları kullanılıyor.
                lat: 41.0054,
                lng: 28.9768
            }
        };

        try {
            // Etkinliği dizinin başına ekle
            this.events.unshift(eventData);
            
            // Etkinlikleri localStorage'a kaydet
            localStorage.setItem('events', JSON.stringify(this.events));
            
            // Etkinlikleri yeniden göster
            this.displayEvents();
            
            // Formu kapat
            document.getElementById('eventFormModal').style.display = 'none';
            
            // Bildirim göster
            this.showNotification('Etkinlik başarıyla eklendi!', 'success');
            
            // Formu sıfırla
            e.target.reset();
        } catch (error) {
            console.error('Etkinlik eklenirken hata oluştu:', error);
            this.showNotification('Etkinlik eklenirken bir hata oluştu!', 'error');
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEvents = this.events.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm)
        );
        this.displayEvents();
    }

    joinEvent(eventId) {
        if (!auth.isAuthenticated()) {
            auth.showNotification('Etkinliğe katılmak için giriş yapmalısınız!', 'warning');
            return;
        }

        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const userIndex = event.participants.indexOf(auth.currentUser.id);
        if (userIndex === -1) {
            event.participants.push(auth.currentUser.id);
            this.showNotification('Etkinliğe başarıyla katıldınız!', 'success');
        } else {
            event.participants.splice(userIndex, 1);
            this.showNotification('Etkinlikten ayrıldınız!', 'info');
        }

        localStorage.setItem('events', JSON.stringify(this.events));
        this.displayEvents();
    }

    saveEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            const savedEvents = JSON.parse(localStorage.getItem('savedEvents') || '[]');
            if (!savedEvents.some(e => e.id === event.id)) {
                savedEvents.push(event);
                localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
                this.showNotification('Etkinlik kaydedildi!', 'success');
            } else {
                this.showNotification('Bu etkinlik zaten kaydedilmiş!', 'info');
            }
        }
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Form alanlarını doldur
        const form = document.getElementById('eventForm');
        form.title.value = event.title;
        form.description.value = event.description;
        form.university.value = event.university;
        form.category.value = event.category;
        form.date.value = event.date;
        form.time.value = event.time;
        form.location.value = event.location;
        form.contactEmail.value = event.contact.email;
        form.contactPhone.value = event.contact.phone;

        // Form submit olayını güncelle
        form.onsubmit = (e) => {
            e.preventDefault();
            this.updateEvent(eventId, new FormData(form));
        };

        // Modalı göster
        const modal = document.getElementById('eventFormModal');
        modal.style.display = 'block';
        
        // Başlığı güncelle
        modal.querySelector('h2').textContent = 'Etkinliği Düzenle';
        
        // Submit butonunu güncelle
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Güncelle';
    }

    updateEvent(eventId, formData) {
        const eventIndex = this.events.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return;

        const updatedEvent = {
            ...this.events[eventIndex],
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            university: formData.get('university'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            contact: {
                email: formData.get('contactEmail'),
                phone: formData.get('contactPhone')
            },
            coordinates: {
                // Güncellenen etkinlikler için varsayılan olarak Sultanahmet Meydanı koordinatları kullanılıyor.
                lat: 41.0054,
                lng: 28.9768
            }
        };

        this.events[eventIndex] = updatedEvent;
        localStorage.setItem('events', JSON.stringify(this.events));
        this.displayEvents();

        // Formu kapat ve sıfırla
        document.getElementById('eventFormModal').style.display = 'none';
        document.getElementById('eventForm').reset();
        
        // Başlığı ve butonu eski haline getir
        const modal = document.getElementById('eventFormModal');
        modal.querySelector('h2').textContent = 'Yeni Etkinlik Ekle';
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Etkinlik Ekle';

        this.showNotification('Etkinlik başarıyla güncellendi!', 'success');
    }

    deleteEvent(eventId) {
        if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
            this.events = this.events.filter(e => e.id !== eventId);
            localStorage.setItem('events', JSON.stringify(this.events));
            this.displayEvents();
            this.showNotification('Etkinlik başarıyla silindi!', 'success');
        }
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
}

// EventManager sınıfını başlat
const eventManager = new EventManager(); 