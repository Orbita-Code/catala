// Ucitava src/data/*.ts module bez Next.js okruzenja.
// Isti pristup kao e2e/qa/extract-tasks.mjs: TypeScript transpile -> CommonJS -> eval
// sa require stub-om. Direktan import ne radi jer data fajlovi koriste
// `import { Task } from "@/types/tasks"` (value import tipa + "@" path alias).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const require = createRequire(import.meta.url);
const ts = require(path.join(root, "node_modules", "typescript", "lib", "typescript.js"));

export const SLUGS = [
  "la-classe", "l-escola", "el-cos", "la-roba", "la-casa", "la-familia",
  "les-botigues", "el-menjar", "els-animals", "la-ciutat", "els-vehicles", "els-oficis",
];

export function loadDataModule(fileName) {
  const file = path.join(root, "src", "data", fileName);
  let src = fs.readFileSync(file, "utf8");
  // izbaci import linije (tipovi) — require stub ionako vraca {}
  src = src.replace(/^\s*import[^\n]*\n/gm, "");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  // eslint-disable-next-line no-new-func
  new Function("exports", "module", "require", js)(mod.exports, mod, () => ({}));
  return mod.exports;
}

// Vraca prvi export koji je niz zadataka (kao extract-tasks.mjs).
export function loadThemeTasks(slug) {
  const exports = loadDataModule(`${slug}.ts`);
  const arr = Object.values(exports).find((v) => Array.isArray(v));
  if (!arr) throw new Error(`Nije nadjen niz zadataka u ${slug}.ts`);
  return arr;
}
