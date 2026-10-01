<script setup>
import { ref, computed } from 'vue';
import {
  pills, christmasPills, halloweenPills,
  evilPills, evilChristmasPills, evilHalloweenPills
} from './assets/pills.js';
import Snow from './components/Snow.vue';
import Bats from './components/Bats.vue';
import Waves from './components/Waves.vue';

const CALENDARIO_URL = 'https://taffa-dev.github.io/Calendario/';

const oggi = new Date();
const anno = oggi.getFullYear();

const dailyRandomNumber = getDailyRandomNumber(oggi);

// Christmas Time (8 Dicembre - 6 Gennaio, a cavallo tra due anni)
const isChristmasTime = (oggi.getMonth() === 11 && oggi.getDate() >= 8) || (oggi.getMonth() === 0 && oggi.getDate() <= 6);
const nFlakes = ref((dailyRandomNumber % 70) + 30);

// Halloween Time (25 - 31 ottobre)
const startHalloweenTime = new Date(anno, 9, 25);
const endHalloweenTime = new Date(anno, 9, 31);
const isHalloweenTime = oggi >= startHalloweenTime && oggi <= endHalloweenTime;
const nBats = ref((dailyRandomNumber % 10) + 5);

// Summer Time (1 - 31 Agosto)
const startSummerTime = new Date(anno, 7, 1);
const endSummerTime = new Date(anno, 7, 31);
const isSummerTime = oggi >= startSummerTime && oggi <= endSummerTime;

// Stato d'agitazione: sfondo rosso pulsante e pillole nella loro versione malvagia
const statoAgitazione = ref(false);

let goodList = pills;
let evilList = evilPills;
if (isChristmasTime) {
  goodList = christmasPills;
  evilList = evilChristmasPills;
} else if (isHalloweenTime) {
  goodList = halloweenPills;
  evilList = evilHalloweenPills;
}

const msg = computed(() => {
  const list = statoAgitazione.value ? evilList : goodList;
  return list[dailyRandomNumber % list.length];
});

const sirenaLabel = computed(() =>
  statoAgitazione.value ? "Termina stato d'agitazione" : "Avvia stato d'agitazione"
);

function getDailyRandomNumber(dataOggi) {
  const todayStr = [dataOggi.getFullYear(), dataOggi.getMonth(), dataOggi.getDate()].join('-');
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = todayStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}
</script>

<template>
  <div :class="['container', { halloween: isHalloweenTime, agitazione: statoAgitazione }]">
    <Waves v-if="isSummerTime"></Waves>
    <Snow v-if="isChristmasTime" :flakes="nFlakes"></Snow>
    <Bats v-if="isHalloweenTime" :bats="nBats"></Bats>
    <Transition name="sirena-fade">
      <div v-if="statoAgitazione" class="agitazione-overlay" aria-hidden="true"></div>
    </Transition>
    <button type="button" class="sirena-btn" :aria-pressed="statoAgitazione" :aria-label="sirenaLabel"
      :data-tooltip="sirenaLabel" @click="statoAgitazione = !statoAgitazione">
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 18v-5a5 5 0 0 1 10 0v5" />
        <rect x="4" y="18" width="16" height="3" rx="1" />
        <path d="M12 2v2" />
        <path d="M4.2 5.2l1.4 1.4" />
        <path d="M19.8 5.2l-1.4 1.4" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
      </svg>
    </button>
    <a class="calendario-link" :href="CALENDARIO_URL" aria-label="Vai a Calendario">
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </a>
    <Transition name="pillola" mode="out-in">
      <!-- Lo stile sta sulla frase, non sul contenitore: quella in uscita sfuma senza cambiare aspetto -->
      <div :class="['testoPillola', { propaganda: statoAgitazione }]" :key="msg">{{ msg }}</div>
    </Transition>
    <Transition name="sirena-fade">
      <div v-if="statoAgitazione" class="motto">Lui vi osserva</div>
    </Transition>
  </div>
</template>

<style scoped>
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

/* Luce della sirena: sta sopra le animazioni stagionali, sotto testi e pulsanti.
   La pulsazione è sullo pseudo-elemento, così il contenitore gestisce solo la dissolvenza
   (Vue attenderebbe altrimenti la durata dell'animazione prima di rimuoverlo). */
.agitazione-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
}

.agitazione-overlay::before {
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

.sirena-fade-enter-active,
.sirena-fade-leave-active {
  transition: opacity 0.5s ease;
}

.sirena-fade-enter-from,
.sirena-fade-leave-to {
  opacity: 0;
}

.sirena-btn {
  position: fixed;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  padding: 0.35rem;
  font-size: 1rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: white;
  opacity: 0.55;
  cursor: pointer;
  z-index: 200;
  transition: opacity 0.2s ease, color 0.3s ease, filter 0.3s ease;
}

.sirena-btn:hover,
.sirena-btn:focus-visible {
  opacity: 1;
}

.container.agitazione .sirena-btn {
  color: #ff3b30;
  opacity: 1;
  filter: drop-shadow(0 0 6px rgba(255, 40, 30, 0.9));
  animation: sirena-glow 3.2s ease-in-out infinite;
}

@keyframes sirena-glow {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(255, 40, 30, 0.5)); }
  50% { filter: drop-shadow(0 0 10px rgba(255, 40, 30, 1)); }
}

/* Tooltip immediato sotto la sirena */
.sirena-btn::after {
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

.sirena-btn:hover::after,
.sirena-btn:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.calendario-link {
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.35rem;
  display: inline-flex;
  color: white;
  opacity: 0.55;
  z-index: 200;
  transition: opacity 0.2s ease;
}

.calendario-link:hover {
  opacity: 1;
}

.testoPillola {
  font-family: Georgia, serif;
  font-size: x-large;
  color: white;
  text-shadow: #14141f 1px 0 10px;
  text-align: center;
  z-index: 100;
}

.container.halloween .testoPillola:not(.propaganda) {
  color: rgb(255, 123, 0);
}

/* Versione da propaganda: maiuscolo, bastoni, nessuna grazia */
.testoPillola.propaganda {
  font-family: 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #f2e6e6;
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.9), 0 0 2px #000;
  max-width: 32em;
  padding: 0 1rem;
}

.pillola-enter-active,
.pillola-leave-active {
  transition: opacity 0.4s ease;
}

.pillola-enter-from,
.pillola-leave-to {
  opacity: 0;
}

.motto {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  font-family: 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  white-space: nowrap;
  color: rgba(255, 220, 220, 0.6);
}

@media (prefers-reduced-motion: reduce) {
  .agitazione-overlay::before,
  .container.agitazione .sirena-btn {
    animation: none;
  }

  .agitazione-overlay::before {
    opacity: 0.7;
  }
}

/* Tablet */
@media all and (max-width: 1000px) {
  .testoPillola {
    font-size: larger;
    width: 20em;
  }
}

/* Smartphone */
@media all and (max-width: 500px) {
  .testoPillola {
    font-size: large;
    width: 20em;
  }

  .testoPillola.propaganda {
    width: auto;
    max-width: 20em;
  }

  .motto {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
  }
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background-color: #090a0f;
  height: 100vh;
}
</style>
