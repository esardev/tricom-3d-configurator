<?php
/* TRICOM — prijem upita sa kontakt forme (POST /upit.php, js/main.js).

   Dva odvojena toka (odgovor uvek sadrži samo broj upita — nikad cene ni iznose):
   - obična kontakt forma (bez stavki kalkulatora): upit se beleži u administraciji
     (Upiti), a forma zatim otvara program za e-poštu kupca (mailto), kao do sada
     → odgovor next = 'mailto';
   - upit iz kalkulatora (bar jedna stavka calc:… u polju „konfiguracija“, krug 10):
     upit se beleži, server pravi PDF specifikaciju i šalje je prodaji
     (app/lib/quote-mail.php); kupcu se javlja uspeh (next = 'done') tek kad transport
     prihvati poruku sa prilogom. Neuspeh: upit ostaje sačuvan, odgovor ok = false sa
     brojem upita i next = 'retry'; ponovni pokušaj sa istim ključem (polje „kljuc“)
     ne pravi novi upit niti šalje drugu poruku ako je prva prihvaćena.
     Ako slanje sa servera nije podešeno ili zakrpa 010 nije uvezena: upit se beleži
     i kupac se upućuje na svoj program za e-poštu (next = 'mailto'), kao ranije.
   Ako prijem uopšte ne uspe (npr. zakrpa 009 nije uvezena), forma priprema e-poruku
   kao i ranije, bez broja.

   Zaštita: obavezno zaglavlje X-Tricom-Upit (drugi sajt ga ne može poslati
   bez CORS dozvole) i Origin istog domena; ograničenje broja slanja po IP
   adresi (otisak SHA-256, kao kod prijave). */
defined('TRICOM') || exit;

require_once APP_DIR . '/lib/quote.php';
require_once APP_DIR . '/lib/quote-mail.php';

const INQUIRY_LIMITS = ['name' => 200, 'email' => 254, 'phone' => 50, 'topic' => 60, 'message' => 8000, 'config' => 20000, 'note' => 4000];
const INQUIRY_RATE = [[600, 5], [86400, 30]];      // [sekundi, najviše upita] sa iste IP adrese

function inquiry_json(int $status, array $body): never
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, private');
        header('X-Content-Type-Options: nosniff');
        header('X-Robots-Tag: noindex, nofollow');
    }
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Polja forme (imena kao u kontakt-sr/en.php) → očišćene vrednosti i greške. */
function inquiry_input(array $src): array
{
    $v = [
        'name' => input_str($src, 'ime'),
        'email' => input_str($src, 'email'),
        'phone' => input_str($src, 'telefon'),
        'topic' => input_str($src, 'tema'),
        'message' => input_str($src, 'poruka', true),
        'config_refs' => input_str($src, 'konfiguracija', true),
        'production_note' => input_str($src, 'proizvodnja', true),
        'lang' => input_str($src, 'jezik') === 'en' ? 'en' : 'sr',
        'key' => preg_match('/^[a-f0-9]{32}$/', input_str($src, 'kljuc')) ? input_str($src, 'kljuc') : null,
    ];
    $err = [];
    if ($v['name'] === '' || mb_strlen($v['name']) > INQUIRY_LIMITS['name']) {
        $err[] = 'ime';
    }
    if ($v['email'] === '' || mb_strlen($v['email']) > INQUIRY_LIMITS['email'] || !filter_var($v['email'], FILTER_VALIDATE_EMAIL)) {
        $err[] = 'email';
    }
    if (mb_strlen($v['phone']) > INQUIRY_LIMITS['phone'] || ($v['phone'] !== '' && strlen(preg_replace('/\D/', '', $v['phone']) ?? '') < 6)) {
        $err[] = 'telefon';
    }
    if (mb_strlen($v['topic']) > INQUIRY_LIMITS['topic']) {
        $err[] = 'tema';
    }
    if (mb_strlen($v['message']) < 10 || mb_strlen($v['message']) > INQUIRY_LIMITS['message']) {
        $err[] = 'poruka';
    }
    if (mb_strlen($v['config_refs']) > INQUIRY_LIMITS['config']) {
        $err[] = 'konfiguracija';
    }
    if (mb_strlen($v['production_note']) > INQUIRY_LIMITS['note']) {
        $err[] = 'proizvodnja';
    }
    return [$v, $err];
}

