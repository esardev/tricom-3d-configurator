<?php
/* TRICOM — interni obračun upita (cenovnik trapeznih limova).

   Server sam ponovo računa svaku stavku kalkulatora iz reference „calc:<heš>“
   (skriveno polje „konfiguracija“ kontakt forme) — iznosi i zbirovi iz teksta
   poruke se ne čitaju. Pravila su ista kao u js/calc.js (trapez(), parse()):
     dužni metri reda = L (mm) / 1000 × n;  površina reda = dužni m × pokrivna širina (m);
     stavka = zbir redova; režim „znam širinu krova“ (w) samo uz jedan red.
   Sve mere su celi brojevi (mm, mm²), cene su tačni decimalni brojevi
   (app/lib/money.php); zaokružuje se samo iznos (pola naviše, 2 decimale),
   jednom po međuzbiru; ukupno = zbir zaokruženih međuzbira (kao na ekranu).

   Podaci o profilima su prepis iz js/catalog.js (calculators.profiles,
   profiles[].thicknesses, profileColours, calculators.maxRows / defaults) —
   pri izmeni tamo uskladiti i ovde. Cene NISU u kodu: dolaze iz cenovnika u
   administraciji (tabele price_*, zakrpa 009). Nepoznata vrednost nikad ne
   postaje nula: obračun tada nema konačan iznos i navodi šta nedostaje. */
defined('TRICOM') || exit;

require_once APP_DIR . '/lib/money.php';

const QUOTE_RULES_VERSION = 1;
const QUOTE_MAX_ROWS = 15;               // js/catalog.js → calculators.maxRows
const QUOTE_MAX_PIECES = 1000000;        // razumna granica po redu (kalkulator je nema; samo zaštita servera)
const QUOTE_MAX_REFS = 30;               // najviše stavki u jednom upitu
const QUOTE_DEFAULTS = ['L' => 4000, 'n' => 10, 'W' => 10000, 'colour' => '7016', 't' => '0.50'];

/** Trapezni profili kalkulatora. cover = pokrivna (obračunska) širina, mm — ista osnova kao površina u kalkulatoru. */
const QUOTE_PROFILES = [
    'tr10' => ['name' => 'TR 10/162', 'cover' => 975,  'min' => 500, 'max' => 13500, 'thicknesses' => ['0.50', '0.60'],
               'colours' => ['9006', '9002', '7016'], 'reinforced' => false,
               'cover_src' => 'crtež TR 10/162,5/975 (stari sajt)'],
    'tr20' => ['name' => 'TR 20/185', 'cover' => 1110, 'min' => 500, 'max' => 13500, 'thicknesses' => ['0.50', '0.60', '0.70'],
               'colours' => null, 'reinforced' => false,
               'cover_src' => 'crtež TR 20/185/1110 (stari sajt)'],
    'tr35' => ['name' => 'TR 35/270', 'cover' => 1080, 'min' => 500, 'max' => 13500, 'thicknesses' => ['0.50', '0.60', '0.70'],
               'colours' => null, 'reinforced' => false,
               'cover_src' => 'crtež TR-35, efektivna širina 1080 (stari sajt)'],
    'tr40' => ['name' => 'TR 40/230', 'cover' => 920,  'min' => 500, 'max' => 13500, 'thicknesses' => ['0.50', '0.60', '0.70', '0.80', '1.00'],
               'colours' => null, 'reinforced' => true,
               'cover_src' => 'Bendex i pismo klijenta (crtež sa starog sajta navodi 930 — otvoreno pitanje)'],
];

/** Imitacija crepa (js/catalog.js → calculators.crep): samo za specifikaciju (PDF), nije u cenovniku. */
const QUOTE_CREP = ['name' => 'Imitacija crepa', 'name_en' => 'Tile-effect roofing sheet', 'developedWidth' => 1250, 'start' => 30, 'tile' => 350,
                    'endMin' => 20, 'step' => 20, 'lengthMax' => 13500, 'defaultLength' => 5000, 'tolerance' => 20];
const QUOTE_DEVELOPED_WIDTH = 1250;      // razvijena širina trapez profila, mm (samo za procenu mase)
const QUOTE_STEEL_DENSITY = 7.85;        // kg/(m²·mm)

const QUOTE_CURRENCIES = ['RSD' => 'RSD (dinar)', 'EUR' => 'EUR (evro)'];
const QUOTE_VAT = ['bez_pdv' => 'bez PDV-a', 'sa_pdv' => 'sa PDV-om'];
const QUOTE_FELT_UNITS = ['m2' => 'po m² filca (dužni metri × širina filca)', 'm' => 'po dužnom metru table'];

