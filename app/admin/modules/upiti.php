<?php
/* TRICOM — modul „Upiti“ (admin/index.php?m=upiti): upiti sa kontakt forme
   (zabeleženi preko /upit.php) sa internim obračunom.
   Akcije (a=): lista (podrazumevano, ?p= strana), view&id=, requote (POST),
   send (POST: PDF specifikacija prodaji, ponovo), pdf&id= (preuzimanje PDF-a).
   Obračun sačuvan pri prijemu se nikad ne menja; „novi obračun“ dodaje novi
   zapis po važećem cenovniku, a raniji ostaju vidljivi ispod. Upiti se ovde ne brišu. */
defined('TRICOM') || exit;

require_once APP_DIR . '/lib/quote.php';
require_once APP_DIR . '/lib/quote-mail.php';

/* slanje PDF specifikacije prodaji (krug 10, zakrpa 010) */
const MAIL_STATUS = [
    'sent' => ['PDF poslat prodaji', 'ok'],
    'pending' => ['PDF čeka slanje', 'warn'],
    'sending' => ['PDF se šalje', 'warn'],
    'failed' => ['PDF nije poslat', 'err'],
];

function q_mail_badge(?string $flow, ?string $status): string
{
    if ($flow !== 'quote') {
        return '<span class="adm-muted">e-pošta kupca</span>';
    }
    [$label, $kind] = MAIL_STATUS[(string) $status] ?? ['Slanje sa sajta nije bilo podešeno', 'warn'];
    return '<span class="adm-badge adm-badge--' . $kind . '">' . e($label) . '</span>';
}

const INQUIRIES_PER_PAGE = 50;
const QUOTE_STATUS = [
    'complete' => ['Potpun obračun', 'ok'],
    'incomplete' => ['Nepotpun — nedostaju podaci', 'warn'],
    'invalid' => ['Neispravna stavka', 'err'],
    'none' => ['Bez stavki kalkulatora TR', ''],
    'unpriced' => ['Nije u cenovniku — obračun ručno', 'warn'],
];

$action = is_string($_GET['a'] ?? null) ? $_GET['a'] : '';
$self = static fn(array $q = []): string => admin_url('', ['m' => 'upiti'] + $q);

if (!pricing_ready()) {
    admin_render('inquiries-list', ['ready' => false], 'Upiti', 'upiti');
}

/* ---------------------------------------------------------------- prikaz iznosa i mera */

/** Iznos „1.234,56 RSD“ (vrednost iz snimka, 2 decimale). */
function q_money(?string $v, ?string $cur): string
{
    return $v === null ? '—' : dec_fmt((string) dec_parse($v, 2), 2, 2) . ' ' . (string) $cur;
}

/** Stopa iz snimka (do 4 decimale, bez suvišnih nula, najmanje 2). */
function q_rate(string $v): string
{
    $s = dec_fmt((string) dec_parse($v, 4), 4, 4, true);
    if (!str_contains($s, ',')) {
        return $s . ',00';
    }
    return strlen(substr($s, strpos($s, ',') + 1)) < 2 ? $s . '0' : $s;
}

/** Decimalni broj iz snimka sa $scale decimala → prikaz bez suvišnih nula. */
function q_exact(string $v, int $scale): string
{
    return dec_fmt((string) dec_parse($v, $scale), $scale, $scale, true);
}

function q_badge(string $status): string
{
    [$label, $kind] = QUOTE_STATUS[$status] ?? ['Obračun nije sačuvan', 'err'];
    return '<span class="adm-badge' . ($kind !== '' ? ' adm-badge--' . $kind : '') . '">' . e($label) . '</span>';
}

/** Veza na kalkulator sa stavkom (isti heš kao u upitu). */
function q_calc_link(string $ref): string
{
    $hash = ltrim(substr($ref, 5), '#');
    return '<a href="' . e(url('kalkulatori.html') . '#' . $hash) . '" target="_blank" rel="noopener">otvori u kalkulatoru ↗</a>';
}

