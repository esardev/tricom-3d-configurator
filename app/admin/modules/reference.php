<?php
/* TRICOM — modul „Reference“ (admin/index.php?m=reference).
   Akcije (a=): lista (podrazumevano; filter type=), new, edit&id=, save (POST),
   order (POST), delete&id= (potvrda) i delete (POST).
   Referenca = jedan red sa srpskim i engleskim poljima. Vrsta određuje mesto
   na strani reference.html: demand (vrste zahtevnosti — ikona, slika, tekst),
   scope (vrste radova — naslov i tekst), project (lista objekata — naslov,
   tekst, oznaka). Reference nemaju svoje strane; otvaraju se u modalu. */
defined('TRICOM') || exit;

require_once APP_DIR . '/admin/catalog-admin.php';

const REF_TYPES = ['demand' => 'Vrsta zahtevnosti („Visina, količina, složenost“)', 'scope' => 'Vrsta radova (kartice iznad liste)', 'project' => 'Objekat / partner (lista objekata)'];
const REF_TYPE_SHORT = ['demand' => 'vrsta zahtevnosti', 'scope' => 'vrsta radova', 'project' => 'objekat'];
const REF_LIMITS = ['title' => 255, 'summary' => 3000, 'label' => 120, 'image_alt' => 255];

$action = is_string($_GET['a'] ?? null) ? $_GET['a'] : '';
$self = static fn(array $q = []): string => admin_url('', ['m' => 'reference'] + $q);

function ref_form_input(?array $existing): array
{
    $v = ['id' => $existing['id'] ?? null];
    $v['slug'] = $existing ? $existing['slug'] : mb_strtolower(input_str($_POST, 'slug'), 'UTF-8');
    foreach (['title', 'label', 'image_alt'] as $f) {
        foreach (LANGS as $l) {
            $v[$f . '_' . $l] = input_str($_POST, $f . '_' . $l);
        }
    }
    foreach (LANGS as $l) {
        $v['summary_' . $l] = input_str($_POST, 'summary_' . $l, true);
    }
    /* predlog sluga: ref-<naziv> (isti oblik kao postojeće reference) */
    if (!$existing && $v['slug'] === '' && $v['title_sr'] !== '') {
        $v['slug'] = 'ref-' . slugify($v['title_sr']);
    }
    $v['ref_type'] = input_str($_POST, 'ref_type');
    $v['sort_order'] = input_int($_POST, 'sort_order') ?? 0;
    $v['is_active'] = input_bool($_POST, 'is_active') ? 1 : 0;
    $v['image_type'] = input_str($_POST, 'image_type');
    $v['render_key'] = input_str($_POST, 'render_key');
    $v['icon_key'] = input_str($_POST, 'icon_key');
    $v['photo_path'] = $existing['photo_path'] ?? null;
    $v['photo_width'] = $existing['photo_width'] ?? null;
    $v['photo_height'] = $existing['photo_height'] ?? null;
    return $v;
}

function ref_validate(array $v, ?array $existing): array
{
    $val = new Validator();
    if (!$existing) {
        $val->required('slug', $v['slug'], 'Slug')->slug('slug', $v['slug'], 'Slug');
        if (is_valid_slug($v['slug']) && adm_slug_taken($v['slug'])) {
            $val->add('slug', 'Taj slug već koristi druga referenca, proizvod, usluga ili stavka sajta.');
        }
    }
    $val->in('ref_type', $v['ref_type'], array_keys(REF_TYPES), 'Vrsta');
    $val->required('title_sr', $v['title_sr'], 'Naziv — SR');
    $labels = ['title' => 'Naziv', 'summary' => 'Tekst', 'label' => 'Oznaka', 'image_alt' => 'Opis slike (alt)'];
    foreach (REF_LIMITS as $f => $max) {
        foreach (LANGS as $l) {
            $val->maxLength($f . '_' . $l, $v[$f . '_' . $l], $max, $labels[$f] . ' — ' . strtoupper($l));
        }
    }
    $val->intRange('sort_order', $v['sort_order'], -100000, 100000, 'Redosled');
    $val->in('image_type', $v['image_type'], ['none', 'render', 'photo'], 'Vrsta slike');
    if ($v['image_type'] === 'render' && !isset(adm_render_keys()[$v['render_key']])) {
        $val->add('render_key', 'Izaberite postojeći render.');
    }
    if ($v['image_type'] === 'photo' && (string) $v['photo_path'] === '' && !upload_present('photo_file')) {
        $val->add('photo_file', 'Za vrstu „Fotografija“ izaberite fajl.');
    }
    if ($v['icon_key'] !== '' && !isset(catalog_icons()['reference'][$v['icon_key']])) {
        $val->add('icon_key', 'Izaberite jednu od postojećih ikona.');
    }
    return $val->errors();
}

function ref_render_form(array $v, array $errors, ?array $existing): never
{
    admin_render('reference-form', ['v' => $v, 'errors' => $errors, 'existing' => $existing, 'renders' => adm_render_keys()],
        $existing ? 'Izmena reference' : 'Nova referenca', 'reference');
}

/* ---------------------------------------------------------------- POST: redosled */
if ($action === 'order' && is_post()) {
    csrf_require();
    $orders = is_array($_POST['order'] ?? null) ? $_POST['order'] : [];
    db_transaction(static function () use ($orders): void {
        foreach ($orders as $id => $ord) {
            $o = filter_var($ord, FILTER_VALIDATE_INT);
            if ($o !== false && ctype_digit((string) $id)) {
                db_run('UPDATE `client_references` SET `sort_order` = ? WHERE `id` = ?', [(int) $o, (int) $id]);
            }
        }
    });
    flash('success', 'Redosled referenci je sačuvan.');
    $back = is_string($_POST['back'] ?? null) ? safe_admin_next($_POST['back']) : $self();
    redirect($back);
}

