# QA HANDOVER & UPUTSTVO ZA TESTIRANJE — Katalonski

> **Sledeća sesija: pročitaj OVO celo pre rada.** Ovo je autoritativni vodič za testiranje i
> stanje projekta. Poslednje ažuriranje: **25.07.2026** (slike bez teksta, nove zabavne životinje,
> hydration fix, QA toolkit + solver popravke, celebration/UX popravke, rotacija lozinke, deploy do SW v15).
> **Produkcija je iza basic auth-a — lozinka u memoriji `reference_katalonski_credentials` (NE u repo).**

---

## ⛔ PRAVILO #1 — BEZ PREČICA, BEZ ZBRZAVANJA
Kad korisnica kaže „sve / temeljno / bez prečica" → radi BUKVALNO svaku stavku i prijavi svaku.
NE uzorkuj. Ako je preveliko — reci iskreno i pitaj, NE ubrzavaj kriomice.
Vidi memory `feedback_no_shortcuts_be_thorough`.

## 🖼️ PRAVILO #2 — ILUSTRACIJE BEZ TEKSTA (višejezičnost)
Nijedna ilustracija NE SME imati tekst/naziv (natpis prodavnice, etiketa predmeta). Iste slike
se dele za engleski/španski/druge jezike. Prodavnicu prikaži robom (pekara→hlebovi, piljarnica→voće),
NE natpisom. Prompt UVEK sadrži „no text, no letters, blank sign". Vidi memory
`feedback_illustrations_no_text_multilang`. **Postojeće slike sa tekstom** (cinema, restaurant,
mercat, farmacia, peixeteria, verduleria, carnisseria) su kandidati za buduću regeneraciju bez teksta.

## 🔑 PRAVILO #3 — .webp je istina
Igrica koristi ISKLJUČIVO `public/illustrations/*.webp` (`getWordIllustration` u `src/lib/illustrations.ts`).
`.png` fajlovi su ČESTO ZASTARELI — NIKAD ne procenjuj sliku gledajući `.png`, gledaj `.webp`.
Ključ slike: `stripAccents(rec).toLowerCase()` → `replace(/[\s']+/g,'-')`; `·` se UKLANJA (goril·la→gorila); `ç` se čuva.

---

## 🛠️ QA AUTO-SOLVER TOOLKIT (`e2e/qa/`) — GLAVNI ALAT ZA TESTIRANJE
> **NE praviti nove solvere od nule** — ovaj toolkit već postoji i RADI. Samo ga pokreni.
> Odigra SVAKI zadatak SVAKE teme kao dete, tačnim odgovorima iz podataka, i prijavi bagove.

### Fajlovi
| Fajl | Šta radi |
|------|----------|
| `extract-tasks.mjs` | Transpiluje `src/data/*.ts` pravim TS kompajlerom → `tasks.json` (svi zadaci + TAČNI odgovori). Pokreni PRVO i posle svake izmene podataka. |
| `tasks.json` | Generisano. Izvor istine za odgovore (212 zadataka). |
| `solve-lib.mjs` | Solveri za svih 18 tipova. `solveTask(page, task, notes)`. |
| `run.mjs` | Samostalan runner: Chromium, prolazi teme, `report.json` + konzolni sažetak. |
| `report.json` | Generisano. Rezultat poslednjeg prolaza. |
| `README.md` | Detaljna dokumentacija toolkita. |

### Preduslovi
1. **Za localhost:** `npm run dev` (na `http://localhost:3000`).
2. **Chromium:** runner sam nalazi build **1232** u `~/Library/Caches/ms-playwright/`. Ako verzija
   drugačija → izmeni `findChromium()` u `run.mjs` ili `PW_EXE=/putanja node e2e/qa/run.mjs`.

### Pokretanje
```bash
node e2e/qa/extract-tasks.mjs              # 1) osveži tasks.json iz podataka
node e2e/qa/run.mjs                        # 2a) SVE teme (localhost) — dugo (copy-word ima 20+ reči)
node e2e/qa/run.mjs la-classe              # 2b) jedna tema (za debug)
node e2e/qa/run.mjs els-animals el-menjar  # 2c) više tema

# TESTIRANJE PRODUKCIJE (iza basic auth-a):
BASE=https://catala.orbitacode.com BASIC_AUTH="$KATALA_AUTH" node e2e/qa/run.mjs  # KATALA_AUTH="korisnik:lozinka" iz Coolify env
```

### Kako čitati izveštaj (konzola / `report.json`)
`■ <tema>: X/Y zadataka | zaglavljeno: N | sa napomenom: M | console-err: K | slike-oštećene: Z`
- **`✖ SLIKA` / `slike-oštećene`** (`naturalWidth==0`) → **PRAVI BAG** (oštećena/nedostajuća slika).
- **`✖ CONSOLE` / `console-err`** → JS greška. NAPOMENA: `Failed to load resource: net::ERR_FAILED`
  je transient MREŽNI blip (nije bag). Prava greška bi imala poruku tipa „hydration"/„button descendant".
