<?php
/* TRICOM — sadržaj specifikacije za PDF: isti podaci i oznake kao štampa
   kalkulatora (js/calc-ui.js → M.print, plainLine, brkTable; js/calc.js → crep,
   productionNote), na jeziku strane sa koje je upit poslat (sr / en).

   Mere se računaju iz stavke koju je server proverio (app/lib/quote.php), u celim
   mm / mm², pa se zaokružuju samo za prikaz — kao na ekranu kupca. Cene se ne
   prikazuju (štampa kalkulatora ih ne prikazuje: SHOW_PRICES = false).
   Oznake su prepis ključeva calc.* iz js/i18n/sr.js i en.js — pri izmeni tamo
   uskladiti i ovde. */
defined('TRICOM') || exit;

require_once APP_DIR . '/lib/quote.php';

/** RAL → [naziv SR, naziv EN] (js/catalog.js → colours: shop || name, shop_en || name_en). */
const QP_COLOURS = [
    '3000' => ['vatreno crvena', 'flame red'],
    '3009' => ['bordo', 'burgundy'],
    '3011' => ['braon crvena', 'brown red'],
    '8004' => ['bakar braon', 'copper brown'],
    '8017' => ['čokoladno braon', 'chocolate brown'],
    '8019' => ['braon', 'brown'],
    '7016' => ['antracit', 'anthracite'],
    '7024' => ['grafit siva', 'graphite grey'],
    '7035' => ['svetlo siva', 'light grey'],
    '9005' => ['crna', 'black'],
    '9006' => ['metaliza', 'metallic silver'],
    '9007' => ['sivo aluminijum', 'grey aluminium'],
    '9010' => ['bela', 'white'],
    '9002' => ['prljavo bela', 'off-white'],
    '1015' => ['slonovača', 'ivory'],
    '6005' => ['mahovina zelena', 'moss green'],
    '6020' => ['hrom zelena', 'chrome green'],
    '5010' => ['encijan plava', 'gentian blue'],
    '9016' => ['saobraćajno bela', 'traffic white'],
    '3020' => ['saobraćajno crvena', 'traffic red'],
    '6002' => ['lisno zelena', 'leaf green'],
    '6011' => ['rezeda zelena', 'reseda green'],
    '6026' => ['opal zelena', 'opal green'],
    '6028' => ['zelena', 'green'],
    '5015' => ['nebo plava', 'sky blue'],
];

/** Teme kontakt forme: vrednost (SR) → prikaz na engleskoj strani (contact-en.php). */
const QP_TOPICS_EN = [
    'sečenje na CNC plazmi' => 'CNC plasma cutting', 'gasno rezanje' => 'Oxy-fuel cutting',
    'sečenje makazama' => 'Sheet cutting on the guillotine shear', 'slitovanje kotura' => 'Slitting / coil rewinding',
    'savijanje i oblikovanje' => 'Sheet bending and forming', 'trapezni lim' => 'Trapezoidal profiled and roofing sheet',
    'oluci i limarija' => 'Gutters, downpipes and sheet-metal work', 'limovi' => 'Sheet and coil',
    'cevi i profili' => 'Tubes and steel sections', 'alati i oprema' => 'Tools, hardware and welding equipment', 'opšte' => 'General question',
];

