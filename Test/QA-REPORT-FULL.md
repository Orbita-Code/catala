# QA Test Report - Katalonski App
## Kompletno Testiranje Svih 12 Tema

**Datum:** 16.04.2026.
**Tester:** Claude (manuelno testiranje + data analiza)
**Verzija:** localhost:3000 (dev)

---

## POPRAVKE URADJENE (16.04.2026.)

| # | Bug | Tema | Sta je uradjeno |
|---|-----|------|-----------------|
| BUG-001 | Word-search "gat" i "tigre" ne postoje u gridu | Els Animals, Zad. 10 | ✅ POPRAVLJENO - Regenerisan grid sa svih 8 reci |
| BUG-010 | Zadatak nema sliku - nemoguce resiti | La Família, Zad. 8 | ✅ POPRAVLJENO - Dodata slika familia-sofa + ispravljen odgovor "marró"→"lila" |
| BUG-011 | Slika porodicnog stabla pogresna | La Família, Zad. 3 | ✅ POPRAVLJENO - Zamenjena slika na arbre-familiar-complet |
| BUG-012 | Zadatak 1 label-image umesto fill-sentence | La Família, Zad. 1 | ✅ POPRAVLJENO - Prepravljen u fill-sentence sa imenima + dodat description polje |
| BUG-013 | MultipleChoice slika previse mala | Sve teme | ✅ POPRAVLJENO - Promenjena velicina slike u MultipleChoice komponenti |
| - | FillSentence description polje | Infrastruktura | ✅ DODATO - Novo polje `description` u FillSentenceTask tipu + renderovanje u komponenti |
| BUG-002 | Decode-grid besmislene recenice | La Família, Zad. 9 | ✅ POPRAVLJENO - Izbacena rec 8, popravljena rec 5, skracena rec 4 |
| BUG-003 | Spelling "televisio" bez akcenta | La Classe, Zad. 11 | ✅ POPRAVLJENO - Promenjeno u "televisió" |
| BUG-004 | Elizija "el iogurt" | El Menjar | ✅ POPRAVLJENO - Promenjeno u "l'iogurt" |
| BUG-005 | Opis tigra pogresan | Els Animals | ✅ POPRAVLJENO - "negre i groc" → "taronja i negre" |
| BUG-006 | Word-search "bolígraf" | La Classe, Zad. 2 | ✅ VERIFIKOVANO - Postoji u gridu (kolona 0, vertikalno) - NIJE BUG |
| BUG-007 | Word-search "pilot" ne postoji | Els Oficis, Zad. 5 | ✅ POPRAVLJENO - Dodat "pilot" u red 2 grida |

---

## PREOSTALI BAGOVI - TREBA POPRAVITI

### SREDNJI (P1)

#### BUG-008: Label-write - pogresna slika + crtice ne pokazuju tacno
**Tema:** El Cos, **Zadatak 2** u aplikaciji
**ID:** el-cos-2
**Problem:** Slika `cara-detall.webp` prikazuje 3 muska lica (bigoti, brada, naocari) umesto jednog lica sa delovima (cabell, ull, nas, boca, orella). Ovo je zapravo slika za zadatak 14 (vocabulari nou). Zadatak 2 zahteva novu ilustraciju jednog lica sa jasno vidljivim delovima glave.
**Sta treba:** Generisati novu ilustraciju jednog lica sa cabell, ull, nas, boca, orella jasno vidljivim, i podesiti x,y pozicije labela.

#### BUG-009: Copy-word "braç" - ç se ne prikazuje u letter bank-u
**Tema:** El Cos i sve teme sa copy-word
**Problem:** Rec "braç" prikazuje obicno C u letter bank-u umesto ç. Dete nikad ne vidi pravi oblik slova. Dizajnerska odluka - ç je zasebno slovo u katalonskom, ali prikazivanje svih akcentovanih slova bi bilo konfuzno.
**Sta treba:** Razmotriti da li da se ç prikazuje kao ç u banci (ali ne i à, è, é, itd.).

### SITNI (P2)

#### UX-001: Copy-word undo pakuje slova ulevo
**Problem:** Kad se ukloni slovo iz slota, ostala se pomeraju ulevo.
**Sta treba:** Razmotriti da slova ostaju na mestu.

