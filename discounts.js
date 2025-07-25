class DiscountManager {
    constructor() {
        this.discounts = [];
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.loadDiscounts();
        this.setupEventListeners();
    }

    loadDiscounts() {
        // Örnek indirim verileri
        this.discounts = [
            {
                id: 1,
                title: 'Öğrenci Menü İndirimi',
                description: 'Öğrenci kimliğinizi göstererek tüm menülerde %20 indirim!',
                category: 'food',
                discount: '%20',
                code: 'OGRENCI20',
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
                expiryDate: '2025-12-31',
                partner: 'Burger King'
            },
            {
                id: 2,
                title: 'Kitap İndirimi',
                description: 'Tüm akademik kitaplarda %15 indirim fırsatı!',
                category: 'education',
                discount: '%15',
                code: 'KITAP15',
                image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
                expiryDate: '2025-12-31',
                partner: 'D&R'
            },
            {
                id: 3,
                title: 'Sinema İndirimi',
                description: 'Hafta içi tüm seanslarda öğrenci bileti %25 indirimli!',
                category: 'entertainment',
                discount: '%25',
                code: 'SINEMA25',
                image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26',
                expiryDate: '2025-12-31',
                partner: 'CinemaMax'
            },
            {
                id: 4,
                title: 'Teknoloji İndirimi',
                description: 'Seçili teknoloji ürünlerinde öğrencilere özel %10 indirim!',
                category: 'technology',
                discount: '%10',
                code: 'TEKNO10',
                image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03',
                expiryDate: '2025-12-31',
                partner: 'TeknoStore'
            },
            {
                id: 5,
                title: 'Kahve İndirimi',
                description: 'Tüm kahve çeşitlerinde %30 indirim!',
                category: 'food',
                discount: '%30',
                code: 'KAHVE30',
                image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
                expiryDate: '2025-12-31',
                partner: 'Coffee House'
            },
            {
                id: 6,
                title: 'Spor Salonu İndirimi',
                description: 'Aylık üyeliklerde %40 indirim fırsatı!',
                category: 'entertainment',
                discount: '%40',
                code: 'SPOR40',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
                expiryDate: '2025-12-31',
                partner: 'FitLife'
            },
            {
                id: 7,
                title: 'Uçak Bileti İndirimi',
                description: 'Yurt içi uçuşlarda %15 indirim!',
                category: 'travel',
                discount: '%15',
                code: 'UCUS15',
                image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
                expiryDate: '2025-12-31',
                partner: 'SkyWings'
            },
            {
                id: 8,
                title: 'Giyim İndirimi',
                description: 'Seçili giyim ürünlerinde %25 indirim!',
                category: 'shopping',
                discount: '%25',
                code: 'GIYIM25',
                image: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
                expiryDate: '2025-12-31',
                partner: 'Style Store'
            },
            {
                id: 9,
                title: 'Müzik Kursu İndirimi',
                description: 'Tüm müzik kurslarında %35 indirim!',
                category: 'education',
                discount: '%35',
                code: 'MUZIK35',
                image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
                expiryDate: '2025-12-31',
                partner: 'Music Academy'
            },
            {
                id: 10,
                title: 'Tren Bileti İndirimi',
                description: 'Yurt içi tren biletlerinde %20 indirim!',
                category: 'travel',
                discount: '%20',
                code: 'TREN20',
                image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3',
                expiryDate: '2025-12-31',
                partner: 'RailWay'
            },
            {
                id: 11,
                title: 'Bilgisayar İndirimi',
                description: 'Seçili bilgisayarlarda %15 indirim!',
                category: 'technology',
                discount: '%15',
                code: 'PC15',
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
                expiryDate: '2025-12-31',
                partner: 'TechStore'
            }
        ];

        this.displayDiscounts();
    }

    setupEventListeners() {
        // Kategori filtreleme
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentCategory = button.dataset.category;
                this.displayDiscounts();
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

    displayDiscounts() {
        const grid = document.getElementById('discountGrid');
        const filteredDiscounts = this.currentCategory === 'all' 
            ? this.discounts 
            : this.discounts.filter(discount => discount.category === this.currentCategory);

        grid.innerHTML = filteredDiscounts.map(discount => `
            <div class="discount-card">
                <img src="${discount.image}" alt="${discount.title}" class="discount-image">
                <div class="discount-content">
                    <span class="discount-badge">${discount.discount} İndirim</span>
                    <h3 class="discount-title">${discount.title}</h3>
                    <p class="discount-description">${discount.description}</p>
                    <div class="discount-meta">
                        <span><i class="fas fa-store"></i> ${discount.partner}</span>
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(discount.expiryDate)}</span>
                    </div>
                    <div class="discount-code" onclick="discountManager.copyCode('${discount.code}')">
                        ${discount.code}
                    </div>
                    <div class="discount-actions">
                        <a href="#" class="btn btn-primary" onclick="discountManager.useDiscount('${discount.id}')">
                            <i class="fas fa-ticket-alt"></i> Kullan
                        </a>
                        <button class="btn btn-outline" onclick="discountManager.saveDiscount('${discount.id}')">
                            <i class="fas fa-bookmark"></i> Kaydet
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    copyCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification('Kupon kodu kopyalandı!', 'success');
        }).catch(() => {
            this.showNotification('Kupon kodu kopyalanamadı!', 'error');
        });
    }

    useDiscount(discountId) {
        const discount = this.discounts.find(d => d.id === parseInt(discountId));
        if (discount) {
            this.showNotification(`${discount.title} kuponu kullanıldı!`, 'success');
        }
    }

    saveDiscount(discountId) {
        const discount = this.discounts.find(d => d.id === parseInt(discountId));
        if (discount) {
            const savedDiscounts = JSON.parse(localStorage.getItem('savedDiscounts') || '[]');
            if (!savedDiscounts.some(d => d.id === discount.id)) {
                savedDiscounts.push(discount);
                localStorage.setItem('savedDiscounts', JSON.stringify(savedDiscounts));
                this.showNotification('İndirim kaydedildi!', 'success');
            } else {
                this.showNotification('Bu indirim zaten kaydedilmiş!', 'info');
            }
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
}

// İndirim yöneticisini başlat
const discountManager = new DiscountManager(); 