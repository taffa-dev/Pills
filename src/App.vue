<script setup>
import { ref, computed, watchEffect } from 'vue';
import { getStagione, getNumeroDelGiorno, getPillole } from './stagioni.js';
import programma from './programma.json';
import Snow from './components/Snow.vue';
import Zucca from './components/Zucca.vue';
import Pipistrelli from './components/Pipistrelli.vue';
import Waves from './components/Waves.vue';
import Petali from './components/Petali.vue';
import SirenaButton from './components/SirenaButton.vue';
import StatoAgitazione from './components/StatoAgitazione.vue';
import Pillola from './components/Pillola.vue';
import Icona from './components/Icona.vue';

const CALENDARIO_URL = 'https://taffa-dev.github.io/Calendario/';

const oggi = getOggi();
const numeroDelGiorno = getNumeroDelGiorno(oggi);
const stagione = getStagione(oggi);

const nFlakes = (numeroDelGiorno % 70) + 30;
const nBats = (numeroDelGiorno % 10) + 5;
const nPetali = (numeroDelGiorno % 20) + 25;

// Stato d'agitazione: sfondo rosso pulsante e pillole nella loro versione malvagia
const agitazione = ref(false);

// Barre del telefono del colore dello sfondo: notte, Halloween, Pasqua o agitazione
watchEffect(() => {
  const colore = agitazione.value ? '#0d0000' : { halloween: '#200900', pasqua: '#4d2140' }[stagione.id] ?? '#090a0f';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colore);
});

const pillole = getPillole(programma, oggi);
const pillola = computed(() => agitazione.value ? pillole.malvagia : pillole.pillola);

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
    <Petali v-if="stagione.id === 'pasqua'" :petali="nPetali" :agitazione="agitazione" />
    <StatoAgitazione :attivo="agitazione" />

    <SirenaButton v-model="agitazione" />
    <a class="calendario-link" :href="CALENDARIO_URL" aria-label="Vai a Calendario">
      <Icona nome="calendario" />
    </a>

    <Pillola :testo="pillola" :stagione="stagione.id" :agitazione="agitazione" />
  </main>
</template>

<style scoped>
/* Livelli: onde 1 · zucca 5 · luce sirena 20 · neve/pipistrelli/petali 30 · testi 100 · petali vicini 110 · pulsanti 200 */
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

/* Pasqua: tramonto rosato sotto i ciliegi */
.container.pasqua {
  background: radial-gradient(ellipse at bottom, #f4bfcd 0%, #c27591 45%, #4d2140 100%);
}

.container.agitazione {
  background: radial-gradient(ellipse at center, #3a0505 0%, #0d0000 100%);
}

/* Gemello delle icone di Calendario (stesse icone, misure, posizione e stati): se cambia qui, va cambiato anche là */
.calendario-link {
  position: fixed;
  top: calc(0.5rem + env(safe-area-inset-top));
  right: calc(0.5rem + env(safe-area-inset-right));
  z-index: 200;
  display: inline-flex;
  align-items: center;
  padding: 0.35rem;
  font-size: 1rem;
  color: white;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

/* Discreta finché non la si indica (come in Calendario: l'opacità sta sull'icona) */
.calendario-link :deep(svg) {
  opacity: 0.55;
  transition: opacity 0.2s ease;
}

.calendario-link:focus-visible {
  outline: none;
}

.calendario-link:focus-visible :deep(svg) {
  opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
  .calendario-link:hover :deep(svg) {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .calendario-link :deep(svg) {
    transition: none;
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
