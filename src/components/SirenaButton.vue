<script setup>
import { computed } from 'vue';
import Icona from './Icona.vue';

const attiva = defineModel({ type: Boolean, default: false });

const etichetta = computed(() =>
  attiva.value ? "Termina stato d'agitazione" : "Avvia stato d'agitazione"
);
</script>

<template>
  <button type="button" :class="['sirena', { attiva }]" :aria-pressed="attiva" :aria-label="etichetta"
    :data-tooltip="etichetta" @click="attiva = !attiva">
    <Icona nome="sirena" />
  </button>
</template>

<style scoped>
/* Gemello delle icone di Calendario (stesse icone, misure e stati): cambia solo la posizione, al centro */
.sirena {
  position: fixed;
  top: env(safe-area-inset-top);
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: inline-flex;
  align-items: center;
  /* Icona di 20px in un'area da toccare di 48px (Material 48dp, Apple 44pt, WCAG 2.5.5 44px) */
  padding: 0.875rem;
  font-size: 1.25rem;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.3s ease, filter 0.3s ease;
}

/* Discreta finché non la si indica o non è accesa (come in Calendario: l'opacità sta sull'icona) */
.sirena :deep(svg) {
  opacity: 0.55;
  transition: opacity 0.2s ease;
}

.sirena.attiva :deep(svg) {
  opacity: 1;
}

.sirena.attiva {
  color: #ff3b30;
  animation: sirena-glow 3.2s ease-in-out infinite;
}

@keyframes sirena-glow {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(255, 40, 30, 0.5)); }
  50% { filter: drop-shadow(0 0 10px rgba(255, 40, 30, 1)); }
}

.sirena::after {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% - 0.25rem);
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
  outline: none;
}

.sirena:focus-visible :deep(svg) {
  opacity: 1;
}

.sirena:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Solo con un vero puntatore: sui touch screen :hover resta attivo dopo il tocco */
@media (hover: hover) and (pointer: fine) {
  .sirena:hover :deep(svg) {
    opacity: 1;
  }

  .sirena:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sirena :deep(svg) {
    transition: none;
  }

  .sirena.attiva {
    animation: none;
    filter: drop-shadow(0 0 6px rgba(255, 40, 30, 0.9));
  }
}
</style>
