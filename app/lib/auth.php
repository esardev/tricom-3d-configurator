<?php
/* TRICOM — administrator: prijava, odjava, ograničenje broja pokušaja.
   Jedan nalog (pravi ga admin/setup-admin.php). Lozinka: password_hash()
   (PASSWORD_DEFAULT) uz automatsko osvežavanje heša. Neuspešni pokušaji se
   broje u admin_login_attempts po (IP + korisničko ime) i po IP adresi,
   u kliznom prozoru; IP i ime se čuvaju samo kao SHA-256. */
defined('TRICOM') || exit;

const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_BYTES = 72;          // bcrypt koristi najviše 72 bajta
const USERNAME_PATTERN = '/^[a-z0-9._-]{3,50}$/';

/** Prijavljeni administrator ili null. */
function admin_user(): ?array
{
    static $cache = [];
    $id = (int) ($_SESSION['admin_id'] ?? 0);
    if ($id <= 0) {
        return null;
    }
    if (!array_key_exists($id, $cache)) {
        $cache[$id] = db_one('SELECT `id`, `username`, `last_login_at` FROM `admin_users` WHERE `id` = ?', [$id]);
    }
    if ($cache[$id] === null) {          // nalog više ne postoji
        unset($_SESSION['admin_id']);
    }
    return $cache[$id];
}

