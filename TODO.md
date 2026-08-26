# TODO — Katalonski

> Stanje na dan **26.08.2026.** — v. `AUDIT/2026-08-26-audit.md`
>
> Pravilo: **rešeno se BRIŠE odavde, ne štriklira.** Zadatak sa kvačicom i
> dalje mora da se pročita da bi se videlo da je gotov, pa spisak obaveza
> prestaje da bude spisak obaveza. Trag o urađenom stoji u
> `HANDOVER-2026-08-17.md` i `AUDIT/NALAZI-OTVORENI.md`.
>
> **Redosled: prvo se popravljaju bagovi, pa se gradi novo.**

---

## HITNO — rešiti pre svega ostalog

### 1. Mikrofon: zadatak samoprocene je NEREŠIV u Safariju

**Stanje na produkciji SADA.** Dete pritisne mikrofon, traka se pomera, kaže
reč tačno — **kvačica se nikad ne pojavi** i zadatak se ne može završiti.

Uzrok je **nađen i dokazan** (pet izveštaja sa detetovog laptopa):
**Safari 17 najavi prepoznavanje govora pa nikad ne odgovori.** Mikrofon,
dozvola i zvuk rade besprekorno (`vrh=8–18`, `dozvola: granted`).

Puni podaci, kako se do njih dolazi i šta je sve već probano —
**`HANDOVER-2026-08-17.md`, odeljak 1.** Pročitati pre bilo kakvog rada.

**Šta uraditi, ovim redom:**

1. **Odblokirati igru bez ijedne postavke** (predlog razrađen u handoffu 1.5.A):
   ako prepoznavanje dva puta zaredom ne odgovori, a u snimku ima pravog glasa,
   zapamtiti da na tom uređaju prepoznavanje ne radi i od tada kvačicu davati
   na sam izgovor. Na uređajima gde prepoznavanje radi — ništa se ne menja.
   Detetu se ne prikazuje nikakvo objašnjenje, samo ✅ ili ništa.
2. **Reći vlasnici dve besplatne stvari:** otvoriti igricu u **Chrome**, ili
   u Safariju uključiti **Diktiranje**
   (`Configuració del sistema → Teclat → Dictat`).
3. Tek ako 1 i 2 nisu dovoljni — **prepoznavanje na serveru**
   (~0,006 $/min, detetov glas prolazi kroz spoljni servis).
   **Traži izričitu odluku vlasnice — ne raditi bez njenog „da".**
4. Alternativa bez ikakvog servisa: `transformers.js` + `whisper-tiny` u samom
   pregledaču. Besplatno i privatno, ali ~40 MB i sporo na starijem laptopu.
   Izmeriti pre nego što se predloži.

**Ne ponavljati ono što je već probano i nije pomoglo** (handoff 1.4):
popravke dozvola i tajmera, rezervni jezici, drugi mikrofon, samoprocena
„Jo / Model" (vlasnica ju je odbila — **ne vraćati**).

---

## Sledeće po redu

### 2. Gotovo, a stoji neupotrebljeno — 95 ilustracija

Danas su **tri puta** uzrok bage bile stvari koje su bile napravljene pa
zaboravljene: slike `laura-carles` i `carolina` (zadaci se nisu mogli rešiti
nego samo pogađati) i funkcija `clearTaskErrors` (dete vraćano na rešene
zadatke).

U `public/illustrations/` stoji **95 slika koje se nigde ne prikazuju**.
Proći ih i videti koje rešavaju zadatak kome sada „fali slika".
Spisak se dobija skriptom iz sesije 16.08. (poređenje `src/data/` i foldera).
Traje jedno popodne, ne košta nijednu novu generaciju.

### 3. Ilustracije sa natpisima — tema 7 (Les botigues)

Oko **25 slika ima natpis** (FLECA, MERCAT, CINEMA…). Dvostruko smeta:
dete uči da prepozna radnju po natpisu umesto po robi, a slike sa katalonskim
tekstom se ne mogu deliti ako igrica ikad dobije drugi jezik.
Pravilo i način rešavanja: `CLAUDE.md`, „Illustration Design Rules", tačka 0.

Uz njih još oko 3 slike sa licima na predmetima i ~35 sa neujednačenim stilom.

### 5. Teme 10–12 nisu proverene sa sveskom

Index sveske ih jasno navodi (1. LA CLASSE … 12. ELS OFICIS), a mi smo ih
pisali kao da izvora nema. Treba uporediti sa fotografijama, isto kao što je
20.08. urađeno za teme 2–7 i 9.

**Oprez:** `Ilustracije/WORKBOOK-VS-ILLUSTRATIONS.md` tvrdi da te teme „ne
postoje u svesci" — to je jedna od dokazanih netačnosti tog dokumenta.

### 4. Zatvoriti rupu T2 — NAJVAŽNIJE POSLE AUDITA

Pun audit je urađen **26.08.2026** (`AUDIT/2026-08-26-audit.md`, ocena 7/10,
pokrivenost 8/12 dimenzija). Sledeći je za **29.08.**

Iz njega ostaje jedan zadatak koji je važniji od svih ostalih:

**Rupa T2 stoji od 30.07. — 27 dana.** QA prolaz proverava da je zadatak
**odigran**, ne da je odgovor **tačan po sadržaju**. Kroz tu rupu su prošla sva
četiri zadatka koja je vlasnica našla 24–25.08. (nerešiv 17, 16 bez slika, 13 sa
tri netačna odgovora, dijagonale i reči unazad u osmosmerci).

Dok ta rupa stoji, bagove nalazi dete. **Prvo instrument, pa nove funkcije.**

---

## Čeka odluku vlasnice

- **14 mesta gde slika postoji, a zadatak je ne prikazuje.** Spisak daje
  `node scripts/proveri-parove-bez-slike.mjs`. Negde je odgovor apstraktan pa
  slika i ne treba — zato provera zasad samo upozorava, ne obara deploy.
- **Prepoznavanje govora na serveru** (tačka 1.3 gore) — cena i privatnost.
- Da li `cara` (lice) treba i u još neku temu osim teme 3.