const QP_TEXT = [
    'sr' => [
        'calc.name.crep' => 'Imitacija crepa', 'calc.badge.tr40' => 'Lim ojačan — standard',
        'calc.mode' => 'Način proračuna', 'calc.mode.n' => 'Znam broj tabli', 'calc.mode.w' => 'Znam širinu krova',
        'calc.f.L' => 'Dužina table', 'calc.f.n' => 'Broj tabli', 'calc.f.W' => 'Ukupna širina krova', 'calc.f.side' => 'Profil',
        'calc.side.krov' => 'Profil za krov', 'calc.side.fasada' => 'Profil za fasadu', 'calc.f.felt' => 'Filc', 'calc.felt.label' => 'Antikondenz filc',
        'calc.f.colour' => 'Boja krova', 'calc.f.t' => 'Debljina lima', 'calc.f.start' => 'Kraj table', 'calc.endMode' => 'Početak table (kod oluka)',
        'calc.endMode.free' => 'Slobodan početak', 'calc.endMode.fixed' => 'Zadati početak',
        'calc.res.sheets' => 'Tabli', 'calc.res.area' => 'Pokrivena površina', 'calc.res.matTotal' => 'Materijal ukupno',
        'calc.res.cover' => 'Pokrivna širina profila', 'calc.res.covered' => 'Pokrivena širina', 'calc.res.surplus' => 'višak {s} mm',
        'calc.res.linear' => 'Dužni metri', 'calc.res.developed' => 'Razvijena površina', 'calc.res.weight' => 'Masa (procena)', 'calc.res.felt' => 'Filc',
        'calc.res.noFelt' => 'bez filca', 'calc.res.tiles' => 'Crepova po tabli', 'calc.res.pitch' => 'Korak crepa', 'calc.res.dev' => 'odstupanje {d} mm',
        'calc.res.end' => 'Početak (kod oluka)', 'calc.res.mat' => 'Materijal po tabli', 'calc.res.reinf' => 'Izvedba',
        'calc.res.noWidth' => 'nije poznata — površina nije izračunata',
        'calc.pl.sheet1' => 'tabla', 'calc.pl.sheet2' => 'table', 'calc.pl.sheet5' => 'tabli', 'calc.pl.tile1' => 'crep', 'calc.pl.tile2' => 'crepa', 'calc.pl.tile5' => 'crepova',
        'calc.pl.cover1' => 'pokriva', 'calc.pl.cover2' => 'pokrivaju', 'calc.pl.len1' => 'dužina', 'calc.pl.len2' => 'dužine', 'calc.pl.len5' => 'dužina',
        'calc.line.trapez' => '{n} {sheets} {name} × {L} mm {covers} {w} mm širine · {a} m²',
        'calc.line.crep' => '{tiles} {tilesW} po tabli · korak {p} mm · početak {e} mm · {n} {sheets} × {m} mm materijala',
        'calc.line.trapezMulti' => '{n} {sheets} {name} u {k} {lens} · {lm} m dužnih · {a} m²',
        'calc.rows' => 'Dužine i količine', 'calc.res.Lmulti' => '{k} {lens} — v. razbijanje',
        'calc.brk.cap' => 'Razbijanje po dužinama · površina iz pokrivne širine {w} mm', 'calc.brk.L' => 'Dužina', 'calc.brk.n' => 'Kom',
        'calc.brk.lm' => 'Dužni m', 'calc.brk.a' => 'm²', 'calc.brk.total' => 'Ukupno',
        'calc.print.title' => 'Specifikacija — {name}', 'calc.print.sub' => 'Kalkulator · {date}', 'calc.print.inputs' => 'Ulazni podaci',
        'calc.print.results' => 'Rezultat', 'calc.print.th.item' => 'Stavka', 'calc.print.th.val' => 'Vrednost', 'calc.print.note' => 'Napomena za proizvodnju',
        'calc.print.url' => 'Proračun na sajtu: ',
        'calc.print.foot' => 'TRICOM d.o.o., Kneza Paskača 16-18, Batajnica · 063 850 30 00 · office@tricom.rs · tricom.rs',
        'disclaimer' => 'Orijentaciono — tačne količine i cenu potvrđuje prodaja TRICOM-a po prijemu upita.',
        /* samo PDF (upit sa više stavki i podacima kupca) */
        'pdf.title' => 'Specifikacija upita {ref}', 'pdf.sub' => 'Kalkulator · {date}', 'pdf.customer' => 'Podaci kupca',
        'pdf.ref' => 'Broj upita', 'pdf.date' => 'Datum', 'pdf.name' => 'Ime i firma', 'pdf.email' => 'E-pošta', 'pdf.tel' => 'Telefon', 'pdf.topic' => 'Tema upita',
        'pdf.items' => 'Stavke ({n})', 'pdf.item' => 'Stavka {i}', 'pdf.message' => 'Poruka kupca', 'pdf.cont' => '(nastavak)',
        'pdf.konf' => 'Stavka 3D konfiguratora', 'pdf.konfUrl' => 'Konfiguracija na sajtu: ', 'pdf.unknown' => 'Referenca stavke',
        'pdf.invalid' => 'Stavka nije ispravna — prodaja će je proveriti sa vama.', 'pdf.page' => 'Strana {p} od {n}', 'pdf.none' => '—',
    ],
    'en' => [
        'calc.name.crep' => 'Tile-effect roofing sheet', 'calc.badge.tr40' => 'Reinforced sheet — standard',
        'calc.mode' => 'Calculate by', 'calc.mode.n' => 'I know the number of sheets', 'calc.mode.w' => 'I know the roof width',
        'calc.f.L' => 'Sheet length', 'calc.f.n' => 'Number of sheets', 'calc.f.W' => 'Total roof width', 'calc.f.side' => 'Profile',
        'calc.side.krov' => 'Roof profile', 'calc.side.fasada' => 'Façade profile', 'calc.f.felt' => 'Felt', 'calc.felt.label' => 'Anti-condensation felt',
        'calc.f.colour' => 'Roof colour', 'calc.f.t' => 'Sheet thickness', 'calc.f.start' => 'Sheet end', 'calc.endMode' => 'Sheet start (gutter end)',
        'calc.endMode.free' => 'Free start', 'calc.endMode.fixed' => 'Set start length',
        'calc.res.sheets' => 'Sheets', 'calc.res.area' => 'Covered area', 'calc.res.matTotal' => 'Total material',
        'calc.res.cover' => 'Profile cover width', 'calc.res.covered' => 'Covered width', 'calc.res.surplus' => 'surplus {s} mm',
        'calc.res.linear' => 'Linear metres', 'calc.res.developed' => 'Developed area', 'calc.res.weight' => 'Weight (estimate)', 'calc.res.felt' => 'Felt',
        'calc.res.noFelt' => 'no felt', 'calc.res.tiles' => 'Tiles per sheet', 'calc.res.pitch' => 'Tile pitch', 'calc.res.dev' => 'deviation {d} mm',
        'calc.res.end' => 'Start (gutter end)', 'calc.res.mat' => 'Material per sheet', 'calc.res.reinf' => 'Version',
        'calc.res.noWidth' => 'not known — area not calculated',
        'calc.pl.sheet1' => 'sheet', 'calc.pl.sheet2' => 'sheets', 'calc.pl.sheet5' => 'sheets', 'calc.pl.tile1' => 'tile', 'calc.pl.tile2' => 'tiles', 'calc.pl.tile5' => 'tiles',
        'calc.pl.cover1' => 'covers', 'calc.pl.cover2' => 'cover', 'calc.pl.len1' => 'length', 'calc.pl.len2' => 'lengths', 'calc.pl.len5' => 'lengths',
        'calc.line.trapez' => '{n} {sheets} {name} × {L} mm {covers} {w} mm of width · {a} m²',
        'calc.line.crep' => '{tiles} {tilesW} per sheet · pitch {p} mm · start {e} mm · {n} {sheets} × {m} mm of material',
        'calc.line.trapezMulti' => '{n} {sheets} {name} in {k} {lens} · {lm} linear metres · {a} m²',
        'calc.rows' => 'Lengths and quantities', 'calc.res.Lmulti' => '{k} {lens} — see breakdown',
        'calc.brk.cap' => 'Breakdown by length · area from the {w} mm cover width', 'calc.brk.L' => 'Length', 'calc.brk.n' => 'Pcs',
        'calc.brk.lm' => 'Linear m', 'calc.brk.a' => 'm²', 'calc.brk.total' => 'Total',
        'calc.print.title' => 'Specification — {name}', 'calc.print.sub' => 'Calculator · {date}', 'calc.print.inputs' => 'Input',
        'calc.print.results' => 'Result', 'calc.print.th.item' => 'Item', 'calc.print.th.val' => 'Value', 'calc.print.note' => 'Production note',
        'calc.print.url' => 'Calculation on the website: ',
        'calc.print.foot' => 'TRICOM d.o.o., Kneza Paskača 16-18, Batajnica, Serbia · +381 63 850 30 00 · office@tricom.rs · tricom.rs',
        'disclaimer' => 'Indicative — TRICOM sales will confirm exact quantities and price on receipt of your inquiry.',
        'pdf.title' => 'Inquiry specification {ref}', 'pdf.sub' => 'Calculator · {date}', 'pdf.customer' => 'Customer details',
        'pdf.ref' => 'Inquiry number', 'pdf.date' => 'Date', 'pdf.name' => 'Name and company', 'pdf.email' => 'E-mail', 'pdf.tel' => 'Phone', 'pdf.topic' => 'Topic',
        'pdf.items' => 'Items ({n})', 'pdf.item' => 'Item {i}', 'pdf.message' => 'Customer message', 'pdf.cont' => '(continued)',
        'pdf.konf' => '3D configurator item', 'pdf.konfUrl' => 'Configuration on the website: ', 'pdf.unknown' => 'Item reference',
        'pdf.invalid' => 'This item is not valid — TRICOM sales will check it with you.', 'pdf.page' => 'Page {p} of {n}', 'pdf.none' => '—',
    ],
];

