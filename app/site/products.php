<?php
/* TRICOM — javni deo modula proizvoda: strana prodajnog programa (tabovi),
   strane detalja proizvoda, js/items.js (modal) i sitemap.xml.
   Markup je isti kao u postojećim statičnim stranama (klase, atributi,
   redosled), da CSS i skripte rade nepromenjeno. */
defined('TRICOM') || exit;

const SITE_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
/** Najviše kartica „Srodno“ na strani detalja (kao do sada). */
const SITE_REL_MAX = 6;
const SITE_ARROW_PLAIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/** Stalni tekstovi strana proizvoda (isti kao na postojećim stranama). */
function site_product_labels(string $L): array
{
    return $L === 'en' ? [
        'home' => 'Home', 'products' => 'Products', 'productsPage' => 'products.html', 'contactPage' => 'contact.html',
        'calcPage' => 'calculators.html', 'konfPage' => 'configurator.html', 'ghost' => 'PRODUCT', 'crumbs' => 'Breadcrumb',
        'marker' => 'Product', 'inquiry' => 'Send an inquiry', 'calculate' => 'Calculate', 'see3d' => 'See it on a building in 3D',
        'seeBuilding' => 'See it on a building', 'desc' => 'Description', 'tech' => 'Technical data', 'caption' => 'KEY DATA',
        'thItem' => 'Item', 'thValue' => 'Value',
        'note' => "Data from our previous website and manufacturer's drawings; sales confirms dimensions and availability.",
        'apps' => 'Applications', 'appsH' => 'Where it is used', 'drawing' => "Manufacturer's drawing from our previous website",
        'calc' => 'Calculator', 'calcH' => 'Work out sheets, area and weight',
        'calcP' => 'Enter the sheet length and either the number of sheets or the roof width — the result updates straight away. You can add the calculation to your inquiry or print it.',
        'allCalc' => 'All calculators', 'rel' => 'Related', 'relH' => 'See also',
        'ctaH' => 'Send an inquiry — get a price and lead time.',
        'ctaP' => 'Thickness, dimensions and quantity are the minimum for a quote. Check availability and colours with sales.',
        'back' => 'Back: Products', 'konfig' => "I am interested in: %s\n(from the website: %s)\n\nQuantity / dimensions: ",
        'locale' => 'en_GB', 'homeUrl' => 'en/', 'productsUrl' => 'en/products.html', 'detailDir' => 'en/details/',
    ] : [
        'home' => 'Početna', 'products' => 'Proizvodi', 'productsPage' => 'proizvodi.html', 'contactPage' => 'kontakt.html',
        'calcPage' => 'kalkulatori.html', 'konfPage' => 'konfigurator.html', 'ghost' => 'PROIZVOD', 'crumbs' => 'Putanja',
        'marker' => 'Proizvod', 'inquiry' => 'Pošalji upit', 'calculate' => 'Izračunaj', 'see3d' => 'Vidi na objektu u 3D',
        'seeBuilding' => 'Vidi na objektu', 'desc' => 'Opis', 'tech' => 'Tehnički podaci', 'caption' => 'OSNOVNI PODACI',
        'thItem' => 'Podatak', 'thValue' => 'Vrednost',
        'note' => 'Podaci su sa dosadašnjeg sajta i fabričkih crteža; mere i raspoloživost potvrđuje prodaja.',
        'apps' => 'Primena', 'appsH' => 'Gde se koristi', 'drawing' => 'Fabrički crtež sa dosadašnjeg sajta',
        'calc' => 'Kalkulator', 'calcH' => 'Izračunajte table, površinu i masu',
        'calcP' => 'Unesite dužinu table i broj tabli ili širinu krova — rezultat se računa odmah. Proračun možete dodati u upit ili odštampati.',
        'allCalc' => 'Svi kalkulatori', 'rel' => 'Srodno', 'relH' => 'Pogledajte i',
        'ctaH' => 'Pošaljite upit — dobijate cenu i rok.',
        'ctaP' => 'Debljina, dimenzija i količina su minimum za ponudu. Raspoloživost i boje proverite sa prodajom.',
        'back' => 'Nazad: Proizvodi', 'konfig' => "Zanima me: %s\n(sa sajta: %s)\n\nKoličina / dimenzije: ",
        'locale' => 'sr_RS', 'homeUrl' => '', 'productsUrl' => 'proizvodi.html', 'detailDir' => 'detalji/',
    ];
}

/**
 * Tekstovi strane detalja koji zavise od vrste stavke (proizvod, usluga, mogućnost plazme):
 * „duh“ naslova, oznaka, strana iznad (putanja i „Nazad“), rezervna OG slika.
 */
