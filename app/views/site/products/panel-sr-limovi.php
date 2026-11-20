<?php defined('TRICOM') || exit; ?>
<?php /* Tab „limovi“: statični sadržaj postojećeg taba; naslov, uvod i kartice iz baze. Ulaz: $cat, $items, $L, $V, $SITE, $program, $sub (izabrani program / podgrupa ili null) */ ?>

    <div class="pp-open">
      <div class="pp-open__txt">
        <h3><?= e(field($cat, 'heading', $L)) ?></h3>
        <p class="lead u-mt-16"><?= e(field($cat, 'intro', $L)) ?></p>
      </div>
      <div class="pp-open__media shape-b" data-reveal="capsule"><picture class="theme-img theme-img--light"><source srcset="assets/render/sheet-stack-light.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?>" srcset="assets/render/sheet-stack-light-620w.webp?v=<?= $V ?> 620w, assets/render/sheet-stack-light-1230w.webp?v=<?= $V ?> 1230w" sizes="(max-width: 700px) 83vw, 613px" data-orig="assets/render/sheet-stack-light.jpg?v=<?= $V ?>" alt="Lim u tablama" width="2400" height="1500" loading="lazy" decoding="async"></picture><picture class="theme-img theme-img--dark"><source srcset="assets/render/sheet-stack-dark.webp?v=<?= $V ?>" type="image/webp"><img src="assets/render/sheet-stack-dark.jpg?v=<?= $V ?>" alt="Lim u tablama" width="2400" height="1500" loading="lazy" decoding="async"></picture></div>
    </div>


    <?= site_sheet_browser($cat, $L, $program, $sub) ?>

    <div class="u-mt-40 tbl-glass"><div class="spec-wrap"><table class="spec"><caption class="mono muted spec__cap">PROGRAM LIMOVA</caption><thead><tr><th scope="col" class="spec__no">#</th><th scope="col">Vrsta lima</th><th scope="col">Izvedba</th><th scope="col">Tipična namena</th></tr></thead><tbody><tr><td class="spec__no">01</td><td class="key">Pocinkovani</td><td>tabla, kotur</td><td>krov, oluci, galanterija, opšivke</td></tr><tr><td class="spec__no">02</td><td class="key">Plastificirani (bojeni)</td><td>kotur, tabla — RAL po izboru</td><td>vidljivi krovni i fasadni elementi</td></tr><tr><td class="spec__no">03</td><td class="key">Aluminijumski</td><td>tabla, kotur</td><td>fasada, lagani pokrivači, opšivke</td></tr><tr><td class="spec__no">04</td><td class="key">Bakarni</td><td>tabla, kotur</td><td>ekskluzivni krovovi, reprezentativni objekti</td></tr><tr><td class="spec__no">05</td><td class="key">Crni toplovaljani (TVL)</td><td>ravan i rebrast</td><td>konstrukcije, podovi, platforme</td></tr><tr><td class="spec__no">06</td><td class="key">Crni hladnovaljani (HVL)</td><td>tabla, kotur</td><td>mašinska obrada, savijanje, dalja dorada</td></tr><tr><td class="spec__no">07</td><td class="key">Prohromski (inox)</td><td>tabla</td><td>prehrambena i hemijska industrija, higijenski uslovi</td></tr></tbody></table></div></div>
    <p class="mono muted u-mt-16">Format tabli, debljine i boje po RAL karti zavise od trenutnog lagera — proverite sa prodajom pre planiranja.</p>
