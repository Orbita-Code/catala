// Validacija src/data/*.ts — 12 tema + themes.ts registar.
// Podaci se ucitavaju transpile/eval pristupom (kao e2e/qa/extract-tasks.mjs),
// jer direktan import ne radi (value import tipova preko "@" aliasa).
import { test } from "node:test";
import assert from "node:assert/strict";
import { SLUGS, loadThemeTasks, loadDataModule } from "../helpers/load-theme-data.mjs";

const KNOWN_TYPES = new Set([
  "copy-word", "fill-letters", "unscramble", "matching", "classify-columns",
  "word-search", "color-by-instruction", "fill-sentence", "label-image",
  "multiple-choice", "self-assessment", "drawing-canvas", "add-article",
  "separate-words", "count-and-write", "write-antonym", "order-words",
  "decode-grid", "label-write",
]);

// Isto pravilo normalizacije kao WordSearch.tsx (NFD + skloni dijakritike + lowercase).
function stripAccents(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Da li se rec nalazi u gridu u bilo kom od 8 pravaca (logika kao WordSearch.tsx).
function wordInGrid(grid, word) {
  const target = stripAccents(word);
  const len = target.length;
  if (len === 0) return false;
  const dirs = [
    [0, 1], [1, 0], [1, 1], [1, -1],
    [0, -1], [-1, 0], [-1, -1], [-1, 1],
  ];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      for (const [dr, dc] of dirs) {
        let str = "";
        let rr = r, cc = c, ok = true;
        for (let k = 0; k < len; k++) {
          if (rr < 0 || rr >= grid.length || cc < 0 || cc >= grid[rr].length) {
            ok = false;
            break;
          }
          str += grid[rr][cc];
          rr += dr;
          cc += dc;
        }
        if (ok && stripAccents(str) === target) return true;
      }
    }
  }
  return false;
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function sortedCopy(arr) {
  return [...arr].sort((a, b) => String(a).localeCompare(String(b)));
}