function site_detail_kind_labels(string $kind, string $L): array
{
    $en = $L === 'en';
    return match ($kind) {
        'service' => $en
            ? ['ghost' => 'SERVICE', 'marker' => 'Service', 'parent' => 'Services', 'parentPage' => 'services.html', 'back' => 'Back: Services', 'og' => 'assets/og/usluge.jpg']
            : ['ghost' => 'USLUGA', 'marker' => 'Usluga', 'parent' => 'Usluge', 'parentPage' => 'usluge.html', 'back' => 'Nazad: Usluge', 'og' => 'assets/og/usluge.jpg'],
        'capability' => $en
            ? ['ghost' => 'PLASMA', 'marker' => 'Machine capability', 'parent' => 'CNC plasma', 'parentPage' => 'plasma-cutting.html', 'back' => 'Back: CNC plasma', 'og' => 'assets/og/plazma.jpg']
            : ['ghost' => 'PLAZMA', 'marker' => 'Mogućnost mašine', 'parent' => 'CNC plazma', 'parentPage' => 'plazma.html', 'back' => 'Nazad: CNC plazma', 'og' => 'assets/og/plazma.jpg'],
        default => ['parent' => site_product_labels($L)['products'], 'parentPage' => site_product_labels($L)['productsPage'], 'og' => 'assets/og/proizvodi.jpg'],
    };
}

/** Engleski naziv strane za vezu grupe (isti par kao js/lang.js). */
function site_page_for_lang(string $page, string $L): string
{
    if ($L !== 'en') {
        return $page;
    }
    $map = ['index.html' => 'index.html', 'o-nama.html' => 'about.html', 'usluge.html' => 'services.html', 'plazma.html' => 'plasma-cutting.html',
        'proizvodi.html' => 'products.html', 'reference.html' => 'references.html', 'galerija.html' => 'gallery.html', 'kontakt.html' => 'contact.html',
        'konfigurator.html' => 'configurator.html', 'kalkulatori.html' => 'calculators.html'];
    [$file, $hash] = array_pad(explode('#', $page, 2), 2, null);
    /* stara veza na tab (proizvodi.html#krov, #krov-tehnika) → strana grupe */
    if ($file === 'proizvodi.html' && $hash !== null && ($g = site_group_from_hash($hash))) {
        return site_group_href($map[$file] ?? $file, $L, $g[0], null, $g[1]);
    }
    return ($map[$file] ?? $file) . ($hash !== null ? '#' . $hash : '');
}

/* ---------------------------------------------------------------- adrese grupa
   Grupa prodajnog programa ima svoju adresu: proizvodi.html?grupa=<slug>
   (en/products.html?group=<slug>); program limova još &program=<slug>.
   Oba ključa (grupa / group) važe na oba jezika. Stare veze #<slug> i
   #<slug>-<odeljak> prevodi js/main.js (tabovi), a na serveru ove funkcije. */

/** Ključ upita za grupu na jeziku strane. */
function site_group_param(string $L): string
{
    return $L === 'en' ? 'group' : 'grupa';
}

/** Ključ upita za podgrupu na jeziku strane (oba važe na oba jezika). */
function site_sub_param(string $L): string
{
    return $L === 'en' ? 'subgroup' : 'podgrupa';
}

/** Veza na grupu (i program / podgrupu): <strana>?grupa=limovi&program=…&podgrupa=…#prog. $page je putanja strane proizvoda. */
function site_group_href(string $page, string $L, string $slug, ?string $program = null, string $frag = 'prog', ?string $sub = null): string
{
    return $page . '?' . site_group_param($L) . '=' . rawurlencode($slug) . ($program !== null ? '&program=' . rawurlencode($program) : '')
        . ($program !== null && $sub !== null ? '&' . site_sub_param($L) . '=' . rawurlencode($sub) : '')
        . ($frag !== '' ? '#' . $frag : '');
}

/** Veza na bilo koju kategoriju (grupa, program ili podgrupa) preko njenog lanca. */
function site_category_href(string $page, string $L, array $cat): string
{
    $ch = catalog_category_chain($cat);
    $g = (string) $ch[0]['slug'];
    return match (count($ch)) {
        1 => site_group_href($page, $L, $g),
        2 => site_group_href($page, $L, $g, (string) $ch[1]['slug'], $g . '-program'),
        default => site_group_href($page, $L, $g, (string) $ch[1]['slug'], $g . '-podgrupa', (string) $ch[2]['slug']),
    };
}

/** Stari heš taba → [slug grupe, sidro na novoj strani] ili null. */
function site_group_from_hash(string $hash): ?array
{
    foreach (catalog_categories(true) as $c) {
        if ($hash === $c['slug']) {
            return [$c['slug'], 'prog'];
        }
        if (str_starts_with($hash, $c['slug'] . '-')) {
            return [$c['slug'], $hash];
        }
    }
    return null;
}

/* ================================================================ strana prodajnog programa */

/** Podmeni „Proizvodi“ (zaglavlje i mobilni meni): veze na tabove aktivnih kategorija. */
function site_nav_products(array $cats, string $L, string $href): string
{
    $out = '';
    foreach ($cats as $c) {
        $label = field($c, 'nav_label', $L) ?: field($c, 'name', $L);
        $out .= '<a href="' . e(site_group_href($href, $L, $c['slug'])) . '">' . e($label) . '</a>';
    }
    return $out;
}

/** Slika kartice grupe na početnoj (samo postojeći materijal): render (svetla/tamna tema),
    fotografija sa starog sajta ili postojeći crtež; nepoznata grupa (nova iz administracije) = bez slike. */
const HOME_GROUP_MEDIA = [
    'krov'   => ['render', 'tr35'],
    'limovi' => ['render', 'sheet-stack'],
    'oluci'  => ['render', 'gutter-halfround'],
    'cevi'   => ['render', 'tubes'],
    'kovano' => ['photo', 'assets/old/foto/grifovano-pletivo.jpg', 797, 600],
    'alati'  => ['drawing', 'alati'],
];

