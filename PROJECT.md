# Katalonski - Interaktivna Radna Sveska za Decu

## Vizija
Premium web aplikacija za ucenje katalonskog jezika za decu uzrasta 5-8 godina. Bazirana na fizickoj radnoj svesci, ali transformisana u modernu, game-like interaktivnu platformu sa 3D cartoon estetikom.

## Problem
Deca koja uce katalonski jezik nemaju pristupacnu, zabavnu digitalnu platformu. Postojeca fizicka radna sveska je odlican materijal, ali nije interaktivna, ne daje feedback, i ne moze se deliti.

## Resenje
Engine-based web aplikacija koja prikazuje razlicite tipove zadataka kroz 12 tematskih celina. Svaki zadatak se renderuje dinamicki iz JSON podataka, sto omogucava lako dodavanje novih tema i sadrzaja bez programiranja novih komponenti.

## Ciljevi

### Primarni
- Dete moze da uci katalonski kroz igru, bez osecaja "ucenja"
- Kompletna digitalizacija svih 12 tema iz fizicke radne sveske
- Motivacioni sistem (nagrade, bedževi, maskota) drzi paznju deteta
- Mobile-first pristup - radi savrseno na tabletu i telefonu

### Sekundarni
- Roditelji mogu da prate napredak deteta
- Deljenje sa drugom decom iz skole (link + pristupni podaci)
- Izgovor katalonskih reci kroz Text-to-Speech
- Offline podrska (PWA) - later phase

## Ciljna publika
- **Primarno:** Deca 5-8 godina koja uce katalonski
- **Sekundarno:** Roditelji koji zele da prate napredak
- **Kontekst:** Deca u skolama gde se uci katalonski, posebno deca ciji maternji jezik nije katalonski

## Kljucne funkcionalnosti

### 12 Tematskih celina
1. La classe (Ucionica)
2. L'escola (Skola)
3. El cos (Telo)
4. La roba (Odeca)
5. La casa (Kuca)
6. La familia (Porodica)
7. Les botigues (Prodavnice)
8. El menjar (Hrana)
9. Els animals (Zivotinje)
10. La ciutat (Grad)
11. Els vehicles (Vozila)
12. Els oficis (Zanimanja)

### Tipovi zadataka (Engine komponente)
- **CopyWord** - Procitaj i prepisi rec (slika + input)
- **FillLetters** - Dopuni slova u reci (_ _ A _ _)
- **Unscramble** - Poredi slova/reci u pravilnom redosledu
- **Matching** - Povezi sliku sa recju (drag & drop ili click)
- **ClassifyColumns** - Klasifikuj u kategorije (UN/MOLTS, masculi/femeni)
- **WordSearch** - Pronadji reci u mrezi slova (sopa de lletres)
- **ColorByInstruction** - Oboji prema uputstvu
- **FillSentence** - Dopuni recenicu
- **LabelImage** - Oznaci delove na slici
- **MultipleChoice** - Odaberi tacan odgovor
- **DrawingCanvas** - Slobodno crtanje (opciono)
- **SelfAssessment** - Samoprocena (semafor sistem)

### Motivacioni sistem
- Animacije za tacan odgovor (konfete, vatromet, baloni)
- Zvucni feedback (ding/pop, moze se iskljuciti)
- Streak/Combo sistem za uzastopne tacne odgovore
- Bedževi i trofeji po temi ("Master of La classe")
- Kolekcionarski sistem (zvezdice, stikeri)
- Celebratory ekran na kraju teme

### Maskota
Simpatican 3D crtani lik koji se pojavljuje sa porukama:
- Tacan odgovor: "Bravo! Super si!"
- Greska: "Ups! Probaj ponovo!"
- Stagnacija: "Hajde, mozemo mi to!"
- Razliciti izrazi lica (srecan, zbunjen, navija)

## Pristup
- **URL:** katalonski.orbitacode.com (subdomen)
- **Auth:** Basic authentication (user/password)
- **Progress:** localStorage (later: user accounts)

## MVP Scope
Kompletan flow za 1 temu (La classe):
- Home stranica sa grid-om od 12 tema
- Tema stranica sa lesson flow-om (8-12 taskova)
- Svi tipovi zadataka implementirani
- Motivacioni sistem aktivan
- Maskota integrisana
- Basic auth
- Deploy na Coolify

## Tech Stack
- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animacije:** Framer Motion + Canvas konfete
- **Audio:** Web Audio API + Web Speech API (TTS za katalonski)
- **Data:** JSON fajlovi za sadrzaj zadataka
- **Deploy:** GitHub + Coolify
- **Domain:** katalonski.orbitacode.com
