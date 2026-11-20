<?php
/* TRICOM — zajedničko za module „Kategorije proizvoda“, „Proizvodi“, „Usluge“
   i „Reference“: izbori postojećih medija i ikona, provera da li je otpremljen
   fajl još u upotrebi, čišćenje veza posle brisanja, zajednička polja sadržaja
   proizvoda i usluga. */
defined('TRICOM') || exit;

require_once APP_DIR . '/site/site.php';
require_once APP_DIR . '/admin/form.php';

/** Kalkulatori iz js/catalog.js (kalkulatori.html#<id>). */
const ADM_CALCS = ['' => '— bez kalkulatora —', 'tr10' => 'Trapez 10 (tr10)', 'tr20' => 'Trapez 20 (tr20)', 'tr35' => 'Trapez 35 (tr35)', 'tr40' => 'Trapez 40 (tr40)', 'crep' => 'Imitacija crepa (crep)'];
const ADM_CALC_TABS = ['' => '— podrazumevano —', 'trapez' => 'trapez — sva četiri trapezna profila', 'none' => 'none — samo izabrani kalkulator'];

/** Najviše nivoa kategorija: grupa (tab) → program → podgrupa. */
const ADM_CAT_LEVELS = 3;

/**
 * Kategorije u redosledu stabla (grupa, pa njeni programi i njihove podgrupe).
 * Svaki red dobija 'depth' (0 = grupa) i 'path' (SR nazivi: „Limovi › Bakar › Bakar u koturu“).
 * Bez zakrpe 007 (nema parent_id) sve su grupe. $rows = redovi tabele categories (podrazumevano svi).
 */
function adm_category_tree(?array $rows = null): array
{
    $rows ??= db_all('SELECT * FROM `categories` ORDER BY `sort_order`, `id`');
    $by = [];
    foreach ($rows as $r) {
        $by[(int) ($r['parent_id'] ?? 0)][] = $r;
    }
    $out = [];
    $walk = static function (int $pid, int $depth, string $path) use (&$walk, &$out, $by): void {
        foreach ($by[$pid] ?? [] as $r) {
            $p = ($path !== '' ? $path . ' › ' : '') . $r['name_sr'];
            $out[] = $r + ['depth' => $depth, 'path' => $p];
            if ($depth < ADM_CAT_LEVELS) {   // zaštita od petlje u podacima
                $walk((int) $r['id'], $depth + 1, $p);
            }
        }
    };
    $walk(0, 0, '');
    return $out;
}

/** Da li baza ima hijerarhiju kategorija (zakrpa 007). */
function adm_has_cat_tree(): bool
{
    static $has = null;
    return $has ??= db_column_exists('categories', 'parent_id');
}

/** Postojeći renderi: ključ => ključ (assets/render/<ključ>-light.jpg). */
function adm_render_keys(): array
{
    $keys = [];
    foreach (glob(SITE_DIR . '/assets/render/*-light.jpg') ?: [] as $f) {
        if (preg_match('/^([a-z0-9-]+)-light\.jpg$/', basename($f), $m) && !str_starts_with($m[1], 'bg-')) {
            $keys[$m[1]] = $m[1];
        }
    }
    ksort($keys);
    return $keys;
}

/** SVG ilustracije iz postojećeg sajta (pouzdan izvor; nove SVG se ne otpremaju). */
function adm_illu_keys(): array
{
    $keys = array_keys(catalog_static()['illu']);
    return array_combine($keys, $keys) ?: [];
}

/** Postojeći fabrički crteži (assets/old/tr/, bez responzivnih varijanti). */
function adm_drawing_files(): array
{
    $out = [];
    foreach (glob(SITE_DIR . '/assets/old/tr/*.{jpg,jpeg,png,webp}', GLOB_BRACE) ?: [] as $f) {
        $b = basename($f);
        if (!preg_match('/-\d+w\.webp$/', $b)) {
            $out['assets/old/tr/' . $b] = $b;
        }
    }
    ksort($out);
    return $out;
}

