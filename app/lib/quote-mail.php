<?php
/* TRICOM — upit iz kalkulatora: PDF specifikacija + e-poruka prodaji (krug 10).

   Tok: /upit.php zabeleži upit (inquiries, zakrpe 009 + 010) i obračun (inquiry_quotes),
   zatim quote_mail_send(): PDF (app/storage/quotes/<broj>.pdf, van weba) → e-poruka na
   adresu iz administracije (Kontakt → e-pošta, ista na koju je forma i ranije pisala), sa
   PDF-om u prilogu i internim obračunom u tekstu poruke. Kupcu se uspeh javlja tek kad
   transport prihvati poruku sa prilogom.

   Bez gubitka i bez duplikata:
   - upit se upisuje PRE pravljenja PDF-a i slanja; neuspeh ostavlja mail_status = 'failed'
     sa razlogom, a upit je u administraciji (Upiti → „Pošalji ponovo“);
   - ponovni pokušaj kupca nosi isti ključ slanja (submit_key) → isti upit, bez novog reda;
   - slanje se „zauzima“ jednim UPDATE-om (mail_status = 'sending'), pa dva istovremena
     pokušaja ne šalju dve poruke; već poslat upit se ne šalje ponovo sa sajta;
   - PDF se pravi jednom i čuva; ponovni pokušaj šalje isti fajl;
   - Message-ID je isti za sve pokušaje istog upita. */
defined('TRICOM') || exit;

require_once APP_DIR . '/lib/quote-pdf.php';
require_once APP_DIR . '/lib/mailer.php';

const QUOTE_PDF_DIR = APP_DIR . '/storage/quotes';
const QUOTE_MAIL_STALE = 300;            // s: „sending“ starije od ovoga smatra se prekinutim

/** Da li baza ima kolone za slanje (zakrpa 010). */
function quote_flow_ready(): bool
{
    static $ok = null;
    return $ok ??= pricing_ready() && db_column_exists('inquiries', 'submit_key') && db_column_exists('inquiries', 'mail_status')
        && db_column_exists('inquiries', 'pdf_file') && db_column_exists('inquiries', 'flow');
}

/** Adresa prodaje: e-pošta iz administracije (Kontakt → e-pošta; forma upita i ranije piše na nju). */
function quote_recipient(): string
{
    $v = (string) db_value('SELECT `footer_email` FROM `contact_settings` ORDER BY `id` LIMIT 1');
    return filter_var($v, FILTER_VALIDATE_EMAIL) ? $v : '';
}

/** Zašto server ne može da pošalje specifikaciju (ili null kad može). */
function quote_mail_problem(): ?string
{
    if (!quote_pdf_available()) {
        return 'Nedostaje biblioteka za PDF (app/vendor/tfpdf sa fontovima) — otpremite fasciklu app/vendor/.';
    }
    if ($p = mailer_problem()) {
        return $p;
    }
    if (quote_recipient() === '') {
        return 'U administraciji (Kontakt → e-pošta) nije upisana ispravna adresa na koju stižu upiti.';
    }
    if (!is_dir(QUOTE_PDF_DIR) && !@mkdir(QUOTE_PDF_DIR, 0755, true)) {
        return 'Fascikla app/storage/quotes/ ne postoji i ne može da se napravi.';
    }
    if (!is_writable(QUOTE_PDF_DIR)) {
        return 'U fasciklu app/storage/quotes/ ne može da se upisuje (dozvole 755 ili 775).';
    }
    return null;
}

/** Ime PDF-a u prilogu i u app/storage/quotes/. */
function quote_pdf_name(array $inq): string
{
    return 'TRICOM-specifikacija-' . preg_replace('/[^A-Z0-9-]/', '', (string) $inq['ref_code']) . '.pdf';
}

