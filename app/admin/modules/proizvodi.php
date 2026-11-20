<?php
/* TRICOM — modul „Proizvodi“ (admin/index.php?m=proizvodi).
   Akcije (a=): lista (podrazumevano; filter cat=, q=), new, edit&id=, save (POST),
   order (POST), delete&id= (potvrda) i delete (POST).
   Jedan proizvod = jedan red sa srpskim i engleskim poljima; tehnički podaci
   su redovi (oznaka i vrednost na oba jezika); prikaz u tabovima su redovi
   product_categories sa opcionim tekstom kartice. */
defined('TRICOM') || exit;

require_once APP_DIR . '/admin/catalog-admin.php';

$action = is_string($_GET['a'] ?? null) ? $_GET['a'] : '';
$self = static fn(array $q = []): string => admin_url('', ['m' => 'proizvodi'] + $q);

/* ================================================================ učitavanje i ulaz */

/** Prikazi u tabovima: [category_id => red] */
function prod_listings_of(int $id): array
{
    $out = [];
    foreach (db_all('SELECT * FROM `product_categories` WHERE `product_id` = ?', [$id]) as $r) {
        $out[(int) $r['category_id']] = $r + ['on' => 1];
    }
    return $out;
}

/** Vrednosti forme iz POST-a: zajednička polja sadržaja + primarna kategorija. */
function prod_form_input(?array $existing): array
{
    return adm_content_input($existing) + ['category_id' => input_int($_POST, 'category_id')];
}

/** Prikazi u tabovima iz POST-a: [category_id => polja]. */
function prod_listings_input(array $cats, array $old): array
{
    $raw = is_array($_POST['listing'] ?? null) ? $_POST['listing'] : [];
    $out = [];
    foreach ($cats as $c) {
        $cid = (int) $c['id'];
        $r = is_array($raw[$cid] ?? null) ? $raw[$cid] : [];
        $row = ['on' => input_bool($r, 'on') ? 1 : 0, 'sort_order' => input_int($r, 'sort_order') ?? 0];
        foreach (['card_title', 'card_image_alt'] as $f) {
            foreach (LANGS as $l) {
                $row[$f . '_' . $l] = input_str($r, $f . '_' . $l);
            }
        }
        foreach (['card_text', 'card_tags'] as $f) {
            foreach (LANGS as $l) {
                $row[$f . '_' . $l] = input_str($r, $f . '_' . $l, true);
            }
        }
        $row['card_image_type'] = input_str($r, 'card_image_type') ?: 'inherit';
        $row['card_render_key'] = input_str($r, 'card_render_key');
        /* fotografija kartice nema otpremanje u formi; postojeća se zadržava */
        foreach (['card_photo_path', 'card_photo_width', 'card_photo_height'] as $k) {
            $row[$k] = $old[$cid][$k] ?? null;
        }
        $out[$cid] = $row;
    }
    return $out;
}

/* ================================================================ provera */

function prod_validate(array $v, array $specs, array $listings, ?array $existing, array $cats): array
{
    $val = new Validator();
    adm_content_validate($val, $v, $specs, $existing, 'Proizvod');
    $catIds = array_map(static fn($c) => (int) $c['id'], $cats);
    if (!in_array($v['category_id'], $catIds, true)) {
        $val->add('category_id', 'Izaberite primarnu kategoriju.');
    }

    $renders = adm_render_keys();
    foreach ($listings as $cid => $r) {
        if (!$r['on']) {
            continue;
        }
        $val->intRange('listing_' . $cid, $r['sort_order'], -100000, 100000, 'Redosled u tabu');
        if (!in_array($r['card_image_type'], ['inherit', 'none', 'render', 'photo'], true)
            || ($r['card_image_type'] === 'render' && !isset($renders[$r['card_render_key']]))
            || ($r['card_image_type'] === 'photo' && (string) $r['card_photo_path'] === '')) {
            $val->add('listing_' . $cid, 'Kartica u tabu: izaberite ispravnu sliku kartice.');
        }
        foreach (['card_title' => 255, 'card_image_alt' => 255, 'card_text' => 3000, 'card_tags' => 2000] as $f => $max) {
            foreach (LANGS as $l) {
                if (mb_strlen($r[$f . '_' . $l], 'UTF-8') > $max) {
                    $val->add('listing_' . $cid, 'Kartica u tabu: tekst je predug (najviše ' . $max . ' znakova).');
                }
            }
        }
    }
    return $val->errors();
}

/* ================================================================ forma */

function prod_render_form(array $v, array $specs, array $listings, array $errors, ?array $existing): never
{
    $cats = adm_category_tree();   // grupe, programi i podgrupe redom stabla (path = „Limovi › Bakar › …“)
    $drawings = adm_drawing_choices($v['drawing_path'] ?? null);
    admin_render('product-form', [
        'v' => $v, 'specs' => $specs, 'listings' => $listings, 'errors' => $errors, 'existing' => $existing, 'cats' => $cats,
        'renders' => adm_render_keys(), 'illus' => adm_illu_keys(), 'drawings' => $drawings, 'known' => catalog_known_slugs(),
    ], $existing ? 'Izmena proizvoda' : 'Novi proizvod', 'proizvodi');
}