/** Kolone u kojima se čuvaju putanje fajlova (za proveru pre brisanja). */
function adm_file_columns(): array
{
    return [
        ['products', 'photo_path'], ['products', 'drawing_path'], ['product_categories', 'card_photo_path'],
        ['services', 'photo_path'], ['services', 'drawing_path'], ['client_references', 'photo_path'],
        ['gallery_images', 'photo_path'], ['contact_settings', 'vat_certificate_path'], ['contact_settings', 'vat_record_path'],
    ];
}

/** Koliko zapisa koristi putanju (posle izmene/brisanja). */
function adm_file_use_count(string $path): int
{
    $n = 0;
    foreach (adm_file_columns() as [$table, $col]) {
        if (db_table_exists($table)) {
            $n += (int) db_value('SELECT COUNT(*) FROM ' . db_ident($table) . ' WHERE ' . db_ident($col) . ' = ?', [$path]);
        }
    }
    return $n;
}

/**
 * Briše otpremljene fajlove koje više nijedan zapis ne koristi.
 * Fajlovi van uploads/ (postojeći assets/) se nikad ne brišu.
 */
function adm_cleanup_files(array $paths): void
{
    foreach (array_unique(array_filter($paths)) as $path) {
        if (str_starts_with((string) $path, 'uploads/') && adm_file_use_count((string) $path) === 0) {
            upload_delete((string) $path);
        }
    }
}

/** Uklanja slug iz „Srodno“ svih proizvoda i usluga (posle brisanja stavke). */
function adm_remove_related_slug(string $slug): int
{
    $changed = 0;
    foreach (['products', 'services'] as $table) {
        $rows = db_all('SELECT `id`, `related_slugs` FROM ' . db_ident($table) . ' WHERE FIND_IN_SET(?, `related_slugs`) > 0', [$slug]);
        foreach ($rows as $r) {
            $list = array_values(array_filter(explode(',', (string) $r['related_slugs']), static fn($s) => trim($s) !== '' && trim($s) !== $slug));
            db_run('UPDATE ' . db_ident($table) . ' SET `related_slugs` = ? WHERE `id` = ?', [$list ? implode(',', $list) : null, (int) $r['id']]);
            $changed++;
        }
    }
    return $changed;
}

/**
 * Mesta gde kartica sa ovim slugom stoji kao statičan tekst strane (nije iz baze):
 * stalni delovi PHP pogleda (npr. kartice mašina u odeljcima usluga, niz profila u tabu Krov).
 * Takva pločica se prikazuje samo dok je stavka aktivna (site_item_on).
 */
function adm_static_mentions(string $slug): array
{
    $pages = ['app/views/site/pages/home-sr.php' => 'Početna (index.html)', 'app/views/site/services/page-sr.php' => 'Usluge — odeljci sa karticama (usluge.html)',
        'app/views/site/pages/plasma-sr.php' => 'CNC plazma (plazma.html)', 'app/views/site/products/panel-sr-krov.php' => 'Proizvodi — tab Krov, niz profila (proizvodi.html?grupa=krov#prog)'];
    $out = [];
    foreach ($pages as $file => $label) {
        $h = @file_get_contents(SITE_DIR . '/' . $file);
        if (is_string($h) && str_contains($h, 'data-item="' . $slug . '"')) {
            $out[] = $label;
        }
    }
    return $out;
}

