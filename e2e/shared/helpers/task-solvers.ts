import { Page } from "@playwright/test";
import { TaskAnswer } from "../fixtures/theme-answers";

/**
 * Solveri za svih 18 tipova zadataka. Pišeni prema STVARNOM DOM-u komponenti
 * (src/components/tasks/*), sa tačnim odgovorima iz theme-answers.ts.
 *
 * Zajednički principi:
 *  - Klikovi na pločice/opcije idu kroz el.click() u page.evaluate — stabilno
 *    i imuno na framer-motion transforme (koordinatni klikovi promašuju).
 *  - Glavna dugmad (Comprova!, Fet!, Continua!) idu kroz prave Playwright
 *    klikove (role + ime).
 *  - CopyWord/Unscramble/FillLetters imaju tastaturnu podršku u aplikaciji —
 *    koristimo je jer je najrobusnija (bank slova je bez akcenata, a app sama
 *    skida akcente sa pritisnutog tastera).
 *  - Čekanje je stanje-based (waitForFunction), ne nasumični sleepovi;
 *    waitForTimeout se koristi samo za merljive animacije/tranzicije iz koda.
 */

// ── zajednički pomoćnici ────────────────────────────────────────────────

/** normalizacija za poređenje teksta: mala slova, bez akcenata (ç→c), bez · */
const norm = (s: string) =>
  (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/·/g, "")
    .toLowerCase()
    .trim();

/** Klikni prvo omogućeno dugme pod selektorom čiji je (normalizovan) tekst jednak text. */
async function clickButtonByText(
  page: Page,
  text: string,
  scopeSelector = "main button"
): Promise<boolean> {
  return page.evaluate(
    ([sel, t]) => {
      const norm = (s: string) =>
        (s || "")
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/·/g, "")
          .toLowerCase()
          .trim();
      const el = [...document.querySelectorAll<HTMLButtonElement>(sel)].find(
        (b) => !b.disabled && norm(b.textContent || "") === norm(t)
      );
      if (!el) return false;
      el.click();
      return true;
    },
    [scopeSelector, text] as const
  );
}

/**
 * Sačekaj da omogućeno dugme sa tačnim tekstom postoji pa ga klikni kroz
 * evaluate. Playwright-ov .click() na framer-motion dugmad (whileTap/whileHover,
 * AnimatePresence exit) upada u beskonačne "not stable"/"detached" retry
 * petlje — el.click() to zaobilazi, a app reaguje isto (React onClick).
 */
async function clickButtonWhenPresent(
  page: Page,
  matcher: { exact?: string; regex?: string },
  timeout = 8000
): Promise<boolean> {
  const src = `([...document.querySelectorAll("button")].find((b) => {
    if (b.disabled) return false;
    const t = (b.textContent || "").trim();
    return ${matcher.exact ? `t === ${JSON.stringify(matcher.exact)}` : `new RegExp(${JSON.stringify(matcher.regex)}).test(t)`};
  }))`;
  try {
    await page.waitForFunction(`!!${src}`, undefined, { timeout });
  } catch {
    return false;
  }
  return page.evaluate(`${src} ? (${src}).click() || true : false`);
}

async function clickComprova(page: Page, timeout = 8000) {
  const ok = await clickButtonWhenPresent(page, { exact: "Comprova!" }, timeout);
  if (!ok) throw new Error("Comprova! dugme se nije pojavilo");
}

/** Klik na pločicu slova u "banku" (LetterTile enabled = border-amber-300). */
async function clickBankTile(page: Page, tileText: string): Promise<boolean> {
  return page.evaluate((txt) => {
    const el = [...document.querySelectorAll<HTMLButtonElement>("main button")].find(
      (b) =>
        !b.disabled &&
        /border-amber-300/.test(b.className) &&
        (b.textContent || "").trim() === txt
    );
    if (!el) return false;
    el.click();
    return true;
  }, tileText);
}

type TileTaskState = "next" | "continua" | "retry";

/**
 * Čeka dok CopyWord/Unscramble ne postane interaktivan:
 *  - "continua" → MiniCelebration pauza (svakih 7 reči u CopyWord)
 *  - "retry"    → pogrešan odgovor, prikazano "Torna a provar!"
 *  - "next"     → prazni slotovi + omogućene pločice (spremno za unos)
 */
