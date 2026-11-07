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
robots.txt          Arama motorlarına izin + site haritası adresi (github.io üzerinde etkisiz, aşağıya bak)
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
- Özellik kartlarındaki görseller CSS ile adaya kırpılır (1138×502 kaynağın 76–1062 px arası).
  Telefonda (559 px altı) her kart adanın ilgili kısmına yakınlaşır: `css/style.css` içinde
  `.feat-shot` için `--fx` (sol kenar) ve `--fw` (görünen genişlik), kaynak piksel cinsinden.
  Görsele dokununca tam boyutlu dosya yeni sekmede açılır.
- Paylaşım görseli `assets/og.png` (1200×630). Yeniden üretmek için: `py -3 _calisma/make_og.py`.
- Simgeler: `assets/favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`.

## Tanıtım videosunu değiştirme

Videonun iki kurgusu var, ikisi de Vortex deposundaki `219dbcb` (v0.4/v0.5 sahneleri) kaydından:

- `assets/video/vortex-demo-en.mp4` + `poster-en.jpg` (İngilizce altyazı)
- `assets/video/vortex-demo-tr.mp4` + `poster-tr.jpg` (Türkçe altyazı)

Her biri yaklaşık 73 saniye (oynatıcıda 1:12), 1920×1080, H.264 + AAC (özgün fon müziği), `+faststart`, yaklaşık 5,7 MB.
Sayfa dil değişince videoyu ve kapağı da `-en` / `-tr` olarak değiştirir (`js/main.js`, `locVideo`);
video o anda oynuyorsa değiştirmez. `index.html` İngilizce dosyaları gösterir (JS kapalıyken de).

Yeni video hazır olunca:

1. Dosyaları **aynı adlarla** `assets/video/` içine koy (iki dil için iki MP4, iki kapak).
   - Biçim: H.264 + AAC, `+faststart`. Boyutu küçük tut (20 MB altı iyi; GitHub dosya başına
     100 MB'ı kabul etmez). Örnek: `ffmpeg -i yeni.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 96k -movflags +faststart vortex-demo-en.mp4`
2. Kapak: `ffmpeg -ss 1 -i vortex-demo-en.mp4 -frames:v 1 poster-en.jpg` (Türkçe için aynısı).
3. Video açıklamasını güncelle: `index.html`'de `data-i18n="video.lede"` ve `js/tr.js`'de
   `"video.lede"` (süre, gösterilen özellikler, altyazı dili).

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
- `index.html`: üç `<link rel="alternate" hreflang=...>` satırı (`en`, `tr` = `?lang=tr`, `x-default`)
- `404.html`: "Go to the home page" bağlantısının `href` değeri (JS kapalıyken kullanılan tam adres).
  JS açıkken düğme GitHub Pages'te `/vortex-site/`, kendi alan adında `/` adresine gider.

Bulmak için: `grep -rn "github.io/vortex-site" index.html 404.html robots.txt sitemap.xml`

### robots.txt ve site haritası hakkında

GitHub Pages proje sitesinde `robots.txt` `/vortex-site/robots.txt` adresinde durur. Arama motorları
yalnız alan adının kökündeki `/robots.txt`'yi okur, bu yüzden github.io üzerindeyken bu dosya (ve
içindeki `Sitemap:` satırı) **işe yaramaz**. O süre boyunca `sitemap.xml`'i elle bildir: Google Search
Console ve Bing Webmaster Tools'a `https://batuhangulbahar2011-cpu.github.io/vortex-site/sitemap.xml`
adresini ekle. Site kendi alan adının köküne taşınınca dosya kendiliğinden çalışmaya başlar.

## Yayından önce son kontrol

Depo public olarak gönderilip `v0.5.0` sürümü yayımlanmadan sitedeki dış bağlantıların hepsi 404
verir (indirme düğmeleri ve altbilgideki GitHub deposu bağlantısı). Pages'i açtıktan sonra:

```
curl -sI https://github.com/batuhangulbahar2011-cpu/vortex-site | head -1
curl -sIL https://github.com/batuhangulbahar2011-cpu/vortex-site/releases/download/v0.5.0/Vortex-Setup-0.5.0.exe | grep -i "^HTTP\|content-length"
```

İlki `200`, ikincisi bir `302` ardından `200` ve 121565657 baytlık bir dosya göstermeli. Sitedeki
SHA-256 değeri (`8223aaff…d987d1`) `_calisma/release/Vortex-Setup-0.5.0.exe` ile eşleşir.

## Bilinen küçük maliyet

Türkçe ziyaretçide (`?lang=tr` ya da kayıtlı seçim) sayfanın üstündeki üç ada görseli önce `-en`
olarak indirilir (HTML'deki varsayılan), sonra JS `-tr` sürümlerini yükler: yaklaşık 100 KB fazladan
indirme. Bilerek kabul edildi; JS kapalıyken de görsel çıksın diye `src` HTML'de duruyor. Aşağıdaki
özellik görselleri `loading="lazy"` olduğu için bu sorunu yaşamaz.

## Doğruluk kuralları

- Sitedeki her iddia `_calisma/olgular.md` (olgu sayfası) ile doğrulanabilir olmalı.
- Fiyat, kullanıcı sayısı, puan, yorum, basın logosu ya da indirme sayısı uydurulmaz.
- Anthropic/OpenAI/Claude/Codex logoları kullanılmaz; ürünlerin yalnız adı geçer. Altbilgideki
  "bağımsız proje" notu kalmalı.
- İletişim, gizlilik politikası ve kullanım şartları sayfaları henüz yok; hazır olunca eklenecek.
