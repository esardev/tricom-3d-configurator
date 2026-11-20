<?php
/* TRICOM — modul „Usluge“ (admin/index.php?m=usluge).
   Akcije (a=): lista (podrazumevano; filter kind=), new, edit&id=, save (POST),
   order (POST), delete&id= (potvrda) i delete (POST).
   Usluga = jedan red sa srpskim i engleskim poljima i redovima tehničkih
   podataka (isti sadržaj kao proizvod, catalog-admin.php). Vrsta „service“ se
   prikazuje u listi „Sve usluge“ (usluge.html); „capability“ (mogućnost CNC
   plazme) ima samo stranu detalja i karticu na plazma.html. */
defined('TRICOM') || exit;

require_once APP_DIR . '/admin/catalog-admin.php';

const SVC_KINDS = ['service' => 'Usluga (lista na strani Usluge)', 'capability' => 'Mogućnost CNC plazme'];

$action = is_string($_GET['a'] ?? null) ? $_GET['a'] : '';
$self = static fn(array $q = []): string => admin_url('', ['m' => 'usluge'] + $q);

function svc_form_input(?array $existing): array
{
    return adm_content_input($existing) + ['kind' => input_str($_POST, 'kind'), 'icon_key' => input_str($_POST, 'icon_key')];
}

function svc_validate(array $v, array $specs, ?array $existing): array
{
    $val = new Validator();
    adm_content_validate($val, $v, $specs, $existing, 'Usluga');
    $val->in('kind', $v['kind'], array_keys(SVC_KINDS), 'Vrsta');
    if ($v['icon_key'] !== '' && !isset(catalog_icons()['service'][$v['icon_key']])) {
        $val->add('icon_key', 'Izaberite jednu od postojećih ikona.');
    }
    return $val->errors();
}

function svc_render_form(array $v, array $specs, array $errors, ?array $existing): never
{
    admin_render('service-form', [
        'v' => $v, 'specs' => $specs, 'errors' => $errors, 'existing' => $existing,
        'renders' => adm_render_keys(), 'illus' => adm_illu_keys(), 'drawings' => adm_drawing_choices($v['drawing_path'] ?? null), 'known' => catalog_known_slugs(),
    ], $existing ? 'Izmena usluge' : 'Nova usluga', 'usluge');
}

/* ---------------------------------------------------------------- POST: redosled */
if ($action === 'order' && is_post()) {
    csrf_require();
    $orders = is_array($_POST['order'] ?? null) ? $_POST['order'] : [];
    db_transaction(static function () use ($orders): void {
        foreach ($orders as $id => $ord) {
            $o = filter_var($ord, FILTER_VALIDATE_INT);
            if ($o !== false && ctype_digit((string) $id)) {
                db_run('UPDATE `services` SET `sort_order` = ? WHERE `id` = ?', [(int) $o, (int) $id]);
            }
        }
    });
    flash('success', 'Redosled usluga je sačuvan.');
    $back = is_string($_POST['back'] ?? null) ? safe_admin_next($_POST['back']) : $self();
    redirect($back);
}

/* ---------------------------------------------------------------- POST: čuvanje */
if ($action === 'save' && is_post()) {
    csrf_require();
    $id = input_int($_POST, 'id');
    $existing = $id ? db_one('SELECT * FROM `services` WHERE `id` = ?', [$id]) : null;
    if ($id && !$existing) {
        throw new HttpException(404, 'Usluga ne postoji.');
    }
    $v = svc_form_input($existing);
    $specs = adm_specs_input();
    $errors = svc_validate($v, $specs, $existing);

    /* otpremanje tek kad je ostatak forme ispravan */
    $new = $errors ? [] : adm_content_uploads($v, $errors, 'services');
    if ($errors) {
        if (upload_present('photo_file') || upload_present('drawing_file')) {
            $errors['_files'] = 'Izabrani fajlovi nisu sačuvani — izaberite ih ponovo.';
        }
        svc_render_form($v, $specs, $errors, $existing);
    }

    /* usluge nemaju kalkulator ni konfigurator (polja ostaju prazna) */
    $data = ['kind' => $v['kind'], 'icon_key' => $v['icon_key'] === '' ? null : $v['icon_key']] + adm_content_data($v);
    try {
        $sid = db_transaction(static function () use ($existing, $data, $v, $specs): int {
            if ($existing) {
                $sid = (int) $existing['id'];
                db_update('services', $data, '`id` = ?', [$sid]);
            } else {
                $sid = db_insert('services', $data + ['slug' => $v['slug']]);
            }
            adm_save_specs('service', $sid, $specs);
            return $sid;
        });
    } catch (Throwable $ex) {
        foreach ($new as $p) {
            upload_delete($p);
        }
        throw $ex;
    }
    /* stari otpremljeni fajlovi koje više niko ne koristi */
    if ($existing) {
        adm_cleanup_files([$existing['photo_path'], $existing['drawing_path']]);
    }

    flash('success', 'Usluga „' . $v['title_sr'] . '“ je sačuvana.');
    redirect($self(['a' => 'edit', 'id' => $sid]));
}

