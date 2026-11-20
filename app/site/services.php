<?php
/* TRICOM — javni deo modula usluga: lista „Sve usluge“ na usluge.html /
   en/services.html. Strane detalja usluga i mogućnosti plazme koriste šablon
   strane detalja (site_detail_page u products.php), modal js/items.js.
   Markup je isti kao u postojećoj statičnoj strani. */
defined('TRICOM') || exit;

/** Redovi liste „Sve usluge“ (aktivne usluge vrste „service“, po redosledu). */
function site_service_rows(array $services, string $L): string
{
    $dir = $L === 'en' ? 'details/' : 'detalji/';
    $rows = [];
    foreach (array_values($services) as $i => $s) {
        $slug = e($s['slug']);
        $tags = field_lines($s, 'tags', $L);
        $anno = '';
        foreach ($tags as $k => $t) {
            $anno .= '<span>' . ($k === 0 ? '<b>' . e($t) . '</b>' : e($t)) . '</span>';
        }
        $sum = field($s, 'summary', $L);
        $rows[] = '<a data-item="' . $slug . '" class="srow trow" href="' . e($dir . $s['slug'] . '.html') . '" data-reveal data-reveal-group="sv">' . "\n"
            . '        <span class="srow__no trow__n">' . sprintf('%02d', $i + 1) . "</span>\n"
            . '        <span class="trow__svg" aria-hidden="true">' . catalog_icon('service', $s['icon_key'] ?? null) . "</span>\n"
            . '        <span class="trow__body"><span class="srow__t">' . e(field($s, 'title', $L)) . '</span>'
            . ($sum !== '' ? '<span class="srow__d">' . e($sum) . '</span>' : '') . "</span>\n"
            . ($anno !== '' ? '        <span class="trow__anno" aria-hidden="true">' . $anno . "</span>\n" : '')
            . '        <span class="srow__go">' . SITE_ARROW_PLAIN . "</span>\n"
            . '      </a>';
    }
    return $rows ? "\n      " . implode("\n      ", $rows) : "\n      " . site_empty('services', $L) . "\n    ";
}

function site_services_page(string $L): never
{
    site_canonical_entry($L === 'en' ? 'en/services.html' : 'usluge.html');
    $html = site_view('services/page-' . $L, ['services' => catalog_services('service'), 'navCats' => catalog_categories(true), 'L' => $L] + site_globals());
    site_send_html_headers();
    echo $html;
    exit;
}
