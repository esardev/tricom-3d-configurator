<?php
/* TRICOM — modul „Cenovnik“ (admin/index.php?m=cenovnik): interni cenovnik
   trapeznih limova iz kalkulatora (TR 10, TR 20, TR 35, TR 40).
   Akcije (a=): pregled i forma (podrazumevano), save (POST).
   Cene se ne prikazuju na sajtu ni kupcu; koriste se samo za interni obračun
   upita (modul Upiti). Prazno polje = cena nije poznata (nikad nula).
   Obračunska širina je pokrivna širina profila iz kalkulatora (app/lib/quote.php)
   i ovde se samo prikazuje. Količinski razredi ne postoje: u projektu nema tarife sa razredima. */
defined('TRICOM') || exit;

require_once APP_DIR . '/admin/form.php';          // adm_error_summary, adm_select, adm_fieldset (forma cenovnika)
require_once APP_DIR . '/lib/quote.php';

$action = is_string($_GET['a'] ?? null) ? $_GET['a'] : '';
$self = static fn(array $q = []): string => admin_url('', ['m' => 'cenovnik'] + $q);

if (!pricing_ready()) {
    admin_render('pricelist-form', ['ready' => false], 'Cenovnik', 'cenovnik');
}

/** Ime polja za cenu lima: sheet_tr20_050 (debljina 0.50 bez tačke). */
function pricelist_field(string $profile, string $t): string
{
    return 'sheet_' . $profile . '_' . str_replace('.', '', $t);
}

/** Unos iz forme → [vrednosti za bazu, vrednosti za ponovni prikaz, greške]. */
function pricelist_input(array $src): array
{
    $err = [];
    $show = [];
    $data = ['currency' => null, 'vat' => null, 'sheet' => [], 'felt' => []];

    $cur = input_str($src, 'currency');
    $show['currency'] = $cur;
    if ($cur !== '' && !isset(QUOTE_CURRENCIES[$cur])) {
        $err['currency'] = 'Valuta: izaberite RSD ili EUR.';
    }
    $data['currency'] = $cur !== '' ? $cur : null;
    $vat = input_str($src, 'vat_basis');
    $show['vat_basis'] = $vat;
    if ($vat !== '' && !isset(QUOTE_VAT[$vat])) {
        $err['vat_basis'] = 'Osnova cena: izaberite „bez PDV-a“ ili „sa PDV-om“.';
    }
    $data['vat'] = $vat !== '' ? $vat : null;

    $rate = static function (string $field, string $label) use ($src, &$err, &$show): ?string {
        $raw = input_str($src, $field);
        $show[$field] = $raw;
        /* „1.250“ je dvosmisleno (hiljadu dvesta pedeset ili 1,25) — ne pogađa se */
        if (preg_match('/^\d{1,3}\.\d{3}$/', str_replace(' ', '', $raw))) {
            $err[$field] = $label . ': zapis „' . $raw . '“ je dvosmislen — upišite bez tačke (npr. 1250) ili sa decimalnim zarezom (npr. 1,25).';
            return null;
        }
        $v = dec_parse($raw, 4);
        if ($v === false) {
            $err[$field] = $label . ': upišite broj, najviše 4 decimale (npr. 1250 ili 12,5), bez oznake valute.';
            return null;
        }
        if ($v === '0') {
            $err[$field] = $label . ': nula nije dozvoljena — ostavite prazno ako cena nije poznata.';
            return null;
        }
        return $v === null ? null : dec_str($v, 4);
    };

    foreach (QUOTE_PROFILES as $key => $P) {
        foreach ($P['thicknesses'] as $t) {
            $data['sheet'][$key . '|' . $t] = $rate(pricelist_field($key, $t), 'Cena lima ' . $P['name'] . ', ' . quote_t_label($t) . ' mm');
        }
        $fr = $rate('felt_' . $key . '_rate', 'Cena filca ' . $P['name']);
        $unit = input_str($src, 'felt_' . $key . '_unit');
        $show['felt_' . $key . '_unit'] = $unit;
        if ($unit !== '' && !isset(QUOTE_FELT_UNITS[$unit])) {
            $err['felt_' . $key . '_unit'] = 'Jedinica cene filca ' . $P['name'] . ': nedozvoljena vrednost.';
            $unit = '';
        }
        if ($fr !== null && $unit === '' && !isset($err['felt_' . $key . '_unit'])) {
            $err['felt_' . $key . '_unit'] = 'Jedinica cene filca ' . $P['name'] . ': izaberite „po m² filca“ ili „po dužnom metru table“ — bez jedinice cena se ne može primeniti.';
        }
        $wraw = input_str($src, 'felt_' . $key . '_width');
        $show['felt_' . $key . '_width'] = $wraw;
        $w = dec_parse($wraw, 1, 4);
        if ($w === false || ($w !== null && ((int) $w < 100 || (int) $w > 30000))) {
            $err['felt_' . $key . '_width'] = 'Širina filca ' . $P['name'] . ': upišite širinu u milimetrima, od 10 do 3000 (najviše 1 decimala).';
            $w = null;
        }
        $data['felt'][$key] = ['rate' => $fr, 'unit' => $unit !== '' ? $unit : null, 'width' => $w === null ? null : dec_str($w, 1)];
    }
    return [$data, $show, $err];
}