function qp_t(string $L, string $key, array $v = []): string
{
    $s = QP_TEXT[$L][$key] ?? QP_TEXT['sr'][$key] ?? $key;
    foreach ($v as $k => $x) {
        $s = str_replace('{' . $k . '}', (string) $x, $s);
    }
    return $s;
}

/** Skalirani ceo broj → prikaz kao fmt() u calc-ui.js (SR: 1 234,5 sa nepreklopivim razmakom; EN: 1,234.5). */
function qp_dec(string|int $scaled, int $scale, int $show, string $L): string
{
    $s = dec_fmt((string) $scaled, $scale, $show);
    return $L === 'en' ? strtr($s, ['.' => ',', ',' => '.']) : str_replace('.', "\u{00A0}", $s);
}

function qp_int(int $n, string $L): string
{
    return qp_dec($n, 0, 0, $L);
}

/** Dužni metri iz mm: 2 decimale, 3 kad treća nije 0 (fmtM). */
function qp_m(int $mm, string $L): string
{
    return qp_dec($mm, 3, $mm % 10 !== 0 ? 3 : 2, $L);
}

/** Dužina u m bez suvišnih nula (fmtLen). */
function qp_len(int $mm, string $L): string
{
    return qp_dec($mm, 3, $mm % 10 ? 3 : ($mm % 100 ? 2 : ($mm % 1000 ? 1 : 0)), $L);
}

