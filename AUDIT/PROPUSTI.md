# Dnevnik propusta — Katalonski

> Spisak nalaza kaže *šta je pokvareno*. Ovaj dnevnik kaže *zašto to nismo videli*.
> Drugo je vrednije, jer sprečava celu klasu grešaka.
>
> Upisuje se **svaki** sopstveni propust — i kad ga otkrije vlasnica, i kad ga otkrije
> sledeća sesija, i kad ga otkrije sam Claude. Bez izuzetka i bez ulepšavanja.
> Ako se isti propust ponovi drugi put, **pravilo se prepisuje**, ne dodaje novo.

---

## 30.07.2026. — Presudio sam o materijalu koji nisam pogledao

**Šta je promašeno:** zaključio sam da je set maskota iz `_ARHIVA-AI-GENERACIJE` „već
iskorišćen" i da posao ne treba raditi. Vlasnica je rekla da postoje superheroji. Bila je u
pravu: 24 slike (12 varijanti dečaka + 12 devojčice), potpuno neupotrebljene.

**Zašto:** uporedio sam **heševe** (dHash) arhive sa slikama projekta, video da se 12 zvezdica
poklapa sa `public/levels/`, i presudio. Od 134 fajla „bez para" **nisam otvorio nijedan**.

**Pravilo:** heš meri sličnost, ne sadržaj i ne vrednost. Tvrdnja „tu nema ničeg novog" je
tvrdnja o sadržaju i dokazuje se **samo pogledom na slike**. Kad se ocenjuje folder slika:
napraviti kontakt list (PIL montaža, 6 kolona, labele) i **pročitati ga kao sliku**. Kod 100+
fajlova to su 3–4 lista — jeftinije od jedne pogrešne presude. Isto važi za svaki materijal
koji se „ocenjuje bez otvaranja": PDF, video, izvoz baze.

---

## 30.07.2026. — Prijavio sam bag koji ne postoji, jer sam snimio ekran prerano

**Šta je promašeno:** prijavio sam vlasnici da zadatak 12 (`add-article`) prikazuje praznu
stranu. Ne prikazuje. U produkciji se iscrta za **200 ms**; ja sam snimio ekran unutar tog
prozora, i to u dev režimu gde je sporije (300–450 ms).

**Zašto:** merio sam **jednom**, odmah posle klika, i to na dev serveru. Nisam pitao „da li je
ovo trajno stanje ili trenutak u iscrtavanju", niti sam proverio na produkciji.

**Pravilo:** nalaz „prazno / ne prikazuje se / ne radi" **mora** da se uzorkuje kroz vreme
(bar 5 uzoraka kroz 2 s) i **mora** da se potvrdi na produkcijskom buildu. Dev sa Turbopackom
nije merodavan za brzinu iscrtavanja. Jedan snimak ekrana nije merenje.

---

## 30.07.2026. — Moj merni alat je lagao dvaput u istom prolazu

**Šta je promašeno:** skripta koja proverava da li `add-article` promptovi nabrajaju tačno one
članove koji se nude prijavila je **3 lažna nalaza** — jer je regex hvatao `l'` iz same reči
„**l'**article" u tekstu prompta. Posle ispravke ostao je jedan stvaran.

**Zašto:** napisao sam merilo i odmah poverovao njegovom izlazu. Nisam ga pustio na slučaju
za koji unapred znam odgovor.

**Pravilo:** svako novo merilo se prvo pusti na **poznatom slučaju** (jedan koji sigurno
prolazi i jedan koji sigurno pada). Merilo koje nije provereno na poznatom odgovoru nije
merilo nego pretpostavka. Ovo je isti obrazac kao promašeni kontrast polja iz protokola:
selektor koji ne hvata ono što treba tiho vraća „sve je u redu".

---

## 30.07.2026. — Pokrenuo sam pravi Google Chrome nad Playwright profilom vlasnice

