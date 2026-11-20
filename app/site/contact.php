<?php
/* TRICOM — kontakt podaci iz podešavanja „Kontakt“ (jedan red + lokacije +
   telefoni): zaglavlje, mobilni meni i futer svih PHP strana (site_c,
   site_footer_sheet) i blokovi strane kontakt.html (site_contact_blocks,
   site_contact_locs). Sve vrednosti se escapuju; HTML iz baze se ne ispisuje. */
defined('TRICOM') || exit;

require_once APP_DIR . '/lib/hours.php';

const SVG_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
const SVG_SHIELD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.6 8.2-8 9-4.4-.8-8-4-8-9V6l8-3z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>';
const SVG_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';

/** Podešavanja, lokacije (po redosledu) sa telefonima i glavni telefon (prvi telefon prve lokacije).
    'locations' = samo javne lokacije (is_public; kupcima: zaglavlje, futer, kontakt, mape);
    'all' = sve, i lokacija koja se ne prikazuje (npr. sedište — samo podaci o firmi i JSON-LD). */
function site_contact(): array
{
    static $c = null;
    if ($c !== null) {
        return $c;
    }
    $d = catalog_data();
    $settings = $d['contact_settings'][0] ?? [];
    $locations = $d['contact_locations'];
    usort($locations, static fn($a, $b) => [(int) $a['sort_order'], (int) $a['id']] <=> [(int) $b['sort_order'], (int) $b['id']]);
    foreach ($locations as &$loc) {
        $phones = array_values(array_filter($d['contact_phones'], static fn($p) => (int) $p['location_id'] === (int) $loc['id']));
        usort($phones, static fn($a, $b) => [(int) $a['sort_order'], (int) $a['id']] <=> [(int) $b['sort_order'], (int) $b['id']]);
        $loc['phones'] = $phones;
    }
    unset($loc);
    $all = $locations;
    $locations = array_values(array_filter($locations, static fn($l) => (int) ($l['is_public'] ?? 1) === 1));
    $primary = null;
    foreach ($locations as $loc) {
        if ($loc['phones']) {
            $primary = $loc['phones'][0];
            break;
        }
    }
    return $c = ['settings' => $settings, 'locations' => $locations, 'all' => $all, 'primary' => $primary];
}

/** Sedište (registrovana adresa) za podatke o firmi: lokacija „direkcija“ (ista kao adresa u JSON-LD Organization). */
function site_registered_office(): ?array
{
    foreach (site_contact()['all'] as $l) {
        if ($l['slug'] === 'direkcija' && trim((string) $l['street']) !== '') {
            return $l;
        }
    }
    return null;
}