/** Da li slug već postoji u zajedničkom imenskom prostoru stranica detalja i modala (data-item, #item=). */
function adm_slug_taken(string $slug): bool
{
    foreach (['products', 'services', 'client_references', 'gallery_images'] as $table) {
        if ((int) db_value('SELECT COUNT(*) FROM ' . db_ident($table) . ' WHERE `slug` = ?', [$slug]) > 0) {
            return true;
        }
    }
    foreach (catalog_static()['groups'] as $g) {
        if (($g['slug'] ?? '') === $slug) {
            return true;
        }
    }
    /* stavke koje još žive samo u js/items.js (info, galerija); vrste iz baze se ne računaju */
    $js = (string) @file_get_contents(SITE_DIR . '/js/items.js');
    preg_match_all('/slug:\s*\'([a-z0-9-]+)\',\s*kind:\s*\'([a-z]+)\'|"slug":"([a-z0-9-]+)","kind":"([a-z]+)"/', $js, $m, PREG_SET_ORDER);
    foreach ($m as $x) {
        $s = $x[1] !== '' ? $x[1] : ($x[3] ?? '');
        $k = $x[1] !== '' ? $x[2] : ($x[4] ?? '');
        if ($s === $slug && !in_array($k, SITE_DB_KINDS, true)) {
            return true;
        }
    }
    return false;
}

/** Pregled slike u administraciji (render/ilustracija/fotografija). */
function adm_image_preview(string $type, ?string $render, ?string $illu, ?string $photo): string
{
    if ($type === 'render' && site_render_exists($render)) {
        $src = is_file(SITE_DIR . '/' . render_path((string) $render, 'light', 'webp')) ? render_path((string) $render, 'light', 'webp') : render_path((string) $render, 'light', 'jpg');
        return '<img class="adm-thumb" src="' . e(url($src)) . '" alt="" loading="lazy">';
    }
    if ($type === 'illu' && site_illu($illu) !== '') {
        return '<span class="adm-thumb adm-thumb--illu" aria-hidden="true">' . site_illu($illu) . '</span>';
    }
    if ($type === 'photo' && (string) $photo !== '') {
        /* najmanja responzivna varijanta (-<N>w.webp), ako postoji — lista sa mnogo fotografija */
        $variants = site_variants(preg_replace('/\.(jpe?g|png|webp)$/i', '', (string) $photo) ?? (string) $photo);
        return '<img class="adm-thumb" src="' . e(media_url($variants ? $variants[0][1] : (string) $photo)) . '" alt="" loading="lazy">';
    }
    return '<span class="adm-thumb adm-thumb--none">bez slike</span>';
}

/** Javna adresa strane detalja (proizvod, usluga ili mogućnost plazme). */
function adm_product_public_url(string $slug, string $lang = 'sr'): string
{
    return url(($lang === 'en' ? 'en/details/' : 'detalji/') . $slug . '.html');
}

/* ================================================================ zajednički sadržaj proizvoda i usluga
   Proizvodi i usluge imaju iste kolone sadržaja (naziv, sažetak, opis, oznake,
   primena, slika, crtež, kalkulator, srodno) i iste redove tehničkih podataka;
   moduli dodaju samo svoja polja (kategorija i tabovi / vrsta i ikona). */

const ADM_TEXT_LIMITS = ['title' => 255, 'summary' => 1000, 'description' => 10000, 'tags' => 2000, 'apps' => 2000, 'image_alt' => 255];
const ADM_TEXT_LABELS = ['title' => 'Naziv', 'summary' => 'Sažetak', 'description' => 'Opis', 'tags' => 'Oznake', 'apps' => 'Primena', 'image_alt' => 'Opis slike (alt)'];
const ADM_MAX_SPECS = 100;

/** Tabela tehničkih podataka i strani ključ: product | service. */
function adm_spec_table(string $owner): array
{
    return $owner === 'service' ? ['service_specs', 'service_id'] : ['product_specs', 'product_id'];
}

function adm_specs_of(string $owner, int $id): array
{
    [$table, $fk] = adm_spec_table($owner);
    return db_all('SELECT `label_sr`, `value_sr`, `label_en`, `value_en` FROM ' . db_ident($table) . ' WHERE ' . db_ident($fk) . ' = ? ORDER BY `sort_order`, `id`', [$id]);
}

