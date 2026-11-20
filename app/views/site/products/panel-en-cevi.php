<?php defined('TRICOM') || exit; ?>
<?php /* Tab „cevi“: statični sadržaj postojećeg taba; naslov, uvod i kartice iz baze. Ulaz: $cat, $items, $L, $V, $SITE */ ?>

    <div class="pp-open">
      <div class="pp-open__txt">
        <h3><?= e(field($cat, 'heading', $L)) ?></h3>
        <p class="lead u-mt-16 u-ch-58"><?= e(field($cat, 'intro', $L)) ?></p>
      </div>
      <div class="pp-open__media shape-b" data-reveal="capsule"><picture class="theme-img theme-img--light"><source srcset="../assets/render/coil-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/coil-light-2600w.webp?v=<?= $V ?>" srcset="../assets/render/coil-light-1300w.webp?v=<?= $V ?> 1300w, ../assets/render/coil-light-2600w.webp?v=<?= $V ?> 2600w" sizes="(max-width: 700px) 88vw, 1296px" data-orig="../assets/render/coil-light.jpg?v=<?= $V ?>" alt="Sheet metal in coil" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/coil-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/coil-dark.jpg?v=<?= $V ?>" alt="Sheet metal in coil" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
    </div>

    <div class="grid g3 u-mb-40">
      <?= site_product_cards($items, "pcard", $L) ?>
    </div>

    <div class="acc acc--data" data-acc id="acc-cevi"><div class="acc__item"><button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-cevi-0"><span>Welded tubes, ZP hollow sections and precision tubes — dimensions, standards, weights</span><span class="acc__sign" aria-hidden="true"></span></button><div class="acc__panel" id="acc-cevi-0"><div><div data-catalog="tubes"></div></div></div></div><div class="acc__item"><button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-cevi-1"><span>Steel sections — L, U, I, flat bar, square bar, cold-formed sections (HOP), bright-drawn steel</span><span class="acc__sign" aria-hidden="true"></span></button><div class="acc__panel" id="acc-cevi-1"><div><div data-catalog="steel"></div></div></div></div></div>