/** Debljina (fmtT): bar jedna decimala, najviše dve. */
function qp_thick(string $t, string $L): string
{
    $s = dec_parse($t, 2);
    if (!is_string($s)) {
        return $t;
    }
    $show = (int) $s % 10 !== 0 ? 2 : 1;
    return qp_dec($s, 2, $show, $L);
}

/** Množina kao plural() u calc-ui.js. */
function qp_plural(int $n, string $base, string $L): string
{
    if ($L === 'en') {
        $k = $n === 1 ? 1 : 2;
    } elseif ($n % 10 === 1 && $n % 100 !== 11) {
        $k = 1;
    } elseif ($n % 10 >= 2 && $n % 10 <= 4 && ($n % 100 < 12 || $n % 100 > 14)) {
        $k = 2;
    } else {
        $k = 5;
    }
    return qp_t($L, 'calc.pl.' . $base . $k);
}

function qp_colour(string $ral, string $L): string
{
    $c = QP_COLOURS[$ral] ?? null;
    return 'RAL ' . $ral . ($c ? ' ' . $c[$L === 'en' ? 1 : 0] : '');
}

/** Masa (kg, 1 decimala) iz razvijene površine u mm² i debljine: m² × mm × 7,85. */
function qp_weight(int $devMm2, string $t, string $L): string
{
    $te2 = dec_parse($t, 2);
    $te2 = is_string($te2) ? $te2 : '50';
    return '≈ ' . qp_dec(big_mul(big_mul((string) $devMm2, $te2), '785'), 10, 1, $L) . ' kg';
}

