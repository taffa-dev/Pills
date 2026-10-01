<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

defineProps({
  // In stato d'agitazione la candela dentro la zucca diventa rossa
  agitazione: { type: Boolean, default: false }
});

// Volto di una zucca intagliata: occhi, naso e bocca dentata. viewBox: 0 0 200 150
const OCCHI = 'M30 58 L80 58 L58 14 Z M120 58 L170 58 L142 14 Z';
// In stato d'agitazione: occhi cattivi, tondi sotto e tagliati da un sopracciglio che scende verso il naso
const OCCHI_CATTIVI = 'M30 20 L80 52 C74 64 50 68 37 58 C27 50 25 32 30 20 Z ' +
  'M170 20 L120 52 C126 64 150 68 163 58 C173 50 175 32 170 20 Z';
const NASO = 'M89 80 L111 80 L100 63 Z';
const BOCCA = 'M8 86 L35 97 L48 96 L56 111 L64 100 L100 104 L136 100 L144 111 L152 96 L165 97 L192 86 ' +
  'L182 104 L160 126 L130 138 L112 140 L106 124 L94 124 L88 140 L70 138 L40 126 L18 104 Z';
const VOLTO = `${NASO} ${BOCCA}`;

const zucca = ref(null);
const alone = ref(null);

// La luce si allunga verso il mouse: posizione del puntatore rispetto al centro dello schermo, da -1 a 1.
// La luce la insegue con un ritardo morbido; il ciclo gira solo finché non l'ha raggiunta.
const INSEGUIMENTO = 0.08;
let bersaglio = { x: 0, y: 0 };
let luce = { x: 0, y: 0 };
let frame = 0;

function muoviLuce() {
  luce.x += (bersaglio.x - luce.x) * INSEGUIMENTO;
  luce.y += (bersaglio.y - luce.y) * INSEGUIMENTO;
  zucca.value?.style.setProperty('--luce-x', luce.x.toFixed(4));
  zucca.value?.style.setProperty('--luce-y', luce.y.toFixed(4));
  const ferma = Math.abs(bersaglio.x - luce.x) < 0.001 && Math.abs(bersaglio.y - luce.y) < 0.001;
  frame = ferma ? 0 : requestAnimationFrame(muoviLuce);
}

function seguiPuntatore(evento) {
  bersaglio = {
    x: (evento.clientX / window.innerWidth) * 2 - 1,
    y: (evento.clientY / window.innerHeight) * 2 - 1
  };
  if (!frame) frame = requestAnimationFrame(muoviLuce);
}

function luceAlCentro() {
  bersaglio = { x: 0, y: 0 };
  if (!frame) frame = requestAnimationFrame(muoviLuce);
}

const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const movimentoRidotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

onMounted(() => {
  // La fiamma ondeggia con animazioni SVG (SMIL): CSS non le ferma, quindi si mettono in pausa da qui
  if (movimentoRidotto) {
    alone.value?.pauseAnimations();
    return;
  }
  if (conMouse) {
    window.addEventListener('pointermove', seguiPuntatore, { passive: true });
    document.documentElement.addEventListener('pointerleave', luceAlCentro);
  }
});

onUnmounted(() => {
  window.removeEventListener('pointermove', seguiPuntatore);
  document.documentElement.removeEventListener('pointerleave', luceAlCentro);
  cancelAnimationFrame(frame);
});
</script>

<template>
  <!-- Luce dietro un telo: la sagoma è sfocata e si somma allo sfondo, senza bordi netti -->
  <div ref="zucca" :class="['zucca', { agitazione }]" aria-hidden="true">
    <svg ref="alone" class="alone" viewBox="0 0 200 150" preserveAspectRatio="none">
      <!-- La candela sta in basso al centro: lì la luce è più calda, verso gli occhi si spegne -->
      <defs>
        <radialGradient id="zucca-fiamma" gradientUnits="userSpaceOnUse" cx="100" cy="125" r="125">
          <!-- cx/cy/r ondeggiano da soli; la direzione verso il mouse la dà lo spostamento dell'alone -->
          <!-- La fiamma ondeggia e respira: tre durate diverse, insieme non si ripetono mai uguali -->
          <animate attributeName="cx" dur="3.7s" repeatCount="indefinite" calcMode="spline"
            values="100;93;104;97;108;100" keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
          <animate attributeName="cy" dur="2.3s" repeatCount="indefinite" calcMode="spline"
            values="125;117;127;120;125" keyTimes="0;0.25;0.5;0.75;1"
            keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
          <animate attributeName="r" dur="1.9s" repeatCount="indefinite" calcMode="spline"
            values="125;113;131;119;125" keyTimes="0;0.3;0.55;0.8;1"
            keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
          <stop offset="0" class="nucleo" />
          <stop offset="0.45" class="fiamma" />
          <stop offset="1" class="brace" />
        </radialGradient>
      </defs>
      <path :d="VOLTO" />
      <path class="occhi normali" :d="OCCHI" />
      <path class="occhi cattivi" :d="OCCHI_CATTIVI" />
    </svg>
    <svg class="volto" viewBox="0 0 200 150" preserveAspectRatio="none">
      <path :d="VOLTO" />
      <path class="occhi normali" :d="OCCHI" />
      <path class="occhi cattivi" :d="OCCHI_CATTIVI" />
    </svg>
  </div>
