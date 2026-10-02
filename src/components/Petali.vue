<script setup>
import { onMounted, ref, watch } from 'vue';
import { impostaVerso } from '../riavvolgi.js';

const props = defineProps({
  petali: { type: Number, default: 30 },
  // In stato d'agitazione i petali diventano rosso sangue e risalgono, come a tempo riavvolto
  agitazione: { type: Boolean, default: false }
});

const lista = ref([]);
// Pochi petali vicinissimi alla "telecamera": grandi, sfocati, più veloci, davanti alla frase
const vicini = ref([]);
const container = ref(null);

watch(() => props.agitazione, (indietro) => impostaVerso(container.value, indietro));

onMounted(() => {
  lista.value = Array.from({ length: props.petali }, () => ({
    x: Math.random() * 120, // posizione orizzontale in %: il vento li porta a sinistra
    size: Math.random() * 9 + 12, // tra 12px e 21px
    duration: Math.random() * 12 + 12, // caduta tra 12s e 24s
    delay: Math.random() * -24, // ritardo negativo per animazione continua
    sway: Math.random() * 2 + 2.5, // ondeggiamento tra 2.5s e 4.5s
    flutter: Math.random() * 2 + 1.5, // giravolta tra 1.5s e 3.5s
    opacity: Math.random() * 0.4 + 0.6
  }));
  vicini.value = Array.from({ length: 4 }, () => ({
    x: Math.random() * 100 + 20, // un po' più a destra: scivolano verso sinistra più degli altri
    size: Math.random() * 40 + 45, // tra 45px e 85px
    // Ciclo tra 20s e 32s, ma attraversano lo schermo nel primo terzo (vedi caduta-vicina):
    // da vicino sembrano più veloci, e passano di rado
    duration: Math.random() * 12 + 20,
    delay: Math.random() * -32,
    sway: Math.random() * 2 + 3,
    flutter: Math.random() * 2 + 3,
    opacity: Math.random() * 0.25 + 0.55
  })).map((p) => ({ ...p, blur: p.size / 14 }));
});
</script>

<template>
  <div ref="container" :class="{ agitazione }" aria-hidden="true">
    <svg width="0" height="0" class="definizioni">
      <defs>
        <!-- Base del petalo più chiara, punta più rosa -->
        <linearGradient id="petalo-sfumatura" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" class="stop-base" />
          <stop offset="100%" class="stop-punta" />
        </linearGradient>
      </defs>
    </svg>
    <div v-for="strato in [{ classe: 'petali', lista }, { classe: 'petali vicini', lista: vicini }]" :key="strato.classe"
      :class="strato.classe">
      <div v-for="(p, index) in strato.lista" :key="index" class="caduta" :style="{
        left: p.x + '%',
        animationDuration: p.duration + 's',
        animationDelay: p.delay + 's',
        opacity: p.opacity,
        filter: p.blur ? `blur(${p.blur}px)` : null
      }">
        <div class="ondeggia" :style="{ animationDuration: p.sway + 's', animationDelay: p.delay + 's' }">
          <svg class="petalo" viewBox="0 0 20 20" :width="p.size" :height="p.size"
            :style="{ animationDuration: p.flutter + 's', animationDelay: p.delay + 's' }">
            <path d="M10 19 C4 15 2 8 5 3 C6.5 1 8.5 2.5 10 4.5 C11.5 2.5 13.5 1 15 3 C18 8 16 15 10 19Z"
              fill="url(#petalo-sfumatura)" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.petali {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 30;
}

/* Davanti alla frase (testi 100, pulsanti 200) */
.vicini {
  z-index: 110;
}

.vicini .caduta {
  top: -100px;
  animation-name: caduta-vicina;
}

.definizioni {
  position: absolute;
}

.stop-base {
  stop-color: #fff2f5;
  transition: stop-color 0.8s ease;
}

.stop-punta {
  stop-color: #f7a8bc;
  transition: stop-color 0.8s ease;
}

.agitazione .stop-base {
  stop-color: #ff4a3a;
}

.agitazione .stop-punta {
  stop-color: #6e0606;
}

.caduta {
  position: absolute;
  top: -20px;
  animation-name: caduta;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.ondeggia {
  animation: ondeggia ease-in-out infinite alternate;
}

.petalo {
  display: block;
  animation: giravolta linear infinite;
}

@keyframes caduta {
  to {
    transform: translate(-20vw, calc(100vh + 40px));
  }
}

@keyframes caduta-vicina {
  35%,
  100% {
    transform: translate(-30vw, calc(100vh + 200px));
  }
}

@keyframes ondeggia {
  from { transform: translateX(-14px); }
  to { transform: translateX(14px); }
}

/* Il petalo si gira mentre cade: di taglio sembra più stretto */
@keyframes giravolta {
  from { transform: rotate3d(1, 0.6, 0.3, 0deg); }
  to { transform: rotate3d(1, 0.6, 0.3, 360deg); }
}

/* Movimento ridotto: i petali restano fermi dove si trovano */
@media (prefers-reduced-motion: reduce) {
  .caduta,
  .ondeggia,
  .petalo {
    animation-play-state: paused;
  }
}
</style>