/** Napomena za proizvodnju (productionNote u js/calc.js; jezik pogona je srpski i u engleskoj štampi). */
function qp_production_note(string $id, string $side, bool $felt): string
{
    $out = [];
    if ($id === 'tr40') {
        $out[] = 'OJAČAN — spustiti zadnji set valjaka';
    }
    if ($side === 'fasada') {
        $out[] = $id === 'tr10' && !$felt ? 'KONTRA LIM BEZ FILCA — uvod lima licem na dole' : 'lice dole';
    } else {
        $out[] = 'lice gore';
    }
    if ($felt) {
        $out[] = 'sa filcom';
    } elseif (!($id === 'tr10' && $side === 'fasada')) {
        $out[] = 'bez filca';
    }
    return implode(' · ', $out);
}

function qp_calc_url(string $ref, string $L): string
{
    return absolute_url($L === 'en' ? 'en/calculators.html' : 'kalkulatori.html') . '#' . ltrim(substr($ref, 5), '#');
}

/**
 * Imitacija crepa (crep() u js/calc.js), za specifikaciju. Vraća mere ili greške.
 * Pokrivna širina crepa nije poznata, pa nema režima širine krova; filc iz razvijene širine.
 */
function qp_crep(array $p): array
{
    $P = QUOTE_CREP;
    $L = $p['L'];
    $n = $p['n'];
    $e = $p['e'];
    $fixed = $p['fixed'];
    $lMin = $P['start'] + $P['tile'] + $P['endMin'];
    $err = [];
    if (!quote_is_int($L)) {
        $err[] = 'dužina table mora biti ceo broj milimetara';
    } elseif ($L < $lMin) {
        $err[] = 'dužina table mora biti najmanje ' . $lMin . ' mm';
    } elseif ($L > $P['lengthMax']) {
        $err[] = 'dužina table može biti najviše ' . $P['lengthMax'] . ' mm';
    }
    if (!quote_is_int($n) || $n < 1 || $n > QUOTE_MAX_PIECES) {
        $err[] = 'broj tabli mora biti ceo broj od 1 do ' . QUOTE_MAX_PIECES;
    }
    if ($fixed) {
        if (!quote_is_int($e) || $e < $P['endMin']) {
            $err[] = 'zadati početak mora biti ceo broj od najmanje ' . $P['endMin'] . ' mm';
        } elseif (!$err && $e > $L - $P['start'] - $P['tile']) {
            $err[] = 'zadati početak može biti najviše ' . ($L - $P['start'] - $P['tile']) . ' mm';
        }
    }
    if ($err) {
        return ['errors' => $err];
    }
    $L = (int) $L;
    $n = (int) $n;
    $tiles = intdiv($L - $P['start'] - $P['endMin'], $P['tile']);
    if ($fixed) {
        $e = (int) $e;
        $num = $L - $P['start'] - $e;           // korak = num / tiles
        $end = $e;
    } else {
        $num = $tiles * $P['tile'];
        $end = $L - $P['start'] - $tiles * $P['tile'];
    }
    $pitch100 = intdiv(2 * $num * 100 + $tiles, 2 * $tiles);   // korak × 100, zaokruženo
    $matLen = $L + ($tiles + 1) * $P['step'];
    return ['errors' => [], 'L' => $L, 'n' => $n, 'fixed' => $fixed, 'e' => $fixed ? $end : null, 'tiles' => $tiles, 'pitch100' => $pitch100,
            'pitchExact' => $num % $tiles === 0, 'dev100' => $pitch100 - $P['tile'] * 100, 'end' => $end, 'matLen' => $matLen,
            'matTotalMm' => $n * $matLen, 'devMm2' => $n * $matLen * $P['developedWidth'], 'feltMm2' => $n * $L * $P['developedWidth']];
}

