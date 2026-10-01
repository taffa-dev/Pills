import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dataDi } from '../src/mazzo.js';
import { getPillole, getStagione, pillolaVecchioSistema } from '../src/stagioni.js';
import * as generali from '../src/pills/generali.js';
import * as natale from '../src/pills/natale.js';
import * as halloween from '../src/pills/halloween.js';

const radice = new URL('..', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');

function cartellaDiProva() {
  const dir = mkdtempSync(join(tmpdir(), 'pills-'));
  cpSync(join(radice, 'src'), join(dir, 'src'), { recursive: true });
  cpSync(join(radice, 'scripts'), join(dir, 'scripts'), { recursive: true });
  writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
  writeFileSync(join(dir, 'src/programma.json'), '{}');
  return {
    dir,
    genera(oggi) {
      execFileSync(process.execPath, [join(dir, 'scripts/programma.mjs'), `--oggi=${oggi}`]);
      return JSON.parse(readFileSync(join(dir, 'src/programma.json'), 'utf8'));
    }
  };
}

const sposta = (giorno, n) => { const d = dataDi(giorno); d.setDate(d.getDate() + n); return d; };
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

test('il primo giorno sono le pillole del vecchio sistema', () => {
  const programma = cartellaDiProva().genera('2026-10-01');
  const d = dataDi('2026-10-01');
  const numero = (() => { const s = [2026, 9, 1].join('-'); let h = 0; for (const c of s) h = c.charCodeAt(0) + ((h << 5) - h); return Math.abs(h); })();
  assert.deepEqual(getPillole(programma, d), {
    pillola: generali.pillole[numero % generali.pillole.length],
    malvagia: generali.pilloleMalvagie[numero % generali.pilloleMalvagie.length]
  });
  assert.equal(programma['2026-10-01'], pillolaVecchioSistema(d));
});

test('oltre il programma il sito calcola le stesse pillole del generatore', () => {
  const prova = cartellaDiProva();
  const corto = prova.genera('2026-10-01');
  const lungo = prova.genera('2027-02-01');
  for (let i = 0; i < 180; i++) {
    const d = sposta('2026-10-01', i);
    const atteso = lungo[iso(d)];
    if (!atteso) continue;
    const { pillola } = getPillole(lungo, d);
    assert.equal(getPillole(corto, d).pillola, pillola, iso(d));
  }
});

test('ogni lista: nessuna ripetizione nel giro, malvagia sempre parallela', () => {
  const programma = cartellaDiProva().genera('2026-10-01');
  const uscite = { ordinaria: [], natale: [], halloween: [] };
  for (let i = -1; i < 365 * 6; i++) {
    const d = sposta('2026-10-02', i);
    const id = getStagione(d).id === 'estate' ? 'ordinaria' : getStagione(d).id;
    const { pillola, malvagia } = getPillole(programma, d);
    uscite[id].push(pillola);
    const lista = { ordinaria: generali, natale, halloween }[id];
    assert.equal(lista.pilloleMalvagie[lista.pillole.indexOf(pillola)], malvagia, 'malvagia parallela');
  }
  for (const [id, lista] of Object.entries(uscite)) {
    const n = new Set(lista).size;
    for (let g = 0; g + n <= lista.length; g += n) assert.equal(new Set(lista.slice(g, g + n)).size, n, `${id} giro ${g / n}`);
  }
  // Natale 2026 e 2027: 60 pillole in due anni, nessuna ripetuta
  assert.equal(new Set(uscite.natale.slice(0, 60)).size, 60);
});