- **`⚠ ZAGLAVLJEN`** → zadatak nije prešao dalje. `drawing-canvas` bonus se UVEK prijavljuje kao
  zaglavljen (slobodna aktivnost, bez tačnog odgovora) — to je OK, NE bag.
- **`• #i <tip>: napomena`** → solver je nešto pogađao/nije našao → dopuni taj solver u `solve-lib.mjs`
  (NIJE bag igrice).

**Čist izveštaj = 0 slika-oštećenih, 0 console-err, zaglavljeno samo drawing-canvas bonus.**

### Poznata ograničenja solvera (stanje 24.07.2026 — NISU bagovi igrice)
- `color-by-instruction` — best-effort (bojenje se ne verifikuje programski, proveri vizuelno).
- `copy-word` — poslednja reč zadatka ponekad da „nema slova X" (zadatak se auto-završi pre poslednjeg
  klika) — kozmetički, zadatak JESTE rešiv.
- Sve ostalo RADI: copy-word, fill-letters, unscramble, classify, matching, fill-sentence,
  multiple-choice, add-article, word-search, self-assessment.
- **Ključna lekcija:** klikaj tekst-dugmad PRAVIM Playwright lokatorom (`page.getByRole('button',{name})`),
  NE koordinatnim klikom (framer-motion transform pomera koordinatu). Runner NE sme duplirati „Següent"
  (neki zadaci se auto-završe → brojač skoči → drift indeksa → solver dobija pogrešan DOM).

---

## 🎨 VIZUELNI PREGLED SLIKA (odvojen alat)
```bash
python3 scripts/qa-contact-sheet.py <slug>   # montaža svih .webp te teme sa nazivima
# slugovi: la-classe l-escola el-cos la-roba la-casa la-familia les-botigues
#          el-menjar els-animals la-ciutat els-vehicles els-oficis
# izlaz: <scratch>/_ct_<slug>.png (promeni scratch putanju u skripti na svoju)
```
Gledaš ceo grid odjednom → hvataš mismatch/oštećene/engleski-tekst. Prijavljuje OŠTEĆENE i BEZ-slike.

---

## 🖌️ GENERISANJE SLIKA (ChatGPT preko PRAVOG Chrome-a) — RADI, ISPROBANO
> ChatGPT je ulogovan SAMO u korisničinom pravom Chrome-u (Apple Sign In, lozinka nepoznata).
> Playwright Chromium se NE MOŽE ulogovati. Rešenje: upravljaj pravim Chrome-om preko AppleScript-a.
> Vidi memory `reference_chatgpt_illustrations_via_chrome`.