function inquiry_same_origin(): bool
{
    if (($_SERVER['HTTP_X_TRICOM_UPIT'] ?? '') !== '1') {
        return false;
    }
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin === '' || $origin === 'null') {
        return true;                                   // stariji pregledači ne šalju Origin za isti domen
    }
    $host = parse_url($origin, PHP_URL_HOST);
    return is_string($host) && strcasecmp($host, (string) parse_url('//' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST)) === 0;
}

/** Sekunde čekanja ako je ista IP adresa poslala previše upita (0 = može). */
function inquiry_rate_wait(string $ipHash): int
{
    foreach (INQUIRY_RATE as [$window, $max]) {
        $n = (int) db_value('SELECT COUNT(*) FROM `inquiries` WHERE `ip_hash` = ? AND `created_at` >= ?', [$ipHash, date('Y-m-d H:i:s', time() - $window)]);
        if ($n >= $max) {
            return $window;
        }
    }
    return 0;
}

/** Broj upita za kupca i osoblje: U-GGGGMMDD-XXXX (bez slova koja liče na cifre). */
function inquiry_new_ref(): string
{
    $abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for ($try = 0; $try < 8; $try++) {
        $code = '';
        for ($i = 0; $i < 4; $i++) {
            $code .= $abc[random_int(0, strlen($abc) - 1)];
        }
        $ref = 'U-' . date('Ymd') . '-' . $code;
        if (!db_value('SELECT 1 FROM `inquiries` WHERE `ref_code` = ?', [$ref])) {
            return $ref;
        }
    }
    throw new RuntimeException('Broj upita nije mogao da se dodeli.');
}

