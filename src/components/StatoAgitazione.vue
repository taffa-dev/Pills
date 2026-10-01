<script setup>
defineProps({
  attivo: { type: Boolean, default: false }
});
</script>

<template>
  <!-- Luce della sirena: sopra lo sfondo stagionale (onde), sotto neve/pipistrelli, testi e pulsanti -->
  <Transition name="sirena-fade">
    <div v-if="attivo" class="luce" aria-hidden="true"></div>
  </Transition>
  <Transition name="sirena-fade">
    <p v-if="attivo" class="motto">Lui vi osserva</p>
  </Transition>
</template>

<style scoped>
/* La pulsazione è sullo pseudo-elemento, così il contenitore gestisce solo la dissolvenza
   (Vue attenderebbe altrimenti la durata dell'animazione prima di rimuoverlo). */
.luce {
  position: fixed;
  inset: 0;
  z-index: 20;
  pointer-events: none;
}

.luce::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(255, 30, 20, 0.55) 0%, rgba(120, 0, 0, 0.35) 55%, rgba(20, 0, 0, 0.6) 100%);
  animation: sirena-pulse 3.2s ease-in-out infinite;
}

@keyframes sirena-pulse {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}

.motto {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  margin: 0;
  font-family: 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  white-space: nowrap;
  color: rgba(255, 220, 220, 0.6);
}

.sirena-fade-enter-active,
.sirena-fade-leave-active {
  transition: opacity 0.5s ease;
}

.sirena-fade-enter-from,
.sirena-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .luce::before {
    animation: none;
    opacity: 0.7;
  }
}

@media (max-width: 500px) {
  .motto {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
  }
}
</style>