/** Zahteva prijavu; inače preusmerava na prijavu (i pamti traženu stranu). */
function admin_require(): array
{
    $user = admin_user();
    if ($user === null) {
        $next = (string) ($_SERVER['REQUEST_URI'] ?? '');
        redirect(admin_url('login.php', ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET' ? ['next' => safe_admin_next($next)] : []));
    }
    return $user;
}

function admin_count(): int
{
    return (int) db_value('SELECT COUNT(*) FROM `admin_users`');
}

/**
 * Pokušaj prijave. Vraća ['ok' => bool, 'error' => ?string].
 * Poruka o grešci je ista za nepostojeće ime i pogrešnu lozinku.
 */
function admin_login(string $username, string $password): array
{
    $username = mb_strtolower(trim($username), 'UTF-8');
    $wait = rate_limit_wait('login', $username);
    if ($wait > 0) {
        return ['ok' => false, 'error' => 'Previše neuspelih pokušaja. Pokušajte ponovo za ' . wait_label($wait) . '.'];
    }
    if ($username === '' || $password === '') {
        return ['ok' => false, 'error' => 'Unesite korisničko ime i lozinku.'];
    }

    $user = db_one('SELECT `id`, `password_hash` FROM `admin_users` WHERE `username` = ?', [$username]);
    /* isto vreme provere i kad nalog ne postoji */
    $hash = $user['password_hash'] ?? password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
    $valid = password_verify($password, $hash) && $user !== null;

    rate_limit_hit('login', $username, $valid);
    if (!$valid) {
        usleep(random_int(200000, 400000));
        app_log('warning', 'Neuspešna prijava', ['ip' => substr(rate_hash(client_ip()), 0, 12)]);
        return ['ok' => false, 'error' => 'Pogrešno korisničko ime ili lozinka.'];
    }

    if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
        db_run('UPDATE `admin_users` SET `password_hash` = ? WHERE `id` = ?', [password_hash($password, PASSWORD_DEFAULT), (int) $user['id']]);
    }
    db_run('UPDATE `admin_users` SET `last_login_at` = ? WHERE `id` = ?', [date('Y-m-d H:i:s'), (int) $user['id']]);

    admin_session_regenerate();
    unset($_SESSION['_expired']);
    $_SESSION['admin_id'] = (int) $user['id'];
    csrf_rotate();
    return ['ok' => true, 'error' => null];
}

function admin_logout(): void
{
    admin_session_destroy();
}

/** Problemi sa novom lozinkom (prazan niz = u redu). */
function password_problems(string $password, string $confirm, string $username): array
{
    $p = [];
    if (mb_strlen($password, 'UTF-8') < PASSWORD_MIN_LENGTH) {
        $p[] = 'Lozinka mora imati najmanje ' . PASSWORD_MIN_LENGTH . ' znakova.';
    }
    if (strlen($password) > PASSWORD_MAX_BYTES) {
        $p[] = 'Lozinka može imati najviše ' . PASSWORD_MAX_BYTES . ' bajta (oko 70 znakova bez kvačica).';
    }
    if ($password !== $confirm) {
        $p[] = 'Lozinka i potvrda lozinke se ne poklapaju.';
    }
    if ($username !== '' && mb_stripos($password, $username, 0, 'UTF-8') !== false) {
        $p[] = 'Lozinka ne sme da sadrži korisničko ime.';
    }
    return $p;
}

/* ---------------------------------------------------------------- ograničenje pokušaja */

function rate_hash(string $value): string
{
    return hash('sha256', 'tricom|' . $value);
}

/** Sekunde do sledećeg dozvoljenog pokušaja (0 = dozvoljeno). Scope: 'login' | 'setup'. */
function rate_limit_wait(string $scope, ?string $username = null): int
{
    $window = max(1, (int) config('security.login_window_minutes', 15)) * 60;
    $since = date('Y-m-d H:i:s', time() - $window);
    $ip = rate_hash(client_ip());
    $checks = [[
        'SELECT COUNT(*) AS n, MIN(`attempted_at`) AS first FROM `admin_login_attempts` WHERE `scope` = ? AND `ip_hash` = ? AND `succeeded` = 0 AND `attempted_at` >= ?',
        [$scope, $ip, $since],
        $scope === 'setup' ? 5 : max(1, (int) config('security.login_max_per_ip', 20)),
    ]];
    if ($username !== null && $username !== '') {
        $checks[] = [
            'SELECT COUNT(*) AS n, MIN(`attempted_at`) AS first FROM `admin_login_attempts` WHERE `scope` = ? AND `ip_hash` = ? AND `username_hash` = ? AND `succeeded` = 0 AND `attempted_at` >= ?',
            [$scope, $ip, rate_hash($username), $since],
            max(1, (int) config('security.login_max_per_user', 5)),
        ];
    }
    $wait = 0;
    foreach ($checks as [$sql, $params, $limit]) {
        $row = db_one($sql, $params);
        if ($row && (int) $row['n'] >= $limit && $row['first']) {
            $wait = max($wait, $window - (time() - (int) strtotime((string) $row['first'])));
        }
    }
    return max(0, $wait);
}

function rate_limit_hit(string $scope, ?string $username, bool $succeeded): void
{
    $ip = rate_hash(client_ip());
    $user = $username !== null && $username !== '' ? rate_hash($username) : null;
    db_run(
        'INSERT INTO `admin_login_attempts` (`scope`, `ip_hash`, `username_hash`, `succeeded`, `attempted_at`) VALUES (?, ?, ?, ?, ?)',
        [$scope, $ip, $user, $succeeded ? 1 : 0, date('Y-m-d H:i:s')]
    );
    if ($succeeded && $user !== null) {
        /* uspešna prijava briše neuspehe tog imena sa te adrese */
        db_run('DELETE FROM `admin_login_attempts` WHERE `scope` = ? AND `ip_hash` = ? AND `username_hash` = ? AND `succeeded` = 0', [$scope, $ip, $user]);
    }
    if (random_int(1, 50) === 1) {
        db_run('DELETE FROM `admin_login_attempts` WHERE `attempted_at` < ?', [date('Y-m-d H:i:s', time() - 7 * 86400)]);
    }
}

function wait_label(int $seconds): string
{
    $min = max(1, (int) ceil($seconds / 60));
    /* 1, 21, 31 … minut; ostalo minuta */
    return $min . ' ' . ($min % 10 === 1 && $min % 100 !== 11 ? 'minut' : 'minuta');
}
