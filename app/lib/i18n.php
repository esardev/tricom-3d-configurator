<?php
/* TRICOM — dvojezični sadržaj. Jedan red u bazi nosi oba jezika u kolonama
   <polje>_sr i <polje>_en. Kao i L10N na frontendu: polje bez engleskog
   prevoda pada na srpski tekst. */
defined('TRICOM') || exit;

const LANGS = ['sr', 'en'];
const DEFAULT_LANG = 'sr';
const LANG_LABELS = ['sr' => 'Srpski', 'en' => 'Engleski'];

function lang_or_default(mixed $lang): string
{
    return is_string($lang) && in_array($lang, LANGS, true) ? $lang : DEFAULT_LANG;
}

/** Vrednost polja na jeziku: field($row, 'title', 'en') → $row['title_en'] (ili _sr kao rezerva). */
function field(array $row, string $name, string $lang, bool $fallback = true): string
{
    $value = trim((string) ($row[$name . '_' . $lang] ?? ''));
    if ($value === '' && $fallback && $lang !== DEFAULT_LANG) {
        $value = trim((string) ($row[$name . '_' . DEFAULT_LANG] ?? ''));
    }
    return $value;
}

/** Lista iz polja (jedna stavka po redu) — oznake, primene. */
function field_lines(array $row, string $name, string $lang, bool $fallback = true): array
{
    return text_lines(field($row, $name, $lang, $fallback));
}

/** Pasusi iz polja (odvojeni praznim redom) — opis. */
function field_paragraphs(array $row, string $name, string $lang, bool $fallback = true): array
{
    return text_paragraphs(field($row, $name, $lang, $fallback));
}

function text_lines(?string $text): array
{
    $out = [];
    foreach (preg_split('/\R/u', (string) $text) ?: [] as $line) {
        $line = trim($line);
        if ($line !== '') {
            $out[] = $line;
        }
    }
    return $out;
}

function text_paragraphs(?string $text): array
{
    $out = [];
    foreach (preg_split('/\R[ \t]*\R/u', trim((string) $text)) ?: [] as $p) {
        $p = trim(preg_replace('/\s*\R\s*/u', ' ', $p) ?? '');
        if ($p !== '') {
            $out[] = $p;
        }
    }
    return $out;
}

/** Imena kolona za oba jezika: ['title_sr', 'title_en']. */
function lang_columns(string $name): array
{
    return array_map(static fn($l) => $name . '_' . $l, LANGS);
}

/** Polja popunjena na samo jednom jeziku: ['title' => 'en', …] (vrednost = jezik koji nedostaje). */
function missing_translations(array $row, array $fields): array
{
    $missing = [];
    foreach ($fields as $f) {
        $sr = trim((string) ($row[$f . '_sr'] ?? ''));
        $en = trim((string) ($row[$f . '_en'] ?? ''));
        if ($sr !== '' && $en === '') {
            $missing[$f] = 'en';
        } elseif ($sr === '' && $en !== '') {
            $missing[$f] = 'sr';
        }
    }
    return $missing;
}
