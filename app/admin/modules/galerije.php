<?php
/* TRICOM — modul „Galerije“ (admin/index.php?m=galerije).
   Slike (a=): lista (podrazumevano; filter cat=), upload (više slika odjednom),
   edit&id= / save, delete&id= (potvrda), bulk (POST: redosled ili brisanje
   označenih → potvrda bulk-delete).
   Kategorije (= filteri na galerija.html): cats, cat-new, cat-edit&id=, cat-save,
   cat-order, cat-delete&id= (slike se pre brisanja premeštaju u drugu kategoriju).
   Otpremljeni fajl se briše samo ako ga ne koristi nijedan drugi zapis;
   postojeće slike sajta (assets/) se nikad ne brišu. */
defined('TRICOM') || exit;

require_once APP_DIR . '/admin/catalog-admin.php';

/** Položaj isečka slike u mreži (data-pos; vrednosti iz css/components.css). */
const GAL_POS = ['' => 'sredina (podrazumevano)', 'tl' => 'gore levo', 'top' => 'gore', 'tr' => 'gore desno', 'left' => 'levo', 'c' => 'centar',
    'right' => 'desno', 'bl' => 'dole levo', 'bottom' => 'dole', 'br' => 'dole desno'];
/** Širine umanjenih varijanti za mrežu (kao kod postojećih fotografija). */
const GAL_VARIANTS = [310, 620];
const GAL_MAX_FILES = 30;

/** Najviše fajlova po slanju: 30, ili manje ako server prima manje (PHP max_file_uploads višak tiho odbacuje). */
function gal_max_files(): int
{
    $ini = (int) ini_get('max_file_uploads');
    return $ini > 0 ? min(GAL_MAX_FILES, $ini) : GAL_MAX_FILES;
}

$action = is_string($_GET['a'] ?? null) ? $_GET['a'] : '';
$self = static fn(array $q = []): string => admin_url('', ['m' => 'galerije'] + $q);

function gal_cats(): array
{
    return db_all('SELECT c.*, (SELECT COUNT(*) FROM `gallery_images` g WHERE g.`category_id` = c.`id`) AS image_count FROM `gallery_categories` c ORDER BY c.`sort_order`, c.`id`');
}

/** Sledeći broj slike („FIG. NN“): najveći postojeći + 1. */
function gal_next_fig(int $add = 0): string
{
    $max = 0;
    foreach (db_all('SELECT `fig_no` FROM `gallery_images`') as $r) {
        if (ctype_digit((string) $r['fig_no'])) {
            $max = max($max, (int) $r['fig_no']);
        }
    }
    return sprintf('%02d', $max + 1 + $add);
}

/** Slobodan slug g-NN (zajednički imenski prostor sa ostalim stavkama sajta). */
function gal_free_slug(string $fig): string
{
    $base = 'g-' . $fig;
    for ($i = 1, $slug = $base; adm_slug_taken($slug); $i++) {
        $slug = $base . '-' . ($i + 1);
    }
    return $slug;
}

function gal_validate_texts(Validator $val, array $v): void
{
    foreach (LANGS as $l) {
        $val->maxLength('caption_' . $l, $v['caption_' . $l], 255, 'Opis — ' . strtoupper($l));
        $val->maxLength('alt_' . $l, $v['alt_' . $l], 255, 'Opis slike (alt) — ' . strtoupper($l));
    }
}

/* ================================================================ kategorije */

if ($action === 'cat-order' && is_post()) {
    csrf_require();
    $orders = is_array($_POST['order'] ?? null) ? $_POST['order'] : [];
    db_transaction(static function () use ($orders): void {
        foreach ($orders as $id => $ord) {
            $o = filter_var($ord, FILTER_VALIDATE_INT);
            if ($o !== false && ctype_digit((string) $id)) {
                db_run('UPDATE `gallery_categories` SET `sort_order` = ? WHERE `id` = ?', [(int) $o, (int) $id]);
            }
        }
    });
    flash('success', 'Redosled kategorija je sačuvan.');
    redirect($self(['a' => 'cats']));
}