/* ---------------------------------------------------------------- prikaz mera */

/** Debljina "0.50" → "0,5". */
function quote_t_label(string $t): string
{
    $s = dec_parse($t, 2);
    return is_string($s) ? dec_fmt($s, 2, 2, true) : $t;
}

/** mm (ceo broj) → metri sa 3 decimale („66,456“). */
function quote_m(int|string $mm): string
{
    return dec_fmt((string) $mm, 3, 3);
}

/** mm² → m² sa 2 decimale za prikaz (tačna vrednost ostaje u zapisu). */
function quote_m2(int|string $mm2, int $show = 2): string
{
    return dec_fmt((string) $mm2, 6, $show);
}

/* ---------------------------------------------------------------- čitanje reference */

/**
 * Jedan red skrivenog polja „konfiguracija“ → stavka.
 * calc:<heš> = kalkulator (kao TricomCalc.parse); ostalo = token 3D konfiguratora.
 */
function quote_parse_ref(string $line): array
{
    $line = trim($line);
    if (!str_starts_with($line, 'calc:')) {
        return ['kind' => 'konf', 'ref' => $line];
    }
    $hash = ltrim(substr($line, 5), '#');
    if (!preg_match('/^(tr10|tr20|tr35|tr40|crep)(?:=(.*))?$/s', $hash, $m)) {
        return ['kind' => 'unknown', 'ref' => $line];
    }
    $id = $m[1];
    $s = ['L' => $id === 'crep' ? QUOTE_CREP['defaultLength'] : QUOTE_DEFAULTS['L'], 'n' => QUOTE_DEFAULTS['n'], 'W' => QUOTE_DEFAULTS['W'], 'colour' => QUOTE_DEFAULTS['colour'],
          't' => QUOTE_DEFAULTS['t'], 'side' => 'krov', 'felt' => false, 'extra' => [], 'hasW' => false,
          'e' => QUOTE_CREP['endMin'], 'fixed' => false, 'legacy' => null];
    foreach (explode(',', $m[2] ?? '') as $tk) {
        /* kao decodeURIComponent: pokvaren %-zapis → token se preskače */
        if (preg_match('/%(?![0-9A-Fa-f]{2})/', $tk)) {
            continue;
        }
        $tk = trim(rawurldecode($tk));
        if ($tk === '' || !mb_check_encoding($tk, 'UTF-8')) {
            continue;
        }
        $k = $tk[0];
        $v = substr($tk, 1);
        if ($k === 's') {
            $s['side'] = ltrim($v, '=') === 'fasada' ? 'fasada' : 'krov';
            continue;
        }
        if ($k === 'c') {
            if (preg_match('/^\d{4}$/', $v)) {
                $s['colour'] = $v;
            }
            continue;
        }
        if ($k === 'r') {
            if ($id !== 'crep' && preg_match('/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/', $v, $rm)) {
                $s['extra'][] = ['L' => $rm[1] + 0, 'n' => $rm[2] + 0];
            }
            continue;
        }
        if (!preg_match('/^-?\d+(?:\.\d+)?$/', $v)) {
            continue;                       // kalkulator piše samo decimalne brojeve
        }
        $x = $v + 0;
        if ($k === 'L') {
            $s['L'] = $x;
        } elseif ($k === 'n') {
            $s['n'] = $x;
        } elseif ($k === 'w') {
            $s['W'] = $x;
            $s['hasW'] = true;
        } elseif ($k === 'f') {
            $s['felt'] = $x == 1;
        } elseif ($k === 't') {
            $s['t'] = $v;
        } elseif ($k === 'e' && $id === 'crep') {
            $s['e'] = $x;                   // zadati POČETAK kod oluka
            $s['fixed'] = true;
        } elseif ($k === 'p' && $id === 'crep') {
            $s['legacy'] = $x;              // stara veza: kraj koji se nekad unosio (samo se prijavljuje)
        }                                   // nepoznati tokeni se ne koriste
    }
    $mode = $s['hasW'] && !$s['extra'] ? 'w' : 'n';
    if ($s['felt'] && $s['side'] === 'fasada') {
        $s['side'] = 'krov';                // filc samo uz krovni profil (kao kalkulator)
    }
    if ($id === 'crep') {
        return ['kind' => 'crep', 'ref' => $line, 'id' => 'crep', 'L' => $s['L'], 'n' => $s['n'], 'e' => $s['e'], 'fixed' => $s['fixed'],
                'legacy' => $s['legacy'], 'colour' => $s['colour'], 't' => $s['t'], 'felt' => $s['felt']];
    }
    return ['kind' => 'trapez', 'ref' => $line, 'id' => $id, 'mode' => $mode,
            'rows' => array_merge([['L' => $s['L'], 'n' => $s['n']]], $s['extra']),
            'W' => $s['W'], 'colour' => $s['colour'], 't' => $s['t'], 'side' => $s['side'], 'felt' => $s['felt']];
}

