<?php
/* TRICOM — zajedničko za administraciju: početak zahteva, zaglavlja,
   spisak modula (meni) i iscrtavanje strana kroz app/views/admin/. */
defined('TRICOM') || exit;

/** Početak svake strane administracije (posle app_boot('admin')). */
function admin_start(): void
{
    enforce_https();
    admin_send_headers();
    admin_session_start();
}

function admin_send_headers(): void
{
    if (headers_sent()) {
        return;
    }
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('Pragma: no-cache');
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: same-origin');
    header('X-Robots-Tag: noindex, nofollow');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    header("Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
    if (is_https()) {
        header('Strict-Transport-Security: max-age=31536000');
    }
}

/**
 * Moduli iz menija. Ključ = ?m= u admin/index.php; obrada je u
 * app/admin/modules/<ključ>.php (dok fajla nema, prikazuje se najava).
 * tables = tabele čiji se broj redova vidi na kontrolnoj tabli;
 * add = [natpis, a=] brza radnja na kontrolnoj tabli; page = javna strana (SR) gde se sadržaj vidi.
 */
function admin_modules(): array
{
    return [
        'kategorije' => ['label' => 'Kategorije proizvoda', 'tables' => ['categories' => 'kategorija'],
                         'add' => ['Nova kategorija', 'new'], 'page' => 'proizvodi.html',
                         'hint' => 'Tabovi prodajnog programa: naziv, naslov, uvod i redosled.'],
        'proizvodi'  => ['label' => 'Proizvodi', 'tables' => ['products' => 'proizvoda', 'product_specs' => 'redova tehničkih podataka'],
                         'add' => ['Novi proizvod', 'new'], 'page' => 'proizvodi.html',
                         'hint' => 'Proizvodi sa tehničkim podacima, slikama i prikazom u tabovima.'],
        'usluge'     => ['label' => 'Usluge', 'tables' => ['services' => 'usluga i mogućnosti', 'service_specs' => 'redova tehničkih podataka'],
                         'add' => ['Nova usluga', 'new'], 'page' => 'usluge.html',
                         'hint' => 'Usluge obrade i mogućnosti CNC plazme.'],
        'reference'  => ['label' => 'Reference', 'tables' => ['client_references' => 'referenci'],
                         'add' => ['Nova referenca', 'new'], 'page' => 'reference.html',
                         'hint' => 'Objekti, partneri i vrste zahtevnih poslova.'],
        'galerije'   => ['label' => 'Galerije', 'tables' => ['gallery_categories' => 'kategorija', 'gallery_images' => 'slika'],
                         'add' => ['Otpremi slike', 'upload'], 'page' => 'galerija.html',
                         'hint' => 'Kategorije galerije (filteri) i fotografije.'],
        'pitanja'    => ['label' => 'Česta pitanja', 'tables' => ['faq_items' => 'pitanja'],
                         'add' => ['Novo pitanje', 'new'], 'page' => 'o-nama.html',
                         'hint' => 'Pitanja i odgovori na strani O nama i na početnoj strani.'],
        'kontakt'    => ['label' => 'Kontakt', 'tables' => ['contact_locations' => 'lokacije', 'contact_phones' => 'telefona'],
                         'add' => ['Uredi kontakt podatke', ''], 'page' => 'kontakt.html',
                         'hint' => 'Adrese, telefoni, e-pošta, radno vreme i podaci o firmi.'],
        /* interno: ne prikazuje se na sajtu (zakrpa 009) */
        'upiti'      => ['label' => 'Upiti', 'tables' => ['inquiries' => 'upita'],
                         'add' => ['Pregled upita', ''], 'page' => 'kontakt.html', 'internal' => true,
                         'hint' => 'Upiti sa kontakt forme sa internim obračunom stavki kalkulatora.'],
        'cenovnik'   => ['label' => 'Cenovnik', 'tables' => [],
                         'add' => ['Uredi cenovnik', ''], 'page' => 'kalkulatori.html', 'internal' => true,
                         'hint' => 'Interne cene trapeznih limova i filca (ne prikazuju se na sajtu).'],
    ];
}

/** Sadržaj pogleda app/views/admin/<ime>.php kao string. */
function admin_view(string $view, array $data = []): string
{
    if (!preg_match('/^[a-z0-9-]+$/', $view)) {
        throw new InvalidArgumentException('Neispravno ime pogleda.');
    }
    extract($data, EXTR_SKIP);
    ob_start();
    require APP_DIR . '/views/admin/' . $view . '.php';
    return (string) ob_get_clean();
}

/** Strana sa menijem (zahteva prijavljenog administratora). */
function admin_render(string $view, array $data, string $title, string $active = ''): never
{
    $content = admin_view($view, $data);
    echo admin_view('layout', [
        'title'   => $title,
        'active'  => $active,
        'content' => $content,
        'user'    => admin_user(),
        'modules' => admin_modules(),
        'flashes' => flash_pull(),
    ]);
    exit;
}

/** Strana bez menija (prijava, setup). */
function admin_render_bare(string $view, array $data, string $title): never
{
    $content = admin_view($view, $data);
    echo admin_view('layout-bare', ['title' => $title, 'content' => $content, 'flashes' => flash_pull()]);
    exit;
}

/** Bez uvezene šeme administracija ne radi → 503 (detalj samo u dnevniku). */
function admin_require_schema(): void
{
    if (!db_table_exists('admin_users') || !db_table_exists('admin_login_attempts')) {
        throw new AppUnavailableException('Tabele administracije ne postoje — uvezite database/001-schema.sql.');
    }
}

/** Da li setup fajl još postoji na serveru (upozorenje na kontrolnoj tabli). */
function admin_setup_file_present(): bool
{
    return is_file(SITE_DIR . '/admin/setup-admin.php');
}
