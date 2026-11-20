<?php defined('TRICOM') || exit; ?>
<?php /* Tab „limovi“: statični sadržaj postojećeg taba; naslov, uvod i kartice iz baze. Ulaz: $cat, $items, $L, $V, $SITE, $program, $sub (izabrani program / podgrupa ili null) */ ?>

    <div class="pp-open">
      <div class="pp-open__txt">
        <h3><?= e(field($cat, 'heading', $L)) ?></h3>
        <p class="lead u-mt-16"><?= e(field($cat, 'intro', $L)) ?></p>
      </div>
      <div class="pp-open__media shape-b" data-reveal="capsule"><picture class="theme-img theme-img--light"><source srcset="../assets/render/sheet-stack-light.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?>" srcset="../assets/render/sheet-stack-light-620w.webp?v=<?= $V ?> 620w, ../assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?> 1230w" sizes="(max-width: 700px) 83vw, 612px" data-orig="../assets/render/sheet-stack-light.jpg?v=<?= $V ?>" alt="Sheet metal in sheets" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="../assets/render/sheet-stack-dark.webp?v=<?= $V ?>" type="image/webp"><img src="../assets/render/sheet-stack-dark.jpg?v=<?= $V ?>" alt="Sheet metal in sheets" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
    </div>


    <?= site_sheet_browser($cat, $L, $program, $sub) ?>

    <div class="u-mt-40 tbl-glass"><div class="spec-wrap"><table class="spec"><caption class="mono muted spec__cap">SHEET METAL RANGE</caption><thead><tr><th scope="col" class="spec__no">#</th><th scope="col">Sheet type</th><th scope="col">Form</th><th scope="col">Typical use</th></tr></thead><tbody><tr><td class="spec__no">01</td><td class="key">Galvanised</td><td>sheet, coil</td><td>roofing, gutters, accessories, flashings</td></tr><tr><td class="spec__no">02</td><td class="key">Pre-painted (coil-coated)</td><td>coil, sheet — RAL of your choice</td><td>visible roof and façade elements</td></tr><tr><td class="spec__no">03</td><td class="key">Aluminium</td><td>sheet, coil</td><td>façades, lightweight roof coverings, flashings</td></tr><tr><td class="spec__no">04</td><td class="key">Copper</td><td>sheet, coil</td><td>premium roofs, prestige buildings</td></tr><tr><td class="spec__no">05</td><td class="key">Black hot-rolled (HR)</td><td>flat and chequer plate</td><td>structures, floors, platforms</td></tr><tr><td class="spec__no">06</td><td class="key">Black cold-rolled (CR)</td><td>sheet, coil</td><td>machining, bending, further finishing</td></tr><tr><td class="spec__no">07</td><td class="key">Stainless steel</td><td>sheet</td><td>food and chemical industry, hygienic environments</td></tr></tbody></table></div></div>
    <p class="mono muted u-mt-16">Sheet formats, thicknesses and RAL colours depend on current stock — check with sales before planning.</p>