// Validira jedan zadatak; vraca niz pronadjenih gresaka (prazan = sve OK).
function validateTask(task, slug) {
  const errors = [];
  const where = `${slug}/${task?.id ?? "(bez id-a)"}`;
  const err = (msg) => errors.push(`${where}: ${msg}`);

  if (!task || typeof task !== "object") return [`${where}: zadatak nije objekat`];

  // Obavezna bazna polja
  if (!isNonEmptyString(task.id)) err("nedostaje/prazan id");
  if (!isNonEmptyString(task.type)) err("nedostaje/prazan type");
  else if (!KNOWN_TYPES.has(task.type)) err(`nepoznat type "${task.type}"`);
  if (!isNonEmptyString(task.prompt)) err("nedostaje/prazan prompt");

  switch (task.type) {
    case "copy-word": {
      if (!Array.isArray(task.words) || task.words.length === 0) {
        err("copy-word: words mora biti neprazan niz");
        break;
      }
      task.words.forEach((w, i) => {
        if (!isNonEmptyString(w?.catalan)) err(`copy-word: words[${i}] nema catalan`);
      });
      break;
    }

    case "fill-letters": {
      if (!Array.isArray(task.words) || task.words.length === 0) {
        err("fill-letters: words mora biti neprazan niz");
        break;
      }
      task.words.forEach((w, i) => {
        if (!isNonEmptyString(w?.word)) {
          err(`fill-letters: words[${i}] nema word`);
          return;
        }
        if (!isNonEmptyString(w?.hint)) {
          err(`fill-letters: "${w.word}" nema hint`);
          return;
        }
        if (w.hint.length !== w.word.length) {
          err(`fill-letters: hint "${w.hint}" (${w.hint.length}) i word "${w.word}" (${w.word.length}) nisu iste duzine`);
          return;
        }
        for (let k = 0; k < w.hint.length; k++) {
          if (w.hint[k] !== "_" && w.hint[k] !== w.word[k]) {
            err(`fill-letters: hint "${w.hint}" se ne poklapa sa "${w.word}" na poziciji ${k} ("${w.hint[k]}" != "${w.word[k]}")`);
          }
        }
        if (!w.hint.includes("_")) {
          err(`fill-letters: hint "${w.hint}" nema nijedno prazno mesto ("_")`);
        }
      });
      break;
    }

    case "unscramble": {
      if (!Array.isArray(task.words) || task.words.length === 0) {
        err("unscramble: words mora biti neprazan niz");
        break;
      }
      task.words.forEach((w, i) => {
        if (!isNonEmptyString(w?.scrambled) || !isNonEmptyString(w?.correct)) {
          err(`unscramble: words[${i}] nema scrambled/correct`);
        }
      });
      break;
    }

    case "matching": {
      if (!Array.isArray(task.pairs) || task.pairs.length === 0) {
        err("matching: pairs mora biti neprazan niz");
        break;
      }
      task.pairs.forEach((p, i) => {
        if (!isNonEmptyString(p?.left) || !isNonEmptyString(p?.right)) {
          err(`matching: pairs[${i}] nema left/right`);
        }
      });
      break;
    }

    case "classify-columns": {
      if (!Array.isArray(task.columns) || task.columns.length < 2) {
        err("classify-columns: trebaju bar 2 kolone");
        break;
      }
      const union = [];
      task.columns.forEach((col, i) => {
        if (!isNonEmptyString(col?.title)) err(`classify-columns: columns[${i}] nema title`);
        if (!Array.isArray(col?.items) || col.items.length === 0) {
          err(`classify-columns: kolona "${col?.title ?? i}" ima prazan items`);
        } else {
          union.push(...col.items);
        }
      });
      if (!Array.isArray(task.allItems) || task.allItems.length === 0) {
        err("classify-columns: allItems mora biti neprazan niz");
      } else if (JSON.stringify(sortedCopy(task.allItems)) !== JSON.stringify(sortedCopy(union))) {
        err(`classify-columns: allItems (${task.allItems.length}) nije jednak uniji kolona (${union.length})`);
      }
      break;
    }

    case "word-search": {
      if (typeof task.gridSize !== "number" || task.gridSize <= 0) {
        err("word-search: gridSize mora biti pozitivan broj");
        break;
      }
      if (!Array.isArray(task.grid) || task.grid.length !== task.gridSize) {
        err(`word-search: grid ima ${task.grid?.length ?? 0} redova, gridSize je ${task.gridSize}`);
        break;
      }
      task.grid.forEach((row, i) => {
        if (!Array.isArray(row) || row.length !== task.gridSize) {
          err(`word-search: red ${i} ima ${row?.length ?? 0} celija, gridSize je ${task.gridSize}`);
        }
      });
      if (!Array.isArray(task.words) || task.words.length === 0) {
        err("word-search: words mora biti neprazan niz");
        break;
      }
      task.words.forEach((w) => {
        if (!isNonEmptyString(w)) {
          err("word-search: prazna rec u words");
          return;
        }
        if (!wordInGrid(task.grid, w)) {
          err(`word-search: rec "${w}" se ne nalazi u gridu (8 pravaca, bez dijakritika)`);
        }
      });
      break;
    }

    case "fill-sentence": {
      if (!Array.isArray(task.sentences) || task.sentences.length === 0) {
        err("fill-sentence: sentences mora biti neprazan niz");
        break;
      }
      task.sentences.forEach((s, i) => {
        if (!isNonEmptyString(s?.text)) err(`fill-sentence: sentences[${i}] nema text`);
        if (!isNonEmptyString(s?.blank)) {
          err(`fill-sentence: sentences[${i}] nema blank`);
          return;
        }
        if (s.options !== undefined) {
          if (!Array.isArray(s.options) || s.options.length === 0) {
            err(`fill-sentence: sentences[${i}] ima prazan options`);
          } else if (!s.options.includes(s.blank)) {
            err(`fill-sentence: blank "${s.blank}" nije u options [${s.options.join(", ")}]`);
          }
        }
      });
      break;
    }

    case "label-image":
    case "label-write": {
      if (!isNonEmptyString(task.image)) err(`${task.type}: nedostaje image`);
      if (!Array.isArray(task.labels) || task.labels.length === 0) {
        err(`${task.type}: labels mora biti neprazan niz`);
        break;
      }
      task.labels.forEach((l, i) => {
        if (!isNonEmptyString(l?.text)) err(`${task.type}: labels[${i}] nema text`);
        if (typeof l?.x !== "number" || typeof l?.y !== "number") {
          err(`${task.type}: labels[${i}] nema numericke x/y koordinate`);
        }
      });
      if (task.type === "label-image") {
        if (!Array.isArray(task.options) || task.options.length === 0) {
          err("label-image: options mora biti neprazan niz");
        }
      }
      break;
    }

    case "multiple-choice": {
      if (!Array.isArray(task.questions) || task.questions.length === 0) {
        err("multiple-choice: questions mora biti neprazan niz");
        break;
      }
      task.questions.forEach((q, i) => {
        if (!isNonEmptyString(q?.question)) err(`multiple-choice: questions[${i}] nema question`);
        if (!Array.isArray(q?.options) || q.options.length === 0) {
          err(`multiple-choice: questions[${i}] ima prazan options`);
        } else if (typeof q.correct !== "number" || q.correct < 0 || q.correct >= q.options.length) {
          err(`multiple-choice: questions[${i}].correct (${q.correct}) van opsega options (${q.options.length})`);
        }
      });
      break;
    }

    case "self-assessment": {
      if (!Array.isArray(task.items) || task.items.length === 0) {
        err("self-assessment: items mora biti neprazan niz");
        break;
      }
      task.items.forEach((it, i) => {
        if (!isNonEmptyString(it?.catalan) || !isNonEmptyString(it?.translation)) {
          err(`self-assessment: items[${i}] nema catalan/translation`);
        }
      });
      break;
    }

    case "add-article": {
      if (!Array.isArray(task.words) || task.words.length === 0) {
        err("add-article: words mora biti neprazan niz");
        break;
      }
      task.words.forEach((w, i) => {
        if (!isNonEmptyString(w?.word) || !isNonEmptyString(w?.article)) {
          err(`add-article: words[${i}] nema word/article`);
        }
      });
      break;
    }

    case "separate-words": {
      if (!Array.isArray(task.items) || task.items.length === 0) {
        err("separate-words: items mora biti neprazan niz");
        break;
      }
      task.items.forEach((it, i) => {
        if (!isNonEmptyString(it?.joined)) err(`separate-words: items[${i}] nema joined`);
        if (!Array.isArray(it?.words) || it.words.length === 0) {
          err(`separate-words: items[${i}] nema words niz`);
        }
      });
      break;
    }

    case "count-and-write": {
      if (!Array.isArray(task.items) || task.items.length === 0) {
        err("count-and-write: items mora biti neprazan niz");
        break;
      }
      task.items.forEach((it, i) => {
        if (typeof it?.count !== "number" || it.count < 0) err(`count-and-write: items[${i}] nema validan count`);
        if (!isNonEmptyString(it?.word)) err(`count-and-write: items[${i}] nema word`);
      });
      break;
    }

    case "write-antonym": {
      if (!Array.isArray(task.pairs) || task.pairs.length === 0) {
        err("write-antonym: pairs mora biti neprazan niz");
        break;
      }
      task.pairs.forEach((p, i) => {
        if (!isNonEmptyString(p?.word) || !isNonEmptyString(p?.antonym)) {
          err(`write-antonym: pairs[${i}] nema word/antonym`);
        }
      });
      break;
    }

    case "order-words": {
      if (!Array.isArray(task.sentences) || task.sentences.length === 0) {
        err("order-words: sentences mora biti neprazan niz");
        break;
      }
      task.sentences.forEach((s, i) => {
        if (!Array.isArray(s?.scrambled) || s.scrambled.length === 0) err(`order-words: sentences[${i}] nema scrambled`);
        if (!Array.isArray(s?.correct) || s.correct.length === 0) err(`order-words: sentences[${i}] nema correct`);
        if (Array.isArray(s?.scrambled) && Array.isArray(s?.correct) && s.scrambled.length !== s.correct.length) {
          err(`order-words: sentences[${i}] scrambled (${s.scrambled.length}) i correct (${s.correct.length}) razlicite duzine`);
        }
      });
      break;
    }

    case "decode-grid": {
      if (!task.codeGrid || typeof task.codeGrid !== "object" || Object.keys(task.codeGrid).length === 0) {
        err("decode-grid: codeGrid mora biti neprazan objekat");
        break;
      }
      if (!Array.isArray(task.words) || task.words.length === 0) {
        err("decode-grid: words mora biti neprazan niz");
        break;
      }
      task.words.forEach((w, i) => {
        if (!isNonEmptyString(w?.answer)) err(`decode-grid: words[${i}] nema answer`);
        if (!Array.isArray(w?.codes) || w.codes.length === 0) {
          err(`decode-grid: words[${i}] nema codes niz`);
        } else {
          w.codes.forEach((code) => {
            if (!(code in task.codeGrid)) err(`decode-grid: code "${code}" (words[${i}]) nedostaje u codeGrid`);
          });
        }
      });
      break;
    }

    case "color-by-instruction": {
      if (!isNonEmptyString(task.image)) err("color-by-instruction: nedostaje image");
      if (!Array.isArray(task.instructions) || task.instructions.length === 0) {
        err("color-by-instruction: instructions mora biti neprazan niz");
        break;
      }
      task.instructions.forEach((ins, i) => {
        if (!isNonEmptyString(ins?.text) || !isNonEmptyString(ins?.targetColor) || !isNonEmptyString(ins?.targetItem)) {
          err(`color-by-instruction: instructions[${i}] nema text/targetColor/targetItem`);
        }
      });
      break;
    }

    case "drawing-canvas":
      break; // nema dodatnih obaveznih polja

    default:
      break; // nepoznat type je vec prijavljen gore
  }

  return errors;
}