/** Ista vrednost (NULL ili isti decimalni broj)? */
function pricelist_same(mixed $a, mixed $b, int $scale): bool
{
    if ($a === null || $a === '' || $b === null || $b === '') {
        return ($a === null || $a === '') && ($b === null || $b === '');
    }
    return dec_parse((string) $a, $scale) === dec_parse((string) $b, $scale);
}

/* ---------------------------------------------------------------- POST: čuvanje */
if ($action === 'save' && is_post()) {
    csrf_require();
    [$data, $show, $errors] = pricelist_input($_POST);
    $pl = pricelist_load();
    if ($errors) {
        admin_render('pricelist-form', ['ready' => true, 'pl' => $pl, 'show' => $show, 'errors' => $errors, 'gaps' => pricelist_gaps($pl)], 'Cenovnik', 'cenovnik');
    }
    $who = (string) admin_user()['username'];
    $now = date('Y-m-d H:i:s');
    $changed = db_transaction(static function () use ($data, $pl, $who, $now): int {
        $n = 0;
        if ($data['currency'] !== $pl['currency'] || $data['vat'] !== $pl['vat']) {
            db_run('INSERT INTO `price_settings` (`id`, `currency`, `vat_basis`, `updated_at`, `updated_by`) VALUES (1, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE `currency` = VALUES(`currency`), `vat_basis` = VALUES(`vat_basis`), `updated_at` = VALUES(`updated_at`), `updated_by` = VALUES(`updated_by`)',
                [$data['currency'], $data['vat'], $now, $who]);
            $n++;
        }
        foreach ($data['sheet'] as $k => $rate) {
            if (pricelist_same($rate, $pl['sheet'][$k]['rate_per_m2'] ?? null, 4)) {
                continue;
            }
            [$profile, $t] = explode('|', $k);
            db_run('INSERT INTO `price_sheet_rates` (`profile_key`, `thickness_mm`, `rate_per_m2`, `updated_at`, `updated_by`) VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE `rate_per_m2` = VALUES(`rate_per_m2`), `updated_at` = VALUES(`updated_at`), `updated_by` = VALUES(`updated_by`)',
                [$profile, $t, $rate, $now, $who]);
            $n++;
        }
        foreach ($data['felt'] as $profile => $f) {
            $old = $pl['felt'][$profile] ?? [];
            if (pricelist_same($f['rate'], $old['rate'] ?? null, 4) && $f['unit'] === ($old['unit'] ?? null) && pricelist_same($f['width'], $old['width_mm'] ?? null, 1)) {
                continue;
            }
            db_run('INSERT INTO `price_felt_rates` (`profile_key`, `rate`, `unit`, `width_mm`, `updated_at`, `updated_by`) VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE `rate` = VALUES(`rate`), `unit` = VALUES(`unit`), `width_mm` = VALUES(`width_mm`), `updated_at` = VALUES(`updated_at`), `updated_by` = VALUES(`updated_by`)',
                [$profile, $f['rate'], $f['unit'], $f['width'], $now, $who]);
            $n++;
        }
        if ($n > 0) {
            /* vreme poslednje izmene celog cenovnika (beleži se uz svaki obračun) */
            db_run('INSERT INTO `price_settings` (`id`, `updated_at`, `updated_by`) VALUES (1, ?, ?)
                    ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`), `updated_by` = VALUES(`updated_by`)', [$now, $who]);
        }
        return $n;
    });
    flash('success', $changed > 0
        ? 'Cenovnik je sačuvan. Važi za nove upite i za nove obračune; već sačuvani obračuni se ne menjaju.'
        : 'Nema izmena — cenovnik je ostao isti.');
    redirect($self());
}

/* ---------------------------------------------------------------- forma */
$pl = pricelist_load();
$show = ['currency' => (string) $pl['currency'], 'vat_basis' => (string) $pl['vat']];
$fmtRate = static fn(mixed $v): string => is_string($s = dec_parse((string) $v, 4)) ? dec_fmt($s, 4, 4, true, false) : '';
foreach (QUOTE_PROFILES as $key => $P) {
    foreach ($P['thicknesses'] as $t) {
        $show[pricelist_field($key, $t)] = $fmtRate($pl['sheet'][$key . '|' . $t]['rate_per_m2'] ?? null);
    }
    $f = $pl['felt'][$key] ?? [];
    $show['felt_' . $key . '_rate'] = $fmtRate($f['rate'] ?? null);
    $show['felt_' . $key . '_unit'] = (string) ($f['unit'] ?? '');
    $w = dec_parse((string) ($f['width_mm'] ?? ''), 1);
    $show['felt_' . $key . '_width'] = is_string($w) ? dec_fmt($w, 1, 1, true, false) : '';
}
admin_render('pricelist-form', ['ready' => true, 'pl' => $pl, 'show' => $show, 'errors' => [], 'gaps' => pricelist_gaps($pl)], 'Cenovnik', 'cenovnik');
