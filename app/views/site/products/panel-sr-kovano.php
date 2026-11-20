<?php defined('TRICOM') || exit; ?>
<?php /* Tab „kovano“: statični sadržaj postojećeg taba; naslov, uvod i kartice iz baze. Ulaz: $cat, $items, $L, $V, $SITE */ ?>

    <div class="pp-open">
      <div class="pp-open__txt">
        <h3><?= e(field($cat, 'heading', $L)) ?></h3>
        <p class="lead u-mt-16"><?= e(field($cat, 'intro', $L)) ?></p>
        <ul class="checklist u-mt-24">
          <li>Kovani i dekorativni elementi za ograde i kapije</li>
          <li><strong>Grifovani</strong> flah i cevi — izgled ručno kovanog gvožđa</li>
          <li>Šiljci za ograde, svih uobičajenih oblika</li>
          <li>Žice, pletiva i prateći materijal za ograđivanje</li>
          <li>Pocinkovana <strong>gazišta</strong> za stepenice i platforme — standardne dimenzije 200×1000, 250×1000, 300×1000, 500×1000, 500×500 i 1000×1000 mm; toplovaljani lim S235, toplo cinkovano ili farbano</li>
        </ul>
        <div class="u-mt-32">
          <a class="link-kerf" href="usluge.html#profili">Grifovanje kao usluga <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        </div>
      </div>
      <div class="pp-open__media shape-b" data-reveal="capsule"><picture class="theme-img theme-img--light"><source srcset="assets/render/plasma-plate-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?>" srcset="assets/render/plasma-plate-light-1300w.webp?v=<?= $V ?> 1300w, assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 88vw, 1296px" data-orig="assets/render/plasma-plate-light.jpg?v=<?= $V ?>" alt="Ploča isečena na CNC plazmi" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/plasma-plate-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/plasma-plate-dark.jpg?v=<?= $V ?>" alt="Ploča isečena na CNC plazmi" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
    </div>
    <div><div data-catalog="wire"></div></div>
