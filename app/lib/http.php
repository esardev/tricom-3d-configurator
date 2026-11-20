<?php
/* TRICOM — adrese (koren domena ili podfolder), zahtev, preusmerenja.
   Putanje medija u bazi su relativne od korena sajta, bez početne kose crte
   (assets/…, uploads/…); media_url() im dodaje app.base_path. */
defined('TRICOM') || exit;

function base_path(): string
{
    return (string) config('app.base_path', '/');
}

/** Putanja unutar sajta: url('admin/') → '/admin/' ili '/tricom/admin/'. */
function url(string $path = ''): string
{
    return base_path() . ltrim($path, '/');
}

/** Puna adresa sa domenom (canonical, sitemap, preusmerenja). */
function absolute_url(string $path = ''): string
{
    return (string) config('app.base_url') . url($path);
}

function admin_url(string $path = '', array $query = []): string
{
    $u = url('admin/' . ltrim($path, '/'));
    return $query ? $u . '?' . http_build_query($query) : $u;
}

/** Adresa medija iz baze; spoljne http(s) adrese ostaju kakve jesu. */
function media_url(?string $path): string
{
    $path = trim((string) $path);
    if ($path === '') {
        return '';
    }
    if (preg_match('#^https?://#i', $path)) {
        return $path;
    }
    return url($path);
}

/** Putanja rendera: assets/render/<ključ>-<light|dark>.<ext> */
function render_path(string $key, string $theme = 'light', string $ext = 'webp'): string
{
    return 'assets/render/' . $key . '-' . ($theme === 'dark' ? 'dark' : 'light') . '.' . $ext;
}

/** Adresa statičnog fajla sa oznakom verzije (?v=). */
function asset_url(string $path): string
{
    $v = (string) config('app.asset_version', '');
    return url($path) . ($v !== '' ? '?v=' . rawurlencode($v) : '');
}

function is_post(): bool
{
    return ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
}

function is_https(): bool
{
    if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
        return true;
    }
    if ((string) ($_SERVER['SERVER_PORT'] ?? '') === '443') {
        return true;
    }
    if (config('security.trust_proxy_headers') === true) {
        return strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
    }
    return false;
}

/** IP adresa klijenta; zaglavlja proksija samo uz security.trust_proxy_headers. */
function client_ip(): string
{
    if (config('security.trust_proxy_headers') === true) {
        foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR'] as $h) {
            $first = trim(explode(',', (string) ($_SERVER[$h] ?? ''))[0]);
            if ($first !== '' && filter_var($first, FILTER_VALIDATE_IP)) {
                return $first;
            }
        }
    }
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

/** Preusmerenje samo na putanju unutar sajta. */
function redirect(string $location, int $status = 303): never
{
    if (!str_starts_with($location, '/') || str_starts_with($location, '//') || str_contains($location, '\\')) {
        $location = url();
    }
    header('Location: ' . $location, true, $status);
    exit;
}

/** Vraća $next ako je bezbedna putanja unutar administracije, inače početnu stranu administracije. */
function safe_admin_next(mixed $next): string
{
    $next = is_string($next) ? $next : '';
    $base = admin_url();
    if ($next === '' || !str_starts_with($next, $base) || str_contains($next, '\\') || preg_match('#//|[\r\n]#', substr($next, 1))) {
        return $base;
    }
    return $next;
}

/** Na http:// preusmerava na https:// adresu iz app.base_url (ako je uključeno). */
function enforce_https(): void
{
    if (is_https() || config('security.force_https') !== true) {
        return;
    }
    $origin = preg_replace('#^http://#i', 'https://', (string) config('app.base_url'));
    $uri = (string) ($_SERVER['REQUEST_URI'] ?? url());
    if (!str_starts_with($uri, '/') || str_starts_with($uri, '//')) {
        $uri = url();
    }
    header('Location: ' . $origin . $uri, true, 301);
    exit;
}