/** PDF upita: sačuvani fajl ako postoji, inače nov (čuva se van weba). */
function quote_pdf_get(array $inq): string
{
    $name = quote_pdf_name($inq);
    $path = QUOTE_PDF_DIR . '/' . $name;
    if ((string) ($inq['pdf_file'] ?? '') === $name && is_file($path)) {
        $data = (string) file_get_contents($path);
        if (str_starts_with($data, '%PDF-')) {
            return $data;
        }
    }
    $data = quote_pdf_build($inq);
    if (!str_starts_with($data, '%PDF-')) {
        throw new RuntimeException('PDF nije napravljen.');
    }
    if (is_dir(QUOTE_PDF_DIR) && is_writable(QUOTE_PDF_DIR)) {
        $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
        if (file_put_contents($tmp, $data, LOCK_EX) === strlen($data) && @rename($tmp, $path)) {
            db_run('UPDATE `inquiries` SET `pdf_file` = ? WHERE `id` = ?', [$name, (int) $inq['id']]);
        } else {
            @unlink($tmp);
        }
    }
    return $data;
}

/** Najnoviji sačuvani obračun upita (snimak) ili null. */
function quote_latest_snapshot(int $inquiryId): ?array
{
    $s = db_value('SELECT `snapshot` FROM `inquiry_quotes` WHERE `inquiry_id` = ? ORDER BY `id` DESC LIMIT 1', [$inquiryId]);
    $d = is_string($s) ? json_decode($s, true) : null;
    return is_array($d) ? $d : null;
}

/* ---------------------------------------------------------------- tekst e-poruke prodaji (srpski) */

function qm_money(?string $v, ?string $cur): string
{
    return $v === null ? '—' : dec_fmt((string) dec_parse($v, 2), 2, 2) . ' ' . (string) $cur;
}

function qm_rate(string $v): string
{
    $s = dec_fmt((string) dec_parse($v, 4), 4, 4, true);
    return str_contains($s, ',') ? (strlen(substr($s, strpos($s, ',') + 1)) < 2 ? $s . '0' : $s) : $s . ',00';
}

