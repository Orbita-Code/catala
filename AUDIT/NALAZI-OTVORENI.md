# Otvoreni nalazi — Katalonski

> Živi spisak nepopravljenog. Svaki nalaz nosi datum kad je **prvi put viđen**.
> Popravljeno se briše odavde (ostaje u izveštaju audita tog dana).
> Nalaz otvoren duže od 3 audita posebno se ističe.

Poslednje ažuriranje: **30.07.2026.**

## Kritično

| # | Nalaz | Prvi put viđen | Audita otvoren |
|---|---|---|---|
| K1 | Početna strana se ruši kad je upis u `localStorage` zabranjen (privatni prozor, školski pregledač). 9 nezaštićenih upisa; ulazna tačka `progress.ts:43` preko modala dnevne nagrade | 30.07.2026. | 1 |

## Visoko

| # | Nalaz | Prvi put viđen | Audita otvoren |
|---|---|---|---|
| V1 | Kontrast **1,96:1** na glavnom dugmetu „Següent" (traži se 4,5:1) | 30.07.2026. | 1 |
| V2 | Sadržaj početne skoči **130 px** u prvih ~0,5 s (CLS **0,167**) — dete klikne pogrešnu temu | 30.07.2026. | 1 |

## Srednje

| # | Nalaz | Prvi put viđen | Audita otvoren |
|---|---|---|---|
| S1 | 13 od 24 elemenata na strani zadatka bez vidljivog fokusa tastature | 30.07.2026. | 1 |
| S2 | Dodirne mete do **19 px** (preporuka 44 px) | 30.07.2026. | 1 |
| S3 | URL nije stanje; `F5` vraća sa zadatka 4 na zadatak 1 | 30.07.2026. | 1 |
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
| T1 | QA runner se zaglavljuje na `les-botigues` #13 → zadaci **13–20 nikad odigrani** | 30.07.2026. |
| T2 | Runner proverava da je zadatak odigran, ne da je odgovor tačan po sadržaju | 30.07.2026. |
| T3 | Nema provere za: zabranjen `localStorage`, kontrast, fokus, CLS, dodirne mete, URL, osvežavanje | 30.07.2026. |
| T4 | Nema pre-deploy skripte sa izlaznim kodom (globalno pravilo je traži) | 30.07.2026. |

## Čeka odluku vlasnice

| # | Pitanje | Postavljeno |
|---|---|---|
| P1 | „borrador" (kako piše sveska) ili „esborrador" (katalonski standard)? 7 mesta u `la-classe` | 30.07.2026. |

## Popravljeno 30.07.2026. (ne vraćati se na ovo)

- Maskote završavale u gornjem levom uglu umesto u donjim uglovima (`position: fixed` + `transform` roditelja) → portal u `<body>`
- Maskote stalno bledele (`repeat: Infinity` prenosio se na ulazni `opacity`) → ulazak i petlja razdvojeni
- Obrtanje lika nije radilo (Framer prepisuje `transform`) → obrtanje prebačeno na sliku
- `la-classe-12`: prompt tražio `les`/`els` kojih u zadatku nema, a prećutkivao `l'` koji se bira
