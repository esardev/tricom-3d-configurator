<?php
/* TRICOM — modul „Kontakt“ (admin/index.php?m=kontakt): jedna forma za kontakt
   podatke koje sajt već prikazuje — e-pošta, Facebook, radno vreme, lokacije
   (adresa, telefoni, e-pošta, mapa), podaci o firmi i uvod odeljka „Lokacije“.
   Isti podaci se ispisuju na strani kontakt.html i u zaglavlju, mobilnom meniju
   i futeru svih PHP strana. Lokacije su postojeće dve (Prodaja, Direkcija);
   forma ih menja, ne dodaje i ne briše. Sve se čuva kao običan tekst. */
defined('TRICOM') || exit;

require_once APP_DIR . '/admin/catalog-admin.php';
require_once APP_DIR . '/lib/hours.php';

const KONTAKT_PHONE_ROWS = 2;   // prazni redovi za nove telefone po lokaciji
/** Dozvoljeni hostovi Facebook adrese. */
const KONTAKT_FB_HOSTS = ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.com', 'www.fb.com'];

$action = is_string($_GET['a'] ?? null) ? $_GET['a'] : '';
$self = static fn(array $q = []): string => admin_url('', ['m' => 'kontakt'] + $q);

/** Tekstualna polja podešavanja: [kolona => [oznaka, najviše znakova]]; *_sr/_en su prevodi. */
const KONTAKT_SETTINGS = [
    'footer_email' => ['E-pošta (zaglavlje, futer, adresa forme upita)', 190],
    'facebook_url' => ['Facebook adresa', 255], 'facebook_label' => ['Facebook — tekst veze', 255],
    'company_name' => ['Naziv firme', 255], 'company_legal_name' => ['Pun naziv', 500],
    'pib' => ['PIB', 20], 'registration_no' => ['Matični broj', 20], 'activity_code' => ['Šifra delatnosti', 10],
    'bank_name' => ['Banka', 120], 'bank_account' => ['Tekući račun', 60], 'director' => ['Direktor', 120],
];
const KONTAKT_SETTINGS_I18N = [
    'vat' => ['PDV — tekst', 255], 'activity' => ['Delatnost', 255],
    'founded' => ['Osnovano', 255], 'locations_heading' => ['Naslov odeljka „Lokacije“', 255], 'locations_intro' => ['Uvod odeljka „Lokacije“', 2000],
];
const KONTAKT_LOC = ['street' => ['Ulica i broj', 120], 'postal_code' => ['Poštanski broj', 10], 'place' => ['Mesto', 60], 'map_query' => ['Mapa — koordinate ili adresa', 255]];
const KONTAKT_LOC_I18N = ['title' => ['Naslov bloka', 120], 'short_name' => ['Kratak naziv (futer, mapa)', 60], 'city' => ['Grad', 60],
    'purpose' => ['Namena („Za“)', 255], 'map_title' => ['Naslov mape (pristupačnost)', 255]];

function kontakt_load(): array
{
    $s = db_one('SELECT * FROM `contact_settings` WHERE `id` = 1') ?? [];
    $locs = db_all('SELECT * FROM `contact_locations` ORDER BY `sort_order`, `id`');
    foreach ($locs as &$l) {
        $l['phones'] = db_all('SELECT * FROM `contact_phones` WHERE `location_id` = ? ORDER BY `sort_order`, `id`', [(int) $l['id']]);
    }
    unset($l);
    return [$s, $locs];
}

