<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { creaMotore, TARATURA } from '../volo.js';

const props = defineProps({
  bats: { type: Number, default: 8 },
  // In stato d'agitazione si accendono di rosso e volano all'indietro, come a tempo riavvolto
  agitazione: { type: Boolean, default: false }
});

// I pipistrelli li crea e li muove il motore di volo (src/volo.js, identico in Calendario): un solo
// requestAnimationFrame, un transform per pipistrello, ali interpolate in JS. Qui solo il contenitore
// e la taratura di Pills: popolazione costante di `bats` pipistrelli (quando uno esce ne entra un altro),
// ognuno nella sua fascia d'altezza tra 4vh e 84vh, scala 0,5..1,5 volte la misura media.
const contenitore = ref(null);
const fermo = window.matchMedia('(prefers-reduced-motion: reduce)');
let motore;

onMounted(() => {
  motore = creaMotore({
    taratura: { SCALA_MIN: .5, SCALA_MAX: 1.5, VITA_MIN: 14, VITA_MAX: 30, MAX_PIP: 20 },
    continuo: true,
    quanti: props.bats,
    occhi: true,
    // Misura in px su telefono, circa una volta e mezza su desktop: su uno schermo grande restavano moscerini
    // (47 = larghezza media di un tempo, 24..70)
    larghezzaBase(W, H) { return 47 * (.6 + .001 * Math.min(W, H)); },
    velocita: (z, W) => W * 1.25 / (26 - 14 * z), // attraversa lo schermo in 26..12 s
    sfocaturaMax: 1.2,
    opacita: (z) => .55 + .45 * z,
    opacitaFg: () => TARATURA.FG_OPACITA,
    // Ogni pipistrello ha il suo centro di fascia (in vh), scelto il più lontano possibile dagli altri
    assegnaFascia(b, altri) {
      let miglior = 0, distanza = -1;
      for (let k = 0; k < 8; k++) {
        const c = 4 + Math.random() * 76;
        const d = Math.min(99, ...altri.filter((o) => !o.esce).map((o) => Math.abs(o.cy - c)));
        if (d > distanza) { distanza = d; miglior = c; }
      }
      b.cy = miglior;
    },
    fascia: (b, W, H) => [Math.max(.04 * H, (b.cy - 7) / 100 * H), Math.min(.84 * H, (b.cy + 7) / 100 * H)]
  });
  if (import.meta.env.DEV) window.__pip = motore; // solo in sviluppo: per le prove
  motore.avvia(contenitore.value);
  motore.iniziale(props.bats);
  if (props.agitazione) motore.setIndietro(true);
  // Movimento ridotto: i pipistrelli restano fermi dove si trovano
  if (fermo.matches) motore.congela();
  fermo.addEventListener('change', ridotto);
});

function ridotto() {
  if (fermo.matches) motore.congela(); else motore.avvia(contenitore.value);
}

onBeforeUnmount(() => {
  fermo.removeEventListener('change', ridotto);
  motore?.ferma();
  if (import.meta.env.DEV && window.__pip === motore) delete window.__pip;
});

watch(() => props.agitazione, (indietro) => motore?.setIndietro(indietro));
watch(() => props.bats, (n) => motore?.setQuanti(n));
</script>

<template>
  <!-- Il contenitore non intercetta i tocchi: i pipistrelli non devono bloccare i pulsanti -->
  <div ref="contenitore" :class="['pipistrelli', { agitazione }]" aria-hidden="true"></div>
</template>

<style scoped>
.pipistrelli {
  position: fixed;
  inset: 0;
  z-index: 30;
  overflow: hidden;
  pointer-events: none;
}

/* I pipistrelli (div.pip con un svg) li crea volo.js: posizione e transform li scrive lui */
.pipistrelli :deep(.pip) {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform, opacity;
}

.pipistrelli :deep(svg) {
  display: block;
  width: 100%;
  aspect-ratio: 100 / 60;
  overflow: visible;
  fill: #0e0606;
  filter: blur(var(--sf, 0px));
  transition: filter 0.8s ease;
}

.agitazione :deep(svg) {
  filter: blur(var(--sf, 0px)) drop-shadow(0 0 4px rgba(255, 40, 30, 0.9)) drop-shadow(0 0 10px rgba(255, 40, 30, 0.5));
}

.pipistrelli :deep(.occhio) {
  fill: transparent;
  transition: fill 0.8s ease;
}

.agitazione :deep(.occhio) {
  fill: #ff2a1a;
}
</style>