/** Crtež „Alati i oprema“ — isti kao u ranijem bloku programa na početnoj (nema fotografije alata). */
const HOME_DRAWING_ALATI = '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g stroke="currentColor" stroke-opacity=".16" stroke-width="1"><path d="M0 150 H400 M133 0 V300 M266 0 V300"/></g><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><circle cx="66" cy="76" r="30"/><circle cx="66" cy="76" r="8"/><path d="M90 56 L116 44 L116 108 L90 96"/><path d="M172 100 L172 62 L188 46 L216 46 L216 62 L200 62 L200 100 Z"/><path d="M186 46 L186 30 L202 30 L202 46"/><path d="M296 44 L340 44 L340 60 L326 60 L326 106 L310 106 L310 60 L296 60 Z"/><path d="M40 196 L96 196 L96 264 L40 264 Z M40 210 L96 210 M68 196 L68 264"/><circle cx="190" cy="230" r="30"/><path d="M190 200 L190 230 L212 244"/><path d="M296 200 L340 200 M296 216 L340 216 M296 232 L340 232 M296 248 L322 248"/></g></svg>';

/** Početna, „Naši proizvodi“: kartica sa slikom za svaku vidljivu grupu (naziv iz baze, veza na tab grupe). */
function site_home_groups(array $cats, string $L): string
{
    $R = $L === 'en' ? '../' : '';
    $page = $L === 'en' ? 'products.html' : 'proizvodi.html';
    $go = $L === 'en' ? 'View the range' : 'Pogledajte grupu';
    $arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    $out = '';
    foreach ($cats as $c) {
        $m = HOME_GROUP_MEDIA[$c['slug']] ?? null;
        $media = match ($m[0] ?? null) {
            'render' => site_render_exists($m[1]) ? site_render_picture($m[1], '', $R, ['sizes' => '(max-width: 600px) 92vw, (max-width: 1100px) 46vw, 30vw', 'order' => 'list', 'measure' => true]) : '',
            'photo' => is_file(SITE_DIR . '/' . $m[1]) ? '<img src="' . e(site_src($R, $m[1])) . '" alt="" width="' . $m[2] . '" height="' . $m[3] . '" loading="lazy" decoding="async">' : '',
            'drawing' => '<span class="hm-group__draw">' . HOME_DRAWING_ALATI . '</span>',
            default => '',
        };
        $out .= '<a class="hm-group g-card' . ($media === '' ? ' hm-group--plain' : '') . '" href="' . e(site_group_href($page, $L, $c['slug'])) . '" data-reveal data-reveal-group="groups">'
            . '<div class="hm-group__ph tex-grid">' . $media . '</div>'
            . '<div class="hm-group__b"><h3 class="hm-group__n">' . e(field($c, 'name', $L)) . '</h3>'
            . '<span class="hm-group__go link-kerf">' . e($go) . ' ' . $arrow . '</span></div></a>';
    }
    return $out === '' ? '' : '<div class="hm-groups">' . $out . '</div>';
}

/** Izbor grupe: obične veze (svaka grupa je posebna adresa; nazad/napred radi bez skripte). */
function site_products_tab_buttons(array $cats, string $L, ?array $active = null): string
{
    $page = $L === 'en' ? 'products.html' : 'proizvodi.html';
    $out = '';
    foreach ($cats as $c) {
        $on = $active !== null && $c['slug'] === $active['slug'];
        $out .= '<a class="tabs__btn" href="' . e(site_group_href($page, $L, $c['slug'])) . '" data-hash="' . e($c['slug']) . '"'
            . ($on ? ' aria-current="page"' : '') . '>' . e(field($c, 'name', $L)) . '</a>';
    }
    return $out;
}

/** Panel izabrane grupe — samo jedan; ostale grupe se ne crtaju (posebne adrese).
    Postojeća grupa koristi svoj statični pogled, nova kategorija opšti izgled. */
function site_products_panels(array $cats, string $L, ?array $active = null, ?array $program = null, ?array $sub = null): string
{
    if (!$cats || $active === null) {
        return site_empty('catalog', $L);
    }
    $c = $active;
    $items = catalog_listing((int) $c['id']);
    $partial = APP_DIR . '/views/site/products/panel-' . $L . '-' . $c['slug'] . '.php';
    /* programi i podgrupe (podkategorije iz administracije): izbor ispod uvoda grupe */
    $browser = static fn(): string => site_sheet_browser($c, $L, $program, $sub);
    if (preg_match('/^[a-z0-9-]+$/', $c['slug']) && is_file($partial)) {
        $src = (string) file_get_contents($partial);
        $inner = site_view('products/panel-' . $L . '-' . $c['slug'], ['cat' => $c, 'items' => $items, 'L' => $L, 'program' => $program, 'sub' => $sub] + site_globals());
        /* tab bez mesta za kartice (npr. Limovi, Kovano): dodeljeni proizvodi idu na kraj */
        if ($items && !str_contains($src, 'site_product_cards(')) {
            $inner = rtrim($inner, "\n") . "\n\n    <div class=\"grid g3 u-mt-40\">\n      " . site_product_cards($items, 'pcard', $L) . "\n    </div>\n";
        }
        /* statični tab bez izbora podkategorija: podkategorije dodate u administraciji idu na kraj */
        if (!str_contains($src, 'site_sheet_browser(')) {
            $inner = rtrim($inner, "\n") . "\n" . $browser();
        }
    } else {
        $inner = "\n    <div class=\"pp-open\">\n      <div class=\"pp-open__txt\">\n        <h3>" . e(field($c, 'heading', $L) ?: field($c, 'name', $L)) . "</h3>\n"
            . (field($c, 'intro', $L) !== '' ? '        <p class="lead u-mt-16">' . e(field($c, 'intro', $L)) . "</p>\n" : '')
            . "      </div>\n    </div>\n"
            . $browser()
            . "\n    <div class=\"grid g3 u-mt-40\">\n      " . ($items ? site_product_cards($items, 'pcard', $L) : (catalog_children((int) $c['id']) ? '' : site_empty('products', $L))) . "\n    </div>\n";
    }
    $s = e($c['slug']);
    return '<div class="tabs__panel" id="prog-p-' . $s . '" data-group="' . $s . '">' . $inner . '</div>';
}

