<?php
/* TRICOM — izbor programa i podgrupa u grupi prodajnog programa (npr. Limovi →
   Pocinkovani lim → Limovi u koturu). Programi i podgrupe su podkategorije iz
   baze (categories.parent_id, zakrpa 007): naziv, uvod, redosled, vidljivost i
   dodeljeni proizvodi se uređuju u administraciji. Tehničke tabele ostaju u
   js/catalog.js i vezane su za slug kategorije (SHEET_CONTENT); kategorija bez
   unosa prikazuje samo svoj tekst i proizvode.

   Adrese: proizvodi.html?grupa=limovi&program=<slug>[&podgrupa=<slug>]
           en/products.html?group=limovi&program=<slug>[&subgroup=<slug>]
   Strana se crta na serveru (obične veze, nazad/napred bez skripte); na strani
   je samo izabrani program, pa se ne grade tabele ostalih. */
defined('TRICOM') || exit;

/**
 * Sadržaj kategorije po slugu:
 *   'blocks'  → nosači data-catalog (js/catalog-render.js), redom
 *   'diagram' → crtež slojeva plastificiranog lima (pregled programa)
 *   'swatch'  → uzorak materijala na kartici programa (css/pages.css .mat__swatch--*)
 *   'sub'     → kratka oznaka na kartici programa [sr, en]
 */
const SHEET_CONTENT = [
    'pocinkovani'             => ['blocks' => ['sheets-galv-quality'], 'swatch' => 'inox', 'sub' => ['KOTUR / TABLA / SLIT', 'COIL / SHEET / SLIT']],
    'pocinkovani-kotur'       => ['blocks' => ['sheets-galv-coil']],
    'pocinkovani-table'       => ['blocks' => ['sheets-galv-sheet']],
    'pocinkovani-slit'        => ['blocks' => ['sheets-galv-slit']],
    'plastificirani'          => ['blocks' => ['sheets-colored-layers'], 'diagram' => true, 'swatch' => 'ral', 'sub' => ['RAL PO IZBORU', 'RAL OF YOUR CHOICE']],
    'plastificirani-bojeni'   => ['blocks' => ['sheets-colored-painted']],
    'plastificirani-matirani' => ['blocks' => []],   // klijent još nije dostavio podatke
    'plastificirani-drvo'     => ['blocks' => ['sheets-colored-wood']],
    'aluminijum'              => ['blocks' => ['sheets-alu-range'], 'swatch' => 'zn', 'sub' => ['KOTUR / TABLA', 'COIL / SHEET']],
    'aluminijum-kotur'        => ['blocks' => ['sheets-alu-coil']],
    'aluminijum-table'        => ['blocks' => ['sheets-alu-sheet']],
    'aluminijum-bojeni'       => ['blocks' => ['sheets-alu-colored']],
    'aluminijum-rebraste'     => ['blocks' => ['sheets-alu-ribbed']],
    'bakar'                   => ['blocks' => ['sheets-copper-info'], 'swatch' => 'cu', 'sub' => ['KOTUR / SLIT / TABLA', 'COIL / SLIT / SHEET']],
    'bakar-kotur'             => ['blocks' => ['sheets-copper-coil']],
    'bakar-slit'              => ['blocks' => ['sheets-copper-slit']],
    'bakar-table'             => ['blocks' => ['sheets-copper-sheet']],
    'hladnovaljani'           => ['blocks' => ['sheets-hvl'], 'swatch' => 'fe', 'sub' => ['TABLA', 'SHEET']],
    'toplovaljani'            => ['blocks' => ['sheets-tvl-info'], 'swatch' => 'fe', 'sub' => ['RAVAN / REBRAST', 'FLAT / CHEQUER']],
    'toplovaljani-ravni'      => ['blocks' => ['sheets-tvl-plain']],
    'toplovaljani-rebrasti'   => ['blocks' => ['sheets-tvl-ribbed']],
    'inox'                    => ['blocks' => ['sheets-inox'], 'swatch' => 'alu', 'sub' => ['TABLA', 'SHEET']],
];