function kontakt_input(array $s, array $locs): array
{
    foreach (KONTAKT_SETTINGS as $k => $x) {
        $s[$k] = input_str($_POST, $k);
    }
    foreach (KONTAKT_SETTINGS_I18N as $k => $x) {
        foreach (LANGS as $l) {
            $s[$k . '_' . $l] = input_str($_POST, $k . '_' . $l, $k === 'locations_intro');
        }
    }
    /* radno vreme: ceo sat; subota/nedelja prazno = ne radi (tekst na sajtu se pravi iz sati, app/lib/hours.php) */
    foreach (HOURS_GROUPS as [$o, $c]) {
        $s[$o] = input_int($_POST, $o);
        $s[$c] = input_int($_POST, $c);
    }
    $raw = is_array($_POST['loc'] ?? null) ? $_POST['loc'] : [];
    foreach ($locs as &$loc) {
        $r = is_array($raw[$loc['id']] ?? null) ? $raw[$loc['id']] : [];
        foreach (KONTAKT_LOC as $k => $x) {
            $loc[$k] = input_str($r, $k);
        }
        foreach (KONTAKT_LOC_I18N as $k => $x) {
            foreach (LANGS as $l) {
                $loc[$k . '_' . $l] = input_str($r, $k . '_' . $l);
            }
        }
        $loc['emails'] = input_str($r, 'emails', true);
        $loc['sort_order'] = input_int($r, 'sort_order') ?? 0;
        $loc['is_public'] = input_bool($r, 'is_public') ? 1 : 0;
        $phones = [];
        foreach (is_array($r['phones'] ?? null) ? $r['phones'] : [] as $p) {
            if (!is_array($p) || input_bool($p, 'delete')) {
                continue;
            }
            $row = ['tel' => preg_replace('/[\s()\/-]/', '', input_str($p, 'tel')) ?? '', 'display_sr' => input_str($p, 'display_sr'), 'display_en' => input_str($p, 'display_en'),
                'in_footer' => input_bool($p, 'in_footer') ? 1 : 0, 'in_quote' => input_bool($p, 'in_quote') ? 1 : 0, 'sort_order' => input_int($p, 'sort_order') ?? 0];
            if ($row['tel'] !== '' || $row['display_sr'] !== '' || $row['display_en'] !== '') {
                $phones[] = $row;
            }
        }
        usort($phones, static fn($a, $b) => $a['sort_order'] <=> $b['sort_order']);
        $loc['phones'] = $phones;
    }
    unset($loc);
    return [$s, $locs];
}

