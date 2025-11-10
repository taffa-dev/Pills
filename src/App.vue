<script setup>
import { ref } from 'vue';
import { pillole } from './Pillole';

const msg = ref(pillole[getDailyRandomNumber()])

function getDailyRandomNumber() {
  let today = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  const random = Math.abs(hash) % 100;
  return random;
}

</script>

<template>
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

  .testoPillola{
    font-size: larger;
    width: 20em;
  }

}

/* Smartphone */
@media all and (max-width: 500px) {

  .testoPillola{
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
}
</style>