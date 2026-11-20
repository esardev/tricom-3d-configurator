<?php defined('TRICOM') || exit; ?>
<?php /* Tab „alati“: statični sadržaj postojećeg taba; naslov, uvod i kartice iz baze. Ulaz: $cat, $items, $L, $V, $SITE */ ?>

    <div class="split split--60 u-start u-mb-40">
      <div>
        <h3><?= e(field($cat, 'heading', $L)) ?></h3>
        <p class="lead u-mt-16"><?= e(field($cat, 'intro', $L)) ?></p>
      </div>
      <div>
        <div class="infoblock">
          <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg> Brands in our range</h3>
          <div class="pcard__tags u-mt-0">
            <span class="tag">Bosch</span><span class="tag">Makita</span><span class="tag">DeWalt</span>
            <span class="tag">Stanley</span><span class="tag">Black &amp; Decker</span>
            <span class="tag">Varstroj</span><span class="tag">Mimont</span><span class="tag">Alpos</span><span class="tag">Bane Sekulić</span><span class="tag">Ginić</span><span class="tag">FRIULSIDER</span><span class="tag">KOELNER</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid g3">
      <?= site_product_cards($items, "card", $L) ?>
    </div>
    <h4 class="u-mt-40 u-mb-16" id="alati-tabele">Range by type</h4>
    <div class="acc acc--data" data-acc id="acc-alati"><div class="acc__item"><button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-alati-0"><span>Fasteners, hardware, hinges, drill bits, discs</span><span class="acc__sign" aria-hidden="true"></span></button><div class="acc__panel" id="acc-alati-0"><div><div data-catalog="tools"></div></div></div></div><div class="acc__item"><button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-alati-1"><span>Varstroj — welding machines and equipment</span><span class="acc__sign" aria-hidden="true"></span></button><div class="acc__panel" id="acc-alati-1"><div><div data-catalog="varstroj"></div></div></div></div><div class="acc__item"><button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-alati-2"><span>Alpos ladders — table</span><span class="acc__sign" aria-hidden="true"></span></button><div class="acc__panel" id="acc-alati-2"><div><div data-catalog="ladders"></div></div></div></div></div>
