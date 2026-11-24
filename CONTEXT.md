# Glossario di Pills

Termini del dominio, usati nel codice e nella KB. Dettagli e file: `docs/kb/stagioni-e-pillole.md`.

- **Pillola**: la frase del giorno, uguale per tutti.
- **Pillola malvagia**: la stessa pillola rovesciata (versione multinazionale/1984); stesso indice nella lista parallela, visibile in agitazione.
- **Agitazione**: stato in cui il sito cambia aspetto (luce rossa, motto "Lui vi osserva", effetti invertiti); ogni effetto stagionale ne ha una variante.
- **Stagione**: periodo con tema ed effetti propri (Estate, Halloween, Pasqua, Natale); una voce in `STAGIONI`.
- **Centalogo**: i 100 punti (1992, rivisti nel 2020) da cui vengono le pillole generali.
- **Mazzo a giri**: ordine in cui escono le pillole; ognuna una volta per giro, casuale ma uguale per tutti.
- **Programma**: `src/programma.json`, memoria dei giorni passati e dei 60 giorni avanti; lo scrive solo `npm run programma`.
- **Numero del giorno**: hash della data; decide fiocchi, pipistrelli e le pillole dei giorni prima del programma. Non si cambia.
- **Calendario**: progetto gemello, con codice e temi stagionali condivisi.
