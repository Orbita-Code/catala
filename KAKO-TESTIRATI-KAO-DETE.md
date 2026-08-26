# Kako testirati zadatak kao dete od sedam godina

> Pitanje vlasnice, 26.08.2026:
> „Ovo rade deca od 5, 6, 7 i 8 godina koja se PRVI PUT susreću sa katalonskim.
> Kako da objasnimo AI agentu da testira kao dete, ali da uključi zdrav razum —
> a kompjuter nema zdrav razum?"
>
> **Ovaj dokument je odgovor na to pitanje.** Čita se pre svakog testiranja
> zadatka, i pre pisanja svakog novog zadatka.

---

## Glavna misao

Zdrav razum se ne može dati mašini. **Ali se može razložiti na pitanja koja
mašina ume da proveri.**

Svih pet grešaka koje je vlasnica našla 24–26.08. imaju **isti oblik**:

> **Zadatak je tražio nešto što na ekranu ne postoji — ili što se sa ekrana ne
> može jednoznačno pročitati.**

To nije „zdrav razum". To je merljivo. I to je jedino pitanje koje treba
postaviti, u šest oblika.

---

## ŠEST PITANJA — ovo je „zdrav razum", razložen

Prolaze se **redom**, za svaki zadatak koji je nov ili izmenjen.

### 1. Je li ono što se traži ZAISTA NA EKRANU?

Ne u podacima. Ne u oznaci za čitače ekrana. **Na ekranu, vidljivo detetu.**

| Kako se proverava | Zadatak pada ako |
|---|---|
| Prepiši sav vidljivi tekst i sve slike sa ekrana. Zatim pogledaj šta zadatak traži. | traženo se ne pojavljuje u tom prepisu |

> **Stvaran slučaj (zadatak 13, tema 6):** naslov je govorio „pročitaj šta su
> odgovorili Carlota i Cesc" — a na ekranu **nije bilo ničega**: ni teksta, ni
> Carlote, ni Cesca, ni ijedne životinje. Dete je moglo samo da pogađa.
>
> **Stvaran slučaj (samoprocena):** 18 kartica sa slikama i mikrofonom, i
> **nijedna napisana reč**. Reč je postojala samo u nevidljivoj oznaci.

### 2. Da li ono što se vidi JEDNOZNAČNO određuje odgovor?

Ako dva različita odgovora izgledaju isto na slici — zadatak je pokvaren, ma
koliko podaci bili tačni.

| Kako se proverava | Zadatak pada ako |
|---|---|
| Za svaki ponuđeni odgovor pitaj: **postoji li druga reč koja bi na toj slici izgledala isto?** | postoji |

> **Stvaran slučaj (samoprocena, tema 6):** `fill` (sin), `germà` (brat),
> `cosí` (rođak) i `oncle` (ujak) su **četiri dečaka koja izgledaju isto**.
> Nijedna slika ne kazuje koja se reč traži.
>
> **Stvaran slučaj (tema 6, zadatak 8):** pitanje „ima li sin istu boju kose kao
> mama" — mama tamna, sin tamnobraon. **Nijansa nije odgovor.** Dete od sedam
> godina crno i braon vidi kao dve boje, i teško da je iko drugačije vidi.

**Pravilo:** pitanje sa slike sme da traži samo ono što se vidi **bez oklevanja**.
Duga ili kratka kosa — da. Boja majice — da. Ko je viši — da.
Nijansa, „slično", „otprilike isto" — **ne**.

### 3. Postoji li MESTO gde odgovor treba da ide?

| Kako se proverava | Zadatak pada ako |
|---|---|
| Prebroj mesta na ekranu (kolone, polja, dugmad) i uporedi sa brojem u podacima | brojevi se ne poklapaju |

> **Stvaran slučaj (tema 5, zadatak 17):** zadatak ima četiri sobe, a na ekranu
> su se iscrtavale **samo dve**. Osam od šesnaest reči nije imalo nijedan tačan
> odgovor. Podaci su bili savršeni — kvar je bio u crtanju.

### 4. Da li je odgovor tamo gde dete ZNA da traži?

Dete traži onako kako je naučilo. Ne zna pravila koja mu niko nije rekao.

| Kako se proverava | Zadatak pada ako |
|---|---|
| Kako je isti tip zadatka izgledao u prethodnim temama? Traži li ovaj nešto novo, a nigde to ne kaže? | traži |

> **Stvaran slučaj (osmosmerka):** reč `hamster` **jeste** bila u mreži —
> dijagonalno nadole-desno, od prvog reda. Sedam od devet reči je bilo ukoso.
> Vlasnica je zaključila da te reči nema, i **bila je u pravu u svemu što je
> bitno**: dete koje je u svim prethodnim temama tražilo pravo, tu reč nikad ne
> nađe.
>
> Isto sa rečima unazad: dete zna kako reč izgleda i traži je **onako kako je
> napisana**, ne unatraške.