/** Tekst kartice: preklapanje iz prikaza u tabu, inače polje proizvoda. */
function site_card_field(array $listing, string $field, string $productField, string $L): string
{
    $v = field($listing['card'], 'card_' . $field, $L);
    return $v !== '' ? $v : field($listing['product'], $productField, $L);
}

/** Kartice u tabu; $style = pcard (slika, tekst, oznake) | prog (lista) | card (naslov i tekst). */
function site_product_cards(array $items, string $style, string $L): string
{
    $lab = site_product_labels($L);
    $parts = [];
    foreach ($items as $it) {
        $p = $it['product'];
        $slug = e($p['slug']);
        $title = site_card_field($it, 'title', 'title', $L);
        $text = site_card_field($it, 'text', 'summary', $L);
        if ($style === 'prog') {
            $lis = implode('', array_map(static fn($l) => '<li>' . e_rich($l) . '</li>', text_lines($text)));
            $parts[] = '<div data-item="' . $slug . '" class="prog__i"><h4>' . e($title) . '</h4>' . ($lis !== '' ? '<ul>' . $lis . '</ul>' : '') . '</div>';
            continue;
        }
        if ($style === 'card') {
            $parts[] = '<div data-item="' . $slug . '" class="card" data-reveal data-reveal-group="al"><h3>' . e($title) . '</h3>'
                . implode('', array_map(static fn($t) => '<p>' . e_rich($t) . '</p>', text_paragraphs($text))) . '</div>';
            continue;
        }
        $h = '<article data-item="' . $slug . '" class="pcard" data-reveal data-reveal-group="pc">' . "\n";
        $fig = site_card_figure($it, $title, $L);
        if ($fig !== '') {
            $h .= '  <div class="pcard__fig pcard__fig--render">' . $fig . "</div>\n";
        }
        $h .= "  <div class=\"pcard__body\">\n    <h3>" . e($title) . "</h3>\n";
        foreach (text_paragraphs($text) as $para) {
            $h .= '    <p>' . e_rich($para) . "</p>\n";
        }
        $tags = text_lines(site_card_field($it, 'tags', 'tags', $L));
        if ($tags) {
            $h .= '    <div class="pcard__tags">' . implode('', array_map(static fn($t) => '<span class="tag">' . e($t) . '</span>', $tags)) . "</div>\n";
        }
        if ((string) $p['konf_hash'] !== '') {
            $h .= '    <a class="link-kerf" href="' . e($lab['konfPage'] . '#' . $p['konf_hash']) . '">' . e($lab['seeBuilding']) . ' ' . SITE_ARROW_PLAIN . "</a>\n";
        }
        $parts[] = $h . '  </div></article>';
    }
    return implode($style === 'card' ? "\n      " : '', $parts);
}

/** Slika kartice u tabu (strana je u korenu jezika: SR „“, EN „../“). */
function site_card_figure(array $it, string $title, string $L): string
{
    $p = $it['product'];
    $c = $it['card'];
    $R = $L === 'en' ? '../' : '';
    $alt = field($c, 'card_image_alt', $L) ?: $title;
    $o = ['sizes' => '(max-width: 700px) 88vw, 1296px', 'order' => 'list', 'measure' => true];
    switch ($c['card_image_type'] ?? 'inherit') {
        case 'none':
            return '';
        case 'render':
            return site_render_exists($c['card_render_key']) ? site_render_picture((string) $c['card_render_key'], $alt, $R, $o) : '';
        case 'photo':
            return (string) $c['card_photo_path'] !== '' ? site_photo((string) $c['card_photo_path'], (int) $c['card_photo_width'] ?: null, (int) $c['card_photo_height'] ?: null, $alt, $R) : '';
    }
    if ($p['image_type'] === 'render' && site_render_exists($p['render_key'])) {
        return site_render_picture((string) $p['render_key'], $alt, $R, $o);
    }
    if ($p['image_type'] === 'photo' && (string) $p['photo_path'] !== '') {
        return site_photo((string) $p['photo_path'], (int) $p['photo_width'] ?: null, (int) $p['photo_height'] ?: null, $alt, $R);
    }
    return '';
}

