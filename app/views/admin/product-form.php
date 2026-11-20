<?php
/* Forma proizvoda. Ulaz: $v, $specs, $listings, $errors, $existing, $cats, $renders, $illus, $drawings, $known */
defined('TRICOM') || exit;
$isNew = $existing === null;
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'proizvodi'])) ?>">← Proizvodi</a></p>
<div class="adm-head">
  <h1 class="adm-h1"><?= $isNew ? 'Novi proizvod' : 'Izmena: ' . e($existing['title_sr']) ?></h1>
  <?php if (!$isNew && (int) $existing['is_active'] === 1): ?>
    <p class="adm-links"><a href="<?= e(adm_product_public_url($existing['slug'])) ?>" target="_blank" rel="noopener">Strana (SR) ↗</a> <a href="<?= e(adm_product_public_url($existing['slug'], 'en')) ?>" target="_blank" rel="noopener">Strana (EN) ↗</a></p>
  <?php endif; ?>
</div>
<?= adm_error_summary($errors) ?>

<form method="post" action="<?= e(admin_url('', ['m' => 'proizvodi', 'a' => 'save'])) ?>" class="adm-form" enctype="multipart/form-data" novalidate>
  <?= csrf_field() ?>
  <?php if (!$isNew): ?><input type="hidden" name="id" value="<?= (int) $existing['id'] ?>"><?php endif; ?>

  <?= adm_fieldset('Osnovno',
      ($isNew
        ? adm_input('slug', $v['slug'] ?? '', 'Slug (adresa strane)', $errors, ['maxlength' => 120, 'spellcheck' => 'false', 'hint' => 'Postaje detalji/slug.html i en/details/slug.html; ne može se kasnije menjati. Prazno = predlog iz srpskog naziva (đ → dj).'])
        : '<div class="adm-field"><span>Slug (adresa strane)</span><p><code>detalji/' . e($existing['slug']) . '.html</code> · <code>en/details/' . e($existing['slug']) . '.html</code> <small class="adm-muted">ne menja se</small></p></div>')
      . '<div class="adm-row">'
      . adm_select('category_id', $v['category_id'] ?? '', 'Primarna kategorija', ['' => '— izaberite —'] + array_column($cats, 'path', 'id'), $errors, ['hint' => 'Veza „Proizvodi“ i „Nazad“ na strani proizvoda.'])
      . adm_input('sort_order', $v['sort_order'] ?? 0, 'Redosled', $errors, ['type' => 'number'])
      . adm_checkbox('is_active', (int) ($v['is_active'] ?? 1) === 1, 'Vidljiv na sajtu', ['hint' => 'Sakriven proizvod: strana vraća 404, kartice se ne prikazuju.'])
      . '</div>') ?>

  <?php $cf = ['of' => 'proizvoda', 'calc' => true]; require __DIR__ . '/content-fields.php'; ?>

  <fieldset class="adm-set">
    <legend>Prikaz u tabovima, programima i podgrupama</legend>
    <p class="adm-muted adm-set__hint">U kojim tabovima strane „Proizvodi“ (i programima / podgrupama, npr. Limovi › Bakar › Bakar u koturu) se proizvod vidi kao kartica. Proizvod ne mora biti ni u jednom tabu (npr. kada se prikazuje samo na početnoj ili u uslugama). Tekst kartice je opcion — prazno polje koristi naziv, sažetak i oznake proizvoda.</p>
    <?php foreach ($cats as $c): $cid = (int) $c['id']; $r = $listings[$cid] ?? ['on' => 0]; $nm = static fn(string $k): string => 'listing[' . $cid . '][' . $k . ']'; ?>
      <div class="adm-listing" id="f-listing_<?= $cid ?>">
        <div class="adm-row">
          <label class="adm-check"><input type="checkbox" name="<?= e($nm('on')) ?>" value="1"<?= !empty($r['on']) ? ' checked' : '' ?>> <span><?= (int) $c['depth'] === 0 ? 'Tab' : ((int) $c['depth'] === 1 ? 'Program' : 'Podgrupa') ?> „<?= e($c['path']) ?>“</span><?= (int) $c['is_active'] === 1 ? '' : ' <small class="adm-muted">(kategorija je sakrivena)</small>' ?></label>
          <?= adm_input($nm('sort_order'), $r['sort_order'] ?? 0, 'Redosled u tabu', [], ['type' => 'number']) ?>
        </div>
        <?= adm_error($errors, 'listing_' . $cid) ?>
        <details class="adm-details"<?= (!empty($r['card_title_sr']) || !empty($r['card_text_sr']) || !empty($r['card_tags_sr']) || (($r['card_image_type'] ?? 'inherit') !== 'inherit')) ? ' open' : '' ?>>
          <summary>Tekst i slika kartice u ovom tabu</summary>
          <div class="adm-pair">
            <?= adm_input($nm('card_title_sr'), $r['card_title_sr'] ?? '', 'Naslov kartice — SR', [], ['maxlength' => 255, 'lang' => 'sr']) ?>
            <?= adm_input($nm('card_title_en'), $r['card_title_en'] ?? '', 'Naslov kartice — EN', [], ['maxlength' => 255, 'lang' => 'en']) ?>
          </div>
          <div class="adm-pair">
            <?= adm_textarea($nm('card_text_sr'), $r['card_text_sr'] ?? '', 'Tekst kartice — SR', [], ['rows' => 3, 'maxlength' => 3000, 'lang' => 'sr']) ?>
            <?= adm_textarea($nm('card_text_en'), $r['card_text_en'] ?? '', 'Tekst kartice — EN', [], ['rows' => 3, 'maxlength' => 3000, 'lang' => 'en']) ?>
          </div>
          <p class="adm-note">Naglašen deo teksta: &lt;strong&gt;reč&lt;/strong&gt; (ostale oznake se prikazuju kao tekst). U listi „Građevinska limarija“ svaki red je jedna stavka.</p>
          <div class="adm-pair">
            <?= adm_textarea($nm('card_tags_sr'), $r['card_tags_sr'] ?? '', 'Oznake kartice — SR', [], ['rows' => 2, 'maxlength' => 2000, 'lang' => 'sr', 'hint' => 'Jedna po redu.']) ?>
            <?= adm_textarea($nm('card_tags_en'), $r['card_tags_en'] ?? '', 'Oznake kartice — EN', [], ['rows' => 2, 'maxlength' => 2000, 'lang' => 'en']) ?>
          </div>
          <div class="adm-row">
            <?= adm_select($nm('card_image_type'), $r['card_image_type'] ?? 'inherit', 'Slika kartice',
                ['inherit' => 'kao proizvod', 'none' => 'bez slike', 'render' => 'drugi render'] + ((string) ($r['card_photo_path'] ?? '') !== '' ? ['photo' => 'postojeća fotografija'] : [])) ?>
            <?= adm_select($nm('card_render_key'), $r['card_render_key'] ?? '', 'Render kartice', ['' => '—'] + $renders) ?>
          </div>
          <div class="adm-pair">
            <?= adm_input($nm('card_image_alt_sr'), $r['card_image_alt_sr'] ?? '', 'Opis slike kartice — SR', [], ['maxlength' => 255, 'lang' => 'sr']) ?>
            <?= adm_input($nm('card_image_alt_en'), $r['card_image_alt_en'] ?? '', 'Opis slike kartice — EN', [], ['maxlength' => 255, 'lang' => 'en']) ?>
          </div>
        </details>
      </div>
    <?php endforeach; ?>
  </fieldset>

  <div class="adm-acts">
    <button type="submit" class="adm-btn">Sačuvaj</button>
    <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'proizvodi'])) ?>">Odustani</a>
    <?php if (!$isNew): ?><a class="adm-danger adm-acts__end" href="<?= e(admin_url('', ['m' => 'proizvodi', 'a' => 'delete', 'id' => (int) $existing['id']])) ?>">Obriši proizvod</a><?php endif; ?>
  </div>
</form>
<script src="<?= e(asset_url('admin/assets/admin.js')) ?>" defer></script>
