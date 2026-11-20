<?php defined('TRICOM') || exit; ?>
<?php /* Tab „kovano“: statični sadržaj postojećeg taba; naslov, uvod i kartice iz baze. Ulaz: $cat, $items, $L, $V, $SITE */ ?>

    <div class="pp-open">
      <div class="pp-open__txt">
        <h3><?= e(field($cat, 'heading', $L)) ?></h3>
        <p class="lead u-mt-16"><?= e(field($cat, 'intro', $L)) ?></p>
        <ul class="checklist u-mt-24">
          <li>Wrought-iron and decorative elements for fences and gates</li>
          <li><strong>Embossed</strong> flat bar and tubes — the look of hand-forged iron</li>
          <li>Fence spikes in all common shapes</li>
          <li>Wire, wire mesh and fencing accessories</li>
          <li>Galvanised <strong>stair treads</strong> for stairs and platforms — standard sizes 200×1,000, 250×1,000, 300×1,000, 500×1,000, 500×500 and 1,000×1,000 mm; hot-rolled sheet S235, hot-dip galvanised or painted</li>
        </ul>
        <div class="u-mt-32">
          <a class="link-kerf" href="services.html#profili">Embossing as a service <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        </div>
      </div>
      <div class="pp-open__media shape-b" data-reveal="capsule"><picture class="theme-img theme-img--light"><source srcset="../assets/render/plasma-plate-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/plasma-plate-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/plasma-plate-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 88vw, 1296px" data-orig="../assets/render/plasma-plate-light.jpg?v=<?= $V ?>" alt="Plate cut on the CNC plasma" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/plasma-plate-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/plasma-plate-dark.jpg?v=<?= $V ?>" alt="Plate cut on the CNC plasma" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
    </div>
    <div><div data-catalog="wire"></div></div>
