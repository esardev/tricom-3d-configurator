<?php
/* Forma kategorije. Ulaz: $v (vrednosti), $errors, $existing (null = nova) */
defined('TRICOM') || exit;
$tree = adm_has_cat_tree();
$parents = $tree ? array_map(static fn($r) => str_repeat('— ', (int) $r['depth']) . $r['path'], cat_parent_choices($existing)) : [];
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'kategorije'])) ?>">← Kategorije proizvoda</a></p>
<h1 class="adm-h1"><?= $existing ? 'Izmena kategorije: ' . e($existing['name_sr']) : 'Nova kategorija' ?></h1>
<?= adm_error_summary($errors) ?>
<form method="post" action="<?= e(admin_url('', ['m' => 'kategorije', 'a' => 'save'])) ?>" class="adm-form" novalidate>
  <?= csrf_field() ?>
  <?php if ($existing): ?><input type="hidden" name="id" value="<?= (int) $existing['id'] ?>"><?php endif; ?>

  <?= adm_fieldset('Osnovno',
      ($existing
        ? '<div class="adm-field"><span>Slug / adresa</span><p><code>' . e(site_category_href('proizvodi.html', 'sr', $existing)) . '</code> <small class="adm-muted">slug se ne menja (adresa i veze u meniju)</small></p></div>'
        : adm_input('slug', $v['slug'] ?? '', 'Slug', $errors, ['maxlength' => 60, 'hint' => 'Mala slova bez kvačica, brojevi i crtice (npr. ograde); jedinstven za sve kategorije. Grupa: proizvodi.html?grupa=slug; program: …&program=slug; podgrupa: …&podgrupa=slug. Ne može se kasnije menjati. Prazno = predlog iz naziva.', 'spellcheck' => 'false']))
      . ($tree ? adm_select('parent_id', (string) ($v['parent_id'] ?? ''), 'Nadređena kategorija', ['' => '— nema: grupa (tab na strani Proizvodi) —'] + $parents, $errors,
          ['hint' => 'Prazno = grupa (tab i stavka u meniju). Izbor grupe = program te grupe (kartica u izboru, npr. Limovi → Bakar); izbor programa = podgrupa (npr. Bakar → Bakar u koturu). Najviše tri nivoa. Tehničke tabele postojećih programa i podgrupa limova vezane su za slug.']) : '')
      . '<div class="adm-row">' . adm_input('sort_order', $v['sort_order'] ?? 0, 'Redosled', $errors, ['type' => 'number', 'hint' => 'Manji broj = tab više levo.'])
      . adm_checkbox('is_active', (int) ($v['is_active'] ?? 1) === 1, 'Vidljiva na sajtu') . '</div>') ?>

  <?= adm_fieldset('Tekst taba (srpski i engleski)',
      adm_pair('name', $v, 'Naziv (tab, program ili podgrupa)', $errors, 'input', ['maxlength' => 120, 'required' => true])
      . adm_pair('nav_label', $v, 'Oznaka u podmeniju „Proizvodi“', $errors, 'input', ['maxlength' => 120, 'hint' => 'Prazno = naziv taba.'])
      . adm_pair('heading', $v, 'Naslov u tabu / iznad sadržaja', $errors, 'input', ['maxlength' => 255, 'hint' => 'Prazno kod programa i podgrupe = naziv.'])
      . adm_pair('intro', $v, 'Uvodni pasus', $errors, 'textarea', ['rows' => 4, 'maxlength' => 3000]),
      'Ostali sadržaj postojećih tabova (tabele kataloga, crteži, liste) je deo dizajna strane i ne menja se ovde.') ?>

  <div class="adm-acts">
    <button type="submit" class="adm-btn">Sačuvaj</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'kategorije'])) ?>">Odustani</a>
  </div>
</form>