/* ---------------------------------------------------------------- brisanje */
if ($action === 'delete') {
    $id = is_post() ? input_int($_POST, 'id') : input_int($_GET, 'id');
    $s = $id ? db_one('SELECT * FROM `services` WHERE `id` = ?', [$id]) : null;
    if (!$s) {
        throw new HttpException(404, 'Usluga ne postoji.');
    }
    $refs = adm_related_mentions($s['slug'], 'services', (int) $id);
    $mentions = adm_static_mentions($s['slug']);
    $errors = [];
    if (is_post()) {
        csrf_require();
        if (!input_bool($_POST, 'confirm')) {
            $errors['confirm'] = 'Potvrdite brisanje.';
        } else {
            db_transaction(static function () use ($id, $s): void {
                db_run('DELETE FROM `services` WHERE `id` = ?', [$id]);   // tehnički podaci: ON DELETE CASCADE
                adm_remove_related_slug($s['slug']);
            });
            adm_cleanup_files([$s['photo_path'], $s['drawing_path']]);   // samo uploads/ i samo ako ih niko drugi ne koristi
            flash('success', 'Usluga „' . $s['title_sr'] . '“ je obrisana. Njena adresa sada vraća 404.');
            redirect($self());
        }
    }
    admin_render('service-delete', compact('s', 'refs', 'mentions', 'errors'), 'Brisanje usluge', 'usluge');
}

/* ---------------------------------------------------------------- nova / izmena */
if ($action === 'new' || $action === 'edit') {
    if ($action === 'edit') {
        $existing = db_one('SELECT * FROM `services` WHERE `id` = ?', [input_int($_GET, 'id') ?? 0]);
        if (!$existing) {
            throw new HttpException(404, 'Usluga ne postoji.');
        }
        $v = $existing;
        $v['related'] = implode("\n", catalog_related_slugs($existing));
        $v['drawing_path'] = (string) $existing['drawing_path'];
        svc_render_form($v, adm_specs_of('service', (int) $existing['id']), [], $existing);
    }
    $kind = input_str($_GET, 'kind');
    $v = ['slug' => '', 'kind' => isset(SVC_KINDS[$kind]) ? $kind : 'service', 'icon_key' => '', 'is_active' => 1, 'image_type' => 'none', 'render_key' => '', 'illu_key' => '',
        'drawing_path' => '', 'related' => '', 'sort_order' => ((int) db_value('SELECT COALESCE(MAX(`sort_order`), 0) FROM `services`')) + 10];
    svc_render_form($v, [], [], null);
}

/* ---------------------------------------------------------------- lista */
$filterKind = input_str($_GET, 'kind');
$filterKind = isset(SVC_KINDS[$filterKind]) ? $filterKind : '';
$rows = db_all(
    'SELECT s.`id`, s.`slug`, s.`kind`, s.`title_sr`, s.`title_en`, s.`sort_order`, s.`is_active`, s.`image_type`, s.`render_key`, s.`illu_key`, s.`photo_path`, s.`icon_key`,
        (SELECT COUNT(*) FROM `service_specs` x WHERE x.`service_id` = s.`id`) AS spec_count
     FROM `services` s' . ($filterKind !== '' ? ' WHERE s.`kind` = ?' : '') . ' ORDER BY s.`kind` = \'capability\', s.`sort_order`, s.`id`',
    $filterKind !== '' ? [$filterKind] : []
);
admin_render('services-list', ['rows' => $rows, 'filterKind' => $filterKind], 'Usluge', 'usluge');
