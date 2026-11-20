<?php
/* Lista čestih pitanja. Ulaz: $rows */
defined('TRICOM') || exit;
?>
<div class="adm-head">
  <h1 class="adm-h1">Česta pitanja</h1>
  <a class="adm-btn" href="<?= e(admin_url('', ['m' => 'pitanja', 'a' => 'new'])) ?>">Novo pitanje</a>
</div>
<p class="adm-lead">Pitanja se prikazuju u odeljku „Česta pitanja“ na strani <a href="<?= e(url('o-nama.html') . '#faq') ?>" target="_blank" rel="noopener">O nama</a> (srpska i engleska verzija), redom kao ovde, i u podacima za pretraživače (FAQPage). Ista pitanja prikazuje i odeljak „Česta pitanja“ na <a href="<?= e(url('') . '#faq') ?>" target="_blank" rel="noopener">početnoj strani</a>. Ostali sadržaj tih strana se ne menja ovde.</p>

<form method="post" action="<?= e(admin_url('', ['m' => 'pitanja', 'a' => 'order'])) ?>">
  <?= csrf_field() ?>
  <div class="adm-table-wrap">
  <table class="adm-table">
    <thead><tr><th scope="col" class="adm-col-order">Redosled</th><th scope="col">Pitanje (SR / EN)</th><th scope="col">Status</th><th scope="col"><span class="adm-sr">Akcije</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td><input class="adm-order" type="number" name="order[<?= (int) $r['id'] ?>]" value="<?= (int) $r['sort_order'] ?>" aria-label="Redosled: <?= e($r['question_sr']) ?>"></td>
        <td><strong><?= e($r['question_sr']) ?></strong><br>
          <span class="adm-muted" lang="en"><?= $r['question_en'] !== '' ? e($r['question_en']) : '<em>nema engleskog pitanja</em>' ?></span><?= (string) $r['answer_en'] === '' ? ' <span class="adm-badge">nema EN odgovora</span>' : '' ?></td>
        <td><?= (int) $r['is_active'] === 1 ? '<span class="adm-badge adm-badge--ok">vidljivo</span>' : '<span class="adm-badge">sakriveno</span>' ?></td>
        <td class="adm-actions">
          <a href="<?= e(admin_url('', ['m' => 'pitanja', 'a' => 'edit', 'id' => (int) $r['id']])) ?>">Izmeni</a>
          <a class="adm-danger" href="<?= e(admin_url('', ['m' => 'pitanja', 'a' => 'delete', 'id' => (int) $r['id']])) ?>">Obriši</a>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$rows): ?>
      <tr><td colspan="4">Nema pitanja. Bez vidljivih pitanja odeljak na strani ostaje prazan.</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
  </div>
  <?php if ($rows): ?><button type="submit" class="adm-btn adm-btn--ghost">Sačuvaj redosled</button><?php endif; ?>
</form>
