# Pills

Una "pillola" (frase) al giorno, uguale per tutti, con effetti stagionali. Vue 3 + Vite, nessun backend.
Pubblicato su https://taffa-dev.github.io/Pills/ (repo `taffa-dev/Pills`, ramo `master`).
Il README resta volutamente scarno e misterioso: la documentazione tecnica sta qui.

## Struttura
- `src/stagioni.js` — stagione attiva, numero del giorno (hash della data), scelta della pillola. Una nuova stagione = una voce in `STAGIONI`. L'hash del giorno non va cambiato: cambierebbe la pillola di oggi per tutti.
- `src/pills/` — un file per stagione, ciascuno esporta `pillole` e `pilloleMalvagie`. In `generali.js` le due liste sono parallele (stesso indice = stessa frase rovesciata): mantenerle della stessa lunghezza. Natale e Halloween hanno liste malvagie più corte, scelte con lo stesso numero del giorno.
- `src/components/` — `Pillola` (testo), `SirenaButton`, `StatoAgitazione` (luce rossa + motto "Lui vi osserva"), effetti stagionali `Waves`, `Snow`, `Pipistrelli`, `Zucca`.
- `src/riavvolgi.js` — inverte le animazioni CSS senza salti (Web Animations API: `playbackRate` negativo con rampa, `currentTime` portato avanti di molti cicli perché non si fermino all'inizio). Usato da neve e pipistrelli in agitazione.

| Stagione  | Periodo                              | Effetti                                  |
|-----------|--------------------------------------|------------------------------------------|
| Estate    | 1 - 31 agosto                        | Onde                                     |
| Halloween | settimana (lun-dom) che contiene il 31/10 | Volto di zucca dietro lo sfondo (più alto in verticale, sfocatura proporzionale; fiamma SMIL che ondeggia, alone che segue il mouse), pipistrelli SVG (misura in `vmin`; ali interpolate con CSS `d`, fotogrammi come ripiego per Safari), testo color candela |
| Natale    | 8 dicembre - 6 gennaio               | Neve                                     |

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
- Progetto gemello di Calendario (`../Calendario`): le icone in alto hanno le stesse misure (`top: 0.5rem`, `padding: 0.35rem`, `font-size: 1rem`, icone `1em`). Se cambiano qui, vanno cambiate anche là. I link tra i due si aprono nella stessa pagina.
- Livelli z-index: onde 1 · zucca 5 · luce sirena 20 · neve/pipistrelli 30 · testi 100 · pulsanti 200.
- Le decorazioni non devono intercettare i tocchi (`pointer-events: none`) né usare risorse esterne (niente hotlink).
- Effetti hover e tooltip solo dentro `@media (hover: hover) and (pointer: fine)`: sui touch screen `:hover` resta attivo dopo il tocco.
- Un elemento dentro una `<Transition>` non deve avere animazioni infinite sulla radice: Vue ne aspetterebbe la durata (bug già incontrato due volte). Metterle su un figlio/pseudo-elemento, oppure `type="transition"` e animare solo proprietà diverse da `opacity`.
- Le classi di stile della frase stanno sulla frase (non sul contenitore), così quella in uscita sfuma senza cambiare aspetto.
- Le variabili CSS non registrate non si animano: transizioni sui valori finali (`stop-color`, `fill`...).
- Le animazioni SMIL non si fermano da CSS: per `prefers-reduced-motion` usare `svg.pauseAnimations()`.
- Rispettare `prefers-reduced-motion` in ogni effetto.

## Sviluppo e verifica
- `npm run dev`, poi `?data=AAAA-MM-GG` per simulare un giorno (solo in sviluppo, escluso dalla build). Halloween: `?data=2026-10-28`. Il pulsantino bianco in basso è il Vue DevTools, solo in dev.
- L'utente spesso ha già un `npm run dev` aperto sulla 5173: non chiuderlo; usare un'altra porta.
- Screenshot/verifiche: `playwright-core` installato in una cartella temporanea (mai nel progetto) con `executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'`; `page.clock.setFixedTime` o `?data=` per le date. L'utente gradisce anteprime aperte a schermo intero (Chrome con `--start-fullscreen` e un `--user-data-dir` dedicato, altrimenti il Chrome già aperto ignora il flag).
- Prova da telefono in LAN: il firewall di Windows blocca le porte in ingresso e non ci sono permessi di amministratore. La porta **3000** è già aperta (regola di Library Project): `npx vite --host --port 3000`, poi `http://192.168.188.20:3000/Pills/?data=...` (IP del PC in rete locale, verificarlo).

## Git e deploy
- `npm run deploy` — build e pubblicazione su GitHub Pages (`gh-pages -d dist`). Pubblicare anche `master` con `git push`.
- Git non ha un'identità configurata su questa macchina: firmare con `GIT_AUTHOR_NAME/EMAIL` e `GIT_COMMITTER_NAME/EMAIL` = `Claude` / `noreply@anthropic.com` (stessa convenzione dei commit precedenti), senza toccare la config globale.
- `git fetch`/`push` a volte si bloccano: usare `GIT_TERMINAL_PROMPT=0` e `timeout`.
- Messaggi di commit in italiano. Commit e deploy solo quando l'utente lo chiede.