/** HTML jednog sačuvanog obračuna (snimak iz inquiry_quotes). */
function q_snapshot_html(array $snap): string
{
    $cur = $snap['price_list']['currency'] ?? null;
    $vat = QUOTE_VAT[(string) ($snap['price_list']['vat'] ?? '')] ?? null;
    $curL = isset(QUOTE_CURRENCIES[(string) $cur]) ? (string) $cur : null;
    $h = '';
    foreach ($snap['items'] ?? [] as $i => $it) {
        $h .= '<section class="adm-quote__item"><h3 class="adm-quote__h">Stavka ' . ($i + 1) . ' — ' . e($it['name'] ?? '') . ' ' . q_badge((string) $it['status']) . '</h3>';
        if (($it['kind'] ?? '') !== 'trapez') {
            $h .= '<p class="adm-muted">' . e($it['ref'] ?? '') . (str_starts_with((string) ($it['ref'] ?? ''), 'calc:') ? ' · ' . q_calc_link($it['ref']) : '') . '</p>';
            $h .= '<ul class="adm-missing">' . implode('', array_map(static fn($m) => '<li>' . e($m) . '</li>', $it['missing'] ?? [])) . '</ul></section>';
            continue;
        }
        $opts = ['RAL ' . $it['colour'], quote_t_label((string) $it['t']) . ' mm', $it['side'] === 'fasada' ? 'fasada (lice dole)' : 'krov (lice gore)', $it['felt'] ? 'sa filcom' : 'bez filca'];
        if (!empty($it['reinforced'])) {
            $opts[] = 'ojačan';
        }
        if ($it['mode'] === 'w' && $it['W'] !== null) {
            $opts[] = 'iz širine krova ' . number_format((float) $it['W'], 0, ',', '.') . ' mm';
        }
        $h .= '<p>' . e(implode(' · ', $opts)) . ' · ' . q_calc_link((string) $it['ref']) . '</p>';
        if ($it['errors']) {
            $h .= '<p class="adm-note">Stavka nije obračunata — neispravan unos:</p><ul class="adm-missing">'
                . implode('', array_map(static fn($m) => '<li>' . e($m) . '</li>', $it['errors'])) . '</ul></section>';
            continue;
        }
        /* razbijanje po dužinama */
        $h .= '<div class="adm-table-wrap"><table class="adm-table adm-quote__t"><caption>Dužine u stavci (pokrivna širina ' . e(number_format((int) $it['width_mm'], 0, ',', '.')) . ' mm)</caption>'
            . '<thead><tr><th scope="col">#</th><th scope="col" class="adm-num">Dužina table</th><th scope="col" class="adm-num">Kom</th><th scope="col" class="adm-num">Dužni m</th><th scope="col" class="adm-num">m² (pokrivna)</th></tr></thead><tbody>';
        foreach ($it['rows'] as $k => $r) {
            $h .= '<tr><th scope="row">' . ($k + 1) . '</th><td class="adm-num">' . e(number_format($r['L'], 0, ',', '.')) . ' mm <span class="adm-muted">= ' . e(quote_m($r['L'])) . ' m</span></td>'
                . '<td class="adm-num">' . e(number_format($r['n'], 0, ',', '.')) . '</td><td class="adm-num">' . e(quote_m($r['linear_mm'])) . '</td><td class="adm-num">' . e(quote_m2($r['area_mm2'])) . '</td></tr>';
        }
        $h .= '</tbody><tfoot><tr><th scope="row" colspan="2">Ukupno</th><td class="adm-num">' . e(number_format((int) $it['n_total'], 0, ',', '.')) . '</td><td class="adm-num">' . e(quote_m($it['linear_mm']))
            . '</td><td class="adm-num">' . e(quote_m2($it['area_mm2'])) . '</td></tr></tfoot></table></div>';

        /* obračun */
        $lines = [];
        $lines[] = ['Ukupno dužnih metara', e(quote_m($it['linear_mm'])) . ' m'];
        $lines[] = ['Obračunska površina', e(quote_m2($it['area_mm2'], 6)) . ' m² <span class="adm-muted">(dužni m × ' . e(dec_fmt((string) $it['width_mm'], 3, 3)) . ' m pokrivne širine; prikaz ' . e(quote_m2($it['area_mm2'])) . ' m²)</span>'];
        if ($it['sheet']) {
            $lines[] = ['Lim', e(q_exact($it['sheet']['basis_m2'], 6)) . ' m² × ' . e(q_rate($it['sheet']['rate'])) . ' ' . e($curL ?? '(valuta?)') . '/m² = <strong>'
                . ($it['sheet']['subtotal'] !== null ? e(q_money($it['sheet']['subtotal'], $curL)) : 'nije izračunato') . '</strong>'];
        } else {
            $lines[] = ['Lim', '<span class="adm-note">nema cene — v. ispod</span>'];
        }
        if ($it['felt']) {
            $fp = $it['felt_price'];
            if ($fp && $fp['unit'] === 'm2') {
                $lines[] = ['Filc (po m²)', e(quote_m($it['linear_mm'])) . ' m × ' . e(q_exact($fp['width_mm'], 1)) . ' mm širine filca = ' . e(q_exact($fp['basis_m2'], 7)) . ' m² × '
                    . e(q_rate($fp['rate'])) . ' ' . e($curL ?? '(valuta?)') . '/m² = <strong>' . ($fp['subtotal'] !== null ? e(q_money($fp['subtotal'], $curL)) : 'nije izračunato') . '</strong>'];
            } elseif ($fp) {
                $lines[] = ['Filc (po dužnom m)', e(quote_m($it['linear_mm'])) . ' m × ' . e(q_rate($fp['rate'])) . ' ' . e($curL ?? '(valuta?)') . '/m = <strong>'
                    . ($fp['subtotal'] !== null ? e(q_money($fp['subtotal'], $curL)) : 'nije izračunato') . '</strong>'];
            } else {
                $lines[] = ['Filc', '<span class="adm-note">nema cene — v. ispod</span>'];
            }
        } else {
            $lines[] = ['Filc', '<span class="adm-muted">nije u stavci</span>'];
        }
        $lines[] = ['Ukupno stavka', $it['total'] !== null ? '<strong>' . e(q_money($it['total'], $curL)) . '</strong>' . ($vat ? ' <span class="adm-muted">' . e($vat) . '</span>' : '') : '<span class="adm-note">nema konačnog iznosa</span>'];
        $h .= '<dl class="adm-quote__dl">';
        foreach ($lines as [$dt, $dd]) {
            $h .= '<div><dt>' . e($dt) . '</dt><dd>' . $dd . '</dd></div>';
        }
        $h .= '</dl>';
        if ($it['missing']) {
            $h .= '<p class="adm-note">Nedostaje za konačan iznos:</p><ul class="adm-missing">' . implode('', array_map(static fn($m) => '<li>' . e($m) . '</li>', $it['missing'])) . '</ul>';
        }
        $h .= '</section>';
    }
    return $h;
}