/* ---------------------------------------------------------------- POST: redosled */
if ($action === 'order' && is_post()) {
    csrf_require();
    $orders = is_array($_POST['order'] ?? null) ? $_POST['order'] : [];
    db_transaction(static function () use ($orders): void {
        foreach ($orders as $id => $ord) {
            $o = filter_var($ord, FILTER_VALIDATE_INT);
            if ($o !== false && ctype_digit((string) $id)) {
                db_run('UPDATE `products` SET `sort_order` = ? WHERE `id` = ?', [(int) $o, (int) $id]);
            }
        }
    });
    flash('success', 'Redosled proizvoda je sačuvan.');
    $back = is_string($_POST['back'] ?? null) ? safe_admin_next($_POST['back']) : $self();
    redirect($back);
}

/* ---------------------------------------------------------------- POST: čuvanje */
if ($action === 'save' && is_post()) {
    csrf_require();
    $id = input_int($_POST, 'id');
    $existing = $id ? db_one('SELECT * FROM `products` WHERE `id` = ?', [$id]) : null;
    if ($id && !$existing) {
        throw new HttpException(404, 'Proizvod ne postoji.');
    }
    $cats = db_all('SELECT `id` FROM `categories`');
    $v = prod_form_input($existing);
    $specs = adm_specs_input();
    $oldListings = $existing ? prod_listings_of((int) $existing['id']) : [];
    $listings = prod_listings_input(db_all('SELECT `id` FROM `categories` ORDER BY `sort_order`, `id`'), $oldListings);
    $errors = prod_validate($v, $specs, $listings, $existing, $cats);

    /* otpremanje tek kad je ostatak forme ispravan */
    $new = $errors ? [] : adm_content_uploads($v, $errors, 'products');
    if ($errors) {
        if (upload_present('photo_file') || upload_present('drawing_file')) {
            $errors['_files'] = 'Izabrani fajlovi nisu sačuvani — izaberite ih ponovo.';
        }
        prod_render_form($v, $specs, $listings, $errors, $existing);
    }

    $data = ['category_id' => $v['category_id']] + adm_content_data($v);

    try {
        $pid = db_transaction(static function () use ($existing, $data, $v, $specs, $listings): int {
            if ($existing) {
                $pid = (int) $existing['id'];
                db_update('products', $data, '`id` = ?', [$pid]);
            } else {
                $pid = db_insert('products', $data + ['slug' => $v['slug']]);
            }
            adm_save_specs('product', $pid, $specs);
            db_run('DELETE FROM `product_categories` WHERE `product_id` = ?', [$pid]);
            foreach ($listings as $cid => $r) {
                if (!$r['on']) {
                    continue;
                }
                $row = ['product_id' => $pid, 'category_id' => $cid, 'sort_order' => $r['sort_order'],
                    'card_image_type' => $r['card_image_type'],
                    'card_render_key' => $r['card_image_type'] === 'render' ? $r['card_render_key'] : null,
                    'card_photo_path' => $r['card_image_type'] === 'photo' ? $r['card_photo_path'] : null,
                    'card_photo_width' => $r['card_image_type'] === 'photo' ? $r['card_photo_width'] : null,
                    'card_photo_height' => $r['card_image_type'] === 'photo' ? $r['card_photo_height'] : null];
                foreach (['card_title', 'card_text', 'card_tags', 'card_image_alt'] as $f) {
                    foreach (LANGS as $l) {
                        $row[$f . '_' . $l] = $r[$f . '_' . $l] === '' ? null : $r[$f . '_' . $l];
                    }
                }
                db_insert('product_categories', $row);
            }
            return $pid;
        });
    } catch (Throwable $ex) {
        foreach ($new as $p) {
            upload_delete($p);
        }
        throw $ex;
    }

    /* stari otpremljeni fajlovi koje više niko ne koristi */
    $old = [];
    if ($existing) {
        $old = [$existing['photo_path'], $existing['drawing_path']];
        foreach ($oldListings as $r) {
            $old[] = $r['card_photo_path'];
        }
    }
    adm_cleanup_files($old);

    flash('success', 'Proizvod „' . $v['title_sr'] . '“ je sačuvan.');
    redirect($self(['a' => 'edit', 'id' => $pid]));
}

