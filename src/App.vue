<template>
  <div :class="['container', { halloween: isHalloweenTime }]">
    <Snow v-if="isChristmasTime" :flakes="nFlakes"></Snow>
    <Bats v-if="isHalloweenTime" :bats="nBats"></Bats>
    <div class="testoPillola">{{ msg }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { pills, christmasPills, halloweenPills } from './pills';
import Snow from './Snow.vue';
import Bats from './Bats.vue';

// Date setup
const oggi = new Date();
const anno = oggi.getFullYear();

const startChristmasTime = new Date(anno, 11, 8);
const endChristmasTime = new Date(anno + 1, 0, 6);

const startHalloweenTime = new Date(anno, 11, 25);
const endHalloweenTime = new Date(anno, 11, 31);

// Helper
function isDateInRange(start, end, date) {
  return date >= start && date <= end;
}

const isChristmasTime = isDateInRange(startChristmasTime, endChristmasTime, oggi);
const isHalloweenTime = isDateInRange(startHalloweenTime, endHalloweenTime, oggi);

// Daily random number
function getDailyRandomNumber() {
  const todayStr = oggi.toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = todayStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const dailyRandomNumber = getDailyRandomNumber();

// Snow & Bats
const nFlakes = ref((dailyRandomNumber % 70) + 30);

let baseBats = (dailyRandomNumber % 10) + 5;
if (window.innerWidth <= 500) {
  baseBats = Math.max(2, Math.floor(baseBats / 2));
}
const nBats = ref(baseBats);

// Message
const msg = ref('');
if (isChristmasTime) {
  msg.value = christmasPills[dailyRandomNumber % christmasPills.length];
} else if (isHalloweenTime) {
  msg.value = halloweenPills[dailyRandomNumber % halloweenPills.length];
} else {
  msg.value = pills[dailyRandomNumber % pills.length];
}

// Add class to HTML for background
onMounted(() => {
  if (isHalloweenTime) {
    document.documentElement.classList.add('halloween');
    document.body.classList.add('halloween');
  } else {
    document.documentElement.classList.remove('halloween');
    document.body.classList.remove('halloween');
  }
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.testoPillola {
  font-family: Georgia, serif;
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: white;
  text-shadow: #14141f 1px 0 10px;
  text-align: center;
}

.container.halloween .testoPillola {
  color: rgb(255, 123, 0);
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}

html.halloween,
body.halloween {
  background: radial-gradient(ellipse at bottom, rgb(91, 33, 0) 0%, #200900 100%);
}
</style>