/** Zajednička polja sadržaja iz POST-a ($existing: slug i postojeća fotografija ostaju). */
function adm_content_input(?array $existing): array
{
    $v = ['id' => $existing['id'] ?? null];
    $v['slug'] = $existing ? $existing['slug'] : mb_strtolower(input_str($_POST, 'slug'), 'UTF-8');
    foreach (['title', 'image_alt'] as $f) {
        foreach (LANGS as $l) {
            $v[$f . '_' . $l] = input_str($_POST, $f . '_' . $l);
        }
    }
    foreach (['summary', 'description', 'tags', 'apps'] as $f) {
        foreach (LANGS as $l) {
            $v[$f . '_' . $l] = input_str($_POST, $f . '_' . $l, true);
        }
    }
    if (!$existing && $v['slug'] === '' && $v['title_sr'] !== '') {
        $v['slug'] = slugify($v['title_sr']);
    }
    $v['sort_order'] = input_int($_POST, 'sort_order') ?? 0;
    $v['is_active'] = input_bool($_POST, 'is_active') ? 1 : 0;
    $v['image_type'] = input_str($_POST, 'image_type');
    $v['render_key'] = input_str($_POST, 'render_key');
    $v['illu_key'] = input_str($_POST, 'illu_key');
    $v['photo_path'] = $existing['photo_path'] ?? null;
    $v['photo_width'] = $existing['photo_width'] ?? null;
    $v['photo_height'] = $existing['photo_height'] ?? null;
    $v['drawing_path'] = input_str($_POST, 'drawing_path');
    $v['calc_id'] = input_str($_POST, 'calc_id');
    $v['calc_tabs'] = input_str($_POST, 'calc_tabs');
    $v['konf_hash'] = ltrim(input_str($_POST, 'konf_hash'), '#');
    $v['related'] = input_str($_POST, 'related', true);
    return $v;
}

/** Redovi tehničkih podataka iz POST-a, po redosledu; potpuno prazni se izostavljaju. */
function adm_specs_input(): array
{
    $rows = [];
    $raw = is_array($_POST['specs'] ?? null) ? $_POST['specs'] : [];
    $i = 0;
    foreach ($raw as $r) {
        if (!is_array($r) || input_bool($r, 'delete')) {
            continue;
        }
        $row = ['label_sr' => input_str($r, 'label_sr'), 'value_sr' => input_str($r, 'value_sr', true),
                'label_en' => input_str($r, 'label_en'), 'value_en' => input_str($r, 'value_en', true)];
        if (implode('', $row) === '') {
            continue;
        }
        $row['_order'] = input_int($r, 'order') ?? 0;
        $row['_i'] = $i++;
        $rows[] = $row;
    }
    usort($rows, static fn($a, $b) => [$a['_order'], $a['_i']] <=> [$b['_order'], $b['_i']]);
    return array_slice($rows, 0, ADM_MAX_SPECS + 1);
}

