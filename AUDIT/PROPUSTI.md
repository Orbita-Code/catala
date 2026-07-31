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
