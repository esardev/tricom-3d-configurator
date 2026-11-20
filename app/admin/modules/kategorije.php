<?php
/* TRICOM — modul „Kategorije proizvoda“ (admin/index.php?m=kategorije).
   Akcije (a=): lista (podrazumevano), new, edit&id=, save (POST), order (POST),
   delete&id= (potvrda) i delete (POST). Kategorija sa proizvodima se briše tek
   pošto se njeni proizvodi premeste u drugu kategoriju; proizvodi se nikad ne
   brišu uz kategoriju. Hijerarhija (zakrpa 007): nadređena kategorija daje
   program grupe ili podgrupu programa (najviše ADM_CAT_LEVELS nivoa);
   kategorija sa podkategorijama se ne briše. */
defined('TRICOM') || exit;

require_once APP_DIR . '/admin/catalog-admin.php';

const CAT_RESERVED = ['main', 'prog', 'header', 'mobilenav', 'item'];

$action = is_string($_GET['a'] ?? null) ? $_GET['a'] : '';
$self = static fn(array $q = []): string => admin_url('', ['m' => 'kategorije'] + $q);

/** Vrednosti forme iz POST-a (i provera). */
function cat_form_input(?array $existing): array
{
    $v = [];
    foreach (['name', 'nav_label', 'heading'] as $f) {
        foreach (LANGS as $l) {
            $v[$f . '_' . $l] = input_str($_POST, $f . '_' . $l);
        }
    }
    foreach (LANGS as $l) {
        $v['intro_' . $l] = input_str($_POST, 'intro_' . $l, true);
    }
    $v['slug'] = $existing ? $existing['slug'] : mb_strtolower(input_str($_POST, 'slug'), 'UTF-8');
    if (!$existing && $v['slug'] === '' && $v['name_sr'] !== '') {
        $v['slug'] = slugify($v['name_sr']);
    }
    $v['sort_order'] = input_int($_POST, 'sort_order') ?? 0;
    $v['is_active'] = input_bool($_POST, 'is_active') ? 1 : 0;
    if (adm_has_cat_tree()) {
        $v['parent_id'] = input_int($_POST, 'parent_id') ?: null;
    }
    return $v;
}

/** Dozvoljene nadređene kategorije: [id => red stabla]; bez same kategorije i njenih potomaka,
    i samo tako da ni najdublja podkategorija ne pređe ADM_CAT_LEVELS nivoa. */
function cat_parent_choices(?array $existing): array
{
    $tree = adm_category_tree();
    $self = $existing ? (int) $existing['id'] : 0;
    $height = 0;          // koliko nivoa ispod sebe kategorija već ima
    $skip = [];
    $in = false;
    $base = 0;
    foreach ($tree as $r) {
        if ((int) $r['id'] === $self) {
            $in = true;
            $base = (int) $r['depth'];
            $skip[$self] = true;
            continue;
        }
        if ($in && (int) $r['depth'] > $base) {
            $skip[(int) $r['id']] = true;
            $height = max($height, (int) $r['depth'] - $base);
            continue;
        }
        $in = false;
    }
    $out = [];
    foreach ($tree as $r) {
        if (!isset($skip[(int) $r['id']]) && (int) $r['depth'] + 1 + $height < ADM_CAT_LEVELS) {
            $out[(int) $r['id']] = $r;
        }
    }
    return $out;
}

function cat_validate(array $v, ?array $existing): array
{
    $val = new Validator();
    if (!$existing) {
        $val->required('slug', $v['slug'], 'Slug')->slug('slug', $v['slug'], 'Slug', 60);
        if (in_array($v['slug'], CAT_RESERVED, true)) {
            $val->add('slug', 'Ovaj slug je rezervisan na strani proizvoda; izaberite drugi.');
        } elseif ((int) db_value('SELECT COUNT(*) FROM `categories` WHERE `slug` = ?', [$v['slug']]) > 0) {
            $val->add('slug', 'Kategorija sa ovim slugom već postoji.');
        }
    }
    $val->required('name_sr', $v['name_sr'], 'Naziv taba — SR');
    foreach (LANGS as $l) {
        $L = strtoupper($l);
        $val->maxLength('name_' . $l, $v['name_' . $l], 120, 'Naziv taba — ' . $L)
            ->maxLength('nav_label_' . $l, $v['nav_label_' . $l], 120, 'Oznaka u meniju — ' . $L)
            ->maxLength('heading_' . $l, $v['heading_' . $l], 255, 'Naslov taba — ' . $L)
            ->maxLength('intro_' . $l, $v['intro_' . $l], 3000, 'Uvod — ' . $L);
    }
    $val->intRange('sort_order', $v['sort_order'], -100000, 100000, 'Redosled');
    if (($v['parent_id'] ?? null) !== null && !isset(cat_parent_choices($existing)[$v['parent_id']])) {
        $val->add('parent_id', 'Izabrana nadređena kategorija nije dozvoljena (ista kategorija, njena podkategorija ili više od ' . ADM_CAT_LEVELS . ' nivoa).');
    }
    return $val->errors();
}

/* ---------------------------------------------------------------- POST: redosled */
if ($action === 'order' && is_post()) {
    csrf_require();
    $orders = is_array($_POST['order'] ?? null) ? $_POST['order'] : [];
    db_transaction(static function () use ($orders): void {
        foreach ($orders as $id => $ord) {
            $o = filter_var($ord, FILTER_VALIDATE_INT);
            if ($o !== false && ctype_digit((string) $id)) {
                db_run('UPDATE `categories` SET `sort_order` = ? WHERE `id` = ?', [(int) $o, (int) $id]);
            }
        }
    });
    flash('success', 'Redosled kategorija je sačuvan.');
    redirect($self());
}