/** Provera zajedničkih polja; $self = „Proizvod“ / „Usluga“ (poruke). */
function adm_content_validate(Validator $val, array $v, array $specs, ?array $existing, string $self): void
{
    if (!$existing) {
        $val->required('slug', $v['slug'], 'Slug')->slug('slug', $v['slug'], 'Slug');
        if (is_valid_slug($v['slug']) && adm_slug_taken($v['slug'])) {
            $val->add('slug', 'Taj slug već koristi drugi proizvod, usluga, referenca ili stavka sajta.');
        }
    }
    $val->required('title_sr', $v['title_sr'], 'Naziv — SR');
    foreach (ADM_TEXT_LIMITS as $f => $max) {
        foreach (LANGS as $l) {
            $val->maxLength($f . '_' . $l, $v[$f . '_' . $l], $max, ADM_TEXT_LABELS[$f] . ' — ' . strtoupper($l));
        }
    }
    $val->intRange('sort_order', $v['sort_order'], -100000, 100000, 'Redosled');

    $val->in('image_type', $v['image_type'], ['render', 'illu', 'photo', 'none'], 'Vrsta slike');
    if ($v['image_type'] === 'render' && !isset(adm_render_keys()[$v['render_key']])) {
        $val->add('render_key', 'Izaberite postojeći render.');
    }
    if ($v['image_type'] === 'illu' && !isset(adm_illu_keys()[$v['illu_key']])) {
        $val->add('illu_key', 'Izaberite postojeću ilustraciju.');
    }
    if ($v['image_type'] === 'photo' && (string) $v['photo_path'] === '' && !upload_present('photo_file')) {
        $val->add('photo_file', 'Za vrstu „Fotografija“ izaberite fajl.');
    }
    if ($v['drawing_path'] !== '') {
        $val->sitePath('drawing_path', $v['drawing_path'], 'Fabrički crtež');
        if (!is_file(SITE_DIR . '/' . $v['drawing_path'])) {
            $val->add('drawing_path', 'Izabrani crtež ne postoji na serveru.');
        }
    }
    $val->in('calc_id', $v['calc_id'], array_map('strval', array_keys(ADM_CALCS)), 'Kalkulator');
    $val->in('calc_tabs', $v['calc_tabs'], array_map('strval', array_keys(ADM_CALC_TABS)), 'Tabovi kalkulatora');
    if ($v['konf_hash'] !== '' && !preg_match('/^[A-Za-z0-9=&_.,;:%-]{1,255}$/', $v['konf_hash'])) {
        $val->add('konf_hash', 'Heš konfiguratora sme da sadrži samo slova, brojeve i = & _ . , ; : - (npr. o=dvovodni&p=tr35).');
    }

    $known = catalog_known_slugs();
    foreach (text_lines($v['related']) as $slug) {
        if ($slug === $v['slug']) {
            $val->add('related', $self . ' ne može biti srodan sam sebi.');
        } elseif (!isset($known[$slug])) {
            $val->add('related', 'Nepoznat slug u „Srodno“: ' . $slug);
        }
    }

    if (count($specs) > ADM_MAX_SPECS) {
        $val->add('specs', 'Najviše ' . ADM_MAX_SPECS . ' redova tehničkih podataka.');
    }
    foreach ($specs as $n => $s) {
        $row = 'Tehnički podaci, red ' . ($n + 1);
        if ($s['label_sr'] === '') {
            $val->add('specs', $row . ': oznaka (SR) je obavezna.');
        }
        foreach (['label_sr' => 255, 'label_en' => 255, 'value_sr' => 1000, 'value_en' => 1000] as $k => $max) {
            if (mb_strlen($s[$k], 'UTF-8') > $max) {
                $val->add('specs', $row . ': polje je duže od ' . $max . ' znakova.');
            }
        }
    }
}

/**
 * Otpremanje fotografije i crteža (tek kad je ostatak forme ispravan).
 * Upisuje nove putanje u $v; greška ide u $errors. Vraća nove fajlove (za brisanje ako čuvanje ne uspe).
 */
function adm_content_uploads(array &$v, array &$errors, string $dir): array
{
    $new = [];
    $field = '';
    try {
        if ($v['image_type'] === 'photo' && upload_present('photo_file')) {
            $field = 'photo_file';
            $up = upload_receive('photo_file', $dir, 'image');
            $new[] = $up['path'];
            [$v['photo_path'], $v['photo_width'], $v['photo_height']] = [$up['path'], $up['width'], $up['height']];
        }
        if (upload_present('drawing_file')) {
            $field = 'drawing_file';
            $up = upload_receive('drawing_file', $dir . '/drawings', 'image');
            $new[] = $up['path'];
            $v['drawing_path'] = $up['path'];
        }
    } catch (UploadException $ex) {
        foreach ($new as $p) {
            upload_delete($p);
        }
        $new = [];
        $errors[$field] = $ex->getMessage();
    }
    return $new;
}