function kontakt_validate(array $s, array $locs): array
{
    $val = new Validator();
    foreach (KONTAKT_SETTINGS as $k => [$label, $max]) {
        $val->maxLength($k, $s[$k], $max, $label);
    }
    foreach (KONTAKT_SETTINGS_I18N as $k => [$label, $max]) {
        foreach (LANGS as $l) {
            $val->maxLength($k . '_' . $l, $s[$k . '_' . $l], $max, $label . ' — ' . strtoupper($l));
        }
    }
    $val->required('footer_email', $s['footer_email'], KONTAKT_SETTINGS['footer_email'][0])->email('footer_email', $s['footer_email'], 'E-pošta');
    if ($s['facebook_url'] !== '') {
        $p = parse_url($s['facebook_url']);
        if (!is_array($p) || ($p['scheme'] ?? '') !== 'https' || !in_array(strtolower($p['host'] ?? ''), KONTAKT_FB_HOSTS, true) || isset($p['user']) || preg_match('/[\s"<>]/', $s['facebook_url'])) {
            $val->add('facebook_url', 'Facebook adresa mora početi sa https://www.facebook.com/ (ili prazno = bez veze).');
        }
    }
    if (!db_column_exists('contact_locations', 'is_public') || !db_column_exists('contact_phones', 'in_quote')) {
        $val->add('footer_email', 'Baza još nema polja „prikaz lokacije“ i „telefon u bloku ponude“ — u phpMyAdmin-u uvezite database/patches/006-navigation-contact.sql.');
    }
    if ($locs && !array_filter($locs, static fn($l) => $l['is_public'] === 1)) {
        $val->add('loc[' . (int) $locs[0]['id'] . '][is_public]', 'Bar jedna lokacija mora da se prikazuje kupcima (od nje su telefon i adresa u zaglavlju).');
    }
    if (!db_column_exists('contact_settings', 'sat_open_hour')) {
        $val->add('sat_open_hour', 'Baza još nema polja za subotu i nedelju — u phpMyAdmin-u uvezite database/patches/005-opening-hours.sql.');
    }
    foreach (['week' => 'Ponedeljak–petak', 'sat' => 'Subota', 'sun' => 'Nedelja'] as $g => $day) {
        [$o, $c] = HOURS_GROUPS[$g];
        foreach ([$o, $c] as $k) {
            if ($s[$k] === null && trim((string) ($_POST[$k] ?? '')) !== '') {
                $val->add($k, $day . ': sat mora biti ceo broj.');
            }
        }
        if ($g !== 'week' && ($s[$o] === null) !== ($s[$c] === null)) {
            $val->add($s[$o] === null ? $o : $c, $day . ': upišite i sat otvaranja i sat zatvaranja, ili ostavite oba prazna (ne radi).');
            continue;
        }
        if ($g === 'week' || $s[$o] !== null) {
            $val->intRange($o, $s[$o], 0, 23, $day . ' — otvara se')->intRange($c, $s[$c], 1, 24, $day . ' — zatvara se');
            if ($s[$o] !== null && $s[$c] !== null && $s[$c] <= $s[$o]) {
                $val->add($c, $day . ': sat zatvaranja mora biti posle sata otvaranja.');
            }
        }
    }
    foreach (['pib' => 'PIB', 'registration_no' => 'Matični broj', 'activity_code' => 'Šifra delatnosti'] as $k => $label) {
        if ($s[$k] !== '' && !ctype_digit($s[$k])) {
            $val->add($k, $label . ': samo cifre.');
        }
    }

    $phonesTotal = 0;
    foreach ($locs as $loc) {
        $id = (int) $loc['id'];
        $name = $loc['title_sr'] !== '' ? $loc['title_sr'] : $loc['slug'];
        $f = static fn(string $k): string => 'loc[' . $id . '][' . $k . ']';   // isto kao ime polja u formi
        $val->required($f('title_sr'), $loc['title_sr'], $name . ': naslov — SR')->required($f('street'), $loc['street'], $name . ': ulica i broj');
        foreach (KONTAKT_LOC as $k => [$label, $max]) {
            $val->maxLength($f($k), $loc[$k], $max, $name . ': ' . $label);
        }
        foreach (KONTAKT_LOC_I18N as $k => [$label, $max]) {
            foreach (LANGS as $l) {
                $val->maxLength($f($k . '_' . $l), $loc[$k . '_' . $l], $max, $name . ': ' . $label . ' — ' . strtoupper($l));
            }
        }
        foreach (text_lines($loc['emails']) as $m) {
            if (!filter_var($m, FILTER_VALIDATE_EMAIL)) {
                $val->add($f('emails'), $name . ': neispravna e-pošta „' . $m . '“.');
            }
        }
        /* mapa: koordinate (44.89779,20.27798) ili adresa — samo slova, brojevi i osnovni znakovi */
        if ($loc['map_query'] !== '' && !preg_match('/^-?\d{1,2}(\.\d+)?,\s?-?\d{1,3}(\.\d+)?$/', $loc['map_query']) && !preg_match('/^[\p{L}\p{N} .,\/#()\'–-]+$/u', $loc['map_query'])) {
            $val->add($f('map_query'), $name . ': mapa — upišite koordinate (npr. 44.89779,20.27798) ili adresu, bez posebnih znakova.');
        }
        $val->intRange($f('sort_order'), $loc['sort_order'], -100000, 100000, $name . ': redosled');
        foreach ($loc['phones'] as $n => $p) {
            $row = $name . ', telefon ' . ($n + 1);
            if (!preg_match('/^\+[1-9]\d{6,14}$/', $p['tel'])) {
                $val->add($f('phones'), $row . ': broj za poziv u obliku +381638503000.');
            }
            if (!preg_match('/^[0-9 +()\/-]{3,40}$/', $p['display_sr']) || ($p['display_en'] !== '' && !preg_match('/^[0-9 +()\/-]{3,40}$/', $p['display_en']))) {
                $val->add($f('phones'), $row . ': ispis broja sme da sadrži samo cifre, razmake i + ( ) / - (do 40 znakova).');
            }
        }
        $phonesTotal += count($loc['phones']);
    }
    if ($locs && $phonesTotal === 0) {
        $val->add('loc[' . (int) $locs[0]['id'] . '][phones]', 'Upišite bar jedan telefon (prvi telefon prve lokacije je u zaglavlju i futeru).');
    }
    return $val->errors();
}

