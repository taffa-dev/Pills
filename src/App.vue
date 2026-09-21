<script setup>
import { ref } from 'vue';
import { pills, christmasPills, halloweenPills } from './assets/pills.js';
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

let msg = '';

if (isChristmasTime) {
  msg = ref(christmasPills[dailyRandomNumber % christmasPills.length]);
} else if (isHalloweenTime) {
  msg = ref(halloweenPills[dailyRandomNumber % halloweenPills.length]);
} else {
  msg = ref(pills[dailyRandomNumber % pills.length]);
}

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
  <div :class="['container', { halloween: isHalloweenTime }]">
    <Waves v-if="isSummerTime"></Waves>
    <Snow v-if="isChristmasTime" :flakes="nFlakes"></Snow>
    <Bats v-if="isHalloweenTime" :bats="nBats"></Bats>
    <a class="calendario-link" :href="CALENDARIO_URL" aria-label="Vai a Calendario">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </a>
    <div class="testoPillola">{{ msg }}</div>
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

.calendario-link {
  position: fixed;
  top: 1rem;
  right: 1rem;
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

.container.halloween .testoPillola {
  color: rgb(255, 123, 0);
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
