# TESTING.md — čeklista provera za Katalonski

> **Šta** se proverava. **Kako** se radi audit stoji u `~/.claude/AUDIT-PROTOKOL.md`.
> Koriste se zajedno.
>
> **Pravilo:** svaka sesija koja otkrije novu stavku za proveru MORA je dodati ovde.
> Svaki popravljen bag dobija stavku, inače se vraća.
>
> Nastalo iz prvog audita, 30.07.2026. Stavke označene **[A30-07]** nastale su iz tog audita.

## Kako se pokreće

```bash
# PRE-DEPLOY KAPIJA — deploy je dozvoljen SAMO ako prođe (izlazni kod 0)
npm run predeploy                 # protiv lokalnog builda
npm run predeploy:prod            # protiv produkcije (posle deploy-a, obavezno)

# QA runner — odigra svaki zadatak kao dete
node e2e/qa/run.mjs                      # lokalno, traži dev server
node e2e/qa/run.mjs la-classe            # jedna tema
BASE=https://catala.orbitacode.com BASIC_AUTH=catala:<lozinka> node e2e/qa/run.mjs

# Lozinka NIJE u repo-u (repo je javan) — stoji u privatnoj memoriji
# reference_katalonski_credentials i u Coolify env.

npx tsc --noEmit          # tipovi
npx eslint src/           # lint
npm run build             # da se build ne kvari
```

**Vremensko ograničenje:** nijedna tema ne sme da traje duže od **200 s**. Ako traje —
prekinuti je i pustiti preostale pojedinačno. Zaglavljen prolaz nije obavljen posao. **[A30-07]**

---

## 1. Sadržaj i poklapanje sa sveskom (pravilo #1)

- [ ] Svaka reč, rečenica i ilustracija iz `Svi zadaci/` postoji u `src/data/`
- [ ] Nijedna reč u kodu ne odstupa od sveske bez pitanja vlasnici
- [ ] **Prompt zadatka nabraja tačno ono što zadatak nudi** — nijedan član/opcija više ni manje **[A30-07]**
  - proveriti sve `add-article`, `classify-columns`, `multiple-choice`, `fill-sentence`
  - merilo prvo pustiti na poznatom slučaju (jedan prolazi, jedan pada) **[A30-07]**
- [ ] Brojevi (zadataka, reči, ilustracija) **prebrojani u fajlu**, nikad iz glave
- [ ] ID-jevi zadataka nemaju rupe (`les-botigues-13` fali) **[A30-07]**
- [ ] Komentar „workbook: …" iznad zadatka zaista odgovara toj vežbi iz sveske **[A30-07]**

## 2. Rubni slučajevi koji ruše aplikaciju **[A30-07]**

- [ ] **`localStorage` potpuno zabranjen** (privatni prozor, školski pregledač) — sve strane rade
  ```js
  await page.addInitScript(() => {
    const baci = () => { throw new DOMException('The operation is insecure.','SecurityError'); };
    Object.defineProperty(window,'localStorage',{get:baci,configurable:true});
  });
  ```
- [ ] **Samo UPIS baca** — mora da radi (ovo je oborilo početnu 30.07.)
- [ ] **Samo ČITANJE baca** — mora da radi
- [ ] **Pokvaren sadržaj** (`{nije-json`) u svim `catala-*` ključevima — mora da radi
- [ ] Svaki `localStorage.setItem`/`removeItem` u `src/lib/` ima `try/catch`

## 3. Performanse

- [ ] TTFB < 0,5 s na produkciji (izmereno 30.07.: 0,18–0,34 s)
- [ ] LCP < 2,5 s na punoj brzini, < 3 s na 4G
- [ ] **CLS < 0,1 na SVAKOJ strani** — 30.07. početna je imala 0,167 **[A30-07]**
- [ ] Nijedan element se ne pomera više od 20 px posle učitavanja **[A30-07]**
  - meriti Y kartice teme kroz 7 s; 30.07. skakala 170 → 300 px
