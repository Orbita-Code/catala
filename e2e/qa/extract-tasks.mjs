// extract-tasks.mjs — Izvlači SVE zadatke sa tačnim odgovorima iz src/data/*.ts u tasks.json
// Koristi pravi TypeScript kompajler (transpile → CommonJS) pa eval, bez tsx/esbuild.
// Pokretanje:  node e2e/qa/extract-tasks.mjs
// Izlaz:       e2e/qa/tasks.json   { "<slug>": [ {task}, ... ], ... }
//
// Zašto postoji: solver (solve-lib.mjs) mora da zna TAČNE odgovore (multiple-choice indeks,
// član za add-article, antonim, parove za matching...) koje ne može da izvede iz DOM-a.
// Data fajlovi su jedini izvor istine → izvlačimo ih deterministički.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', '..');
const dataDir = path.join(root, 'src', 'data');
const require = createRequire(import.meta.url);
const ts = require(path.join(root, 'node_modules', 'typescript', 'lib', 'typescript.js'));

const SLUGS = [
  'la-classe', 'l-escola', 'el-cos', 'la-roba', 'la-casa', 'la-familia',
  'les-botigues', 'el-menjar', 'els-animals', 'la-ciutat', 'els-vehicles', 'els-oficis',
];

function loadTasks(slug) {
  const file = path.join(dataDir, `${slug}.ts`);
  let src = fs.readFileSync(file, 'utf8');
  // izbaci import linije (tipovi) — require stub ionako vraća {}
  src = src.replace(/^\s*import[^\n]*\n/gm, '');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  // eslint-disable-next-line no-new-func
  new Function('exports', 'module', 'require', js)(mod.exports, mod, () => ({}));
  // uzmi prvi export koji je niz zadataka
  const arr = Object.values(mod.exports).find((v) => Array.isArray(v));
  if (!arr) throw new Error(`Nije nađen niz zadataka u ${slug}.ts`);
  return arr;
}

const out = {};
let total = 0;
for (const slug of SLUGS) {
  const tasks = loadTasks(slug);
  out[slug] = tasks;
  total += tasks.length;
  console.log(`  ${slug}: ${tasks.length} zadataka`);
}

const outPath = path.join(__dirname, 'tasks.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`\n✅ ${total} zadataka -> ${path.relative(root, outPath)}`);
