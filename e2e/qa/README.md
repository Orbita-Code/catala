# QA Auto-Solver Toolkit (`e2e/qa/`)

> **Za buduće sesije:** NE praviti nove solvere od nule. Ovaj toolkit već postoji.
> Pokreni ga, pročitaj `report.json`, popravi samo ono što prijavi. Ako neki tip
> zadatka i dalje „pogađa" (vidi napomene u izveštaju), dopuni odgovarajući solver
> u `solve-lib.mjs`.

Alat odigra **svaki zadatak svake teme kao dete**, koristeći **tačne odgovore** izvučene
iz `src/data/*.ts`, i prijavi: zaglavljene zadatke, oštećene slike, console greške i
svaki slučaj gde je morao da pogađa (znak da data-oblik nije pokriven).

## Fajlovi
| Fajl | Šta radi |
|------|----------|
| `extract-tasks.mjs` | Transpiluje `src/data/*.ts` pravim TS kompajlerom i dumpuje SVE zadatke sa tačnim odgovorima u `tasks.json`. Pokreni prvo (i posle svake izmene podataka). |
| `tasks.json` | Generisano. Izvor istine za tačne odgovore (209 zadataka). |
| `solve-lib.mjs` | Playwright solveri za svih 18 tipova. `solveTask(page, task, notes)` dispečer po `task.type`. |
| `run.mjs` | Samostalan runner: pokreće Chromium, prolazi teme, piše `report.json` + konzolni sažetak. |
| `report.json` | Generisano. Rezultat poslednjeg prolaza. |

## Preduslovi
1. Dev server mora da radi: `npm run dev` (na `http://localhost:3000`).
2. Chromium (Playwright) instaliran. Ako runner javi „Executable doesn't exist",
   `run.mjs` već traži build **1232** u `~/Library/Caches/ms-playwright/`.
   Ako je verzija drugačija, izmeni `findChromium()` ili postavi `PW_EXE=/putanja node e2e/qa/run.mjs`.

## Korišćenje
```bash
node e2e/qa/extract-tasks.mjs        # 1) osveži tasks.json iz podataka
node e2e/qa/run.mjs                  # 2a) sve teme (dugo — copy-word ima po 20+ reči)
node e2e/qa/run.mjs la-classe        # 2b) jedna tema (za debug)
node e2e/qa/run.mjs la-classe el-cos # 2c) više tema
HEADED=1 node e2e/qa/run.mjs la-roba # vidljiv browser (gledaš kao dete)
```

## Kako čitati `report.json` / konzolni sažetak
Za svaku temu:
- `■ <tema>: X/Y zadataka | zaglavljeno: N | sa napomenom: M | console-err: K | slike-oštećene: Z`
- `⚠ ZAGLAVLJEN #i` — zadatak nije prešao dalje (pravi bag ILI rupa u solveru).
- `• #i <tip>: <napomena>` — solver je nešto pogađao/nije našao → dopuni solver za taj tip.
- `✖ SLIKA` — `naturalWidth==0` → oštećena/nedostajuća slika u igrici (PRAVI bag).
- `✖ CONSOLE` — JS greška na stranici (PRAVI bag).

**Bitno:** „zaglavljeno/napomena" najčešće znači da SOLVER treba dopuniti, a
„SLIKA/CONSOLE" su skoro uvek pravi bagovi aplikacije. Kad je tema čista, izveštaj
je: `zaglavljeno: 0 (osim drawing-canvas bonus koji je slobodan)`, `console-err: 0`,
`slike-oštećene: 0`.

## Poznata ograničenja (stanje 24.07.2026)
- `drawing-canvas` (bonus na kraju teme) se prijavljuje kao „zaglavljen" jer je
  slobodna aktivnost bez tačnog odgovora — to je OK, nije bag.
- `color-by-instruction` je best-effort (bojenje se ne verifikuje programski — proveriti vizuelno).
- Runner meri „prešao na sledeći" (advanced), ne 100% „tačno rešen". Ako `notes`
  za tip je prazan i nema console/slika grešaka, tip se smatra ispravnim.
- Vizuelni pregled SLIKA se radi odvojeno: `scripts/qa-contact-sheet.py <slug>`
  (kontakt-list svih `.webp` te teme). Vidi `QA-HANDOVER.md`.

## Arhitektura solvera (za dopunjavanje)
`solve-lib.mjs` — svaki `solveXxx(page, task, notes)`:
- čita tačan odgovor iz `task` (oblik kao u `src/data`), interaguje pravim mouse/keyboard,
  gura `notes.push('...')` kad mora da pogađa.
- Selektori su vezani za Tailwind klase task-komponenti (`src/components/tasks/*.tsx`).
  Ako se UI klase promene, ažuriraj selektore ovde.
- Redosled tipova po temi se ne pogađa iz naslova — runner iterira `tasks.json` redom.