/* ---------------------------------------------------------------- POST: čuvanje */
if ($action === 'save' && is_post()) {
    csrf_require();
    $id = input_int($_POST, 'id');
    $existing = $id ? db_one('SELECT * FROM `categories` WHERE `id` = ?', [$id]) : null;
    if ($id && !$existing) {
        throw new HttpException(404, 'Kategorija ne postoji.');
    }
    $v = cat_form_input($existing);
    $errors = cat_validate($v, $existing);
    if ($errors) {
        admin_render('category-form', ['v' => $v, 'errors' => $errors, 'existing' => $existing], $existing ? 'Izmena kategorije' : 'Nova kategorija', 'kategorije');
    }
    $data = $v;
    foreach (['nav_label_sr', 'nav_label_en', 'intro_sr', 'intro_en'] as $k) {
        $data[$k] = $data[$k] === '' ? null : $data[$k];
    }
    if ($existing) {
        unset($data['slug']);
        db_update('categories', $data, '`id` = ?', [(int) $existing['id']]);
        flash('success', 'Kategorija „' . $v['name_sr'] . '“ je sačuvana.');
    } else {
        $id = db_insert('categories', $data);
        flash('success', 'Kategorija „' . $v['name_sr'] . '“ je dodata. Proizvode joj dodelite u modulu „Proizvodi“.');
    }
    redirect($self());
}

/* ---------------------------------------------------------------- brisanje */
if ($action === 'delete') {
    $id = is_post() ? input_int($_POST, 'id') : input_int($_GET, 'id');
    $cat = $id ? db_one('SELECT * FROM `categories` WHERE `id` = ?', [$id]) : null;
    if (!$cat) {
        throw new HttpException(404, 'Kategorija ne postoji.');
    }
    $primary = db_all('SELECT `id`, `slug`, `title_sr` FROM `products` WHERE `category_id` = ? ORDER BY `sort_order`, `id`', [$id]);
    $listed = (int) db_value('SELECT COUNT(*) FROM `product_categories` WHERE `category_id` = ?', [$id]);
    $others = array_values(array_filter(adm_category_tree(), static fn($o) => (int) $o['id'] !== $id));
    $children = adm_has_cat_tree() ? db_all('SELECT `id`, `name_sr` FROM `categories` WHERE `parent_id` = ? ORDER BY `sort_order`, `id`', [$id]) : [];
    $errors = [];
    if ($children) {
        $errors['children'] = 'Kategorija ima podkategorije (' . implode(', ', array_column($children, 'name_sr')) . '). Prvo ih premestite pod drugu kategoriju ili obrišite.';
    }

    if (is_post()) {
        csrf_require();
        $target = input_int($_POST, 'target');
        if (!$children && !input_bool($_POST, 'confirm')) {
            $errors['confirm'] = 'Potvrdite brisanje.';
        }
        if ($primary && (!$target || !in_array($target, array_map(static fn($o) => (int) $o['id'], $others), true))) {
            $errors['target'] = 'Izaberite kategoriju u koju prelaze proizvodi ove kategorije.';
        }
        if (!$errors) {
            db_transaction(static function () use ($id, $target, $primary): void {
                if ($primary) {
                    db_run('UPDATE `products` SET `category_id` = ? WHERE `category_id` = ?', [$target, $id]);
                }
                /* prikazi u tabu ove kategorije se brišu sa njom (ON DELETE CASCADE); proizvodi ostaju */
                db_run('DELETE FROM `categories` WHERE `id` = ?', [$id]);
            });
            flash('success', 'Kategorija „' . $cat['name_sr'] . '“ je obrisana.' . ($primary ? ' ' . count($primary) . ' proizvod(a) je premešteno.' : ''));
            redirect($self());
        }
    }
    admin_render('category-delete', compact('cat', 'primary', 'listed', 'others', 'errors'), 'Brisanje kategorije', 'kategorije');
}

/* ---------------------------------------------------------------- forma */
if ($action === 'new' || $action === 'edit') {
    $existing = null;
    if ($action === 'edit') {
        $existing = db_one('SELECT * FROM `categories` WHERE `id` = ?', [input_int($_GET, 'id') ?? 0]);
        if (!$existing) {
            throw new HttpException(404, 'Kategorija ne postoji.');
        }
    }
    $v = $existing ?? ['slug' => '', 'sort_order' => ((int) db_value('SELECT COALESCE(MAX(`sort_order`), 0) FROM `categories`')) + 10, 'is_active' => 1,
        'parent_id' => input_int($_GET, 'parent')];
    admin_render('category-form', ['v' => $v, 'errors' => [], 'existing' => $existing], $existing ? 'Izmena kategorije' : 'Nova kategorija', 'kategorije');
}

/* ---------------------------------------------------------------- lista */
$rows = db_all(
    'SELECT c.*,
        (SELECT COUNT(*) FROM `products` p WHERE p.`category_id` = c.`id`) AS primary_count,
        (SELECT COUNT(*) FROM `product_categories` pc WHERE pc.`category_id` = c.`id`) AS listed_count
     FROM `categories` c ORDER BY c.`sort_order`, c.`id`'
);
admin_render('categories-list', ['rows' => adm_category_tree($rows)], 'Kategorije proizvoda', 'kategorije');
