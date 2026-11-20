<?php
/* TRICOM — zajedničko za javne PHP strane (frontend).
   Strane zadržavaju relativne putanje postojećeg markupa ("../css/…"), pa
   rade u korenu domena i u podfolderu; apsolutne adrese (canonical, OG,
   JSON-LD) grade se iz app.base_url + app.base_path. */
defined('TRICOM') || exit;

require APP_DIR . '/site/catalog.php';
require APP_DIR . '/site/products.php';
require APP_DIR . '/site/sheets.php';
require APP_DIR . '/site/services.php';
require APP_DIR . '/site/references.php';
require APP_DIR . '/site/gallery.php';
require APP_DIR . '/site/contact.php';
require APP_DIR . '/site/pages.php';

/** Početak javnog zahteva. */
function site_boot(): void
{
    app_boot('public');
}

/** Promenljive koje koriste svi pogledi: verzija resursa i koren sajta (apsolutno, sa '/'). */
function site_globals(): array
{
    return ['V' => e((string) config('app.asset_version', '')), 'SITE' => absolute_url('')];
}

function site_send_html_headers(int $status = 200): void
{
    if (headers_sent()) {
        return;
    }
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache');
    header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
    header('X-Content-Type-Options: nosniff');
}

/** Izvršava pogled app/views/site/<putanja>.php i vraća HTML. */
function site_view(string $view, array $data): string
{
    if (!preg_match('#^[a-z0-9/-]+$#', $view)) {
        throw new InvalidArgumentException('Neispravno ime pogleda.');
    }
    extract($data, EXTR_SKIP);
    ob_start();
    require APP_DIR . '/views/site/' . $view . '.php';
    return (string) ob_get_clean();
}

/** Strana 404 (SR ili EN, isti dizajn kao do sada) sa statusom 404. */
function site_not_found(string $lang): never
{
    $html = site_page_html('404', $lang === 'en' ? 'en' : 'sr');
    site_send_html_headers(404);
    echo $html;
    exit;
}

/** /robots.txt: sadržaj kao ranije, adresa mape sajta iz konfiguracije. */
function site_robots(): never
{
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-cache');
    echo "User-agent: *\nAllow: /\n\nSitemap: " . absolute_url('sitemap.xml') . "\n";
    exit;
}

/** Ako je PHP ulaz otvoren direktno (…/proizvodi.php), vodi na javnu .html adresu. */
function site_canonical_entry(string $publicPath): void
{
    $uri = (string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);
    if (str_ends_with($uri, '.php')) {
        $q = (string) ($_SERVER['QUERY_STRING'] ?? '');   // npr. ?grupa=krov ostaje
        header('Location: ' . url($publicPath) . ($q !== '' ? '?' . $q : ''), true, 301);
        exit;
    }
}

/* ---------------------------------------------------------------- tekst */

/** Tekst sa dozvoljenim <strong> (kartice): sve ostalo se escapuje. */
function e_rich(?string $text): string
{
    return preg_replace('#&lt;(/?)strong&gt;#', '<$1strong>', e($text)) ?? '';
}

/**
 * Napomena umesto prazne liste (nema vidljivih zapisa). Strane su u korenu
 * jezika, pa veza na kontakt ide bez prefiksa (kontakt.html / contact.html).
 */
function site_empty(string $what, string $L): string
{
    $en = $L === 'en';
    $msg = match ($what) {
        'services' => $en ? 'The list of services is being updated.' : 'Lista usluga se trenutno ažurira.',
        'references' => $en ? 'References are being updated.' : 'Reference se trenutno ažuriraju.',
        'gallery' => $en ? 'The gallery is being updated.' : 'Galerija se trenutno ažurira.',
        'faq' => $en ? 'The questions are being updated.' : 'Pitanja se trenutno ažuriraju.',
        'products' => $en ? 'Products in this group are being updated.' : 'Proizvodi iz ove grupe se trenutno ažuriraju.',
        'catalog' => $en ? 'The product range is being updated.' : 'Prodajni program se trenutno ažurira.',
        default => throw new InvalidArgumentException('Nepoznata prazna lista.'),
    };
    $link = $en ? '<a href="contact.html">Contact us</a> for details.' : 'Za informacije <a href="kontakt.html">kontaktirajte nas</a>.';
    return '<p class="empty-note">' . e($msg) . ' ' . $link . '</p>';
}

/**
 * Pločica sa data-item="<slug>" iz stalnog dela strane (početna, usluge,
 * plazma, tab Krov): prikazuje se samo dok je stavka aktivna u bazi (ili je
 * statična grupa iz js/items.js); skrivena ili obrisana stavka nestaje.
 */
function site_item_on(string $slug): bool
{
    return catalog_item($slug) !== null;
}

/** Kao JavaScript encodeURIComponent (ne kodira A-Z a-z 0-9 - _ . ! ~ * ' ( )). */
function encode_uri_component(string $s): string
{
    return strtr(rawurlencode($s), ['%21' => '!', '%2A' => '*', '%27' => "'", '%28' => '(', '%29' => ')']);
}

/** JSON za <script> (JSON-LD, podaci za skripte): bez kosih crta i sa UTF-8 kao u postojećim stranama. */
function site_json(mixed $data): string
{
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_THROW_ON_ERROR);
}

/* ---------------------------------------------------------------- slike */

/** Putanja do statičnog fajla sa ?v= (samo assets/; otpremljeni fajlovi imaju jedinstveno ime). */
function site_src(string $R, string $path): string
{
    $v = (string) config('app.asset_version', '');
    return $R . $path . (str_starts_with($path, 'assets/') && $v !== '' ? '?v=' . $v : '');
}

