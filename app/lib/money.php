<?php
/* TRICOM — tačna decimalna aritmetika za interni obračun (bez bcmath/GMP).
   Vrednosti su nenegativni celi brojevi zapisani kao string cifara („skalirani
   celi broj“): npr. cena 12,5 sa 4 decimale = "125000". Množenje i sabiranje
   su tačni; zaokružuje se samo pozivom big_div_round() (pola naviše), pa se
   međurezultati nikad ne zaokružuju usput. */
defined('TRICOM') || exit;

/** Bez vodećih nula ("0" ostaje "0"). */
function big_norm(string $a): string
{
    $a = ltrim($a, '0');
    return $a === '' ? '0' : $a;
}

function big_add(string $a, string $b): string
{
    $a = strrev($a);
    $b = strrev($b);
    $out = '';
    $carry = 0;
    for ($i = 0, $n = max(strlen($a), strlen($b)); $i < $n; $i++) {
        $s = (int) ($a[$i] ?? 0) + (int) ($b[$i] ?? 0) + $carry;
        $out .= (string) ($s % 10);
        $carry = intdiv($s, 10);
    }
    if ($carry) {
        $out .= (string) $carry;
    }
    return big_norm(strrev($out));
}

function big_mul(string $a, string $b): string
{
    $a = big_norm($a);
    $b = big_norm($b);
    if ($a === '0' || $b === '0') {
        return '0';
    }
    $la = strlen($a);
    $lb = strlen($b);
    $r = array_fill(0, $la + $lb, 0);
    for ($i = $la - 1; $i >= 0; $i--) {
        for ($j = $lb - 1; $j >= 0; $j--) {
            $p = (int) $a[$i] * (int) $b[$j] + $r[$i + $j + 1];
            $r[$i + $j + 1] = $p % 10;
            $r[$i + $j] += intdiv($p, 10);
        }
    }
    return big_norm(implode('', $r));
}

/** a / 10^pow, zaokruženo na ceo broj (pola naviše). */
function big_div_round(string $a, int $pow): string
{
    $a = big_norm($a);
    if ($pow <= 0) {
        return $a . str_repeat('0', -$pow);
    }
    $a = str_pad($a, $pow + 1, '0', STR_PAD_LEFT);
    $int = substr($a, 0, -$pow);
    $first = (int) substr($a, -$pow, 1);
    return $first >= 5 ? big_add($int, '1') : big_norm($int);
}

/** Celi broj (int ≥ 0) kao string cifara. */
function big_of(int $n): string
{
    if ($n < 0) {
        throw new InvalidArgumentException('Negativna vrednost u obračunu.');
    }
    return (string) $n;
}

/**
 * Broj iz forme ili baze → skalirani ceo broj sa $scale decimala.
 * Dozvoljeno: cifre, jedan decimalni zarez ili tačka, razmaci između hiljada
 * („12 500,50“). null = prazno polje; false = neispravan zapis ili previše
 * decimala / cifara.
 */
function dec_parse(?string $in, int $scale, int $maxIntDigits = 10): string|null|false
{
    $s = trim(str_replace(["\u{00A0}", "\u{202F}", ' '], '', (string) $in));
    if ($s === '') {
        return null;
    }
    if (!preg_match('/^(\d+)(?:[.,](\d+))?$/', $s, $m)) {
        return false;
    }
    $int = big_norm($m[1]);
    $frac = rtrim($m[2] ?? '', '0');
    if (strlen($int) > $maxIntDigits || strlen($frac) > $scale) {
        return false;
    }
    return big_norm($int . str_pad($frac, $scale, '0'));
}

/** Skalirani ceo broj → zapis za bazu / JSON („12.5000“). */
function dec_str(string $scaled, int $scale): string
{
    $scaled = big_norm($scaled);
    if ($scale <= 0) {
        return $scaled;
    }
    $p = str_pad($scaled, $scale + 1, '0', STR_PAD_LEFT);
    return substr($p, 0, -$scale) . '.' . substr($p, -$scale);
}

/**
 * Prikaz po srpskom pravopisu: tačka za hiljade, zarez za decimale.
 * $show = broj decimala za prikaz (zaokruživanje pola naviše, samo za prikaz);
 * $trim = bez nula na kraju decimala; $group = false za polja forme (bez tačke za hiljade,
 * jer bi je dec_parse() pročitao kao decimalni znak).
 */
function dec_fmt(string $scaled, int $scale, int $show, bool $trim = false, bool $group = true): string
{
    $v = $show < $scale ? big_div_round($scaled, $scale - $show) : big_norm($scaled) . str_repeat('0', $show - $scale);
    $p = str_pad($v, $show + 1, '0', STR_PAD_LEFT);
    $int = $show > 0 ? substr($p, 0, -$show) : $p;
    $frac = $show > 0 ? substr($p, -$show) : '';
    if ($trim) {
        $frac = rtrim($frac, '0');
    }
    if ($group) {
        $int = strrev(implode('.', str_split(strrev($int), 3)));
    }
    return $int . ($frac !== '' ? ',' . $frac : '');
}