function quote_is_int(int|float $x): bool
{
    return is_int($x) || (is_finite($x) && floor($x) === $x && abs($x) < 9.0e15);
}

/* ---------------------------------------------------------------- mere stavke */

/**
 * Mere jedne trapez stavke (bez cena): redovi, dužni metri, površina.
 * errors = neispravan unos (stavka se ne obračunava);
 * blockers = mere su izračunate, ali stavka nema konačnu cenu dok osoblje ne proveri (boja, debljina).
 */
function quote_measure(array $p): array
{
    $P = QUOTE_PROFILES[$p['id']];
    $errors = [];
    $blockers = [];
    $rows = $p['rows'];
    $mode = $p['mode'] === 'w' && count($rows) === 1 ? 'w' : 'n';
    $range = number_format($P['min'], 0, ',', '.') . '–' . number_format($P['max'], 0, ',', '.') . ' mm';

    if (count($rows) > QUOTE_MAX_ROWS) {
        $errors[] = 'Stavka ima ' . count($rows) . ' dužina — najviše je ' . QUOTE_MAX_ROWS . '.';
    }
    $clean = [];
    foreach ($rows as $i => $r) {
        $label = count($rows) > 1 ? 'Red ' . ($i + 1) . ': ' : '';
        $L = $r['L'];
        $n = $r['n'];
        if (!quote_is_int($L)) {
            $errors[] = $label . 'dužina table mora biti ceo broj milimetara.';
        } elseif ($L < $P['min'] || $L > $P['max']) {
            $errors[] = $label . 'dužina ' . number_format((float) $L, 0, ',', '.') . ' mm je van opsega ' . $range . '.';
        }
        if ($mode === 'n') {
            if (!quote_is_int($n)) {
                $errors[] = $label . 'broj tabli mora biti ceo broj.';
            } elseif ($n < 1) {
                $errors[] = $label . 'broj tabli mora biti najmanje 1.';
            } elseif ($n > QUOTE_MAX_PIECES) {
                $errors[] = $label . 'broj tabli je veći od ' . number_format(QUOTE_MAX_PIECES, 0, ',', '.') . ' — proveriti sa kupcem.';
            }
        }
        $clean[] = ['L' => quote_is_int($L) ? (int) $L : 0, 'n' => quote_is_int($n) ? (int) $n : 0];
    }
    $W = $p['W'];
    if ($mode === 'w') {
        if (!is_finite((float) $W) || $W < 1) {
            $errors[] = 'Širina krova mora biti najmanje 1 mm.';
        } elseif ($W / $P['cover'] > QUOTE_MAX_PIECES) {
            $errors[] = 'Širina krova je nerealno velika — proveriti sa kupcem.';
        }
    }

    /* debljina: kao u kalkulatoru (nepozitivna → podrazumevana), pa mora biti u ponudi profila */
    $tv = (string) $p['t'];
    if (!preg_match('/^\d+(?:\.\d+)?$/', $tv) || (float) $tv <= 0) {
        $tv = QUOTE_DEFAULTS['t'];
    }
    $t = dec_parse($tv, 2);
    $tStr = is_string($t) ? dec_str($t, 2) : $tv;      // više od 2 decimale: ostaje kako je (nije u ponudi)
    if (!in_array($tStr, $P['thicknesses'], true)) {
        $blockers[] = 'Debljina ' . (is_string($t) ? quote_t_label($tStr) : $tStr) . ' mm nije u ponudi za ' . $P['name']
            . ' (ponuda: ' . implode(', ', array_map('quote_t_label', $P['thicknesses'])) . ' mm).';
    }
    if ($P['colours'] !== null && !in_array($p['colour'], $P['colours'], true)) {
        $blockers[] = 'Boja RAL ' . $p['colour'] . ' nije u ponudi za ' . $P['name'] . ' (ponuda: RAL ' . implode(', ', $P['colours']) . ') — potvrditi boju sa kupcem.';
    }

    $item = ['kind' => 'trapez', 'ref' => $p['ref'], 'profile' => $p['id'], 'name' => $P['name'], 'reinforced' => $P['reinforced'],
             'colour' => $p['colour'], 't' => $tStr, 'side' => $p['side'], 'felt' => $p['felt'], 'mode' => $mode,
             'W' => $mode === 'w' && is_finite((float) $W) ? $W : null,
             'errors' => $errors, 'blockers' => $blockers,
             'rows' => [], 'n_total' => null, 'linear_mm' => null, 'width_mm' => $P['cover'], 'width_src' => $P['cover_src'], 'area_mm2' => null];
    if ($errors) {
        return $item;
    }
    if ($mode === 'w') {
        $clean[0]['n'] = max(1, (int) ceil($W / $P['cover'] - 1e-9));   // kao kalkulator: n × pokrivna širina ≥ širina krova
    }
    $sumN = 0;
    $sumLin = 0;
    $sumA = 0;
    foreach ($clean as $r) {
        $lin = $r['L'] * $r['n'];                       // mm
        $area = $lin * $P['cover'];                     // mm²
        $item['rows'][] = ['L' => $r['L'], 'n' => $r['n'], 'linear_mm' => $lin, 'area_mm2' => $area];
        $sumN += $r['n'];
        $sumLin += $lin;
        $sumA += $area;
    }
    $item['n_total'] = $sumN;
    $item['linear_mm'] = $sumLin;
    $item['area_mm2'] = $sumA;
    return $item;
}

