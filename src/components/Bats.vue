<script setup>
import { computed } from 'vue';

const props = defineProps({
    bats: { type: Number, default: 40 }
})

const batsArray = computed(() => {
    return Array.from({ length: props.bats }, (_, i) => {
        const left = Math.random() * 90; // posizione orizzontale casuale
        const fallDelay = Math.random() * 10; // ritardo caduta casuale
        const shakeDelay = Math.random() * 3; // ritardo shake casuale
        const shakeDistance = 20 + Math.random() * 60; // distanza shake casuale
        return { id: i, left, fallDelay, shakeDelay, shakeDistance }
    })
})
</script>

<template>
    <div v-for="bat in batsArray" :key="bat.id" class="bat" :style="{
        left: bat.left + '%',
        animationDelay: bat.fallDelay + 's,' + bat.shakeDelay + 's',
        '--shake-distance': bat.shakeDistance + 'px'
    }">
        <img src="https://media1.giphy.com/media/0xR7MUO0hJfWtco7C6/giphy.gif" />
    </div>
</template>

<style>
.bat {
    position: fixed;
    top: -10%;
    z-index: 9999;
    user-select: none;
    cursor: default;
    animation: bats-fall 10s linear infinite, bats-shake 3s ease-in-out infinite;
}

/* Keyframes */
@keyframes bats-fall {
    0% {
        top: -10%;
    }
    100% {
        top: 100%;
    }
}

@keyframes bats-shake {
    0% {
        transform: translateX(0px);
    }
    50% {
        transform: translateX(var(--shake-distance, 80px));
    }
    100% {
        transform: translateX(0px);
    }
}

.bat img {
    height: 40px;
    display: block;
}
</style>
