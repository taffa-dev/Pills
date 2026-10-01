<script setup>
import { onMounted, ref, watch } from 'vue';
import { impostaVerso } from '../riavvolgi.js';

const props = defineProps({
  flakes: { type: Number, default: 40 },
  // In stato d'agitazione la neve diventa cenere incandescente e risale, come a tempo riavvolto
  agitazione: { type: Boolean, default: false }
});

const snowflakes = ref([]);
const container = ref(null);

watch(() => props.agitazione, (indietro) => impostaVerso(container.value, indietro));

onMounted(() => {
  snowflakes.value = Array.from({ length: props.flakes }, () => ({
    x: Math.random() * 100, // posizione orizzontale in %
    size: Math.random() * 8 + 4, // dimensione tra 4px e 12px
    duration: Math.random() * 20 + 10, // durata caduta tra 10s e 30s
    delay: Math.random() * -20, // ritardo negativo per animazione continua
    opacity: Math.random() * 0.8 + 0.2 // opacità tra 0.2 e 1
  }));
});
</script>

<template>
  <div ref="container" :class="['snow-container', { cenere: agitazione }]" aria-hidden="true">
    <div
      v-for="(flake, index) in snowflakes"
      :key="index"
      class="snowflake"
      :style="{
        left: flake.x + '%',
        width: flake.size + 'px',
        height: flake.size + 'px',
        animationDuration: flake.duration + 's',
        animationDelay: flake.delay + 's',
        opacity: flake.opacity
      }"
    ></div>
  </div>
</template>

<style scoped>
.snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 30;
}

.snowflake {
  position: absolute;
  top: -10px;
  background: white;
  border-radius: 50%;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  transition: background-color 0.8s ease, box-shadow 0.8s ease;
}

.cenere .snowflake {
  background: #ffb4a8;
  box-shadow: 0 0 6px 1px rgba(255, 60, 30, 0.8);
}

@keyframes fall {
  to {
    transform: translateY(110vh);
  }
}

/* Movimento ridotto: i fiocchi restano fermi dove si trovano (con animation: none sparirebbero in alto) */
@media (prefers-reduced-motion: reduce) {
  .snowflake {
    animation-play-state: paused;
  }
}
</style>