/* ---------------------------------------------------------------- cenovnik */

/** Da li postoje tabele cenovnika i upita (zakrpa 009). */
function pricing_ready(): bool
{
    static $ok = null;
    return $ok ??= db_table_exists('price_settings') && db_table_exists('price_sheet_rates') && db_table_exists('price_felt_rates')
        && db_table_exists('inquiries') && db_table_exists('inquiry_quotes');
}

/** Važeći cenovnik iz baze (vrednosti tačno kako su sačuvane; NULL = nije uneto). */
function pricelist_load(): array
{
    $s = db_one('SELECT * FROM `price_settings` WHERE `id` = 1') ?? [];
    $pl = ['currency' => $s['currency'] ?? null, 'vat' => $s['vat_basis'] ?? null, 'updated_at' => $s['updated_at'] ?? null,
           'updated_by' => $s['updated_by'] ?? null, 'sheet' => [], 'felt' => []];
    foreach (db_all('SELECT * FROM `price_sheet_rates`') as $r) {
        $pl['sheet'][$r['profile_key'] . '|' . dec_str((string) dec_parse((string) $r['thickness_mm'], 2), 2)] = $r;
    }
    foreach (db_all('SELECT * FROM `price_felt_rates`') as $r) {
        $pl['felt'][$r['profile_key']] = $r;
    }
    return $pl;
}

/**
 * Šta u cenovniku još nije uneto: 'required' (potrebno za svaki obračun lima),
 * 'felt' (potrebno samo za stavke sa filcom).
 */
function pricelist_gaps(array $pl): array
{
    $req = [];
    $felt = [];
    if (!isset(QUOTE_CURRENCIES[(string) $pl['currency']])) {
        $req[] = 'Valuta cenovnika (RSD ili EUR).';
    }
    if (!isset(QUOTE_VAT[(string) $pl['vat']])) {
        $req[] = 'Da li su cene bez PDV-a ili sa PDV-om.';
    }
    foreach (QUOTE_PROFILES as $key => $P) {
        foreach ($P['thicknesses'] as $t) {
            if (pricelist_rate($pl['sheet'][$key . '|' . $t]['rate_per_m2'] ?? null) === null) {
                $req[] = 'Cena lima po m² — ' . $P['name'] . ', ' . quote_t_label($t) . ' mm.';
            }
        }
        $f = $pl['felt'][$key] ?? [];
        if (pricelist_rate($f['rate'] ?? null) === null) {
            $felt[] = 'Cena filca — ' . $P['name'] . '.';
        }
        if (!isset(QUOTE_FELT_UNITS[(string) ($f['unit'] ?? '')])) {
            $felt[] = 'Jedinica cene filca (po m² ili po dužnom metru) — ' . $P['name'] . '.';
        } elseif ($f['unit'] === 'm2' && !is_string(dec_parse((string) ($f['width_mm'] ?? ''), 1))) {
            $felt[] = 'Širina filca u mm (cena je po m²) — ' . $P['name'] . '.';
        }
    }
    return ['required' => $req, 'felt' => $felt];
}

