// "Condividi": un'immagine della pillola con lo sfondo della stagione (o dell'agitazione), come fa il
// Calendario col suo foglio. Dove si può la si passa al menu di condivisione del sistema, altrimenti
// si scarica.

const LARGHEZZA = 1080;
const ALTEZZA = 1350;
const INDIRIZZO = 'taffa-dev.github.io/Pills';

// Gli stessi sfondi di App.vue: [centro dell'ellisse, colori]
const SFONDI = {
  ordinaria: ['basso', [[0, '#1b2735'], [1, '#090a0f']]],
  halloween: ['basso', [[0, 'rgb(91, 33, 0)'], [1, '#200900']]],
  pasqua: ['basso', [[0, '#f4bfcd'], [0.45, '#c27591'], [1, '#4d2140']]],
  agitazione: ['centro', [[0, '#3a0505'], [1, '#0d0000']]]
};

// Come in Pillola.vue: Georgia, candela a Halloween, ombra prugna a Pasqua, bastoni maiuscoli in agitazione
const STILI = {
  ordinaria: { font: 'Georgia, serif', colore: 'white', ombre: [['#14141f', 10]] },
  halloween: { font: 'Georgia, serif', colore: '#fff1cc', ombre: [['rgba(255, 130, 30, 0.35)', 16], ['rgba(255, 180, 70, 0.55)', 6], ['rgba(30, 10, 0, 0.9)', 1]] },
  pasqua: { font: 'Georgia, serif', colore: 'white', ombre: [['rgba(77, 33, 64, 0.85)', 14], ['rgba(60, 12, 40, 0.7)', 2]] },
  agitazione: {
    font: "'Arial Narrow', 'Helvetica Neue', Arial, sans-serif", peso: 'bold', maiuscolo: true, spaziatura: 0.08,
    colore: '#f2e6e6', ombre: [['rgba(0, 0, 0, 0.9)', 12], ['#000', 2]]
  }
};

// radial-gradient(ellipse at bottom/center): l'ellisse ha le proporzioni del lato più lontano e passa per l'angolo più lontano
function sfondo(ctx, [centro, colori]) {
  const cy = centro === 'basso' ? ALTEZZA : ALTEZZA / 2;
  const rx = Math.SQRT2 * LARGHEZZA / 2;
  const ry = Math.SQRT2 * Math.max(cy, ALTEZZA - cy);
  ctx.save();
  ctx.translate(LARGHEZZA / 2, cy);
  ctx.scale(rx / ry, 1);
  const gradiente = ctx.createRadialGradient(0, 0, 0, 0, 0, ry);
  for (const [punto, colore] of colori) gradiente.addColorStop(punto, colore);
  ctx.fillStyle = gradiente;
  ctx.fillRect(-LARGHEZZA * ry / rx, -cy, 2 * LARGHEZZA * ry / rx, ALTEZZA);
  ctx.restore();
}

function aCapo(ctx, testo, larghezza) {
  const righe = [];
  let riga = '';
  for (const parola of testo.split(/\s+/)) {
    const prova = riga ? `${riga} ${parola}` : parola;
    if (riga && ctx.measureText(prova).width > larghezza) {
      righe.push(riga);
      riga = parola;
    } else {
      riga = prova;
    }
  }
  if (riga) righe.push(riga);
  return righe;
}

function disegna(testo, tipo) {
  const stile = STILI[tipo];
  const canvas = document.createElement('canvas');
  canvas.width = LARGHEZZA;
  canvas.height = ALTEZZA;
  const ctx = canvas.getContext('2d');
  sfondo(ctx, SFONDI[tipo]);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (stile.maiuscolo) testo = testo.toUpperCase();

  // Frase più grande possibile senza superare metà altezza
  let corpo = 68;
  let righe;
  do {
    ctx.font = `${stile.peso ?? 'normal'} ${corpo}px ${stile.font}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${(stile.spaziatura ?? 0) * corpo}px`;
    righe = aCapo(ctx, testo, LARGHEZZA * 0.76);
    corpo -= 2;
  } while (righe.length * corpo * 1.35 > ALTEZZA * 0.5 && corpo > 36);
  corpo += 2;
  const interlinea = corpo * 1.35;
  const primaRiga = (ALTEZZA - 60) / 2 - ((righe.length - 1) * interlinea) / 2;

  // Una passata per ombra (canvas ne ha una sola alla volta), poi il testo pulito sopra
  ctx.fillStyle = stile.colore;
  for (const [colore, sfocatura] of [...stile.ombre, [null, 0]]) {
    ctx.shadowColor = colore ?? 'transparent';
    ctx.shadowBlur = sfocatura * 2.5;
    righe.forEach((riga, i) => ctx.fillText(riga, LARGHEZZA / 2, primaRiga + i * interlinea));
  }

  ctx.shadowColor = 'transparent';
  ctx.globalAlpha = 0.55;
  ctx.font = `30px Georgia, serif`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  ctx.fillStyle = tipo === 'agitazione' ? '#f2e6e6' : 'white';
  ctx.fillText(INDIRIZZO, LARGHEZZA / 2, ALTEZZA - 60);

  return new Promise((risolvi) => canvas.toBlob(risolvi, 'image/png'));
}

// `stagione`: id della stagione; con l'agitazione vince lo stile da propaganda
export async function condividi({ testo, data, stagione, agitazione }) {
  const tipo = agitazione ? 'agitazione' : (STILI[stagione] ? stagione : 'ordinaria');
  const nome = `pills-${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}.png`;
  const immagine = new File([await disegna(testo, tipo)], nome, { type: 'image/png' });

  if (navigator.canShare?.({ files: [immagine] })) {
    try {
      await navigator.share({ files: [immagine], text: testo });
      return;
    } catch (errore) {
      if (errore.name === 'AbortError') return; // annullata da chi condivide
    }
  }
  const link = document.createElement('a');
  link.href = URL.createObjectURL(immagine);
  link.download = nome;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 10000);
}

// Per le verifiche: solo l'immagine
export const disegnaImmagine = disegna;
