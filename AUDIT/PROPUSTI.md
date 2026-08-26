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

---

## 24.08.2026. — Provera je gledala PODATKE, a kvar je bio u CRTANJU

**Šta je promašeno:** tema 5, zadatak 17 („razvrstaj po sobama") bio je **nerešiv**.
Ima četiri sobe, a na ekranu su se iscrtavale samo dve — `Lavabo` i `Cuina` nisu
postojale. Osam od šesnaest reči (`banyera`, `dutxa`, `nevera`, `forn`…) nije imalo
nijedan tačan odgovor. Vlasnica je to našla igrajući, jednim potezom.

**Zašto se desilo.** Zadatak je 17.08. prepravljen iz osnova — tada je pažljivo
provereno da svaka reč pripada tačno jednoj sobi, i to je bilo tačno. **U podacima
nije bilo nijedne greške.** Kvar je bio u komponenti: režim `circleMode` crta raspored
„krug — reč — krug", u kom su `columns[0]` i `columns[1]` upisani rukom. Sa dve kolone
radi savršeno — a `la-casa-17` je bio jedini zadatak sa četiri, i jedini u kom su
kolone tiho nestajale.

**Zašto ga nijedna provera nije uhvatila.** Test je prolazio zadatke i gledao da se
odigraju, a ne da se mogu **rešiti tačno**. Zadatak se i mogao „odigrati" do kraja —
samo su odgovori bili netačni, a to test nije proveravao (rupa T2, zapisana 30.07. i
otvorena od tada).

**Pravilo (važi za svaki tip zadatka, ne samo za razvrstavanje):**
**Podatak koji je tačan nije isto što i podatak koji je VIDLJIV.** Kad komponenta ima
režim prikaza koji uzima samo deo podataka (prve dve kolone, prvih šest slika, prvi red),
mora postojati provera koja poredi **koliko je dato** sa **koliko se iscrtava** — i ta
provera pada kad se ne poklapaju. Nije dovoljno proveriti da su podaci ispravni.
Provera od 24.08. to radi za sve teme: `scripts/proveri-razvrstavanje.mjs`.

**Drugo pravilo, iz istog dana i istog razgovora.** Vlasnica je prijavila i da zadatak 16
nema nijednu sliku „a mislim da imamo svaku reč". Imali smo četiri od pet. Slika se nije
prikazivala jer je odgovor **rečenica** („És a la teulada"), pa traženje slike po celom
tekstu ne nađe ništa. Postojeća provera `proveri-slike.mjs` to nije mogla da vidi jer
traži reči **BEZ** slike, a ovde je reč sliku **imala**.
**Svaku proveru pustiti i iz suprotnog smera:** ako postoji „šta nam fali", mora
postojati i „šta imamo a ne koristimo". `scripts/proveri-parove-bez-slike.mjs`.

**Treće, sitno, ali vredi zapisati.** U istom razgovoru sam za sliku `garatge` tvrdila
da auto ima „oči i usta". Nije — to su farovi i rešetka hladnjaka. Vlasnica je ispravila.
**Kad se sudi o slici, opisati šta se vidi, ne šta liči.** Dva okrugla svetla na autu su
farovi dok se ne dokaže suprotno.

---

## 24.08.2026. — Provera je javljala „nula" zato što NIJE MOGLA DA UĐE

**Šta je promašeno:** vlasnica: „i dalje imam i u temi 4 i u temi 5 glasove koji
nisu Montse. i muški čak glas se umešao i neki ženski što ne zna katalonski."

Bila je u pravu. A u pre-deploy testu je stajala provera koja tačno to traži —
„Ništa se ne čita glasom uređaja (sve teme)" — i **prolazila je svaki put.**

**Zašto je prolazila.** Skripta `nadji-tudji-glas.mjs` pravi svoj pregledač i u
njemu je bila **upisana lokalna rezervna lozinka `changeme`**. Protiv produkcije
to znači `401` na svakoj strani. Skripta ne nađe nijedan zadatak, prekine posle
prve strane, i ispiše „TUĐIM GLASOM SE IZGOVARA: 0". Test to pročita kao čisto.

**Nula nalaza nije značila da je čisto — značila je da provera nije ni ušla.**

**Pravilo (opšte, važi za svaku proveru):**
**Provera mora da ispiše KOLIKO JE OBIŠLA, i da padne kad je obišla ništa.**
Nula nalaza uz nula pregledanih jedinica je kvar, ne prolaz. Sada se traži
`OBIĐENO ZADATAKA > 100`; da je ovo stajalo, kvar bi bio prijavljen prvog dana.

Isto važi za svaku tajnu koja se koristi u proveri: **lozinka se čita iz okoline
(`BASIC_AUTH`), nikad se ne upisuje u skriptu.** Upisana lozinka ne samo da
procuri — ona tiho pretvara proveru u ukras.

**Drugi propust, u istoj skripti.** I kad je ušla, dirala je stranu PLITKO:
jednom pokupi dugmad, najviše 26 komada. Ali posle svakog klika strana se
promeni i nikne nova dugmad. Baš tako se propuštaju izgovori koji se SASTAVE
tek kad je odgovor tačan — „A l'aiguera, hi ha els plats bruts.", „un camisa",
„CUI, NA". Sada su četiri kruga po 40 dugmadi.
**Pravilo: ko proverava stranu koja se menja na dodir, mora da je dira više
puta i da svaki put IZNOVA potraži šta se pojavilo.**

**Treći, u skripti za snimanje.** Snimalo se ono što piše u podacima. Ali
`Matching` izgovara OBE STRANE ODJEDNOM („levo, desno"), a boje uopšte ne stoje
u podacima nego u `ColorByInstruction.tsx`. Zato `rosa` i `marró` nikad nisu
snimljene. **Pravilo koje je već stajalo zapisano — „snima se ono što se
IZGOVARA, ne ono što piše u podacima" — nije bilo sprovedeno do kraja:**
svaki `speak()` sa sastavljenim tekstom i svaki tekst koji živi u komponenti
mora biti naveden u `snimi-izgovor.mjs`. Posle dopune: 1383 → **1490** izgovora.

**Četvrto, sadržajno.** Dva od četiri slučaja nisu tražila snimak nego popravku:
aplikacija je naglas potvrđivala „un camisa" (nije katalonski) i čitala „CUI, NA"
(nije reč). **Kad nešto nema snimak, prvo se pita TREBA LI to uopšte da se
izgovori tako** — pa tek onda snima.

**Peto, iz istog dana — pravilo prepisano napamet umesto preslikano iz koda.**
Osmi slučaj tuđeg glasa bio je najsuptilniji. Aplikacija u zadatku sa
dopunjavanjem daje zvučniku `text.replace(/\s*___\.?/, "")` — briše prazninu i
**samo tačku** iza nje. Upitnik OSTAJE. Zato se „Què ___? — Per dinar…"
izgovara kao „Què? — Per dinar…".

Skripta za snimanje je brisala `[.!?]?` — dakle i upitnik — pa je snimila
„Què — Per dinar…". Jedan znak razlike: snimak postoji, ne nalazi se, dete čuje
glas uređaja. Tri takve rečenice u temi 8.

Najgore je što je to **ista zamka kao 17.08., samo obrnuta**: tada se brisalo
PREMALO, sada PREVIŠE. Pravilo je bilo zapisano na oba mesta i na oba mesta
prepisano **napamet**, umesto preslikano iz komponente koja jedina odlučuje.

**Pravilo: kad dve strane moraju da se poklope, jedna je IZVOR, druga je
PRESLIKANA — i u obe se upiše odakle je.** Ovde je izvor
`FillSentence.tsx`. Ako se tamo promeni jedan znak, mora se promeniti i u
`tts.ts` i u `snimi-izgovor.mjs`. Ko piše „mora da se poklapa sa…", a ne
otvori taj fajl, nije se poklopio.

---

## 25.08.2026. — Dugme u dugmetu, i pitanje na koje se ne može odgovoriti

**Prijava vlasnice, tema 6, zadatak 8.** Dve stvari odjednom.

### 1. Pitanje je bilo neodgovorivo, a dete je bilo u pravu

„El fill té els cabells del mateix color que la mare." — tačan odgovor upisan
kao **„Sí"**. Na slici mama ima dugu tamnu (skoro crnu) kosu, a sin tamnobraon.
Ćerka je odgovorila **„No"** i aplikacija joj je to obeležila kao grešku.

**Propust nije u tome što je odgovor pogrešno upisan, nego što se pitanje
uopšte OSLANJA NA NIJANSU.** Boja kose na ilustraciji nije merljiva, pa je svaki
odgovor branjiv — a dete od sedam godina crno i braon vidi kao dve boje, i teško
da je iko drugačije vidi.

**Pravilo: pitanje sa slike sme da traži samo ono što se sa slike VIDI
NEDVOSMISLENO.** Duga/kratka kosa, boja majice, ko je viši — da. Nijansa boje,
„sličan", „otprilike isto" — ne. Kad se pitanje piše, otvori se slika i proveri
može li se odgovoriti bez oklevanja; ako se okleva, pitanje se menja.
Ovde je zamenjeno poređenjem sa **tatom** (odluka vlasnice): otac i sin na slici
imaju istu tamnobraon kosu, pa je „Sí" nedvosmisleno.

### 2. Strelica „pokušaj ponovo" nije radila

Dete pogreši, pojavi se narandžasta strelica, klikne je — i ništa.

Uzrok: strelica je bila **unutar dugmeta koje je u tom trenutku `disabled`**.
Pregledač guta klik na sve što je u onemogućenom dugmetu, pa strelica nije mogla
ni da primi događaj. Kad se `disabled` skinuo, ostala je druga mana: **dugme u
dugmetu nije ispravan HTML**, pa je pogađanje cilja padalo na ikonicu i klik se
gubio.

**Pravilo: interaktivni element se NIKAD ne stavlja unutar drugog interaktivnog
elementa.** Ako uz dugme treba još jedna radnja, ona ide PORED njega, kao zaseban
element. I: zaključavanje se radi u rukovaocu (`if (showResult) return;`), ne
atributom `disabled`, kad u dugmetu postoji išta što treba da ostane živo.

Uz to je strelica bila **28 px**, a pravilo projekta traži **44 px** — prst od
sedam godina je promaši. Sada je 44×44.

### 3. Kako sam sama sebe zavarala pri merenju

Prvo merenje je reklo „pitanje se nije promenilo" — a jeste. Gledala sam ceo
tekst strane, a zadatak prikazuje **jedno pitanje u isto vreme**; ono o kosi je
sedmo i u tom trenutku ga u strani nije ni bilo.
**Pravilo: pre nego što se prijavi da izmena nije stigla, proveri da li je
predmet merenja uopšte NA EKRANU u tom trenutku.** Isto važi za korake u
zadatku, kartice koje se otkrivaju i sve što se prikazuje jedno po jedno.

---

## 25.08.2026. — Spisak otvorenih nalaza je deset dana lagao

**Šta je promašeno:** nalaz **N-14.1** (slike `cara` i `cabell` ne prikazuju to
što imenuju) stajao je na spisku otvorenih do 25.08. — a bio je popravljen
**15.08.**, i commit tog dana izričito kaže „nalaz N-14.1 zatvoren".

Deset dana je `AUDIT/NALAZI-OTVORENI.md` tvrdio kvar kojeg nema. Vlasnica je na
osnovu tog spiska pitala „da li smo završili sve iz audita" i dobila bi pogrešan
odgovor da slike nisu otvorene i pogledane.

**Zašto se desilo:** popravka i zatvaranje nalaza su dva odvojena posla, a
drugi se radi u drugom fajlu. Sesija koja je popravila sliku napisala je to u
commit poruci — i tu stala.

**Pravilo: nalaz se zatvara U ISTOM POTEZU sa popravkom, pre commita.**
Commit poruka nije mesto gde se zatvara nalaz; `AUDIT/NALAZI-OTVORENI.md` jeste.
Ako commit kaže „nalaz zatvoren", a spisak ga i dalje ima — spisak je taj koji
se čita, pa je posao nedovršen.

**Provera koja to hvata, uz mali trošak:** pre svakog audita proći svaki otvoreni
nalaz i **stvarno otvoriti predmet** (sliku, zadatak, stranu). Nalaz koji se ne
može reprodukovati NE ostaje na spisku „za svaki slučaj" — briše se, uz zapis
kada je i čime provereno. Spisak koji sadrži i nepostojeće nalaze prestaje da
bude spisak.

---

## 25.08.2026. — Reč je BILA u mreži, a dete je nikad ne bi našlo

**Prijava vlasnice:** „zašto osmosmerka ima reč `hamster` a nema je nigde, ne
postoji, kako je ovo moguće?"

**Izmereno:** reč jeste u mreži — **dijagonalno nadole-desno, od prvog reda,
četvrte kolone**. Sedam od devet reči u toj temi stajalo je ukoso. U temi 10
šest od devet, u temama 3 i 12 po pet od deset.

**Vlasnica je u pravu u svemu što je bitno.** Zadatak je bio nerešiv u praksi:
dete je u svim prethodnim temama naučilo da traži pravo, nigde mu se ne kaže da
odjednom sme i ukoso, i ta reč za njega ne postoji.

**Zašto provera nije videla:** `proveri-sopu.mjs` je tražila da reč POSTOJI u
mreži — u bilo kom od osam pravaca. Postojala je. Provera je bila tačna i
beskorisna istovremeno.

**Pravilo (i vlasnica ga je tražila izričito):**
**Zadatak koji je nov ili izmenjen ODIGRA SE DO KRAJA, kao dete — slovo po
slovo, reč po reč.** „Otvoriti i pogledati" nije provera. Da je iko odigrao tu
mrežu, video bi za dvadesetak sekundi da se reč ne može naći.
Upisano kao **OBAVEZNO PRAVILO #1a** u `CLAUDE.md` projekta i u `TESTING.md`.

**Uže pravilo za mreže:** reč sme da stoji **samo vodoravno ili uspravno**, i ne
sme se pojaviti ukoso ni slučajno. Provera sada traži `nedostaje: 0, ukoso: 0`.

**Šire pravilo, isto iz ovog slučaja:** kad provera meri POSTOJANJE, pitati se
da li meri i **DOSTUPNOST**. Reč koja postoji ali se ne može naći, slika koja
postoji ali se ne prikazuje, kolona koja postoji ali se ne iscrtava — sve troje
su ista greška, i sve tri su nađene u poslednja dva dana.

---

## 26.08.2026. — Promenila sam tekst u proveri, a ne i u testu koji ga čita

**Šta je promašeno:** pun test protiv produkcije pao je na proveri „Slagalica
slova", sa porukom „nije se pokrenulo". Igrica je bila ispravna — 102 reči, sve
unapred. Ja sam istog dana u `scripts/proveri-sopu.mjs` promenila ispis sa
`ukoso:` na `unazad/ukoso:`, a u `e2e/predeploy.mjs` ostavila stari oblik.

**Ovo je DRUGI put u tri dana da se ista klasa greške ponovi.** 24.08. je isto
bilo sa brisanjem praznine (`FillSentence` je izvor, `tts.ts` i
`snimi-izgovor.mjs` su preslikani). Pravilo je tada zapisano — i opet je
prekršeno, jer se odnosilo na drugi par fajlova.

**Pravilo se PREPISUJE, ne dodaje novo (kako protokol i nalaže):**
**Kad jedan program ispisuje broj koji drugi čita, to je ugovor između njih.**
Ko menja ispis, menja i čitača — u istom potezu, pre commita. Nije dovoljno
„setiti se"; traži se `grep` za stari oblik kroz ceo projekat pre nego što se
izmena zatvori. Ovde bi `grep -rn "ukoso:" e2e/ scripts/` odmah pokazao oba mesta.

**Šta je spaslo stvar:** čuvar uveden 24.08. — provera koja se nije izvršila NE SME
da se prijavi kao prošla. Bez njega bi test i dalje pisao zeleno, a ne bi merio
ništa. Greška je uhvaćena istog dana kad je nastala, umesto za mesec dana.