/** Interni obračun iz snimka (isti podaci kao u administraciji → Upiti). */
function quote_snapshot_text(?array $snap): string
{
    if (!$snap) {
        return "INTERNI OBRAČUN\nObračun nije sačuvan (greška je u dnevniku sajta) — napravite ga u administraciji (Upiti → Novi obračun).\n";
    }
    $pl = $snap['price_list'] ?? [];
    $cur = isset(QUOTE_CURRENCIES[(string) ($pl['currency'] ?? '')]) ? (string) $pl['currency'] : null;
    $vat = QUOTE_VAT[(string) ($pl['vat'] ?? '')] ?? null;
    $o = ["INTERNI OBRAČUN — samo za TRICOM, ne prosleđivati kupcu",
          'Cenovnik: valuta ' . ($cur ?? 'NIJE IZABRANA') . ' · cene ' . ($vat ?? 'BEZ NAZNAKE PDV-a')
          . (!empty($pl['updated_at']) ? ' · izmenjen ' . date('d.m.Y. H:i', (int) strtotime((string) $pl['updated_at'])) : ' · cenovnik još nije unet'), ''];
    foreach ($snap['items'] ?? [] as $i => $it) {
        $o[] = 'Stavka ' . ($i + 1) . ' — ' . ($it['name'] ?? '');
        if (($it['kind'] ?? '') !== 'trapez') {
            foreach ($it['missing'] ?? [] as $m) {
                $o[] = '  ' . $m;
            }
            $o[] = '';
            continue;
        }
        if (!empty($it['errors'])) {
            $o[] = '  Nije obračunato — neispravan unos:';
            foreach ($it['errors'] as $m) {
                $o[] = '  - ' . $m;
            }
            $o[] = '';
            continue;
        }
        foreach ($it['rows'] as $k => $r) {
            $o[] = sprintf('  %d) %s mm × %s kom = %s m dužnih · %s m²', $k + 1, number_format($r['L'], 0, ',', '.'), number_format($r['n'], 0, ',', '.'), quote_m($r['linear_mm']), quote_m2($r['area_mm2']));
        }
        $o[] = '  Ukupno: ' . number_format((int) $it['n_total'], 0, ',', '.') . ' kom · ' . quote_m($it['linear_mm']) . ' m dužnih';
        $o[] = '  Obračunska površina: ' . dec_fmt((string) $it['area_mm2'], 6, 6, true) . ' m² (pokrivna širina ' . dec_fmt((string) $it['width_mm'], 3, 3) . ' m)';
        $o[] = $it['sheet']
            ? '  Lim: ' . dec_fmt((string) dec_parse($it['sheet']['basis_m2'], 6), 6, 6, true) . ' m² × ' . qm_rate($it['sheet']['rate']) . ' ' . ($cur ?? '?') . '/m² = ' . ($it['sheet']['subtotal'] !== null ? qm_money($it['sheet']['subtotal'], $cur) : 'nije izračunato')
            : '  Lim: nema cene';
        if ($it['felt']) {
            $fp = $it['felt_price'] ?? null;
            if ($fp && $fp['unit'] === 'm2') {
                $o[] = '  Filc (po m²): ' . quote_m($it['linear_mm']) . ' m × ' . dec_fmt((string) dec_parse($fp['width_mm'], 1), 1, 1, true) . ' mm širine filca = '
                    . dec_fmt((string) dec_parse($fp['basis_m2'], 7), 7, 7, true) . ' m² × ' . qm_rate($fp['rate']) . ' ' . ($cur ?? '?') . '/m² = ' . ($fp['subtotal'] !== null ? qm_money($fp['subtotal'], $cur) : 'nije izračunato');
            } elseif ($fp) {
                $o[] = '  Filc (po dužnom m): ' . quote_m($it['linear_mm']) . ' m × ' . qm_rate($fp['rate']) . ' ' . ($cur ?? '?') . '/m = ' . ($fp['subtotal'] !== null ? qm_money($fp['subtotal'], $cur) : 'nije izračunato');
            } else {
                $o[] = '  Filc: nema cene';
            }
        } else {
            $o[] = '  Filc: nije u stavci';
        }
        $o[] = '  Ukupno stavka: ' . ($it['total'] !== null ? qm_money($it['total'], $cur) . ($vat ? ' ' . $vat : '') : 'NEMA KONAČNOG IZNOSA');
        $o[] = '';
    }
    if (($snap['grand_total'] ?? null) !== null) {
        $o[] = 'UKUPNO UPIT: ' . qm_money($snap['grand_total'], $cur) . ($vat ? ' ' . $vat : '');
    } elseif (($snap['status'] ?? '') === 'none') {
        $o[] = 'Nema stavki trapeznog lima — iznos se ne računa automatski.';
    } else {
        $o[] = 'UKUPAN IZNOS NIJE IZRAČUNAT — nedostaju ulazni podaci za cenu:';
        foreach ($snap['missing'] ?? [] as $m) {
            $o[] = '  - ' . $m;
        }
    }
    foreach ($snap['notes'] ?? [] as $n) {
        $o[] = $n;
    }
    return implode("\n", $o) . "\n";
}

/** Ceo tekst e-poruke prodaji. */
function quote_staff_text(array $inq, ?array $snap): string
{
    $items = qp_items((string) $inq['config_refs'], 'sr');
    $o = ['Upit sa kalkulatora ' . $inq['ref_code'], 'Primljen: ' . date('d.m.Y. H:i', (int) strtotime((string) $inq['created_at'])) . ' · strana ' . ($inq['lang'] === 'en' ? 'na engleskom (PDF je na engleskom)' : 'na srpskom'), '',
          'KUPAC', 'Ime i firma: ' . $inq['name'], 'E-pošta: ' . $inq['email'], 'Telefon: ' . ($inq['phone'] !== '' ? $inq['phone'] : '—'), 'Tema: ' . ($inq['topic'] !== '' ? $inq['topic'] : '—'),
          '(Odgovor na ovu poruku ide kupcu.)', '',
          'STAVKE — specifikacija u prilogu (PDF), ista kao štampa kalkulatora koju vidi kupac'];
    foreach ($items as $i => $it) {
        $o[] = ($i + 1) . '. ' . $it['code'] . ($it['line'] !== '' ? ' — ' . $it['line'] : '');
    }
    $o[] = '';
    $o[] = quote_snapshot_text($snap);
    $o[] = 'PORUKA KUPCA';
    $o[] = (string) $inq['message'];
    if ((string) ($inq['production_note'] ?? '') !== '') {
        $o[] = '';
        $o[] = 'NAPOMENA ZA PROIZVODNJU';
        $o[] = (string) $inq['production_note'];
    }
    $o[] = '';
    $o[] = 'Upit u administraciji: ' . rtrim((string) config('app.base_url'), '/') . admin_url('', ['m' => 'upiti', 'a' => 'view', 'id' => (int) $inq['id']]);
    return implode("\n", $o) . "\n";
}