/**
 * Jedna stavka upita kao blok specifikacije (isti redosled polja kao M.print).
 * Vraća: code, line, inputs[[oznaka, vrednost]], brk (ili null), results, note, url, invalid.
 */
function qp_item(string $ref, string $L): array
{
    $p = quote_parse_ref($ref);
    $none = qp_t($L, 'pdf.none');
    if ($p['kind'] === 'konf') {
        return ['kind' => 'konf', 'code' => qp_t($L, 'pdf.konf'), 'line' => '', 'inputs' => [], 'brk' => null, 'results' => [], 'note' => '',
                'url' => qp_t($L, 'pdf.konfUrl') . absolute_url($L === 'en' ? 'en/configurator.html' : 'konfigurator.html') . '#' . $ref, 'invalid' => false];
    }
    if ($p['kind'] === 'unknown') {
        return ['kind' => 'unknown', 'code' => qp_t($L, 'pdf.unknown'), 'line' => $ref, 'inputs' => [], 'brk' => null, 'results' => [], 'note' => '', 'url' => '', 'invalid' => true];
    }
    $feltTxt = static fn(bool $felt): string => qp_t($L, $felt ? 'calc.felt.label' : 'calc.res.noFelt');
    $url = qp_t($L, 'calc.print.url') . qp_calc_url($ref, $L);

    if ($p['kind'] === 'crep') {
        $code = qp_t($L, 'calc.name.crep');
        $c = qp_crep($p);
        if ($c['errors']) {
            return ['kind' => 'crep', 'code' => $code, 'line' => qp_t($L, 'pdf.invalid'), 'inputs' => [], 'brk' => null, 'results' => [], 'note' => '', 'url' => $url, 'invalid' => true, 'errors' => $c['errors']];
        }
        $t = preg_match('/^\d+(?:\.\d+)?$/', (string) $p['t']) && (float) $p['t'] > 0 ? (string) $p['t'] : QUOTE_DEFAULTS['t'];
        $pitch = qp_dec($c['pitch100'], 2, $c['pitchExact'] ? 0 : 2, $L);    // kao fmt(pitch, pitch % 1 ? 2 : 0)
        $inputs = [
            [qp_t($L, 'calc.f.L'), qp_int($c['L'], $L) . ' mm'], [qp_t($L, 'calc.f.n'), qp_int($c['n'], $L)],
            [qp_t($L, 'calc.f.start'), qp_int(QUOTE_CREP['start'], $L) . ' mm'],
            [qp_t($L, 'calc.endMode'), qp_t($L, $c['fixed'] ? 'calc.endMode.fixed' : 'calc.endMode.free') . ($c['fixed'] ? ' · ' . qp_int($c['e'], $L) . ' mm' : '')],
            [qp_t($L, 'calc.f.colour'), qp_colour($p['colour'], $L)], [qp_t($L, 'calc.f.t'), qp_thick($t, $L) . ' mm'], [qp_t($L, 'calc.f.felt'), $feltTxt($p['felt'])],
        ];
        $dev = ($c['dev100'] > 0 ? '+' : ($c['dev100'] < 0 ? '−' : '')) . qp_dec(abs($c['dev100']), 2, 2, $L);
        $results = [
            [qp_t($L, 'calc.res.tiles'), qp_int($c['tiles'], $L)],
            [qp_t($L, 'calc.res.pitch'), $pitch . ' mm' . ($c['fixed'] ? ' (' . qp_t($L, 'calc.res.dev', ['d' => $dev]) . ')' : '')],
            [qp_t($L, 'calc.res.end'), qp_int($c['end'], $L) . ' mm'], [qp_t($L, 'calc.res.mat'), qp_int($c['matLen'], $L) . ' mm'],
            [qp_t($L, 'calc.res.matTotal'), qp_dec($c['matTotalMm'], 3, 2, $L) . ' m'], [qp_t($L, 'calc.res.developed'), qp_dec($c['devMm2'], 6, 2, $L) . ' m²'],
            [qp_t($L, 'calc.res.weight'), qp_weight($c['devMm2'], $t, $L)],
            [qp_t($L, 'calc.res.felt'), $p['felt'] ? qp_dec($c['feltMm2'], 6, 2, $L) . ' m²' : qp_t($L, 'calc.res.noFelt')],
        ];
        $line = qp_t($L, 'calc.line.crep', ['tiles' => $c['tiles'], 'tilesW' => qp_plural($c['tiles'], 'tile', $L), 'p' => $pitch, 'e' => qp_int($c['end'], $L),
            'n' => qp_int($c['n'], $L), 'sheets' => qp_plural($c['n'], 'sheet', $L), 'm' => qp_int($c['matLen'], $L)]);
        return ['kind' => 'crep', 'code' => $code, 'line' => $line, 'inputs' => $inputs, 'brk' => null, 'results' => $results,
                'note' => qp_production_note('crep', 'krov', $p['felt']), 'url' => $url, 'invalid' => false];
    }

    /* trapez */
    $m = quote_measure($p);
    $code = $m['name'];
    if ($m['errors']) {
        return ['kind' => 'trapez', 'code' => $code, 'line' => qp_t($L, 'pdf.invalid'), 'inputs' => [], 'brk' => null, 'results' => [], 'note' => '', 'url' => $url, 'invalid' => true, 'errors' => $m['errors']];
    }
    $multi = count($m['rows']) > 1;
    $cw = (int) $m['width_mm'];
    $area = static fn(int $mm2): string => qp_dec($mm2, 6, 2, $L);
    $inputs = [[qp_t($L, 'calc.mode'), qp_t($L, $m['mode'] === 'w' ? 'calc.mode.w' : 'calc.mode.n')]];
    if ($multi) {
        $inputs[] = [qp_t($L, 'calc.rows'), qp_t($L, 'calc.res.Lmulti', ['k' => count($m['rows']), 'lens' => qp_plural(count($m['rows']), 'len', $L)])];
    } else {
        $inputs[] = [qp_t($L, 'calc.f.L'), qp_int($m['rows'][0]['L'], $L) . ' mm'];
        $inputs[] = $m['mode'] === 'w'
            ? [qp_t($L, 'calc.f.W'), qp_int((int) round((float) $m['W']), $L) . ' mm']
            : [qp_t($L, 'calc.f.n'), qp_int($m['n_total'], $L)];
    }
    $inputs[] = [qp_t($L, 'calc.f.side'), qp_t($L, $m['side'] === 'fasada' ? 'calc.side.fasada' : 'calc.side.krov')];
    $inputs[] = [qp_t($L, 'calc.f.colour'), qp_colour($m['colour'], $L)];
    $inputs[] = [qp_t($L, 'calc.f.t'), qp_thick($m['t'], $L) . ' mm'];
    $inputs[] = [qp_t($L, 'calc.f.felt'), $feltTxt($m['felt'])];
    if ($m['reinforced']) {
        $inputs[] = [qp_t($L, 'calc.res.reinf'), qp_t($L, 'calc.badge.tr40')];
    }

    $devMm2 = $m['linear_mm'] * QUOTE_DEVELOPED_WIDTH;
    $results = [[qp_t($L, 'calc.res.sheets'), qp_int($m['n_total'], $L)], [qp_t($L, 'calc.res.cover'), qp_int($cw, $L) . ' mm']];
    if (!$multi) {
        $covered = $m['n_total'] * $cw;
        $surplus = '';
        if ($m['mode'] === 'w') {
            $s = (int) round($covered - (float) $m['W']);
            $surplus = ' (' . qp_t($L, 'calc.res.surplus', ['s' => ($s < 0 ? '−' : '') . qp_int(abs($s), $L)]) . ')';
        }
        $results[] = [qp_t($L, 'calc.res.covered'), qp_int($covered, $L) . ' mm' . $surplus];
    }
    $results[] = [qp_t($L, 'calc.res.area'), $area($m['area_mm2']) . ' m²'];
    $results[] = [qp_t($L, 'calc.res.linear'), qp_m($m['linear_mm'], $L) . ' m'];
    $results[] = [qp_t($L, 'calc.res.developed'), $area($devMm2) . ' m²'];
    $results[] = [qp_t($L, 'calc.res.weight'), qp_weight($devMm2, $m['t'], $L)];
    $results[] = [qp_t($L, 'calc.res.felt'), $m['felt'] ? $area($m['area_mm2']) . ' m²' : qp_t($L, 'calc.res.noFelt')];

    $brk = null;
    if ($multi) {
        $rows = [];
        foreach ($m['rows'] as $i => $r) {
            $rows[] = [(string) ($i + 1), qp_int($r['L'], $L) . ' mm = ' . qp_len($r['L'], $L) . ' m', qp_int($r['n'], $L), qp_m($r['linear_mm'], $L), $area($r['area_mm2'])];
        }
        $brk = ['cap' => qp_t($L, 'calc.brk.cap', ['w' => qp_int($cw, $L)]),
                'head' => ['#', qp_t($L, 'calc.brk.L'), qp_t($L, 'calc.brk.n'), qp_t($L, 'calc.brk.lm'), qp_t($L, 'calc.brk.a')],
                'rows' => $rows,
                'total' => [qp_t($L, 'calc.brk.total'), '', qp_int($m['n_total'], $L), qp_m($m['linear_mm'], $L), $area($m['area_mm2'])]];
        $line = qp_t($L, 'calc.line.trapezMulti', ['n' => qp_int($m['n_total'], $L), 'sheets' => qp_plural($m['n_total'], 'sheet', $L), 'name' => $code,
            'k' => count($m['rows']), 'lens' => qp_plural(count($m['rows']), 'len', $L), 'lm' => qp_m($m['linear_mm'], $L), 'a' => $area($m['area_mm2'])]);
    } else {
        $line = qp_t($L, 'calc.line.trapez', ['n' => qp_int($m['n_total'], $L), 'sheets' => qp_plural($m['n_total'], 'sheet', $L), 'name' => $code,
            'L' => qp_int($m['rows'][0]['L'], $L), 'covers' => qp_t($L, $m['n_total'] === 1 ? 'calc.pl.cover1' : 'calc.pl.cover2'),
            'w' => qp_int($m['n_total'] * $cw, $L), 'a' => $area($m['area_mm2'])]);
    }
    return ['kind' => 'trapez', 'code' => $code, 'line' => $line, 'inputs' => $inputs, 'brk' => $brk, 'results' => $results,
            'note' => qp_production_note($m['profile'], $m['side'], $m['felt']), 'url' => $url, 'invalid' => false];
}

/** Sve stavke upita (redovi skrivenog polja „konfiguracija“, najviše QUOTE_MAX_REFS). */
function qp_items(string $configRefs, string $L): array
{
    $lines = array_values(array_filter(array_map('trim', preg_split('/\R/', $configRefs) ?: []), static fn($x) => $x !== ''));
    return array_map(static fn($x) => qp_item($x, $L), array_slice($lines, 0, QUOTE_MAX_REFS));
}

/** Da li upit ima bar jednu stavku kalkulatora (calc:…) — tada ide tokom „upit iz kalkulatora“. */
function qp_has_calc_items(string $configRefs): bool
{
    return (bool) preg_match('/(^|\R)\s*calc:(tr10|tr20|tr35|tr40|crep)\b/', $configRefs);
}
