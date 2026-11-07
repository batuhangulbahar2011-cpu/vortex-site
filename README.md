# Vortex — resmî tanıtım ve indirme sitesi

Vortex'in (Windows için dinamik ada) tanıtım ve indirme sitesi. Düz HTML, CSS ve JavaScript;
derleme adımı, çerçeve (framework), dış yazı tipi ya da dış betik yok. Bütün yerel bağlantılar
**göreli** (`assets/...`, `css/...`), bu yüzden site hem GitHub Pages'te hem kendi sunucunda
(VDS) hiçbir değişiklik yapmadan çalışır.

- Yayın adresi (GitHub Pages): https://batuhangulbahar2011-cpu.github.io/vortex-site/
- Depo: https://github.com/batuhangulbahar2011-cpu/vortex-site
- Varsayılan dil İngilizce; sağ üstteki **EN / TR** düğmesiyle Türkçeye geçilir. Seçim tarayıcıda
  hatırlanır (`localStorage`, anahtar `vortex-lang`). `?lang=tr` ya da `?lang=en` ile doğrudan bir
  dilde açılır. JavaScript kapalıysa sayfa İngilizce olarak tam görünür.

## Klasör yapısı

```
index.html          Tek sayfa: bütün bölümler ve İNGİLİZCE metinler burada
404.html            "Sayfa bulunamadı" sayfası (kendi içinde; dış dosyaya bağlı değil)
css/style.css       Bütün görünüm (renkler en üstte :root içinde)
js/tr.js            TÜRKÇE metinler (anahtar → metin listesi)
js/main.js          Dil değiştirme, üstteki ada/terminal animasyonu, özellik görseli değiştirme
assets/             Simgeler, og.png (paylaşım görseli), shots/ (ekran görüntüleri), video/
site.webmanifest    Uygulama simgeleri bilgisi
robots.txt          Arama motorlarına izin + site haritası adresi
sitemap.xml         Site haritası
.nojekyll           GitHub Pages'in dosyaları Jekyll'den geçirmemesi için (boş dosya)
.gitignore          _calisma/ klasörünü depodan dışarıda tutar
_calisma/           Çalışma dosyaları: taslak tasarımlar, olgu sayfası, kurulum dosyası kopyası,
                    ekran görüntüsü betikleri. YAYINLANMAZ (.gitignore). Silme; içinde
                    GitHub Releases'e yüklenecek kurulum dosyası da var.
```

## Yerelde açma

`index.html` dosyasına çift tıklamak yeterli. Gerçek sunucuya en yakın deneme için klasörde:

```
py -3 -m http.server 8080
```

Sonra tarayıcıda http://localhost:8080/ adresini aç.

## Metinleri düzenleme (EN / TR)

- **İngilizce** metinler doğrudan `index.html` içindedir. Değiştirmek için ilgili cümleyi orada düzelt.
- **Türkçe** metinler `js/tr.js` içindedir. Her metnin bir anahtarı vardır, örneğin:

  ```html
  <!-- index.html -->
  <h2 data-i18n="how.title">Up and running in three steps</h2>
  ```
  ```js
  // js/tr.js
  "how.title": "Üç adımda hazır",
  ```

- Anahtar türleri:
  - `data-i18n="..."` → düz metin. `tr.js` içinde HTML etiketi kullanma.
  - `data-i18n-html="..."` → içinde `<kbd>`, `<code>`, `<strong>`, `<a>` gibi etiket olan metin.
    Etiketleri her iki dilde de aynı tut.
  - `data-i18n-alt` (görsel açıklaması), `data-i18n-aria` (ekran okuyucu etiketi),
    `data-i18n-content` (sayfa başlığı/açıklaması gibi `<meta>` değerleri).
- **Yeni metin eklemek:** `index.html`'de öğeye yeni bir anahtar ver (`data-i18n="yeni.anahtar"`),
  İngilizcesini oraya yaz, Türkçesini `js/tr.js`'e aynı anahtarla ekle. `tr.js`'de bir anahtar
  eksikse o yerde İngilizce görünür (sayfa bozulmaz).
- Sayfa başlığı ve açıklama: `meta.title`, `meta.desc`, `meta.ogdesc` anahtarları.
- Türkçede ç, ğ, ı, İ, ö, ş, ü harflerini kullan; dosyayı UTF-8 olarak kaydet.