- [ ] Meriti i **kad strana postane upotrebljiva**, ne samo kad se iscrta
- [ ] Obavezno emulirati 4G (1,6 Mb/s, 150 ms)

## 4. Pristupačnost

- [ ] Kontrast ≥ 4,5:1 (≥ 3:1 za veliki tekst) — **uključujući dugmad i polja sa upisanom vrednošću**
- [ ] Kontrast proveriti **pikselima** kad je pozadina sumnjiva (gradijent laže merač) **[A30-07]**
- [ ] Dugme „Següent" — 30.07. imalo 1,96:1 **[A30-07]**
- [ ] `Tab` kroz celu stranu: svaki fokusiran element ima **vidljiv** fokus
  - 30.07.: 13 od 24 na strani zadatka nije imalo; popravljeno 31.07. globalnim
    `:focus-visible` pravilom. **Pazi na `outline-none` u klasama** — tamo fokus mora
    ići preko `box-shadow`, `outline` bi bio pregažen. **[A30-07]**
- [ ] Dodirne mete ≥ 44 px (30.07. najmanja 19 px) **[A30-07]**
  - prekidači: izgled se NE menja, dodirna zona se širi pseudoelementom
    (`after:-inset-y-2`), inače se šarena traka razvuče **[A31-07]**

## 5. Mobilni i širine

- [ ] Bez vodoravnog prelivanja na 320 / 360 / 390 / 1440 px
- [ ] Maskote u donjim uglovima ne prekrivaju dugmad za navigaciju **[A30-07]**
- [ ] Slova i pločice dohvatljive palcem na 320 px

## 6. Stanje, URL i osvežavanje

- [ ] Posle promene zadatka **URL se menja** u `?tasca=N` (1-based) **[A30-07]**
- [ ] `F5` na zadatku 4 vraća na zadatak 4, ne na 1 **[A30-07]**
- [ ] Deljiv link `?tasca=7` otvara sedmi zadatak; besmislena vrednost se ignoriše **[A31-07]**
- [ ] „Nazad" ide korak po korak (4→3→2→1), a sa prvog zadatka na početnu **[A31-07]**
  - u testu NE osvežavati stranu pre `goBack` — `reload` pomeri istoriju i nalaz bude lažan **[A31-07]**
- [ ] Dugme „Nazad" vodi na prethodni zadatak, ne iz teme
  - test **mora** da krene sa početne strane, inače nema istorije i nalaz je lažan **[A30-07]**
- [ ] Napredak preživi osvežavanje, ne samo prelazak na sledeći zadatak

## 7. Maskote **[A30-07]**

- [ ] Devojčica u **donjem levom**, dečak u **donjem desnom** uglu
- [ ] Provera na strani gde roditelj ima `transform` (npr. zadatak 6, `classify-columns`) —
      `position: fixed` tada puca ako nema portala u `<body>`