if ($action === 'cat-save' && is_post()) {
    csrf_require();
    $id = input_int($_POST, 'id');
    $existing = $id ? db_one('SELECT * FROM `gallery_categories` WHERE `id` = ?', [$id]) : null;
    if ($id && !$existing) {
        throw new HttpException(404, 'Kategorija ne postoji.');
    }
    $v = ['slug' => $existing ? $existing['slug'] : mb_strtolower(input_str($_POST, 'slug'), 'UTF-8'),
        'name_sr' => input_str($_POST, 'name_sr'), 'name_en' => input_str($_POST, 'name_en'),
        'sort_order' => input_int($_POST, 'sort_order') ?? 0, 'is_active' => input_bool($_POST, 'is_active') ? 1 : 0];
    if (!$existing && $v['slug'] === '' && $v['name_sr'] !== '') {
        $v['slug'] = slugify($v['name_sr']);
    }
    $val = new Validator();
    if (!$existing) {
        $val->required('slug', $v['slug'], 'Slug')->slug('slug', $v['slug'], 'Slug', 60);
        if ($v['slug'] === 'all') {
            $val->add('slug', 'Slug „all“ je rezervisan za dugme „Sve“.');
        } elseif ((int) db_value('SELECT COUNT(*) FROM `gallery_categories` WHERE `slug` = ?', [$v['slug']]) > 0) {
            $val->add('slug', 'Kategorija sa tim slugom već postoji.');
        }
    }
    $val->required('name_sr', $v['name_sr'], 'Naziv — SR')->maxLength('name_sr', $v['name_sr'], 120, 'Naziv — SR')->maxLength('name_en', $v['name_en'], 120, 'Naziv — EN');
    $val->intRange('sort_order', $v['sort_order'], -100000, 100000, 'Redosled');
    if ($errors = $val->errors()) {
        admin_render('gallery-cat-form', ['v' => $v, 'errors' => $errors, 'existing' => $existing], 'Kategorija galerije', 'galerije');
    }
    $data = ['name_sr' => $v['name_sr'], 'name_en' => $v['name_en'], 'sort_order' => $v['sort_order'], 'is_active' => $v['is_active']];
    if ($existing) {
        db_update('gallery_categories', $data, '`id` = ?', [(int) $existing['id']]);
    } else {
        db_insert('gallery_categories', $data + ['slug' => $v['slug']]);
    }
    flash('success', 'Kategorija „' . $v['name_sr'] . '“ je sačuvana.');
    redirect($self(['a' => 'cats']));
}

if ($action === 'cat-delete') {
    $id = is_post() ? input_int($_POST, 'id') : input_int($_GET, 'id');
    $cat = $id ? db_one('SELECT * FROM `gallery_categories` WHERE `id` = ?', [$id]) : null;
    if (!$cat) {
        throw new HttpException(404, 'Kategorija ne postoji.');
    }
    $count = (int) db_value('SELECT COUNT(*) FROM `gallery_images` WHERE `category_id` = ?', [$id]);
    $targets = db_all('SELECT `id`, `name_sr` FROM `gallery_categories` WHERE `id` <> ? ORDER BY `sort_order`, `id`', [$id]);
    $errors = [];
    if (is_post()) {
        csrf_require();
        $target = input_int($_POST, 'target');
        if (!input_bool($_POST, 'confirm')) {
            $errors['confirm'] = 'Potvrdite brisanje.';
        } elseif ($count > 0 && !in_array($target, array_map(static fn($t) => (int) $t['id'], $targets), true)) {
            $errors['target'] = 'Izaberite kategoriju u koju se premeštaju slike.';
        } else {
            db_transaction(static function () use ($id, $count, $target): void {
                if ($count > 0) {
                    db_run('UPDATE `gallery_images` SET `category_id` = ? WHERE `category_id` = ?', [$target, $id]);
                }
                db_run('DELETE FROM `gallery_categories` WHERE `id` = ?', [$id]);
            });
            flash('success', 'Kategorija „' . $cat['name_sr'] . '“ je obrisana' . ($count > 0 ? '; slike (' . $count . ') su premeštene.' : '.'));
            redirect($self(['a' => 'cats']));
        }
    }
    admin_render('gallery-cat-delete', compact('cat', 'count', 'targets', 'errors'), 'Brisanje kategorije galerije', 'galerije');
}

