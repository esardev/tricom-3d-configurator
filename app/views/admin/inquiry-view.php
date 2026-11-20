<?php
/* Jedan upit sa sačuvanim obračunima. Ulaz: $inq, $quotes (najnoviji prvi, ['snap'] = dekodiran snimak),
   $mail (ready = zakrpa 010, calc = ima stavke kalkulatora, problem = zašto slanje nije moguće, pdf, to) */
defined('TRICOM') || exit;
$fmtAt = static fn(?string $at): string => $at ? date('d.m.Y. H:i', (int) strtotime($at)) : '—';
?>
<p class="adm-back"><a href="<?= e(admin_url('', ['m' => 'upiti'])) ?>">← Upiti</a></p>
<h1 class="adm-h1">Upit <span class="adm-mono"><?= e($inq['ref_code']) ?></span></h1>

<dl class="adm-quote__dl adm-quote__dl--info">
  <div><dt>Primljen</dt><dd><?= e($fmtAt($inq['created_at'])) ?> · strana <?= $inq['lang'] === 'en' ? 'na engleskom' : 'na srpskom' ?></dd></div>
  <div><dt>Ime i firma</dt><dd><?= e($inq['name']) ?></dd></div>
  <div><dt>E-pošta</dt><dd><a href="mailto:<?= e($inq['email']) ?>"><?= e($inq['email']) ?></a></dd></div>
  <div><dt>Telefon</dt><dd><?= $inq['phone'] !== '' ? '<a href="tel:' . e(preg_replace('/[^\d+]/', '', $inq['phone'])) . '">' . e($inq['phone']) . '</a>' : '—' ?></dd></div>
  <div><dt>Tema</dt><dd><?= e($inq['topic'] !== '' ? $inq['topic'] : '—') ?></dd></div>
</dl>

<?php if ($mail['calc']): $flow = $inq['flow'] ?? null; $st = $inq['mail_status'] ?? null; ?>
  <h2 class="adm-h2">Specifikacija (PDF) prodaji</h2>
  <dl class="adm-quote__dl adm-quote__dl--info">
    <div><dt>Stanje</dt><dd><?= $flow === 'quote' ? q_mail_badge('quote', $st) : '<span class="adm-muted">poslat preko e-pošte kupca (pre kruga 10 ili slanje sa sajta nije bilo uključeno)</span>' ?></dd></div>
    <?php if ($mail['ready'] && $flow === 'quote'): ?>
      <div><dt>Pokušaja</dt><dd><?= (int) $inq['mail_attempts'] ?><?= $inq['mail_sent_at'] ? ' · poslato ' . e($fmtAt($inq['mail_sent_at'])) . ' na ' . e((string) $inq['mail_to']) : '' ?></dd></div>
    <?php endif; ?>
    <?php if ($mail['ready'] && (string) ($inq['mail_error'] ?? '') !== '' && $st !== 'sent'): ?>
      <div><dt>Razlog</dt><dd class="adm-note"><?= e($inq['mail_error']) ?></dd></div>
    <?php endif; ?>
  </dl>
  <div class="adm-requote">
    <?php if ($mail['pdf']): ?>
      <a class="adm-btn adm-btn--ghost" href="<?= e(admin_url('', ['m' => 'upiti', 'a' => 'pdf', 'id' => (int) $inq['id']])) ?>" target="_blank" rel="noopener">Otvori PDF specifikaciju</a>
    <?php endif; ?>
    <?php if ($mail['ready'] && $st !== 'sent'): ?>
      <?php if ($mail['problem'] === null): ?>
        <form method="post" action="<?= e(admin_url('', ['m' => 'upiti', 'a' => 'send'])) ?>" class="adm-inline">
          <?= csrf_field() ?>
          <input type="hidden" name="id" value="<?= (int) $inq['id'] ?>">
          <button type="submit" class="adm-btn">Pošalji PDF prodaji<?= $mail['to'] !== '' ? ' (' . e($mail['to']) . ')' : '' ?></button>
        </form>
        <?php if ($flow !== 'quote' || $st === null): ?><span class="adm-muted">Kupac je ovaj upit verovatno poslao i iz svog programa za e-poštu — proverite sanduče pre slanja.</span><?php endif; ?>
      <?php else: ?>
        <span class="adm-note">Slanje sa sajta nije moguće: <?= e($mail['problem']) ?></span>
      <?php endif; ?>
    <?php endif; ?>
  </div>
<?php endif; ?>

