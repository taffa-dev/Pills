<script setup>
import { computed } from 'vue';

const attiva = defineModel({ type: Boolean, default: false });

const etichetta = computed(() =>
  attiva.value ? "Termina stato d'agitazione" : "Avvia stato d'agitazione"
);
</script>

<template>
  <button type="button" :class="['sirena', { attiva }]" :aria-pressed="attiva" :aria-label="etichetta"
    :data-tooltip="etichetta" @click="attiva = !attiva">
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 18v-5a5 5 0 0 1 10 0v5" />
      <rect x="4" y="18" width="16" height="3" rx="1" />
      <path d="M12 2v2" />
      <path d="M4.2 5.2l1.4 1.4" />
      <path d="M19.8 5.2l-1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  </button>
</template>

<style scoped>
/* Posizione e misure gemelle dei pulsanti di Calendario */
.sirena {
  position: fixed;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: inline-flex;
  padding: 0.35rem;
  font-size: 1rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: white;
  opacity: 0.55;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s ease, color 0.3s ease, filter 0.3s ease;
}

.sirena.attiva {
  color: #ff3b30;
  opacity: 1;
  animation: sirena-glow 3.2s ease-in-out infinite;
}

@keyframes sirena-glow {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(255, 40, 30, 0.5)); }
  50% { filter: drop-shadow(0 0 10px rgba(255, 40, 30, 1)); }
}

.sirena::after {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-family: Georgia, serif;
  font-size: 0.85rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sirena:focus-visible {
  opacity: 1;
}

.sirena:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Solo con un vero puntatore: sui touch screen :hover resta attivo dopo il tocco */
@media (hover: hover) and (pointer: fine) {
  .sirena:hover {
    opacity: 1;
  }

  .sirena:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sirena.attiva {
    animation: none;
    filter: drop-shadow(0 0 6px rgba(255, 40, 30, 0.9));
  }
}
</style>
