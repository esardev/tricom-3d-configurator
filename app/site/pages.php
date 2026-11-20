<?php
/* TRICOM — strane sa zajedničkim zaglavljem i futerom iz baze (kontakt podaci,
   podmeni „Proizvodi“): početna, O nama (česta pitanja), galerija, kontakt,
   CNC plazma, kalkulatori i 404; konfigurator samo zbog domena i verzije
   resursa (bez baze, logika alata je nepromenjena). Pogledi: app/views/site/pages/<strana>-{sr,en}.php. */
defined('TRICOM') || exit;

/** Strana → [SR adresa, EN adresa] (javne .html adrese, kao do sada). */
const SITE_PAGES = [
    'home'        => ['index.html', 'en/index.html'],
    'about'       => ['o-nama.html', 'en/about.html'],
    'gallery'     => ['galerija.html', 'en/gallery.html'],
    'contact'     => ['kontakt.html', 'en/contact.html'],
    'plasma'      => ['plazma.html', 'en/plasma-cutting.html'],
    'calculators' => ['kalkulatori.html', 'en/calculators.html'],
    'configurator' => ['konfigurator.html', 'en/configurator.html'],
];

/** HTML strane (bez slanja); 404 se koristi i iz site_not_found(). */
function site_page_html(string $name, string $L): string
{
    /* konfigurator nema podmeni ni kontakt podatke: iz PHP-a dobija samo domen i verziju resursa (bez baze) */
    if ($name === 'configurator') {
        return site_view('pages/configurator-' . $L, ['L' => $L] + site_globals());
    }
    $data = ['navCats' => catalog_categories(true), 'L' => $L];
    if ($name === 'about' || $name === 'home') {
        $data['faq'] = site_faq();
    } elseif ($name === 'gallery') {
        $data['gallery'] = site_gallery();
    }
    return site_view('pages/' . $name . '-' . $L, $data + site_globals());
}

function site_page(string $name, string $L): never
{
    $paths = SITE_PAGES[$name] ?? throw new InvalidArgumentException('Nepoznata strana.');
    $public = $paths[$L === 'en' ? 1 : 0];
    /* početna: /index.php → / (ili /en/) */
    site_canonical_entry(str_ends_with($public, 'index.html') ? substr($public, 0, -strlen('index.html')) : $public);
    $html = site_page_html($name, $L);
    site_send_html_headers();
    echo $html;
    exit;
}

/* ---------------------------------------------------------------- česta pitanja (O nama, početna) */

/** Vidljiva pitanja po redosledu. */
function site_faq(): array
{
    $rows = array_values(array_filter(catalog_data()['faq_items'], static fn($f) => (int) $f['is_active'] === 1));
    usort($rows, static fn($a, $b) => [(int) $a['sort_order'], (int) $a['id']] <=> [(int) $b['sort_order'], (int) $b['id']]);
    return $rows;
}

/** Harmonika: isti markup kao do sada; $acc = id harmonike (O nama „faq2“, početna „faq“), stavke acc-<id>-N. */
function site_faq_items(array $faq, string $L, string $acc = 'faq2'): string
{
    if (!$faq) {
        return "
  " . site_empty('faq', $L);
    }
    $h = '';
    foreach (array_values($faq) as $i => $f) {
        $id = 'acc-' . $acc . '-' . $i;
        $h .= "\n  <div class=\"acc__item\">\n"
            . '    <button class="acc__btn" type="button" aria-expanded="false" aria-controls="' . $id . "\">\n"
            . '      <span>' . e(field($f, 'question', $L)) . "</span><span class=\"acc__sign\" aria-hidden=\"true\"></span>\n"
            . "    </button>\n"
            . '    <div class="acc__panel" id="' . $id . '"><div>' . implode('', array_map(static fn($p) => '<p>' . e($p) . '</p>', field_paragraphs($f, 'answer', $L))) . "</div></div>\n"
            . '  </div>';
    }
    return $h;
}

/** FAQPage JSON-LD (izostaje kad nema vidljivih pitanja). */
function site_faq_jsonld(array $faq, string $L): string
{
    if (!$faq) {
        return '';
    }
    $data = ['@context' => 'https://schema.org', '@type' => 'FAQPage'] + ($L === 'en' ? ['inLanguage' => 'en'] : []);
    $data['mainEntity'] = array_map(static fn($f) => ['@type' => 'Question', 'name' => field($f, 'question', $L),
        'acceptedAnswer' => ['@type' => 'Answer', 'text' => implode(' ', field_paragraphs($f, 'answer', $L))]], array_values($faq));
    return "<script type=\"application/ld+json\">\n" . site_json($data) . "\n</script>\n";
}
