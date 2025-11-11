<script setup>
import { ref } from 'vue';
import { pills, christmasPills, halloweenPills } from './pills';
import Snow from './Snow.vue';
import Bats from './Bats.vue';
import Waves from './Waves.vue';

const oggi = new Date();
const anno = oggi.getFullYear();

const dailyRandomNumber = getDailyRandomNumber(oggi);

// Christmas Time (8 Dicembre - 6 Gennaio)
const startChristmasTime = new Date(anno, 11, 8);
const endChristmasTime = new Date(anno + 1, 0, 6);
const isChristmasTime = oggi >= startChristmasTime && oggi <= endChristmasTime;
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
  const todayStr = dataOggi.toISOString().split('T')[0];
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
    <div class="testoPillola">{{ msg }}</div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100dvw;
  height: 100dvh;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}

.container.halloween {
  background: radial-gradient(ellipse at bottom, rgb(91, 33, 0) 0%, #200900 100%);
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
  background-color: #29293d;
  height: 100vh;
}
</style>
