// Aggiorna src/programma.json: la pillola di ogni giorno (la malvagia è quella parallela), dal passato che serve ai mazzi
// fino a GIORNI_AVANTI giorni da oggi. Lo esegue la GitHub Action (a ogni push e ogni settimana).
// - I giorni passati non si toccano mai; oggi neppure, se le sue pillole esistono ancora.
// - Il futuro si ricalcola con le liste attuali: le pillole nuove entrano nel giro in corso.
// - Programma vuoto: il primo giorno è oggi, con le pillole del vecchio sistema (nessuno vede cambiare nulla).
// Uso: node scripts/programma.mjs [--oggi=AAAA-MM-GG]
import { readFileSync, writeFileSync } from 'node:fs';
import { giornoDi, dataDi, giornoDopo, percorri } from '../src/mazzo.js';
import { creaSceltaDelGiorno, pillolaVecchioSistema } from '../src/stagioni.js';

const GIORNI_AVANTI = 60;
const GIORNI_INDIETRO = 7;

const PROGRAMMA = new URL('../src/programma.json', import.meta.url);

const spostaGiorno = (giorno, n) => {
  const data = dataDi(giorno);
  data.setDate(data.getDate() + n);
  return giornoDi(data);
};

const argOggi = process.argv.find((a) => a.startsWith('--oggi='))?.slice(7);
const oggi = argOggi ?? giornoDi(new Date());
let programma = JSON.parse(readFileSync(PROGRAMMA, 'utf8'));

if (!Object.keys(programma).length) {
  programma = { [oggi]: pillolaVecchioSistema(dataDi(oggi)) };
}

const scelta = creaSceltaDelGiorno();
const fine = spostaGiorno(oggi, GIORNI_AVANTI);
const giorni = percorri(programma, fine, oggi, (g, salvata) =>
  scelta.scegli(g, g === oggi && salvata && !scelta.pillole(salvata) ? undefined : salvata));

const conserva = [scelta.primoGiornoDaConservare, spostaGiorno(oggi, -GIORNI_INDIETRO)]
  .filter(Boolean).sort()[0];
const righe = Object.entries(giorni)
  .filter(([g]) => g >= conserva)
  .map(([g, chiave]) => `  "${g}": "${chiave}"`);
const testo = `{\n${righe.join(',\n')}\n}\n`;

if (testo !== readFileSync(PROGRAMMA, 'utf8')) {
  writeFileSync(PROGRAMMA, testo);
  console.log(`programma aggiornato: ${righe.length} giorni, fino al ${fine}`);
} else {
  console.log('programma già aggiornato');
}

for (let g = Object.keys(giorni).find((x) => x >= conserva); g <= fine; g = giornoDopo(g)) {
  if (!giorni[g]) throw new Error(`manca il ${g}`);
}
