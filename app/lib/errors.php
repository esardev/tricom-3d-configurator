<?php
/* TRICOM — greške, dnevnik i opšta stranica greške.
   Javno se nikad ne prikazuju poruke izuzetaka, putanje, SQL ni podaci za
   pristup; posetilac vidi samo opštu poruku i referentni kod koji se nalazi i
   u dnevniku (app/storage/logs/app-GGGG-MM.log). */
defined('TRICOM') || exit;

/** Konfiguracija ili baza nisu dostupni → 503. */
final class AppUnavailableException extends RuntimeException {}

/** Zahtev koji ne može da se obradi (npr. istekao CSRF token) → 4xx sa porukom za korisnika. */
final class HttpException extends RuntimeException
{
    public function __construct(public readonly int $status, string $publicMessage)
    {
        parent::__construct($publicMessage, $status);
    }
}

function app_context(?string $set = null): string
{
    static $context = 'public';
    if ($set !== null) {
        $context = $set;
    }
    return $context;
}

function app_log(string $level, string $message, array $context = []): void
{
    $line = '[' . date('Y-m-d H:i:s') . '] ' . strtoupper($level) . ' ' . log_scrub($message);
    if ($context) {
        $line .= ' ' . log_scrub((string) json_encode($context, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR));
    }
    $dir = APP_DIR . '/storage/logs';
    if (is_dir($dir) && is_writable($dir)) {
        if (@file_put_contents($dir . '/app-' . date('Y-m') . '.log', $line . "\n", FILE_APPEND | LOCK_EX) !== false) {
            return;
        }
    }
    error_log($line);
}

/** Lozinka baze, lozinka SMTP naloga i tajna za setup nikad ne ulaze u dnevnik. */
function log_scrub(string $text): string
{
    foreach (['db.pass', 'security.setup_secret', 'mail.smtp_pass'] as $key) {
        $secret = config_raw($key);
        if (is_string($secret) && strlen($secret) >= 4) {
            $text = str_replace($secret, '***', $text);
        }
    }
    return $text;
}

function app_error_handler(int $errno, string $message, string $file = '', int $line = 0): bool
{
    if (!(error_reporting() & $errno)) {
        return false;
    }
    if (in_array($errno, [E_DEPRECATED, E_USER_DEPRECATED], true)) {
        app_log('notice', $message . ' @ ' . $file . ':' . $line);
        return true;
    }
    throw new ErrorException($message, 0, $errno, $file, $line);
}

function app_exception_handler(Throwable $e): void
{
    if ($e instanceof HttpException) {
        app_error_page($e->status, null, $e->getMessage());
    }
    $ref = bin2hex(random_bytes(4));
    $unavailable = $e instanceof AppUnavailableException;
    $msg = get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine();
    if ($prev = $e->getPrevious()) {
        $msg .= ' | uzrok ' . get_class($prev) . ': ' . $prev->getMessage();
    }
    app_log('error', $msg, [
        'ref'   => $ref,
        'uri'   => $_SERVER['REQUEST_URI'] ?? '',
        'trace' => $unavailable ? null : $e->getTraceAsString(),
    ]);
    app_error_page($unavailable ? 503 : 500, $ref, null, config_raw('app.debug') === true ? $e : null);
}

function app_shutdown_handler(): void
{
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR], true)) {
        $ref = bin2hex(random_bytes(4));
        app_log('fatal', $err['message'] . ' @ ' . $err['file'] . ':' . $err['line'], ['ref' => $ref]);
        app_error_page(500, $ref);
    }
}

/**
 * Opšta stranica greške; prekida izvršavanje.
 * $userMessage — bezbedna poruka za korisnika (4xx); $debug — samo uz app.debug.
 */
function app_error_page(int $status, ?string $ref = null, ?string $userMessage = null, ?Throwable $debug = null): never
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: text/html; charset=utf-8');
        header('Cache-Control: no-store, private');
        header('X-Robots-Tag: noindex, nofollow');
        header('X-Content-Type-Options: nosniff');
        if ($status === 503) {
            header('Retry-After: 300');
        }
    }

    $admin = app_context() === 'admin';
    if ($userMessage !== null) {
        $title = $status === 404 ? 'Stranica nije pronađena' : 'Zahtev nije izvršen';
        $body = [$userMessage];
    } elseif ($status === 503) {
        $title = $admin ? 'Administracija trenutno nije dostupna' : 'Sajt je privremeno nedostupan';
        $body = $admin
            ? ['Pokušajte ponovo za nekoliko minuta. Ako se poruka ponavlja, proverite konfiguraciju i bazu (dnevnik: app/storage/logs).']
            : ['Pokušajte ponovo za nekoliko minuta.', 'The site is temporarily unavailable. Please try again in a few minutes.'];
    } else {
        $title = 'Došlo je do greške';
        $body = $admin
            ? ['Zahtev nije mogao da se obradi. Pokušajte ponovo; ako se greška ponavlja, pogledajte dnevnik (app/storage/logs).']
            : ['Zahtev nije mogao da se obradi. Pokušajte ponovo.', 'Something went wrong. Please try again.'];
    }

    $h = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    echo '<!doctype html><html lang="sr"><head><meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<meta name="robots" content="noindex, nofollow"><title>', $h($title), ' — TRICOM</title>',
        '<style>body{margin:0;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;background:#F8FAFC;color:#0B0E13}',
        'main{max-width:36rem;margin:12vh auto;padding:0 16px}h1{font-size:1.5rem;line-height:1.25;margin:0 0 1rem}',
        'p{margin:0 0 .75rem}code,pre{font:13px/1.5 ui-monospace,Consolas,monospace}.ref{color:#5b6573}',
        'pre{white-space:pre-wrap;background:#fff;border:1px solid #dfe3ea;padding:12px;overflow:auto}',
        '@media (prefers-color-scheme:dark){body{background:#0B0E13;color:#E8ECF2}.ref{color:#9aa4b2}pre{background:#151a22;border-color:#2a313d}}</style>',
        '</head><body><main><h1>', $h($title), '</h1>';
    foreach ($body as $p) {
        echo '<p>', $h($p), '</p>';
    }
    if ($ref !== null) {
        echo '<p class="ref">Referenca: <code>', $h($ref), '</code></p>';
    }
    if ($debug !== null) {
        echo '<pre>', $h(get_class($debug) . ': ' . $debug->getMessage() . "\n" . $debug->getFile() . ':' . $debug->getLine() . "\n\n" . $debug->getTraceAsString()), '</pre>';
    }
    echo '</main></body></html>';
    exit;
}
