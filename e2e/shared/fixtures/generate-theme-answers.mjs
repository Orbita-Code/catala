// generate-theme-answers.mjs — regeneriše theme-answers.ts iz e2e/qa/tasks.json
// (izvor istine za odgovore, izvađen iz src/data/task-data).
//
// Pokretanje:
//   node e2e/qa/extract-tasks.mjs                          # prvo osveži tasks.json
//   node e2e/shared/fixtures/generate-theme-answers.mjs    # pa ovaj fajl
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tasksPath = path.join(__dirname, "../../qa/tasks.json");
const outPath = path.join(__dirname, "theme-answers.ts");
const data = JSON.parse(fs.readFileSync(tasksPath, "utf8"));

function mapTask(t) {
  switch (t.type) {
    case "copy-word":
      return { id: t.id, type: t.type, words: t.words.map((w) => w.catalan) };
    case "fill-letters":
      return { id: t.id, type: t.type, words: t.words.map((w) => ({ word: w.word, hint: w.hint || "" })) };
    case "unscramble":
      return { id: t.id, type: t.type, words: t.words.map((w) => ({ scrambled: w.scrambled, correct: w.correct })) };
    case "matching":
      return { id: t.id, type: t.type, illustrationMatch: !!t.illustrationMatch, pairs: t.pairs.map((p) => ({ left: p.left, right: p.right })) };
    case "word-search":
      return { id: t.id, type: t.type, gridSize: t.gridSize, words: t.words, grid: t.grid };
    case "classify-columns":
      return { id: t.id, type: t.type, columns: t.columns.map((c) => ({ title: c.title, items: c.items })) };
    case "fill-sentence":
      return { id: t.id, type: t.type, blanks: t.sentences.map((s) => s.blank) };
    case "multiple-choice":
      return { id: t.id, type: t.type, answers: t.questions.map((q) => q.options[q.correct]) };
    case "self-assessment":
      return { id: t.id, type: t.type };
    case "color-by-instruction":
      return { id: t.id, type: t.type, instructions: t.instructions.map((i) => ({ targetItem: i.targetItem, targetColor: i.targetColor })) };
    case "label-image":
      return { id: t.id, type: t.type, labels: t.labels.map((l) => l.text) };
    case "label-write":
      return { id: t.id, type: t.type, labels: t.labels.map((l) => ({ text: l.text, x: l.x })) };
    case "drawing-canvas":
      return { id: t.id, type: t.type };
    case "add-article":
      return { id: t.id, type: t.type, words: t.words.map((w) => ({ word: w.word, article: w.article })) };
    case "separate-words":
      return { id: t.id, type: t.type, items: t.items.map((i) => ({ joined: i.joined, words: i.words })) };
    case "count-and-write":
      return { id: t.id, type: t.type, counts: t.items.map((i) => i.count) };
    case "write-antonym":
      return { id: t.id, type: t.type, antonyms: t.pairs.map((p) => p.antonym) };
    case "order-words":
      return { id: t.id, type: t.type, sentences: t.sentences.map((s) => s.correct) };
    default:
      throw new Error(`Nepoznat tip zadatka: ${t.type} (${t.id})`);
  }
}

const themes = {};
for (const [slug, tasks] of Object.entries(data)) {
  themes[slug] = tasks.map(mapTask);
}

const header = `/**
 * Answer keys for all tasks across 12 themes — GENERATED from e2e/qa/tasks.json
 * (which is extracted from src/data/task-data). Do not edit by hand; regenerate:
 *   node e2e/qa/extract-tasks.mjs && node e2e/shared/fixtures/generate-theme-answers.mjs
 */

export type TaskAnswer =
  | { id: string; type: "copy-word"; words: string[] }
  | { id: string; type: "fill-letters"; words: { word: string; hint: string }[] }
  | { id: string; type: "unscramble"; words: { scrambled: string; correct: string }[] }
  | { id: string; type: "matching"; illustrationMatch: boolean; pairs: { left: string; right: string }[] }
  | { id: string; type: "word-search"; gridSize: number; words: string[]; grid: string[][] }
  | { id: string; type: "classify-columns"; columns: { title: string; items: string[] }[] }
  | { id: string; type: "fill-sentence"; blanks: string[] }
  | { id: string; type: "multiple-choice"; answers: string[] }
  | { id: string; type: "self-assessment" }
  | { id: string; type: "color-by-instruction"; instructions: { targetItem: string; targetColor: string }[] }
  | { id: string; type: "label-image"; labels: string[] }
  | { id: string; type: "label-write"; labels: { text: string; x: number }[] }
  | { id: string; type: "drawing-canvas" }
  | { id: string; type: "add-article"; words: { word: string; article: string }[] }
  | { id: string; type: "separate-words"; items: { joined: string; words: string[] }[] }
  | { id: string; type: "count-and-write"; counts: number[] }
  | { id: string; type: "write-antonym"; antonyms: string[] }
  | { id: string; type: "order-words"; sentences: string[][] };
`;

const body =
  header +
  "\nexport const themeAnswers: Record<string, TaskAnswer[]> = " +
  JSON.stringify(themes, null, 2) +
  ";\n";

fs.writeFileSync(outPath, body);
const total = Object.values(themes).flat().length;
console.log(`✅ ${total} zadataka -> ${path.relative(process.cwd(), outPath)}`);
for (const [slug, tasks] of Object.entries(themes)) console.log(`  ${slug}: ${tasks.length}`);
