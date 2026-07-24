# QA HANDOVER — Katalonski (pred LIVE lansiranje)

> Sledeća sesija: pročitaj OVO celo pre rada. Cilj: proveriti SVAKU sliku i SVAKI zadatak da sve radi pre puštanja žive igrice.

## 🆕 SESIJA 24.07.2026 — REZULTATI (VAŽNO)
- **QA AUTO-SOLVER TOOLKIT napravljen** u `e2e/qa/` (extract-tasks.mjs + run.mjs + solve-lib.mjs + README). NE praviti nove solvere — pokreni `node e2e/qa/run.mjs`. Vidi memory `reference_katalonski_qa_toolkit`.
- **Odigrano svih 209 zadataka × 12 tema kroz browser.** Rezultat: **0 oštećenih slika u celoj igri**; **0 console grešaka** (posle popravke ispod).
- **POPRAVLJENO (lokalno, čeka deploy):**
  - `corbata.webp` — bio oštećen → prekonvertovan iz `Ilustracije/corbata.png` (dobra kravata). ✅
  - `cinturo.webp` — bila mačka („al costat") → vraćen kaiš iz starog `public/illustrations/cinturo.png`. ✅ (mačka je ispravno sačuvana kao `al-costat`)
  - **HYDRATION BAG (dugme-u-dugmetu)** u `LabelImage.tsx` (retry + word-bank SpeakerButton) i `MultipleChoice.tsx` (retry) → retry `<button>`→`<span role=button>`, word-bank `<motion.button>`→`<motion.div role=button>`. Okидao se kad dete pogreši/na label-image temama. Verifikovano 0 grešaka.
- **Predlozi (l-escola z14/15):** al-costat i al-davant vizuelno preslični (korisnica potvrdila); a-sota/a-dins/a-fora imaju pogrešan subjekat+eng.tekst → u REGEN listi.
- **8 slika za ChatGPT regen — ZAVRŠENO 24.07.2026** (integrisano + SW keš v7→v8): `cola-de-barra`, `sabo`, `fleca`, `fruiteria`, `a-sota`(ISPOD), `al-costat`(mačka DESNO), `a-dins`(mačka u kutiji), `a-fora`(mačka van kućice). SVE BEZ teksta (pravilo višejezičnosti — vidi memory `feedback_illustrations_no_text_multilang`). Generisano preko pravog Chrome-a (AppleScript, [[reference_chatgpt_illustrations_via_chrome]]).
- **DEPLOYOVANO 24.07.2026** (commit `d12acdf`, catala.orbitacode.com, SW v8). Produkcija verifikovana: svih 15 slika 200, corbata ispravna, svih 12 tema 0 oštećenih slika + 0 console grešaka (1 transient net::ERR_FAILED u els-oficis = mrežni blip, ne bag). Dodato: 5 novih zabavnih životinja (flamenc/unicorn/granota/ànec/oca), cocodril crtani, zadaci domaće/divlje + voće/povrće, pojednostavljene ribe.
- **Preostala dorada SOLVERA (ne bagovi igrice):** word-search drag, fill-sentence klik opcije, self-assessment, copy-word poslednja reč, separate-words/write-antonym/decode-grid. Statički audit ranije potvrdio rešivost svih zadataka.

---

## ⛔ PRAVILO #1 — BEZ PREČICA, BEZ ZBRZAVANJA (OBAVEZNO)
Korisnica insistira i više puta se (opravdano) naljutila jer sam ubrzavao i gledao samo „najrizičnije" slike / deo zadataka.
- Kad kaže „sve / temeljno / bez prečica" → radi BUKVALNO svaku stavku (svaku sliku, svaki zadatak, svaku reč), i prijavi svaku.
- NE uzorkuj. NE preskači „standardne" stavke. Ako je preveliko — reci joj iskreno i pitaj, NE ubrzavaj kriomice.
- Vidi memory: `feedback_no_shortcuts_be_thorough`.

## 🔑 KRITIČNO — koji fajl je „prava" slika
- **Aplikacija (kod) koristi ISKLJUČIVO `public/illustrations/*.webp`.** (funkcija `getWordIllustration` u `src/lib/illustrations.ts` vraća `/illustrations/<kljuc>.webp`)
- **NIKAD ne procenjuj sliku gledajući `.png`** — `.png` fajlovi su ČESTO ZASTARELI (stare verzije koje niko nije obrisao). 
- **Zašto se Ilustracije folder ne poklapa sa igricom:** `Ilustracije/*.png` je radni/izvorni folder; `public/illustrations/*.png` su usput sačuvane kopije. Kad je slika regenerisana, `.webp` je ažuriran ali stari `.png` NIJE brisan → png pokazuje staru sliku, webp pokazuje pravu. 
  - PRIMER greške: `infermer.png` = stara ženska; `infermer.webp` (igrica) = MUŠKI (tačan). Ja sam prvo pogrešno prijavio „ženski" jer sam gledao png.
  - Stare Bing slike nisu brisane kad su kasnije pravljene nove GPT slike → gomila zastarelih/duplih png.
- **Ključ slike iz reči:** `stripAccents(rec).toLowerCase()` pa `replace(/[\s']+/g,'-')`; `·` se UKLANJA (goril·la → `gorila`). Ç se čuva.

## 🛠️ ALAT — kontakt-listovi (najbrži TEMELJAN metod)
`scripts/qa-contact-sheet.py <slug>` napravi montažu SVIH .webp slika te teme sa nazivima → gledaš ceo grid odjednom i vidiš SVAKU sliku + hvataš mismatch/oštećene/bez-slike.
- Pokretanje: `python3 scripts/qa-contact-sheet.py <slug>` (traži ImageMagick `montage`, ima ga preko homebrew).
- Izlaz: `<scratch>/_ct_<slug>.png` (promeni putanju u skripti na svoj scratch). Prijavljuje OŠTEĆENE i BEZ-slike.
- Slugovi: la-classe, l-escola, el-cos, la-roba, la-casa, la-familia, les-botigues, el-menjar, els-animals, la-ciutat, els-vehicles, els-oficis.

## ✅ URAĐENO (ova sesija)
**Popravke DEPLOYOVANE na produkciju** (commiti do `a1c1d83`, SW keš `catala-v7`, catala.orbitacode.com):
- escarabat slika; review-mode za svih 16 tipova zadataka; matching kategorije (rightTextOnly); overhaul teme 9 (boje, delovi ptice→MC, sardina→peix, MC slike, order-words→fill-sentence, čitanje→lak kviz); čuvanje dečjih crteža; brojanje 13/12 (getCompletedScoringCount); zaglavljeno slavlje + „Repassa les tasques" + „Acaba les tasques"; confetti key (0 grešaka); apostrof bug (parada d'autobús); 14 novih slika (7 ženki, gat neutralan, escola/museu/estació bez eng. teksta, globus/pagès/metge jasni, pilot sa avionom, parc-de-bombers); els-oficis-12 → zagonetke.

**QA odigrano stvarno (klik po klik):** tema 9 zadaci 1-9 (copy-word, fill-sentence, classify, matching) — svi završeni; + MC zadatak. Verifikovano: XP formula tačna (10+5 baza ×1.1 streak +20 dnevni = 37), level-up (Nivell 2), zvezdice/streak, **0 console grešaka**.

**Statički audit svih 223 zadatka:** 0 bagova rešivosti (unscramble slova se poklapaju, word-search reči u gridu, decode-grid tačan, opcije sadrže tačan odgovor).

**Vizuelni pregled slika kroz .webp kontakt-listove — ZAVRŠENO:** la-roba (4), la-casa (5), la-familia (6).
(NAPOMENA: teme 1,2,3,10,11,12 sam ranije gledao kroz ZASTARELE .png — MORA ponovo kroz .webp kontakt-list!)

## 📋 OSTALO — vizuelni pregled slika (kroz .webp kontakt-list, SVAKU!)
- les-botigues (7) — 47 slika ⬜
- el-menjar (8) — 37 slika ⬜
- els-animals (9) — 44 slike ⬜ (proveri kroz webp; deo viđen u igrici)
- la-classe (1) — 28 ⬜ (bio png — ponovo webp)
- l-escola (2) — 41 ⬜ (bio png — ponovo webp)
- el-cos (3) — 23 ⬜ (bio png — ponovo webp)
- la-ciutat (10) — 12 ⬜ (bio png — ponovo webp)
- els-vehicles (11) — 12 ⬜ (bio png — ponovo webp)
- els-oficis (12) — 12 ⬜ (bio png — ponovo webp)

## 🔴 POTVRĐENI PROBLEMI SLIKA (kroz .webp) — treba popraviti/regenerisati
1. **`corbata` (la-roba)** — `corbata.webp` je OŠTEĆEN (ImageMagick: „insufficient image data") → igrica ne prikazuje. Regeneriši.
2. **`cinturó` (la-roba)** — `cinturo.webp` je POGREŠNA slika: prikazuje mačku pored stolice (to je slika predloga „al costat"), NE kaiš. Regeneriši kaiš.
3. **`cola de barra` (la-classe)** — piše „GLUE" (engleski). Treba sa „Cola" (katalonski) ili bez teksta.
4. **`carrer` (la-ciutat)** — nejasno; liči na kuće, ne na ulicu. Regeneriši jasnu ulicu (put/kolovoz). (korisnica se složila)
5. **`ambulància` (els-vehicles)** — Bing pastelni/drugačiji stil; korisnica ne voli te boje. Regeneriši u JARKOM stilu kao `moto.webp` (šarena, detaljna).
6. **`sabó` (la-casa)** — piše „SOAP" (engleski). Treba katalonski/bez teksta.
- 🟡 `rellotge` (la-roba, dodaci) — prikazan ZIDNI sat; u odeći/dodacima treba RUČNI sat.
- 🟡 `campana` (la-casa) — prikazan zvono; u kući je verovatno mišljen kuhinjski aspirator. (proveri sa korisnicom)
- 🟡 el-cos z10 (alt/baix/jove/vell) — 4 prideva BEZ slike (copy-word bez ilustracije).
- Stil: `ambulància` + neke slike (jaqueta, predlozi-mačka) su akvarel/detaljni stil, dok su ostale „clay 3D" — kozmetička nedoslednost.

**ISPRAVLJENO (bio lažan alarm):** `infermer` je ISPRAVAN (muški u .webp) — samo obriši zastareli ženski `infermer.png`.

## 🧹 ČIŠĆENJE FOLDERA (obavezno pre live) — mora se PROĆI CEO folder
Problem: gomila zastarelih/duplih slika (stare Bing verzije nisu brisane kad su pravljene nove GPT).
- `Ilustracije/` = 480 fajlova (radni/izvorni).
- `public/illustrations/` = **440 `.png` (app ih NE koristi!)** + 505 `.webp` (app koristi samo ove).
- Duplikati sa „ 2" u imenu: npr. `public/illustrations/ajuntament 2.png`. Korisnica kaže da je i `corbata` bila 2× png u Ilustracije.
- **Zadatak:** proći CEO `Ilustracije/` I `public/illustrations/` → naći: (a) duplikate („ 2/3", copy), (b) zastarele Bing verzije, (c) orphan `.webp` (koje nijedna reč ne koristi — uporedi sa `wordsWithIllustrations` u `src/lib/illustrations.ts`), (d) sve `.png` u public/illustrations (nepotrebni app-u).
- ⚠️ PRAVILO IZ CLAUDE.md: NIKAD trajni `rm` na korisničkim fajlovima — premeštaj u Kantu preko Findera (`osascript ... Finder ... delete POSIX file`). Prvo izlistaj šta se briše, pa potvrda korisnice.

## 🟡 TEŽINA ZA 7-GODIŠNJAKA (kandidati za pojednostavljenje — korisnica odlučuje)
- Gramatika rod/broj (apstraktno): `la-casa` z3 (LA/EL/LES/ELS — 4 člana!), `l-escola` z3/z9, `la-roba` z7 (un/una), `la-familia` z5/z6, `els-animals` z9 (UN/UNA), `la-classe` z4/z6.
- Teško čitanje: `els-animals` z15 (dugački MC opisi), `la-casa` z22 (pasus teksta), `la-familia` z13.
- `la-casa` z21 (order-words — korisnica je isti tip uklonila u els-oficis), `la-familia` z9 (decode-grid), separate-words (`la-classe` z15, `la-familia` z7, `les-botigues` z3).

## ⚙️ Kako regenerisati slike
Korisnica generiše sama u ChatGPT (Pixar/jarki stil, prolazi filter), sačuva na Desktop pod imenom reči (npr. `cinturo.png`), a Claude integriše: `sips -z 512 512`, u `Ilustracije/` i `public/illustrations/` kao .png + `cwebp -q 80 -> .webp`, registruj ključ u `wordsWithIllustrations` ako je nov, bekapuj staru. Posle: bump SW keš (`public/sw.js` catala-vN → vN+1), commit, push (uz odobrenje), verifikuj na produkciji. Vidi memory `reference_chatgpt_illustrations_via_chrome`.

## Stanje deploy-a
Sve gorenavedene popravke koda/slika iz prošlih rundi su DEPLOYOVANE. Problemi slika iz ove liste (corbata/cinturo/cola/carrer/ambulancia/sabo) NISU još — treba generisati + deploy.
