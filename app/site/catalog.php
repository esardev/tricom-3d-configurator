<?php
/* TRICOM — sadržaj sajta iz baze za frontend (samo čitanje): prodajni program,
   usluge, reference, galerija, česta pitanja i kontakt.
   Tabele su male (desetine redova), pa se učitavaju jednom po zahtevu i
   dalje se radi u memoriji. Stavke se pretvaraju u isti oblik koji koristi
   js/items.js (modal, strane detalja), da skripte ostanu nepromenjene. */
defined('TRICOM') || exit;

/** Sve potrebne tabele; $set postavlja podatke (lokalna provera šablona bez baze). */
function catalog_data(?array $set = null): array
{
    static $data = null;
    if ($set !== null) {
        $data = $set;
    }
    if ($data === null) {
        try {
            $data = [
                'categories'         => db_all('SELECT * FROM `categories` ORDER BY `sort_order`, `id`'),
                'products'           => db_all('SELECT * FROM `products` ORDER BY `sort_order`, `id`'),
                'product_specs'      => db_all('SELECT * FROM `product_specs` ORDER BY `product_id`, `sort_order`, `id`'),
                'product_categories' => db_all('SELECT * FROM `product_categories` ORDER BY `category_id`, `sort_order`, `product_id`'),
                'services'           => db_all('SELECT * FROM `services` ORDER BY `sort_order`, `id`'),
                'service_specs'      => db_all('SELECT * FROM `service_specs` ORDER BY `service_id`, `sort_order`, `id`'),
                'client_references'  => db_all('SELECT * FROM `client_references` ORDER BY `sort_order`, `id`'),
                'gallery_categories' => db_all('SELECT * FROM `gallery_categories` ORDER BY `sort_order`, `id`'),
                'gallery_images'     => db_all('SELECT * FROM `gallery_images` ORDER BY `sort_order`, `id`'),
                'faq_items'          => db_all('SELECT * FROM `faq_items` ORDER BY `sort_order`, `id`'),
                'contact_settings'   => db_all('SELECT * FROM `contact_settings` WHERE `id` = 1'),
                'contact_locations'  => db_all('SELECT * FROM `contact_locations` ORDER BY `sort_order`, `id`'),
                'contact_phones'     => db_all('SELECT * FROM `contact_phones` ORDER BY `location_id`, `sort_order`, `id`'),
            ];
        } catch (PDOException $e) {
            /* tabele još nisu uvezene → „privremeno nedostupno“ (503), kao u administraciji */
            if ($e->getCode() === '42S02') {
                throw new AppUnavailableException('Tabele sajta ne postoje — uvezite database/001-schema.sql i 002-existing-content.sql.');
            }
            throw $e;
        }
    }
    return $data;
}

/** Pouzdane SVG ikone sa postojećih strana: ['service' => [ključ => svg], 'reference' => […]]. */
function catalog_icons(): array
{
    static $icons = null;
    if ($icons === null) {
        $json = @file_get_contents(APP_DIR . '/data/icons.json');
        $icons = is_string($json) ? (json_decode($json, true) ?: []) : [];
        $icons += ['service' => [], 'reference' => []];
    }
    return $icons;
}

function catalog_icon(string $set, ?string $key): string
{
    $svg = $key !== null ? (catalog_icons()[$set][$key] ?? '') : '';
    return is_string($svg) ? $svg : '';
}

/** Usluge jedne vrste (service | capability) po redosledu; $activeOnly = samo vidljive. */
function catalog_services(string $kind, bool $activeOnly = true): array
{
    return array_values(array_filter(catalog_data()['services'], static fn($s) => $s['kind'] === $kind && (!$activeOnly || (int) $s['is_active'] === 1)));
}

/** Vidljive reference po vrsti: ['demand' => […], 'scope' => […], 'project' => […]]. */
function catalog_references(): array
{
    $out = ['demand' => [], 'scope' => [], 'project' => []];
    foreach (catalog_data()['client_references'] as $r) {
        if ((int) $r['is_active'] === 1 && isset($out[$r['ref_type']])) {
            $out[$r['ref_type']][] = $r;
        }
    }
    return $out;
}