**Šta je promašeno:** tražeći profil u kome je vlasnica prijavljena na ChatGPT, skripta je
imala niz rezervnih kanala. Kanal `chrome-for-testing` nije postojao, pa je pala na
`channel: "chrome"` — **pravi Google Chrome** — i njime otvorila profil koji je napravio
Chrome for Testing. Posle toga taj profil pada pri pokretanju (SIGTRAP).

**Zašto:** rezervni kanali su bili napisani kao „probaj redom dok nešto ne uspe", bez pitanja
**da li je to što uspe uopšte ispravno**. Uspeh pokretanja nije isto što i ispravan alat.

**Pravilo:** kad se dira **postojeći korisnički profil** (pregledač, baza, konfiguracija),
raditi na **kopiji**, nikad na originalu, i **nikad** ne dozvoliti automatski prelazak na
drugi alat/verziju. Ako tačan alat nije dostupan — stati i javiti, ne improvizovati.
Dodatno: Playwright profil se otvara **samo** Playwrightom (on dodaje `--use-mock-keychain`,
pa pravi Chrome ionako ne može da dešifruje kolačiće).

---

## 30.07.2026. — Zaglavljen prolaz umalo prijavljen kao pokriven

**Šta je promašeno:** QA runner protiv produkcije zaglavio se na temi `les-botigues` i stajao
7 minuta bez napretka. U tom trenutku sam imao izveštaj sa 6 tema i mogao ga prijaviti kao
rezultat.

**Zašto se nije desilo:** protokol to izričito zabranjuje, pa je prolaz prekinut, preostalih
6 tema pušteno **pojedinačno** sa ograničenjem od 200 s, i 5 ih je prošlo. Ostalo je
8 neodigranih zadataka i to je **u naslovu izveštaja**, ne u fusnoti.

**Pravilo (potvrda postojećeg):** zaglavljen prolaz nije obavljen posao. Uvek prebrojati šta
je **stvarno** vraćeno, ponoviti pale delove pojedinačno sa vremenskim ograničenjem, i
pokrivenost napisati odmah ispod ocene. Ovde je pravilo radilo — zato i ostaje kako je
napisano.

---

## 03.08.2026. — Raspored merio se po tome „da li radi", ne „da li se vidi"

**Šta je promašeno:** strana zadatka koristila je 672 px od 1512 px ekrana (44%), pa su
kartice padale u dva-tri reda i drugi red je bio **ispod donje ivice**. Uz to se posle
20 s mirovanja lik pretvarao u providnog „duha", a likovi su stajali preko trake sa
dugmadima. Sve troje je našla **vlasnica gledajući aplikaciju**, ne alat.

**Zašto se nije videlo:** svaka postojeća provera pita „radi li" — pada li strana, ima li
grešaka u konzoli, preliva li se vodoravno. **Nijedna nije pitala da li se sadržaj VIDI
BEZ POMERANJA.** Test je 12/12 tema prijavljivao kao ispravne dok je pola zadatka bilo
ispod ivice ekrana. Uz to je merenje išlo samo na uskim širinama (320/360/390), gde je
`max-w-2xl` bezopasan — na 1512 px, gde je vlasnica radila, niko nije merio.

**Pravilo:**
1. **Uz svaku proveru „radi li" ide i provera „staje li na ekran".** Meri se
   `scrollHeight` naspram `innerHeight` i broj redova kartica, na ŠIROKOM ekranu
   (1512 px), ne samo na uskom. Sadržaj koji dete ne vidi za dete ne postoji.
2. **Meri se i gornja granica širine, ne samo donja.** Provera prelivanja hvata
   presko, ali ne i pretesno. Okvir koji koristi manje od 70% ekrana je nalaz.
3. **Nijedno stanje lika ne sme da bude bledo, providno ni „ledeno".** Dete
   izbledeli lik čita kao kvar, ne kao raspoloženje. Raspoloženje se pokazuje
   pokretom i pozom, nikad providnošću.

---

## 03.08.2026. — Provera je gledala u redni broj zadatka

**Šta je promašeno:** nova provera S6 bila je napisana kao „otvori `la-classe?tasca=9`
i prebroj kartice". Istog dana su dugački zadaci podeljeni na delove, brojevi su se
pomerili, i provera je javila kvar koga nema — gledala je u sasvim drugi zadatak.

