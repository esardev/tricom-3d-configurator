<?php
/* TRICOM — ispis u HTML (escape). Sve što dolazi iz baze ili zahteva ide kroz e(). */
defined('TRICOM') || exit;

/** Tekst ili vrednost atributa za HTML. */
function e(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8');
}

/** Višeredni tekst: escape + <br> na prelomima reda. */
function e_lines(?string $text): string
{
    return nl2br(e($text), false);
}

/** Pasusi (odvojeni praznim redom) kao <p>…</p>. */
function e_paragraphs(?string $text, string $class = ''): string
{
    $attr = $class !== '' ? ' class="' . e($class) . '"' : '';
    return implode('', array_map(static fn($p) => '<p' . $attr . '>' . e($p) . '</p>', text_paragraphs($text)));
}

/** Adresa za href/src: dozvoljeni su http(s), mailto:, tel:, relativne putanje i heš; ostalo → '#'. */
function safe_url(?string $url): string
{
    $url = trim((string) $url);
    if ($url === '') {
        return '';
    }
    if (preg_match('#^(https?://|mailto:|tel:|/|\#|\?)#i', $url) || !preg_match('#^[a-z][a-z0-9+.-]*:#i', $url)) {
        return $url;
    }
    return '#';
}

/** JSON bezbedan za umetanje u <script> (JSON-LD, podaci za skripte). */
function json_for_script(mixed $data): string
{
    return json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
        | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
}
