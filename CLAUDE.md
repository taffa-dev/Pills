# Pills

Una "pillola" (frase) al giorno, uguale per tutti, con effetti stagionali. Vue 3 + Vite, nessun backend.
Il README resta volutamente scarno e misterioso: la documentazione tecnica sta qui.

## Struttura
- `src/stagioni.js` — stagione attiva, numero del giorno (hash della data), scelta della pillola. Una nuova stagione = una voce in `STAGIONI`.
- `src/pills/` — un file per stagione, ciascuno esporta `pillole` e `pilloleMalvagie`. In `generali.js` le due liste sono parallele (stesso indice = stessa frase rovesciata): mantenerle della stessa lunghezza.
- `src/components/` — `Pillola` (testo), `SirenaButton`, `StatoAgitazione` (luce rossa + motto), effetti stagionali `Waves`, `Snow`, `Pipistrelli`, `Zucca`.
- `src/riavvolgi.js` — inverte le animazioni CSS senza salti (Web Animations API): usato da neve e pipistrelli in agitazione.

| Stagione  | Periodo                              | Effetti                                  |
|-----------|--------------------------------------|------------------------------------------|
| Estate    | 1 - 31 agosto                        | Onde                                     |
| Halloween | settimana (lun-dom) che contiene il 31/10 | Volto di zucca dietro lo sfondo (più alto in verticale, sfocatura proporzionale; fiamma SMIL che ondeggia, alone che segue il mouse), pipistrelli SVG (misura in `vmin`; ali interpolate con CSS `d`, fotogrammi come ripiego per Safari) |
| Natale    | 8 dicembre - 6 gennaio               | Neve                                     |

## Stato d'agitazione
Pulsante sirena in alto al centro: sfondo rosso pulsante e pillole malvagie in stile propaganda (1984).
Ogni effetto stagionale deve avere la sua variante per l'agitazione (prop `agitazione`): onde rosse, neve che diventa cenere e risale, zucca rossa e nitida con occhi cattivi, pipistrelli rossi che volano all'indietro.

## Vincoli
- Progetto gemello di Calendario (`../Calendario`): le icone in alto hanno le stesse misure (`top: 0.5rem`, `padding: 0.35rem`, `font-size: 1rem`, icone `1em`). Se cambiano qui, vanno cambiate anche là.
- Livelli z-index: onde 1 · zucca 5 · luce sirena 20 · neve/pipistrelli 30 · testi 100 · pulsanti 200.
- Le decorazioni non devono intercettare i tocchi (`pointer-events: none`) né usare risorse esterne.
- Effetti hover solo dentro `@media (hover: hover) and (pointer: fine)`: sui touch screen `:hover` resta attivo dopo il tocco.
- Un elemento dentro una `<Transition>` non deve avere animazioni infinite sulla radice: Vue ne aspetterebbe la durata. Metterle su un figlio o su uno pseudo-elemento.
- Rispettare `prefers-reduced-motion`.

## Sviluppo
- `npm run dev`, poi `?data=AAAA-MM-GG` per simulare un giorno (solo in sviluppo, escluso dalla build).
- `npm run deploy` — build e pubblicazione su GitHub Pages (`gh-pages -d dist`).
- Su questa macchina git non ha un'identità configurata: i commit finora sono firmati `Claude <noreply@anthropic.com>` tramite variabili `GIT_AUTHOR_*`/`GIT_COMMITTER_*`.