test("themes.ts: registar ima tacno 12 jedinstvenih tema koje odgovaraju data fajlovima", () => {
  const mod = loadDataModule("themes.ts");
  const themes = mod.themes;
  assert.ok(Array.isArray(themes), "themes.ts mora exportovati niz themes");
  assert.equal(themes.length, 12, `ocekivano 12 tema, nadeno ${themes.length}`);

  const slugs = themes.map((t) => t.slug);
  assert.equal(new Set(slugs).size, slugs.length, "slugovi moraju biti jedinstveni");
  assert.deepEqual(
    sortedCopy(slugs),
    sortedCopy(SLUGS),
    "slugovi u themes.ts moraju odgovarati data fajlovima"
  );
  for (const t of themes) {
    assert.ok(isNonEmptyString(t.name), `tema ${t.slug}: nedostaje name`);
    assert.ok(isNonEmptyString(t.color), `tema ${t.slug}: nedostaje color`);
    assert.ok(isNonEmptyString(t.icon), `tema ${t.slug}: nedostaje icon`);
  }
});

// Exportovano radi negativne provere testa (sanity) — ne utice na runner.
export { validateTask, wordInGrid, stripAccents };

for (const slug of SLUGS) {
  test(`tema "${slug}": svi zadaci imaju validna obavezna polja`, () => {
    const tasks = loadThemeTasks(slug);
    assert.ok(tasks.length > 0, `tema ${slug} nema nijedan zadatak`);

    const errors = [];
    const seenIds = new Set();
    for (const task of tasks) {
      if (task && isNonEmptyString(task.id)) {
        if (seenIds.has(task.id)) errors.push(`${slug}/${task.id}: dupliran id zadatka`);
        seenIds.add(task.id);
      }
      errors.push(...validateTask(task, slug));
    }

    assert.deepEqual(errors, [], `Pronadjene greske u podacima:\n${errors.join("\n")}`);
  });
}
