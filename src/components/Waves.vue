<script setup>
defineProps({
    // In stato d'agitazione il mare diventa rosso
    agitazione: { type: Boolean, default: false }
})
</script>

<template>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="100%" height="100%" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice"
        :class="['wave', { agitazione }]" aria-hidden="true">
        <defs>
            <!-- I colori arrivano da variabili CSS, così cambiano con lo stato d'agitazione -->
            <linearGradient id="wave-gradient">
                <stop offset="0%" style="stop-color: var(--wave-stop-1)"></stop>
                <stop offset="50%" style="stop-color: var(--wave-stop-2)"></stop>
                <stop offset="100%" style="stop-color: var(--wave-stop-3)"></stop>
            </linearGradient>
            <path id="wave" fill="url(#wave-gradient)" d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
	s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z" />
        </defs>
        <g>
            <use xlink:href='#wave' opacity=".3">
                <animateTransform attributeName="transform" attributeType="XML" type="translate" dur="10s"
                    calcMode="spline" values="270 230; -334 180; 270 230" keyTimes="0; .5; 1"
                    keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0" repeatCount="indefinite" />
            </use>
            <use xlink:href='#wave' opacity=".6">
                <animateTransform attributeName="transform" attributeType="XML" type="translate" dur="8s"
                    calcMode="spline" values="-270 230;243 220;-270 230" keyTimes="0; .6; 1"
                    keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0" repeatCount="indefinite" />
            </use>
            <use xlink:href='#wave' opacity=".9">
                <animateTransform attributeName="transform" attributeType="XML" type="translate" dur="6s"
                    calcMode="spline" values="0 230;-140 200;0 230" keyTimes="0; .4; 1"
                    keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0" repeatCount="indefinite" />
            </use>
        </g>
    </svg>
</template>

<style scoped>
.wave {
    --wave-stop-1: rgba(130, 158, 249, 0.06);
    --wave-stop-2: rgba(76, 190, 255, 0.6);
    --wave-stop-3: rgba(115, 209, 72, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: block;
    background-color: #0e4166;
    background-image: linear-gradient(to bottom, rgba(14, 65, 102, 0.86), #0e4166);
    z-index: 1;
    transition: background-color 0.8s ease;
}

.wave.agitazione {
    --wave-stop-1: rgba(255, 90, 60, 0.08);
    --wave-stop-2: rgba(200, 20, 20, 0.6);
    --wave-stop-3: rgba(90, 0, 0, 0.3);
    background-color: #2a0303;
    background-image: linear-gradient(to bottom, rgba(42, 3, 3, 0.86), #140000);
}
</style>