/** Stopa iz baze → skalirani ceo broj (4 decimale) ili null. */
function pricelist_rate(mixed $v): ?string
{
    if ($v === null || $v === '') {
        return null;
    }
    $s = dec_parse((string) $v, 4);
    return is_string($s) && $s !== '0' ? $s : null;
}

/**
 * Cena jedne trapez stavke po cenovniku $pl. Dodaje sheet, felt, total, missing, status.
 * Iznos postoji samo kad su poznati valuta, osnova PDV-a i sve potrebne stope.
 */
function quote_price(array $item, array $pl): array
{
    $missing = [];
    $P = QUOTE_PROFILES[$item['profile']];
    $item['sheet'] = null;
    $item['felt_price'] = null;
    $item['total'] = null;
    if ($item['errors']) {
        $item['missing'] = [];
        $item['status'] = 'invalid';
        return $item;
    }
    $money = true;
    if (!isset(QUOTE_CURRENCIES[(string) $pl['currency']])) {
        $missing[] = 'Valuta cenovnika nije izabrana (Cenovnik → Opšte).';
        $money = false;
    }
    if (!isset(QUOTE_VAT[(string) $pl['vat']])) {
        $missing[] = 'Nije izabrano da li su cene bez PDV-a ili sa PDV-om (Cenovnik → Opšte).';
        $money = false;
    }
    foreach ($item['blockers'] as $b) {
        $missing[] = $b;
    }

    /* lim: obračunska površina × cena po m² */
    $rate = pricelist_rate($pl['sheet'][$item['profile'] . '|' . $item['t']]['rate_per_m2'] ?? null);
    $sheetSub = null;
    if (!in_array($item['t'], $P['thicknesses'], true)) {
        /* debljina van ponude: već je u blockers, cena se ne traži */
    } elseif ($rate === null) {
        $missing[] = 'Cena lima za ' . $P['name'] . ', ' . quote_t_label($item['t']) . ' mm (po m² pokrivne površine) nije uneta.';
    } else {
        $exact = big_mul((string) $item['area_mm2'], $rate);          // skala 6 (mm² → m²) + 4
        $sheetSub = big_div_round($exact, 8);                           // skala 2
        $item['sheet'] = ['rate' => dec_str($rate, 4), 'unit' => 'm2', 'basis_m2' => dec_str((string) $item['area_mm2'], 6),
                          'exact' => dec_str($exact, 10), 'subtotal' => $money ? dec_str($sheetSub, 2) : null];
    }

    /* filc: samo ako je u stavci */
    $feltSub = '0';
    if ($item['felt']) {
        $f = $pl['felt'][$item['profile']] ?? [];
        $fr = pricelist_rate($f['rate'] ?? null);
        $unit = (string) ($f['unit'] ?? '');
        $width = dec_parse((string) ($f['width_mm'] ?? ''), 1);
        $feltSub = null;
        if ($fr === null) {
            $missing[] = 'Cena filca za ' . $P['name'] . ' nije uneta (stavka je sa filcom).';
        } elseif (!isset(QUOTE_FELT_UNITS[$unit])) {
            $missing[] = 'Jedinica cene filca za ' . $P['name'] . ' nije izabrana (po m² ili po dužnom metru).';
        } elseif ($unit === 'm2' && (!is_string($width) || $width === '0')) {
            $missing[] = 'Širina filca za ' . $P['name'] . ' nije uneta — potrebna je jer je cena filca po m².';
        } elseif ($unit === 'm2') {
            $basis = big_mul((string) $item['linear_mm'], $width);      // mm × 0,1 mm → skala 7
            $exact = big_mul($basis, $fr);                                // skala 11
            $feltSub = big_div_round($exact, 9);
            $item['felt_price'] = ['rate' => dec_str($fr, 4), 'unit' => 'm2', 'width_mm' => dec_str($width, 1),
                                   'basis_m2' => dec_str($basis, 7), 'exact' => dec_str($exact, 11), 'subtotal' => $money ? dec_str($feltSub, 2) : null];
        } else {
            $exact = big_mul((string) $item['linear_mm'], $fr);          // skala 3 + 4
            $feltSub = big_div_round($exact, 5);
            $item['felt_price'] = ['rate' => dec_str($fr, 4), 'unit' => 'm', 'width_mm' => null,
                                   'basis_m' => dec_str((string) $item['linear_mm'], 3), 'exact' => dec_str($exact, 7), 'subtotal' => $money ? dec_str($feltSub, 2) : null];
        }
    }

    if (!$missing && $money && $sheetSub !== null && $feltSub !== null) {
        $item['total'] = dec_str(big_add($sheetSub, $feltSub), 2);
    }
    $item['missing'] = $missing;
    $item['status'] = $item['total'] !== null ? 'complete' : 'incomplete';
    return $item;
}