function site_products_page(string $L): never
{
    $page = $L === 'en' ? 'products.html' : 'proizvodi.html';
    site_canonical_entry(($L === 'en' ? 'en/' : '') . $page);
    $cats = catalog_categories(true);
    /* izabrana grupa: ?grupa= ili ?group= (oba jezika); bez upita prva grupa */
    $req = $_GET['grupa'] ?? $_GET['group'] ?? null;
    $active = $cats[0] ?? null;
    if ($req !== null) {
        $found = null;
        foreach ($cats as $c) {
            if (is_string($req) && $c['slug'] === $req) {
                $found = $c;
            }
        }
        if ($found === null) {
            /* nepostojeća ili sakrivena grupa: pregled programa (privremeno — grupa može ponovo da se prikaže) */
            header('Location: ' . url(($L === 'en' ? 'en/' : '') . $page), true, 302);
            exit;
        }
        $active = $found;
    }
    /* program (&program=) i podgrupa (&podgrupa= / &subgroup=): vidljive podkategorije izabrane grupe;
       nepoznat slug = pregled nivoa iznad (bez preusmeravanja) */
    $program = $active !== null ? site_pick_child((int) $active['id'], site_program_alias($_GET['program'] ?? null)) : null;
    $sub = $program !== null ? site_pick_child((int) $program['id'], $_GET['podgrupa'] ?? $_GET['subgroup'] ?? null) : null;
    /* canonical / hreflang: prva grupa bez programa je sama strana programa */
    $first = $active === null || $active['slug'] === ($cats[0]['slug'] ?? null);
    $qs = static fn(string $key, string $subKey): string => ($first && $program === null) ? ''
        : '?' . $key . '=' . rawurlencode((string) $active['slug'])
        . ($program !== null ? '&program=' . rawurlencode((string) $program['slug']) : '')
        . ($sub !== null ? '&' . $subKey . '=' . rawurlencode((string) $sub['slug']) : '');
    $titles = array_map(static fn($c) => field($c, 'name', $L), array_filter([$active, $program, $sub]));
    $group = ['active' => $active, 'program' => $program, 'sub' => $sub, 'qSr' => $qs('grupa', 'podgrupa'), 'qEn' => $qs('group', 'subgroup'),
        'groupTitle' => ($first && $program === null) || $active === null ? '' : implode(' — ', $titles)];
    $html = site_view('products/page-' . $L, ['cats' => $cats, 'navCats' => $cats, 'L' => $L] + $group + site_globals());
    site_send_html_headers();
    echo $html;
    exit;
}

/* ================================================================ strana detalja */

/**
 * Odgovor na /detalji/<slug>.html i /en/details/<slug>.html: aktivan proizvod,
 * usluga ili mogućnost plazme iz baze (isti šablon); sve ostalo 404.
 */
function site_detail_page(string $L, mixed $slug): never
{
    $slug = is_string($slug) ? $slug : '';
    site_canonical_entry(($L === 'en' ? 'en/details/' : 'detalji/') . (is_valid_slug($slug) ? $slug . '.html' : ''));
    if (!is_valid_slug($slug)) {
        site_not_found($L);
    }
    $row = catalog_product($slug);
    $kind = 'product';
    if ($row === null) {
        $row = catalog_service($slug);
        $kind = (string) ($row['kind'] ?? '');
    }
    if ($row === null || (int) $row['is_active'] !== 1) {
        site_not_found($L);
    }
    $html = site_view('detail/page', ['d' => site_detail_model($row, $L, $kind), 'L' => $L, 'navCats' => catalog_categories(true)] + site_globals());
    site_send_html_headers();
    echo $html;
    exit;
}