/**
 * Responzivne varijante <osnova>-<N>w.webp pored fajla (pravi ih alat za slike).
 * @return list<array{0:int,1:string}> [širina, putanja] rastuće
 */
function site_variants(string $base): array
{
    static $cache = [];
    if (isset($cache[$base])) {
        return $cache[$base];
    }
    $out = [];
    $dir = SITE_DIR . '/' . dirname($base);
    $name = basename($base);
    foreach (glob($dir . '/' . $name . '-*w.webp') ?: [] as $f) {
        if (preg_match('/^' . preg_quote($name, '/') . '-(\d+)w\.webp$/', basename($f), $m)) {
            $out[] = [(int) $m[1], dirname($base) . '/' . basename($f)];
        }
    }
    usort($out, static fn($a, $b) => $a[0] <=> $b[0]);
    return $cache[$base] = $out;
}

function site_image_size(string $path, int $w = 2400, int $h = 1500): array
{
    static $cache = [];
    if (!isset($cache[$path])) {
        $info = is_file(SITE_DIR . '/' . $path) ? @getimagesize(SITE_DIR . '/' . $path) : false;
        $cache[$path] = $info ? [(int) $info[0], (int) $info[1]] : [$w, $h];
    }
    return $cache[$path];
}

function site_render_exists(?string $key): bool
{
    return $key !== null && $key !== '' && preg_match('/^[a-z0-9-]+$/', $key) && is_file(SITE_DIR . '/assets/render/' . $key . '-light.jpg');
}

/**
 * Par slika rendera (svetla/tamna tema), isti markup kao postojeće strane.
 * $o: sizes, load ('lazy' | 'high'), order ('detail' = decoding pa loading, 'list' = loading pa decoding),
 *     pic (klasa <picture> pre teme: 'theme-img theme-img--' ili 'rg-pic rg-pic--')
 */
function site_render_picture(string $key, string $alt, string $R, array $o = []): string
{
    $sizes = $o['sizes'] ?? '(max-width: 700px) 88vw, 605px';
    $a = e($alt);
    $html = '';
    foreach (['light', 'dark'] as $theme) {
        /* prioritet samo svetla slika naslova (podrazumevana tema); tamna se učitava lenjo */
        $load = ($o['load'] ?? 'lazy') === 'high' && $theme === 'light' ? ' fetchpriority="high"' : ' loading="lazy"';
        $tail = ($o['order'] ?? 'detail') === 'list' ? $load . ' decoding="async"' : ' decoding="async"' . $load;
        $base = 'assets/render/' . $key . '-' . $theme;
        /* strane detalja pišu 2400 × 1500 za sve rendere; kartice u tabovima stvarnu meru */
        [$w, $h] = !empty($o['measure']) ? site_image_size($base . '.jpg') : [2400, 1500];
        $html .= '<picture class="' . e($o['pic'] ?? 'theme-img theme-img--') . $theme . '">';
        if (is_file(SITE_DIR . '/' . $base . '.webp')) {
            $html .= '<source srcset="' . e(site_src($R, $base . '.webp')) . '" type="image/webp">';
        }
        $variants = $theme === 'light' ? site_variants($base) : [];
        if ($variants) {
            $largest = end($variants)[1];
            $srcset = implode(', ', array_map(static fn($v) => site_src($R, $v[1]) . ' ' . $v[0] . 'w', $variants));
            $html .= '<img src="' . e(site_src($R, $largest)) . '" srcset="' . e($srcset) . '" sizes="' . e($sizes) . '" data-orig="' . e(site_src($R, $base . '.jpg')) . '"';
        } else {
            $html .= '<img src="' . e(site_src($R, $base . '.jpg')) . '"';
        }
        $html .= ' alt="' . $a . '" width="' . $w . '" height="' . $h . '"' . $tail . '></picture>';
    }
    return $html;
}

/** Obična fotografija (otpremljena ili postojeća). */
function site_photo(string $path, ?int $w, ?int $h, string $alt, string $R, array $o = []): string
{
    $load = ($o['load'] ?? 'lazy') === 'high' ? ' fetchpriority="high"' : ' loading="lazy"';
    $size = $w && $h ? ' width="' . $w . '" height="' . $h . '"' : '';
    return '<img src="' . e(site_src($R, $path)) . '" alt="' . e($alt) . '"' . $size . ' decoding="async"' . $load . '>';
}

/** Fabrički crtež: najveća varijanta + srcset, kao na postojećim stranama detalja. */
function site_drawing_img(string $path, string $alt, string $R): string
{
    $base = preg_replace('/\.(jpe?g|png|webp)$/i', '', $path) ?? $path;
    $variants = str_starts_with($path, 'assets/') ? site_variants($base) : [];
    if ($variants) {
        $srcset = implode(', ', array_map(static fn($v) => site_src($R, $v[1]) . ' ' . $v[0] . 'w', $variants));
        return '<img src="' . e(site_src($R, end($variants)[1])) . '" srcset="' . e($srcset) . '" sizes="(max-width: 700px) 79vw, 492px" data-orig="' . e(site_src($R, $path)) . '" alt="' . e($alt) . '" loading="lazy" decoding="async">';
    }
    return '<img src="' . e(site_src($R, $path)) . '" alt="' . e($alt) . '" loading="lazy" decoding="async">';
}

/** Pouzdane SVG ilustracije iz postojećeg sajta (app/data/items-static.json). */
function site_illu(?string $key): string
{
    $illu = catalog_static()['illu'];
    return $key !== null && isset($illu[$key]) && is_string($illu[$key]) ? $illu[$key] : '';
}
