// Forum yönetimi sınıfı
class ForumManager {
    constructor() {
        // Konuları localStorage'dan yükle veya varsayılan konuları kullan
        this.topics = JSON.parse(localStorage.getItem('forumTopics'));
        if (!this.topics || this.topics.length === 0) {
            this.topics = this.getDefaultTopics();
            localStorage.setItem('forumTopics', JSON.stringify(this.topics));
        }

        this.categories = [
            {
                id: 'academic',
                title: 'Akademik',
                icon: 'graduation-cap',
                description: 'Dersler, ödevler ve akademik konular hakkında tartışmalar.',
                topics: this.topics.filter(t => t.category === 'academic').length,
                messages: this.topics.filter(t => t.category === 'academic').reduce((acc, t) => acc + (t.replies ? t.replies.length : 0), 0)
            },
            {
                id: 'student-life',
                title: 'Öğrenci Hayatı',
                icon: 'users',
                description: 'Kampüs hayatı, sosyal aktiviteler ve öğrenci deneyimleri.',
                topics: this.topics.filter(t => t.category === 'student-life').length,
                messages: this.topics.filter(t => t.category === 'student-life').reduce((acc, t) => acc + (t.replies ? t.replies.length : 0), 0)
            },
            {
                id: 'career',
                title: 'Kariyer',
                icon: 'briefcase',
                description: 'Staj, iş fırsatları ve kariyer gelişimi hakkında bilgiler.',
                topics: this.topics.filter(t => t.category === 'career').length,
                messages: this.topics.filter(t => t.category === 'career').reduce((acc, t) => acc + (t.replies ? t.replies.length : 0), 0)
            },
            {
                id: 'technical',
                title: 'Teknik',
                icon: 'code',
                description: 'Teknik konular, yazılım ve donanım hakkında tartışmalar.',
                topics: this.topics.filter(t => t.category === 'technical').length,
                messages: this.topics.filter(t => t.category === 'technical').reduce((acc, t) => acc + (t.replies ? t.replies.length : 0), 0)
            }
        ];
        this.currentCategory = '';
        this.currentSort = 'newest';
        this.searchQuery = '';
        this.init();
    }

    getDefaultTopics() {
        return [
            {
                id: '1',
                title: 'Web Geliştirme Temelleri',
                content: 'Web geliştirme öğrenmeye nereden başlamalıyım? HTML, CSS ve JavaScript için kaynak önerileri olan var mı?',
                author: 'Mehmet Yılmaz',
                authorId: 'user1',
                createdAt: '2024-05-10T10:00:00Z',
                views: 120,
                replies: [
                    {
                        id: '101',
                        content: 'FreeCodeCamp ve The Odin Project harika başlangıç noktalarıdır.',
                        author: 'Ayşe Demir',
                        authorId: 'user2',
                        date: '2024-05-10T11:00:00Z',
                        likes: 5
                    }
                ],
                category: 'technical',
                tags: ['web', 'javascript', 'html', 'css']
            },
            {
                id: '2',
                title: 'Üniversite Hayatına Uyum',
                content: 'Yeni üniversiteye başlayanlar için tavsiyeleriniz nelerdir? Kampüse adaptasyon süreci nasıl daha kolay atlatılır?',
                author: 'Zeynep Kaya',
                authorId: 'user3',
                createdAt: '2024-05-12T14:30:00Z',
                views: 85,
                replies: [
                    {
                        id: '201',
                        content: 'Kulüplere katılmak ve sosyalleşmek çok önemli! Yeni arkadaşlıklar kurmak adaptasyonu hızlandırır.',
                        author: 'Ali Can',
                        authorId: 'user4',
                        date: '2024-05-12T15:00:00Z',
                        likes: 8
                    },
                    {
                        id: '202',
                        content: 'Derslere düzenli gitmek ve not tutmak akademik başarı için şart.',
                        author: 'Elif Koç',
                        authorId: 'user5',
                        date: '2024-05-12T16:00:00Z',
                        likes: 3
                    }
                ],
                category: 'student-life',
                tags: ['üniversite', 'öğrenci', 'uyum']
            },
            {
                id: '3',
                title: 'Staj Başvuruları ve Mülakat İpuçları',
                content: 'Yaz dönemi staj başvuruları yaklaşıyor. İyi bir CV ve mülakat için nelere dikkat etmeliyiz?',
                author: 'Can Ergün',
                authorId: 'user6',
                createdAt: '2024-05-15T09:15:00Z',
                views: 200,
                replies: [],
                category: 'career',
                tags: ['staj', 'kariyer', 'mülakat', 'cv']
            }
        ];
    }