</template>

<style scoped>
/* Sopra lo sfondo, sotto la luce della sirena (20), i pipistrelli (30) e il testo (100) */
.zucca {
  --luce-x: 0;
  --luce-y: 0;
  --nucleo: #ffcf5c;
  --luce: #ff8a1a;
  --brace: #f27414;
  position: fixed;
  top: 52%;
  left: 50%;
  z-index: 5;
  /* Quasi tutta l'altezza dello schermo; su telefono sborda un po' ai lati, tanto è sfocata.
     Le sfocature seguono questa misura (con un tetto): su telefono il volto non si scioglie. */
  --larghezza: min(130vw, 120vh);
  width: var(--larghezza);
  aspect-ratio: 200 / 150;
  transform: translate(-50%, -50%);
  pointer-events: none;
  mix-blend-mode: screen;
  /* Due tremolii con periodi diversi: insieme non si ripetono mai uguali */
  animation: candela 5.3s linear infinite, guizzo 1.7s linear infinite;
}

.zucca.agitazione {
  --nucleo: #ff5a3a;
  --luce: #ff2a1a;
  --brace: #c8100a;
}

.zucca svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.zucca path {
  fill: url(#zucca-fiamma);
  transition: opacity 1s ease;
}

/* Le variabili non registrate scattano: la transizione va sui colori delle fermate */
.nucleo { stop-color: var(--nucleo); }
.fiamma { stop-color: var(--luce); }
.brace { stop-color: var(--brace); }

stop {
  transition: stop-color 1s ease;
}

.occhi.cattivi,
.agitazione .occhi.normali {
  opacity: 0;
}

.agitazione .occhi.cattivi {
  opacity: 1;
}

/* Luce diffusa dal telo attorno al volto. Si sposta e si allunga verso il mouse (--luce-x/y da -1 a 1),
   come se i raggi uscissero dalla zucca in quella direzione. */
.alone {
  opacity: 0.4;
  filter: blur(min(60px, var(--larghezza) * 0.066));
  transform:
    translate(calc(var(--luce-x) * 9%), calc(var(--luce-y) * 9%))
    scale(calc(1.15 + (var(--luce-x) * var(--luce-x) + var(--luce-y) * var(--luce-y)) * 0.08));
  transition: filter 1s ease, opacity 1s ease;
}

/* Occhi e bocca veri e propri, ammorbiditi dalla stoffa */
.volto {
  opacity: 0.32;
  filter: blur(min(16px, var(--larghezza) * 0.0175));
  transition: filter 1s ease, opacity 1s ease;
}

/* In stato d'agitazione la zucca preme contro il telo: più nitida e più presente */
.agitazione .volto {
  opacity: 0.6;
  filter: blur(min(4px, var(--larghezza) * 0.0044));
}

.agitazione .alone {
  opacity: 0.5;
  filter: blur(min(40px, var(--larghezza) * 0.044));
}

@keyframes candela {
  0%, 100% { opacity: 0.8; }
  8% { opacity: 0.62; }
  11% { opacity: 0.85; }
  27% { opacity: 0.7; }
  34% { opacity: 0.95; }
  46% { opacity: 0.55; }
  49% { opacity: 0.82; }
  63% { opacity: 0.74; }
  71% { opacity: 1; }
  84% { opacity: 0.66; }
  90% { opacity: 0.86; }
}

@keyframes guizzo {
  0%, 100% { filter: brightness(1); }
  21% { filter: brightness(1.15); }
  37% { filter: brightness(0.9); }
  58% { filter: brightness(1.08); }
  79% { filter: brightness(0.94); }
}

@media (prefers-reduced-motion: reduce) {
  .zucca {
    animation: none;
  }
}

/* Telefono in verticale: volto più largo dello schermo (sborda ai lati, tanto è sfocato) e appena
   allungato in altezza. Allungarlo di più deforma occhi e bocca. */
@media (orientation: portrait) {
  .zucca {
    --larghezza: min(140vw, 82vh);
    aspect-ratio: 200 / 172;
  }
}
</style>
