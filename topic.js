// Konu detay yönetimi sınıfı
class TopicManager {
    constructor() {
        this.currentUser = null;
        this.topicId = new URLSearchParams(window.location.search).get('id');
        this.init();
    }

    init() {
        this.loadUserData();
        this.loadTopic();
        this.setupEventListeners();
    }

    loadUserData() {
        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            window.location.href = 'login.html';
            return;
        }
        this.currentUser = JSON.parse(userData);
    }

    loadTopic() {
        // Önce forumTopics'dan kontrol et
        let topics = JSON.parse(localStorage.getItem('forumTopics') || '[]');
        let topic = topics.find(t => t.id === this.topicId);

        // Eğer forumTopics'da yoksa topics'dan kontrol et
        if (!topic) {
            topics = JSON.parse(localStorage.getItem('topics') || '[]');
            topic = topics.find(t => t.id === this.topicId);
        }

        if (!topic) {
            this.showError('Konu bulunamadı!');
            setTimeout(() => {
                window.location.href = 'forum.html';
            }, 2000);
            return;
        }

        // Konu bilgilerini göster
        document.getElementById('topicTitle').textContent = topic.title;
        document.getElementById('topicAuthor').textContent = topic.author;
        document.getElementById('topicDate').textContent = this.formatDate(topic.date || topic.createdAt);
        document.getElementById('topicContent').textContent = topic.content;
        document.getElementById('topicViews').textContent = topic.views || 0;
        document.getElementById('replyCount').textContent = topic.replies ? topic.replies.length : 0;
        document.getElementById('likeCount').textContent = topic.likes || 0;

        // Etiketleri göster
        const tagsContainer = document.getElementById('topicTags');
        tagsContainer.innerHTML = topic.tags ? topic.tags.map(tag => `
            <span class="topic-tag">${tag}</span>
        `).join('') : '';

        // Yorumları göster
        this.displayReplies(topic.replies || []);
    }

    setupEventListeners() {
        const replyForm = document.getElementById('replyForm');
        replyForm.addEventListener('submit', (e) => this.handleReplySubmit(e));
    }

    handleReplySubmit(e) {
        e.preventDefault();

        if (!this.currentUser) {
            this.showError('Yorum yapmak için giriş yapmalısınız!');
            return;
        }

        const replyContent = document.getElementById('replyContent').value.trim();
        if (!replyContent) {
            this.showError('Lütfen bir yorum yazın!');
            return;
        }

        // Önce forumTopics'dan kontrol et
        let topics = JSON.parse(localStorage.getItem('forumTopics') || '[]');
        let topicIndex = topics.findIndex(t => t.id === this.topicId);

        // Eğer forumTopics'da yoksa topics'dan kontrol et
        if (topicIndex === -1) {
            topics = JSON.parse(localStorage.getItem('topics') || '[]');
            topicIndex = topics.findIndex(t => t.id === this.topicId);
        }

        if (topicIndex === -1) {
            this.showError('Konu bulunamadı!');
            return;
        }

        const newReply = {
            id: Date.now().toString(),
            content: replyContent,
            author: this.currentUser.name,
            authorId: this.currentUser.id,
            date: new Date().toISOString(),
            likes: 0
        };

        if (!topics[topicIndex].replies) {
            topics[topicIndex].replies = [];
        }

        topics[topicIndex].replies.push(newReply);
        
        // Her iki localStorage'a da kaydet
        localStorage.setItem('forumTopics', JSON.stringify(topics));
        localStorage.setItem('topics', JSON.stringify(topics));

        // Yorum listesini güncelle
        this.displayReplies(topics[topicIndex].replies);

        // Formu temizle
        document.getElementById('replyContent').value = '';
        this.showSuccess('Yorumunuz başarıyla eklendi!');
    }

    displayReplies(replies) {
        const replyList = document.getElementById('replyList');
        if (replies.length === 0) {
            replyList.innerHTML = '<p class="no-replies">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>';
            return;
        }

        replyList.innerHTML = replies.map(reply => `
            <div class="reply-card">
                <div class="reply-header">
                    <div class="reply-author">
                        <img src="${this.getUserAvatar(reply.authorId)}" alt="${reply.author}" class="reply-avatar">
                        <div class="reply-info">
                            <span class="reply-name">${reply.author}</span>
                            <span class="reply-date">${this.formatDate(reply.date)}</span>
                        </div>
                    </div>
                </div>
                <div class="reply-content">${reply.content}</div>
                <div class="reply-actions">
                    <span class="reply-action" onclick="topicManager.likeReply('${reply.id}')">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${reply.likes || 0}</span>
                    </span>
                </div>
            </div>
        `).join('');
    }

    getUserAvatar(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === userId);
        return user && user.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(userId)}&background=4a90e2&color=fff`;
    }

    formatDate(dateString) {
        if (!dateString) return 'Tarih belirtilmemiş';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showSuccess(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Topic yöneticisini başlat
const topicManager = new TopicManager(); 