## Görselleri değiştirme

- Ekran görüntüleri `assets/shots/` içinde, her biri iki dilde: `ad-en.webp` ve `ad-tr.webp`.
  Dil değişince site `-en`/`-tr` ekini otomatik değiştirir; yeni görsel eklerken iki dosyayı da koy.
  Görseller şeffaf arka planlıdır (adanın gölgesi dahil); aynı biçimde kırpılmaları iyi olur.
- Paylaşım görseli `assets/og.png` (1200×630). Yeniden üretmek için: `py -3 _calisma/make_og.py`.
- Simgeler: `assets/favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`.

## Tanıtım videosunu değiştirme

Şu anki video (`assets/video/vortex-demo.mp4`) 3 Kasım tasarım güncellemesinden kalma; Codex ve
Limitler sekmesini göstermez ve sitede bu açıkça yazar. Yeni video hazır olunca:

1. Yeni dosyayı **aynı adla** `assets/video/vortex-demo.mp4` olarak koy (ya da adı değiştirirsen
   `index.html`'deki iki `vortex-demo.mp4` geçen yeri de değiştir).
   - Biçim: H.264 + AAC, `+faststart`. Boyutu küçük tut (20 MB altı iyi; GitHub dosya başına
     100 MB'ı kabul etmez). Örnek: `ffmpeg -i yeni.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 96k -movflags +faststart vortex-demo.mp4`
2. Kapak görselini `assets/video/poster.jpg` olarak güncelle (örnek: `ffmpeg -ss 3 -i vortex-demo.mp4 -frames:v 1 -vf scale=1280:-2 poster.jpg`).
3. Video açıklamasını güncelle: `index.html`'de `data-i18n="video.lede"` ve `js/tr.js`'de
   `"video.lede"`. "Codex ve Limitler sekmesi o sırada yoktu" cümlesini artık doğru değilse kaldır;
   altyazı dili değiştiyse onu da düzelt. Süre değiştiyse "two-minute / iki dakikalık" ifadesini düzelt.

## Yeni sürüm çıkınca (ör. 0.6.0)

1. Kurulum dosyasını GitHub Releases'e yükle (aşağıya bak).
2. Sitede sürümü geçen yerleri bul ve güncelle:
   ```
   grep -n "0.5.0\|116 MB\|8223aa" index.html js/tr.js
   ```
   - İndirme bağlantıları (`.../releases/download/v0.5.0/Vortex-Setup-0.5.0.exe`, 4 yer: üst menü, hero, 1. adım, son çağrı).
   - `cta.note`, `final.note`, `spec.v2` (sürüm ve tarih), `spec.v3` / `how.1.p` (boyut), dosya adı (adım 1).
   - "At a glance / Kısaca" tablosundaki **SHA-256** değeri. Hesaplamak için:
     `certutil -hashfile Vortex-Setup-0.6.0.exe SHA256`
3. **Yama geçmişi**ne en üste yeni bir giriş ekle (`index.html` `#changelog` + `tr.js` `log.*`
   anahtarları); "Latest / En yeni" rozetini yeni girişe taşı.
4. `sitemap.xml` içindeki `lastmod` tarihini güncelle.

## GitHub Pages'te yayınlama

1. GitHub'da **public** bir depo aç: `vortex-site` (README, .gitignore ya da lisans ekleme).
2. Bu klasörde (depo zaten `git init` ile hazır, dal `main`):
   ```
   git remote add origin https://github.com/batuhangulbahar2011-cpu/vortex-site.git
   git push -u origin main
   ```
3. Depoda **Settings › Pages** → *Build and deployment* → *Source: Deploy from a branch* →
   *Branch: `main`*, klasör *`/ (root)`* → **Save**. Birkaç dakika sonra site
   https://batuhangulbahar2011-cpu.github.io/vortex-site/ adresinde açılır.
4. **Kurulum dosyasını yayınla:** depoda **Releases › Draft a new release** → etiket (tag) `v0.5.0`
   → dosya olarak `_calisma/release/Vortex-Setup-0.5.0.exe` dosyasını sürükle → **Publish release**.
   Etiket ve dosya adı birebir `v0.5.0` / `Vortex-Setup-0.5.0.exe` olmalı; sitedeki indirme düğmeleri
   bu adrese gider. Yüklemeden önce bu düğmeler 404 verir.
5. Kurulum dosyası kod imzalı değil; Windows SmartScreen uyarısı normaldir (sitede anlatılıyor:
   **Ek bilgi → Yine de çalıştır**). İleride bir kod imzalama sertifikası alınırsa sitedeki
   SmartScreen adımı ve SSS sorusu kaldırılabilir.

## Kendi alan adına (custom domain) bağlama — GitHub Pages ile

1. Alan adını aldığın yerde DNS kaydı ekle:
   - Kök alan (`ornek.com`) için GitHub Pages'in **A** kayıtları:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www.ornek.com` için **CNAME** → `batuhangulbahar2011-cpu.github.io`
2. Depoda **Settings › Pages › Custom domain** kutusuna alan adını yaz → Save. GitHub depoya
   `CNAME` adlı bir dosya ekler (içinde yalnız alan adı yazar). İstersen bu dosyayı kendin de
   oluşturabilirsin: kök klasörde `CNAME`, içinde tek satır `ornek.com`.
3. DNS doğrulanınca **Enforce HTTPS** kutusunu işaretle.
4. Sitedeki tam adresleri yeni alan adıyla değiştir (aşağıdaki "Adres değişince" bölümü).

## VDS'ye taşıma (nginx, statik site)

Site statik olduğu için sunucuda yalnız dosyaları sunmak yeterli; Node, PHP ya da veritabanı gerekmez.

1. Sunucuda nginx kur (Ubuntu/Debian): `sudo apt install nginx`
2. Dosyaları kopyala (`_calisma/` HARİÇ). Windows'tan, Git Bash ile:
   ```
   scp -r index.html 404.html css js assets robots.txt sitemap.xml site.webmanifest kullanici@SUNUCU_IP:/var/www/vortex/
   ```
   ya da sunucuda `git clone https://github.com/batuhangulbahar2011-cpu/vortex-site.git /var/www/vortex`
   (sonraki güncellemeler için `git pull`).
3. nginx ayarı: `/etc/nginx/sites-available/vortex`
   ```nginx
   server {
       listen 80;
       server_name ornek.com www.ornek.com;
       root /var/www/vortex;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
       error_page 404 /404.html;

       # Gizli/çalışma dosyalarını asla sunma
       location ~ /(\.git|_calisma)/ { deny all; }

       # Görseller, video, CSS ve JS için tarayıcı önbelleği
       location ~* \.(webp|png|jpg|ico|mp4|css|js|webmanifest)$ {
           expires 7d;
           add_header Cache-Control "public";
       }

       gzip on;
       gzip_types text/css application/javascript image/svg+xml application/manifest+json;
   }
   ```
   Etkinleştir: `sudo ln -s /etc/nginx/sites-available/vortex /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx`
4. Alan adının **A** kaydını VDS'nin IP adresine yönlendir (GitHub Pages kayıtlarını kaldır).
5. Ücretsiz HTTPS: `sudo apt install certbot python3-certbot-nginx` → `sudo certbot --nginx -d ornek.com -d www.ornek.com`
6. Kurulum dosyasını GitHub Releases'te bırakabilirsin (indirme bağlantıları değişmez). İstersen
   sunucuya da koyabilirsin; o zaman bağlantıları yeni adrese çevir.

## Adres değişince (kendi alan adı ya da VDS)

Aşağıdaki **tam adresler** yeni alan adıyla değiştirilmeli (göreli yollar değişmez):

- `index.html`: `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`
- `robots.txt`: `Sitemap:` satırı
- `sitemap.xml`: `<loc>`

Bulmak için: `grep -rn "github.io/vortex-site" index.html robots.txt sitemap.xml`

`404.html` ana sayfa düğmesi GitHub Pages'te `/vortex-site/`, diğer her yerde `/` adresine gider;
değiştirmen gerekmez.

## Doğruluk kuralları

- Sitedeki her iddia `_calisma/olgular.md` (olgu sayfası) ile doğrulanabilir olmalı.
- Fiyat, kullanıcı sayısı, puan, yorum, basın logosu ya da indirme sayısı uydurulmaz.
- Anthropic/OpenAI/Claude/Codex logoları kullanılmaz; ürünlerin yalnız adı geçer. Altbilgideki
  "bağımsız proje" notu kalmalı.
- İletişim, gizlilik politikası ve kullanım şartları sayfaları henüz yok; hazır olunca eklenecek.
