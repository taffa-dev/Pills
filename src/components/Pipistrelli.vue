<script setup>
import { ref, watch } from 'vue';
import { impostaVerso } from '../riavvolgi.js';

const props = defineProps({
  bats: { type: Number, default: 8 },
  // In stato d'agitazione si accendono di rosso e volano all'indietro, come a tempo riavvolto
  agitazione: { type: Boolean, default: false }
});

// Pose delle ali (la sinistra; la destra è specchiata). viewBox del pipistrello: 0 0 100 60
// Stessa struttura (M + 5 curve + Z) in tutte le pose: serve per il battito fluido, che le interpola.
// Se cambiano qui, vanno cambiate anche in @keyframes battito-fluido.
const ALI = {
  su: 'M46 28 C40 18 26 8 9 3 C13 9 14 15 12 21 C18 19 24 21 26 27 C30 25 36 27 38 33 C41 30 44 30 46 35 Z',
  meta: 'M46 28 C38 22 20 20 3 24 C9 28 12 32 10 38 C16 34 22 35 24 41 C28 36 35 36 37 42 C40 37 43 36 46 38 Z',
  giu: 'M46 29 C38 31 25 39 13 53 C17 50 20 50 21 55 C24 50 28 49 30 53 C32 48 36 46 38 48 C40 44 43 41 46 40 Z'
};
// Ciclo del battito: su → metà → giù → metà
const POSE = [ALI.su, ALI.meta, ALI.giu, ALI.meta];

const casuale = (min, max) => min + Math.random() * (max - min);

// Fasce 0..n-1 in ordine sparso: ogni pipistrello pesca la sua, così non si ammucchiano
const fasceMescolate = (n) => {
  const fasce = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fasce[i], fasce[j]] = [fasce[j], fasce[i]];
  }
  return fasce;
};
const fasceAltezza = fasceMescolate(props.bats);
const fascePartenza = fasceMescolate(props.bats);

// Più un pipistrello è "vicino", più è grande, veloce, nitido e opaco
const pipistrelli = Array.from({ length: props.bats }, (_, i) => {
  const vicinanza = Math.random();
  const volo = 26 - vicinanza * 14; // s per attraversare lo schermo
  return {
    id: i,
    daDestra: Math.random() < 0.5,
    // Una fascia d'altezza a testa tra 4vh e 80vh, e partenze sparse lungo la traversata
    top: 4 + ((fasceAltezza[i] + casuale(0.1, 0.9)) / props.bats) * 76, // vh
    larghezza: 24 + vicinanza * 46, // px su telefono; cresce con lo schermo
    volo,
    ritardo: -((fascePartenza[i] + Math.random()) / props.bats) * volo, // negativo: già in volo al caricamento
    suGiu: casuale(2.6, 4.4),
    zigzag: casuale(1.2, 2),
    battito: casuale(0.28, 0.4), // s per un battito completo
    opacita: 0.55 + vicinanza * 0.45,
    sfocatura: (1 - vicinanza) * 1.2 // px
  };
});

const container = ref(null);
watch(() => props.agitazione, (indietro) => impostaVerso(container.value, indietro));
</script>

<template>
  <!-- Il contenitore non intercetta i tocchi: i pipistrelli non devono bloccare i pulsanti -->
  <div ref="container" :class="['pipistrelli', { agitazione }]" aria-hidden="true">
    <div v-for="p in pipistrelli" :key="p.id" :class="['volo', { 'da-destra': p.daDestra }]" :style="{
      top: p.top + 'vh',
      opacity: p.opacita,
      animationDuration: p.volo + 's',
      animationDelay: p.ritardo + 's'
    }">
      <div class="su-giu" :style="{ animationDuration: p.suGiu + 's', animationDelay: p.ritardo + 's' }">
        <div class="zigzag" :style="{ animationDuration: p.zigzag + 's', animationDelay: p.ritardo + 's' }">
          <svg viewBox="0 0 100 60"
            :style="{ '--larghezza': p.larghezza, '--battito': p.battito + 's', '--sfocatura': p.sfocatura + 'px' }">
            <!-- Battito fluido (le pose si deformano l'una nell'altra) dove il browser sa animare `d` -->
            <g class="ali-fluide">
              <path :d="ALI.meta" />
              <path :d="ALI.meta" transform="translate(100 0) scale(-1 1)" />
            </g>
            <!-- Altrimenti (Safari) battito a fotogrammi -->
            <g v-for="(ala, n) in POSE" :key="n" class="posa" :style="{ animationDelay: `calc(var(--battito) * ${-n / 4})` }">
              <path :d="ala" />
              <path :d="ala" transform="translate(100 0) scale(-1 1)" />
            </g>
            <ellipse cx="50" cy="32" rx="5" ry="9" />
            <circle cx="50" cy="22" r="5" />
            <path d="M45.5 20 L44 11 L49 17 Z M54.5 20 L56 11 L51 17 Z" />
            <circle class="occhio" cx="48" cy="22" r="1.1" />
            <circle class="occhio" cx="52" cy="22" r="1.1" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pipistrelli {
  position: fixed;
  inset: 0;
  z-index: 30;
  overflow: hidden;
  pointer-events: none;
}