/* ---------------------------------------------------------------- POST: čuvanje */
if ($action === 'save' && is_post()) {
    csrf_require();
    $id = input_int($_POST, 'id');
    $existing = $id ? db_one('SELECT * FROM `client_references` WHERE `id` = ?', [$id]) : null;
    if ($id && !$existing) {
        throw new HttpException(404, 'Referenca ne postoji.');
    }
    $v = ref_form_input($existing);
    $errors = ref_validate($v, $existing);

    /* otpremanje tek kad je ostatak forme ispravan */
    $new = null;
    if (!$errors && $v['image_type'] === 'photo' && upload_present('photo_file')) {
        try {
            $up = upload_receive('photo_file', 'references', 'image');
            $new = $up['path'];
            [$v['photo_path'], $v['photo_width'], $v['photo_height']] = [$up['path'], $up['width'], $up['height']];
        } catch (UploadException $ex) {
            $errors['photo_file'] = $ex->getMessage();
        }
    }
    if ($errors) {
        if (upload_present('photo_file')) {
            $errors['_files'] = 'Izabrani fajl nije sačuvan — izaberite ga ponovo.';
        }
        ref_render_form($v, $errors, $existing);
    }

    $nullable = static fn($s) => $s === '' ? null : $s;
    $photo = $v['image_type'] === 'photo';
    $data = [
        'ref_type' => $v['ref_type'], 'sort_order' => $v['sort_order'], 'is_active' => $v['is_active'], 'image_type' => $v['image_type'],
        'render_key' => $v['image_type'] === 'render' ? $v['render_key'] : null,
        'photo_path' => $photo ? $v['photo_path'] : null, 'photo_width' => $photo ? $v['photo_width'] : null, 'photo_height' => $photo ? $v['photo_height'] : null,
        'icon_key' => $nullable($v['icon_key']),
    ];
    foreach (LANGS as $l) {
        $data['title_' . $l] = $v['title_' . $l];
        foreach (['summary', 'label', 'image_alt'] as $f) {
            $data[$f . '_' . $l] = $nullable($v[$f . '_' . $l]);
        }
    }
    try {
        $rid = db_transaction(static function () use ($existing, $data, $v): int {
            if ($existing) {
                db_update('client_references', $data, '`id` = ?', [(int) $existing['id']]);
                return (int) $existing['id'];
            }
            return db_insert('client_references', $data + ['slug' => $v['slug']]);
        });
    } catch (Throwable $ex) {
        upload_delete($new);
        throw $ex;
    }
    if ($existing) {
        adm_cleanup_files([$existing['photo_path']]);   // zamenjena/uklonjena fotografija, ako je niko drugi ne koristi
    }

    flash('success', 'Referenca „' . $v['title_sr'] . '“ je sačuvana.');
    redirect($self(['a' => 'edit', 'id' => $rid]));
}

/* ---------------------------------------------------------------- brisanje */
if ($action === 'delete') {
    $id = is_post() ? input_int($_POST, 'id') : input_int($_GET, 'id');
    $r = $id ? db_one('SELECT * FROM `client_references` WHERE `id` = ?', [$id]) : null;
    if (!$r) {
        throw new HttpException(404, 'Referenca ne postoji.');
    }
    $mentions = adm_static_mentions($r['slug']);
    $errors = [];
    if (is_post()) {
        csrf_require();
        if (!input_bool($_POST, 'confirm')) {
            $errors['confirm'] = 'Potvrdite brisanje.';
        } else {
            db_run('DELETE FROM `client_references` WHERE `id` = ?', [$id]);
            adm_cleanup_files([$r['photo_path']]);   // samo uploads/ i samo ako je niko drugi ne koristi
            flash('success', 'Referenca „' . $r['title_sr'] . '“ je obrisana.');
            redirect($self());
        }
    }
    admin_render('reference-delete', compact('r', 'mentions', 'errors'), 'Brisanje reference', 'reference');
}

/* ---------------------------------------------------------------- nova / izmena */
if ($action === 'new' || $action === 'edit') {
    if ($action === 'edit') {
        $existing = db_one('SELECT * FROM `client_references` WHERE `id` = ?', [input_int($_GET, 'id') ?? 0]);
        if (!$existing) {
            throw new HttpException(404, 'Referenca ne postoji.');
        }
        ref_render_form($existing, [], $existing);
    }
    $type = input_str($_GET, 'type');
    $type = isset(REF_TYPES[$type]) ? $type : 'project';
    $v = ['slug' => '', 'ref_type' => $type, 'is_active' => 1, 'image_type' => 'none', 'render_key' => '', 'icon_key' => '',
        'sort_order' => ((int) db_value('SELECT COALESCE(MAX(`sort_order`), 0) FROM `client_references` WHERE `ref_type` = ?', [$type])) + 10];
    ref_render_form($v, [], null);
}

/* ---------------------------------------------------------------- lista */
$filterType = input_str($_GET, 'type');
$filterType = isset(REF_TYPES[$filterType]) ? $filterType : '';
$rows = db_all(
    'SELECT `id`, `slug`, `ref_type`, `title_sr`, `title_en`, `label_sr`, `sort_order`, `is_active`, `image_type`, `render_key`, `photo_path`, `icon_key`
     FROM `client_references`' . ($filterType !== '' ? ' WHERE `ref_type` = ?' : '')
    . " ORDER BY FIELD(`ref_type`, 'demand', 'scope', 'project'), `sort_order`, `id`",
    $filterType !== '' ? [$filterType] : []
);
admin_render('references-list', ['rows' => $rows, 'filterType' => $filterType], 'Reference', 'reference');
