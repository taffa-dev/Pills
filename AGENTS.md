# Istruzioni per gli agenti del progetto Pills

Pills: una "pillola" (frase) al giorno, uguale per tutti, con effetti stagionali. Vue 3 + Vite, nessun backend. Pubblicato su https://taffa-dev.github.io/Pills/ (repo `taffa-dev/Pills`, ramo `master`). Il README resta volutamente scarno e misterioso: la documentazione tecnica sta qui e nella KB. Lingua del progetto: italiano.

Cose da fare: `ROADMAP.md`. Glossario: `CONTEXT.md`. Indice della conoscenza: `docs/kb/INDICE.md`. Decisioni dell'utente con data: `docs/kb/decisioni.md`. Sviluppo e deploy: `docs/kb/sviluppo-e-deploy.md`.

## Regole sempre valide

- **Le liste di pillole sono parallele** (stesso indice = stessa frase rovesciata): una pillola nuova va aggiunta insieme alla sua malvagia, stessa lunghezza. Non inventare pillole generali. Dettagli: `stagioni-e-pillole.md`.
- **Il numero del giorno (hash della data) non va cambiato**; `src/programma.json` lo aggiorna solo `npm run programma`.
- **`src/mazzo.js`, `Icona.vue` e `src/volo.js` sono identici in Calendario** (progetto gemello): se cambiano qui, vanno cambiati anche là.
- **I temi stagionali di Pills e Calendario restano sincronizzati** (decisione del 26/10/2026): stessi periodi, colori ed effetti; ogni modifica a una stagione va fatta in entrambi i progetti (`..\Calendario`). Dettagli: `grafica-e-effetti.md`.
- **Ogni effetto stagionale ha la variante per l'agitazione e rispetta `prefers-reduced-motion`**; decorazioni con `pointer-events: none`, niente risorse esterne.
- **Niente app installabile né service worker che salva copie.**
- **Scelte già fatte dall'utente: non rimetterle in discussione** (zucca, pipistrelli, colori di Halloween...): `decisioni.md`.
- **Non chiudere un `npm run dev` già aperto dall'utente** (porta 5173): usa un'altra porta.
- **Git**: dopo un push fai `git pull` (la Action aggiunge un commit); commit in italiano; commit e deploy solo quando l'utente lo chiede.

## Come lavorare con la conoscenza del progetto

- Prima di lavorare su un tema leggi SOLO il suo file da `docs/kb/INDICE.md`.
- Ogni cosa da fare trovata lavorando, o detta dall'utente "da fare dopo", va in `ROADMAP.md`.
- Le decisioni dell'utente vanno in `docs/kb/decisioni.md` con data e motivo.
- Procedura di fine lavoro: `docs/kb/PROTOCOLLO.md`.