/* ---------------------------------------------------------------- POST: novi obračun */
if ($action === 'requote' && is_post()) {
    csrf_require();
    $id = input_int($_POST, 'id');
    $inq = $id ? db_one('SELECT * FROM `inquiries` WHERE `id` = ?', [$id]) : null;
    if (!$inq) {
        throw new HttpException(404, 'Upit ne postoji.');
    }
    quote_save((int) $inq['id'], quote_build((string) $inq['config_refs'], pricelist_load(), (string) admin_user()['username']));
    flash('success', 'Napravljen je novi obračun po važećem cenovniku. Raniji obračuni su sačuvani ispod.');
    redirect($self(['a' => 'view', 'id' => (int) $inq['id']]));
}

/* ---------------------------------------------------------------- POST: slanje PDF-a prodaji (ponovo) */
if ($action === 'send' && is_post()) {
    csrf_require();
    $id = input_int($_POST, 'id');
    $inq = $id && quote_flow_ready() ? db_one('SELECT * FROM `inquiries` WHERE `id` = ?', [$id]) : null;
    if (!$inq || !qp_has_calc_items((string) $inq['config_refs'])) {
        throw new HttpException(404, 'Upit ne postoji ili nema stavki kalkulatora.');
    }
    if ($inq['flow'] !== 'quote') {
        db_run('UPDATE `inquiries` SET `flow` = \'quote\' WHERE `id` = ?', [$id]);
    }
    $r = quote_mail_send((int) $id);
    match ($r['status']) {
        'sent' => flash('success', 'Specifikacija (PDF) je poslata na ' . quote_recipient() . '; transport je prihvatio poruku.'),
        'already' => flash('success', 'Specifikacija je već poslata ranije — nije poslata ponovo.'),
        'busy' => flash('error', 'Slanje ovog upita je upravo u toku. Osvežite stranu za minut.'),
        default => flash('error', 'Specifikacija nije poslata: ' . (string) $r['error']),
    };
    redirect($self(['a' => 'view', 'id' => (int) $id]));
}

