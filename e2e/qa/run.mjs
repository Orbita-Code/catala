// run.mjs — Samostalni QA runner: odigra SVAKI zadatak svake teme kao dete,
// tačnim odgovorima iz tasks.json, i prijavi: odigrano/zaglavljeno, oštećene slike,
// console greške, i sve "notes" (pogađano/nepoznato) po zadatku.
//
// Preduslov: dev server na http://localhost:3000  (npm run dev)
// Pokretanje:
//   node e2e/qa/run.mjs                 # sve teme
//   node e2e/qa/run.mjs la-classe       # jedna tema
//   node e2e/qa/run.mjs la-classe el-cos# više tema
//   HEADED=1 node e2e/qa/run.mjs ...    # vidljiv browser (za gledanje kao dete)
//
// Izlaz: konzola + e2e/qa/report.json
// Prvo pokreni:  node e2e/qa/extract-tasks.mjs   (pravi tasks.json)

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { solveTask } from './solve-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || 'http://localhost:3000';
const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks.json'), 'utf8'));
const argSlugs = process.argv.slice(2);
const SLUGS = argSlugs.length ? argSlugs : Object.keys(tasks);

const taskCounter = async (page) => page.evaluate(() => {
  const m = document.body.textContent;
  const mm = m.match(/(\d+)\s*\/\s*(\d+)/);
  // uzmi counter iz zaglavlja (Tema): traži element sa "N/M" u banneru
  const banner = document.querySelector('header, [class*="banner"]');
  const bt = banner ? banner.textContent : '';
  const bm = bt.match(/(\d+)\s*\/\s*(\d+)/);
  return (bm || mm) ? `${(bm || mm)[1]}/${(bm || mm)[2]}` : '';
});

const imgReport = async (page) => page.evaluate(() => [...document.querySelectorAll('main img')].map((i) => ({ alt: i.alt, w: i.naturalWidth, src: (i.currentSrc || i.src).split('/').pop() })).filter((i) => i.src && !/star|mascot|data:/.test(i.src)));

async function clickNext(page) {
  const btn = page.locator('footer button:has-text("Següent"), button:has-text("Següent")').first();
  if (await btn.count() && await btn.isEnabled().catch(() => false)) { await btn.click().catch(() => {}); return true; }
  return false;
}

function findChromium(headless) {
  const base = `${process.env.HOME}/Library/Caches/ms-playwright`;
  // preferiraj instalirani 1232 build (headless shell za headless, full za headed)
  const cands = headless
    ? [`${base}/chromium_headless_shell-1232/chrome-mac-arm64/chrome-headless-shell`,
       `${base}/chromium-1232/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`]
    : [`${base}/chromium-1232/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`];
  return cands.find((p) => fs.existsSync(p)) || undefined;
}

