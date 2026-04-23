# QA Pravila za Manuelno Testiranje - Katalonski App

> Ovaj dokument definise PRAVILA i METODOLOGIJU za kompletno manuelno QA testiranje edukativne igre za ucenje katalonskog jezika. Tester MORA da prati ova pravila bez izuzetka.

---

## 1. ZLATNA PRAVILA (NIKAD NE KRSITI)

### 1.0 NIKAD ne menjati kod ili igricu tokom testiranja
- Testiranje sluzi ISKLJUCIVO za proveru - NE za popravke
- NE smes menjati NIJEDAN fajl u src/, public/, ili bilo gde u projektu
- NE smes pisati skripte, solver-e, helper fajlove u projektu
- SVE pronadjene probleme SAMO ZAPISATI u izvestaj
- Popravke se rade TEK NAKON sto korisnik odobri
- Ako pronadjes bug - zapisi ga, nemoj ga popravljati

### 1.1 Testirati kao dete od 8 godina
- Pristupiti SVAKOM zadatku kao da ga vidis PRVI PUT u zivotu
- Ne koristiti nikakvo predznanje o resenjima
- Citati uputstva na katalonskom i pokusati ih razumeti samo iz konteksta
- Klikati slova/opcije jednu po jednu, polako, kao sto bi dete radilo
- Ako nesto nije jasno iz uputstva - to je BUG (dete od 8 god nece razumeti nejasno uputstvo)

### 1.2 Svaka rec se testira pojedinacno
- NE preskakati reci unutar zadatka
- NE koristiti "Seguent" dugme da se predje na sledeci zadatak dok trenutni nije POTPUNO zavrsen
- Svaka rec = jedan mini-test (slika, spelling, zvuk, feedback)
- NIKAD ne automatizovati unos - svako slovo/opcija se klika rucno

### 1.3 Svaki zadatak se testira kompletno
- Popuniti SVE reci/pitanja u zadatku
- Proveriti SVE opcije (i tacne i netacne)
- Testirati error handling (namerno pogresiti bar jednom po zadatku)
- Proveriti da se bodovi pravilno dodeljuju
- Proveriti da se prelazi na sledecu rec/pitanje automatski

### 1.4 Dokumentovati SVE nalaze
- Za svaku temu voditi detaljan izvestaj
- Svaka rec koja ima problem = zaseban unos u izvestaju
- Ukljuciti: tema, zadatak #, rec, tip problema, ocekivano vs dobijeno

---

## 2. STA SE PROVERAVA ZA SVAKU REC

### 2.1 Ilustracija (slika)
- [ ] Da li slika postoji? (prazno mesto = KRITICNI BUG)
- [ ] Da li slika JASNO prikazuje rec? (dete od 8 god mora odmah da prepozna sta je na slici)
- [ ] Da li slika odgovara reci? (npr. "llapis" = olovka, ne hemijska olovka)
- [ ] Da li je slika mutnа/blurry? (posebno donja polovina - cest problem kod AI generisanih slika)
- [ ] Da li slika ima lice na predmetu? (ZABRANJENO - predmeti NE SMEJU imati oci/usta)
- [ ] Da li su boje odgovarajuce? (unisex boje osim za zensku odecu)
- [ ] Da li je stil konzistentan sa ostalim slikama u temi?

### 2.2 Tekst i spelling
- [ ] Da li je rec pravilno napisana na katalonskom?
- [ ] Da li ima sve potrebne akcente? (à, è, é, í, ò, ó, ú, ü, ç, l·l)
- [ ] Da li je hint (ako postoji) tacne duzine? (broj blanks = broj slova u reci)
- [ ] Da li su uputstva gramaticki ispravna na katalonskom?
- [ ] Da li su opcije za odgovor pravilno napisane?

### 2.3 Interakcija
- [ ] Da li klik na slovo/opciju reaguje odmah? (kasnjenje > 300ms = problem)
- [ ] Da li se popunjeni slotovi prikazuju pravilno?
- [ ] Da li se moze kliknuti na popunjen slot da se ukloni slovo? (undo funkcija)
- [ ] Da li "Comprova!" dugme radi? (ili auto-check)
- [ ] Da li tacan odgovor daje zeleni feedback + confetti?
- [ ] Da li pogresan odgovor daje crveni feedback + ohrabrujucu poruku?
- [ ] Da li se posle greske moze ponovo pokusati?
- [ ] Da li se automatski prelazi na sledecu rec posle tacnog odgovora?

