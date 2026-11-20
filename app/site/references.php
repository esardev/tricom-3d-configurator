<?php
/* TRICOM — javni deo modula referenci: reference.html / en/references.html
   (vrste zahtevnosti, vrste radova, lista objekata). Reference nemaju svoje
   strane — otvaraju se u modalu (js/items.js). Markup je isti kao u
   postojećoj statičnoj strani. */
defined('TRICOM') || exit;

/** Oblici okvira slike na karticama vrsta zahtevnosti, redom (kao na strani). */
const SITE_REF_SHAPES = ['shape-a', 'shape-b', 'shape-c'];

/** Kartice jedne vrste reference: demand (ikona, slika, tekst) | scope (naslov i tekst) | project (lista objekata). */
function site_reference_cards(array $refs, string $type, string $L): string
{
    $R = $L === 'en' ? '../' : '';
    $parts = [];
    foreach (array_values($refs) as $i => $r) {
        $slug = e($r['slug']);
        $title = e(field($r, 'title', $L));
        $paras = text_paragraphs(field($r, 'summary', $L));
        if ($type === 'project') {
            $label = field($r, 'label', $L);
            $parts[] = '<article data-item="' . $slug . '" class="ref" data-reveal data-reveal-group="rf">' . "\n"
                . '        <h3 class="ref__n">' . $title . "</h3>\n"
                . implode('', array_map(static fn($p) => '        <p class="ref__d">' . e_rich($p) . "</p>\n", $paras))
                . ($label !== '' ? '        <span class="ref__k pill pill--mono">' . e($label) . "</span>\n" : '')
                . '      </article>';
            continue;
        }
        if ($type === 'scope') {
            $parts[] = '<div data-item="' . $slug . '" class="card" data-reveal data-reveal-group="iz"><h3>' . $title . '</h3>'
                . implode('', array_map(static fn($p) => '<p>' . e_rich($p) . '</p>', $paras)) . '</div>';
            continue;
        }
        $icon = catalog_icon('reference', $r['icon_key'] ?? null);
        $fig = site_reference_figure($r, $i, $L, $R);
        $parts[] = '<div data-item="' . $slug . '" class="card" data-reveal data-reveal-group="k3">' . "\n"
            . ($icon !== '' ? '        <div class="card__icon">' . $icon . "</div>\n" : '')
            . ($fig !== '' ? '        ' . $fig . "\n" : '')
            . '        <h3>' . $title . "</h3>\n"
            . implode('', array_map(static fn($p) => '        <p>' . e_rich($p) . "</p>\n", $paras))
            . '      </div>';
    }
    if (!$parts) {
        return "\n      " . site_empty('references', $L) . "\n    ";
    }
    return "\n      " . implode("\n      ", $parts) . ($type === 'project' ? '' : "\n    ");
}

/** Slika kartice vrste zahtevnosti: render (par svetlo/tamno), privremena fotografija sajta ili otpremljena fotografija. */
function site_reference_figure(array $r, int $i, string $L, string $R): string
{
    $alt = field($r, 'image_alt', $L) ?: field($r, 'title', $L);
    $shape = SITE_REF_SHAPES[$i % count(SITE_REF_SHAPES)];
    if ($r['image_type'] === 'render' && site_render_exists($r['render_key'])) {
        return '<figure class="rg-cap ' . $shape . ' u-mb-24">'
            . site_render_picture((string) $r['render_key'], $alt, $R, ['sizes' => '(max-width: 700px) 68vw, 334px', 'order' => 'list', 'pic' => 'rg-pic rg-pic--'])
            . '</figure>';
    }
    $path = (string) ($r['photo_path'] ?? '');
    if ($r['image_type'] !== 'photo' || $path === '') {
        return '';
    }
    /* privremene fotografije sajta (assets/tricom-N.jpg): ukrasni okvir sa oznakom, kao do sada */
    if (preg_match('#^assets/tricom-(\d+)\.jpg$#', $path, $m)) {
        $base = 'assets/tricom-' . $m[1];
        $w = (int) $r['photo_width'] ?: 1672;
        $h = (int) $r['photo_height'] ?: 941;
        $set = [];
        if (is_file(SITE_DIR . '/' . $base . '-960.webp')) {
            $set[] = site_src($R, $base . '-960.webp') . ' 960w';
        }
        if (is_file(SITE_DIR . '/' . $base . '.webp')) {
            $set[] = site_src($R, $base . '.webp') . ' ' . $w . 'w';
        }
        return '<figure class="ph-frame ph-frame--height u-mb-24" aria-hidden="true" data-reveal><img src="' . e(site_src($R, $path)) . '"'
            . ($set ? ' srcset="' . e(implode(', ', $set)) . '" sizes="(max-width: 768px) 100vw, 50vw"' : '')
            . ' alt="" width="' . $w . '" height="' . $h . '" loading="lazy" decoding="async"><figcaption class="ph-tab">TRICOM · ' . sprintf('%02d', (int) $m[1]) . '</figcaption></figure>';
    }
    return '<figure class="rg-cap ' . $shape . ' u-mb-24">' . site_photo($path, (int) $r['photo_width'] ?: null, (int) $r['photo_height'] ?: null, $alt, $R) . '</figure>';
}

function site_references_page(string $L): never
{
    site_canonical_entry($L === 'en' ? 'en/references.html' : 'reference.html');
    $html = site_view('references/page-' . $L, ['refs' => catalog_references(), 'navCats' => catalog_categories(true), 'L' => $L] + site_globals());
    site_send_html_headers();
    echo $html;
    exit;
}
