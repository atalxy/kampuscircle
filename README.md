# KampüsCircle 🎓

KampüsCircle, üniversite öğrencileri için tasarlanmış sosyal ve bilgi paylaşım platformudur. Etkinlik takibi, öğrenci ilanları, kampüs içi fırsatlar ve forum sistemi gibi özelliklerle dijital bir kampüs ortamı yaratmayı amaçlar.

## 🚀 Özellikler

- 📰 Öğrenci ilanları (ads.html)
- 🎉 Etkinlik oluşturma ve listeleme (add-event.html, events.html)
- 🛍️ Öğrencilere özel indirimler (discounts.html)
- 🗣️ Forum ve konu açma (forum.html, new-topic.html)
- 👤 Kullanıcı kayıt ve giriş sistemi (login.html, register.html)
- 📱 Responsive tasarım (responsive.css)
- 💾 Veritabanı yapısı ve örnek veriler (schema.sql, sample_data.sql)
- ⚙️ PWA desteği (`manifest.json`, `sw.js`)

## 🗂️ Proje Yapısı

KampüsCircle/
├── index.html # Ana sayfa
├── login.html / register.html
├── ads.html / add-ad.html
├── events.html / add-event.html
├── forum.html / topic.html / new-topic.html
├── profile.html
├── css/ # Stil dosyaları
├── img/ # Görseller
├── js/ (Varsa)
├── database/
│ ├── schema.sql
│ └── sample_data.sql
├── manifest.json / sw.js # PWA bileşenleri
└── LICENSE / README.md

## 🧪 Kurulum

1. Depoyu klonlayın veya ZIP olarak indirin:
```bash
git clone https://github.com/kullaniciadi/kampuscircle.git
cd kampuscircle
