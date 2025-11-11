<script setup>
const props = defineProps({
    flakes: { type: Number, default: 40 }
})
</script>

<template>
    <div v-for="n in flakes" :key="n" class="snow" ></div>
</template>

<style lang="scss" scoped>
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