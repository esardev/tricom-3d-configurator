<?php
/* ==========================================================================
   TRICOM — admin/setup-admin.php (JEDNOKRATNO)
   Pravi prvog i jedinog administratora posle uvoza baze.
   - radi samo ako je u app/config.php postavljen security.setup_secret
     (najmanje 16 znakova) i ako u bazi još nema administratora;
   - tajna se unosi u formu; pokušaji su ograničeni po IP adresi;
   - čim administrator postoji, strana je onemogućena.
   POSLE UPOTREBE OBRIŠITE OVAJ FAJL SA SERVERA i vratite setup_secret na ''.
   ========================================================================== */
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';
app_boot('admin');
require APP_DIR . '/admin/admin.php';
admin_start();

$title = 'Prvi administrator';
$secret = (string) config('security.setup_secret', '');
$view = ['state' => 'form', 'errors' => [], 'username' => ''];

if (strlen($secret) < 16 || config_is_placeholder($secret)) {
    $view['state'] = 'no-secret';
    http_response_code(403);
    admin_render_bare('setup', $view, $title);
}
if (!db_table_exists('admin_users') || !db_table_exists('admin_login_attempts')) {
    $view['state'] = 'no-schema';
    http_response_code(503);
    admin_render_bare('setup', $view, $title);
}
if (admin_count() > 0) {
    $view['state'] = 'exists';
    http_response_code(403);
    admin_render_bare('setup', $view, $title);
}

if (is_post()) {
    csrf_require();
    $username = mb_strtolower(input_str($_POST, 'username'), 'UTF-8');
    $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
    $confirm = is_string($_POST['password_confirm'] ?? null) ? $_POST['password_confirm'] : '';
    $given = is_string($_POST['setup_secret'] ?? null) ? $_POST['setup_secret'] : '';
    $view['username'] = $username;

    $wait = rate_limit_wait('setup');
    if ($wait > 0) {
        $view['errors'][] = 'Previše neuspelih pokušaja. Pokušajte ponovo za ' . wait_label($wait) . '.';
    } elseif (!hash_equals($secret, $given)) {
        rate_limit_hit('setup', null, false);
        app_log('warning', 'Setup: pogrešna tajna');
        $view['errors'][] = 'Tajna za setup nije tačna.';
    } else {
        if (!preg_match(USERNAME_PATTERN, $username)) {
            $view['errors'][] = 'Korisničko ime: 3–50 znakova, samo mala slova, brojevi, tačka, crtica i donja crta.';
        }
        $view['errors'] = array_merge($view['errors'], password_problems($password, $confirm, $username));
        if (!$view['errors']) {
            /* atomično: upis samo ako tabela još nema nijedan nalog */
            $created = db_run(
                'INSERT INTO `admin_users` (`username`, `password_hash`, `created_at`)
                 SELECT ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `admin_users`)',
                [$username, password_hash($password, PASSWORD_DEFAULT), date('Y-m-d H:i:s')]
            )->rowCount();
            if ($created !== 1) {
                $view['state'] = 'exists';
                http_response_code(403);
                admin_render_bare('setup', $view, $title);
            }
            rate_limit_hit('setup', null, true);
            app_log('info', 'Setup: napravljen administrator', ['username' => $username]);
            csrf_rotate();
            $view['state'] = 'done';
        }
    }
}

admin_render_bare('setup', $view, $title);