/* ---------------------------------------------------------------- POST: čuvanje */
if ($action === 'save' && is_post()) {
    csrf_require();
    [$old, $oldLocs] = kontakt_load();
    [$s, $locs] = kontakt_input($old, $oldLocs);
    $errors = kontakt_validate($s, $locs);

    /* PDV dokumenti (slika ili PDF), tek kad je ostatak forme ispravan */
    $new = [];
    if (!$errors) {
        foreach (['vat_certificate_path' => 'vat_certificate_file', 'vat_record_path' => 'vat_record_file'] as $col => $field) {
            if (upload_present($field)) {
                try {
                    $up = upload_receive($field, 'contact', 'document');
                    $new[] = $s[$col] = $up['path'];
                } catch (UploadException $ex) {
                    $errors[$field] = $ex->getMessage();
                }
            }
        }
        if ($errors) {
            foreach ($new as $p) {
                upload_delete($p);
            }
        }
    }
    if ($errors) {
        admin_render('contact-form', ['s' => $s, 'locs' => $locs, 'errors' => $errors], 'Kontakt', 'kontakt');
    }

    $data = ['open_hour' => (int) $s['open_hour'], 'close_hour' => (int) $s['close_hour'],
        'sat_open_hour' => $s['sat_open_hour'], 'sat_close_hour' => $s['sat_close_hour'],
        'sun_open_hour' => $s['sun_open_hour'], 'sun_close_hour' => $s['sun_close_hour'],
        /* tekst u bazi prati sate (sajt ga ionako pravi iz sati) — nema dva različita rasporeda */
        'hours_sr' => hours_text($s, 'sr'), 'hours_en' => hours_text($s, 'en'),
        'vat_certificate_path' => $s['vat_certificate_path'] ?? null, 'vat_record_path' => $s['vat_record_path'] ?? null];
    foreach (KONTAKT_SETTINGS as $k => $x) {
        $data[$k] = $s[$k];
    }
    foreach (KONTAKT_SETTINGS_I18N as $k => $x) {
        foreach (LANGS as $l) {
            $data[$k . '_' . $l] = $k === 'locations_intro' && $s[$k . '_' . $l] === '' ? null : $s[$k . '_' . $l];
        }
    }
    try {
        db_transaction(static function () use ($old, $data, $locs): void {
            if ($old) {
                db_update('contact_settings', $data, '`id` = 1');
            } else {
                db_insert('contact_settings', $data + ['id' => 1]);
            }
            foreach ($locs as $loc) {
                $row = ['emails' => $loc['emails'] === '' ? null : $loc['emails'], 'sort_order' => $loc['sort_order'], 'is_public' => $loc['is_public']];
                foreach (array_keys(KONTAKT_LOC) as $k) {
                    $row[$k] = $loc[$k];
                }
                foreach (array_keys(KONTAKT_LOC_I18N) as $k) {
                    foreach (LANGS as $l) {
                        $row[$k . '_' . $l] = $loc[$k . '_' . $l];
                    }
                }
                db_update('contact_locations', $row, '`id` = ?', [(int) $loc['id']]);
                db_run('DELETE FROM `contact_phones` WHERE `location_id` = ?', [(int) $loc['id']]);
                foreach (array_values($loc['phones']) as $n => $p) {
                    db_insert('contact_phones', ['location_id' => (int) $loc['id'], 'tel' => $p['tel'], 'display_sr' => $p['display_sr'], 'display_en' => $p['display_en'],
                        'in_footer' => $p['in_footer'], 'in_quote' => $p['in_quote'], 'sort_order' => ($n + 1) * 10]);
                }
            }
        });
    } catch (Throwable $ex) {
        foreach ($new as $p) {
            upload_delete($p);
        }
        throw $ex;
    }
    adm_cleanup_files([$old['vat_certificate_path'] ?? null, $old['vat_record_path'] ?? null]);   // zamenjeni otpremljeni dokumenti
    flash('success', 'Kontakt podaci su sačuvani. Vide se odmah na svim stranama.');
    redirect($self());
}

[$s, $locs] = kontakt_load();
admin_render('contact-form', ['s' => $s, 'locs' => $locs, 'errors' => []], 'Kontakt', 'kontakt');
