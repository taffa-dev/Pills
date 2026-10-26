# Grafica ed effetti: agitazione e vincoli tecnici

Scopo: stato d'agitazione e vincoli tecnici di CSS, animazioni, z-index, icone, app non installabile.
Leggere quando: aggiungi o modifichi un effetto, un'animazione, un'icona, il layout dei pulsanti o il comportamento su mobile.
Ultimo aggiornamento: 22/10/2026 (spostato da CLAUDE.md senza modifiche al contenuto)

## Stato d'agitazione
Pulsante sirena in alto al centro: sfondo rosso pulsante e pillole malvagie in stile propaganda (1984, multinazionale che sfrutta i dipendenti).
Ogni effetto stagionale deve avere la sua variante per l'agitazione (prop `agitazione`): onde rosse, neve che diventa cenere e risale, zucca rossa e nitida con occhi cattivi, pipistrelli rossi che volano all'indietro.

## Vincoli tecnici
- Progetto gemello di Calendario (`../Calendario`): il link al Calendario in alto a destra sta dove nel Calendario c'è il link a Pills (i quadratini delle altre azioni sono in alto a sinistra); le icone in alto sono identiche a quelle del Calendario: stesso `src/components/Icona.vue` (**file identico nei due progetti**: icone a contorno sottile stile Lucide, 1em × 1em, preferite dall'utente alle Font Awesome piene), stesse misure (`top: env(safe-area-inset-top)`, `padding: 0.875rem`, `font-size: 1.25rem`: icona di 20px in un'area da toccare di 48px, come da linee guida Material/Apple/WCAG) e stati (opacità 0.55 sull'`svg`, 1 con hover/focus e con la sirena accesa). Condividi sta in alto a sinistra (dove nel Calendario ci sono le azioni), la sirena al centro. Se cambiano qui, vanno cambiate anche là. I link tra i due si aprono nella stessa pagina.
- **Niente app installabile** (scelta dell'utente: aprire il Calendario da Pills o viceversa apriva il browser interno dell'app). Niente manifest; `public/sw.js` resta solo per chi l'aveva installata: cancella le copie salvate e si disattiva; `main.js` disattiva i service worker rimasti. Non rimettere un service worker che salva copie. `viewport-fit=cover`: sfondo su `html`/`body` e `env(safe-area-inset-*)` per ogni elemento fisso ai bordi. `theme-color` segue lo sfondo (notte, Halloween, agitazione) da `App.vue`.
- Entrata alla prima comparsa (`App.vue` + `Pillola.vue`): un velo `#090a0f` (z-index 99) svanisce in 0,9s sopra sfondo ed effetti, la frase sale di 10px mettendosi a fuoco (`appear` della Transition, come l'entrata del Calendario), le icone affiorano per ultime; dopo 1,4s la classe `entrata` e il velo spariscono, così non riparte con la sirena. Non animare mai `opacity`/`transform`/`filter` su `.container` o sui contenitori degli effetti: creano uno stacking context (petali vicini a 110 sopra la frase) e i figli `fixed` si ancorerebbero al genitore. Con `prefers-reduced-motion` solo dissolvenza. Pills non ha font web (Georgia e Arial Narrow di sistema): niente lampo di font.
- Livelli z-index: onde 1 · zucca 5 · luce sirena 20 · neve/pipistrelli/petali 30 · testi 100 · petali vicini 110 · pulsanti 200.
- Le decorazioni non devono intercettare i tocchi (`pointer-events: none`) né usare risorse esterne (niente hotlink).
- Effetti hover e tooltip solo dentro `@media (hover: hover) and (pointer: fine)`: sui touch screen `:hover` resta attivo dopo il tocco.
- Un elemento dentro una `<Transition>` non deve avere animazioni infinite sulla radice: Vue ne aspetterebbe la durata (bug già incontrato due volte). Metterle su un figlio/pseudo-elemento, oppure `type="transition"` e animare solo proprietà diverse da `opacity`.
- Le classi di stile della frase stanno sulla frase (non sul contenitore), così quella in uscita sfuma senza cambiare aspetto.
- Le variabili CSS non registrate non si animano: transizioni sui valori finali (`stop-color`, `fill`...).
- Le animazioni SMIL non si fermano da CSS: per `prefers-reduced-motion` usare `svg.pauseAnimations()`.
- Rispettare `prefers-reduced-motion` in ogni effetto.

## Sincronia con Calendario (decisione dell'utente, 26/10/2026)
I temi stagionali (Natale, Halloween, Pasqua, Estate) sono gli stessi in Calendario: stessi periodi, colori ed effetti. Cambiando una stagione qui, cambiarla anche in `../Calendario` (e viceversa).

## Pipistrelli: nuovo motore di volo (26/10/2026, portato dal Calendario)
- `Pipistrelli.vue` è solo contenitore più taratura; il volo sta in `src/volo.js`, IDENTICO in Calendario (come `mazzo.js` e `Icona.vue`): ogni modifica va copiata nell'altro progetto, e i due `test/volo.test.mjs` restano identici. Provini approvati: `../Calendario/recupero-stagioni/pipistrelli-pills.html`.
- `bats` è la popolazione costante (rimpiazzo quando uno esce); ognuno ha una fascia di 14vh tra 4 e 84vh. In Pills scala 0,5-1,5, vita 14-30 s (da `config.taratura`).
- L'agitazione chiama `setIndietro`: il motore ha il suo verso del tempo (da +1 a -1 in 0,8 s) e non usa `riavvolgi.js` (che serve ancora a `Petali.vue` e `Snow.vue`). Rosso, drop-shadow e occhi accesi sono in `:deep()`.
- Con `prefers-reduced-motion` i pipistrelli restano fermi dove sono. z-index 30, sotto la pillola (100).
- Se all'utente sembrassero piccoli: ritoccare la larghezza base in `Pipistrelli.vue` (oggi `47 * (.6 + .001 * min(W, H))`, stessa media del vecchio).