**Pravilo:** provera se vezuje za **sadržaj**, ne za redni broj. Redni broj nije osobina
zadatka nego njegovog mesta u nizu, a niz se menja. Ispravna provera prolazi kroz temu i
traži zadatak koji ODGOVARA OPISU (npr. „ima 4–8 kartica sa slikom"), pa nad njim meri.
Isto važi za svako pravilo koje pominje „treći zadatak", „druga kartica", „poslednji red".


## 14.08.2026 — prijavio sam „ChatGPT nije vratio ništa", a bio je vratio dve slike

**Šta se desilo:** tražio sam sliku kose, dva puta. Oba puta sam javio vlasnici da
ChatGPT „primi zahtev i vrati prazno". Ona je gledala isti ekran i videla **dve lepe
slike kose**. Bile su tu — samo sam prestao da čekam pre nego što su se pojavile.

**Zašto sam to promašio:** provera je gledala **tekst poslednje poruke** i njen status
„generiše li se". Slika u ChatGPT-u stiže **posle** teksta i u međuvremenu poruka
nakratko izgleda kao da je nestala. Merio sam pogrešnu stvar, pa sam iz pogrešnog
merenja izveo pouzdan zaključak — i još ga zapisao kao nalaz u `NALAZI-OTVORENI.md`.

**Pravilo (važi za svaku klasu ovakvih grešaka):**
Kad se čeka **ishod koji je slika, fajl ili prilog**, čeka se **taj ishod**, ne tekst
oko njega. Konkretno: prebroji priloge pre slanja i čekaj dok se broj ne poveća.
Šire: **pre nego što prijaviš da nešto NIJE stiglo, proveri da si uopšte merio to
što čekaš.** „Nema odgovora" i „ne vidim odgovor tamo gde gledam" nisu ista tvrdnja,
a druga se prijavljuje kao prva.

**I još jednom potvrđeno pravilo D8:** vlasnica je gledala isti ekran i bila u pravu,
a ja sam imao merenje. Njena prijava ima prednost nad merenjem alata.

## 16.08.2026 — funkcija za brisanje grešaka postojala, a nije se zvala niotkud

**Šta se desilo:** dete je celu temu uradilo tačno, a aplikacija ga je na kraju
vratila na već rešene zadatke sa porukom „imaš još 9 reči za vežbanje".

**Zašto to nijedan test nije uhvatio:** svi dotadašnji testovi su rešavali zadatke
**tačno iz prve**. Nijedan nije radio ono što dete radi stalno — **pogrešio pa
popravio**. A greška se javljala samo na tom putu.

**Šta je bio pravi propust:** funkcija `clearTaskErrors` je **postojala u kodu od
ranije i nije se zvala ni sa jednog mesta**. Dakle rešenje je bilo napisano, pa
zaboravljeno — isto kao ilustracije `laura-carles` i `carolina`, koje su bile
napravljene pa se nisu prikazivale. To je već **treći put** da je gotovo rešenje
stajalo neupotrebljeno.

**Pravila (važe za celu klasu, ne za ovaj jedan bag):**

1. **Test mora da GREŠI.** Za svaki tip zadatka bar jedan prolaz ide putem
   „pogrešan odgovor → ispravka → tačno". Put kojim dete stvarno ide.
2. **Šta je „greška" mora biti zapisano kao pravilo, ne izvedeno iz koda.**
   Ovde glasi: *greška je ono što je na KRAJU zadatka još pogrešno.*
   Bez zapisanog pravila svaka komponenta izmisli svoje, a razlike se ne vide.
3. **Izvezena funkcija koju niko ne zove je nalaz, ne uredna sitnica.** Provera:
   `grep -c "imeFunkcije" src/` — ako je rezultat 1, poziva je samo definicija.
4. **Dete se NIKAD ne vraća na zadatak koji je uradilo tačno.** Ovo je pravilo o
   proizvodu, ne o kodu: vraćanje na zeleno oduzima smisao trudu i najbrži je
   način da dete prestane da igra.
