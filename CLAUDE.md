# Pills

Una "pillola" (frase) al giorno, uguale per tutti, con effetti stagionali. Vue 3 + Vite, nessun backend.
Pubblicato su https://taffa-dev.github.io/Pills/ (repo `taffa-dev/Pills`, ramo `master`).
Il README resta volutamente scarno e misterioso: la documentazione tecnica sta qui.

## Struttura
- `src/stagioni.js` — stagione attiva, numero del giorno (hash della data: decide fiocchi e pipistrelli e le pillole dei giorni prima del programma; non va cambiato), scelta della pillola dal programma. Una nuova stagione = una voce in `STAGIONI`.
- `src/pills/` — un file per stagione, ciascuno esporta `pillole` e `pilloleMalvagie`. **Tutte** le liste sono parallele (stesso indice = stessa frase rovesciata): la malvagia ricorda sempre la sua pillola. Mantenerle della stessa lunghezza; una pillola nuova va aggiunta insieme alla sua malvagia. Le malvagie sono la versione multinazionale/1984 della pillola (a Halloween anche più macabre).
- `src/mazzo.js` — mazzo a giri, **identico in Calendario**: se cambia in uno va copiato nell'altro.
- `src/programma.json` + `scripts/programma.mjs` — programma delle pillole (sotto).
- `src/components/` — `Pillola` (testo), `SirenaButton`, `StatoAgitazione` (luce rossa + motto "Lui vi osserva"), effetti stagionali `Waves`, `Snow`, `Pipistrelli`, `Zucca`, `Petali`.
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

## Stato d'agitazione
Pulsante sirena in alto al centro: sfondo rosso pulsante e pillole malvagie in stile propaganda (1984, multinazionale che sfrutta i dipendenti).
Ogni effetto stagionale deve avere la sua variante per l'agitazione (prop `agitazione`): onde rosse, neve che diventa cenere e risale, zucca rossa e nitida con occhi cattivi, pipistrelli rossi che volano all'indietro.

## Scelte già fatte dall'utente (non rimetterle in discussione)
- Halloween: sfondo marrone-arancio originale. Una scena "notte viola con luna, nebbia, ragno, fulmini" è stata provata e **scartata**.
- Zucca: volto grande (occhi, naso, bocca dentata) come luce dietro un telo, sfocata e tenue; in agitazione rossa, nitida, con occhi "cattivi". Niente pupille.
- Pipistrelli: SVG (preferiti alla vecchia GIF di Giphy, rimossa).
- Testo di Halloween bianco caldo/giallo chiaro con tremolio a candela (l'arancione si confondeva con la zucca).
- Si può proporre di meglio (anche da spunti online), ma restando nell'idea esistente.

## Vincoli tecnici
- Progetto gemello di Calendario (`../Calendario`): il link al Calendario in alto a destra sta dove nel Calendario c'è l'icona a quattro quadratini che apre le altre azioni; le icone in alto hanno le stesse misure (`top: calc(0.5rem + env(safe-area-inset-top))`, `padding: 0.35rem`, `font-size: 1rem`, icone `1em`). Se cambiano qui, vanno cambiate anche là. I link tra i due si aprono nella stessa pagina.
- **Niente app installabile** (scelta dell'utente: aprire il Calendario da Pills o viceversa apriva il browser interno dell'app). Niente manifest; `public/sw.js` resta solo per chi l'aveva installata: cancella le copie salvate e si disattiva; `main.js` disattiva i service worker rimasti. Non rimettere un service worker che salva copie. `viewport-fit=cover`: sfondo su `html`/`body` e `env(safe-area-inset-*)` per ogni elemento fisso ai bordi. `theme-color` segue lo sfondo (notte, Halloween, agitazione) da `App.vue`.
- Livelli z-index: onde 1 · zucca 5 · luce sirena 20 · neve/pipistrelli/petali 30 · testi 100 · petali vicini 110 · pulsanti 200.
- Le decorazioni non devono intercettare i tocchi (`pointer-events: none`) né usare risorse esterne (niente hotlink).
- Effetti hover e tooltip solo dentro `@media (hover: hover) and (pointer: fine)`: sui touch screen `:hover` resta attivo dopo il tocco.
- Un elemento dentro una `<Transition>` non deve avere animazioni infinite sulla radice: Vue ne aspetterebbe la durata (bug già incontrato due volte). Metterle su un figlio/pseudo-elemento, oppure `type="transition"` e animare solo proprietà diverse da `opacity`.
- Le classi di stile della frase stanno sulla frase (non sul contenitore), così quella in uscita sfuma senza cambiare aspetto.
- Le variabili CSS non registrate non si animano: transizioni sui valori finali (`stop-color`, `fill`...).
- Le animazioni SMIL non si fermano da CSS: per `prefers-reduced-motion` usare `svg.pauseAnimations()`.
- Rispettare `prefers-reduced-motion` in ogni effetto.

## Sviluppo e verifica
- `npm run dev`, poi `?data=AAAA-MM-GG` per simulare un giorno (solo in sviluppo, escluso dalla build). Halloween: `?data=2026-10-28`, Pasqua: `?data=2027-03-25`. Il pulsantino bianco in basso è il Vue DevTools, solo in dev.
- L'utente spesso ha già un `npm run dev` aperto sulla 5173: non chiuderlo; usare un'altra porta.
- Screenshot/verifiche: `playwright-core` installato in una cartella temporanea (mai nel progetto) con `executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'`; `page.clock.setFixedTime` o `?data=` per le date. L'utente gradisce anteprime aperte a schermo intero (Chrome con `--start-fullscreen` e un `--user-data-dir` dedicato, altrimenti il Chrome già aperto ignora il flag).
- Prova da telefono in LAN: il firewall di Windows blocca le porte in ingresso e non ci sono permessi di amministratore. La porta **3000** è già aperta (regola di Library Project): `npx vite --host --port 3000`, poi `http://192.168.188.20:3000/Pills/?data=...` (IP del PC in rete locale, verificarlo).

## Git e deploy
- La pubblicazione la fa la GitHub Action `.github/workflows/pubblica.yml` a ogni push su `master`, ogni lunedì notte e a mano: test, `npm run programma` (con `TZ=Europe/Rome`), commit di `src/programma.json` se cambia, build, ramo `gh-pages`. Dopo un push quindi fare `git pull` prima di lavorare: la Action aggiunge il suo commit.
- `npm run deploy` (`gh-pages -d dist` dal PC) resta come emergenza; usa il programma così com'è nel repo.
- Git non ha un'identità configurata su questa macchina: firmare con `GIT_AUTHOR_NAME/EMAIL` e `GIT_COMMITTER_NAME/EMAIL` = `Claude` / `noreply@anthropic.com` (stessa convenzione dei commit precedenti), senza toccare la config globale.
- `git fetch`/`push` a volte si bloccano: usare `GIT_TERMINAL_PROMPT=0` e `timeout`.
- Messaggi di commit in italiano. Commit e deploy solo quando l'utente lo chiede.