/** Referenca (red iz baze) → stavka items.js (modal: naslov, tekst, oznaka, slika). */
function catalog_reference_item(array $row): array
{
    $it = ['slug' => $row['slug'], 'kind' => 'reference', 'cat' => 'reference'];
    foreach (LANGS as $l) {
        /* modal ispisuje čist tekst: naglašavanje sa kartice (<strong>) se izostavlja */
        $it[$l] = ['t' => field($row, 'title', $l), 'sum' => strip_tags(field($row, 'summary', $l)), 'meta' => field($row, 'label', $l)];
    }
    if ($row['image_type'] === 'render' && (string) $row['render_key'] !== '') {
        $it['img'] = (string) $row['render_key'];
    } elseif ($row['image_type'] === 'photo' && (string) $row['photo_path'] !== '') {
        $it['photo'] = ['src' => (string) $row['photo_path'], 'w' => (int) $row['photo_width'] ?: null, 'h' => (int) $row['photo_height'] ?: null];
    }
    return $it;
}

/** Statični ostatak items.js: grupe (veze na postojeće strane) i SVG ilustracije. */
function catalog_static(): array
{
    static $static = null;
    if ($static === null) {
        $json = @file_get_contents(APP_DIR . '/data/items-static.json');
        $static = is_string($json) ? (json_decode($json, true) ?: []) : [];
        $static += ['groups' => [], 'illu' => []];
    }
    return $static;
}

/** Grupe najvišeg nivoa (tabovi, meni) po redosledu; $activeOnly = samo vidljive.
    Podkategorije (parent_id, zakrpa 007) daje catalog_children(). */
function catalog_categories(bool $activeOnly = true): array
{
    return array_values(array_filter(catalog_data()['categories'], static fn($c) => ($c['parent_id'] ?? null) === null && (!$activeOnly || (int) $c['is_active'] === 1)));
}

/** Neposredne podkategorije kategorije po redosledu; $activeOnly = samo vidljive. */
function catalog_children(int $parentId, bool $activeOnly = true): array
{
    return array_values(array_filter(catalog_data()['categories'], static fn($c) => (int) ($c['parent_id'] ?? 0) === $parentId && (!$activeOnly || (int) $c['is_active'] === 1)));
}

/** Lanac od grupe najvišeg nivoa do kategorije: [grupa, program?, podgrupa?]. */
function catalog_category_chain(array $cat): array
{
    $chain = [$cat];
    for ($i = 0; $i < 3 && ($pid = $chain[0]['parent_id'] ?? null) !== null && ($p = catalog_category((int) $pid)); $i++) {
        array_unshift($chain, $p);
    }
    return $chain;
}

function catalog_category(int $id): ?array
{
    foreach (catalog_data()['categories'] as $c) {
        if ((int) $c['id'] === $id) {
            return $c;
        }
    }
    return null;
}

/** Proizvod po slugu (i neaktivan; strana proverava is_active). */
function catalog_product(string $slug): ?array
{
    foreach (catalog_data()['products'] as $p) {
        if ($p['slug'] === $slug) {
            return $p;
        }
    }
    return null;
}

function catalog_service(string $slug): ?array
{
    foreach (catalog_data()['services'] as $s) {
        if ($s['slug'] === $slug) {
            return $s;
        }
    }
    return null;
}

/** @return list<array> redovi tehničkih podataka po redosledu */
function catalog_specs(string $owner, int $id): array
{
    $table = $owner === 'service' ? 'service_specs' : 'product_specs';
    $key = $owner === 'service' ? 'service_id' : 'product_id';
    return array_values(array_filter(catalog_data()[$table], static fn($r) => (int) $r[$key] === $id));
}

/** Kartice taba: prikaz (product_categories) + aktivan proizvod, po redosledu prikaza. */
function catalog_listing(int $categoryId): array
{
    $products = [];
    foreach (catalog_data()['products'] as $p) {
        $products[(int) $p['id']] = $p;
    }
    $out = [];
    foreach (catalog_data()['product_categories'] as $pc) {
        $p = $products[(int) $pc['product_id']] ?? null;
        if ((int) $pc['category_id'] === $categoryId && $p && (int) $p['is_active'] === 1) {
            $out[] = ['product' => $p, 'card' => $pc];
        }
    }
    usort($out, static fn($a, $b) => [(int) $a['card']['sort_order'], (int) $a['product']['sort_order']] <=> [(int) $b['card']['sort_order'], (int) $b['product']['sort_order']]);
    return $out;
}

