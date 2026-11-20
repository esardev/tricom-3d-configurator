<?php
/* TRICOM — prijem otpremljenih fajlova u uploads/.
   Tip se određuje iz sadržaja (finfo + getimagesize), ne iz imena; ime je
   nasumično, ekstenzija po tipu. Dozvoljeni su samo JPEG, PNG, WebP i (za
   dokumente) PDF — bez SVG-a, HTML-a i skripti. uploads/.htaccess dodatno
   zabranjuje izvršavanje i služi samo te tipove. */
defined('TRICOM') || exit;

const UPLOAD_TYPES = [
    'image'    => ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'],
    'document' => ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'application/pdf' => 'pdf'],
];

final class UploadException extends RuntimeException {}

/** Da li je u formi izabran fajl za ovo polje. */
function upload_present(string $field): bool
{
    $f = $_FILES[$field] ?? null;
    return is_array($f) && isset($f['error']) && !is_array($f['error']) && (int) $f['error'] !== UPLOAD_ERR_NO_FILE;
}

/**
 * Prima fajl iz $_FILES[$field] u uploads/<$subdir>/<godina>/.
 * Vraća ['path' => 'uploads/…', 'width', 'height', 'mime', 'size'].
 * Greška → UploadException sa porukom za korisnika.
 */
function upload_receive(string $field, string $subdir, string $kind = 'image'): array
{
    return upload_receive_file($_FILES[$field] ?? null, $subdir, $kind);
}

/**
 * Više fajlova iz jednog polja (<input type="file" name="x[]" multiple>):
 * lista zapisa u obliku jednog $_FILES unosa; prazni izbori se izostavljaju.
 */