    init() {
        this.displayCategories();
        this.displayTopics();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Arama kutusu
        const searchInput = document.getElementById('topicSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.displayTopics();
            });
        }

        // Kategori filtresi
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.displayTopics();
            });
        }

        // Sıralama filtresi
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.displayTopics();
            });
        }

        // Kategori kartlarına tıklama
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (categoriesGrid) {
            categoriesGrid.addEventListener('click', (e) => {
                const categoryCard = e.target.closest('.category-card');
                if (categoryCard) {
                    const categoryId = categoryCard.dataset.category;
                    this.currentCategory = categoryId;
                    if (categoryFilter) categoryFilter.value = categoryId;
                    this.displayTopics();
                }
            });
        }

        // Konu kartlarına tıklama
        const topicsList = document.getElementById('topicsList');
        if (topicsList) {
            topicsList.addEventListener('click', (e) => {
                const topicCard = e.target.closest('.topic-card');
                if (topicCard) {
                    const topicId = topicCard.dataset.topic;
                    if (e.target.closest('.topic-actions')) {
                        return; // Eğer tıklanan yer aksiyon butonlarıysa işlem yapma
                    }
                    this.openTopic(topicId);
                }
            });
        }
    }

    displayCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = this.categories.map(category => `
            <div class="category-card" data-category="${category.id}">
                <div class="category-icon">
                    <i class="fas fa-${category.icon}"></i>
                </div>
                <h3 class="category-title">${category.title}</h3>
                <p class="category-description">${category.description}</p>
                <div class="category-stats">
                    <div class="category-stat">
                        <i class="fas fa-comments"></i>
                        <span>${category.topics} Konu</span>
                    </div>
                    <div class="category-stat">
                        <i class="fas fa-reply"></i>
                        <span>${category.messages} Mesaj</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayTopics() {
        const topicsList = document.getElementById('topicsList');
        if (!topicsList) return;

        let filteredTopics = [...this.topics];

        // Kategori filtresi
        if (this.currentCategory) {
            filteredTopics = filteredTopics.filter(topic => topic.category === this.currentCategory);
        }

        // Arama filtresi
        if (this.searchQuery) {
            filteredTopics = filteredTopics.filter(topic => 
                topic.title.toLowerCase().includes(this.searchQuery) ||
                topic.content.toLowerCase().includes(this.searchQuery)
            );
        }

        // Sıralama
        switch (this.currentSort) {
            case 'newest':
                filteredTopics.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                filteredTopics.sort((a, b) => b.views - a.views);
                break;
            case 'active':
                filteredTopics.sort((a, b) => {
                    const aLastReply = a.replies.length > 0 ? new Date(a.replies[a.replies.length - 1].createdAt) : new Date(a.createdAt);
                    const bLastReply = b.replies.length > 0 ? new Date(b.replies[b.replies.length - 1].createdAt) : new Date(b.createdAt);
                    return bLastReply - aLastReply;
                });
                break;
        }

        if (filteredTopics.length === 0) {
            topicsList.innerHTML = `
                <div class="no-topics">
                    <i class="fas fa-comments"></i>
                    <p>Henüz konu bulunmuyor.</p>
                    <a href="new-topic.html" class="btn-new-topic">
                        <i class="fas fa-plus"></i>
                        Yeni Konu Aç
                    </a>
                </div>
            `;
            return;
        }

        topicsList.innerHTML = filteredTopics.map(topic => `
            <div class="topic-card" data-topic="${topic.id}">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(topic.author)}&background=random" 
                     alt="${topic.author}" 
                     class="topic-avatar">
                <div class="topic-content">
                    <h3 class="topic-title">${topic.title}</h3>
                    <div class="topic-meta">
                        <span><i class="fas fa-user"></i> ${topic.author}</span>
                        <span><i class="fas fa-clock"></i> ${this.formatDate(topic.createdAt)}</span>
                        <span><i class="fas fa-folder"></i> ${this.getCategoryTitle(topic.category)}</span>
                    </div>
                    <div class="topic-tags">
                        ${topic.tags.map(tag => `<span class="topic-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="topic-stats">
                    <div class="topic-stat">
                        <i class="fas fa-eye"></i>
                        <span>${topic.views}</span>
                    </div>
                    <div class="topic-stat">
                        <i class="fas fa-comments"></i>
                        <span>${topic.replies.length}</span>
                    </div>
                    ${this.canEditTopic(topic) ? `
                        <div class="topic-actions">
                            <button class="btn-edit" onclick="forumManager.editTopic('${topic.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" onclick="forumManager.deleteTopic('${topic.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    openTopic(topicId) {
        const topic = this.topics.find(t => t.id === topicId);
        if (topic) {
            // Görüntülenme sayısını artır
            topic.views++;
            localStorage.setItem('forumTopics', JSON.stringify(this.topics));
            
            // Konu detay sayfasına yönlendir
            window.location.href = `topic.html?id=${topicId}`;
        }
    }

    getCategoryTitle(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.title : categoryId;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        // Son 24 saat içindeyse
        if (diff < 24 * 60 * 60 * 1000) {
            const hours = Math.floor(diff / (60 * 60 * 1000));
            if (hours === 0) {
                const minutes = Math.floor(diff / (60 * 1000));
                return `${minutes} dakika önce`;
            }
            return `${hours} saat önce`;
        }

        // Son 7 gün içindeyse
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            const days = Math.floor(diff / (24 * 60 * 60 * 1000));
            return `${days} gün önce`;
        }

        // Daha eskiyse
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    canEditTopic(topic) {
        return auth.isAuthenticated() && auth.currentUser.id === topic.authorId;
    }

    editTopic(topicId) {
        const topic = this.topics.find(t => t.id === topicId);
        if (!topic) return;

        const newTitle = prompt('Konu başlığını düzenleyin:', topic.title);
        if (!newTitle) return;

        const newContent = prompt('Konu içeriğini düzenleyin:', topic.content);
        if (!newContent) return;

        try {
            topic.title = newTitle;
            topic.content = newContent;
            topic.updatedAt = new Date().toISOString();
            
            localStorage.setItem('forumTopics', JSON.stringify(this.topics));
            this.displayTopics();
            
            auth.showNotification('Konu başarıyla güncellendi!', 'success');
        } catch (error) {
            console.error('Konu güncellenirken hata oluştu:', error);
            auth.showNotification('Konu güncellenirken bir hata oluştu!', 'error');
        }
    }

    deleteTopic(topicId) {
        if (!confirm('Bu konuyu silmek istediğinizden emin misiniz?')) return;

        try {
            this.topics = this.topics.filter(t => t.id !== topicId);
            localStorage.setItem('forumTopics', JSON.stringify(this.topics));
            
            this.displayTopics();
            auth.showNotification('Konu başarıyla silindi!', 'success');
        } catch (error) {
            console.error('Konu silinirken hata oluştu:', error);
            auth.showNotification('Konu silinirken bir hata oluştu!', 'error');
        }
    }
}

// Forum yöneticisini başlat
const forumManager = new ForumManager(); 