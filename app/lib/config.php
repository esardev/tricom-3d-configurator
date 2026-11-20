<?php
/* TRICOM — učitavanje i provera app/config.php. */
defined('TRICOM') || exit;

const CONFIG_PLACEHOLDER = 'CHANGE_ME';

function config_defaults(): array
{
    return [
        'app' => [
            'base_url'      => 'https://tricom.rs',
            'base_path'     => '/',
            'timezone'      => 'Europe/Belgrade',
            'debug'         => false,
            'asset_version' => '',
        ],
        'db' => [
            'host' => 'localhost',
            'port' => 3306,
            'name' => '',
            'user' => '',
            'pass' => '',
        ],
        'security' => [
            'setup_secret'         => '',
            'session_name'         => 'tricom_admin',
            'session_idle_minutes' => 30,
            'session_max_hours'    => 8,
            'force_https'          => true,
            'login_max_per_user'   => 5,
            'login_max_per_ip'     => 20,
            'login_window_minutes' => 15,
            'trust_proxy_headers'  => false,
        ],
        'uploads' => [
            'max_mb'     => 8,
            'max_pixels' => 40000000,
        ],
        /* slanje upita iz kalkulatora sa PDF-om (app/lib/mailer.php); prazno 'from' = isključeno */
        'mail' => [
            'transport'   => 'mail',
            'from'        => '',
            'from_name'   => 'TRICOM sajt',
            'smtp_host'   => '',
            'smtp_port'   => 587,
            'smtp_secure' => 'tls',
            'smtp_user'   => '',
            'smtp_pass'   => '',
            'timeout'     => 20,
        ],
    ];
}

/** Čuva/vraća učitanu konfiguraciju (null dok nije učitana). */
function config_store(?array $set = null): ?array
{
    static $config = null;
    if ($set !== null) {
        $config = $set;
    }
    return $config;
}

function config_load(): void
{
    $file = APP_DIR . '/config.php';
    if (!is_file($file)) {
        throw new AppUnavailableException('Nedostaje app/config.php — napravite ga po app/config.example.php.');
    }
    $loaded = require $file;
    if (!is_array($loaded)) {
        throw new AppUnavailableException('app/config.php mora da vrati niz (return [ … ];).');
    }
    $config = array_replace_recursive(config_defaults(), $loaded);
    $config['app']['base_url'] = rtrim((string) $config['app']['base_url'], '/');
    config_store($config);

    $problems = config_problems($config);
    if ($problems) {
        throw new AppUnavailableException('Konfiguracija nije potpuna: ' . implode('; ', $problems));
    }
}

/** Spisak problema u konfiguraciji (bez vrednosti tajni). */
function config_problems(array $c): array
{
    $p = [];
    foreach (['host', 'name', 'user'] as $k) {
        $v = $c['db'][$k] ?? '';
        if (!is_string($v) || trim($v) === '' || config_is_placeholder($v)) {
            $p[] = "db.$k nije podešen";
        }
    }
    if (!is_string($c['db']['pass']) || config_is_placeholder($c['db']['pass'])) {
        $p[] = 'db.pass nije podešen';
    }
    if (!is_numeric($c['db']['port']) || (int) $c['db']['port'] < 1 || (int) $c['db']['port'] > 65535) {
        $p[] = 'db.port nije ispravan';
    }
    if (!preg_match('#^https?://[A-Za-z0-9.-]+(:\d+)?$#', (string) $c['app']['base_url'])) {
        $p[] = 'app.base_url mora biti oblika https://domen (bez putanje)';
    }
    if (!preg_match('#^/([A-Za-z0-9._~-]+/)*$#', (string) $c['app']['base_path'])) {
        $p[] = "app.base_path mora počinjati i završavati se sa '/' (npr. '/' ili '/tricom/')";
    }
    if (!in_array($c['app']['timezone'], timezone_identifiers_list(), true)) {
        $p[] = 'app.timezone nije ispravna vremenska zona';
    }
    if (!preg_match('/^[A-Za-z0-9_]{1,40}$/', (string) $c['security']['session_name'])) {
        $p[] = 'security.session_name sme da sadrži samo slova, brojeve i _';
    }
    return $p;
}

function config_is_placeholder(mixed $value): bool
{
    return is_string($value) && str_starts_with(trim($value), CONFIG_PLACEHOLDER);
}

/** Vrednost po putanji sa tačkama, npr. config('db.host'). */
function config(string $key, mixed $default = null): mixed
{
    $value = config_raw($key);
    return $value ?? $default;
}

/** Kao config(), ali bez podrazumevane vrednosti i bezbedno pre učitavanja. */
function config_raw(string $key): mixed
{
    $node = config_store();
    if ($node === null) {
        return null;
    }
    foreach (explode('.', $key) as $part) {
        if (!is_array($node) || !array_key_exists($part, $node)) {
            return null;
        }
        $node = $node[$part];
    }
    return $node;
}