if ($action === 'cat-new' || $action === 'cat-edit') {
    $existing = null;
    if ($action === 'cat-edit') {
        $existing = db_one('SELECT * FROM `gallery_categories` WHERE `id` = ?', [input_int($_GET, 'id') ?? 0]);
        if (!$existing) {
            throw new HttpException(404, 'Kategorija ne postoji.');
        }
    }
    $v = $existing ?? ['slug' => '', 'is_active' => 1, 'sort_order' => ((int) db_value('SELECT COALESCE(MAX(`sort_order`), 0) FROM `gallery_categories`')) + 10];
    admin_render('gallery-cat-form', ['v' => $v, 'errors' => [], 'existing' => $existing], 'Kategorija galerije', 'galerije');
}

if ($action === 'cats') {
    admin_render('gallery-cats', ['rows' => gal_cats()], 'Kategorije galerije', 'galerije');
}

/* ================================================================ otpremanje više slika */

if ($action === 'upload') {
    $cats = gal_cats();
    $v = ['category_id' => input_int($_GET, 'cat'), 'is_active' => 1];
    $errors = [];
    if (is_post()) {
        csrf_require();
        $v = ['category_id' => input_int($_POST, 'category_id'), 'is_active' => input_bool($_POST, 'is_active') ? 1 : 0];
        foreach (LANGS as $l) {
            $v['caption_' . $l] = input_str($_POST, 'caption_' . $l);
            $v['alt_' . $l] = input_str($_POST, 'alt_' . $l);
        }
        $files = upload_files('photos');
        $val = new Validator();
        if (!in_array($v['category_id'], array_map(static fn($c) => (int) $c['id'], $cats), true)) {
            $val->add('category_id', 'Izaberite kategoriju.');
        }
        if (!$files) {
            $val->add('photos', 'Izaberite bar jednu sliku.');
        } elseif (count($files) > gal_max_files()) {
            $val->add('photos', 'Najviše ' . gal_max_files() . ' slika odjednom.');
        }
        gal_validate_texts($val, $v);
        $errors = $val->errors();
        if (!$errors) {
            /* bez opisa slika ostaje sakrivena (opis je i natpis i tekst uvećanog prikaza) */
            $active = $v['caption_sr'] !== '' ? $v['is_active'] : 0;
            $order = (int) db_value('SELECT COALESCE(MAX(`sort_order`), 0) FROM `gallery_images`');
            $saved = 0;
            $failed = [];
            foreach ($files as $f) {
                try {
                    $up = upload_receive_file($f, 'gallery', 'image');
                } catch (UploadException $ex) {
                    $failed[] = ($f['name'] !== '' ? basename($f['name']) : 'fajl') . ': ' . $ex->getMessage();
                    continue;
                }
                upload_make_variants($up['path'], GAL_VARIANTS);
                $fig = gal_next_fig();
                try {
                    db_insert('gallery_images', ['slug' => gal_free_slug($fig), 'category_id' => $v['category_id'], 'fig_no' => $fig,
                        'caption_sr' => $v['caption_sr'], 'caption_en' => $v['caption_en'], 'alt_sr' => $v['alt_sr'], 'alt_en' => $v['alt_en'],
                        'image_type' => 'photo', 'photo_path' => $up['path'], 'photo_width' => $up['width'], 'photo_height' => $up['height'],
                        'crop_pos' => null, 'sort_order' => $order += 10, 'is_active' => $active]);
                    $saved++;
                } catch (Throwable $ex) {
                    upload_delete($up['path']);
                    throw $ex;
                }
            }
            if ($saved) {
                flash('success', 'Dodato slika: ' . $saved . '.' . ($active ? '' : ' Slike su sakrivene dok im ne upišete opis i uključite prikaz.'));
            }
            if ($failed) {
                flash('error', 'Nisu otpremljene: ' . implode(' · ', $failed));
            }
            redirect($self(['cat' => $v['category_id']]));
        }
        $errors['_files'] = 'Izabrani fajlovi nisu sačuvani — izaberite ih ponovo.';
    }
    admin_render('gallery-upload', ['v' => $v, 'errors' => $errors, 'cats' => $cats], 'Dodavanje slika', 'galerije');
}

/* ================================================================ jedna slika */

