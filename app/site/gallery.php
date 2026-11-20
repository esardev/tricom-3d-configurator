<?php
/* TRICOM — javni deo modula galerije: filteri (kategorije) i pločice na
   galerija.html / en/gallery.html, stavke za modal (js/items.js). Uvećani
   prikaz (lightbox) i filtriranje rade postojeće skripte (js/main.js) nad
   istim atributima (data-gcat, data-cap, data-full …). */
defined('TRICOM') || exit;

/** Najviše znakova oznake slike u mreži (data-figlabel); duži opis se skraćuje sa „…“. */
const SITE_FIG_LABEL_MAX = 40;

/** Vidljive kategorije i njihove vidljive slike: ['cats' => [id => red], 'images' => [red + _cat]]. */
function site_gallery(): array
{
    $d = catalog_data();
    $cats = [];
    foreach ($d['gallery_categories'] as $c) {
        if ((int) $c['is_active'] === 1) {
            $cats[(int) $c['id']] = $c;
        }
    }
    uasort($cats, static fn($a, $b) => [(int) $a['sort_order'], (int) $a['id']] <=> [(int) $b['sort_order'], (int) $b['id']]);
    $images = [];
    foreach ($d['gallery_images'] as $g) {
        if ((int) $g['is_active'] === 1 && isset($cats[(int) $g['category_id']])) {
            $images[] = $g + ['_cat' => $cats[(int) $g['category_id']]];
        }
    }
    usort($images, static fn($a, $b) => [(int) $a['sort_order'], (int) $a['id']] <=> [(int) $b['sort_order'], (int) $b['id']]);
    $used = array_flip(array_map(static fn($g) => (int) $g['category_id'], $images));
    return ['cats' => array_values(array_filter($cats, static fn($c) => isset($used[(int) $c['id']]))), 'images' => $images];
}

/** Dugmad filtera posle „Sve“: kategorije koje imaju bar jednu vidljivu sliku. */
function site_gallery_filters(array $gallery, string $L): string
{
    return implode('', array_map(static fn($c) => '<button class="tabs__btn" role="tab" type="button" data-filter="' . e($c['slug']) . '" aria-selected="false">' . e(field($c, 'name', $L)) . '</button>', $gallery['cats']));
}

/**
 * Kratka oznaka za mrežu: do 40 znakova ceo opis, inače skraćen + „…“, kako je
 * rađeno na postojećim stranama: srpski posle 38 znakova, engleski na granici
 * reči unutar 37 znakova.
 */
function site_fig_label(string $cap, string $L): string
{
    if (mb_strlen($cap, 'UTF-8') <= SITE_FIG_LABEL_MAX) {
        return $cap;
    }
    if ($L !== 'en') {
        return rtrim(mb_substr($cap, 0, 38, 'UTF-8')) . '…';
    }
    $t = mb_substr($cap, 0, 37, 'UTF-8');
    if (mb_substr($cap, 37, 1, 'UTF-8') !== ' ') {
        $k = mb_strrpos($t, ' ', 0, 'UTF-8');
        if ($k !== false && $k > 0) {
            $t = mb_substr($t, 0, $k, 'UTF-8');
        }
    }
    return (preg_replace('/[\s,—–-]+$/u', '', $t) ?? $t) . '…';
}

/** Pločice galerije (fotografije i renderi), redom. */
function site_gallery_items(array $gallery, string $L): string
{
    $R = $L === 'en' ? '../' : '';
    $sizes = '(max-width: 700px) 42vw, 310px';
    $parts = [];
    foreach ($gallery['images'] as $g) {
        $cap = field($g, 'caption', $L);
        $alt = field($g, 'alt', $L) ?: $cap;
        $render = $g['image_type'] === 'render';
        if ($render) {
            if (!site_render_exists($g['render_key'])) {
                continue;
            }
            $full = 'assets/render/' . $g['render_key'] . '-light.jpg';
            $media = site_render_picture((string) $g['render_key'], $alt, $R, ['sizes' => $sizes, 'order' => 'list', 'measure' => true, 'pic' => 'rg-pic rg-pic--']);
            $media = str_replace('</picture><picture', "</picture>\n        <picture", $media);
        } else {
            $full = (string) $g['photo_path'];
            if ($full === '') {
                continue;
            }
            $media = site_gallery_photo($g, $alt, $R, $sizes);
        }
        $parts[] = (str_starts_with($full, 'assets/old/foto/') ? "<!-- OLD SITE PHOTO: replace with new photography -->\n      " : '')
            . '<figure data-item="' . e($g['slug']) . '" class="gitem' . ($render ? ' gitem--render' : '') . '" data-fig="' . e($g['fig_no']) . '" data-figlabel="' . e(site_fig_label($cap, $L)) . '"'
            . ((string) ($g['crop_pos'] ?? '') !== '' && !$render ? ' data-pos="' . e($g['crop_pos']) . '"' : '')
            . ' data-gitem data-gcat="' . e($g['_cat']['slug']) . '" data-cap="' . e($cap) . '" data-full="' . e($R . $full) . "\">\n"
            . '        <span class="gitem__tag" aria-hidden="true">' . e(field($g['_cat'], 'name', $L)) . "</span>\n"
            . '        ' . $media . "\n"
            . '        <figcaption class="gitem__cap">' . e($cap) . "</figcaption>\n"
            . '      </figure>';
    }
    return $parts ? "\n      " . implode("\n      ", $parts) : "\n      " . site_empty('gallery', $L) . "\n    ";
}

/** Fotografija u mreži: najveća responzivna varijanta (-<N>w.webp) sa srcset, inače sam fajl. */
function site_gallery_photo(array $g, string $alt, string $R, string $sizes): string
{
    $path = (string) $g['photo_path'];
    $variants = site_variants(preg_replace('/\.(jpe?g|png|webp)$/i', '', $path) ?? $path);
    $size = (int) $g['photo_width'] && (int) $g['photo_height'] ? ' width="' . (int) $g['photo_width'] . '" height="' . (int) $g['photo_height'] . '"' : '';
    if ($variants) {
        $srcset = implode(', ', array_map(static fn($v) => site_src($R, $v[1]) . ' ' . $v[0] . 'w', $variants));
        return '<img src="' . e(site_src($R, end($variants)[1])) . '" srcset="' . e($srcset) . '" sizes="' . e($sizes) . '" data-orig="' . e(site_src($R, $path)) . '" alt="' . e($alt) . '"' . $size . ' loading="lazy" decoding="async">';
    }
    return '<img src="' . e(site_src($R, $path)) . '" alt="' . e($alt) . '"' . $size . ' loading="lazy" decoding="async">';
}

/** Slika galerije → stavka items.js (modal). */
function catalog_gallery_item(array $g): array
{
    $it = ['slug' => $g['slug'], 'kind' => 'gallery', 'cat' => $g['_cat']['slug'], 'fig' => (string) $g['fig_no']];
    foreach (LANGS as $l) {
        $it[$l] = ['t' => field($g, 'caption', $l), 'meta' => field($g['_cat'], 'name', $l), 'alt' => field($g, 'alt', $l)];
    }
    if ($g['image_type'] === 'render') {
        $it['img'] = (string) $g['render_key'];
    } else {
        $it['photo'] = ['src' => (string) $g['photo_path'], 'w' => (int) $g['photo_width'] ?: null, 'h' => (int) $g['photo_height'] ?: null];
    }
    return $it;
}
