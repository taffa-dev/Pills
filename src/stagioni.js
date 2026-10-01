import * as generali from './pills/generali.js';
import * as natale from './pills/natale.js';
import * as halloween from './pills/halloween.js';

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

// Numero pseudo-casuale stabile per tutta la giornata: stessa pillola per tutti, ogni giorno diversa.
export function getNumeroDelGiorno(data) {
  const giorno = [data.getFullYear(), data.getMonth(), data.getDate()].join('-');
  let hash = 0;
  for (let i = 0; i < giorno.length; i++) {
    hash = giorno.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getPillola(stagione, numero, agitazione) {
  const lista = agitazione ? stagione.pillole.pilloleMalvagie : stagione.pillole.pillole;
  return lista[numero % lista.length];
}