async function waitTileTaskState(page: Page, timeout = 10000): Promise<TileTaskState> {
  const handle = await page.waitForFunction(
    () => {
      const btns = [...document.querySelectorAll<HTMLButtonElement>("main button")];
      const text = (b: HTMLButtonElement) => (b.textContent || "").trim();
      if (btns.some((b) => text(b) === "Continua!")) return "continua";
      if (btns.some((b) => /Torna a provar/.test(text(b)))) return "retry";
      const slots = btns.filter((b) => /w-11/.test(b.className));
      const emptySlots = slots.length > 0 && slots.every((s) => text(s) === "_");
      const enabledTiles = btns.some(
        (b) => !b.disabled && /border-amber-300/.test(b.className)
      );
      if (emptySlots && enabledTiles) return "next";
      return "";
    },
    undefined,
    { timeout }
  );
  return (await handle.jsonValue()) as TileTaskState;
}

async function dismissContinua(page: Page) {
  await clickButtonWhenPresent(page, { exact: "Continua!" });
  await page.waitForTimeout(350); // exit animacija overlaya
}

/**
 * Izvrši akciju (taster ili klik na pločicu) pa VERIFIKUJ da se broj popunjenih
 * slotova povećao — React keydown handleri se u dev režimu ne stignu
 * re-registrovati između brzih uzastopnih unosa, pa slepo kucanje zna da
 * upiše slovo u pogrešan slot. slotRe poklapa klasu slot dugmadi
 * (w-11 za SlotRow, w-8|w-10 za FillLetters blankove).
 */
async function actAndVerifyFilled(
  page: Page,
  slotRe: string,
  action: () => Promise<void>,
  what: string
) {
  const filledCount = () =>
    page.evaluate(
      (re) =>
        [...document.querySelectorAll<HTMLButtonElement>("main button")].filter((b) => {
          // NE trimovati: slot popunjen razmakom (npr. "educació física") mora
          // da se računa kao popunjen; prazan slot prikazuje "_" ili "".
          const t = b.textContent || "";
          return new RegExp(re).test(b.className) && t !== "" && t !== "_";
        }).length,
      slotRe
    );
  for (let attempt = 0; attempt < 4; attempt++) {
    const before = await filledCount();
    await action();
    for (let k = 0; k < 8; k++) {
      await page.waitForTimeout(50);
      if ((await filledCount()) > before) return;
    }
  }
  throw new Error(`Unos nije registrovan: ${what}`);
}

/** Otkucaj reč u CopyWord/Unscramble letter-mode (uz verifikaciju svakog slova). */
async function typeWordLetters(page: Page, word: string) {
  for (const ch of word) {
    const lower = ch.toLowerCase();
    let action: () => Promise<void>;
    if (lower === "ç") {
      // bank čuva ç kao posebno slovo; tastatura ga nema → klik na pločicu
      action = async () => {
        await clickBankTile(page, "Ç");
      };
    } else {
      const stripped = lower.normalize("NFD").replace(/[̀-ͯ]/g, "");
      if (/^[a-z]$/.test(stripped)) {
        action = () => page.keyboard.press(stripped);
      } else if (stripped === " ") {
        action = () => page.keyboard.press("Space");
      } else {
        // apostrof i ostali znaci: app ih ne podržava na tastaturi → klik na pločicu
        const tile = ch.toUpperCase();
        action = async () => {
          await clickBankTile(page, tile);
        };
      }
    }
    await actAndVerifyFilled(page, "w-11", action, `slovo "${ch}" reči "${word}"`);
  }
}

// ── COPY-WORD ───────────────────────────────────────────────────────────
// DOM: reč je p.font-handwriting; slotovi su button.w-11 ("_" kad su prazni);
// bank slova su LetterTile dugmad (border-amber-300). Comprova! se pojavi kad
// je sve popunjeno; Enter takođe proverava. Posle svakih 7 reči MiniCelebration
// overlay sa dugmetom "Continua!" koje mora da se klikne.
async function solveCopyWord(page: Page, answer: Extract<TaskAnswer, { type: "copy-word" }>) {
  for (let wi = 0; wi < answer.words.length; wi++) {
    const last = wi === answer.words.length - 1;

    // sačekaj interaktivno stanje (možda je MiniCelebration pauza na redu)
    let state = await waitTileTaskState(page);
    if (state === "continua") {
      await dismissContinua(page);
      state = await waitTileTaskState(page);
    }

    // do 2 pokušaja po reči (drugi samo ako prvi slučajno omane)
    for (let attempt = 0; attempt < 2; attempt++) {
      await typeWordLetters(page, answer.words[wi]);
      await page.keyboard.press("Enter");
      if (last) {
        await page.waitForTimeout(1200); // moveToNext → onComplete nakon ~1s
        return;
      }
      state = await waitTileTaskState(page);
      if (state !== "retry") break;
      await clickButtonWhenPresent(page, { regex: "Torna a provar" });
      await waitTileTaskState(page);
    }
    if (state === "continua") {
      await dismissContinua(page);
      await waitTileTaskState(page);
    }
  }
}

