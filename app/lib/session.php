<?php
/* TRICOM — sesija administracije.
   Kolačić samo za putanju admin/, HttpOnly, SameSite=Lax, Secure na HTTPS-u;
   strogi režim (nepoznat ID se odbacuje); odjava posle neaktivnosti i posle
   najdužeg trajanja prijave. Sesije se čuvaju u app/storage/sessions kada je
   folder upisiv (na deljenom hostingu ne dele folder sa drugim sajtovima). */
defined('TRICOM') || exit;

function admin_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $idle = max(5, (int) config('security.session_idle_minutes', 30)) * 60;
    $max = max(1, (int) config('security.session_max_hours', 8)) * 3600;

    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.use_trans_sid', '0');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.gc_maxlifetime', (string) $max);
    ini_set('session.gc_probability', '1');
    ini_set('session.gc_divisor', '100');
    $dir = APP_DIR . '/storage/sessions';
    if (is_dir($dir) && is_writable($dir)) {
        session_save_path($dir);
    }
    session_name((string) config('security.session_name', 'tricom_admin'));
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => admin_url(),
        'secure'   => is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();

    $now = time();
    $created = (int) ($_SESSION['_created'] ?? 0);
    $last = (int) ($_SESSION['_last'] ?? 0);
    if ($created > 0 && ($now - $created > $max || $now - $last > $idle)) {
        $wasLoggedIn = isset($_SESSION['admin_id']);
        $_SESSION = [];
        session_regenerate_id(true);
        if ($wasLoggedIn) {
            $_SESSION['_expired'] = true;
        }
        $created = 0;
    }
    if ($created === 0) {
        $_SESSION['_created'] = $now;
    }
    $_SESSION['_last'] = $now;
}

/** Novi ID sesije (posle prijave), uz zadržavanje podataka. */
function admin_session_regenerate(): void
{
    session_regenerate_id(true);
    $_SESSION['_created'] = time();
    $_SESSION['_last'] = time();
}

/** Potpuno uništava sesiju i kolačić. */
function admin_session_destroy(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        return;
    }
    $_SESSION = [];
    $p = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires'  => time() - 3600,
        'path'     => $p['path'],
        'secure'   => $p['secure'],
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_destroy();
}