if ($action === 'save' && is_post()) {
    csrf_require();
    $existing = db_one('SELECT * FROM `gallery_images` WHERE `id` = ?', [input_int($_POST, 'id') ?? 0]);
    if (!$existing) {
        throw new HttpException(404, 'Slika ne postoji.');
    }
    $cats = gal_cats();
    $v = $existing;
    foreach (LANGS as $l) {
        $v['caption_' . $l] = input_str($_POST, 'caption_' . $l);
        $v['alt_' . $l] = input_str($_POST, 'alt_' . $l);
    }
    $v['category_id'] = input_int($_POST, 'category_id');
    $v['fig_no'] = input_str($_POST, 'fig_no');
    $v['crop_pos'] = input_str($_POST, 'crop_pos');
    $v['image_type'] = input_str($_POST, 'image_type');
    $v['render_key'] = input_str($_POST, 'render_key');
    $v['sort_order'] = input_int($_POST, 'sort_order') ?? 0;
    $v['is_active'] = input_bool($_POST, 'is_active') ? 1 : 0;

    $val = new Validator();
    if (!in_array($v['category_id'], array_map(static fn($c) => (int) $c['id'], $cats), true)) {
        $val->add('category_id', 'Izaberite kategoriju.');
    }
    gal_validate_texts($val, $v);
    if ($v['is_active'] && $v['caption_sr'] === '') {
        $val->add('caption_sr', 'Vidljiva slika mora imati opis (SR).');
    }
    if (!preg_match('/^[0-9A-Za-z-]{0,10}$/', $v['fig_no'])) {
        $val->add('fig_no', 'Broj slike: do 10 cifara, slova ili crtica.');
    }
    $val->in('crop_pos', $v['crop_pos'], array_keys(GAL_POS), 'Isečak');
    $val->in('image_type', $v['image_type'], ['photo', 'render'], 'Vrsta slike');
    if ($v['image_type'] === 'render' && !isset(adm_render_keys()[$v['render_key']])) {
        $val->add('render_key', 'Izaberite postojeći render.');
    }
    if ($v['image_type'] === 'photo' && (string) $existing['photo_path'] === '' && !upload_present('photo_file')) {
        $val->add('photo_file', 'Za fotografiju izaberite fajl.');
    }
    $val->intRange('sort_order', $v['sort_order'], -100000, 100000, 'Redosled');
    $errors = $val->errors();

    $new = null;
    if (!$errors && $v['image_type'] === 'photo' && upload_present('photo_file')) {
        try {
            $up = upload_receive('photo_file', 'gallery', 'image');
            upload_make_variants($up['path'], GAL_VARIANTS);
            $new = $up['path'];
            [$v['photo_path'], $v['photo_width'], $v['photo_height']] = [$up['path'], $up['width'], $up['height']];
        } catch (UploadException $ex) {
            $errors['photo_file'] = $ex->getMessage();
        }
    }
    if ($errors) {
        admin_render('gallery-form', ['v' => $v, 'errors' => $errors, 'existing' => $existing, 'cats' => $cats, 'renders' => adm_render_keys()], 'Izmena slike', 'galerije');
    }
    $photo = $v['image_type'] === 'photo';
    $data = ['category_id' => $v['category_id'], 'fig_no' => $v['fig_no'], 'crop_pos' => $photo && $v['crop_pos'] !== '' ? $v['crop_pos'] : null,
        'image_type' => $v['image_type'], 'render_key' => $photo ? null : $v['render_key'],
        'photo_path' => $photo ? $v['photo_path'] : null, 'photo_width' => $photo ? $v['photo_width'] : null, 'photo_height' => $photo ? $v['photo_height'] : null,
        'sort_order' => $v['sort_order'], 'is_active' => $v['is_active']];
    foreach (LANGS as $l) {
        $data['caption_' . $l] = $v['caption_' . $l];
        $data['alt_' . $l] = $v['alt_' . $l];
    }
    try {
        db_update('gallery_images', $data, '`id` = ?', [(int) $existing['id']]);
    } catch (Throwable $ex) {
        upload_delete($new);
        throw $ex;
    }
    adm_cleanup_files([$existing['photo_path']]);   // zamenjena fotografija, ako je niko drugi ne koristi
    flash('success', 'Slika je sačuvana.');
    redirect($self(['a' => 'edit', 'id' => (int) $existing['id']]));
}

if ($action === 'edit') {
    $existing = db_one('SELECT * FROM `gallery_images` WHERE `id` = ?', [input_int($_GET, 'id') ?? 0]);
    if (!$existing) {
        throw new HttpException(404, 'Slika ne postoji.');
    }
    admin_render('gallery-form', ['v' => $existing + ['render_key' => ''], 'errors' => [], 'existing' => $existing, 'cats' => gal_cats(), 'renders' => adm_render_keys()], 'Izmena slike', 'galerije');
}

