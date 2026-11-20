<?php
/* TRICOM — modul „Česta pitanja“ (admin/index.php?m=pitanja).
   Akcije (a=): lista (podrazumevano), new, edit&id=, save (POST), order (POST),
   delete&id= (potvrda) i delete (POST).
   Pitanja se prikazuju u harmonici „Česta pitanja“ na strani O nama
   (o-nama.html, en/about.html) i na početnoj strani (#faq), sa FAQPage JSON-LD. */
defined('TRICOM') || exit;

require_once APP_DIR . '/admin/catalog-admin.php';

const FAQ_LIMITS = ['question' => 500, 'answer' => 5000];

$action = is_string($_GET['a'] ?? null) ? $_GET['a'] : '';
$self = static fn(array $q = []): string => admin_url('', ['m' => 'pitanja'] + $q);

function faq_form_input(): array
{
    $v = [];
    foreach (LANGS as $l) {
        $v['question_' . $l] = input_str($_POST, 'question_' . $l);
        $v['answer_' . $l] = input_str($_POST, 'answer_' . $l, true);
    }
    $v['sort_order'] = input_int($_POST, 'sort_order') ?? 0;
    $v['is_active'] = input_bool($_POST, 'is_active') ? 1 : 0;
    return $v;
}

function faq_validate(array $v): array
{
    $val = new Validator();
    $val->required('question_sr', $v['question_sr'], 'Pitanje — SR')->required('answer_sr', $v['answer_sr'], 'Odgovor — SR');
    foreach (LANGS as $l) {
        $val->maxLength('question_' . $l, $v['question_' . $l], FAQ_LIMITS['question'], 'Pitanje — ' . strtoupper($l));
        $val->maxLength('answer_' . $l, $v['answer_' . $l], FAQ_LIMITS['answer'], 'Odgovor — ' . strtoupper($l));
    }
    $val->intRange('sort_order', $v['sort_order'], -100000, 100000, 'Redosled');
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
                db_run('UPDATE `faq_items` SET `sort_order` = ? WHERE `id` = ?', [(int) $o, (int) $id]);
            }
        }
    });
    flash('success', 'Redosled pitanja je sačuvan.');
    redirect($self());
}

/* ---------------------------------------------------------------- POST: čuvanje */
if ($action === 'save' && is_post()) {
    csrf_require();
    $id = input_int($_POST, 'id');
    $existing = $id ? db_one('SELECT * FROM `faq_items` WHERE `id` = ?', [$id]) : null;
    if ($id && !$existing) {
        throw new HttpException(404, 'Pitanje ne postoji.');
    }
    $v = faq_form_input();
    $errors = faq_validate($v);
    if ($errors) {
        admin_render('faq-form', ['v' => $v, 'errors' => $errors, 'existing' => $existing], $existing ? 'Izmena pitanja' : 'Novo pitanje', 'pitanja');
    }
    $data = ['sort_order' => $v['sort_order'], 'is_active' => $v['is_active'],
        'question_sr' => $v['question_sr'], 'question_en' => $v['question_en'], 'answer_sr' => $v['answer_sr'], 'answer_en' => $v['answer_en'] === '' ? null : $v['answer_en']];
    if ($existing) {
        db_update('faq_items', $data, '`id` = ?', [(int) $existing['id']]);
        $fid = (int) $existing['id'];
    } else {
        $fid = db_insert('faq_items', $data);
    }
    flash('success', 'Pitanje je sačuvano.');
    redirect($self(['a' => 'edit', 'id' => $fid]));
}

/* ---------------------------------------------------------------- brisanje */
if ($action === 'delete') {
    $id = is_post() ? input_int($_POST, 'id') : input_int($_GET, 'id');
    $f = $id ? db_one('SELECT * FROM `faq_items` WHERE `id` = ?', [$id]) : null;
    if (!$f) {
        throw new HttpException(404, 'Pitanje ne postoji.');
    }
    $errors = [];
    if (is_post()) {
        csrf_require();
        if (!input_bool($_POST, 'confirm')) {
            $errors['confirm'] = 'Potvrdite brisanje.';
        } else {
            db_run('DELETE FROM `faq_items` WHERE `id` = ?', [$id]);
            flash('success', 'Pitanje je obrisano.');
            redirect($self());
        }
    }
    admin_render('faq-delete', ['f' => $f, 'errors' => $errors], 'Brisanje pitanja', 'pitanja');
}

/* ---------------------------------------------------------------- nova / izmena */
if ($action === 'new' || $action === 'edit') {
    $existing = null;
    if ($action === 'edit') {
        $existing = db_one('SELECT * FROM `faq_items` WHERE `id` = ?', [input_int($_GET, 'id') ?? 0]);
        if (!$existing) {
            throw new HttpException(404, 'Pitanje ne postoji.');
        }
    }
    $v = $existing ?? ['is_active' => 1, 'sort_order' => ((int) db_value('SELECT COALESCE(MAX(`sort_order`), 0) FROM `faq_items`')) + 10];
    admin_render('faq-form', ['v' => $v, 'errors' => [], 'existing' => $existing], $existing ? 'Izmena pitanja' : 'Novo pitanje', 'pitanja');
}

/* ---------------------------------------------------------------- lista */
$rows = db_all('SELECT `id`, `question_sr`, `question_en`, `answer_en`, `sort_order`, `is_active` FROM `faq_items` ORDER BY `sort_order`, `id`');
admin_render('faq-list', ['rows' => $rows], 'Česta pitanja', 'pitanja');
