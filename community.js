class CommunityManager {
    constructor() {
        this.posts = [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadPosts();
        this.setupEventListeners();
        this.updateCampusEvents();
    }

    loadPosts() {
        this.posts = JSON.parse(localStorage.getItem('communityPosts')) || [];
        this.applyFilter(this.currentFilter);
    }

    setupEventListeners() {
        // Gönderi oluşturma
        const createPostBtn = document.getElementById('createPost');
        if (createPostBtn) {
            createPostBtn.addEventListener('click', () => this.createPost());
        }

        // Gönderi araçları
        const addImageBtn = document.getElementById('addImage');
        if (addImageBtn) {
            addImageBtn.addEventListener('click', () => this.handleImageUpload());
        }

        const addEmojiBtn = document.getElementById('addEmoji');
        if (addEmojiBtn) {
            addEmojiBtn.addEventListener('click', () => this.showEmojiPicker());
        }

        const addLocationBtn = document.getElementById('addLocation');
        if (addLocationBtn) {
            addLocationBtn.addEventListener('click', () => this.addLocation());
        }

        // Filtreler
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.setActiveFilter(filter);
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

        // Konu etiketlerine tıklama
        const topicTags = document.querySelectorAll('.topic-tag');
        topicTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const topic = tag.textContent;
                this.filterPostsByTopic(topic);
            });
        });
    }

    setActiveFilter(filter) {
        this.currentFilter = filter;
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.applyFilter(filter);
    }

    applyFilter(filter) {
        let filteredPosts = [...this.posts];

        switch (filter) {
            case 'popular':
                filteredPosts.sort((a, b) => b.likes - a.likes);
                break;
            case 'recent':
                filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'following':
                if (this.currentUser) {
                    const following = this.currentUser.following || [];
                    filteredPosts = filteredPosts.filter(post => 
                        following.includes(post.author.id)
                    );
                }
                break;
        }

        this.displayPosts(filteredPosts);
    }

    handleImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const postInput = document.querySelector('.post-input');
                    postInput.value += `\n[Resim: ${file.name}]`;
                    // Gerçek uygulamada resmi sunucuya yükleyip URL'ini alacağız
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    showEmojiPicker() {
        // Emoji picker implementasyonu
        const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '👏', '🙌', '🤔'];
        const picker = document.createElement('div');
        picker.className = 'emoji-picker';
        picker.innerHTML = emojis.map(emoji => 
            `<span class="emoji">${emoji}</span>`
        ).join('');

        const postInput = document.querySelector('.post-input');
        picker.style.position = 'absolute';
        picker.style.top = `${postInput.offsetTop + postInput.offsetHeight}px`;
        picker.style.left = `${postInput.offsetLeft}px`;
        picker.style.background = 'white';
        picker.style.padding = '10px';
        picker.style.borderRadius = '5px';
        picker.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        picker.style.zIndex = '1000';

        document.body.appendChild(picker);

        picker.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji')) {
                postInput.value += e.target.textContent;
                picker.remove();
            }
        });

        document.addEventListener('click', (e) => {
            if (!picker.contains(e.target) && e.target !== document.getElementById('addEmoji')) {
                picker.remove();
            }
        });
    }

    addLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const postInput = document.querySelector('.post-input');
                    postInput.value += `\n[Konum: ${latitude}, ${longitude}]`;
                },
                (error) => {
                    this.showNotification('Konum alınamadı: ' + error.message, 'error');
                }
            );
        } else {
            this.showNotification('Tarayıcınız konum özelliğini desteklemiyor.', 'error');
        }
    }

    updateCampusEvents() {
        const campusEvents = document.getElementById('campusEvents');
        if (!campusEvents) return;

        // Örnek kampüs etkinlikleri
        const events = [
            { title: 'Kariyer Fuarı', date: '2024-03-15', location: 'Merkez Kampüs' },
            { title: 'Bahar Şenliği', date: '2024-04-20', location: 'Spor Kompleksi' },
            { title: 'Teknoloji Semineri', date: '2024-03-10', location: 'Mühendislik Fakültesi' }
        ];

        campusEvents.innerHTML = events.map(event => `
            <div class="campus-event">
                <div class="event-title">${event.title}</div>
                <div class="event-details">
                    <i class="fas fa-calendar"></i> ${this.formatDate(event.date)}
                    <br>
                    <i class="fas fa-map-marker-alt"></i> ${event.location}
                </div>
            </div>
        `).join('');
    }

    createPost() {
        if (!this.currentUser) {
            this.showNotification('Gönderi paylaşmak için giriş yapmalısınız.', 'error');
            return;
        }

        const postInput = document.querySelector('.post-input');
        const content = postInput.value.trim();

        if (!content) {
            this.showNotification('Gönderi içeriği boş olamaz.', 'error');
            return;
        }

        const newPost = {
            id: Date.now(),
            content: content,
            author: {
                id: this.currentUser.id,
                name: this.currentUser.name,
                avatar: this.currentUser.avatar || 'https://via.placeholder.com/40'
            },
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: [],
            image: null // İleride resim yükleme özelliği eklenebilir
        };

        this.posts.unshift(newPost);
        this.savePosts();
        this.displayPosts();
        postInput.value = '';
        this.showNotification('Gönderiniz başarıyla paylaşıldı!', 'success');
    }

    displayPosts(posts) {
        const postList = document.getElementById('postList');
        if (!postList) return;

        if (!posts || posts.length === 0) {
            postList.innerHTML = `
                <div class="post-card">
                    <p class="text-center">Henüz gönderi bulunmuyor. İlk gönderiyi sen paylaş!</p>
                </div>
            `;
            return;
        }

        postList.innerHTML = posts.map(post => `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="user-avatar">
                    <div class="post-info">
                        <div class="post-author">${post.author.name}</div>
                        <div class="post-time">${this.formatTime(post.timestamp)}</div>
                    </div>
                </div>
                <div class="post-content">${this.formatContent(post.content)}</div>
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
                <div class="post-actions">
                    <button class="action-btn" onclick="communityManager.likePost(${post.id})">
                        <i class="fas fa-heart"></i> ${post.likes}
                    </button>
                    <button class="action-btn" onclick="communityManager.showComments(${post.id})">
                        <i class="fas fa-comment"></i> ${post.comments.length}
                    </button>
                    ${this.currentUser && post.author.id === this.currentUser.id ? `
                        <button class="action-btn" onclick="communityManager.deletePost(${post.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
                <div class="comments-section" id="comments-${post.id}" style="display: none;">
                    <div class="comments-list"></div>
                    <div class="comment-input">
                        <input type="text" placeholder="Yorum yaz..." class="comment-text">
                        <button class="btn-primary" onclick="communityManager.addComment(${post.id})">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatContent(content) {
        // Hashtag'leri ve linkleri formatla
        return content
            .replace(/#(\w+)/g, '<span class="hashtag">#$1</span>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} gün önce`;
        if (hours > 0) return `${hours} saat önce`;
        if (minutes > 0) return `${minutes} dakika önce`;
        return 'Az önce';
    }

    likePost(postId) {
        if (!this.currentUser) {
            this.showNotification('Beğenmek için giriş yapmalısınız.', 'error');
            return;
        }

        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            this.savePosts();
            this.displayPosts();
        }
    }

    showComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        if (commentsSection) {
            commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
            if (commentsSection.style.display === 'block') {
                this.loadComments(postId);
            }
        }
    }

    loadComments(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const commentsList = document.querySelector(`#comments-${postId} .comments-list`);
        if (!commentsList) return;

        commentsList.innerHTML = post.comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <img src="${comment.author.avatar}" alt="${comment.author.name}" class="user-avatar">
                    <div class="comment-info">
                        <div class="comment-author">${comment.author.name}</div>
                        <div class="comment-time">${this.formatTime(comment.timestamp)}</div>
                    </div>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `).join('');
    }

    addComment(postId) {
        if (!this.currentUser) {
            this.showNotification('Yorum yapmak için giriş yapmalısınız.', 'error');
            return;
        }

        const commentInput = document.querySelector(`#comments-${postId} .comment-text`);
        const content = commentInput.value.trim();

        if (!content) {
            this.showNotification('Yorum içeriği boş olamaz.', 'error');
            return;
        }

        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                id: Date.now(),
                content: content,
                author: {
                    id: this.currentUser.id,
                    name: this.currentUser.name,
                    avatar: this.currentUser.avatar || 'https://via.placeholder.com/40'
                },
                timestamp: new Date().toISOString()
            });

            this.savePosts();
            this.loadComments(postId);
            commentInput.value = '';
            this.showNotification('Yorumunuz başarıyla eklendi!', 'success');
        }
    }

    deletePost(postId) {
        if (!this.currentUser) {
            this.showNotification('Gönderi silmek için giriş yapmalısınız.', 'error');
            return;
        }

        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            this.showNotification('Gönderi bulunamadı.', 'error');
            return;
        }

        if (post.author.id !== this.currentUser.id) {
            this.showNotification('Sadece kendi gönderilerinizi silebilirsiniz.', 'error');
            return;
        }

        if (confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) {
            this.posts = this.posts.filter(p => p.id !== postId);
            this.savePosts();
            this.displayPosts(this.posts); // Doğrudan posts dizisini gönder
            this.showNotification('Gönderi başarıyla silindi!', 'success');
        }
    }

    filterPostsByTopic(topic) {
        const filteredPosts = this.posts.filter(post => 
            post.content.toLowerCase().includes(topic.toLowerCase())
        );
        this.displayFilteredPosts(filteredPosts);
    }

    displayFilteredPosts(posts) {
        const postList = document.getElementById('postList');
        if (!postList) return;

        if (posts.length === 0) {
            postList.innerHTML = `
                <div class="post-card">
                    <p class="text-center">Bu konuda gönderi bulunamadı.</p>
                </div>
            `;
            return;
        }

        // Mevcut displayPosts mantığını kullanarak filtrelenmiş gönderileri göster
        this.posts = posts;
        this.displayPosts();
    }

    savePosts() {
        localStorage.setItem('communityPosts', JSON.stringify(this.posts));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// CommunityManager sınıfını başlat
const communityManager = new CommunityManager(); 