### 2.4 Audio (ako postoji)
- [ ] Da li speaker dugme reproducira izgovor reci?
- [ ] Da li je izgovor tacan?
- [ ] Da li se automatski reproducira izgovor posle tacnog odgovora?

### 2.5 Bodovanje
- [ ] Da li se XP dodaje posle zavrsenog zadatka?
- [ ] Da li se zvezda dodaje posle zavrsenog zadatka?
- [ ] Da li se streak pravilno broji?

---

## 3. STA SE PROVERAVA ZA SVAKI ZADATAK (task level)

### 3.1 Uputstvo
- [ ] Da li je uputstvo jasno za dete od 8 godina?
- [ ] Da li uputstvo objasnjava STA treba uraditi?
- [ ] Da li speaker dugme pored uputstva radi?
- [ ] Da li je uputstvo na katalonskom gramaticki ispravno?

### 3.2 Tezina
- [ ] Da li je zadatak primerene tezine za dete od 8 god?
- [ ] Da li postoji progresija tezine unutar teme? (laki zadaci prvo, tezi posle)
- [ ] Da li je zadatak prejednostavan? (npr. samo 2 opcije gde je ocigledno koja je tacna)
- [ ] Da li je zadatak pretezak? (npr. previse slova/opcija bez ikakve pomoci)

### 3.3 Navigacija
- [ ] Da li "Anterior" dugme vraca na prethodni zadatak?
- [ ] Da li se progress bar azurira?
- [ ] Da li brojac (X/Y) ispravno prikazuje poziciju?
- [ ] Da li se na kraju teme prikazuje celebracija?

### 3.4 Error handling
- [ ] Namerno pogresiti - da li feedback jasno pokazuje gresku?
- [ ] Da li se posle greske moze ponovo pokusati BEZ resetovanja celog zadatka?
- [ ] Da li maskota daje ohrabrujucu poruku na katalonskom?
- [ ] Da li se greska belezi u error tracking sistem?

---

## 4. STA SE PROVERAVA ZA SVAKU TEMU (theme level)

### 4.1 Sadrzaj
- [ ] Koliko zadataka ima tema?
- [ ] Koliko razlicitih tipova zadataka?
- [ ] Da li su svi zadaci relevantni za temu? (npr. tema "Telo" ne bi trebalo da ima zadatke o hrani)
- [ ] Da li ima duplikata? (iste reci/zadaci koji se ponavljaju)
- [ ] Da li ima reci koje nedostaju a trebalo bi da budu tu?

### 4.2 Balans
- [ ] Da li tema ima dovoljno zadataka u poredjenju sa drugim temama?
- [ ] Da li ima raznolikost tipova zadataka? (ne samo copy-word)
- [ ] Da li su samoprocena (self-assessment) zadaci na kraju teme?

### 4.3 Zavrsavanje teme
- [ ] Da li se prikazuje celebracija na kraju?
- [ ] Da li se nudi pregled gresaka?
- [ ] Da li se progress sacuva u localStorage?
- [ ] Da li se tema oznacava kao zavrsena na pocetnoj strani?

---

## 5. TIPOVI ZADATAKA - SPECIFICNA PRAVILA TESTIRANJA

### 5.1 copy-word
- Klikati slova u TACNOM redosledu (L→L→A→P→I→S za "llapis")
- Proveriti da su slova pomijesana u ponudjenim dugmadima
- Proveriti da svaka rec ima odgovarajucu sliku iznad
- Namerno kliknuti pogresno slovo i proveriti error handling
- Proveriti da se popunjen slot moze kliknuti za undo

### 5.2 fill-letters
- Aktivni blank ima zelenu isprekidanu ivicu
- Kliknuti na ponudjeno slovo da se popuni blank
- Proveriti da hint duzina odgovara duzini reci
- Namerno staviti pogresno slovo i proveriti retry

### 5.3 unscramble
- Slogovi su pomijesani - kliknuti ih u tacnom redosledu
- Proveriti da klik na postavljeni slog ga uklanja
- Proveriti da "Comprova!" dugme radi

