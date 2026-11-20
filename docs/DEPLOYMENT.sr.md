# TRICOM — postavljanje sajta na hosting

Uputstvo vodi korak po korak kroz prvo postavljanje sajta i administracije na deljeni hosting
(cPanel ili sličan panel, File Manager ili FTP, phpMyAdmin). SSH, Composer, Node.js i
pokretanje bilo kakvih komandi na serveru **nisu potrebni**.

Spisak fajlova je u **UPLOAD-MANIFEST.md**, uputstvo za rad u administraciji u **ADMIN-UPUTSTVO.md**.

> **Sajt je već postavljen?** Za objavu izmena od novembra 2026 na postojeću instalaciju koristite
> **TRICOM-OBJAVLJIVANJE.md**, a ne ovo uputstvo. Ovo je samo za potpuno novu instalaciju.

---

## 1. Šta hosting mora da ima

| Stavka | Zahtev |
|---|---|
| PHP | **8.3** (preporučeno; radi i 8.1/8.2). Sa starijim PHP-om sajt prikazuje poruku da je potreban noviji. |
| PHP proširenja — obavezna | `pdo_mysql`, `mbstring`, `fileinfo` (bez njih sajt prikazuje „privremeno nedostupno“) |
| PHP proširenja — uobičajena | `ctype`, `json`, `session` (uključena u svaki standardni PHP) |
| PHP proširenja — preporučena | `gd` sa WebP podrškom (umanjene slike za mrežu galerije; bez njega galerija prikazuje originalnu sliku), `iconv` |
| Baza | MySQL 5.7+ ili MariaDB 10.3+, kodna strana `utf8mb4` |
| Web server | Apache ili LiteSpeed sa **`.htaccess`** i **mod_rewrite** (adrese `*.html` vode na PHP strane) |
| HTTPS | Aktivan SSL sertifikat za domen (npr. AutoSSL / Let's Encrypt u panelu). Administracija radi **samo** preko `https://`. |
| PHP ograničenja (preporuka) | `upload_max_filesize` ≥ 8M, `post_max_size` ≥ 64M, `max_file_uploads` ≥ 30, `memory_limit` ≥ 128M |

Gde se to podešava: u cPanel-u **Select PHP Version** (ili **MultiPHP Manager**) — izaberite 8.3 i
uključite proširenja; ograničenja su u **MultiPHP INI Editor** (ili „PHP Options“). Ako nešto ne
možete da uključite sami, pošaljite ovu tabelu podršci hostinga.

---

## 2. Rezervna kopija (pre bilo kakve izmene)

Uradite ovo i ako je na hostingu trenutno samo stari statični sajt.

1. **Fajlovi:** File Manager → otvorite `public_html` → **Select All** → **Compress** → ZIP →
   preuzmite napravljeni ZIP na svoj računar.
2. **Baza** (samo ako već postoji baza za ovaj sajt): phpMyAdmin → izaberite bazu levo →
   **Export** → **Quick**, format **SQL** → **Export** → sačuvajte fajl.
3. Ako na serveru već postoji `public_html/app/config.php` (ranija verzija ovog sajta),
   preuzmite i njega posebno — u njemu su vaši pristupni podaci.

---

## 3. Uklanjanje starih fajlova

Novi sajt služi **iste adrese** (`index.html`, `proizvodi.html`, …) iz PHP fajlova. Stari
`.html` fajlovi bi samo zbunjivali (i prikazivali stari sadržaj kad bi pravila adresa bila
isključena), zato ih **obrišite** iz `public_html` posle rezervne kopije:

- u korenu: `index.html`, `o-nama.html`, `proizvodi.html`, `usluge.html`, `reference.html`,
  `galerija.html`, `kontakt.html`, `plazma.html`, `kalkulatori.html`, `konfigurator.html`,
  `404.html`, `sitemap.xml`, `robots.txt`
- u `en/`: `index.html`, `about.html`, `products.html`, `services.html`, `references.html`,
  `gallery.html`, `contact.html`, `plasma-cutting.html`, `calculators.html`,
  `configurator.html`, `404.html`
- cele fascikle `detalji/` i `en/details/` (stare strane detalja)
- podrazumevanu stranu hostinga ako postoji (`index.htm`, `default.html` i sl.)

**Ne brišite** fascikle `assets/`, `css/`, `js/` — novi fajlovi se samo prepisuju preko njih.

---

## 4. Otpremanje fajlova

Odredište je **`public_html`** (koren domena `tricom.rs`). Otpremite tačno ono što je u
**UPLOAD-MANIFEST.md**, odeljak „Otpremiti“:

```
public_html/
  .htaccess          (skriven fajl — mora biti otpremljen!)
  index.php, o-nama.php, proizvodi.php, usluge.php, reference.php, galerija.php,
  kontakt.php, plazma.php, kalkulatori.php, konfigurator.php, 404.php,
  detalji.php, items-js.php, sitemap.php, robots.php, upit.php
  en/        admin/     app/       assets/    css/       js/       uploads/
```

**Ne otpremajte:** `_tools/`, `database/`, `README.md`, `TRICOM_IMPLEMENTATION.md`,
`DEPLOYMENT.md`, `ADMIN-UPUTSTVO.md`, `QA-REPORT.md`, `UPLOAD-MANIFEST.md`.
SQL fajlove iz `database/` uvozite sa svog računara kroz phpMyAdmin (korak 7).

Najlakši način:
1. Na svom računaru spakujte navedene fajlove i fascikle u jedan ZIP (sa `.htaccess` fajlovima).
2. File Manager → `public_html` → **Upload** → izaberite ZIP.
3. Desni klik na ZIP → **Extract** → u `public_html`. Zatim obrišite ZIP sa servera.

Ako koristite FTP (npr. FileZilla), uključite prikaz skrivenih fajlova
(*Server → Force showing hidden files*), da se `.htaccess` fajlovi (u korenu, `en/`, `admin/`,
`app/`, `app/storage/`, `uploads/`) zaista prenesu. Bez njih adrese i zaštita foldera ne rade.

---

## 5. Dozvole foldera

Na deljenom hostingu PHP obično radi pod vašim korisnikom, pa su standardne dozvole dovoljne:

| Šta | Dozvola |
|---|---|
| sve fascikle | `755` |
| svi fajlovi | `644` |
| `app/config.php` (posle koraka 6) | `640` (ako sajt posle toga javi „privremeno nedostupno“, vratite na `644`) |

U ove fascikle sajt upisuje (otpremljene slike, dnevnik grešaka, sesije administracije, PDF
specifikacije upita): `uploads/`, `app/storage/logs/`, `app/storage/sessions/`,
`app/storage/quotes/`. Ostavite ih na `755`. Samo ako administracija pri otpremanju javi da folder
ne može da se napravi ili sačuva fajl, ili kontrolna tabla javi da `app/storage/quotes/` nije
upisiv, postavite **te** fascikle na `775`. **Nikada ne postavljajte `777`.**
`app/vendor/tfpdf/font/unifont/` sme da ostane `755`: tamo se pri prvom PDF-u upisuje keš fonta,
a ako upis nije moguć, PDF radi i bez njega.

---

## 6. Konfiguracija (`app/config.php`)

1. File Manager → `public_html/app/` → desni klik na **`config.example.php`** → **Copy** →
   upišite ime **`config.php`** (isti folder `app/`). Šablon `config.example.php` ostaje nepromenjen.
2. Desni klik na `config.php` → **Edit** i zamenite vrednosti:

| Ključ | Upišite | Napomena |
|---|---|---|
| `'base_url'` | `'https://tricom.rs'` | tačno ovako: `https://`, bez kose crte na kraju |
| `'base_path'` | `'/'` | sajt je u korenu domena (`public_html`) |
| `'debug'` | `false` | ostaviti `false` |
| `'host'` | `'localhost'` | ako hosting ne navodi drugačije |
| `'port'` | `3306` | ostaviti |
| `'name'` | umesto `CHANGE_ME_DB_NAME` | puno ime baze iz koraka 7, sa prefiksom (npr. `nalog_tricom`) |
| `'user'` | umesto `CHANGE_ME_DB_USER` | puno ime korisnika baze (npr. `nalog_tricomweb`) |
| `'pass'` | umesto `CHANGE_ME_DB_PASSWORD` | lozinka korisnika baze |
| `'setup_secret'` | privremena tajna, najmanje 16 znakova | npr. `Tricom-Setup-7413-maj`; posle koraka 8 vratiti na `''` |
| `'force_https'` | `true` | ostaviti (administracija samo preko HTTPS-a) |
| `'mail'` → `'from'` | adresa pošiljaoca na domenu, npr. `'sajt@tricom.rs'` | dok je prazno, upiti iz kalkulatora idu kroz program za e-poštu posetioca |
| `'mail'` → `'transport'` | `'mail'` ili `'smtp'` | za `'smtp'` upišite i `smtp_host`, `smtp_port`, `smtp_secure`, `smtp_user`, `smtp_pass` (podaci naloga e-pošte iz panela) |

Ostale vrednosti ne menjajte. Dok bilo koja vrednost počinje sa `CHANGE_ME`, sajt prikazuje
„Sajt je privremeno nedostupan“ — to je očekivano dok podešavanje nije završeno.

Primer kako treba da izgleda deo za bazu (sa vašim podacima umesto ovih):

```php
'db' => [
    'host' => 'localhost',
    'port' => 3306,
    'name' => 'NALOG_tricom',
    'user' => 'NALOG_tricomweb',
    'pass' => 'OVDE-LOZINKA-BAZE',
],
```

---

## 7. Baza podataka (phpMyAdmin)

### 7.1 Pravljenje baze
1. cPanel → **MySQL® Databases** → *Create New Database*: npr. `tricom` (panel doda prefiks, npr. `nalog_tricom`).
2. *Add New User*: npr. `tricomweb`, jaka lozinka (sačuvajte je — ide u `config.php`).
3. *Add User To Database*: izaberite korisnika i bazu → **ALL PRIVILEGES** → *Make Changes*.

### 7.2 Uvoz — nova instalacija (prazna baza)
Uvezite **tačno ovih osam fajlova, ovim redom**:

| Redosled | Fajl | Šta radi |
|---|---|---|
| 1 | `database/001-schema.sql` | pravi sve tabele |
| 2 | `database/002-existing-content.sql` | unosi postojeći sadržaj sajta (proizvodi, usluge, reference, galerija, pitanja, kontakt) |
| 3 | `database/patches/005-opening-hours.sql` | radno vreme (pon–pet, subota, nedelja) |
| 4 | `database/patches/006-navigation-contact.sql` | nazivi grupa, javna adresa, telefoni za ponudu |
| 5 | `database/patches/007-sheet-hierarchy.sql` | programi i podgrupe limova |
| 6 | `database/patches/008-tr10-colours.sql` | boje TR 10 u tehničkim podacima |
| 7 | `database/patches/009-price-list-inquiries.sql` | interni cenovnik trapeznih limova i evidencija upita (bez ijedne cene) |
| 8 | `database/patches/010-quote-email.sql` | slanje upita iz kalkulatora prodaji sa PDF specifikacijom (stanje slanja) |

Postupak za svaki fajl: phpMyAdmin → kliknite na bazu u levoj koloni → kartica **Import** →
*Choose File* → izaberite fajl sa svog računara → *Format*: **SQL** (kodna strana `utf-8`) →
**Import** (ili *Go*). Sačekajte poruku *„Import has been successfully finished“*.

Svi fajlovi su bezbedni i ako se slučajno uvezu dva puta (ništa se ne duplira i ne briše).

### 7.3 Dodatni SQL fajlovi — NE za novu instalaciju
`database/patches/003-products-module.sql` i `database/patches/004-services-references.sql`
služe **samo** za bazu koja je uvezena u ranijoj fazi izrade. Na novoj instalaciji ih
**ne uvozite** (sve što sadrže već je u fajlovima 001 i 002).

Kada su ipak potrebni: kontrolna tabla administracije u odeljku „Baza“ piše
*„patches/… : potrebno uvesti“*. Tada uvezite samo navedene, redom 003 pa 004, istim postupkom
kao gore. Ako piše *„nije potreban“*, ne radite ništa.

---

## 8. Prvi administrator

1. U pregledaču otvorite: **https://tricom.rs/admin/setup-admin.php**
2. Upišite tajnu iz `setup_secret` (korak 6), korisničko ime (mala slova, brojevi, `.` `-` `_`,
   3–50 znakova) i lozinku (najmanje 12 znakova, dva puta) → **Napravi administratora**.
3. Odmah posle toga:
   - u File Manager-u **obrišite fajl `public_html/admin/setup-admin.php`**;
   - u `app/config.php` vratite `'setup_secret' => '',` i sačuvajte.

Dok jedno od ta dva nije urađeno, kontrolna tabla administracije prikazuje upozorenje.
Kad administrator postoji, setup strana više ništa ne pravi ni sa tačnom tajnom.

**Prijava u administraciju:** **https://tricom.rs/admin/**
(vodi na https://tricom.rs/admin/login.php). Pet pogrešnih lozinki zaredom zaključava
prijavu za to ime na 15 minuta.

---

## 9. Provera posle postavljanja

Otvorite redom i proverite da se strana prikazuje kao ranije (dizajn, slike, meni):

**Srpski:** https://tricom.rs/ · /o-nama.html · /proizvodi.html · /usluge.html · /plazma.html ·
/reference.html · /galerija.html · /kontakt.html · /kalkulatori.html · /konfigurator.html ·
/detalji/tr-35-270.html

**Engleski:** https://tricom.rs/en/ · /en/about.html · /en/products.html · /en/services.html ·
/en/plasma-cutting.html · /en/references.html · /en/gallery.html · /en/contact.html ·
/en/calculators.html · /en/configurator.html · /en/details/tr-35-270.html

- [ ] Prekidač **SR | EN** u zaglavlju vodi na istu stranu na drugom jeziku (i na stranama detalja).
- [ ] Klik na karticu proizvoda otvara prozor sa podacima; galerija: filteri rade.
- [ ] https://tricom.rs/nepostojeca-strana.html prikazuje stranu „404“ (i pod `/en/`).
- [ ] https://tricom.rs/sitemap.xml i /robots.txt se otvaraju i sadrže `https://tricom.rs`.
- [ ] https://tricom.rs/app/config.php i /database/ daju „Forbidden“ ili „Not Found“ (nikad sadržaj).
- [ ] Forma na strani Kontakt posle slanja prikazuje broj upita (U-…) i otvara program za e-poštu sa popunjenom porukom; upit se vidi u administraciji → Upiti. Poruku ne šaljite na prave adrese kupaca.

**Administracija** (prijavljeni) — u svakom modulu otvorite jedan zapis, napravite sitnu izmenu,
sačuvajte, proverite je na sajtu (srpski i engleski) i vratite prvobitnu vrednost:

- [ ] Kategorije proizvoda — npr. naziv taba
- [ ] Proizvodi — npr. jedan red u „Tehnički podaci“
- [ ] Usluge — npr. kratak opis
- [ ] Reference — npr. oznaka objekta
- [ ] Galerije — otpremite jednu malu probnu sliku **bez opisa** (ostaje sakrivena), zatim je obrišite
- [ ] Česta pitanja — vidi se na strani O nama i na početnoj
- [ ] Kontakt — npr. radno vreme; promena se vidi u zaglavlju i futeru svih strana
- [ ] Cenovnik — otvara se i prikazuje šta nedostaje (cene unosi vlasnik; v. ADMIN-UPUTSTVO.md)
- [ ] Kontrolna tabla: nema upozorenja; „Baza“ prikazuje 001, 002 i zakrpe 005–010 kao „uvezen“

Ako `https://tricom.rs/` radi, a `https://tricom.rs/proizvodi.html` daje „404“, na hostingu
nije uključen **mod_rewrite** ili `.htaccess` nije otpremljen — proverite skrivene fajlove i
javite se podršci hostinga.

---

## 10. Kasnije izmene sajta

- Nikad ne prepisujte na serveru `app/config.php`, sadržaj `uploads/` i `app/storage/`.
- Posle otpremanja izmenjenih CSS/JS fajlova u `app/config.php` promenite `asset_version`
  (npr. na današnji datum), da posetioci dobiju nove fajlove.
- Greške sa sajta (bez lozinki) beleže se u `app/storage/logs/app-GGGG-MM.log`; stranica greške
  prikazuje kratak kod („referenca“) po kome se zapis nalazi u tom fajlu.

### Sajt u podfolderu (samo ako ne ide u koren domena)
Ako se sajt postavlja npr. u `public_html/tricom/`: u `config.php` stavite
`'base_path' => '/tricom/'`, a u `.htaccess` i `en/.htaccess` ispred putanja u redovima
`ErrorDocument 404` dodajte `/tricom` (npr. `ErrorDocument 404 /tricom/404.php`).
`robots.txt` radi samo u korenu domena.
