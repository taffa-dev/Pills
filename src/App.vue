<script setup>
import { ref, computed } from 'vue';
import { getStagione, getNumeroDelGiorno, getPillola } from './stagioni.js';
import Snow from './components/Snow.vue';
import Zucca from './components/Zucca.vue';
import Pipistrelli from './components/Pipistrelli.vue';
import Waves from './components/Waves.vue';
import SirenaButton from './components/SirenaButton.vue';
import StatoAgitazione from './components/StatoAgitazione.vue';
import Pillola from './components/Pillola.vue';

const CALENDARIO_URL = 'https://taffa-dev.github.io/Calendario/';

const oggi = getOggi();
const numeroDelGiorno = getNumeroDelGiorno(oggi);
const stagione = getStagione(oggi);

const nFlakes = (numeroDelGiorno % 70) + 30;
const nBats = (numeroDelGiorno % 10) + 5;

// Stato d'agitazione: sfondo rosso pulsante e pillole nella loro versione malvagia
const agitazione = ref(false);

const pillola = computed(() => getPillola(stagione, numeroDelGiorno, agitazione.value));

// Solo con `npm run dev`: ?data=2026-12-20 simula un altro giorno, per provare le stagioni
function getOggi() {
  const simulata = import.meta.env.DEV && new URLSearchParams(location.search).get('data');
  const data = simulata ? new Date(`${simulata}T12:00`) : null;
  return data && !isNaN(data) ? data : new Date();
}
</script>

<template>
  <main :class="['container', stagione.id, { agitazione }]">
    <Waves v-if="stagione.id === 'estate'" :agitazione="agitazione" />
    <Snow v-if="stagione.id === 'natale'" :flakes="nFlakes" :agitazione="agitazione" />
    <template v-if="stagione.id === 'halloween'">
      <Zucca :agitazione="agitazione" />
      <Pipistrelli :bats="nBats" :agitazione="agitazione" />
    </template>
    <StatoAgitazione :attivo="agitazione" />

    <SirenaButton v-model="agitazione" />
    <a class="calendario-link" :href="CALENDARIO_URL" aria-label="Vai a Calendario">
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </a>

    <Pillola :testo="pillola" :stagione="stagione.id" :agitazione="agitazione" />
  </main>
</template>

<style scoped>
/* Livelli: onde 1 · zucca 5 · luce sirena 20 · neve/pipistrelli 30 · testi 100 · pulsanti 200 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100dvw;
  height: 100vh;
  height: 100dvh;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}

.container.halloween {
  background: radial-gradient(ellipse at bottom, rgb(91, 33, 0) 0%, #200900 100%);
}

.container.agitazione {
  background: radial-gradient(ellipse at center, #3a0505 0%, #0d0000 100%);
}

/* Posizione e misure gemelle dei pulsanti di Calendario */
.calendario-link {
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 200;
  display: inline-flex;
  padding: 0.35rem;
  font-size: 1rem;
  color: white;
  opacity: 0.55;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s ease;
}

.calendario-link:focus-visible {
  opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
  .calendario-link:hover {
    opacity: 1;
  }
}
</style>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #090a0f;
}
</style>