### 5.4 matching
- Kliknuti levi element pa desni (ili obrnuto)
- Proveriti da tacan par postane zelen
- Proveriti da pogresan par flashne crveno pa se resetuje
- Proveriti drag-and-drop ako je dostupan

### 5.5 classify-columns
- Kliknuti na krug kolone ili prevuci rec
- Proveriti da su kategorije jasne
- Proveriti da je svaka rec u tacnoj kategoriji

### 5.6 word-search
- Kliknuti na prvo slovo, zatim na poslednje slovo reci
- Proveriti da SVE navedene reci ZAISTA postoje u gridu
- Proveriti da pronadjene reci dobiju boju i precrtavanje

### 5.7 fill-sentence
- Izabrati tacan odgovor iz dropdown-a ili opcija
- Proveriti da recenica ima smisla sa izabranim odgovorom
- Proveriti gramatiku cele recenice

### 5.8 multiple-choice
- Procitati pitanje i sve opcije
- Proveriti da je tacan odgovor ZAISTA tacan
- Proveriti da su pogresni odgovori razumno pogresni (ne ocigledno besmisleni)

### 5.9 self-assessment
- Tri dugmeta: Si (zeleno), Mes o menys (zuto), No (crveno)
- Proveriti da svaka rec ima sliku i prevod
- Proveriti da se uvek moze zavrsiti (nema tacnog/pogresnog)

### 5.10 color-by-instruction
- Procitati uputstvo na katalonskom
- Izabrati boju iz palete
- Kliknuti na predmet
- Proveriti da tacna boja daje zelenu ivicu

### 5.11 label-image
- Prevuci etiketu na odgovarajuce mesto na slici
- Ili klikni na etiketu pa na slot
- Proveriti da row-flexible provera radi (isti red = zamenjivo)

### 5.12 drawing-canvas
- Nacrtati nesto na canvasu
- Promeniti boju i velicinu cetkice
- Kliknuti "He acabat!" da se zavrsi
- Uvek se zavrsava (slobodna aktivnost)