- [ ] Providnost stabilna (mereno kroz 10 uzoraka; ne sme da pulsira)
- [ ] Pomeraj po visini ≥ 8 px kroz 3 s (inače se „ne vidi da se mrdaju")
- [ ] Reakcija na ćutanje: posle 20 s bez dodira oba lika postanu `duh`
- [ ] Prvi dodir vraća likove u mirno stanje
- [ ] Slike se stvarno učitavaju (`naturalWidth > 0`), ne samo da `<img>` postoji

## 8. Zadaci — po tipu

- [ ] Svih 19 tipova odigrati bar jednom
- [ ] `copy-word` sa **više reči** (`barra de pa`, `pa rodó`): pločica za razmak ima crticu i `aria-label="espai"` **[A30-07]**
- [ ] `copy-word` sa akcentima (`pa rodó`, `pastís`) rešiv bez fizičke tastature
- [ ] Zadatak se ne završava dok sve reči nisu tačne
- [ ] Provera nije „zadatak odigran" nego **„odgovor tačan po sadržaju"** **[A30-07]**

## 9. Bezbednost

- [ ] Bezbednosna zaglavlja: CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy **[A30-07]**
- [ ] **Mikrofon mora ostati dozvoljen** (`microphone=(self)`) — samoprocena govora **[A31-07]**
- [ ] Posle svake izmene CSP-a proveriti da fontovi i slike i dalje stižu **[A31-07]**
  - servisni radnik SAM preuzima fontove; njegov `fetch` potpada pod `connect-src`,
    ne pod `font-src`. Prva verzija CSP-a je zbog toga oborila fontove na svih 12 tema.
- [ ] Nijedan `dangerouslySetInnerHTML` ne prima korisnički unos
- [ ] Prava lozinka nikad u praćenim fajlovima (repo je **javan**)

## 10. Posle svakog deploy-a

- [ ] Isti test **ponovo protiv produkcije**
- [ ] Konzola prazna
- [ ] 0 pokvarenih slika
- [ ] Nova provera za svaki popravljen bag — **puštena protiv starog koda da se vidi da pada** **[A30-07]**

## Širina i vidljivost na ekranu (dodato 03.08.2026, nalaz S6)

- [ ] Na 1512 px okvir zadatka (`main.task-shell`) koristi **bar 70% širine ekrana**.
- [ ] `la-classe?tasca=9`: svih 5 kartica u **jednom redu** (isto rastojanje od vrha).
- [ ] `la-classe?tasca=8`: cela strana staje bez pomeranja (`scrollHeight` = `innerHeight`).
- [ ] „Sopa de lletres" na 1512 px: mreža slova vidljiva **bez pomeranja**, spisak reči pored nje.
- [ ] Dugme „Comprova!" vidljivo bez pomeranja u svakom zadatku (lepi se za dno).
- [ ] Na 390 px kartice se same slažu u novi red, bez vodoravnog klizača.
- [ ] Maskote **ne prekrivaju** traku sa dugmadima (donja ivica lika iznad vrha trake).
- [ ] Nijedna maskota nije providna ni u jednom stanju (`opacity` slike = 1), ni posle
      20 s mirovanja.

**Automatski:** `BASE=http://localhost:3000 node e2e/predeploy.mjs` → provera 12 („Zadatak
koristi širinu ekrana"). Puštena protiv starog koda: **pada** (672 px, 44%).

## Maskote — treptaj (dodato 03.08.2026)

- [ ] U mirnom stanju oba lika **trepću**, svaki u svom ritmu (3–6 s), ne istovremeno.
- [ ] Treptaj traje oko 0,14 s — dovoljno da se primeti, prekratko da smeta.
- [ ] Pri smeni kadra glava se **ne pomera** ni za piksel (kadar je nastao iz iste slike).
- [ ] Sa uključenom sistemskom postavkom „manje pokreta" lik **ne trepće** uopšte.
- [ ] Kadar sa zatvorenim očima postoji samo za `let-oblaci` i `poza`; za ostale
      varijante lik prosto ne trepće i to nije greška.

**Kako se pravi novi kadar:** `python3 scripts/napravi-treptaj.py` (u fajlu je tabela
`SARENICE` sa izmerenim granicama šarenice po slici).


## Tačke na slici (`label-image`) — položaj mora da stoji (dodato 14.08.2026)

- [ ] Pritisni **svaku** tačku po dva-tri puta pa izmeri gde je. Pomak sme biti **0 px**.
      Provera u kodu: `document.querySelectorAll("[data-drop-target^='slot-']")` →
      `getBoundingClientRect()` pre i posle klikova.
- [ ] Sama slika se **ne da odvući** (nema providne senke kad se povuče mišem).
- [ ] Svaka tačka stoji tačno na onome što imenuje — **pogledati u ekran**, ne verovati
      koordinatama u podacima.

> **Zamka koja je ovo izazvala:** ako je tačka jedno dugme koje i stoji na mestu
> (`transform: translate(-50%,-50%)`) i animira se na dodir (Framer `whileTap`),
> animacija piše u to isto polje `transform` i **obriše položaj** — tačka odskoči i
> „šeta" po slici. Položaj i animacija moraju biti na **dva odvojena elementa**.

## Reči u zadatku — sve iz sveske (dodato 14.08.2026)

- [ ] Svaka reč koja se traži od deteta postoji u svesci (`Svi zadaci/<tema>/`).
      Dodata reč koju sveska ne pominje je greška, i kad je tačna — deca uče
      redosledom kojim su profesori pisali.

---

## Zadatak mora biti REŠIV, ne samo „odigran" (dodato 24.08.2026)

> Nastalo iz prijave vlasnice: tema 5, zadatak 17 — dete dobije `banyera`, a na
> ekranu stoje samo `Dormitori` i `Sala d'estar`. Tačan odgovor nije postojao.
> Podaci su bili ispravni; kolone se prosto nisu iscrtavale.

**Automatski (u pre-deploy testu, BLOK):**
```bash
node scripts/proveri-razvrstavanje.mjs     # NEREŠIVO: 0
```
Traži: reč koja ne pripada nijednoj koloni · reč čija se kolona **ne iscrtava**
(`circleMode` crta samo prve dve!) · reč u dve kolone · stavka u koloni koje
nema u `allItems`.

**Ručno, za SVAKI tip zadatka — ne samo za razvrstavanje:**

- [ ] **Prebroj izbore na ekranu i uporedi ih sa podacima.** Kad komponenta ima
      režim prikaza koji uzima samo deo (prve dve kolone, prvih šest slika,
      prvi red) — mora se poklopiti sa onim što je u podacima.
- [ ] **Odigraj zadatak TAČNO do kraja**, ne samo „klikni nešto". Zadatak koji
      se odigra a ne može da se reši tačno test propušta kao ispravan.
- [ ] Posle poslednjeg tačnog odgovora: **da li se prelazi na sledeći zadatak**
      i da li se adresa (`?tasca=N`) promenila.

## Slika postoji, a dete je ne vidi (dodato 24.08.2026)

> Nastalo iz prijave: „zadatak 16 nema nijednu sličicu, a mislim da imamo svaku
> reč". Imali smo četiri od pet — samo se nisu prikazivale.

**Automatski (UPOZORENJE):**
```bash
node scripts/proveri-parove-bez-slike.mjs  # SAKRIVENIH SLIKA: 0
```

- [ ] Postojeća provera `proveri-slike.mjs` traži reči **BEZ** slike i preskače
      tip `matching` u celini. **Svaku proveru pusti i iz suprotnog smera** —
      „šta imamo a ne koristimo", ne samo „šta nam fali".
- [ ] Kad je odgovor **rečenica** („És a la teulada"), slika se ne nalazi sama —
      mora se imenovati poljem `rightImage` u paru.
- [ ] `rightTextOnly` ne sme da pregazi ručno imenovanu sliku.

## Nova ilustracija — šta se gleda pre ugradnje (dodato 24.08.2026)

- [ ] **Nijedno slovo na slici.** (Stara `escala` je imala natpis „ESCALA" —
      takva slika se ne može deliti za druge jezike.)
- [ ] **Ne liči na drugu reč iz iste teme.** Stara `teulada` je imala dimnjak,
      pa je bila skoro ista kao `xemeneia`. Provera: otvori obe slike jednu do
      druge, ne sudi po imenu fajla.
- [ ] **Samo traženi predmet.** Bicikl, alat i saksije u garaži su reči koje
      dete zna iz drugih tema — zbunjuju.
- [ ] **Opiši šta vidiš, ne šta liči.** Dva okrugla svetla na autu su farovi,
      ne oči. (Moja greška 24.08.)
- [ ] Posle ugradnje **podigni `catala-vN` u `public/sw.js`** — inače dete na
      tabletu i dalje gleda staru sliku.