/* ---------------------------------------------------------------- oblik items.js */

/** Sadržaj na jeziku kao u items.js (EN bez prevoda pada na SR). */
function catalog_lang_block(array $row, array $specs, string $lang): array
{
    return [
        't'     => field($row, 'title', $lang),
        'sum'   => field($row, 'summary', $lang),
        'desc'  => field_paragraphs($row, 'description', $lang),
        'specs' => array_map(static fn($s) => [field($s, 'label', $lang), field($s, 'value', $lang)], $specs),
        'tags'  => field_lines($row, 'tags', $lang),
        'apps'  => field_lines($row, 'apps', $lang),
    ];
}

/** Proizvod ili usluga (red iz baze) → stavka items.js. */
function catalog_row_item(array $row, string $kind): array
{
    $it = ['slug' => $row['slug'], 'kind' => $kind];
    if ($kind === 'product') {
        $cat = catalog_category((int) $row['category_id']);
        $it['cat'] = $cat['slug'] ?? '';
    } else {
        $it['cat'] = $kind === 'capability' ? 'plazma' : 'usluge';
    }
    switch ($row['image_type']) {
        case 'render':
            if ((string) $row['render_key'] !== '') {
                $it['img'] = (string) $row['render_key'];
            }
            break;
        case 'illu':
            if ((string) $row['illu_key'] !== '') {
                $it['svg'] = (string) $row['illu_key'];
            }
            break;
        case 'photo':
            if ((string) $row['photo_path'] !== '') {
                $it['photo'] = ['src' => (string) $row['photo_path'], 'w' => (int) $row['photo_width'] ?: null, 'h' => (int) $row['photo_height'] ?: null];
            }
            break;
    }
    foreach (['calc_id' => 'calc', 'calc_tabs' => 'calcTabs', 'konf_hash' => 'konf', 'drawing_path' => 'drawing'] as $col => $key) {
        if ((string) ($row[$col] ?? '') !== '') {
            $it[$key] = (string) $row[$col];
        }
    }
    $it['rel'] = catalog_related_slugs($row);
    $specs = catalog_specs($kind === 'product' ? 'product' : 'service', (int) $row['id']);
    $it['sr'] = catalog_lang_block($row, $specs, 'sr');
    $it['en'] = catalog_lang_block($row, $specs, 'en');
    return $it;
}

function catalog_related_slugs(array $row): array
{
    return array_values(array_filter(array_map('trim', explode(',', (string) ($row['related_slugs'] ?? ''))), static fn($s) => $s !== ''));
}

/** Stavka po slugu za kartice „Srodno“ i podskup na strani: aktivni proizvodi i usluge iz baze, grupe iz statičnog ostatka. */
function catalog_item(string $slug): ?array
{
    $p = catalog_product($slug);
    if ($p) {
        return (int) $p['is_active'] === 1 ? catalog_row_item($p, 'product') : null;
    }
    $s = catalog_service($slug);
    if ($s) {
        return (int) $s['is_active'] === 1 ? catalog_row_item($s, (string) $s['kind']) : null;
    }
    foreach (catalog_static()['groups'] as $g) {
        if (($g['slug'] ?? '') === $slug) {
            return $g;
        }
    }
    return null;
}

/** Svi poznati slugovi za izbor „Srodno“ u administraciji: [slug => 'Naslov (vrsta)']. */
function catalog_known_slugs(): array
{
    $out = [];
    foreach (catalog_data()['products'] as $p) {
        $out[$p['slug']] = $p['title_sr'] . ' (proizvod)';
    }
    foreach (catalog_data()['services'] as $s) {
        $out[$s['slug']] = $s['title_sr'] . ($s['kind'] === 'capability' ? ' (mogućnost)' : ' (usluga)');
    }
    foreach (catalog_static()['groups'] as $g) {
        $out[$g['slug']] = ($g['sr']['t'] ?? $g['slug']) . ' (grupa)';
    }
    return $out;
}