function upload_files(string $field): array
{
    $f = $_FILES[$field] ?? null;
    if (!is_array($f) || !isset($f['error']) || !is_array($f['error'])) {
        return [];
    }
    $out = [];
    foreach (array_keys($f['error']) as $k) {
        if (is_array($f['error'][$k]) || (int) $f['error'][$k] === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        $out[] = ['name' => (string) ($f['name'][$k] ?? ''), 'tmp_name' => (string) ($f['tmp_name'][$k] ?? ''),
                  'error' => (int) $f['error'][$k], 'size' => (int) ($f['size'][$k] ?? 0)];
    }
    return $out;
}

/** Prima jedan fajl (zapis kao u $_FILES); provere i čuvanje kao upload_receive(). */
function upload_receive_file(?array $f, string $subdir, string $kind = 'image'): array
{
    $allowed = UPLOAD_TYPES[$kind] ?? throw new InvalidArgumentException('Nepoznat tip otpremanja.');
    if (!preg_match('#^[a-z0-9-]+(/[a-z0-9-]+)?$#', $subdir)) {
        throw new InvalidArgumentException('Neispravan folder za otpremanje.');
    }
    if (!is_array($f) || !isset($f['error'], $f['tmp_name'], $f['size']) || is_array($f['error'])) {
        throw new UploadException('Fajl nije primljen.');
    }
    if ((int) $f['error'] !== UPLOAD_ERR_OK) {
        throw new UploadException(upload_error_message((int) $f['error']));
    }
    $tmp = (string) $f['tmp_name'];
    if (!is_uploaded_file($tmp)) {
        throw new UploadException('Fajl nije primljen.');
    }
    $size = (int) filesize($tmp);
    if ($size <= 0) {
        throw new UploadException('Fajl je prazan.');
    }
    if ($size > upload_max_bytes()) {
        throw new UploadException('Fajl je veći od dozvoljenih ' . upload_max_label() . '.');
    }

    $mime = (string) (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
    if (!isset($allowed[$mime])) {
        throw new UploadException('Dozvoljeni su samo ' . upload_types_label($kind) . '.');
    }
    $width = $height = null;
    if (str_starts_with($mime, 'image/')) {
        $info = @getimagesize($tmp);
        if (!$info || ($info['mime'] ?? '') !== $mime || $info[0] < 1 || $info[1] < 1) {
            throw new UploadException('Slika nije ispravna ili je oštećena.');
        }
        if ($info[0] * $info[1] > (int) config('uploads.max_pixels', 40000000)) {
            throw new UploadException('Slika ima previše piksela; smanjite je pre otpremanja.');
        }
        [$width, $height] = [(int) $info[0], (int) $info[1]];
    } elseif ($mime === 'application/pdf') {
        $head = (string) file_get_contents($tmp, false, null, 0, 5);
        if ($head !== '%PDF-') {
            throw new UploadException('PDF nije ispravan.');
        }
    }

    $relDir = 'uploads/' . $subdir . '/' . date('Y');
    $absDir = SITE_DIR . '/' . $relDir;
    upload_ensure_dir($absDir);
    $name = bin2hex(random_bytes(12)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($tmp, $absDir . '/' . $name)) {
        throw new UploadException('Fajl nije mogao da se sačuva na serveru (proverite dozvole foldera uploads/).');
    }
    @chmod($absDir . '/' . $name, 0644);

    return ['path' => $relDir . '/' . $name, 'width' => $width, 'height' => $height, 'mime' => $mime, 'size' => $size];
}

/** Briše fajl koji je otpremila administracija (samo unutar uploads/), zajedno sa njegovim umanjenim varijantama. */
function upload_delete(?string $path): bool
{
    $path = (string) $path;
    if (!str_starts_with($path, 'uploads/') || str_contains($path, '..')) {
        return false;
    }
    $root = realpath(SITE_DIR . '/uploads');
    $file = realpath(SITE_DIR . '/' . $path);
    if ($root === false || $file === false || !str_starts_with($file, $root . DIRECTORY_SEPARATOR) || !is_file($file)) {
        return false;
    }
    $base = preg_replace('/\.[a-z0-9]+$/i', '', $file) ?? $file;
    foreach (glob($base . '-*w.webp') ?: [] as $v) {
        if (preg_match('/-\d+w\.webp$/', $v)) {
            @unlink($v);
        }
    }
    return @unlink($file);
}

/**
 * Umanjene WebP varijante <ime>-<širina>w.webp pored otpremljene slike (za mrežu
 * galerije; frontend ih nalazi kao i kod postojećih slika). Samo ako server ima
 * GD sa WebP podrškom i dovoljno memorije; inače se ne pravi ništa i strana
 * koristi sam fajl. Vraća napravljene putanje.
 */
function upload_make_variants(string $path, array $widths): array
{
    if (!str_starts_with($path, 'uploads/') || !function_exists('imagewebp') || !function_exists('imagecreatetruecolor')) {
        return [];
    }
    $abs = SITE_DIR . '/' . $path;
    $info = @getimagesize($abs);
    if (!$info) {
        return [];
    }
    [$w, $h] = [(int) $info[0], (int) $info[1]];
    /* procena memorije (izvor + najveća varijanta, ~5 B po pikselu); bez rizika od prekida skripte */
    $limit = ini_bytes((string) ini_get('memory_limit'));
    if ($limit > 0 && memory_get_usage() + $w * $h * 5 * 2 > $limit) {
        return [];
    }
    $src = match ($info['mime'] ?? '') {
        'image/jpeg' => @imagecreatefromjpeg($abs),
        'image/png' => @imagecreatefrompng($abs),
        'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($abs) : false,
        default => false,
    };
    if (!$src) {
        return [];
    }
    $made = [];
    $base = preg_replace('/\.[a-z0-9]+$/i', '', $path) ?? $path;
    foreach (array_unique(array_map('intval', $widths)) as $tw) {
        if ($tw <= 0 || $tw >= $w) {
            continue;
        }
        $th = max(1, (int) round($h * $tw / $w));
        $dst = imagecreatetruecolor($tw, $th);
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $tw, $th, $w, $h);
        $out = $base . '-' . $tw . 'w.webp';
        if (@imagewebp($dst, SITE_DIR . '/' . $out, 82)) {
            @chmod(SITE_DIR . '/' . $out, 0644);
            $made[] = $out;
        }
        imagedestroy($dst);
    }
    imagedestroy($src);
    return $made;
}

/** Pravi folder (i roditelje) sa praznim index.html u svakom novom nivou. */
function upload_ensure_dir(string $absDir): void
{
    if (is_dir($absDir)) {
        return;
    }
    $parent = dirname($absDir);
    if ($parent !== $absDir && !is_dir($parent)) {
        upload_ensure_dir($parent);
    }
    if (!@mkdir($absDir, 0755) && !is_dir($absDir)) {
        throw new UploadException('Folder za otpremanje ne može da se napravi (proverite dozvole foldera uploads/).');
    }
    @file_put_contents($absDir . '/index.html', '');
}

/** Najveća veličina: manja od app podešavanja i PHP ograničenja. */
function upload_max_bytes(): int
{
    $limits = [(int) config('uploads.max_mb', 8) * 1024 * 1024];
    foreach (['upload_max_filesize', 'post_max_size'] as $ini) {
        $b = ini_bytes((string) ini_get($ini));
        if ($b > 0) {
            $limits[] = $b;
        }
    }
    return min($limits);
}

function upload_max_label(): string
{
    return number_format(upload_max_bytes() / 1048576, 1, ',', '.') . ' MB';
}

function upload_types_label(string $kind): string
{
    return $kind === 'document' ? 'JPG, PNG, WebP i PDF fajlovi' : 'JPG, PNG i WebP slike';
}

function ini_bytes(string $value): int
{
    $value = trim($value);
    if ($value === '' || $value === '-1') {
        return 0;
    }
    $n = (int) $value;
    return match (strtolower(substr($value, -1))) {
        'g' => $n * 1073741824,
        'm' => $n * 1048576,
        'k' => $n * 1024,
        default => $n,
    };
}

function upload_error_message(int $code): string
{
    return match ($code) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Fajl je veći od dozvoljenih ' . upload_max_label() . '.',
        UPLOAD_ERR_PARTIAL => 'Fajl je samo delimično otpremljen; pokušajte ponovo.',
        UPLOAD_ERR_NO_FILE => 'Nije izabran fajl.',
        UPLOAD_ERR_NO_TMP_DIR, UPLOAD_ERR_CANT_WRITE => 'Server trenutno ne može da primi fajl.',
        UPLOAD_ERR_EXTENSION => 'Server je odbio fajl.',
        default => 'Otpremanje nije uspelo.',
    };
}
