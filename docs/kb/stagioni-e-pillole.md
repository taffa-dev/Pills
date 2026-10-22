# Stagioni, pillole e programma

Scopo: struttura del codice delle pillole, stagioni ed effetti, programma a mazzo a giri.
Leggere quando: tocchi `src/stagioni.js`, `src/pills/`, `src/mazzo.js`, `src/programma.json`, `scripts/programma.mjs`, `src/condividi.js`, i componenti o aggiungi una stagione o una pillola.
Ultimo aggiornamento: 22/10/2026 (spostato da CLAUDE.md senza modifiche al contenuto)

## Struttura
- `src/stagioni.js` — stagione attiva, numero del giorno (hash della data: decide fiocchi e pipistrelli e le pillole dei giorni prima del programma; non va cambiato), scelta della pillola dal programma. Una nuova stagione = una voce in `STAGIONI`.
- `src/pills/` — un file per stagione, ciascuno esporta `pillole` e `pilloleMalvagie`. **Tutte** le liste sono parallele (stesso indice = stessa frase rovesciata): la malvagia ricorda sempre la sua pillola. Mantenerle della stessa lunghezza; una pillola nuova va aggiunta insieme alla sua malvagia. Le malvagie sono la versione multinazionale/1984 della pillola (a Halloween anche più macabre).
  Le generali vengono dai testi veri dell'azienda dell'utente: il centalogo (100 punti, 1992, rivisto nel 2020; il punto 100 è la prima pillola) e i manifesti 1992-1998. Pari pari quando il testo è già un motto, altrimenti ridotte alla frase centrale; resta il «Tu» maiuscolo dell'originale. Le 99 pillole generate da un'AI sono state tolte su richiesta: non rimetterne di inventate. Nel codice non compare il nome dell'azienda.
- `src/mazzo.js` — mazzo a giri, **identico in Calendario**: se cambia in uno va copiato nell'altro.
- `src/programma.json` + `scripts/programma.mjs` — programma delle pillole (sotto).
- `src/components/` — `Pillola` (testo), `SirenaButton`, `StatoAgitazione` (luce rossa + motto "Lui vi osserva"), effetti stagionali `Waves`, `Snow`, `Pipistrelli`, `Zucca`, `Petali`.
- `src/condividi.js` — pulsante "Condividi" in alto a sinistra (come nel Calendario): immagine 1080×1350 della pillola che si sta guardando, con sfondo e stile del testo della stagione (in agitazione la malvagia, rossa e da propaganda); menu di condivisione del sistema o, dove manca, download. Sfondi e stili sono copiati da `App.vue`/`Pillola.vue`: se cambiano là, vanno cambiati qui.
- `src/riavvolgi.js` — inverte le animazioni CSS senza salti (Web Animations API: `playbackRate` negativo con rampa, `currentTime` portato avanti di molti cicli perché non si fermino all'inizio). Usato da neve e pipistrelli in agitazione.

| Stagione  | Periodo                              | Effetti                                  |
|-----------|--------------------------------------|------------------------------------------|
| Estate    | 1 - 31 agosto                        | Onde                                     |
| Halloween | settimana (lun-dom) che contiene il 31/10 | Volto di zucca dietro lo sfondo (più alto in verticale, sfocatura proporzionale; fiamma SMIL che ondeggia, alone che segue il mouse), pipistrelli SVG (misura in `vmin`; ali interpolate con CSS `d`, fotogrammi come ripiego per Safari), testo color candela |
| Pasqua    | dal lunedì santo al lunedì dell'Angelo | Tramonto rosato, petali di ciliegio (pochi grandi e sfocati davanti alla frase, "vicini alla telecamera"); in agitazione rosso sangue e risalgono. Pillole generali. L'utente ha scartato i rami di ciliegio disegnati |
| Natale    | 8 dicembre - 6 gennaio               | Neve                                     |

## Programma delle pillole
- Ogni lista (generali, Natale, Halloween) è un **mazzo a giri**: ogni pillola esce una volta per giro, in ordine casuale ma uguale per tutti, e nessuna torna prima che siano uscite tutte le altre; a cavallo tra due giri le ultime N/3 non tornano subito. Il mazzo di una lista avanza solo nei giorni in cui la lista è in uso (Natale da un anno all'altro, ecc.). La malvagia è quella con lo stesso indice.
- `src/programma.json` (`{ "AAAA-MM-GG": chiave della pillola }`, chiave = hash del testo) è la memoria: i giorni passati che servono ai mazzi e 60 giorni avanti. Lo aggiorna **solo** `npm run programma` (in pratica la GitHub Action): passato e oggi non si toccano, il futuro si ricalcola con le liste attuali, quindi le pillole nuove entrano nel giro in corso. Correggere un refuso cambia la chiave: la pillola conta come nuova.
- Oltre la fine del programma il sito prosegue con lo stesso mazzo (stesso risultato per tutti, anche se la Action si ferma); prima dell'inizio usa il vecchio sistema (`numero del giorno % lunghezza`). Programma vuoto: il primo giorno è quello del vecchio sistema, così alla prima pubblicazione nessuno vede cambiare la pillola.
- `npm test` verifica: primo giorno = vecchio sistema, sito e generatore danno le stesse pillole, nessuna ripetizione nel giro, malvagia sempre parallela.

