<?php
/* TRICOM — čitanje i provera unosa iz formi (poruke na srpskom). */
defined('TRICOM') || exit;

/**
 * Tekst iz $_POST/$_GET: samo string u ispravnom UTF-8, bez kontrolnih znakova,
 * prelomi reda kao "\n", bez razmaka na krajevima. Jednoredno polje nema prelome.
 */
function input_str(array $src, string $key, bool $multiline = false): string
{
    $v = $src[$key] ?? '';
    if (!is_string($v) || !mb_check_encoding($v, 'UTF-8')) {
        return '';
    }
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    if (!$multiline) {
        $v = str_replace(["\n", "\t"], ' ', $v);
    }
    return trim($v);
}

function input_int(array $src, string $key): ?int
{
    $v = $src[$key] ?? null;
    if (is_int($v)) {
        return $v;
    }
    if (!is_string($v) || trim($v) === '') {
        return null;
    }
    $i = filter_var(trim($v), FILTER_VALIDATE_INT);
    return $i === false ? null : $i;
}

function input_bool(array $src, string $key): bool
{
    return isset($src[$key]) && in_array($src[$key], ['1', 'on', 'true', 'yes'], true);
}

/** Niz stringova (npr. name="related[]"); sve što nije string se odbacuje. */
function input_list(array $src, string $key): array
{
    $v = $src[$key] ?? [];
    if (!is_array($v)) {
        return [];
    }
    $out = [];
    foreach ($v as $item) {
        if (is_string($item) && mb_check_encoding($item, 'UTF-8')) {
            $item = trim($item);
            if ($item !== '') {
                $out[] = $item;
            }
        }
    }
    return $out;
}

/** Slug: mala slova, brojevi i pojedinačne crtice (trapezni-lim, tr-35-270). */
function is_valid_slug(string $slug, int $max = 120): bool
{
    return strlen($slug) <= $max && (bool) preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug);
}

/** Predlog sluga iz naslova: srpska latinica (đ → dj, kao u postojećim slugovima). */
function slugify(string $text): string
{
    $map = ['č' => 'c', 'ć' => 'c', 'š' => 's', 'ž' => 'z', 'đ' => 'dj', 'Č' => 'c', 'Ć' => 'c', 'Š' => 's', 'Ž' => 'z', 'Đ' => 'dj'];
    $s = mb_strtolower(strtr($text, $map), 'UTF-8');
    if (function_exists('iconv')) {
        $t = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
        if (is_string($t)) {
            $s = $t;
        }
    }
    $s = preg_replace('/[^a-z0-9]+/', '-', strtolower($s)) ?? '';
    return trim(substr(trim($s, '-'), 0, 120), '-');
}

/**
 * Sakuplja greške po polju. Primer:
 *   $v = new Validator();
 *   $v->required('title_sr', $titleSr, 'Naslov (SR)')->maxLength('title_sr', $titleSr, 255, 'Naslov (SR)');
 *   if (!$v->ok()) { … $v->errors() … }
 */
final class Validator
{
    /** @var array<string, string> */
    private array $errors = [];

    public function add(string $field, string $message): self
    {
        $this->errors[$field] ??= $message;
        return $this;
    }

    public function required(string $field, string $value, string $label): self
    {
        return trim($value) === '' ? $this->add($field, "Polje „{$label}“ je obavezno.") : $this;
    }

    public function maxLength(string $field, string $value, int $max, string $label): self
    {
        return mb_strlen($value, 'UTF-8') > $max ? $this->add($field, "Polje „{$label}“ može imati najviše {$max} znakova.") : $this;
    }

    public function minLength(string $field, string $value, int $min, string $label): self
    {
        return mb_strlen($value, 'UTF-8') < $min ? $this->add($field, "Polje „{$label}“ mora imati bar {$min} znakova.") : $this;
    }

    public function slug(string $field, string $value, string $label, int $max = 120): self
    {
        return is_valid_slug($value, $max) ? $this : $this->add($field, "Polje „{$label}“: samo mala slova bez kvačica, brojevi i crtice (npr. trapezni-lim).");
    }

    public function email(string $field, string $value, string $label): self
    {
        return $value === '' || filter_var($value, FILTER_VALIDATE_EMAIL) ? $this : $this->add($field, "Polje „{$label}“ nije ispravna adresa e-pošte.");
    }

    public function url(string $field, string $value, string $label): self
    {
        $ok = $value === '' || (filter_var($value, FILTER_VALIDATE_URL) && preg_match('#^https?://#i', $value));
        return $ok ? $this : $this->add($field, "Polje „{$label}“ mora biti adresa koja počinje sa http:// ili https://.");
    }

    /** Relativna putanja unutar sajta (assets/…, uploads/…), bez .. i bez početne kose crte. */
    public function sitePath(string $field, string $value, string $label): self
    {
        $ok = $value === '' || (preg_match('#^[A-Za-z0-9][A-Za-z0-9._/-]*$#', $value) && !str_contains($value, '..') && !str_contains($value, '//'));
        return $ok ? $this : $this->add($field, "Polje „{$label}“ mora biti putanja unutar sajta, npr. assets/old/foto/slika.jpg.");
    }

    public function intRange(string $field, ?int $value, int $min, int $max, string $label): self
    {
        return $value !== null && $value >= $min && $value <= $max ? $this : $this->add($field, "Polje „{$label}“ mora biti ceo broj od {$min} do {$max}.");
    }

    public function in(string $field, string $value, array $allowed, string $label): self
    {
        return in_array($value, $allowed, true) ? $this : $this->add($field, "Polje „{$label}“ ima nedozvoljenu vrednost.");
    }

    public function ok(): bool
    {
        return $this->errors === [];
    }

    /** @return array<string, string> */
    public function errors(): array
    {
        return $this->errors;
    }

    public function first(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