/** Raniji slugovi programa (krug 4) → sadašnji. */
const SHEET_PROGRAM_ALIAS = ['aluminijumski' => 'aluminijum', 'bakarni' => 'bakar'];

function site_program_alias(mixed $v): mixed
{
    return is_string($v) ? (SHEET_PROGRAM_ALIAS[$v] ?? $v) : $v;
}

/** Vidljiva podkategorija sa datim slugom ili null. */
function site_pick_child(int $parentId, mixed $slug): ?array
{
    if (!is_string($slug) || $slug === '') {
        return null;
    }
    foreach (catalog_children($parentId) as $c) {
        if ($c['slug'] === $slug) {
            return $c;
        }
    }
    return null;
}

/** Tekstovi izbora (oba jezika). */
function site_sheet_labels(string $L, bool $sheets): array
{
    return $L === 'en' ? [
        'nav' => $sheets ? 'Sheet types' : 'Ranges', 'subs' => 'Subgroups', 'overview' => 'Overview',
        'pick' => $sheets ? 'Choose a sheet type above to see its stock, dimensions and grades.' : 'Choose a range above.',
        'source' => 'The tables are taken from our previous website (stock at the time of publication). Each sheet type shows the standard range; sales confirms availability.',
        'missing' => 'Dimensions and stock details for this subgroup have not been published yet. Please check availability, dimensions and colours with sales.',
    ] : [
        'nav' => $sheets ? 'Vrste lima' : 'Programi', 'subs' => 'Podgrupe', 'overview' => 'Pregled',
        'pick' => $sheets ? 'Izaberite vrstu lima iznad — prikazaće se lager, dimenzije i kvaliteti te vrste.' : 'Izaberite program iznad.',
        'source' => 'Tabele su prenete sa dosadašnjeg sajta (stanje lagera u trenutku objave). Za svaku vrstu lima stoji standardni asortiman; raspoloživost potvrđuje prodaja.',
        'missing' => 'Podaci o dimenzijama i lageru za ovu podgrupu još nisu objavljeni. Raspoloživost, dimenzije i boje proverite sa prodajom.',
    ];
}

/**
 * Izbor programa (kartice), sadržaj izabranog programa i izbor njegovih podgrupa.
 * Prazno ako grupa nema vidljivih podkategorija.
 */
