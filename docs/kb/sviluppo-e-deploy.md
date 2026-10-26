# Sviluppo, verifica, Git e deploy

Scopo: come far girare e verificare il sito, e come viene pubblicato.
Leggere quando: avvii il sito in locale, fai screenshot o prove da telefono, committi o pubblichi.
Ultimo aggiornamento: 22/10/2026 (spostato da CLAUDE.md senza modifiche al contenuto)

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

## GitHub Actions: crediti finiti (21/10/2026)
- I crediti Actions dell'account sono finiti e l'utente **non vuole spendere nulla**: i job dei repo privati si fermano in ~3 s ("recent account payments have failed or your spending limit needs to be increased"). Questo repo è pubblico, quindi i minuti sono gratuiti e `pubblica.yml` potrebbe funzionare, **ma non è verificato**: controllare l'esito della Action dopo un push. Se non gira, pubblicare dal PC (`npm run deploy`, come in emergenza).