### 5.13 add-article
- Izabrati tacan clan (el/la/un/una/l'/els/les)
- Proveriti da clan odgovara rodu i broju imenice

### 5.14 separate-words
- Kliknuti na mesta gde se reci razdvajaju
- Proveriti da razdvojene reci imaju smisla

### 5.15 count-and-write
- Uneti broj u input polje
- Proveriti da je tacan odgovor zaista korektan

### 5.16 write-antonym
- Uneti antonim u input polje
- Proveriti da je trazeni antonim zaista suprotan

### 5.17 order-words
- Prevuci ili klikni reci u tacnom redosledu
- Proveriti da formirana recenica ima smisla

### 5.18 decode-grid
- Koristiti tabelu kodova da dekodiras poruku
- Proveriti da dekodirana poruka ima smisla na katalonskom

---

## 6. FORMAT IZVESTAJA

Za SVAKU temu napraviti izvestaj u sledecem formatu:

```
## Tema X: [Naziv teme]
**Ukupno zadataka:** X
**Tipovi zadataka:** [lista]
**Ukupno reci/pitanja:** X

### Zadatak X.Y: [Tip zadatka] - "[Uputstvo]"

#### Rec "xyz" (Z/N od ukupno)
- Ilustracija: OK / NEDOSTAJE / POGRESNA / MUTNA
- Spelling: OK / GRESKA (detalj)
- Interakcija: OK / BUG (detalj)
- Audio: OK / NE RADI / NEMA
- Napomena: [bilo sta neocekivano]

#### Error test:
- Namerna greska: [sta se desilo]
- Retry: [da li radi]
- Feedback: [sta maskota kaze]

### Rezime teme:
- Kriticni bagovi: X
- Srednji bagovi: X
- Sitni problemi: X
- Pozitivno: [sta je dobro]
- Preporuke: [sta popraviti]
```

---

## 7. KLASIFIKACIJA BAGOVA

### KRITICNI (P0) - Blokiraju koristenje
- Zadatak se ne moze zavrsiti
- Aplikacija se rusi/zamrzava
- Tacan odgovor se oznacava kao pogresan
- Pogresan odgovor se oznacava kao tacan
- Nedostaje slika za rec u zadatku gde je slika NEOPHODNA

### SREDNJI (P1) - Funkcionise ali sa problemima
- Slika ne odgovara reci (npr. slika jabuke za "kruska")
- Spelling greska u reci ili uputstvu
- Gramaticka greska na katalonskom
- Error handling ne radi (posle greske nema retry)
- Audio ne radi za neku rec
- Bodovi se ne dodeljuju

### SITNI (P2) - Kozmeticki/UX problemi
- Slika je blurry ali prepoznatljiva
- Animacija ne radi glatko
- Tekst je presitan za dete
- Nekonzistentan stil ilustracija
- Tekst uputstva moze biti jasniji

### SUGESTIJE (P3) - Poboljsanja
- Zadatak je prelak/pretezak
- Nedovoljno raznolikosti tipova zadataka
- Tema ima premalo/previse zadataka
- Duplirani sadrzaj

---

## 8. REDOSLED TESTIRANJA

1. **Tema 1: La classe** (ucionica) - 20 zadataka
2. **Tema 2: L'escola** (skola) - 20 zadataka
3. **Tema 3: El cos** (telo) - 20 zadataka
4. **Tema 4: La roba** (odeca) - 19 zadataka
5. **Tema 5: La casa** (kuca) - 24 zadataka
6. **Tema 6: La familia** (porodica) - 16 zadataka
7. **Tema 7: Les botigues** (prodavnice) - 20 zadataka
8. **Tema 8: El menjar** (hrana) - 21 zadataka
9. **Tema 9: Els animals** (zivotinje) - 21 zadataka
10. **Tema 10: La ciutat** (grad) - 15 zadataka
11. **Tema 11: Els vehicles** (vozila) - 12+1 zadataka
12. **Tema 12: Els oficis** (zanimanja) - 15 zadataka

**Ukupno: ~223 zadataka**

---

## 9. BEST PRACTICES IZ INDUSTRIJE (QA za edukativne igre za decu)

### 9.1 Heuristicki principi (Jakob Nielsen + deca)
1. **Vidljivost statusa** - Dete mora u svakom trenutku da zna gde je (progress bar, brojac)
2. **Poklapanje sa realnim svetom** - Slike moraju biti prepoznatljive, ne apstraktne
3. **Kontrola i sloboda** - Undo mora biti lak (klik na slot da se ukloni slovo)
4. **Konzistentnost** - Isti tip zadatka radi isto u svim temama
5. **Prevencija gresaka** - Bolje spreciti gresku nego oporaviti se od nje
6. **Prepoznavanje > secanje** - Opcije vidljive, ne pamtiti ih napamet
7. **Fleksibilnost** - Radi i sa misem i sa touch-om
8. **Estetski minimalisticki dizajn** - Bez nepotrebnih elemenata koji odvlace paznju
9. **Pomoc u oporavku od gresaka** - Jasna poruka sta nije tacno + mogucnost ponovnog pokusaja
10. **Pomoc i dokumentacija** - Uputstva jasna, hint sistem dostupan

### 9.2 Specificno za edukativne igre
- **Pozitivan ton** - Nikad "Pogresno!", uvek "Pokusaj ponovo!" sa ohrabrenjem
- **Progresivna tezina** - Laki zadaci prvo da izgrade samopouzdanje
- **Vizuelni feedback** - Deca reaguju na boje, animacije, zvukove
- **Kratki zadaci** - Dete gubi paznju posle 3-5 minuta na istom zadatku
- **Nagrada za trud** - XP i za pokusaj, ne samo za tacan odgovor
- **Bez kaznjavanja** - Nikad ne oduzimati bodove za greske

### 9.3 Accessibility za decu
- Dugmad minimum 44x44px (Apple HIG)
- Font minimum 16px, bolje 18-20px
- Visok kontrast tekst/pozadina
- Jasne boje za feedback (zelena=tacno, crvena=pogresno)
- Alternativni tekst za sve slike
- Radi bez zvuka (vizuelni feedback dovoljan)

---

## 10. CHECKLIST PRED SVAKU SESIJU TESTIRANJA

- [ ] Dev server pokrenut (`npm run dev`)
- [ ] Browser otvoren na localhost:3000
- [ ] localStorage obrisan (`localStorage.clear()`)
- [ ] Overlay elementi uklonjeni (PWA prompt, daily reward)
- [ ] Zvuk ukljucen (za testiranje audio-a)
- [ ] Ovaj dokument otvoren kao referenca
- [ ] Izvestaj pripremljen za unosenje nalaza