/* Tre movimenti sovrapposti con durate diverse: insieme danno un volo irregolare */
.volo {
  position: absolute;
  left: 0;
  animation: da-sinistra linear infinite;
}

.volo.da-destra {
  animation-name: da-destra;
}

@keyframes da-sinistra {
  from { transform: translateX(-15vw); }
  to { transform: translateX(110vw); }
}

@keyframes da-destra {
  from { transform: translateX(110vw); }
  to { transform: translateX(-15vw); }
}

.su-giu {
  animation: su-giu ease-in-out infinite;
}

@keyframes su-giu {
  0%, 100% { transform: translateY(0); }
  15% { transform: translateY(-28px); }
  30% { transform: translateY(-10px); }
  42% { transform: translateY(22px); }
  58% { transform: translateY(6px); }
  70% { transform: translateY(34px); }
  85% { transform: translateY(-14px); }
}

.zigzag {
  animation: zigzag ease-in-out infinite;
}

@keyframes zigzag {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  20% { transform: translateX(14px) rotate(9deg); }
  45% { transform: translateX(-10px) rotate(-12deg); }
  65% { transform: translateX(8px) rotate(5deg); }
  85% { transform: translateX(-16px) rotate(-8deg); }
}

/* Misura in px su telefono, circa una volta e mezza su desktop: su uno schermo grande restavano moscerini */
svg {
  display: block;
  width: calc(var(--larghezza) * (0.6px + 0.1vmin));
  aspect-ratio: 100 / 60;
  overflow: visible;
  fill: #0e0606;
  filter: blur(var(--sfocatura));
  transition: filter 0.8s ease;
}

.agitazione svg {
  filter: blur(var(--sfocatura)) drop-shadow(0 0 4px rgba(255, 40, 30, 0.9)) drop-shadow(0 0 10px rgba(255, 40, 30, 0.5));
}

/* Battito a fotogrammi: ogni posa resta visibile per un quarto del ciclo, poi scatta la successiva */
.posa {
  opacity: 0;
  animation: posa var(--battito) step-end infinite;
}

@keyframes posa {
  0% { opacity: 1; }
  25%, 100% { opacity: 0; }
}

.ali-fluide {
  display: none;
}

/* Battito fluido: colpo verso il basso rapido, risalita più lenta, come nei pipistrelli veri */
@supports (d: path("M0 0")) {
  .posa {
    display: none;
  }

  .ali-fluide {
    display: inline;
  }

  .ali-fluide path {
    animation: battito-fluido var(--battito) ease-in-out infinite;
  }
}

@keyframes battito-fluido {
  0%, 100% { d: path("M46 28 C40 18 26 8 9 3 C13 9 14 15 12 21 C18 19 24 21 26 27 C30 25 36 27 38 33 C41 30 44 30 46 35 Z"); }
  20% { d: path("M46 28 C38 22 20 20 3 24 C9 28 12 32 10 38 C16 34 22 35 24 41 C28 36 35 36 37 42 C40 37 43 36 46 38 Z"); }
  40% { d: path("M46 29 C38 31 25 39 13 53 C17 50 20 50 21 55 C24 50 28 49 30 53 C32 48 36 46 38 48 C40 44 43 41 46 40 Z"); }
  70% { d: path("M46 28 C38 22 20 20 3 24 C9 28 12 32 10 38 C16 34 22 35 24 41 C28 36 35 36 37 42 C40 37 43 36 46 38 Z"); }
}

.occhio {
  fill: transparent;
  transition: fill 0.8s ease;
}

.agitazione .occhio {
  fill: #ff2a1a;
}

/* Movimento ridotto: i pipistrelli restano fermi dove si trovano, ali comprese */
@media (prefers-reduced-motion: reduce) {
  .pipistrelli * {
    animation-play-state: paused;
  }
}
</style>