/** Obrada POST /upit.php; odgovor je uvek JSON. */
function inquiry_receive(): never
{
    if (!is_post()) {
        header('Allow: POST');
        inquiry_json(405, ['ok' => false, 'error' => 'method']);
    }
    if (!inquiry_same_origin()) {
        inquiry_json(403, ['ok' => false, 'error' => 'origin']);
    }
    try {
        if (!pricing_ready()) {
            app_log('warning', 'Upit nije zabeležen: tabele upita ne postoje — uvezite database/patches/009-price-list-inquiries.sql.');
            inquiry_json(503, ['ok' => false, 'error' => 'unavailable']);
        }
        [$v, $err] = inquiry_input($_POST);
        if ($err) {
            inquiry_json(422, ['ok' => false, 'error' => 'invalid', 'fields' => $err]);
        }
        $v2 = quote_flow_ready();                                   // zakrpa 010
        $quote = $v2 && qp_has_calc_items((string) $v['config_refs']);

        /* ponovni pokušaj istog slanja (isti ključ): isti upit, bez novog reda i bez nove poruke */
        if ($v2 && $v['key'] !== null && ($old = db_one('SELECT * FROM `inquiries` WHERE `submit_key` = ?', [$v['key']]))) {
            inquiry_existing_reply($old);
        }

        $ipHash = rate_hash(client_ip());
        if (inquiry_rate_wait($ipHash) > 0) {
            inquiry_json(429, ['ok' => false, 'error' => 'rate']);
        }
        /* upit iz kalkulatora se šalje sa servera samo kad je slanje podešeno; inače mailto, kao ranije */
        $problem = $quote ? quote_mail_problem() : null;
        $ref = inquiry_new_ref();
        $row = [
            'ref_code' => $ref, 'lang' => $v['lang'], 'name' => $v['name'], 'email' => $v['email'], 'phone' => $v['phone'],
            'topic' => $v['topic'], 'message' => $v['message'],
            'config_refs' => $v['config_refs'] !== '' ? $v['config_refs'] : null,
            'production_note' => $v['production_note'] !== '' ? $v['production_note'] : null,
            'ip_hash' => $ipHash, 'created_at' => date('Y-m-d H:i:s'),
        ];
        if ($v2) {
            $row += ['submit_key' => $v['key'], 'flow' => $quote ? 'quote' : 'contact',
                     'mail_status' => $quote && $problem === null ? 'pending' : null,
                     'mail_error' => $problem !== null ? mb_substr('Slanje sa servera nije podešeno: ' . $problem, 0, 250) : null];
        }
        try {
            $id = db_insert('inquiries', $row);
        } catch (PDOException $e) {
            /* isti ključ je upravo upisao drugi zahtev (dvostruki klik): odgovara se za taj upit */
            $old = $v2 && $v['key'] !== null ? db_one('SELECT * FROM `inquiries` WHERE `submit_key` = ?', [$v['key']]) : null;
            if (!$old) {
                throw $e;
            }
            inquiry_existing_reply($old);
        }
    } catch (Throwable $e) {
        app_log('error', 'Prijem upita nije uspeo: ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
        inquiry_json($e instanceof AppUnavailableException ? 503 : 500, ['ok' => false, 'error' => 'server']);
    }

    /* upit je primljen; obračun je odvojen — ni greška u obračunu ne odbija upit */
    try {
        quote_save($id, quote_build((string) $v['config_refs'], pricelist_load(), 'sajt'));
    } catch (Throwable $e) {
        app_log('error', 'Obračun upita ' . $ref . ' nije sačuvan: ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    }
    if (!$quote || $problem !== null) {
        if ($problem !== null) {
            app_log('warning', 'Upit ' . $ref . ' iz kalkulatora: slanje sa servera nije podešeno (' . $problem . ') — kupac je upućen na svoj program za e-poštu.');
        }
        inquiry_json(200, ['ok' => true, 'ref' => $ref, 'next' => 'mailto']);
    }
    inquiry_quote_reply($ref, inquiry_try_send($id, $ref));
}

/** Slanje bez izuzetka prema posetiocu: svaka greška ostavlja upit sa mail_status = 'failed'. */
function inquiry_try_send(int $id, string $ref): array
{
    try {
        return quote_mail_send($id);
    } catch (Throwable $e) {
        app_log('error', 'Slanje upita ' . $ref . ': ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
        try {
            db_run('UPDATE `inquiries` SET `mail_status` = \'failed\', `mail_error` = ? WHERE `id` = ?', [mb_substr('Greška pri slanju: ' . $e->getMessage(), 0, 250), $id]);
        } catch (Throwable) {
        }
        return ['status' => 'failed', 'error' => null];
    }
}

/** Odgovor posle pokušaja slanja: uspeh samo kad je transport prihvatio poruku (sada ili ranije). */
function inquiry_quote_reply(string $ref, array $r): never
{
    if ($r['status'] === 'sent' || $r['status'] === 'already') {
        inquiry_json(200, ['ok' => true, 'ref' => $ref, 'next' => 'done']);
    }
    inquiry_json(200, ['ok' => false, 'ref' => $ref, 'next' => 'retry', 'error' => $r['status'] === 'busy' ? 'busy' : 'mail']);
}

/** Već zabeležen upit sa istim ključem: obična forma → mailto; kalkulator → (ponovo) pokušaj slanja ako još nije poslat. */
function inquiry_existing_reply(array $old): never
{
    if ($old['flow'] !== 'quote' || $old['mail_status'] === null) {
        inquiry_json(200, ['ok' => true, 'ref' => $old['ref_code'], 'next' => 'mailto']);
    }
    inquiry_quote_reply((string) $old['ref_code'], inquiry_try_send((int) $old['id'], (string) $old['ref_code']));
}
