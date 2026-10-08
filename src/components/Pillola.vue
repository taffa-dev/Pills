<script setup>
defineProps({
  testo: { type: String, required: true },
  stagione: { type: String, default: 'ordinaria' },
  agitazione: { type: Boolean, default: false }
});
</script>

<template>
  <!-- type="transition": la candela di Halloween è un'animazione infinita, Vue non deve aspettarla -->
  <Transition name="pillola" mode="out-in" type="transition" appear appear-from-class="pillola-appare-da" appear-active-class="pillola-appare">
    <!-- Le classi stanno sulla frase: quella in uscita sfuma senza cambiare aspetto -->
    <p :key="testo" :class="['pillola', stagione, { propaganda: agitazione }]">{{ testo }}</p>
  </Transition>
</template>

<style scoped>
.pillola {
  position: relative;
  z-index: 100;
  margin: 0;
  font-family: Georgia, serif;
  font-size: x-large;
  color: white;
  text-shadow: #14141f 1px 0 10px;
  text-align: center;
}

/* Halloween: luce di candela. Bianco caldo con bagliore dorato che tremola;
   il primo strato scuro sottile tiene le lettere staccate dalla luce della zucca. */
.pillola.halloween:not(.propaganda) {
  color: #fff1cc;
  text-shadow: 0 0 1px rgba(30, 10, 0, 0.9), 0 0 6px rgba(255, 180, 70, 0.55), 0 0 16px rgba(255, 130, 30, 0.35);
  animation: candela 5.7s linear infinite;
}

/* Variazioni a intervalli irregolari (la regolarità sembrerebbe un lampeggio).
   Solo colore e bagliore: l'opacità è riservata alla dissolvenza tra le frasi. */
@keyframes candela {
  0%, 100% { color: #fff1cc; text-shadow: 0 0 1px rgba(30, 10, 0, 0.9), 0 0 6px rgba(255, 180, 70, 0.55), 0 0 16px rgba(255, 130, 30, 0.35); }
  6% { color: #ffe7b0; text-shadow: 0 0 1px rgba(30, 10, 0, 0.9), 0 0 4px rgba(255, 170, 60, 0.4), 0 0 11px rgba(255, 120, 20, 0.22); }
  9% { color: #fff1cc; }
  24% { color: #fff6dc; text-shadow: 0 0 1px rgba(30, 10, 0, 0.9), 0 0 8px rgba(255, 190, 80, 0.7), 0 0 22px rgba(255, 140, 30, 0.45); }
  33% { color: #ffeabb; text-shadow: 0 0 1px rgba(30, 10, 0, 0.9), 0 0 5px rgba(255, 175, 65, 0.45), 0 0 14px rgba(255, 125, 25, 0.28); }
  47% { color: #ffe3a6; text-shadow: 0 0 1px rgba(30, 10, 0, 0.9), 0 0 3px rgba(255, 165, 55, 0.35), 0 0 9px rgba(255, 115, 20, 0.2); }
  50% { color: #fff1cc; }
  52% { color: #ffe9b8; }
  66% { color: #fff4d6; text-shadow: 0 0 1px rgba(30, 10, 0, 0.9), 0 0 7px rgba(255, 185, 75, 0.62), 0 0 19px rgba(255, 135, 30, 0.4); }
  81% { color: #ffecc0; text-shadow: 0 0 1px rgba(30, 10, 0, 0.9), 0 0 5px rgba(255, 175, 65, 0.5), 0 0 13px rgba(255, 125, 25, 0.3); }
  88% { color: #fff1cc; }
}

/* Pasqua: bianco con un'ombra color prugna, che lo stacca dal rosa */
.pillola.pasqua:not(.propaganda) {
  text-shadow: 0 0 2px rgba(60, 12, 40, 0.7), 0 0 14px rgba(77, 33, 64, 0.85);
}

@media (prefers-reduced-motion: reduce) {
  .pillola.halloween:not(.propaganda) {
    animation: none;
  }
}

/* Versione da propaganda: maiuscolo, bastoni, nessuna grazia. Vale in ogni stagione. */
.pillola.propaganda {
  max-width: 32em;
  padding: 0 1rem;
  font-family: 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #f2e6e6;
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.9), 0 0 2px #000;
}

.pillola-enter-active,
.pillola-leave-active {
  transition: opacity 0.4s ease;
}

.pillola-enter-from,
.pillola-leave-to {
  opacity: 0;
}

/* Prima comparsa: sale di pochi pixel mettendosi a fuoco, dopo il velo (come l'entrata del Calendario) */
.pillola-appare {
  transition: opacity 0.7s, transform 0.7s, filter 0.7s;
  transition-timing-function: cubic-bezier(0.05, 0.7, 0.1, 1);
  transition-delay: 0.25s;
}

.pillola-appare-da {
  opacity: 0;
  transform: translateY(10px);
  filter: blur(6px);
}

@media (prefers-reduced-motion: reduce) {
  .pillola-appare-da {
    transform: none;
    filter: none;
  }
}

/* Tablet */
@media (max-width: 1000px) {
  .pillola {
    width: 20em;
    font-size: larger;
  }
}

/* Smartphone */
@media (max-width: 500px) {
  .pillola {
    font-size: large;
  }

  .pillola.propaganda {
    width: auto;
    max-width: 20em;
  }
}
</style>
