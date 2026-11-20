<?php
/* ==========================================================================
   TRICOM — app/config.example.php
   Šablon konfiguracije. Na serveru napravite kopiju ovog fajla pod imenom
   app/config.php (File Manager → Copy) i u kopiji upišite prave vrednosti
   (v. DEPLOYMENT.md). Šablon se ne menja; config.php se ne šalje pri kasnijim
   izmenama sajta. Vrednosti koje počinju sa CHANGE_ME moraju se zameniti —
   dok god stoje, sajt i administracija javljaju „privremeno nedostupno“.
   Folder app/ je zatvoren za pristup sa weba (app/.htaccess).
   ========================================================================== */
defined('TRICOM') || exit;

return [

    'app' => [
        /* Kanonski javni domen: šema i domen, bez putanje i bez završne kose
           crte. Od njega se prave canonical, hreflang, sitemap i JSON-LD adrese.
           Stari tricom.co.rs i www varijante preusmerava .htaccess. */
        'base_url'      => 'https://tricom.rs',
        /* Instalaciona putanja: '/' u korenu domena, '/tricom/' u podfolderu
           (uvek počinje i završava se kosom crtom). */
        'base_path'     => '/',
        'timezone'      => 'Europe/Belgrade',
        /* true samo privremeno pri otklanjanju greške: stranica greške tada
           prikazuje detalje. Na produkciji uvek false. */
        'debug'         => false,
        /* Oznaka verzije za ?v= na CSS/JS (ista kao u HTML stranama). */
        'asset_version' => '2026-11-19.10',
    ],

    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'CHANGE_ME_DB_NAME',
        'user' => 'CHANGE_ME_DB_USER',
        'pass' => 'CHANGE_ME_DB_PASSWORD',
    ],

    'security' => [
        /* Tajna za jednokratni admin/setup-admin.php (najmanje 16 znakova).
           Prazno = setup zaključan. Posle pravljenja administratora vratite na
           '' i obrišite admin/setup-admin.php sa servera. */
        'setup_secret'         => '',
        'session_name'         => 'tricom_admin',
        'session_idle_minutes' => 30,   // odjava posle neaktivnosti
        'session_max_hours'    => 8,    // najduže trajanje jedne prijave
        /* Administracija samo preko HTTPS-a (preusmerava sa http://). */
        'force_https'          => true,
        /* Ograničenje prijave: neuspešnih pokušaja u prozoru od N minuta. */
        'login_max_per_user'   => 5,    // isto korisničko ime sa iste IP adrese
        'login_max_per_ip'     => 20,   // ukupno sa jedne IP adrese
        'login_window_minutes' => 15,
        /* true samo ako je sajt iza proksija/CDN-a (npr. Cloudflare) koji
           postavlja X-Forwarded-For / X-Forwarded-Proto / CF-Connecting-IP. */
        'trust_proxy_headers'  => false,
    ],

    'uploads' => [
        'max_mb'     => 8,          // najveća veličina jednog fajla
        'max_pixels' => 40000000,   // najviše piksela slike (širina × visina)
    ],

    /* Slanje upita iz kalkulatora prodaji, sa PDF specifikacijom u prilogu.
       Primalac je e-pošta iz administracije (Kontakt → e-pošta). Dok je 'from'
       prazno, server ne šalje e-poštu i kupac šalje upit iz svog programa za
       e-poštu, kao ranije. */
    'mail' => [
        /* 'mail' = PHP mail() hostinga; 'smtp' = nalog e-pošte (preporučeno ako
           poruke sa mail() ne stižu ili završavaju u neželjenoj pošti) */
        'transport'   => 'mail',
        /* adresa pošiljaoca na domenu sajta, npr. 'sajt@tricom.rs' (postojeći
           nalog ili adresa koju hosting dozvoljava za slanje); odgovor ide kupcu */
        'from'        => '',
        'from_name'   => 'TRICOM sajt',
        /* samo za 'smtp' (podaci iz panela hostinga → Email Accounts → Connect Devices) */
        'smtp_host'   => '',
        'smtp_port'   => 587,       // 587 uz 'tls', 465 uz 'ssl'
        'smtp_secure' => 'tls',     // 'tls' | 'ssl' | 'none'
        'smtp_user'   => '',
        'smtp_pass'   => '',
        'timeout'     => 20,        // sekundi
    ],
];
