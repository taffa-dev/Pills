import * as generali from './pills/generali.js';
import * as natale from './pills/natale.js';
import * as halloween from './pills/halloween.js';
import { chiaveDi, giornoDi, dataDi, creaMazzo, percorri } from './mazzo.js';

// Le date si confrontano a giorno intero (mezzanotte): un confronto con l'ora
// escluderebbe l'ultimo giorno del periodo.
// Mesi da 0 (gennaio) a 11 (dicembre).
const STAGIONI = [
  {
    id: 'natale',
    attiva: (data) => {
      const mese = data.getMonth();
      const giorno = data.getDate();
      return (mese === 11 && giorno >= 8) || (mese === 0 && giorno <= 6);
    },
    pillole: natale
  },
  {
    // Tutta la settimana (lunedì - domenica) in cui cade il 31 ottobre
    id: 'halloween',
    attiva: (data) => {
      const lunedi = getLunedi(new Date(data.getFullYear(), 9, 31));
      const domenica = new Date(lunedi.getFullYear(), lunedi.getMonth(), lunedi.getDate() + 6);
      const giorno = new Date(data.getFullYear(), data.getMonth(), data.getDate());
      return giorno >= lunedi && giorno <= domenica;
    },
    pillole: halloween
  },
  {
    id: 'estate',
    attiva: (data) => data.getMonth() === 7,
    pillole: generali
  }
];

const ORDINARIA = { id: 'ordinaria', pillole: generali };

export function getStagione(data) {
  return STAGIONI.find((s) => s.attiva(data)) ?? ORDINARIA;
}

// Lunedì (a mezzanotte) della settimana che contiene la data
function getLunedi(data) {
  const daLunedi = (data.getDay() + 6) % 7; // getDay(): 0 = domenica
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() - daLunedi);
}

// Numero pseudo-casuale stabile per tutta la giornata, uguale per tutti: decide quanti fiocchi e
// pipistrelli, e la pillola del vecchio sistema (giorni precedenti al programma). Non va cambiato.
export function getNumeroDelGiorno(data) {
  const giorno = [data.getFullYear(), data.getMonth(), data.getDate()].join('-');
  let hash = 0;
  for (let i = 0; i < giorno.length; i++) {
    hash = giorno.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// --- Programma (src/programma.json, aggiornato da scripts/programma.mjs) ---
// Ogni giorno ha la chiave della sua pillola; la malvagia è quella con lo stesso indice (liste
// parallele). Ogni lista ha il suo mazzo a giri (mazzo.js), che avanza solo nei giorni in cui è in uso.

// Il vecchio sistema (casuale puro): giorni precedenti al programma e primo giorno del programma
export function pillolaVecchioSistema(data) {
  const { pillole } = getStagione(data).pillole;
  return chiaveDi(pillole[getNumeroDelGiorno(data) % pillole.length]);
}

export function creaSceltaDelGiorno() {
  const liste = new Map();
  // chiave della pillola -> { pillola, malvagia }
  const perChiave = new Map();
  for (const modulo of [generali, natale, halloween]) {
    const chiavi = modulo.pillole.map(chiaveDi);
    chiavi.forEach((k, i) => perChiave.set(k, { pillola: modulo.pillole[i], malvagia: modulo.pilloleMalvagie[i] }));
    liste.set(modulo, { mazzo: creaMazzo(chiavi), giorni: [] });
  }

  return {
    scegli(giorno, salvata) {
      const stagione = getStagione(dataDi(giorno));
      const lista = liste.get(stagione.pillole);
      const chiave = salvata ?? lista.mazzo.pesca(`${giorno}#${stagione.id}`);
      if (lista.mazzo.registra(chiave)) lista.giorni.push(giorno);
      return chiave;
    },
    pillole: (chiave) => perChiave.get(chiave),
    // Primo giorno da conservare nel programma perché ogni mazzo ricostruito ricordi abbastanza
    get primoGiornoDaConservare() {
      const primi = [...liste.values()].map(({ giorni, mazzo }) => giorni[Math.max(0, giorni.length - mazzo.memoria)]);
      return primi.filter(Boolean).sort()[0];
    }
  };
}

// Pillola e malvagia di un giorno per il sito: dal programma se c'è; oltre la fine lo si prosegue
// col mazzo (stesso risultato per tutti); prima dell'inizio, il vecchio sistema.
export function getPillole(programma, data) {
  const giorno = giornoDi(data);
  const scelta = creaSceltaDelGiorno();
  const giorni = percorri(programma, giorno, '9999-12-31', (g, salvata) =>
    // Una voce salvata ma sconosciuta (pillola tolta o corretta) si ricalcola solo per il giorno chiesto
    scelta.scegli(g, g === giorno && salvata && !scelta.pillole(salvata) ? undefined : salvata));
  return scelta.pillole(giorni[giorno]) ?? scelta.pillole(pillolaVecchioSistema(data));
}