// ── FILL-LETTERS ────────────────────────────────────────────────────────
// DOM: blank polja su button.w-8/w-10; opcije slova w-12. Aktivni blank se
// pomera automatski; tastatura: app mapira bazno slovo na akcentovano (ç→c).
async function solveFillLetters(page: Page, answer: Extract<TaskAnswer, { type: "fill-letters" }>) {
  await page.waitForSelector("main button", { timeout: 10000 });
  await page.waitForTimeout(400); // mount animacija + inicijalni activeBlank
  for (const w of answer.words) {
    for (let i = 0; i < w.hint.length; i++) {
      if (w.hint[i] !== "_") continue;
      const stripped = (w.word[i] || "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
      await actAndVerifyFilled(
        page,
        "w-8|w-10",
        () => page.keyboard.press(stripped),
        `slovo "${stripped}" (${w.word}[${i}])`
      );
    }
  }
  // poslednja reč se auto-proverava; onComplete nakon ~1.2s
  await page.waitForTimeout(400);
}

// ── UNSCRAMBLE ──────────────────────────────────────────────────────────
// Letter mode: tastatura. Syllable mode ("TI-PA"): klik na slog pločice redom
// koji gradi tačnu reč (redosled se računa backtrackingom iz fixture-a).
function orderPieces(pieces: string[], correct: string): string[] {
  const target = correct.toLowerCase();
  const used = new Array(pieces.length).fill(false);
  const result: string[] = [];
  const bt = (): boolean => {
    if (result.length === pieces.length) return result.join("").toLowerCase() === target;
    for (let i = 0; i < pieces.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      result.push(pieces[i]);
      if (target.startsWith(result.join("").toLowerCase()) && bt()) return true;
      result.pop();
      used[i] = false;
    }
    return false;
  };
  bt();
  return result;
}

async function solveUnscramble(page: Page, answer: Extract<TaskAnswer, { type: "unscramble" }>) {
  for (let wi = 0; wi < answer.words.length; wi++) {
    const w = answer.words[wi];
    const last = wi === answer.words.length - 1;
    await waitTileTaskState(page);

    for (let attempt = 0; attempt < 2; attempt++) {
      if (w.scrambled.includes("-")) {
        const order = orderPieces(w.scrambled.split("-"), w.correct);
        for (const piece of order) {
          const tile = piece.toUpperCase();
          await actAndVerifyFilled(
            page,
            "w-11",
            async () => {
              const ok = await clickBankTile(page, tile);
              if (!ok) throw new Error(`unscramble: nema slog pločice "${tile}" (${w.correct})`);
            },
            `slog "${tile}" reči "${w.correct}"`
          );
        }
      } else {
        await typeWordLetters(page, w.correct);
      }
      await page.keyboard.press("Enter");
      if (last) {
        await page.waitForTimeout(1200);
        return;
      }
      const state = await waitTileTaskState(page);
      if (state !== "retry") break;
      await clickButtonWhenPresent(page, { regex: "Torna a provar" });
      await waitTileTaskState(page);
    }
  }
}

// ── WORD-SEARCH ─────────────────────────────────────────────────────────
// DOM: ćelije su [data-cell][data-row][data-col]; selekcija = drag mišem kroz
// centre ćelija (onMouseDown → onMouseEnter... → onMouseUp na kontejneru).
async function solveWordSearch(page: Page, answer: Extract<TaskAnswer, { type: "word-search" }>) {
  await page.waitForSelector("[data-cell]", { timeout: 10000 });
  const firstCell = page.locator('[data-row="0"][data-col="0"]');
  await firstCell.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const grid = answer.grid;
  const S = (s: string) => norm(s);
  const dirs = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ] as const;

  const foundCount = async () =>
    page.evaluate(() => {
      const m = document.querySelector("main");
      const mm = (m ? m.textContent || "" : "").match(/(\d+)\s*\/\s*\d+\s*paraules trobades/);
      return mm ? parseInt(mm[1], 10) : 0;
    });

  for (const word of answer.words) {
    const w = S(word);
    let path: [number, number][] | null = null;
    outer: for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        for (const [dr, dc] of dirs) {
          const cells: [number, number][] = [];
          let ok = true;
          for (let i = 0; i < w.length; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
            if (
              nr < 0 || nc < 0 || nr >= grid.length || nc >= grid[nr].length ||
              S(grid[nr][nc]) !== w[i]
            ) {
              ok = false;
              break;
            }
            cells.push([nr, nc]);
          }
          if (ok) {
            path = cells;
            break outer;
          }
        }
      }
    }
    if (!path) throw new Error(`word-search: reč "${word}" nije pronađena u gridu`);

    // drag kroz centre svih ćelija; verifikuj da se brojač pomerio, inače ponovi
    for (let attempt = 0; attempt < 3; attempt++) {
      const before = await foundCount();
      // srednju ćeliju reči dovuci u kadar (grid je viši od viewporta)
      const mid = path[Math.floor(path.length / 2)];
      await page.locator(`[data-row="${mid[0]}"][data-col="${mid[1]}"]`).scrollIntoViewIfNeeded();
      const pts: { x: number; y: number }[] = [];
      for (const [r, c] of path) {
        const box = await page.locator(`[data-row="${r}"][data-col="${c}"]`).boundingBox();
        if (!box) throw new Error(`word-search: nema ćelije ${r}-${c}`);
        pts.push({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
      }
      await page.mouse.move(pts[0].x, pts[0].y);
      await page.mouse.down();
      for (let i = 1; i < pts.length; i++) {
        await page.mouse.move(pts[i].x, pts[i].y);
        await page.waitForTimeout(70);
      }
      await page.mouse.up();
      await page.waitForTimeout(350);
      if ((await foundCount()) > before) break;
      if (attempt === 2) throw new Error(`word-search: selekcija reči "${word}" nije registrovana`);
      await page.waitForTimeout(200);
    }
  }
}