/** Sve što šablon strane detalja ispisuje (bez HTML-a u bazi). $kind = product | service | capability */
function site_detail_model(array $p, string $L, string $kind = 'product'): array
{
    $kl = site_detail_kind_labels($kind, $L);
    $lab = array_merge(site_product_labels($L), array_intersect_key($kl, array_flip(['ghost', 'marker', 'back'])));
    $SITE = absolute_url('');
    $R = $L === 'en' ? '../../' : '../';
    $item = catalog_row_item($p, $kind);
    $x = $item[$L];
    $slug = $p['slug'];
    $url = $SITE . $lab['detailDir'] . $slug . '.html';
    $title = $x['t'];
    $sum = $x['sum'] !== '' ? $x['sum'] : $title;
    /* strana iznad: tab kategorije proizvoda, usluge.html ili plazma.html */
    if ($kind === 'product') {
        /* primarna kategorija može biti program ili podgrupa (npr. Limovi → Bakar → Bakar u koturu) */
        $cat = catalog_category((int) $p['category_id']);
        $parentHref = $cat ? site_category_href('../' . $lab['productsPage'], $L, $cat) : '../' . $lab['productsPage'];
        $parentUrl = $cat ? $SITE . preg_replace('/#.*$/', '', site_category_href($lab['productsUrl'], $L, $cat)) : $SITE . $lab['productsUrl'];
    } else {
        $parentHref = '../' . $kl['parentPage'];
        $parentUrl = $SITE . ($L === 'en' ? 'en/' : '') . $kl['parentPage'];
    }

    $heroKey = $p['image_type'] === 'render' && site_render_exists($p['render_key']) ? (string) $p['render_key'] : null;
    if ($heroKey) {
        $og = $SITE . 'assets/render/' . $heroKey . '-light.jpg';
    } elseif ($p['image_type'] === 'photo' && (string) $p['photo_path'] !== '') {
        $og = $SITE . $p['photo_path'];
    } else {
        $og = $SITE . $kl['og'];
    }
    $alt = field($p, 'image_alt', $L) ?: $title;

    /* naslovna slika i slika uz „Primena“ */
    $hero = '';
    $side = '';
    if ($heroKey) {
        $hero = site_render_picture($heroKey, $alt, $R, ['load' => 'high']);
        $side = '<div class="svc-cap shape-a">' . site_render_picture($heroKey, $alt, $R) . '</div>';
    } elseif ($p['image_type'] === 'illu' && site_illu($p['illu_key']) !== '') {
        $hero = '<div class="ditem-illu">' . site_illu($p['illu_key']) . '</div>';
    } elseif ($p['image_type'] === 'photo' && (string) $p['photo_path'] !== '') {
        $hero = site_photo((string) $p['photo_path'], (int) $p['photo_width'] ?: null, (int) $p['photo_height'] ?: null, $alt, $R, ['load' => 'high']);
        $side = '<div class="svc-cap shape-a">' . site_photo((string) $p['photo_path'], (int) $p['photo_width'] ?: null, (int) $p['photo_height'] ?: null, $alt, $R) . '</div>';
    }
    if ((string) $p['drawing_path'] !== '') {
        $side = '<figure class="ditem-drawing tbl-glass">' . site_drawing_img((string) $p['drawing_path'], $lab['drawing'] . ' — ' . $title, $R)
            . '<figcaption class="mono muted">' . e($lab['drawing']) . '</figcaption></figure>';
    }

    /* srodne stavke (aktivne) i podskup podataka za modal na ovoj strani */
    $rel = [];
    $inline = [$item];
    foreach ($item['rel'] as $rs) {
        $ri = count($rel) < SITE_REL_MAX ? catalog_item($rs) : null;
        if ($ri) {
            $rel[] = $ri;
            $inline[] = $ri;
        }
    }
    $illu = [];
    foreach ($inline as $it) {
        if (!empty($it['svg']) && site_illu($it['svg']) !== '') {
            $illu[$it['svg']] = site_illu($it['svg']);
        }
    }

    $calc = (string) ($p['calc_id'] ?? '') !== '';
    $inquiry = '../' . $lab['contactPage'] . '?konfig=' . encode_uri_component(sprintf($lab['konfig'], $title, $url)) . '#upit';
    $prefix = $R . 'js/';
    $v = '?v=' . (string) config('app.asset_version', '');
    $scripts = [$prefix . 'i18n/' . ($L === 'en' ? 'en' : 'sr') . '.js' . $v, $prefix . 'i18n/l10n.js' . $v];
    if ($calc) {
        $scripts[] = $prefix . 'catalog.js' . $v;
    }
    array_push($scripts, $prefix . 'assistant.js' . $v, $prefix . 'theme.js' . $v, $prefix . 'lang.js' . $v);
    if ($calc) {
        array_push($scripts, $prefix . 'calc.js' . $v, $prefix . 'calc-ui.js' . $v);
    }
    array_push($scripts, $prefix . 'main.js' . $v, $prefix . 'modal.js' . $v, $prefix . 'motion.js' . $v, $prefix . 'glass.js' . $v);

    return [
        'lab' => $lab, 'R' => $R, 'slug' => $slug, 'title' => $title, 'sum' => $sum, 'x' => $x, 'p' => $p,
        'url' => $url, 'urlSr' => $SITE . 'detalji/' . $slug . '.html', 'urlEn' => $SITE . 'en/details/' . $slug . '.html',
        'og' => $og, 'parent' => $kl['parent'], 'parentHref' => $parentHref, 'hero' => $hero, 'side' => $side, 'heroKey' => $heroKey,
        'rel' => $rel, 'calc' => $calc, 'inquiry' => $inquiry,
        'sitePath' => base_path() !== '/' ? ' data-site-path="' . e(base_path()) . '"' : '',
        'breadcrumb' => site_json(['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => $lab['home'], 'item' => $SITE . $lab['homeUrl']],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $kl['parent'], 'item' => $parentUrl],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $title, 'item' => $url],
        ]]),
        'schema' => site_json($kind === 'product'
            ? ['@context' => 'https://schema.org', '@type' => 'Product', 'name' => $title, 'description' => $sum, 'image' => $og,
               'url' => $url, 'brand' => ['@type' => 'Brand', 'name' => 'TRICOM'], 'manufacturer' => ['@id' => $SITE . '#org']]
            : ['@context' => 'https://schema.org', '@type' => 'Service', 'name' => $title, 'description' => $sum, 'url' => $url,
               'image' => $og, 'provider' => ['@id' => $SITE . '#org'], 'areaServed' => 'RS']),
        'inline' => site_json(array_values($inline)), 'inlineIllu' => site_json((object) $illu),
        'scriptList' => site_json($scripts),
    ];
}