/* ---------------------------------------------------------------- PDF specifikacija (preuzimanje, samo prijavljeni) */
if ($action === 'pdf') {
    $inq = db_one('SELECT * FROM `inquiries` WHERE `id` = ?', [input_int($_GET, 'id') ?? 0]);
    if (!$inq || !qp_has_calc_items((string) $inq['config_refs'])) {
        throw new HttpException(404, 'Upit ne postoji ili nema stavki kalkulatora.');
    }
    if (!quote_pdf_available()) {
        throw new HttpException(503, 'Biblioteka za PDF nije na serveru — otpremite fasciklu app/vendor/.');
    }
    $data = quote_flow_ready() ? quote_pdf_get($inq) : quote_pdf_build($inq);
    header('Content-Type: application/pdf');
    header('Content-Disposition: inline; filename="' . quote_pdf_name($inq) . '"');
    header('Content-Length: ' . strlen($data));
    header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src data:; frame-ancestors 'none'");
    echo $data;
    exit;
}

/* ---------------------------------------------------------------- jedan upit */
if ($action === 'view') {
    $inq = db_one('SELECT * FROM `inquiries` WHERE `id` = ?', [input_int($_GET, 'id') ?? 0]);
    if (!$inq) {
        throw new HttpException(404, 'Upit ne postoji.');
    }
    $quotes = [];
    foreach (db_all('SELECT * FROM `inquiry_quotes` WHERE `inquiry_id` = ? ORDER BY `id` DESC', [(int) $inq['id']]) as $q) {
        $q['snap'] = json_decode((string) $q['snapshot'], true) ?: ['items' => [], 'missing' => ['Zapis obračuna nije čitljiv.'], 'status' => $q['status']];
        $quotes[] = $q;
    }
    $mail = ['ready' => quote_flow_ready(), 'calc' => qp_has_calc_items((string) $inq['config_refs']), 'problem' => quote_mail_problem(),
             'pdf' => quote_pdf_available(), 'to' => quote_recipient()];
    admin_render('inquiry-view', ['inq' => $inq, 'quotes' => $quotes, 'mail' => $mail], 'Upit ' . $inq['ref_code'], 'upiti');
}

/* ---------------------------------------------------------------- lista */
$page = max(1, input_int($_GET, 'p') ?? 1);
$total = (int) db_value('SELECT COUNT(*) FROM `inquiries`');
$rows = db_all(
    'SELECT i.`id`, i.`ref_code`, i.`lang`, i.`name`, i.`email`, i.`phone`, i.`topic`, i.`created_at`, (i.`config_refs` IS NOT NULL) AS has_items,
            q.`status` AS q_status, q.`grand_total` AS q_total, q.`currency` AS q_currency' . (quote_flow_ready() ? ', i.`flow`, i.`mail_status`' : ', NULL AS flow, NULL AS mail_status') . '
       FROM `inquiries` i
       LEFT JOIN `inquiry_quotes` q ON q.`id` = (SELECT MAX(`id`) FROM `inquiry_quotes` WHERE `inquiry_id` = i.`id`)
      ORDER BY i.`id` DESC LIMIT ' . INQUIRIES_PER_PAGE . ' OFFSET ' . (($page - 1) * INQUIRIES_PER_PAGE)
);
admin_render('inquiries-list', ['ready' => true, 'rows' => $rows, 'page' => $page, 'pages' => max(1, (int) ceil($total / INQUIRIES_PER_PAGE)), 'total' => $total], 'Upiti', 'upiti');