async function run() {
  const headless = !process.env.HEADED;
  const exe = process.env.PW_EXE || findChromium(headless);
  const browser = await chromium.launch({ headless, executablePath: exe });
  // BASIC_AUTH="user:pass" za testiranje produkcije (catala.orbitacode.com iza basic auth-a)
  const httpCredentials = process.env.BASIC_AUTH
    ? { username: process.env.BASIC_AUTH.split(':')[0], password: process.env.BASIC_AUTH.split(':').slice(1).join(':') }
    : undefined;
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 1300 }, httpCredentials });
  // KRITIČNO: neutrališi TTS. App zove speak() na svaku tačnu reč; na macOS speechSynthesis ide kroz
  // SISTEMSKI glas i svira na zvučnicima ČAK i iz headless browsera — solver koji juri kroz copy-word
  // pravi glasnu, neprekidivu kaskadu izgovora. Ovaj init-script stubuje speechSynthesis na SVAKOJ strani.
  await ctx.addInitScript(() => {
    try {
      const noop = () => {};
      Object.defineProperty(window, 'speechSynthesis', {
        configurable: true,
        value: { speak: noop, cancel: noop, pause: noop, resume: noop, getVoices: () => [], addEventListener: noop, removeEventListener: noop },
      });
    } catch (e) {}
  });
  const page = await ctx.newPage();
  const REPORT_PATH = path.join(__dirname, 'report.json');
  // RESUME=1 → učitaj postojeći report.json i preskoči već odrađene teme (spoljni prekid ne gubi napredak)
  const report = process.env.RESUME && fs.existsSync(REPORT_PATH)
    ? JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8')) : {};

  for (const slug of SLUGS) {
    if (process.env.RESUME && report[slug]) { process.stderr.write(`  ⏭  ${slug} već u report.json — preskačem (RESUME)\n`); continue; }
    const themeTasks = tasks[slug];
    const consoleErrors = [];
    page.removeAllListeners('console'); page.removeAllListeners('pageerror');
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message.slice(0, 200)));

    // NAPOMENA: NE koristiti 'networkidle' — Next dev drži HMR websocket otvoren pa se
    // networkidle nikad ne dostigne (30s timeout po goto-u). 'domcontentloaded' + eksplicitan wait.
    await page.goto(`${BASE}/tema/${slug}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('main', { timeout: 15000 }).catch(() => {});
    await page.evaluate(() => localStorage.clear()); // TTS je već neutralisan preko addInitScript-a gore
    await page.goto(`${BASE}/tema/${slug}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('main', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);

    const themeRep = { played: 0, tasks: [], brokenImages: [], consoleErrors };
    const brokenSet = new Set();

    for (let t = 0; t < themeTasks.length; t++) {
      const task = themeTasks[t];
      const notes = [];
      process.stderr.write(`  · ${slug} #${t + 1}/${themeTasks.length} ${task.type} (${task.id})\n`);
      const before = await taskCounter(page);
      // slike pre rešavanja
      const imgs = await imgReport(page);
      for (const im of imgs) if (im.w === 0) brokenSet.add(`${slug}:${task.id || t}:${im.src}(alt=${im.alt})`);

      let solveErr = null;
      try { await solveTask(page, task, notes); }
      catch (e) { solveErr = e.message.slice(0, 160); notes.push('EXCEPTION: ' + solveErr); }

      // pređi na sledeći zadatak — NE dupliraj: klikni Següent SAMO ako se brojač već nije pomerio
      // (neki zadaci se auto-završe pri rešavanju → brojač skoči sam → dupli Següent bi napravio drift)
      let advanced = false;
      let cur = await taskCounter(page);
      if (cur !== before) advanced = true; // već napredovao tokom rešavanja
      for (let a = 0; a < 4 && !advanced; a++) {
        if (await clickNext(page)) { await page.waitForTimeout(250); }
        const after = await taskCounter(page);
        if (after !== before) { advanced = true; break; }
        // možda je kraj (proslava)
        const done = await page.evaluate(() => /Felicitats|Has completat|Molt bé!|Repassa les tasques|Torna a l'inici/i.test(document.body.textContent));
        if (done) { advanced = true; break; }
        await page.waitForTimeout(250);
      }

      themeRep.tasks.push({ i: t + 1, id: task.id, type: task.type, before, after: await taskCounter(page), advanced, notes });
      themeRep.played++;
    }

    themeRep.brokenImages = [...brokenSet];
    report[slug] = themeRep;
    // inkrementalni upis — ako spoljni prekid ubije proces, odrađene teme ostaju sačuvane
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

    // sažetak teme
    const stuck = themeRep.tasks.filter((x) => !x.advanced);
    const noted = themeRep.tasks.filter((x) => x.notes.length);
    console.log(`\n■ ${slug}: ${themeRep.played}/${themeTasks.length} zadataka  | zaglavljeno: ${stuck.length} | sa napomenom: ${noted.length} | console-err: ${consoleErrors.length} | slike-oštećene: ${themeRep.brokenImages.length}`);
    for (const s of stuck) console.log(`   ⚠ ZAGLAVLJEN #${s.i} ${s.type} (${s.id})`);
    for (const n of noted) console.log(`   • #${n.i} ${n.type}: ${n.notes.join(' | ')}`);
    for (const b of themeRep.brokenImages) console.log(`   ✖ SLIKA: ${b}`);
    for (const e of consoleErrors.slice(0, 5)) console.log(`   ✖ CONSOLE: ${e}`);
  }

  fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`\n✅ Izveštaj: e2e/qa/report.json`);
  await browser.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
