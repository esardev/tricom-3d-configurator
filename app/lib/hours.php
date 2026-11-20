<?php
/* TRICOM — radno vreme: jedan raspored iz podešavanja „Kontakt“ (contact_settings).
   Iz njega se prave tekst na stranama (srpski/engleski), JSON-LD
   openingHoursSpecification i podaci za oznaku „Otvoreno / Zatvoreno“
   (js/main.js, po vremenu Europe/Belgrade). Kolone:
     open_hour / close_hour           ponedeljak–petak (obavezno)
     sat_open_hour / sat_close_hour   subota   (NULL = ne radi)
     sun_open_hour / sun_close_hour   nedelja  (NULL = ne radi)
   Sat otvaranja je uključen, sat zatvaranja nije (07–16 = od 07:00 do 15:59). */
defined('TRICOM') || exit;

/** Dani rasporeda: ključ => [kolona otvaranja, kolona zatvaranja, dani (ISO 1 = ponedeljak)]. */
const HOURS_GROUPS = [
    'week' => ['open_hour', 'close_hour', [1, 2, 3, 4, 5]],
    'sat'  => ['sat_open_hour', 'sat_close_hour', [6]],
    'sun'  => ['sun_open_hour', 'sun_close_hour', [7]],
];

/** Raspored po danima: [1 => [7, 16], …, 6 => [7, 14], 7 => null]. Baza bez kolona subote/nedelje (pre zakrpe 005) = ti dani ne rade. */
function hours_week(array $s): array
{
    $week = [];
    foreach (HOURS_GROUPS as $g => [$o, $c, $days]) {
        $open = $s[$o] ?? ($g === 'week' ? 9 : null);
        $close = $s[$c] ?? ($g === 'week' ? 17 : null);
        $span = ($open !== null && $close !== null && (int) $close > (int) $open) ? [(int) $open, (int) $close] : null;
        foreach ($days as $d) {
            $week[$d] = $span;
        }
    }
    return $week;
}

function hours_hhmm(int $h): string
{
    return sprintf('%02d:00', $h);
}

/** Tekst za strane, npr. „Ponedeljak–petak 07:00–16:00, subota 07:00–14:00, nedelja zatvoreno“. */
function hours_text(array $s, string $L): string
{
    $names = $L === 'en'
        ? ['week' => 'Monday–Friday', 'sat' => 'Saturday', 'sun' => 'Sunday', 'closed' => 'closed']
        : ['week' => 'Ponedeljak–petak', 'sat' => 'subota', 'sun' => 'nedelja', 'closed' => 'zatvoreno'];
    $week = hours_week($s);
    $parts = [];
    foreach (HOURS_GROUPS as $g => [, , $days]) {
        $span = $week[$days[0]];
        $parts[] = $names[$g] . ' ' . ($span ? hours_hhmm($span[0]) . '–' . hours_hhmm($span[1]) : $names['closed']);
    }
    return implode(', ', $parts);
}

/** schema.org openingHoursSpecification: dani sa istim satima u jednoj stavci; dan koji ne radi se izostavlja. */
function hours_ld(array $s): array
{
    $en = [1 => 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    $groups = [];
    foreach (hours_week($s) as $d => $span) {
        if ($span) {
            $groups[$span[0] . '-' . $span[1]][] = $d;
        }
    }
    $out = [];
    foreach ($groups as $days) {
        $span = hours_week($s)[$days[0]];
        $out[] = ['@type' => 'OpeningHoursSpecification', 'dayOfWeek' => array_map(static fn($d) => $en[$d], $days),
                  'opens' => hours_hhmm($span[0]), 'closes' => hours_hhmm($span[1])];
    }
    return $out;
}

/** Za data-week u futeru: ponedeljak…nedelja, „7-16“ ili „-“ (ne radi). */
function hours_data(array $s): string
{
    return implode(',', array_map(static fn($span) => $span ? $span[0] . '-' . $span[1] : '-', hours_week($s)));
}

/** Kratko, za oznake: „Pon–pet 07–16 · sub 07–14“ (dani koji ne rade se izostavljaju). */
function hours_short(array $s, string $L): string
{
    $names = $L === 'en' ? ['week' => 'Mon–Fri', 'sat' => 'Sat', 'sun' => 'Sun'] : ['week' => 'Pon–pet', 'sat' => 'sub', 'sun' => 'ned'];
    $week = hours_week($s);
    $parts = [];
    foreach (HOURS_GROUPS as $g => [, , $days]) {
        if ($span = $week[$days[0]]) {
            $parts[] = $names[$g] . ' ' . sprintf('%02d–%02d', $span[0], $span[1]);
        }
    }
    return implode(' · ', $parts);
}