/* ================================================================ brisanje (jedna ili označene) */

/** Briše slike po id-u; fajlovi samo ako ih niko drugi ne koristi. */
function gal_delete(array $ids): int
{
    $rows = db_all('SELECT `id`, `photo_path` FROM `gallery_images` WHERE `id` IN (' . implode(',', array_fill(0, count($ids), '?')) . ')', $ids);
    db_transaction(static function () use ($rows): void {
        foreach ($rows as $r) {
            db_run('DELETE FROM `gallery_images` WHERE `id` = ?', [(int) $r['id']]);
        }
    });
    adm_cleanup_files(array_column($rows, 'photo_path'));
    return count($rows);
}

/** Id-jevi iz POST liste (samo cele vrednosti). */
function gal_ids(mixed $raw): array
{
    return array_values(array_unique(array_map('intval', array_filter(is_array($raw) ? $raw : [], static fn($x) => is_string($x) && ctype_digit($x)))));
}

if ($action === 'delete') {
    $id = is_post() ? input_int($_POST, 'id') : input_int($_GET, 'id');
    $g = $id ? db_one('SELECT * FROM `gallery_images` WHERE `id` = ?', [$id]) : null;
    if (!$g) {
        throw new HttpException(404, 'Slika ne postoji.');
    }
    $errors = [];
    if (is_post()) {
        csrf_require();
        if (!input_bool($_POST, 'confirm')) {
            $errors['confirm'] = 'Potvrdite brisanje.';
        } else {
            gal_delete([(int) $id]);
            flash('success', 'Slika je obrisana.');
            redirect($self(['cat' => (int) $g['category_id']]));
        }
    }
    admin_render('gallery-delete', ['rows' => [$g], 'errors' => $errors, 'single' => true], 'Brisanje slike', 'galerije');
}

if ($action === 'bulk' && is_post()) {
    csrf_require();
    $back = is_string($_POST['back'] ?? null) ? safe_admin_next($_POST['back']) : $self();
    if (input_str($_POST, 'do') === 'delete') {
        $ids = gal_ids($_POST['sel'] ?? []);
        if (!$ids) {
            flash('warning', 'Niste označili nijednu sliku.');
            redirect($back);
        }
        $rows = db_all('SELECT * FROM `gallery_images` WHERE `id` IN (' . implode(',', array_fill(0, count($ids), '?')) . ') ORDER BY `sort_order`, `id`', $ids);
        admin_render('gallery-delete', ['rows' => $rows, 'errors' => [], 'single' => false, 'back' => $back], 'Brisanje slika', 'galerije');
    }
    $orders = is_array($_POST['order'] ?? null) ? $_POST['order'] : [];
    db_transaction(static function () use ($orders): void {
        foreach ($orders as $id => $ord) {
            $o = filter_var($ord, FILTER_VALIDATE_INT);
            if ($o !== false && ctype_digit((string) $id)) {
                db_run('UPDATE `gallery_images` SET `sort_order` = ? WHERE `id` = ?', [(int) $o, (int) $id]);
            }
        }
    });
    flash('success', 'Redosled slika je sačuvan.');
    redirect($back);
}

if ($action === 'bulk-delete' && is_post()) {
    csrf_require();
    $ids = gal_ids($_POST['ids'] ?? []);
    $back = is_string($_POST['back'] ?? null) ? safe_admin_next($_POST['back']) : $self();
    if (!$ids || !input_bool($_POST, 'confirm')) {
        flash('warning', 'Brisanje nije potvrđeno; slike nisu obrisane.');
        redirect($back);
    }
    flash('success', 'Obrisano slika: ' . gal_delete($ids) . '.');
    redirect($back);
}

/* ================================================================ lista */
$cats = gal_cats();
$filterCat = input_int($_GET, 'cat');
$rows = db_all(
    'SELECT g.*, c.`name_sr` AS cat_name, c.`is_active` AS cat_active FROM `gallery_images` g JOIN `gallery_categories` c ON c.`id` = g.`category_id`'
    . ($filterCat ? ' WHERE g.`category_id` = ?' : '') . ' ORDER BY g.`sort_order`, g.`id`',
    $filterCat ? [$filterCat] : []
);
admin_render('gallery-list', ['rows' => $rows, 'cats' => $cats, 'filterCat' => $filterCat], 'Galerija', 'galerije');