/* ---------------------------------------------------------------- slanje */

function quote_mail_fail(int $id, string $ref, string $why): array
{
    db_run('UPDATE `inquiries` SET `mail_status` = \'failed\', `mail_error` = ? WHERE `id` = ?', [mb_substr($why, 0, 250), $id]);
    app_log('warning', 'Specifikacija upita ' . $ref . ' nije poslata: ' . $why);
    return ['status' => 'failed', 'error' => $why];
}

/**
 * Pravi (ili uzima sačuvan) PDF i šalje ga prodaji. Vraća status:
 *   sent = transport je prihvatio poruku sa prilogom; already = već poslato ranije (ne šalje ponovo);
 *   busy = drugi pokušaj je u toku; failed = nije poslato (error = razlog; upit ostaje sačuvan).
 */
function quote_mail_send(int $id): array
{
    $now = date('Y-m-d H:i:s');
    $claimed = db_run(
        'UPDATE `inquiries` SET `mail_status` = \'sending\', `mail_claimed_at` = ?, `mail_attempts` = `mail_attempts` + 1
          WHERE `id` = ? AND (`mail_status` IS NULL OR `mail_status` IN (\'pending\', \'failed\') OR (`mail_status` = \'sending\' AND `mail_claimed_at` < ?))',
        [$now, $id, date('Y-m-d H:i:s', time() - QUOTE_MAIL_STALE)]
    )->rowCount();
    $inq = db_one('SELECT * FROM `inquiries` WHERE `id` = ?', [$id]);
    if (!$inq) {
        return ['status' => 'failed', 'error' => 'Upit ne postoji.'];
    }
    if ($claimed !== 1) {
        return ['status' => $inq['mail_status'] === 'sent' ? 'already' : 'busy', 'error' => null];
    }
    if ($p = quote_mail_problem()) {
        return quote_mail_fail($id, $inq['ref_code'], $p);
    }
    $to = quote_recipient();
    $snap = quote_latest_snapshot($id);
    if ($snap === null && pricing_ready()) {
        try {
            quote_save($id, quote_build((string) $inq['config_refs'], pricelist_load(), 'sajt'));
            $snap = quote_latest_snapshot($id);
        } catch (Throwable $e) {
            app_log('error', 'Obračun upita ' . $inq['ref_code'] . ' nije sačuvan: ' . $e->getMessage());
        }
    }
    try {
        $pdf = quote_pdf_get($inq);
    } catch (Throwable $e) {
        app_log('error', 'PDF upita ' . $inq['ref_code'] . ': ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
        return quote_mail_fail($id, $inq['ref_code'], 'PDF nije napravljen (' . mb_substr($e->getMessage(), 0, 150) . ').');
    }
    $host = (string) parse_url((string) config('app.base_url'), PHP_URL_HOST) ?: 'tricom.rs';
    $err = mailer_send([
        'to' => $to,
        'reply_to' => [$inq['email'], $inq['name']],
        'subject' => 'Upit sa kalkulatora ' . $inq['ref_code'] . ' — ' . mb_substr((string) $inq['name'], 0, 80),
        'text' => quote_staff_text($inq, $snap),
        'attachments' => [[$pdf, quote_pdf_name($inq), 'application/pdf']],
        'message_id' => '<' . strtolower((string) $inq['ref_code']) . '.upit@' . $host . '>',
    ]);
    if ($err !== null) {
        return quote_mail_fail($id, $inq['ref_code'], 'E-pošta nije prihvaćena: ' . $err);
    }
    db_run('UPDATE `inquiries` SET `mail_status` = \'sent\', `mail_sent_at` = ?, `mail_to` = ?, `mail_error` = NULL WHERE `id` = ?', [date('Y-m-d H:i:s'), $to, $id]);
    return ['status' => 'sent', 'error' => null];
}