/** Kolone sadržaja za upis u bazu (products / services). */
function adm_content_data(array $v): array
{
    $nullable = static fn($s) => $s === '' ? null : $s;
    $photo = $v['image_type'] === 'photo';
    $data = [
        'sort_order' => $v['sort_order'], 'is_active' => $v['is_active'], 'image_type' => $v['image_type'],
        'render_key' => $v['image_type'] === 'render' ? $v['render_key'] : null,
        'illu_key' => $v['image_type'] === 'illu' ? $v['illu_key'] : null,
        'photo_path' => $photo ? $v['photo_path'] : null, 'photo_width' => $photo ? $v['photo_width'] : null, 'photo_height' => $photo ? $v['photo_height'] : null,
        'drawing_path' => $nullable($v['drawing_path']), 'calc_id' => $nullable($v['calc_id']), 'calc_tabs' => $nullable($v['calc_tabs']),
        'konf_hash' => $nullable($v['konf_hash']), 'related_slugs' => $nullable(implode(',', array_unique(text_lines($v['related'])))),
    ];
    foreach (LANGS as $l) {
        $data['title_' . $l] = $v['title_' . $l];
        foreach (['summary', 'description', 'tags', 'apps', 'image_alt'] as $f) {
            $data[$f . '_' . $l] = $nullable($v[$f . '_' . $l]);
        }
    }
    return $data;
}

/** Zamenjuje redove tehničkih podataka (u transakciji pozivaoca). */
function adm_save_specs(string $owner, int $id, array $specs): void
{
    [$table, $fk] = adm_spec_table($owner);
    db_run('DELETE FROM ' . db_ident($table) . ' WHERE ' . db_ident($fk) . ' = ?', [$id]);
    foreach (array_values($specs) as $n => $s) {
        db_insert($table, [$fk => $id, 'sort_order' => ($n + 1) * 10,
            'label_sr' => $s['label_sr'], 'value_sr' => $s['value_sr'], 'label_en' => $s['label_en'], 'value_en' => $s['value_en']]);
    }
}

/** Postojeći crteži za izbor, uz trenutni otpremljeni (ako nije među njima). */
function adm_drawing_choices(?string $current): array
{
    $drawings = adm_drawing_files();
    if ((string) $current !== '' && !isset($drawings[$current])) {
        $drawings = [$current => basename((string) $current) . ' (otpremljen)'] + $drawings;
    }
    return $drawings;
}

/** Proizvodi i usluge čiji „Srodno“ sadrži slug (za potvrdu brisanja), bez same stavke. */
function adm_related_mentions(string $slug, string $exceptTable, int $exceptId): array
{
    $out = [];
    foreach (['products' => 'proizvod', 'services' => 'usluga'] as $table => $kind) {
        foreach (db_all('SELECT `id`, `title_sr` FROM ' . db_ident($table) . ' WHERE FIND_IN_SET(?, `related_slugs`) > 0', [$slug]) as $r) {
            if (!($table === $exceptTable && (int) $r['id'] === $exceptId)) {
                $out[] = ['title_sr' => $r['title_sr'], 'kind' => $kind];
            }
        }
    }
    return $out;
}

/** Izbor ikone: radio dugmad sa pregledom pouzdanih SVG ikona sa sajta ($set = service | reference). */
function adm_icon_picker(string $set, ?string $current, array $errors, string $hint): string
{
    $h = '<div class="adm-field" id="f-icon_key"><span>Ikona</span><div class="adm-icons" role="radiogroup" aria-label="Ikona">'
        . '<label class="adm-iconopt"><input type="radio" name="icon_key" value=""' . ((string) $current === '' ? ' checked' : '') . '> <span>bez ikone</span></label>';
    foreach (catalog_icons()[$set] as $key => $svg) {
        $h .= '<label class="adm-iconopt" title="' . e((string) $key) . '"><input type="radio" name="icon_key" value="' . e((string) $key) . '"' . ((string) $current === (string) $key ? ' checked' : '')
            . '> <span class="adm-iconopt__svg" aria-hidden="true">' . $svg . '</span><span class="adm-sr">' . e((string) $key) . '</span></label>';
    }
    return $h . '</div><small>' . e($hint) . '</small>' . adm_error($errors, 'icon_key') . '</div>';
}
