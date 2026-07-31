# Otvoreni nalazi — Katalonski

> Živi spisak nepopravljenog. Svaki nalaz nosi datum kad je **prvi put viđen**.
> Popravljeno se briše odavde (ostaje u izveštaju audita tog dana).
> Nalaz otvoren duže od 3 audita posebno se ističe.

Poslednje ažuriranje: **31.07.2026.** (treća dopuna)

## Kritično

*Nema otvorenih kritičnih nalaza.*

## Visoko

*Nema otvorenih nalaza visoke ozbiljnosti.*

## Srednje

| # | Nalaz | Prvi put viđen | Audita otvoren |
|---|---|---|---|
| S4 | Pločica za razmak u `copy-word` je prazno dugme bez znaka | 30.07.2026. | 1 |
| S5 | Nema nijednog bezbednosnog zaglavlja na produkciji | 30.07.2026. | 1 |

## Nisko

| # | Nalaz | Prvi put viđen | Audita otvoren |
|---|---|---|---|
| N1 | `les-botigues-13` ne postoji — ID-jevi skaču 12 → 14 | 30.07.2026. | 1 |
| N2 | `CLAUDE.md` tvrdi ~226 zadataka i 18 tipova; stvarno 212 i 19. Tabela po temama pogrešna za 8 od 12 | 30.07.2026. | 1 |
| N3 | `robots.txt` vraća 404 | 30.07.2026. | 1 |

## Rupe u testu

| # | Rupa | Prvi put viđena |
|---|---|---|
| ~~T1~~ | ~~QA runner se zaglavljuje na `les-botigues` → zadaci 13–20 nikad odigrani~~ **REŠENO 31.07.** | 30.07.2026. |
| T2 | Runner proverava da je zadatak odigran, ne da je odgovor tačan po sadržaju | 30.07.2026. |
| ~~T3~~ | ~~Nema provere za: zabranjen `localStorage`, kontrast, fokus, CLS, dodirne mete, osvežavanje~~ **REŠENO 31.07.** — sve su u `e2e/predeploy.mjs`. Ostaje samo URL kao stanje (nalaz S3). | 30.07.2026. |
| ~~T4~~ | ~~Nema pre-deploy skripte sa izlaznim kodom~~ **REŠENO 31.07.** — `npm run predeploy` | 30.07.2026. |

## Čeka odluku vlasnice

*Nema otvorenih pitanja.*

~~P1 — „borrador" ili „esborrador"?~~ **ODLUČENO 31.07.2026: `esborrador`** (katalonski standard).
Preimenovano na 11 mesta u `la-classe.ts`, u oba odgovornika testova, u slikama
(`esborrador.webp` / `esborrador.png`) i u `illustrations.ts`. U
`WORKBOOK-VS-ILLUSTRATIONS.md` red „Reči iz sveske" **namerno ostaje `borrador`** —
to je zapis šta piše u svesci, a ne šta koristi aplikacija.

## Popravljeno 31.07.2026. — treća dopuna

- **S1 — vidljiv fokus tastature.** Jedno pravilo u `globals.css` za celu aplikaciju
  (`:focus-visible`), pa se ne mora dirati svaka komponenta. Poljima koja imaju
  `outline-none` fokus se vraća prstenom preko `box-shadow`.
  Izmereno: **13 od 24 bez fokusa → 0 od 23**. Vidi se samo pri kretanju tastaturom,
  pa detetu koje kucka prstom po tabletu izgled ostaje isti.
- **S2 — dodirne mete.** Ikonice dobile `min-w/min-h 44px` (8 mesta), prekidači u
  podešavanjima zadržali izgled 48×28 ali im je dodirna zona proširena pseudoelementom
  na 44 px, „Powered by" red dobio visinu 44 px. Izmereno: **najmanja 19 px → 0 premalih**.