<h2 class="adm-h2">Poruka kupca</h2>
<pre class="adm-pre"><?= e($inq['message']) ?></pre>
<p class="adm-muted">Tekst poruke (i brojevi u njemu) je onako kako ga je kupac poslao; obračun ispod ne koristi taj tekst, već stavke kalkulatora.</p>

<?php if ((string) $inq['production_note'] !== ''): ?>
  <h2 class="adm-h2">Napomena za proizvodnju (interno)</h2>
  <pre class="adm-pre"><?= e($inq['production_note']) ?></pre>
<?php endif; ?>

<h2 class="adm-h2">Interni obračun</h2>
<?php if ((string) $inq['config_refs'] === ''): ?>
  <p class="adm-muted">Upit nema stavki kalkulatora ni konfiguratora — nema automatskog obračuna.</p>
<?php endif; ?>
<?php if (!$quotes && (string) $inq['config_refs'] !== ''): ?>
  <p class="adm-flash adm-flash--error" role="status">Obračun pri prijemu nije sačuvan (greška je u dnevniku app/storage/logs). Napravite novi obračun dugmetom ispod.</p>
<?php endif; ?>

<?php if ((string) $inq['config_refs'] !== ''): ?>
<form method="post" action="<?= e(admin_url('', ['m' => 'upiti', 'a' => 'requote'])) ?>" class="adm-inline adm-requote">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= (int) $inq['id'] ?>">
  <button type="submit" class="adm-btn adm-btn--ghost">Novi obračun po važećem cenovniku</button>
  <span class="adm-muted">Dodaje se kao novi zapis; sačuvani obračuni ostaju nepromenjeni.</span>
</form>
<?php endif; ?>

<?php foreach ((string) $inq['config_refs'] !== '' ? $quotes : [] as $qi => $q): $s = $q['snap']; $pl = $s['price_list'] ?? []; $cur = isset(QUOTE_CURRENCIES[(string) ($pl['currency'] ?? '')]) ? (string) $pl['currency'] : null; ?>
  <article class="adm-quote<?= $qi > 0 ? ' adm-quote--old' : '' ?>">
    <header class="adm-quote__head">
      <h3 class="adm-quote__h"><?= $qi === 0 ? 'Važeći obračun' : 'Raniji obračun' ?> · <?= e($fmtAt($q['created_at'])) ?> · <?= $q['created_by'] === 'sajt' ? 'pri prijemu upita' : 'napravio ' . e($q['created_by']) ?> <?= q_badge((string) $q['status']) ?></h3>
      <p class="adm-muted">Primenjen cenovnik: valuta <?= e($cur ?? 'nije izabrana') ?> · cene <?= e(QUOTE_VAT[(string) ($pl['vat'] ?? '')] ?? 'bez naznake PDV-a') ?> · izmenjen <?= e($fmtAt($pl['updated_at'] ?? null)) ?><?= !empty($pl['updated_by']) ? ' (' . e($pl['updated_by']) . ')' : '' ?></p>
    </header>
    <?php if ($qi === 0 || count($quotes) === 1): ?>
      <?= q_snapshot_html($s) ?>
    <?php else: ?>
      <details class="adm-details"><summary>Prikaži raniji obračun</summary><?= q_snapshot_html($s) ?></details>
    <?php endif; ?>
    <div class="adm-quote__total">
      <?php if (($s['grand_total'] ?? null) !== null): ?>
        <p><strong>Ukupno upit: <?= e(q_money($s['grand_total'], $cur)) ?></strong> <span class="adm-muted"><?= e(QUOTE_VAT[(string) ($pl['vat'] ?? '')] ?? '') ?></span></p>
      <?php elseif (($s['status'] ?? '') !== 'none'): ?>
        <p class="adm-note"><strong>Ukupan iznos upita nije izračunat</strong> — nedostaje:</p>
        <ul class="adm-missing"><?php foreach ($s['missing'] ?? [] as $m): ?><li><?= e($m) ?></li><?php endforeach; ?></ul>
      <?php else: ?>
        <p class="adm-muted">Nema stavki trapeznog lima iz kalkulatora — iznos se ne računa automatski.</p>
      <?php endif; ?>
      <?php foreach ($s['notes'] ?? [] as $n): ?><p class="adm-note"><?= e($n) ?></p><?php endforeach; ?>
    </div>
  </article>
<?php endforeach; ?>

<?php if ((string) $inq['config_refs'] !== ''): ?>
  <details class="adm-details">
    <summary>Reference stavki (tehnički zapis)</summary>
    <pre class="adm-pre"><?= e($inq['config_refs']) ?></pre>
  </details>
<?php endif; ?>
