<script setup>
import { ref } from 'vue';
import { pillole, pilloleNatalizie } from './pillole';

const oggi = new Date();

const anno = oggi.getFullYear();
const inizioFestivo = new Date(anno, 11, 8); // 8 dicembre
const fineFestivo = new Date(anno + 1, 0, 6); // 6 gennaio
const isChristmasTime = oggi >= inizioFestivo && oggi <= fineFestivo;

let msg = '';

if (isChristmasTime) {
  // Natale
  msg = ref(pilloleNatalizie[getDailyRandomNumber() % pilloleNatalizie.length])
}
else {
  // Normale
  msg = ref(pillole[getDailyRandomNumber() % pillole.length])
}

function getDailyRandomNumber() {
  let today = oggi.toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  const random = Math.abs(hash);
  return random;
}
</script>

<template>
  <div v-if="isChristmasTime">
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
    <div class="snow"></div>
  </div>
  <div class="container">
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
}

.testoPillola {
  font-family: Georgia, serif;
  font-size: x-large;
  color: white;
  text-shadow: #14141f 1px 0 10px;
  text-align: center;
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
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
  filter: drop-shadow(0 0 10px white);
}
</style>

<style lang="scss">
@use "sass:math";

@function random_range($min, $max) {
  $rand: math.random();
  $random_range: $min + math.floor($rand * (($max - $min) + 1));
  @return $random_range;
}

.snow {
  $total: 200;
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;

  @for $i from 1 through $total {
    $random-x: math.random(1000000) * 0.0001vw;
    $random-offset: math.div(random_range(30000, 80000), 100000) * 0.0001vw;
    $random-x-end: $random-x + $random-offset;
    $random-x-end-yoyo: $random-x + math.div($random-offset, 2);
    $random-yoyo-time: math.div(random_range(30000, 80000), 100000);
    $random-yoyo-y: $random-yoyo-time * 100vh;
    $random-scale: math.random(10000) * 0.0001;
    $fall-duration: random_range(10, 30) * 1s;
    $fall-delay: math.random(30) * -1s;

    &:nth-child(#{$i}) {
      opacity: math.random(10000) * 0.0001;
      transform: translate($random-x, -10px) scale($random-scale);
      animation: fall-#{$i} $fall-duration $fall-delay linear infinite;
    }

    @keyframes fall-#{$i} {
      #{math.percentage($random-yoyo-time)} {
        transform: translate($random-x-end, $random-yoyo-y) scale($random-scale);
      }

      to {
        transform: translate($random-x-end-yoyo, 100vh) scale($random-scale);
      }
    }
  }
}
</style>