**Postupak (ispravljen 24.07.2026):**
1. Pokreni pravi Chrome ako nije: `open -a "Google Chrome"` (NE „Google Chrome for Testing" — to je Playwright).
   Proveri da je pokrenut baš pravi: `ps aux | grep "Google Chrome.app"`.
2. Otvori custom GPT: `osascript -e 'tell application "Google Chrome" to ...'` na
   `https://chatgpt.com/g/g-p-697a9ef9e7fc8191a6f01584dad8ea4d-igrice-katalonski-jezik`.
3. „Allow JavaScript from Apple Events" mora biti UKLJUČEN (View→Developer). Proveri:
   `execute t javascript "!!document.querySelector('#prompt-textarea')"`.
4. **SLANJE PROMPTA (kritično — moraju ODVOJENI pozivi):**
   - clear: `el.focus();document.execCommand('selectAll');document.execCommand('delete')`
   - paste: `el.dispatchEvent(new ClipboardEvent('paste',{clipboardData: dt sa text/plain, bubbles:true}))`
     — **sintetički paste, NE insertText** (React/Lexical editor ne prima insertText pouzdano).
   - Enter: dispatch KeyboardEvent keydown/keypress/keyup key='Enter'. **NE klik na send-dugme** (nepouzdan).
5. **NE šalji ponovo prerano!** GPT završi sliku brzo; ako čekaš samo 7s pa re-šalješ → praviš DUPLIKATE.
   Pošalji JEDNOM, pa strpljivo čekaj NOVU sliku (novi `file_...` id), re-šalji tek ako 40s ništa.
6. **Preuzimanje BEZ „Save As":** `window.scrollTo(0,9e9)` (najnovija slika na dno), uzmi img sa novim id-em,
   `fetch(url,{credentials:'include'})→blob→createImageBitmap→canvas 512x512→toDataURL('image/png')`,
   sačuvaj u `window.__imgdata`, pročitaj zasebnim pozivom, dekoduj base64 (python).
   ⚠️ ChatGPT lazy-loaduje slike i menja redosled → identifikuj sliku po EKSPLICITNOM `file_...` id-u,
   ne po „poslednja u DOM-u".
7. **Content filter:** slatke životinje koje liče na poznate likove (lav/medved→Kralj lavova) GPT BLOKIRA.
   Objekti/zgrade/ljudi/mačke NE blokiraju. Ako blokira → drugačiji opis (npr. „colorful green lizard").
8. Radne skripte iz ove sesije (u `/tmp/`, kopiraj ako trebaju): `gen7.sh` (paste+strpljivo čekanje).

**Integracija slike** (posle preuzimanja na `~/Desktop/<kljuc>.png`):
```bash
sips -z 512 512 ~/Desktop/<kljuc>.png                      # na 512x512
cp ~/Desktop/<kljuc>.png Ilustracije/<kljuc>.png
cp ~/Desktop/<kljuc>.png public/illustrations/<kljuc>.png
cwebp -q 80 public/illustrations/<kljuc>.png -o public/illustrations/<kljuc>.webp
# ako je NOVA reč → dodaj kljuc u wordsWithIllustrations Set u src/lib/illustrations.ts
# posle SVIH slika → bump SW keš: public/sw.js  catala-vN → vN+1
```

**Promptovi za slike** koje još čekaju: `REGEN-PROMPTS.md` (svi bez teksta).

---

## 🚀 DEPLOY
- Repo: `github.com/Orbita-Code/catala`, grana **main**. Coolify auto-deploy sa main-a (Dockerfile).
- Build traje ~3-5 min (server ima malo RAM-a, zna OOM/rolling). Verifikuj da je gotov:
  `curl -o /dev/null -w "%{http_code}" -u "$KATALA_AUTH" https://catala.orbitacode.com/illustrations/<nova-slika>.webp` (kredencijali iz Coolify env, NE u repo)
  (404=još builduje, 200=gotovo).
- **Pre deploy-a:** `npx tsc --noEmit` (mora 0) + `npm run build` (mora exit 0).
- **Push samo uz odobrenje korisnice.** Commit poruke na srpskom/engleskom, opisne.
- **NE commitovati nenamerna brisanja** — stage-uj SAMO svoje fajlove eksplicitno (ne `git add -A`);
  ako `git status` pokaže „D" fajlove koje nisi dirao, vrati ih: `git checkout -- <fajl>`.

---

## ✅ URAĐENO (sesija 24.07.2026) — DEPLOYOVANO (commit `762e558`, SW v8)
**Slike (16, sve bez teksta):**
- Popravljene: `corbata` (bila oštećena/crna), `cinturó` (bila mačka→kaiš), `cola-de-barra`
  (lepi papir, ne balzam), `sabó`, `fleca`, `fruiteria` (blank natpisi), predlozi `a-sota`/`al-costat`
  (mačka desno)/`a-dins` (mačka u kutiji)/`a-fora` (mačka van kućice).
- `cocodril` → crtani/clay (bio realističan).
- **5 novih zabavnih životinja:** `flamenc`, `unicorn`, `granota`, `ànec`, `oca`.

**Sadržaj (podaci):**
- `els-animals`: pojednostavljene ribe (#4: peix/tauró/sardina), + copy zabavnih životinja (#4b),
  + klasifikacija domaće/divlje (#6c). Sad 23 zadatka.
- `el-menjar`: + klasifikacija voće/povrće (#19). Sad 21 zadatak.

**Kod:**
- **Hydration bag fix** (dugme-u-dugmetu) u `LabelImage.tsx` (retry + word-bank SpeakerButton) i
  `MultipleChoice.tsx` (retry) → `<span role="button">` / `<motion.div role="button">`. Okидao se kad
  dete pogreši ili na label-image temama.
- QA toolkit `e2e/qa/` + solver popravke (word-search drag, native klik, fix drift indeksa).

**Verifikacija produkcije:** svih 12 tema, **0 oštećenih slika, 0 pravih console grešaka**.
Sva 3 nova zadatka odigrana u browseru uživo — rade.

**Kasnije istog dana (commit-i do `ae7c9b5`, SW v10):**
- **FEATURE — sličica uz tačan (zeleni) odgovor u `MultipleChoice`**: kad dete izabere tačno,
  pored zelenog polja se prikaže mala slika pojma (NE odaje odgovor tokom pitanja). Radi za sve MC
  zadatke. `getWordIllustration` (illustrations.ts) sad skida i predloge (`al`, `a l'`, `a la`...) →
  „A l'hospital" razrešava „hospital". Fill-sentence je to VEĆ imao.
- **la-ciutat slike bez teksta / jasnije:** `cinema` (bez „CINEMA" natpisa — kokice/film-rolna/marquee),
  `estació` (istaknuta zgrada+peron, bio dominantan voz → mešalo se sa „tren"), `carrer` (dodati
  AUTOMOBILI na kolovoz — ćerka rekla da bez kola liči na hodnik/pasillo).

**Nastavak 24-25.07.2026 (commit-i do `dfe5b22`, SW v15):**
- **`fanal`** — bila mutna na dnu → zamenjena oštrom (već postojala kao `Ilustracije/fanall.png`).
- **Celebration ekran (završetak teme) — više popravki:**
  - „Acaba les tasques" NIJE radilo (gledalo samo `getThemeErrors`, a `fullyComplete` gleda
    `progress.taskErrors`) → sad koristi OBA + fallback da uvek navigira. Prijavljeno 2 sesije.
  - Posle rešavanja pogrešnog zadatka → skače na sledeći NEZAVRŠEN (preskače završene; dete ne klikće
    „Següent" kroz gotove). Kad su svi gotovi → celebration.
  - Redosled dugmadi: **Acaba** (samo ako ima grešaka) → **Següent: Tema** (uvek) → Repassa → Repeteix → Torna.
  - „Repeteix tot el tema" (RESET) → prigušeno SIVO + „(comença de nou) 🔄" (bila boja teme → izgledala
    kao „napred"; rizik od slučajnog reseta).
  - **Klik na ZAVRŠENU temu → uvek celebration** (ranije vraćao na srednji zadatak 9/12).
- **QA solveri popravljeni:** word-search drag (centar svake ćelije), fill-sentence/MC/add-article
  PRAVI `getByRole` klik (koordinatni promašuje zbog framer-motion), **fix drift indeksa** (runner NE sme
  duplirati „Següent" — neki zadaci se auto-završe → brojač skoči). la-classe: zaglavljeno 2→0, napomene 7→3.
  `run.mjs` dobio `BASIC_AUTH` env za testiranje produkcije.
- **🔒 SIGURNOST — lozinka rotirana:** stara basic-auth lozinka (rotirana) procurela na GitHub (GitGuardian;
  repo je JAVAN, bila hardkodovana u `middleware.ts`). Rotirana → nova lozinka u **Coolify env**
  (`BASIC_AUTH_USER`/`BASIC_AUTH_PASS`), uklonjena iz koda (placeholder „changeme") i iz svih docs.
  **Nova lozinka je u privatnoj memoriji `reference_katalonski_credentials` — NIKAD u repo.**

---

## 📋 ŠTA OSTAJE / IDEJE ZA DALJE
- **Pun re-test svih 12 tema** sad kad su solveri popravljeni — očekivano skoro čist izveštaj
  (finalna potvrda pred lansiranje). `BASE=https://catala.orbitacode.com BASIC_AUTH=catala:<lozinka> node e2e/qa/run.mjs`
  (lozinka u memoriji `reference_katalonski_credentials`).
- **Slike prodavnica SA tekstom → regen BEZ teksta** (pravilo #2, višejezičnost). PREOSTALO:
  `mercat`, `restaurant`, `farmacia`, `peixeteria`, `verduleria`, `carnisseria`.
  (VEĆ urađeno bez teksta: fleca, fruiteria, cinema.)
- (Opciono) Još zabavnih životinja / novih tipova zabavnih zadataka za uzrast 5-7.
- Dorada solvera: `color-by-instruction` (best-effort), copy-word „poslednja reč" šum, fill-sentence
  višerečeničan (solver ne kompletira uvek — vidi test).
- Težina za 7-godišnjaka (kandidati za pojednostavljenje — korisnica odlučuje): gramatika rod/broj
  (LA/EL/LES/ELS, un/una), dugački MC opisi, decode-grid, separate-words.
- **Rimoteka NEMA svoj CLAUDE.md** (drugi projekat, `~/Desktop/Projects/rimoteka/`) — korisnica je pitala;
  po želji napraviti kompletan projektni CLAUDE.md.

## 🧹 ČIŠĆENJE FOLDERA (pre finalnog lansiranja, uz potvrdu)
Gomila zastarelih/duplih `.png` (stare Bing verzije). `public/illustrations/` ima 440+ `.png` koje
app NE koristi + orphan `.webp` (npr. `a-darrere`, `a-davant`, `gorilla` eng. varijanta). Uporedi sa
`wordsWithIllustrations`. ⚠️ NIKAD trajni `rm` na korisničkim fajlovima — premeštaj u Kantu preko
Findera. Prvo izlistaj, pa potvrda korisnice.

## Reference (memory)
`reference_katalonski_qa_toolkit` · `reference_katalonski_credentials` (lozinka produkcije) ·
`feedback_illustrations_no_text_multilang` · `reference_chatgpt_illustrations_via_chrome` ·
`feedback_no_shortcuts_be_thorough`