/**
 * Obračun celog upita iz reda „konfiguracija“ (jedna referenca po redu).
 * Vraća snimak za čuvanje (JSON) — sve primenjene stope, jedinice i rezultat.
 */
function quote_build(string $configRefs, array $pl, string $by): array
{
    $lines = array_values(array_filter(array_map('trim', preg_split('/\R/', $configRefs) ?: []), static fn($x) => $x !== ''));
    $items = [];
    $notes = [];
    if (count($lines) > QUOTE_MAX_REFS) {
        $notes[] = 'Upit ima ' . count($lines) . ' stavki; obračunato je prvih ' . QUOTE_MAX_REFS . '.';
        $lines = array_slice($lines, 0, QUOTE_MAX_REFS);
    }
    foreach ($lines as $line) {
        $p = quote_parse_ref($line);
        if ($p['kind'] === 'trapez') {
            $items[] = quote_price(quote_measure($p), $pl);
        } elseif ($p['kind'] === 'crep') {
            $items[] = ['kind' => 'crep', 'ref' => $line, 'name' => 'Imitacija crepa', 'status' => 'unpriced',
                        'missing' => ['Imitacija crepa nije u cenovniku (cenovnik obuhvata TR 10, TR 20, TR 35 i TR 40) — obračun ručno.']];
        } else {
            $items[] = ['kind' => $p['kind'], 'ref' => $line, 'name' => $p['kind'] === 'konf' ? 'Stavka 3D konfiguratora' : 'Nepoznata referenca',
                        'status' => 'unpriced', 'missing' => ['Stavka nije obuhvaćena automatskim obračunom — obračun ručno.']];
        }
    }

    /* none = nema stavki kalkulatora TR (samo tekst, crep ili konfigurator): nema automatskog obračuna */
    $status = 'none';
    $grand = null;
    if (in_array('trapez', array_column($items, 'kind'), true)) {
        $statuses = array_column($items, 'status');
        $status = in_array('invalid', $statuses, true) ? 'invalid' : (array_diff($statuses, ['complete']) ? 'incomplete' : 'complete');
        if ($status === 'complete') {
            $grand = '0';
            foreach ($items as $it) {
                $grand = big_add($grand, (string) dec_parse($it['total'], 2));
            }
            $grand = dec_str($grand, 2);
        }
    }
    $missing = [];
    foreach ($items as $i => $it) {
        foreach ($it['missing'] ?? [] as $msg) {
            $missing[] = 'Stavka ' . ($i + 1) . ': ' . $msg;
        }
        foreach ($it['errors'] ?? [] as $msg) {
            $missing[] = 'Stavka ' . ($i + 1) . ' (neispravan unos): ' . $msg;
        }
    }
    return [
        'v' => QUOTE_RULES_VERSION,
        'computed_at' => date('Y-m-d H:i:s'),
        'by' => $by,
        'price_list' => ['currency' => $pl['currency'], 'vat' => $pl['vat'], 'updated_at' => $pl['updated_at'], 'updated_by' => $pl['updated_by']],
        'items' => $items,
        'notes' => $notes,
        'missing' => $missing,
        'status' => $status,
        'grand_total' => $grand,
    ];
}

/** Čuva obračun uz upit (novi red; postojeći se nikad ne menjaju). */
function quote_save(int $inquiryId, array $snap): int
{
    return db_insert('inquiry_quotes', [
        'inquiry_id' => $inquiryId,
        'created_at' => $snap['computed_at'],
        'created_by' => mb_substr((string) $snap['by'], 0, 50),
        'status' => $snap['status'],
        'currency' => $snap['grand_total'] !== null ? $snap['price_list']['currency'] : null,
        'grand_total' => $snap['grand_total'],
        'snapshot' => json_encode($snap, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
    ]);
}
