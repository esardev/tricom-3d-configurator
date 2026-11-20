<?php
/* TRICOM — pomoćnici za forme administracije (polja, dvojezični parovi, greške).
   Sve vrednosti se escapuju; $errors je niz [ime polja => poruka]. */
defined('TRICOM') || exit;

function adm_error(array $errors, string $name): string
{
    return isset($errors[$name]) ? '<small class="adm-err" id="err-' . e($name) . '">' . e($errors[$name]) . '</small>' : '';
}

function adm_attrs(array $attrs): string
{
    $out = '';
    foreach ($attrs as $k => $v) {
        if ($v === false || $v === null) {
            continue;
        }
        $out .= $v === true ? ' ' . e($k) : ' ' . e($k) . '="' . e((string) $v) . '"';
    }
    return $out;
}

/** Jednoredno polje. $o: type, hint, maxlength, required, readonly, placeholder, pattern, class */
function adm_input(string $name, mixed $value, string $label, array $errors = [], array $o = []): string
{
    $attrs = [
        'type' => $o['type'] ?? 'text', 'name' => $name, 'id' => 'f-' . $name, 'value' => (string) ($value ?? ''),
        'maxlength' => $o['maxlength'] ?? null, 'required' => !empty($o['required']), 'readonly' => !empty($o['readonly']),
        'placeholder' => $o['placeholder'] ?? null, 'pattern' => $o['pattern'] ?? null, 'min' => $o['min'] ?? null, 'max' => $o['max'] ?? null,
        'lang' => $o['lang'] ?? null, 'aria-invalid' => isset($errors[$name]) ? 'true' : null,
        'aria-describedby' => isset($errors[$name]) ? 'err-' . $name : null, 'spellcheck' => $o['spellcheck'] ?? null,
    ];
    return '<label class="adm-field' . (isset($o['class']) ? ' ' . e($o['class']) : '') . '" for="f-' . e($name) . '"><span>' . e($label) . '</span>'
        . '<input' . adm_attrs($attrs) . '>'
        . (isset($o['hint']) ? '<small>' . e($o['hint']) . '</small>' : '') . adm_error($errors, $name) . '</label>';
}

/** Višeredno polje. $o: rows, hint, maxlength, lang */
function adm_textarea(string $name, mixed $value, string $label, array $errors = [], array $o = []): string
{
    $attrs = ['name' => $name, 'id' => 'f-' . $name, 'rows' => $o['rows'] ?? 3, 'maxlength' => $o['maxlength'] ?? null, 'lang' => $o['lang'] ?? null,
        'aria-invalid' => isset($errors[$name]) ? 'true' : null, 'aria-describedby' => isset($errors[$name]) ? 'err-' . $name : null];
    return '<label class="adm-field" for="f-' . e($name) . '"><span>' . e($label) . '</span><textarea' . adm_attrs($attrs) . '>' . e((string) ($value ?? '')) . '</textarea>'
        . (isset($o['hint']) ? '<small>' . e($o['hint']) . '</small>' : '') . adm_error($errors, $name) . '</label>';
}

/** Padajuća lista; $options = [vrednost => tekst]. */
function adm_select(string $name, mixed $value, string $label, array $options, array $errors = [], array $o = []): string
{
    $h = '<label class="adm-field" for="f-' . e($name) . '"><span>' . e($label) . '</span><select name="' . e($name) . '" id="f-' . e($name) . '"'
        . (isset($errors[$name]) ? ' aria-invalid="true"' : '') . '>';
    foreach ($options as $v => $t) {
        $h .= '<option value="' . e((string) $v) . '"' . ((string) $v === (string) ($value ?? '') ? ' selected' : '') . '>' . e($t) . '</option>';
    }
    return $h . '</select>' . (isset($o['hint']) ? '<small>' . e($o['hint']) . '</small>' : '') . adm_error($errors, $name) . '</label>';
}

function adm_checkbox(string $name, bool $checked, string $label, array $o = []): string
{
    return '<label class="adm-check"><input type="checkbox" name="' . e($name) . '" value="1"' . ($checked ? ' checked' : '') . '> <span>' . e($label) . '</span>'
        . (isset($o['hint']) ? ' <small>' . e($o['hint']) . '</small>' : '') . '</label>';
}

/**
 * Dvojezični par jedan pored drugog: <name>_sr | <name>_en.
 * $kind = 'input' | 'textarea'; $o se prosleđuje obema poljima (required samo za SR).
 */
function adm_pair(string $name, array $values, string $label, array $errors = [], string $kind = 'input', array $o = []): string
{
    $out = '<div class="adm-pair">';
    foreach (LANGS as $l) {
        $field = $name . '_' . $l;
        $opts = $o + ['lang' => $l];
        if ($l !== DEFAULT_LANG) {
            unset($opts['required']);
        }
        $lab = $label . ' — ' . strtoupper($l);
        $out .= $kind === 'textarea'
            ? adm_textarea($field, $values[$field] ?? '', $lab, $errors, $opts)
            : adm_input($field, $values[$field] ?? '', $lab, $errors, $opts);
    }
    $sr = trim((string) ($values[$name . '_sr'] ?? ''));
    $en = trim((string) ($values[$name . '_en'] ?? ''));
    if ($sr !== '' && $en === '') {
        $out .= '<p class="adm-note">Nema engleskog prevoda — na engleskoj strani prikazuje se srpski tekst.</p>';
    }
    return $out . '</div>';
}

/** Skup polja sa naslovom. */
function adm_fieldset(string $legend, string $inner, string $hint = ''): string
{
    return '<fieldset class="adm-set"><legend>' . e($legend) . '</legend>' . ($hint !== '' ? '<p class="adm-muted adm-set__hint">' . e($hint) . '</p>' : '') . $inner . '</fieldset>';
}

/** Lista grešaka iznad forme. */
function adm_error_summary(array $errors): string
{
    if (!$errors) {
        return '';
    }
    $h = '<div class="adm-flash adm-flash--error" role="alert"><p><strong>Izmene nisu sačuvane.</strong> Ispravite označena polja:</p><ul>';
    foreach ($errors as $name => $msg) {
        $h .= '<li><a href="#f-' . e($name) . '">' . e($msg) . '</a></li>';
    }
    return $h . '</ul></div>';
}