### 5. Da li dete zna ŠTA se od njega traži?

| Kako se proverava | Zadatak pada ako |
|---|---|
| Pročitaj naslov naglas i pitaj: kaže li on detetu koju RADNJU da uradi? | naslov je samo ime zadatka |

> **Stvaran slučaj:** naslov je glasio „Autoavaluació: La família" (samoprocena).
> To detetu od šest godina ne kaže **ništa** o tome šta treba da uradi.
> Sada: „Znaš li da kažeš ove reči na katalonskom? Dodirni mikrofon i izgovori
> reč."

### 6. Šta se desi kad dete POGREŠI?

| Kako se proverava | Zadatak pada ako |
|---|---|
| Odgovori namerno pogrešno. Pa pokušaj da ispraviš. | ispravka ne radi, ili se greška pamti i posle ispravke |

> **Stvaran slučaj (tema 6, zadatak 8):** dete pogreši, pojavi se narandžasta
> strelica „pokušaj ponovo", klikne je — **i ništa.** Strelica je bila unutar
> dugmeta koje je u tom trenutku zaključano, pa nije mogla ni da primi klik.

---

## KAKO SE OVO KAŽE AI AGENTU

Ovo se prosleđuje doslovno, uz zadatak koji se testira:

```
Testiraj ovaj zadatak kao dete od sedam godina koje PRVI PUT vidi katalonski.
Dete ne zna jezik, tek uči da čita, i ne poznaje nijedno pravilo koje mu
aplikacija nije rekla na ekranu.

NE proveravaj da li se strana učitava i da li klik ne baca grešku.
Proveri OVO, redom, i za svako napiši DA ili NE i zašto:

1. Prepiši SVE što se vidi na ekranu: svaki tekst, svaku sliku, svako dugme.
   Zatim: da li se ono što zadatak traži nalazi u tom prepisu?

2. Za svaki ponuđeni odgovor: postoji li DRUGA reč koja bi na toj slici
   izgledala isto? Ako da — dete ne može da zna, nego pogađa.

3. Prebroj mesta gde odgovor može da ide (kolone, polja, dugmad).
   Da li se taj broj poklapa sa brojem u podacima?

4. Traži li ovaj zadatak nešto što prethodne teme nisu tražile
   (nov pravac, nov način, novo pravilo)? Ako da — kaže li mu to na ekranu?

5. Pročitaj naslov. Kaže li on detetu koju RADNJU da uradi, ili je samo ime?

6. Odgovori NAMERNO POGREŠNO, pa pokušaj da ispraviš. Radi li ispravka?
   Pamti li se greška i posle ispravke?

Na kraju odigraj zadatak DO KRAJA, tačnim odgovorima — slovo po slovo, reč po
reč — i potvrdi da prelazi na sledeći zadatak.

Ako ne možeš da odgovoriš na neko pitanje — reci da ne možeš.
NIKAD ne pretpostavljaj da je u redu zato što nema greške u konzoli.
```

---

## ŠTA KOMPJUTER NE VIDI, A DETE VIDI — i kako to nadoknaditi

| Dete oseti | Kompjuter ne oseti | Kako se to ipak proveri |
|---|---|---|
| „Ne znam šta hoće od mene" | naslov je tekst kao i svaki drugi | pitanje 5: sadrži li naslov GLAGOL koji kaže radnju |
| „Ove dve slike su iste" | dve različite datoteke | pitanje 2: postoji li druga reč za istu sliku |
| „Ovde nema ničega" | prazan div je validan | pitanje 1: prepis ekrana, pa poređenje |
| „Ovo nisam nigde naučila" | svaki pravac je isti pravac | pitanje 4: poređenje sa prethodnim temama |
| „Pokušala sam i ne radi" | klik je izvršen bez greške | pitanje 6: namerna greška pa ispravka |
| „Predugačko je, odustajem" | 18 kartica je 18 kartica | prebroj stavke; preko 12 traži podelu |

---

## NAJVAŽNIJE PRAVILO OD SVIH

**Kad vlasnica kaže da nešto ne valja, a merenje kaže da valja — ona je prva u
pravu, pa se meri ponovo, NJENIM tokom rada.**

Provereno pet puta u tri dana. Svaki put je bila u pravu, i svaki put je test
tvrdio suprotno:

| Njena prijava | Šta je test govorio | Ko je bio u pravu |
|---|---|---|
| „zadatak 17 je nerešiv" | sve zeleno | ona |
| „zadatak 16 nema nijednu sličicu" | sve zeleno | ona |
| „hamster ne postoji u osmosmerci" | reč postoji u mreži | **ona** — postojala je ukoso |
| „stavio si reči unazad" | provera prolazi | ona |
| „18 slika, ne znamo šta se traži" | sve zeleno | ona |

**Automatika pokriva širinu — dve hiljade strana, dvadeset pet kontrasta.
Dete pokriva dubinu — ono što se PROŽIVI.** Nijedno ne zamenjuje drugo.
