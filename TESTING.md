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
  - 30.07.: 13 od 24 na strani zadatka nije imalo **[A30-07]**
- [ ] Dodirne mete ≥ 44 px (30.07. najmanja 19 px) **[A30-07]**

## 5. Mobilni i širine

- [ ] Bez vodoravnog prelivanja na 320 / 360 / 390 / 1440 px
- [ ] Maskote u donjim uglovima ne prekrivaju dugmad za navigaciju **[A30-07]**
- [ ] Slova i pločice dohvatljive palcem na 320 px

## 6. Stanje, URL i osvežavanje

- [ ] Posle promene zadatka proveriti da li se **URL promenio** (30.07. nije) **[A30-07]**
- [ ] `F5` na zadatku 4 vraća na zadatak 4, ne na 1 **[A30-07]**
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
- [ ] `copy-word` sa **više reči** (`barra de pa`, `pa rodó`): pločica za razmak vidljiva i označena **[A30-07]**
- [ ] `copy-word` sa akcentima (`pa rodó`, `pastís`) rešiv bez fizičke tastature
- [ ] Zadatak se ne završava dok sve reči nisu tačne
- [ ] Provera nije „zadatak odigran" nego **„odgovor tačan po sadržaju"** **[A30-07]**

## 9. Bezbednost

- [ ] Bezbednosna zaglavlja: CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy **[A30-07]**
- [ ] Nijedan `dangerouslySetInnerHTML` ne prima korisnički unos
- [ ] Prava lozinka nikad u praćenim fajlovima (repo je **javan**)

## 10. Posle svakog deploy-a

- [ ] Isti test **ponovo protiv produkcije**
- [ ] Konzola prazna
- [ ] 0 pokvarenih slika
- [ ] Nova provera za svaki popravljen bag — **puštena protiv starog koda da se vidi da pada** **[A30-07]**