// ── CLASSIFY-COLUMNS ────────────────────────────────────────────────────
// DOM: trenutna reč je div.font-handwriting (text-2xl/3xl/4xl); kolone su
// button[data-drop-target="col-N"] (krugovi u circleMode). Klik na kolonu
// smešta prikazanu reč — nema potrebe za drag&drop.
async function solveClassifyColumns(page: Page, answer: Extract<TaskAnswer, { type: "classify-columns" }>) {
  const colOf = (item: string) =>
    answer.columns.findIndex((c) => c.items.some((it) => norm(it) === norm(item)));
  const total = answer.columns.reduce((n, c) => n + c.items.length, 0);

  const readCurrent = () =>
    page.evaluate(() => {
      const m = document.querySelector("main");
      if (!m) return null;
      const el = [...m.querySelectorAll<HTMLElement>("[class*='font-handwriting']")].find(
        (e) =>
          /text-2xl|text-3xl|text-4xl/.test(e.className) &&
          (e.textContent || "").trim().length > 0 &&
          !(e.textContent || "").includes("✅")
      );
      return el ? (el.textContent || "").trim() : null;
    });

  let nullStreak = 0;
  for (let guard = 0; guard < total * 4 + 6; guard++) {
    const cur = await readCurrent();
    if (!cur) {
      // reč nestaje nakratko dok traje ✅ feedback (800ms) — izlazimo tek kad
      // dugo nema reči (sve smešteno → results view)
      if (++nullStreak >= 6) break;
      await page.waitForTimeout(300);
      continue;
    }
    nullStreak = 0;
    const ci = colOf(cur);
    if (ci < 0) throw new Error(`classify-columns: nepoznata reč "${cur}"`);
    // evaluate-klik: locator.click() čeka dok je dugme disabled (lastPlacedCorrect
    // !== null zaključa krugove) pa može kliknuti tek kad se reč već promenila —
    // i smesti NOVU reč u STARU kolonu.
    const placed = await page.evaluate((colIdx) => {
      const el = document.querySelector<HTMLButtonElement>(`[data-drop-target="col-${colIdx}"]`);
      if (!el || el.disabled) return false;
      el.click();
      return true;
    }, ci);
    if (!placed) {
      await page.waitForTimeout(300);
      continue;
    }
    // sačekaj da se reč promeni (800ms feedback + dev lag) — adaptivno, bez fiksnog sleepa
    for (let k = 0; k < 12; k++) {
      await page.waitForTimeout(250);
      if ((await readCurrent()) !== cur) break;
    }
  }

  // ako su prikazani rezultati sa greškama, fixture nije dobar — prijavi
  if (await page.getByRole("button", { name: "Torna a provar!" }).isVisible().catch(() => false)) {
    throw new Error("classify-columns: zadatak završen sa pogrešnim kolonama");
  }
}