/** Kartica „Srodno“ na strani detalja. $heroKey: render naslovne slike (iste veličine kao ona). */
function site_rel_card(array $it, string $L, string $R, ?string $heroKey): string
{
    $x = $it[$L] ?? $it['sr'];
    $t = (string) ($x['t'] ?? '');
    if (($it['kind'] ?? '') === 'group') {
        $href = '../' . site_page_for_lang((string) ($it['page'] ?? ''), $L);
    } else {
        $href = $it['slug'] . '.html';
    }
    $fig = '';
    if (!empty($it['img']) && site_render_exists($it['img'])) {
        $sizes = $it['img'] === $heroKey ? '(max-width: 700px) 88vw, 605px' : '(max-width: 700px) 84vw, 397px';
        $fig = '<div class="pcard__fig svc-fig">' . site_render_picture($it['img'], $t, $R, ['sizes' => $sizes]) . '</div>';
    } elseif (!empty($it['svg']) && site_illu($it['svg']) !== '') {
        $fig = '<div class="pcard__fig svc-fig ditem-illu">' . site_illu($it['svg']) . '</div>';
    } elseif (!empty($it['photo']['src'])) {
        $fig = '<div class="pcard__fig svc-fig">' . site_photo($it['photo']['src'], $it['photo']['w'] ?? null, $it['photo']['h'] ?? null, $t, $R) . '</div>';
    }
    $tags = array_slice(array_values(array_filter((array) ($x['tags'] ?? []), 'is_string')), 0, 3);
    return '<a data-item="' . e($it['slug']) . '" class="pcard ditem-rel" href="' . e($href) . '" data-reveal data-reveal-group="rel">' . $fig
        . '<div class="pcard__body"><h3>' . e($t) . '</h3>' . ((string) ($x['sum'] ?? '') !== '' ? '<p>' . e($x['sum']) . '</p>' : '')
        . ($tags ? '<div class="pcard__tags">' . implode('', array_map(static fn($g) => '<span class="tag">' . e($g) . '</span>', $tags)) . '</div>' : '')
        . '</div></a>';
}

/* ================================================================ js/items.js i sitemap.xml */

/** Vrste stavki koje dolaze iz baze (zamenjuju istoimene vrste iz js/items.js). */
const SITE_DB_KINDS = ['product', 'service', 'capability', 'reference', 'gallery'];

/**
 * js/items.js: postojeći fajl (grupe, info …) + aktivni proizvodi, usluge,
 * mogućnosti, reference i slike galerije iz baze, koji zamenjuju te vrste iz fajla.
 * Keš: uvek provera (ETag).
 */
function site_items_js(): never
{
    $base = SITE_DIR . '/js/items.js';
    $items = [];
    foreach (catalog_data()['products'] as $p) {
        if ((int) $p['is_active'] === 1) {
            $items[] = catalog_row_item($p, 'product');
        }
    }
    foreach (catalog_data()['services'] as $s) {
        if ((int) $s['is_active'] === 1) {
            $items[] = catalog_row_item($s, (string) $s['kind']);
        }
    }
    foreach (catalog_data()['client_references'] as $r) {
        if ((int) $r['is_active'] === 1) {
            $items[] = catalog_reference_item($r);
        }
    }
    foreach (site_gallery()['images'] as $g) {
        $items[] = catalog_gallery_item($g);
    }
    $js = site_json($items);
    $etag = '"' . substr(hash('sha256', (string) @filemtime($base) . '|' . $js), 0, 32) . '"';
    header('Content-Type: application/javascript; charset=utf-8');
    header('Cache-Control: no-cache');
    header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');   // mod_expires tada ne dodaje svoj rok
    header('ETag: ' . $etag);
    header('X-Content-Type-Options: nosniff');
    if (trim((string) ($_SERVER['HTTP_IF_NONE_MATCH'] ?? '')) === $etag) {
        http_response_code(304);
        exit;
    }
    readfile($base);
    echo "\n/* Proizvodi, usluge, reference i galerija iz baze (administracija) zamenjuju te vrste iz ovog fajla. */\n",
        '(function (w) {', "\n",
        "  'use strict';\n",
        '  var T = w.TRICOM_ITEMS; if (!T) return;', "\n",
        '  var K = ', site_json(SITE_DB_KINDS), ', P = ', $js, ', by = {};', "\n",
        '  P.forEach(function (x) { by[x.slug] = x; });', "\n",
        '  T.list = T.list.filter(function (x) { return K.indexOf(x.kind) < 0; }).concat(P);', "\n",
        '  var get = T.get;', "\n",
        '  T.get = function (s) { if (by[s]) return by[s]; var x = get(s); return x && K.indexOf(x.kind) >= 0 ? null : x; };', "\n",
        '})(window);', "\n";
    exit;
}

/** Tabele čiji zapisi menjaju sadržaj stalne strane (lastmod u mapi sajta), po SR adresi. */
const SITE_SITEMAP_TABLES = [
    '' => ['categories', 'products', 'services', 'faq_items'],
    'proizvodi.html' => ['categories', 'products', 'product_categories'],
    'usluge.html' => ['services', 'products'],
    'plazma.html' => ['services'],
    'o-nama.html' => ['faq_items'],
    'reference.html' => ['client_references'],
    'galerija.html' => ['gallery_categories', 'gallery_images'],
    'kontakt.html' => ['contact_settings', 'contact_locations', 'contact_phones'],
];