/** Telefoni u bloku „Zatražite ponudu“ (futer svih strana): oznaka „u bloku ponude“ u administraciji; bez oznake = glavni telefon. */
function site_quote_phones(string $L): string
{
    $c = site_contact();
    $list = [];
    foreach ($c['locations'] as $loc) {
        foreach ($loc['phones'] as $p) {
            if ((int) ($p['in_quote'] ?? 0) === 1 && !isset($list[$p['tel']])) {
                $list[$p['tel']] = $p;
            }
        }
    }
    if (!$list && $c['primary']) {
        $list[] = $c['primary'];
    }
    return implode("
        ", array_map(static fn($p) => '<a class="btn btn--lg btn--ghost btn--block" href="tel:' . e($p['tel']) . '">' . SVG_PHONE . ' ' . site_tel_html($p, $L) . '</a>', $list));
}

/** Telefon za ispis: razmaci → &nbsp; (broj se ne prelama), kao na postojećim stranama. */
function site_tel_html(array $phone, string $L): string
{
    $display = field($phone, 'display', $L) ?: (string) $phone['tel'];
    return str_replace(' ', '&nbsp;', e($display));
}

/** Jedna vrednost za zajedničke delove strane, escapovana za HTML. */
function site_c(string $key, string $L): string
{
    $c = site_contact();
    $s = $c['settings'];
    $p = $c['primary'];
    $first = $c['locations'][0] ?? null;
    return match ($key) {
        'tel' => e($p['tel'] ?? ''),
        'tel_html' => $p ? site_tel_html($p, $L) : '',
        'email' => e($s['footer_email'] ?? ''),
        'hours' => e(hours_text($s, $L)),
        'hours_short' => e(hours_short($s, $L)),
        'pib' => e($s['pib'] ?? ''),
        'fb' => e($s['facebook_url'] ?? ''),
        'address_short' => $first ? e(trim($first['street'] . ', ' . $first['place'], ', ')) : '',
        'locations_heading' => e(field($s, 'locations_heading', $L)),
        'locations_intro' => e(field($s, 'locations_intro', $L)),
        default => throw new InvalidArgumentException('Nepoznat kontakt podatak: ' . $key),
    };
}

function site_contact_labels(string $L): array
{
    return $L === 'en'
        ? ['seat' => 'REGISTERED OFFICE', 'email' => 'EMAIL', 'hours' => 'OPENING HOURS', 'pib' => 'TAX ID', 'address' => 'ADDRESS', 'phone' => 'PHONE', 'for' => 'FOR',
           'company' => 'Company details', 'name' => 'NAME', 'legal' => 'full legal name: ', 'pibLong' => 'TAX ID (PIB)', 'reg' => 'COMPANY REGISTRATION NUMBER',
           'code' => 'ACTIVITY CODE', 'vat' => 'VAT', 'vatCert' => 'certificate (in Serbian)', 'vatRec' => 'VAT register record (PDF, in Serbian)',
           'bank' => 'BANK ACCOUNT', 'activity' => 'BUSINESS ACTIVITY', 'founded' => 'FOUNDED', 'director' => 'MANAGING DIRECTOR', 'copy' => 'Click to copy',
           'showMap' => 'Show map', 'openMap' => 'Open in Google Maps', 'mapNote' => 'The map loads from Google only after you click.', 'hl' => 'en']
        : ['seat' => 'SEDIŠTE', 'email' => 'E-POŠTA', 'hours' => 'RADNO VREME', 'pib' => 'PIB', 'address' => 'ADRESA', 'phone' => 'TELEFON', 'for' => 'ZA',
           'company' => 'Podaci o firmi', 'name' => 'NAZIV', 'legal' => 'pun naziv: ', 'pibLong' => 'PIB', 'reg' => 'MATIČNI BROJ',
           'code' => 'ŠIFRA DELATNOSTI', 'vat' => 'PDV', 'vatCert' => 'potvrda', 'vatRec' => 'PDV evidencija (PDF)',
           'bank' => 'TEKUĆI RAČUN', 'activity' => 'DELATNOST', 'founded' => 'OSNOVANO', 'director' => 'DIREKTOR', 'copy' => 'Kliknite da kopirate',
           'showMap' => 'Prikaži mapu', 'openMap' => 'Otvori u Google mapama', 'mapNote' => 'Mapa se učitava sa Google-a tek posle klika.', 'hl' => 'sr'];
}

/** Tabela „Kontakt“ u futeru: lokacije sa telefonima iz futera, e-pošta, radno vreme, PIB. */
function site_footer_sheet(string $L): string
{
    $c = site_contact();
    $s = $c['settings'];
    $lab = site_contact_labels($L);
    $row = static fn(string $dt, string $dd): string => "        <div class=\"fsheet__r\">\n          <dt>" . $dt . "</dt>\n          <dd>" . $dd . "</dd>\n        </div>\n";
    $h = "<dl class=\"fsheet\">\n";
    foreach ($c['locations'] as $loc) {
        $tels = array_map(static fn($p) => '<a href="tel:' . e($p['tel']) . '">' . site_tel_html($p, $L) . '</a>', array_filter($loc['phones'], static fn($p) => (int) $p['in_footer'] === 1));
        $addr = e(trim($loc['street'] . ', ' . trim($loc['postal_code'] . ' ' . $loc['place']), ', '));
        $h .= $row(e(mb_strtoupper(field($loc, 'short_name', $L) ?: field($loc, 'title', $L), 'UTF-8')), $addr . ($tels ? "<br>\n            " . implode(' · ', $tels) : ''));
    }
    if ((string) ($s['footer_email'] ?? '') !== '') {
        $h .= $row($lab['email'], '<a href="mailto:' . e($s['footer_email']) . '">' . e($s['footer_email']) . '</a>');
    }
    /* status „Otvoreno/Zatvoreno“ (js/main.js) računa po rasporedu iz podešavanja (data-week, pon…ned),
       po vremenu Europe/Belgrade; data-open/data-close (radni dani) ostaju za stariji main.js iz keša */
    $h .= $row($lab['hours'], e(hours_text($s, $L)) . '<span class="fhours" id="fhours" aria-live="polite" data-week="' . e(hours_data($s))
        . '" data-label-sr="' . e(hours_text($s, 'sr')) . '" data-label-en="' . e(hours_text($s, 'en')) . '" data-open="' . (int) ($s['open_hour'] ?? 9) . '" data-close="' . (int) ($s['close_hour'] ?? 17) . '"></span>');
    if ((string) ($s['pib'] ?? '') !== '') {
        $h .= $row($lab['pib'], e($s['pib']));
    }
    return $h . '      </dl>';
}

/** Veza na dokument sa sajta (?v= samo za slike, kao do sada). */
function site_doc_href(string $path, string $R): string
{
    return str_ends_with(strtolower($path), '.pdf') ? $R . $path : site_src($R, $path);
}

/** Strana kontakt: blokovi lokacija (adresa, telefoni, e-pošta; radno vreme kod prve) i podaci o firmi. */
function site_contact_blocks(string $L): string
{
    $c = site_contact();
    $s = $c['settings'];
    $lab = site_contact_labels($L);
    $R = $L === 'en' ? '../' : '';
    $line = static fn(string $dt, string $dd): string => '            <div class="infoline"><dt>' . $dt . '</dt><dd>' . $dd . "</dd></div>\n";
    $block = static fn(string $icon, string $title, string $lines, bool $first): string => "\n        <div class=\"infoblock g-card kf-info" . ($first ? '' : ' u-mt-16') . "\">\n          <h3>" . $icon . ' ' . $title . "</h3>\n          <dl>\n" . $lines . "          </dl>\n        </div>\n";
    $h = '';
    foreach ($c['locations'] as $i => $loc) {
        $city = field($loc, 'city', $L);
        $lines = $line($lab['address'], e($loc['street']) . '<br>' . e(trim($loc['postal_code'] . ' ' . $loc['place'])) . ($city !== '' ? ', ' . e($city) : ''));
        if ($loc['phones']) {
            $lines .= $line($lab['phone'], implode('<br>', array_map(static fn($p) => '<a href="tel:' . e($p['tel']) . '">' . site_tel_html($p, $L) . '</a>', $loc['phones'])));
        }
        $mails = text_lines((string) $loc['emails']);
        if ($mails) {
            $lines .= $line($lab['email'], implode('<br>', array_map(static fn($m) => '<a href="mailto:' . e($m) . '">' . e($m) . '</a>', $mails)));
        }
        if ($i === 0) {
            $lines .= $line($lab['hours'], e(hours_text($s, $L)));
        }
        $h .= $block(SVG_PHONE, e(field($loc, 'title', $L)), $lines, $i === 0);
    }

    $copy = static fn(string $v): string => '<button class="mono u-accent" type="button" data-copy="' . e($v) . '" title="' . e($lab['copy']) . '">' . e($v) . '</button>';
    $lines = '';
    if ((string) ($s['company_name'] ?? '') !== '' || (string) ($s['company_legal_name'] ?? '') !== '') {
        $lines .= $line($lab['name'], e($s['company_name']) . ((string) $s['company_legal_name'] !== '' ? '<br><span class="u-sm muted">' . e($lab['legal'] . $s['company_legal_name']) . '</span>' : ''));
    }
    /* sedište: zakonski podatak o pružaocu usluga — samo ovde, ne kao lokacija za kupce */
    if ($seat = site_registered_office()) {
        $lines .= $line($lab['seat'], e($seat['street']) . ', ' . e(trim($seat['postal_code'] . ' ' . $seat['place'])));
    }
    foreach ([['pibLong', 'pib', true], ['reg', 'registration_no', true], ['code', 'activity_code', false]] as [$lk, $col, $btn]) {
        if ((string) ($s[$col] ?? '') !== '') {
            $lines .= $line($lab[$lk], $btn ? $copy((string) $s[$col]) : e($s[$col]));
        }
    }
    $vat = field($s, 'vat', $L);
    $docs = [];
    foreach ([['vat_certificate_path', 'vatCert'], ['vat_record_path', 'vatRec']] as [$col, $lk]) {
        if ((string) ($s[$col] ?? '') !== '') {
            $docs[] = '<a href="' . e(site_doc_href((string) $s[$col], $R)) . '">' . e($lab[$lk]) . '</a>';
        }
    }
    if ($vat !== '' || $docs) {
        $lines .= $line($lab['vat'], e($vat) . ($vat !== '' && $docs ? ' — ' : '') . implode(' · ', $docs));
    }
    if ((string) ($s['bank_name'] ?? '') !== '' || (string) ($s['bank_account'] ?? '') !== '') {
        $lines .= $line($lab['bank'], trim(e($s['bank_name']) . ' ' . ((string) $s['bank_account'] !== '' ? '<span class="nowrap">' . e($s['bank_account']) . '</span>' : '')));
    }
    foreach ([['activity', 'activity'], ['founded', 'founded']] as [$lk, $f]) {
        if (field($s, $f, $L) !== '') {
            $lines .= $line($lab[$lk], e(field($s, $f, $L)));
        }
    }
    if ((string) ($s['director'] ?? '') !== '') {
        $lines .= $line($lab['director'], e($s['director']));
    }
    if ((string) ($s['facebook_url'] ?? '') !== '') {
        $lines .= $line('FACEBOOK', '<a href="' . e($s['facebook_url']) . '" rel="noopener">' . e((string) $s['facebook_label'] !== '' ? $s['facebook_label'] : $s['facebook_url']) . '</a>');
    }
    if ($lines !== '') {
        $h .= $block(SVG_SHIELD, e($lab['company']), $lines, $h === '');
    }
    return $h . "\n      ";
}

/** Upit za Google mape kao u postojećim adresama (razmak → +, zarez ostaje). */
function site_map_query(string $q): string
{
    return str_replace('%2C', ',', urlencode($q));
}

/** Strana kontakt: kartice lokacija sa mapom (učitava se tek na klik) i namenom. */
function site_contact_locs(string $L): string
{
    $lab = site_contact_labels($L);
    $R = $L === 'en' ? '../' : '';
    $parts = [];
    foreach (site_contact()['locations'] as $loc) {
        $h = '<div class="g-card kf-loc">' . "\n";
        $q = trim((string) $loc['map_query']);
        if ($q !== '') {
            $mq = site_map_query($q);
            $h .= '        <div class="map-frame map-facade" data-map="' . e('https://www.google.com/maps?q=' . $mq . '&hl=' . $lab['hl'] . '&z=16&output=embed') . '" data-map-title="' . e(field($loc, 'map_title', $L)) . "\">\n"
                . '          <img class="map-facade__img" src="' . e(site_src($R, 'assets/map/map-facade.svg')) . "\" alt=\"\" width=\"1600\" height=\"700\" loading=\"lazy\" decoding=\"async\">\n"
                . "          <div class=\"map-facade__ui\">\n"
                . '            <button type="button" class="btn btn--sm map-facade__btn" data-map-load>' . e($lab['showMap']) . "</button>\n"
                . '            <a class="map-facade__link" href="' . e('https://www.google.com/maps/search/?api=1&query=' . $mq) . '" target="_blank" rel="noopener">' . e($lab['openMap']) . " <span aria-hidden=\"true\">↗</span></a>\n"
                . '            <p class="map-facade__note">' . e($lab['mapNote']) . "</p>\n"
                . "          </div>\n        </div>\n";
        }
        $h .= '        <div class="infoblock u-bt-0"><span class="hud hud--dot is-active kf-pin" aria-hidden="true"></span>' . "\n"
            . '          <h3>' . SVG_PIN . ' ' . e(field($loc, 'short_name', $L) ?: field($loc, 'title', $L)) . "</h3>\n          <dl>\n"
            . '            <div class="infoline"><dt>' . e($lab['address']) . '</dt><dd>' . e(trim($loc['street'] . ', ' . $loc['place'], ', ')) . "</dd></div>\n"
            . (field($loc, 'purpose', $L) !== '' ? '            <div class="infoline"><dt>' . e($lab['for']) . '</dt><dd>' . e(field($loc, 'purpose', $L)) . "</dd></div>\n" : '')
            . "          </dl>\n        </div>\n      </div>";
        $parts[] = $h;
    }
    return $parts ? "\n      " . implode("\n      ", $parts) . "\n    " : '';
}

/* ---------------------------------------------------------------- JSON-LD (početna, kontakt) */

/**
 * Strukturisani podaci o firmi i lokacijama (Organization, LocalBusiness):
 * šablon je postojeći JSON sa strane, a kontakt vrednosti u njemu su oznake
 * "@@c:<ključ>" (konvertor) koje se ovde zamenjuju podacima iz podešavanja.
 * Prazna vrednost izbacuje ključ; "@@site@@" je koren sajta.
 */
function site_contact_ld(string $tpl, string $L): string
{
    $site = absolute_url('');
    $walk = static function (array $a) use (&$walk, $L, $site): array {
        $list = array_is_list($a);
        foreach ($a as $k => $v) {
            if (is_array($v)) {
                $a[$k] = $walk($v);
            } elseif (is_string($v) && str_starts_with($v, '@@c:')) {
                $x = site_ld_value(substr($v, 4), $L);
                if ($x === null || $x === '' || $x === []) {
                    unset($a[$k]);
                } else {
                    $a[$k] = $x;
                }
            } elseif (is_string($v)) {
                $a[$k] = str_replace('@@site@@', $site, $v);
            }
        }
        return $list ? array_values($a) : $a;
    };
    return "<script type=\"application/ld+json\">\n" . site_json($walk(json_decode($tpl, true, 64, JSON_THROW_ON_ERROR))) . "\n</script>\n";
}

/** Vrednost za oznaku "@@c:<ključ>"; lokacija se bira po slugu (loc:<slug>:<polje>). */
function site_ld_value(string $key, string $L): mixed
{
    $c = site_contact();
    $s = $c['settings'];
    $hour = static fn(string $col, int $d): string => sprintf('%02d:00', (int) ($s[$col] ?? $d));
    if (str_starts_with($key, 'loc:')) {
        [, $slug, $f] = explode(':', $key, 3) + [2 => ''];
        $loc = null;
        foreach ($c['all'] as $l) {
            if ($l['slug'] === $slug) {
                $loc = $l;
            }
        }
        if (!$loc) {
            return null;
        }
        return match ($f) {
            'tel' => $loc['phones'][0]['tel'] ?? null,
            'tels' => array_values(array_unique(array_column($loc['phones'], 'tel'))),
            'street' => (string) $loc['street'],
            'locality' => trim($loc['place'] . ', ' . field($loc, 'city', $L), ', '),
            'postal' => (string) $loc['postal_code'],
            /* koordinate samo kad je upit za mapu „širina,dužina“ */
            'geo' => preg_match('/^(-?\d{1,2}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)$/', trim((string) $loc['map_query']), $m)
                ? ['@type' => 'GeoCoordinates', 'latitude' => (float) $m[1], 'longitude' => (float) $m[2]] : null,
            default => throw new InvalidArgumentException('Nepoznat podatak lokacije: ' . $f),
        };
    }
    $tels = [];
    foreach ($c['locations'] as $l) {
        array_push($tels, ...array_column($l['phones'], 'tel'));
    }
    return match ($key) {
        'tel' => $c['primary']['tel'] ?? null,
        'tels' => array_values(array_unique($tels)),
        'email' => (string) ($s['footer_email'] ?? ''),
        'same_as' => (string) ($s['facebook_url'] ?? '') !== '' ? [$s['facebook_url']] : null,
        'pib' => (string) ($s['pib'] ?? ''),
        'legal_name' => trim(str_replace(['„', '“', '”', '"'], '', (string) ($s['company_legal_name'] ?? ''))),
        'registration_no' => (string) ($s['registration_no'] ?? ''),
        'activity_code' => (string) ($s['activity_code'] ?? ''),
        'hours_spec' => hours_ld($s),
        'opens' => $hour('open_hour', 9),
        'closes' => $hour('close_hour', 17),
        default => throw new InvalidArgumentException('Nepoznat kontakt podatak: ' . $key),
    };
}
