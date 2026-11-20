<?php
/* TRICOM — zaštita od CSRF-a za svaki POST u administraciji.
   Token po sesiji (32 nasumična bajta) u skrivenom polju _csrf; uz to se
   odbija POST čije zaglavlje Origin pokazuje na drugi domen. */
defined('TRICOM') || exit;

function csrf_token(): string
{
    if (empty($_SESSION['_csrf']) || !is_string($_SESSION['_csrf'])) {
        $_SESSION['_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['_csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="_csrf" value="' . e(csrf_token()) . '">';
}

/** Novi token (posle prijave i odjave). */
function csrf_rotate(): void
{
    unset($_SESSION['_csrf']);
}

function csrf_valid(): bool
{
    $sent = $_POST['_csrf'] ?? '';
    $known = $_SESSION['_csrf'] ?? '';
    if (!is_string($sent) || !is_string($known) || $known === '' || !hash_equals($known, $sent)) {
        return false;
    }
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin !== '' && $origin !== 'null') {
        $host = parse_url($origin, PHP_URL_HOST);
        if (!is_string($host) || strcasecmp($host, (string) parse_url('//' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST)) !== 0) {
            return false;
        }
    }
    return true;
}

/** Prekida zahtev (400) ako token ne važi. Pozvati na početku svake obrade POST-a. */
function csrf_require(): void
{
    /* zahtev veći od post_max_size: PHP odbacuje celu formu (i token) — jasna poruka umesto „token nije važeći“ */
    $limit = ini_bytes((string) ini_get('post_max_size'));
    if (!$_POST && !$_FILES && $limit > 0 && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > $limit) {
        throw new HttpException(413, 'Poslato je previše podataka odjednom (server prima najviše ' . number_format($limit / 1048576, 0, ',', '.')
            . ' MB po slanju). Vratite se i otpremite manje fajlova odjednom.');
    }
    if (!csrf_valid()) {
        throw new HttpException(400, 'Sigurnosni token forme nije važeći ili je istekao. Vratite se, osvežite stranicu i pokušajte ponovo.');
    }
}
