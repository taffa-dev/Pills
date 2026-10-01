// Fa scorrere le animazioni CSS di un elemento (e dei suoi figli) avanti o indietro nel tempo,
// partendo dalla posizione attuale di ciascuna: niente salti, come un nastro che si riavvolge.

const DURATA_FRENATA = 900; // ms per passare da avanti a indietro (e viceversa)

// Con playbackRate negativo un'animazione si ferma quando torna all'inizio della prima
// iterazione: la si porta avanti di molti cicli interi, così la posizione resta identica.
const CICLI_DI_SCORTA = 10000;

const rampeInCorso = new WeakMap();

export function impostaVerso(elemento, indietro) {
  if (!elemento) return;
  const verso = indietro ? -1 : 1;

  for (const animazione of elemento.getAnimations({ subtree: true })) {
    // Solo le animazioni @keyframes (caduta, oscillazione), non le transizioni di colore
    if (!(animazione instanceof CSSAnimation)) continue;

    const durata = animazione.effect.getTiming().duration;
    if (indietro && typeof durata === 'number' && durata > 0) {
      animazione.currentTime += durata * CICLI_DI_SCORTA;
    }

    cambiaVelocita(animazione, verso);
  }
}

function cambiaVelocita(animazione, destinazione) {
  cancelAnimationFrame(rampeInCorso.get(animazione));

  const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const partenza = animazione.playbackRate;
  if (ridotto || partenza === destinazione) {
    animazione.playbackRate = destinazione;
    return;
  }

  const inizio = performance.now();
  const passo = (ora) => {
    const t = Math.min((ora - inizio) / DURATA_FRENATA, 1);
    const curva = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // ease-in-out
    animazione.playbackRate = partenza + (destinazione - partenza) * curva;
    if (t < 1) rampeInCorso.set(animazione, requestAnimationFrame(passo));
  };
  rampeInCorso.set(animazione, requestAnimationFrame(passo));
}