// ── MATCHING ────────────────────────────────────────────────────────────
// DOM: levi su button bez data-drop-target (tekst ili slika), desni su
// button[data-drop-target="right-N"]. Tap-tap režim (bez drag&drop).
// illustrationMatch: levi je čista slika → identifikacija preko imena fajla
// (iste normalizacije kao getWordIllustration u src/lib/illustrations.ts).
// illustrationMatch: levi je slika kad reč ima ilustraciju, inače tekst (span).
// Ime fajla = ista normalizacija kao getWordIllustration u src/lib/illustrations.ts:
// puni ključ, pa ključ sa skinutim članom ("el pare" → "pare", "l'àvia" → "avia").
const illustrationKeys = (word: string): string[] => {
  const strip = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/·/g, "");
  const base = word.toLowerCase().trim();
  const keys = [strip(base).replace(/[\s']+/g, "-")];
  const noArticle = base.replace(/^(a l'|a la |a les |als |al |el |la |l'|els |les |un |una |a )/, "");
  if (noArticle !== base) keys.push(strip(noArticle).replace(/[\s']+/g, "-"));
  return keys;
};

async function solveMatching(page: Page, answer: Extract<TaskAnswer, { type: "matching" }>) {
  await page.waitForSelector("main button", { timeout: 10000 });
  await page.waitForTimeout(300);
  for (const pair of answer.pairs) {
    if (answer.illustrationMatch) {
      // Levi je slika kad reč ima ilustraciju, inače tekst (span) — pokrivamo oba.
      const keys = illustrationKeys(pair.left);
      const ok = await page.evaluate(
        ([ks, leftTxt]) => {
          const norm = (s: string) =>
            (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/·/g, "").toLowerCase().trim();
          const el = [...document.querySelectorAll<HTMLButtonElement>("main button")].find((b) => {
            if (b.hasAttribute("data-drop-target")) return false;
            const img = b.querySelector("img");
            if (img) {
              const src = img.getAttribute("src") || "";
              return (ks as string[]).some((k) => src.endsWith(`/${k}.webp`));
            }
            return norm(b.textContent || "") === norm(leftTxt);
          });
          if (!el) return false;
          el.click();
          return true;
        },
        [keys, pair.left] as const
      );
      if (!ok) throw new Error(`matching: nema levog "${pair.left}" (${keys.join("|")})`);
    } else {
      const ok = await clickButtonByText(page, pair.left, "main button:not([data-drop-target])");
      if (!ok) throw new Error(`matching: nema levog "${pair.left}"`);
    }
    await page.waitForTimeout(250);
    const okRight = await clickButtonByText(page, pair.right, "main [data-drop-target^='right-']");
    if (!okRight) throw new Error(`matching: nema desnog "${pair.right}"`);
    await page.waitForTimeout(350);
  }
}

// ── FILL-SENTENCE ───────────────────────────────────────────────────────
// DOM: svaka rečenica je kartica (div.bg-white.rounded-xl) sa svojim opcijama;
// opcije se ponavljaju među karticama → klik MORA biti skopčan na karticu i.
// Kada je sve odgovoreno pojavi se Comprova!.
async function solveFillSentence(page: Page, answer: Extract<TaskAnswer, { type: "fill-sentence" }>) {
  await page.waitForSelector("main button", { timeout: 10000 });
  await page.waitForTimeout(300);
  const cards = page
    .locator("main div[class*='bg-white'][class*='rounded-xl']:visible")
    .filter({ has: page.locator("button") });
  const cardCount = await cards.count();
  if (cardCount < answer.blanks.length) {
    throw new Error(`fill-sentence: nađeno ${cardCount} kartica, treba ${answer.blanks.length}`);
  }
  for (let i = 0; i < answer.blanks.length; i++) {
    const ok = await cards.nth(i).evaluate((el, t) => {
      const norm = (s: string) =>
        (s || "")
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/·/g, "")
          .toLowerCase()
          .trim();
      const b = [...el.querySelectorAll<HTMLButtonElement>("button")].find(
        (x) => !x.disabled && norm(x.textContent || "") === norm(t)
      );
      if (!b) return false;
      b.click();
      return true;
    }, answer.blanks[i]);
    if (!ok) throw new Error(`fill-sentence: opcija "${answer.blanks[i]}" nije u kartici ${i + 1}`);
    await page.waitForTimeout(120);
  }
  await clickComprova(page);
}

// ── MULTIPLE-CHOICE ─────────────────────────────────────────────────────
// DOM: jedno pitanje po ekranu; opcije su button.rounded-2xl; auto-advance 1.2s.
async function solveMultipleChoice(page: Page, answer: Extract<TaskAnswer, { type: "multiple-choice" }>) {
  await page.waitForSelector("main button", { timeout: 10000 });
  await page.waitForTimeout(400);
  for (let qi = 0; qi < answer.answers.length; qi++) {
    const want = answer.answers[qi];
    const ok = await clickButtonByText(page, want);
    if (!ok) throw new Error(`multiple-choice: opcija "${want}" nije nađena (pitanje ${qi + 1})`);
    if (qi < answer.answers.length - 1) await page.waitForTimeout(1350); // auto-advance 1.2s
    else await page.waitForTimeout(300);
  }
}

// ── ADD-ARTICLE ─────────────────────────────────────────────────────────
// DOM: reč je span.font-handwriting.text-3xl; članovi su button.min-w-[70px];
// tačan član → auto-advance za 1s.
async function solveAddArticle(page: Page, answer: Extract<TaskAnswer, { type: "add-article" }>) {
  await page.waitForSelector("main span[class*='font-handwriting']", { timeout: 10000 });
  let last = "";
  for (let guard = 0; guard < answer.words.length + 4; guard++) {
    const cur = await page.evaluate(() => {
      const m = document.querySelector("main");
      if (!m) return null;
      const el = [...m.querySelectorAll<HTMLElement>("span")].find(
        (e) => /font-handwriting/.test(e.className) && /text-3xl/.test(e.className) && (e.textContent || "").trim()
      );
      return el ? (el.textContent || "").replace(/[✅❌]/g, "").trim() : null;
    });
    if (!cur) break; // komponenta se demontirala → gotovo
    if (cur === last) {
      await page.waitForTimeout(300);
      continue;
    }
    const w = answer.words.find((x) => norm(x.word) === norm(cur));
    if (!w) throw new Error(`add-article: nepoznata reč "${cur}"`);
    const ok = await clickButtonByText(page, w.article);
    if (!ok) throw new Error(`add-article: dugme "${w.article}" nije nađeno`);
    last = cur;
    await page.waitForTimeout(1100);
  }
}

// ── SEPARATE-WORDS ──────────────────────────────────────────────────────
// DOM: između slova su button[aria-label="Afegeix espai"/"Treu espai"];
// zona pre interpunkcije se NE renderuje — indeks granice se računa preko
// stvarno renderovanih pozicija.
async function solveSeparateWords(page: Page, answer: Extract<TaskAnswer, { type: "separate-words" }>) {
  await page.waitForSelector("main button[aria-label*='espai']", { timeout: 10000 });
  for (const item of answer.items) {
    const letters = item.joined.split("");
    const boundaries: number[] = [];
    let pos = 0;
    for (let i = 0; i < item.words.length - 1; i++) {
      pos += item.words[i].length;
      boundaries.push(pos);
    }
    const renderedGaps: number[] = [];
    for (let i = 0; i < letters.length - 1; i++) {
      if (!/[.,!?]/.test(letters[i + 1])) renderedGaps.push(i + 1);
    }
    for (const b of boundaries) {
      const idx = renderedGaps.indexOf(b);
      if (idx < 0) throw new Error(`separate-words: granica ${b} nije renderovana (${item.joined})`);
      await page.locator("main button[aria-label*='espai']").nth(idx).click();
      await page.waitForTimeout(120);
    }
    await clickComprova(page);
    await page.waitForTimeout(1300); // auto-advance 1.2s
  }
}

// ── COUNT-AND-WRITE ─────────────────────────────────────────────────────
async function solveCountAndWrite(page: Page, answer: Extract<TaskAnswer, { type: "count-and-write" }>) {
  for (const c of answer.counts) {
    const input = page.locator("main input").first();
    await input.waitFor({ timeout: 10000 });
    await input.fill(String(c));
    await clickComprova(page);
    await page.waitForTimeout(1300); // auto-advance 1.2s
  }
}

// ── WRITE-ANTONYM ───────────────────────────────────────────────────────
// Varijanta sa inputima (la-casa-20) i varijanta sa opcijama po kartici.
async function solveWriteAntonym(page: Page, answer: Extract<TaskAnswer, { type: "write-antonym" }>) {
  await page.waitForSelector("main input, main button", { timeout: 10000 });
  const inputs = page.locator("main input");
  if ((await inputs.count()) > 0) {
    for (let i = 0; i < answer.antonyms.length; i++) {
      await inputs.nth(i).fill(answer.antonyms[i]);
      await page.waitForTimeout(80);
    }
  } else {
    const cards = page
      .locator("main div[class*='bg-white'][class*='rounded-2xl']:visible")
      .filter({ has: page.locator("button") });
    for (let i = 0; i < answer.antonyms.length; i++) {
      const ok = await cards.nth(i).evaluate((el, t) => {
        const norm = (s: string) =>
          (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
        const b = [...el.querySelectorAll<HTMLButtonElement>("button")].find(
          (x) => !x.disabled && norm(x.textContent || "") === norm(t)
        );
        if (!b) return false;
        b.click();
        return true;
      }, answer.antonyms[i]);
      if (!ok) throw new Error(`write-antonym: opcija "${answer.antonyms[i]}" nije u kartici ${i + 1}`);
      await page.waitForTimeout(120);
    }
  }
  await clickComprova(page);
}

// ── ORDER-WORDS ─────────────────────────────────────────────────────────
// Bank reči = button.bg-purple-50; izabrane reči idu u slotove (bg-white).
async function solveOrderWords(page: Page, answer: Extract<TaskAnswer, { type: "order-words" }>) {
  await page.waitForSelector("main button", { timeout: 10000 });
  await page.waitForTimeout(300);
  for (const sentence of answer.sentences) {
    for (const w of sentence) {
      const ok = await page.evaluate((t) => {
        const norm = (s: string) =>
          (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
        const b = [...document.querySelectorAll<HTMLButtonElement>("main button")].find(
          (x) => !x.disabled && /bg-purple-50/.test(x.className) && norm(x.textContent || "") === norm(t)
        );
        if (!b) return false;
        b.click();
        return true;
      }, w);
      if (!ok) throw new Error(`order-words: nema reči "${w}" u banku`);
      await page.waitForTimeout(100);
    }
    await clickComprova(page);
    await page.waitForTimeout(1300); // auto-advance 1.2s
  }
}

// ── LABEL-IMAGE ─────────────────────────────────────────────────────────
// DOM: bank reči su div[role="button"]; slotovi button[data-drop-target="slot-i"].
// Tap reč → tap slot (bez drag&drop).
async function solveLabelImage(page: Page, answer: Extract<TaskAnswer, { type: "label-image" }>) {
  await page.waitForSelector("main [data-drop-target^='slot-']", { timeout: 10000 });
  for (let i = 0; i < answer.labels.length; i++) {
    const ok = await page.evaluate((t) => {
      const norm = (s: string) =>
        (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/·/g, "").toLowerCase().trim();
      const el = [...document.querySelectorAll<HTMLElement>("main [role='button']")].find(
        (x) =>
          x.getAttribute("aria-disabled") !== "true" &&
          !/line-through/.test(x.className) &&
          norm(x.textContent || "") === norm(t)
      );
      if (!el) return false;
      el.click();
      return true;
    }, answer.labels[i]);
    if (!ok) throw new Error(`label-image: nema reči "${answer.labels[i]}" u banku`);
    await page.waitForTimeout(150);
    await page.locator(`[data-drop-target="slot-${i}"]`).click();
    await page.waitForTimeout(200);
  }
  await clickComprova(page);
}

// ── LABEL-WRITE ─────────────────────────────────────────────────────────
// Inputi u DOM-u: prvo leva kolona (x<=50), pa desna (x>50) — originalnim redom.
async function solveLabelWrite(page: Page, answer: Extract<TaskAnswer, { type: "label-write" }>) {
  await page.waitForSelector("main input[type='text']", { timeout: 10000 });
  const order = answer.labels
    .map((_, i) => i)
    .sort((a, b) => (answer.labels[a].x <= 50 ? 0 : 1) - (answer.labels[b].x <= 50 ? 0 : 1));
  const inputs = page.locator("main input[type='text']");
  for (let k = 0; k < order.length; k++) {
    await inputs.nth(k).fill(answer.labels[order[k]].text);
    await page.waitForTimeout(100);
  }
  // auto-check 300ms nakon poslednjeg popunjenog polja
  await page.waitForTimeout(400);
}

// ── COLOR-BY-INSTRUCTION ────────────────────────────────────────────────
// Paleta: button[aria-label="<boja>"]; kartice predmeta: [role="button"] sa
// img[alt="<predmet>"]. Klik boja → klik predmet.
async function solveColorByInstruction(page: Page, answer: Extract<TaskAnswer, { type: "color-by-instruction" }>) {
  await page.waitForSelector("main [role='button']", { timeout: 10000 });
  for (const inst of answer.instructions) {
    await page.locator(`main button[aria-label="${inst.targetColor}"]`).click();
    await page.waitForTimeout(150);
    await page
      .locator(`main [role="button"]:has(img[alt="${inst.targetItem}"])`)
      .first()
      .click();
    await page.waitForTimeout(350);
  }
}

// ── SELF-ASSESSMENT ─────────────────────────────────────────────────────
// U headless Chromiumu nema speech recognition → fallback UI (oceni sam).
async function solveSelfAssessment(page: Page) {
  await clickButtonWhenPresent(page, { regex: "Sense micròfon" }, 2000);
  for (let guard = 0; guard < 40; guard++) {
    const clicked = await page.evaluate(() => {
      const b = [...document.querySelectorAll<HTMLButtonElement>("main button")].find(
        (x) => !x.disabled && /^Ho sé/.test((x.textContent || "").trim())
      );
      if (!b) return false;
      b.click();
      return true;
    });
    if (!clicked) break;
    await page.waitForTimeout(120);
  }
  const ok = await clickButtonWhenPresent(page, { regex: "Continua!" });
  if (!ok) throw new Error("self-assessment: Continua! dugme se nije pojavilo");
}

// ── DRAWING-CANVAS ──────────────────────────────────────────────────────
// Nacrtaj jednu liniju na canvasu pa klikni "Fet!" (dugme aktivno tek kad
// postoji potez četkicom).
async function solveDrawingCanvas(page: Page) {
  const canvas = page.locator("main canvas").first();
  await canvas.waitFor({ timeout: 10000 });
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.55, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(200);
  }
  const ok = await clickButtonWhenPresent(page, { exact: "Fet!" }, 6000);
  if (!ok) throw new Error("drawing-canvas: Fet! dugme nije aktivno posle crtanja");
}

// ── DISPATCHER ──────────────────────────────────────────────────────────
export async function solveTask(page: Page, answer: TaskAnswer) {
  switch (answer.type) {
    case "copy-word":
      return solveCopyWord(page, answer);
    case "fill-letters":
      return solveFillLetters(page, answer);
    case "unscramble":
      return solveUnscramble(page, answer);
    case "matching":
      return solveMatching(page, answer);
    case "word-search":
      return solveWordSearch(page, answer);
    case "classify-columns":
      return solveClassifyColumns(page, answer);
    case "fill-sentence":
      return solveFillSentence(page, answer);
    case "multiple-choice":
      return solveMultipleChoice(page, answer);
    case "self-assessment":
      return solveSelfAssessment(page);
    case "color-by-instruction":
      return solveColorByInstruction(page, answer);
    case "label-image":
      return solveLabelImage(page, answer);
    case "label-write":
      return solveLabelWrite(page, answer);
    case "drawing-canvas":
      return solveDrawingCanvas(page);
    case "add-article":
      return solveAddArticle(page, answer);
    case "separate-words":
      return solveSeparateWords(page, answer);
    case "count-and-write":
      return solveCountAndWrite(page, answer);
    case "write-antonym":
      return solveWriteAntonym(page, answer);
    case "order-words":
      return solveOrderWords(page, answer);
    default:
      throw new Error(`Unknown task type: ${(answer as TaskAnswer).type}`);
  }
}
