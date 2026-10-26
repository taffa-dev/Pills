# CLAUDE.md

Indice per agenti. Dettagli non ovvi per tema: [docs/kb/INDICE.md](docs/kb/INDICE.md) (leggere solo il file del tema). Roadmap e cose da fare: [ROADMAP.md](ROADMAP.md). Sviluppo e deploy: [docs/kb/sviluppo-e-deploy.md](docs/kb/sviluppo-e-deploy.md).

Pills: una "pillola" (frase) al giorno, uguale per tutti, con effetti stagionali. Vue 3 + Vite, nessun backend.
Pubblicato su https://taffa-dev.github.io/Pills/ (repo `taffa-dev/Pills`, ramo `master`). Il README resta volutamente scarno e misterioso: la documentazione tecnica sta qui e nella KB. Lingua del progetto: italiano.

## Regole sempre valide

- **Le liste di pillole sono parallele** (stesso indice = stessa frase rovesciata): una pillola nuova va aggiunta insieme alla sua malvagia, stessa lunghezza. Non inventare pillole generali. Dettagli: [stagioni-e-pillole.md](docs/kb/stagioni-e-pillole.md).
- **Il numero del giorno (hash della data) non va cambiato**; `src/programma.json` lo aggiorna solo `npm run programma`. Dettagli: [stagioni-e-pillole.md](docs/kb/stagioni-e-pillole.md).
- **`src/mazzo.js`, `Icona.vue` e `src/volo.js` sono identici in Calendario** (progetto gemello): se cambiano qui, vanno cambiati anche là. Dettagli: [grafica-e-effetti.md](docs/kb/grafica-e-effetti.md).
- **I temi stagionali di Pills e Calendario restano sempre sincronizzati** (decisione dell'utente, 26/10/2026): stessi periodi, stessi colori e stessi effetti; ogni modifica a una stagione (date, tavolozza, animazioni) va fatta in entrambi i progetti (`../Calendario`). Dettagli: [grafica-e-effetti.md](docs/kb/grafica-e-effetti.md).
- **Ogni effetto stagionale ha la variante per l'agitazione e rispetta `prefers-reduced-motion`**; decorazioni con `pointer-events: none`, niente risorse esterne. Dettagli: [grafica-e-effetti.md](docs/kb/grafica-e-effetti.md).
- **Niente app installabile né service worker che salva copie.** Dettagli: [grafica-e-effetti.md](docs/kb/grafica-e-effetti.md).
- **Scelte già fatte dall'utente: non rimetterle in discussione** (zucca, pipistrelli, colori di Halloween...): [decisioni.md](docs/kb/decisioni.md).
- **Non chiudere un `npm run dev` già aperto dall'utente** (porta 5173): usa un'altra porta. Dettagli: [sviluppo-e-deploy.md](docs/kb/sviluppo-e-deploy.md).
- **Git**: dopo un push fare `git pull` (la Action aggiunge un commit); commit in italiano; commit e deploy solo quando l'utente lo chiede. Dettagli: [sviluppo-e-deploy.md](docs/kb/sviluppo-e-deploy.md).

## Come lavorare con la KB (deciso dall'utente, 22/10/2026)

1. **Prima** di lavorare su un tema: leggi SOLO il suo file KB (scegli dall'INDICE).
2. **Alla fine di ogni sviluppo** aggiorna da solo, **senza chiedere permesso**: il file KB del tema (cose non ovvie, avvertenze, numeri di tenuta con data); `docs/kb/decisioni.md` se c'è una decisione dell'utente; `ROADMAP.md` (voci chiuse, cose nuove).
3. **Ogni cosa da sistemare o fare trovata lavorando, o detta dall'utente "da fare dopo", va subito in `ROADMAP.md`**, senza chiedere (procedura: `docs/kb/PROTOCOLLO.md`).
4. I sub-agent riportano le cose imparate nel rapporto; le scrive chi li ha lanciati.
5. Chiudi il messaggio finale con una riga: `KB: file toccati …`.

## Ruoli dei modelli (regola dell'utente, 12/10/2026)

Ricerca, analisi, specifiche e revisione con **Opus**; codice con **Sonnet via sub-agent**, a cui si passa una specifica completa (regole sopra + file KB del tema). Una richiesta di analisi o di roadmap non è una richiesta di codice. La regola sta anche nel CLAUDE.md globale dell'utente, ma le sessioni cloud non lo caricano: per questo è ripetuta qui.

## Indice breve (versione completa: docs/kb/INDICE.md)

- `stagioni-e-pillole.md`: struttura del codice, stagioni, liste di pillole, mazzo a giri, programma
- `grafica-e-effetti.md`: stato d'agitazione, vincoli tecnici (z-index, animazioni, icone, niente app installabile)
- `sviluppo-e-deploy.md`: dev, verifica con screenshot, prova da telefono, GitHub Action, git
- `decisioni.md`: decisioni dell'utente per data, con motivo
- `PROTOCOLLO.md`: come si aggiorna e si pota la KB

## Manutenzione di questo file

CLAUDE.md resta < 6 KB (`wc -c CLAUDE.md`): i dettagli vanno nella KB. Ogni file KB < ~25 KB (se cresce, dividilo e aggiorna INDICE). Un fatto sta in UN solo file, gli altri lo linkano. Data (gg/mm/aaaa) su ogni decisione e su ogni numero di tenuta. Una voce falsa si corregge o si cancella, non si lascia.