#### UX-002: Word-search grid izlazi van viewport-a
**Problem:** Na manjim ekranima donji redovi grida nisu vidljivi.
**Sta treba:** Smanjiti celije ili dodati scroll indikator.

### SUGESTIJE (P3)

#### SUG-001: Balans zadataka
La Casa ima 23, Els Vehicles samo 12. Razmotriti dodavanje zadataka u manje teme.

#### SUG-002: Duplirani zadaci
La Ciutat (4 i 10), Els Vehicles (6 i 11), Els Oficis (8 i 10) imaju duplikate istog tipa.

#### SUG-003: Self-assessment nekonzistentnost
Broj stavki varira 8-21. Standardizovati na 10-12.

#### SUG-004: Reci bez prethodnog upoznavanja
"farmacèutic", "socorrista" (Els Oficis) i "dofí" (Els Animals) korisceni pre nego sto su predstavljeni u copy-word.

---

## KOMPLETIRANA TESTIRANJA

### Sve teme prodjene kroz Chromium/Playwright:
| Tema | Status | Zadataka reseno |
|------|--------|-----------------|
| 1. La classe | ✅ Kompletirana | 16+bonus |
| 2. L'escola | ✅ Kompletirana | 17+bonus |
| 3. El cos | ✅ Kompletirana | 16+bonus |
| 4. La roba | ✅ Kompletirana | 13+bonus |
| 5. La casa | ✅ Kompletirana | 23+bonus |
| 6. La família | ✅ Kompletirana | 14+bonus |
| 7. Les botigues | ✅ Kompletirana | 19+bonus |
| 8. El menjar | ✅ Kompletirana | 19+bonus |
| 9. Els animals | ✅ Kompletirana | 20+bonus |
| 10. La ciutat | ✅ Kompletirana | 14+bonus |
| 11. Els vehicles | ✅ Kompletirana | 12+bonus |
| 12. Els oficis | ✅ Kompletirana | 14+bonus |

### Tipovi zadataka testirani:
- copy-word: rec po rec, slovo po slovo ✅
- word-search: drag u svim pravcima ✅
- fill-letters: blank po blank ✅
- unscramble: slog po slog ✅
- matching: par po par ✅
- classify-columns: rec po rec ✅
- fill-sentence: recenica po recenica ✅
- multiple-choice: pitanje po pitanje ✅
- add-article: rec po rec ✅
- self-assessment: stavka po stavka ✅
- label-image: etiketa po etiketa ✅
- label-write: polje po polje ✅
- color-by-instruction: boja + objekat ✅
- drawing-canvas: crtanje + Fet! ✅
- separate-words: klik na razmake ✅
- decode-grid: kod po kod ✅

### Mehanika testirana:
- Error handling (Torna a provar!) ✅
- Undo u copy-word ✅
- XP sistem ✅
- Level-up celebracije ✅
- Streak brojac ✅
- End-of-theme celebracija ✅
- Error review ponuda ✅

---

## FAJLOVI IZMENJENI (ceka commit)

1. `src/data/els-animals.ts` - Regenerisan word-search grid (BUG-001) + opis tigra (BUG-005)
2. `src/data/la-familia.ts` - Cetiri popravke:
   - Slika arbre-familiar → arbre-familiar-complet (BUG-011)
   - Dodata slika familia-sofa u multiple-choice + ispravljen odgovor lila (BUG-010)
   - Zadatak 1 prepravljen iz label-image u fill-sentence sa description (BUG-012)
   - Decode-grid recenice popravljene (BUG-002)
3. `src/data/la-classe.ts` - Spelling "televisió" (BUG-003)
4. `src/data/el-menjar.ts` - Elizija "l'iogurt" (BUG-004)
5. `src/data/els-oficis.ts` - Word-search grid sa "pilot" (BUG-007)
6. `src/types/tasks.ts` - Dodat `description?: string[]` u FillSentenceTask
7. `src/components/tasks/FillSentence.tsx` - Renderovanje description ispod slike
8. `src/components/tasks/MultipleChoice.tsx` - Veca slika (w-full max-w-md)
9. `Test/QA-TESTING-RULES.md` - Pravila testiranja
10. `Test/QA-REPORT-FULL.md` - Ovaj izvestaj
