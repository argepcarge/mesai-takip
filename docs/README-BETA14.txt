Fazla Mesai Çizelgesi — 2026.11.02-beta.14

Bu sürüm, Beta.13 dosyalarının işlevlerini korumayı hedefleyen dosya ayrımıdır.
- index.html: HTML arayüzü
- style.css: eski HTML içindeki CSS (içerik korunarak dışarı taşındı)
- main.js: eski HTML içindeki JavaScript (içerik korunarak dışarı taşındı)
- sw.js: önbellek adı güncellendi; style.css ve main.js önbelleğe eklendi
- diğer dosyalar: Beta.13'ten değişmeden alındı

Kurulum: GitHub'da SADECE beta14-dosya-ayirma dalında ZIP'i açıp içindeki dosyaları
repo ana dizinine yükleyin. main dalını değiştirmeyin.

Değişiklik: sürüm kontrolü index.html içindeki app-version meta etiketini okur.
Veri dosyaları veya localStorage içeriği bu ZIP'te bulunmaz.

Kontroller: JavaScript sözdizimi; dosya yolları ve önbellek listesi kontrol edildi.
Canlı PWA/telefon tarayıcısı testi bu ortamda tamamlanamadı. Yayına almadan önce
uygulamanın giriş, hesap, PDF ve çevrimdışı işlevlerini telefonda test edin.