/**
 * /sitemap.xml: stalne strane iz šablona app/data/sitemap-pages.xml i strane
 * detalja aktivnih proizvoda i usluga iz baze; generiše se pri svakom zahtevu
 * (bez crona). lastmod strane sa sadržajem iz baze = najnovija izmena u njenim
 * tabelama (ako je novija od datuma u šablonu). Domen iz app.base_url.
 */
function site_sitemap(): never
{
    $xml = (string) @file_get_contents(APP_DIR . '/data/sitemap-pages.xml');
    $SITE = absolute_url('');
    $data = catalog_data();
    $newest = static function (array $tables) use ($data): string {
        $max = '';
        foreach ($tables as $t) {
            foreach ($data[$t] ?? [] as $r) {
                $max = max($max, substr((string) ($r['updated_at'] ?? ''), 0, 10));
            }
        }
        return $max;
    };
    /* SR i EN par stalne strane: <loc> je SR adresa ili njen EN par (hreflang sr u istom unosu) */
    $xml = preg_replace_callback('#<url>\s*<loc>[^<]*</loc>\s*<xhtml:link rel="alternate" hreflang="sr" href="https://tricom\.rs/([^"]*)"/>[\s\S]*?</url>#', static function ($m) use ($newest) {
        $tables = SITE_SITEMAP_TABLES[$m[1]] ?? [];
        $db = $tables ? $newest($tables) : '';
        return $db === '' ? $m[0] : preg_replace_callback('#<lastmod>([^<]*)</lastmod>#', static fn($l) => '<lastmod>' . max($l[1], $db) . '</lastmod>', $m[0]) ?? $m[0];
    }, $xml) ?? $xml;
    $add = '';
    /* grupe, programi i podgrupe proizvoda: svaka ima svoju kanonsku adresu (site_products_page);
       prva grupa bez programa je sama strana proizvoda (već u šablonu). Samo vidljive kategorije. */
    $catLast = $newest(SITE_SITEMAP_TABLES['proizvodi.html']);
    $catEntry = static function (string $qSr, string $qEn) use ($SITE, $catLast): string {
        $sr = $SITE . 'proizvodi.html' . $qSr;
        $en = $SITE . 'en/products.html' . $qEn;
        $out = '';
        foreach ([$sr, $en] as $loc) {
            $out .= "  <url>\n    <loc>" . e($loc) . "</loc>\n"
                . '    <xhtml:link rel="alternate" hreflang="sr" href="' . e($sr) . "\"/>\n"
                . '    <xhtml:link rel="alternate" hreflang="en" href="' . e($en) . "\"/>\n"
                . '    <xhtml:link rel="alternate" hreflang="x-default" href="' . e($sr) . "\"/>\n"
                . ($catLast !== '' ? '    <lastmod>' . e($catLast) . "</lastmod>\n" : '')
                . "    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n";
        }
        return $out;
    };
    foreach (catalog_categories(true) as $i => $g) {
        $gs = rawurlencode((string) $g['slug']);
        if ($i > 0) {
            $add .= $catEntry('?grupa=' . $gs, '?group=' . $gs);
        }
        foreach (catalog_children((int) $g['id']) as $pr) {
            $ps = '&program=' . rawurlencode((string) $pr['slug']);
            $add .= $catEntry('?grupa=' . $gs . $ps, '?group=' . $gs . $ps);
            foreach (catalog_children((int) $pr['id']) as $sg) {
                $ss = rawurlencode((string) $sg['slug']);
                $add .= $catEntry('?grupa=' . $gs . $ps . '&podgrupa=' . $ss, '?group=' . $gs . $ps . '&subgroup=' . $ss);
            }
        }
    }
    foreach (array_merge($data['products'], $data['services']) as $p) {
        if ((int) $p['is_active'] !== 1) {
            continue;
        }
        $slug = $p['slug'];
        $lastmod = substr((string) $p['updated_at'], 0, 10);
        foreach (['detalji/', 'en/details/'] as $dir) {
            $add .= "  <url>\n    <loc>" . e($SITE . $dir . $slug . '.html') . "</loc>\n"
                . '    <xhtml:link rel="alternate" hreflang="sr" href="' . e($SITE . 'detalji/' . $slug . '.html') . "\"/>\n"
                . '    <xhtml:link rel="alternate" hreflang="en" href="' . e($SITE . 'en/details/' . $slug . '.html') . "\"/>\n"
                . '    <xhtml:link rel="alternate" hreflang="x-default" href="' . e($SITE . 'detalji/' . $slug . '.html') . "\"/>\n"
                . ($lastmod !== '' ? '    <lastmod>' . e($lastmod) . "</lastmod>\n" : '')
                . "    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n";
        }
    }
    /* komentari šablona se ne šalju; detalji idu na mesto oznake @@DETAILS */
    $xml = preg_replace('#[ \t]*<!-- @@DETAILS[\s\S]*?-->\n#', $add, $xml, 1) ?? $xml;
    $xml = preg_replace('#<!--[\s\S]*?-->\n?#', '', $xml) ?? $xml;
    /* domen iz konfiguracije */
    $xml = str_replace('https://tricom.rs/', $SITE, $xml);
    header('Content-Type: application/xml; charset=utf-8');
    header('Cache-Control: no-cache');
    header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
    echo $xml;
    exit;
}
