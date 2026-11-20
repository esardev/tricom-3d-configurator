<?php
/* ==========================================================================
   TRICOM — app/bootstrap.php
   Zajednički početak svake PHP ulazne tačke:

     require __DIR__ . '/../app/bootstrap.php';
     app_boot('admin');            // ili 'public'

   Učitava pomoćne funkcije, podešava greške i dnevnik, čita app/config.php.
   Veza sa bazom se otvara tek pri prvom db() pozivu. Nedostajuća ili
   nepotpuna konfiguracija i nedostupna baza daju opštu stranicu 503 bez
   detalja (detalji idu u app/storage/logs).
   ========================================================================== */
declare(strict_types=1);

const TRICOM = true;
define('APP_DIR', __DIR__);
define('SITE_DIR', dirname(__DIR__));

/* Stariji PHP ne bi ni pročitao ostale fajlove (sintaksa 8.1+): jasna poruka umesto prazne greške. */
if (PHP_VERSION_ID < 80100) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Sajt trenutno nije dostupan: potreban je PHP 8.1 ili noviji (preporučeno 8.3).\n"
        . "Izaberite verziju PHP-a u kontrolnoj tabli hostinga (npr. cPanel → Select PHP Version).\n";
    exit;
}

require APP_DIR . '/lib/errors.php';
require APP_DIR . '/lib/config.php';
require APP_DIR . '/lib/db.php';
require APP_DIR . '/lib/http.php';
require APP_DIR . '/lib/html.php';
require APP_DIR . '/lib/i18n.php';
require APP_DIR . '/lib/validate.php';
require APP_DIR . '/lib/upload.php';
require APP_DIR . '/lib/session.php';
require APP_DIR . '/lib/flash.php';
require APP_DIR . '/lib/csrf.php';
require APP_DIR . '/lib/auth.php';

/** Podešava okruženje za kontekst 'public' (sajt) ili 'admin' (administracija). */
function app_boot(string $context = 'public'): void
{
    error_reporting(E_ALL);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    ini_set('zend.exception_ignore_args', '1');   // bez argumenata (lozinki) u tragovima
    date_default_timezone_set('Europe/Belgrade');

    app_context($context === 'admin' ? 'admin' : 'public');
    set_error_handler('app_error_handler');
    set_exception_handler('app_exception_handler');
    register_shutdown_function('app_shutdown_handler');

    /* obavezna proširenja PHP-a (na hostingu se uključuju u izboru verzije PHP-a) */
    $missing = array_filter(['pdo_mysql', 'mbstring', 'fileinfo'], static fn($x) => !extension_loaded($x));
    if ($missing) {
        throw new AppUnavailableException('Nedostaju PHP proširenja: ' . implode(', ', $missing) . '.');
    }
    mb_internal_encoding('UTF-8');

    config_load();
    date_default_timezone_set((string) config('app.timezone'));
}
