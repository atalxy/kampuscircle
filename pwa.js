if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker başarıyla kaydedildi:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker kaydı başarısız:', error);
            });
    });
} 