- **S3 — zadatak u adresi.** `?tasca=4`, 1-based jer ga čita čovek, ime na katalonskom.
  Prvi upis `replaceState` (da „Nazad" sa prvog zadatka vodi na početnu), dalje `pushState`.
  Izmereno: `F5` sa zadatka 4 **ostaje na 4** (ranije vraćao na 1), „Nazad" ide
  **4 → 3 → 2 → 1** korak po korak, deljiv link `?tasca=7` otvara sedmi zadatak.
- **Kapija proširena na 9 provera**, S1/S2/S3 su u njoj kao **BLOK**. Prolazi 9/9.

## Popravljeno 31.07.2026. — druga dopuna

- **V2** — blok sa nivoom na početnoj se sada iscrtava UVEK (ranije `{levelData && …}`),
  a dok podaci ne stignu stoji `invisible`: mesto je zauzeto, a detetu se ne blesne
  pogrešan nivo. **CLS 0,167 → 0,02**, skok kartice 130 px → 0 px.
- **PRE-DEPLOY KAPIJA** — `e2e/predeploy.mjs` (`npm run predeploy`,
  `npm run predeploy:prod`). 8 provera; **BLOK** obara deploy, **UPOZORENJE** samo
  prijavljuje. Dokazano da radi: pre popravke V2 kapija je **padala** baš na toj
  proveri, posle popravke prolazi (izlazni kod 0).
  Otvoreni nalazi S1 i S2 su u njoj kao upozorenja — **kad se poprave, prebaciti ih u BLOK**.

## Popravljeno 31.07.2026. (ne vraćati se na ovo)

- **K1** — svih 9 nezaštićenih upisa u `localStorage` prebačeno na `src/lib/storage.ts`
  (`safeSetJSON` / `safeRemove`). Provera `provera-k1.mjs`: **16/16 prolazi na novom kodu**,
  a **pada na starom** (produkcija, 2 pada na početnoj) — dakle provera stvarno hvata bag.
  Naknadno nađena i dva upisa u `DrawingCanvas.tsx` koje je prvi pregled promašio jer je
  gledao samo `src/lib/` — oba su već bila u `try/catch`.
- **V1** — `--secondary` sa `#00cece` na `#008080`. Piksel-provera: **4,77:1** (bilo 1,96:1).
  Popravlja svih 10+ dugmadi sa belim tekstom odjednom, ne samo „Següent".
- **T1** — QA runner: razmak se sada klikće kao prazna pločica (ne tasterom), i dodato je
  **vremensko ograničenje po zadatku** (`TASK_TIMEOUT_MS`, podrazumevano 45 s).
  Prolaz koji je visio preko 500 s bez rezultata sada za 100 s odigra svih 20 zadataka.
  **Pun prolaz: 212/212 zadataka, 12/12 tema, 0 grešaka u konzoli, 0 pokvarenih slika.**
- **Zadaci `les-botigues` 13–20** provereni pojedinačno, svaki u svežoj strani (bez pomaka
  koraka): **8/8 se iscrtava, ima kontrole, sve slike učitane, 0 grešaka**.

### Novo saznanje 31.07. — pomak koraka posle isteka vremena
Kad zadatku istekne vreme, runner nastavi da broji, a aplikacija ostane na istom zadatku,
pa napomene odlaze **pogrešnom** zadatku. Prijavio je grešku za reč „tonyina" u zadatku u
kome te reči nema. Zato se posle isteka jedinica proverava **u svežem stanju**.
Upisano u `~/.claude/AUDIT-PROTOKOL.md`, odeljak „SAMOOBNAVLJANJE".

## Popravljeno 30.07.2026. (ne vraćati se na ovo)

- Maskote završavale u gornjem levom uglu umesto u donjim uglovima (`position: fixed` + `transform` roditelja) → portal u `<body>`
- Maskote stalno bledele (`repeat: Infinity` prenosio se na ulazni `opacity`) → ulazak i petlja razdvojeni
- Obrtanje lika nije radilo (Framer prepisuje `transform`) → obrtanje prebačeno na sliku
- `la-classe-12`: prompt tražio `les`/`els` kojih u zadatku nema, a prećutkivao `l'` koji se bira
