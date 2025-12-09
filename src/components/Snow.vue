
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  flakes: { type: Number, default: 40 }
});

const snowflakes = ref([]);

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
  <div class="snow-container">
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
  z-index: 50;
}

.snowflake {
  position: absolute;
  top: -10px;
  background: white;
  border-radius: 50%;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes fall {
  to {
    transform: translateY(110vh);
  }
}
</style>