function site_sheet_browser(array $group, string $L, ?array $program, ?array $sub): string
{
    $programs = catalog_children((int) $group['id']);
    if (!$programs) {
        return '';
    }
    $g = (string) $group['slug'];
    $ge = e($g);
    $lx = site_sheet_labels($L, $g === 'limovi');
    $page = $L === 'en' ? 'products.html' : 'proizvodi.html';
    $li = $L === 'en' ? 1 : 0;

    /* kartice programa */
    $h = "\n    <nav class=\"mats mats--pick\" aria-label=\"" . e($lx['nav']) . "\" data-reveal>\n      ";
    foreach ($programs as $p) {
        $meta = SHEET_CONTENT[$p['slug']] ?? [];
        $on = $program !== null && $p['slug'] === $program['slug'];
        $h .= '<a class="mat" href="' . e(site_group_href($page, $L, $g, (string) $p['slug'], $g . '-program')) . '"' . ($on ? ' aria-current="true"' : '') . '>'
            . '<div class="mat__swatch mat__swatch--' . e($meta['swatch'] ?? 'zn') . '"></div><div class="mat__b"><b>' . e(field($p, 'name', $L)) . '</b>'
            . (isset($meta['sub']) ? '<span>' . e($meta['sub'][$li]) . '</span>' : '') . '</div></a>';
    }
    $h .= "\n    </nav>\n";

    if ($program === null) {
        return $h . '    <p class="u-sm muted u-mt-24" id="' . $ge . '-program"><span id="' . $ge . '-lager"></span>' . e($lx['pick']) . "</p>\n";
    }

    $subs = catalog_children((int) $program['id']);
    $h .= '    <section class="sheet-prog" id="' . $ge . '-program" aria-labelledby="' . $ge . '-lager">' . "\n"
        . '      <h4 class="u-mt-40 u-mb-16" id="' . $ge . '-lager">' . e(field($program, 'heading', $L) ?: field($program, 'name', $L)) . "</h4>\n";
    if ($subs) {
        $h .= '      <nav class="pill-row sheet-subs" aria-label="' . e($lx['subs'] . ': ' . field($program, 'name', $L)) . '">'
            . '<a class="pill" href="' . e(site_group_href($page, $L, $g, (string) $program['slug'], $g . '-program')) . '"' . ($sub === null ? ' aria-current="page"' : '') . '>' . e($lx['overview']) . '</a>';
        foreach ($subs as $s) {
            $h .= '<a class="pill" href="' . e(site_group_href($page, $L, $g, (string) $program['slug'], $g . '-podgrupa', (string) $s['slug'])) . '"'
                . ($sub !== null && $s['slug'] === $sub['slug'] ? ' aria-current="page"' : '') . '>' . e(field($s, 'name', $L)) . '</a>';
        }
        $h .= "</nav>\n";
    }

    $shown = $sub ?? $program;
    $meta = SHEET_CONTENT[$shown['slug']] ?? [];
    $blocks = $meta['blocks'] ?? [];
    $items = catalog_listing((int) $shown['id']);
    $intro = field($shown, 'intro', $L);
    $body = '';
    if ($sub === null && !empty($meta['diagram'])) {
        $body .= site_view('products/sheet-layers-' . ($L === 'en' ? 'en' : 'sr'), []);
    }
    if ($intro !== '') {
        $body .= '      <p class="u-sm muted u-mt-16 u-mb-16">' . e($intro) . "</p>\n";
    }
    foreach ($blocks as $b) {
        $body .= '      <div class="u-mt-24" data-catalog="' . e($b) . "\"></div>\n";
    }
    if ($items) {
        $body .= "      <div class=\"grid g3 u-mt-24\">\n      " . site_product_cards($items, 'pcard', $L) . "\n      </div>\n";
    }
    /* podgrupa (ili program bez podgrupa) bez ikakvog sadržaja: ne izmišljamo podatke */
    if (!$blocks && !$items && $intro === '' && ($sub !== null || !$subs)) {
        $body .= '      <p class="note u-mt-24">' . e($lx['missing']) . "</p>\n";
    }
    if ($blocks) {
        $body .= '      <p class="u-sm muted u-mt-16">' . e($lx['source']) . "</p>\n";
    }
    /* upit sa popunjenim nazivom izabrane vrste (isti oblik kao na strani proizvoda) */
    $lab = site_product_labels($L);
    $title = implode(' — ', array_map(static fn($c) => field($c, 'name', $L), array_filter([$group, $program, $sub])));
    $url = absolute_url(($L === 'en' ? 'en/' : '') . preg_replace('/#.*$/', '', site_category_href($page, $L, $shown)));
    $body .= '      <p class="u-mt-24"><a class="link-kerf" href="' . e($lab['contactPage'] . '?konfig=' . encode_uri_component(sprintf($lab['konfig'], $title, $url)) . '#upit') . '">'
        . e($lab['inquiry']) . ' ' . SITE_ARROW_PLAIN . "</a></p>\n";

    if ($sub !== null) {
        $body = '      <section class="sheet-sub" id="' . $ge . '-podgrupa" aria-labelledby="' . $ge . '-podgrupa-h">' . "\n"
            . '      <h5 class="u-mt-32 u-mb-16" id="' . $ge . '-podgrupa-h">' . e(field($sub, 'heading', $L) ?: field($sub, 'name', $L)) . "</h5>\n"
            . $body . "      </section>\n";
    }
    return $h . $body . "    </section>\n";
}