/* ---------------------------------------------------------------- brisanje */
if ($action === 'delete') {
    $id = is_post() ? input_int($_POST, 'id') : input_int($_GET, 'id');
    $p = $id ? db_one('SELECT * FROM `products` WHERE `id` = ?', [$id]) : null;
    if (!$p) {
        throw new HttpException(404, 'Proizvod ne postoji.');
    }
    $listings = db_all('SELECT c.`name_sr` FROM `product_categories` pc JOIN `categories` c ON c.`id` = pc.`category_id` WHERE pc.`product_id` = ? ORDER BY c.`sort_order`', [$id]);
    $refs = adm_related_mentions($p['slug'], 'products', (int) $id);
    $mentions = adm_static_mentions($p['slug']);
    $errors = [];
    if (is_post()) {
        csrf_require();
        if (!input_bool($_POST, 'confirm')) {
            $errors['confirm'] = 'Potvrdite brisanje.';
        } else {
            $files = [$p['photo_path'], $p['drawing_path']];
            foreach (db_all('SELECT `card_photo_path` FROM `product_categories` WHERE `product_id` = ?', [$id]) as $r) {
                $files[] = $r['card_photo_path'];
            }
            db_transaction(static function () use ($id, $p): void {
                db_run('DELETE FROM `products` WHERE `id` = ?', [$id]);   // tehnički podaci i prikazi: ON DELETE CASCADE
                adm_remove_related_slug($p['slug']);
            });
            adm_cleanup_files($files);   // samo uploads/ i samo ako ih niko drugi ne koristi
            flash('success', 'Proizvod „' . $p['title_sr'] . '“ je obrisan. Njegova adresa sada vraća 404.');
            redirect($self());
        }
    }
    admin_render('product-delete', compact('p', 'listings', 'refs', 'mentions', 'errors'), 'Brisanje proizvoda', 'proizvodi');
}

/* ---------------------------------------------------------------- nova / izmena */
if ($action === 'new' || $action === 'edit') {
    if ($action === 'edit') {
        $existing = db_one('SELECT * FROM `products` WHERE `id` = ?', [input_int($_GET, 'id') ?? 0]);
        if (!$existing) {
            throw new HttpException(404, 'Proizvod ne postoji.');
        }
        $v = $existing;
        $v['related'] = implode("\n", catalog_related_slugs($existing));
        $v['drawing_path'] = (string) $existing['drawing_path'];
        prod_render_form($v, adm_specs_of('product', (int) $existing['id']), prod_listings_of((int) $existing['id']), [], $existing);
    }
    $cat = input_int($_GET, 'cat');
    $v = ['slug' => '', 'category_id' => $cat, 'is_active' => 1, 'image_type' => 'none', 'render_key' => '', 'illu_key' => '', 'drawing_path' => '',
        'calc_id' => '', 'calc_tabs' => '', 'konf_hash' => '', 'related' => '',
        'sort_order' => ((int) db_value('SELECT COALESCE(MAX(`sort_order`), 0) FROM `products`')) + 10];
    $listings = $cat ? [$cat => ['on' => 1, 'sort_order' => ((int) db_value('SELECT COALESCE(MAX(`sort_order`), 0) FROM `product_categories` WHERE `category_id` = ?', [$cat])) + 10, 'card_image_type' => 'inherit']] : [];
    prod_render_form($v, [], $listings, [], null);
}

/* ---------------------------------------------------------------- lista */
$filterCat = input_int($_GET, 'cat');
$q = input_str($_GET, 'q');
$where = [];
$params = [];
if ($filterCat) {
    $where[] = '(p.`category_id` = ? OR EXISTS (SELECT 1 FROM `product_categories` x WHERE x.`product_id` = p.`id` AND x.`category_id` = ?))';
    array_push($params, $filterCat, $filterCat);
}
if ($q !== '') {
    $where[] = '(p.`title_sr` LIKE ? OR p.`title_en` LIKE ? OR p.`slug` LIKE ?)';
    $like = '%' . addcslashes($q, '%_\\') . '%';
    array_push($params, $like, $like, $like);
}
$rows = db_all(
    'SELECT p.`id`, p.`slug`, p.`title_sr`, p.`title_en`, p.`summary_en`, p.`sort_order`, p.`is_active`, p.`image_type`, p.`render_key`, p.`illu_key`, p.`photo_path`,
        c.`name_sr` AS cat_name,
        (SELECT COUNT(*) FROM `product_specs` s WHERE s.`product_id` = p.`id`) AS spec_count,
        (SELECT GROUP_CONCAT(c2.`name_sr` ORDER BY c2.`sort_order` SEPARATOR \', \') FROM `product_categories` pc JOIN `categories` c2 ON c2.`id` = pc.`category_id` WHERE pc.`product_id` = p.`id`) AS listed_in
     FROM `products` p JOIN `categories` c ON c.`id` = p.`category_id`'
    . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY p.`sort_order`, p.`id`',
    $params
);
$cats = adm_category_tree();
admin_render('products-list', ['rows' => $rows, 'cats' => $cats, 'filterCat' => $filterCat, 'q' => $q], 'Proizvodi', 'proizvodi');
