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

      /**
       * IDE SE PRAVO NA ZADATAK, NE KLIKOM „Següent" (26.08.2026, audit).
       *
       * Prolaz je otvarao temu jednom i dalje se kretao dugmetom „Sledeće".
       * Čim se korak pomeri za jedan — a to se dešava jer se neki zadaci sami
       * završe pri rešavanju — prolaz igra JEDAN zadatak, a odgovore ima za
       * DRUGI. Otud izveštaj „nije nađena opcija" za sve odgovore odjednom.
       *
       * Provereno na produkciji: zadatak 12 teme 1 prolaz je prijavio kao
       * neispravan (svih 7 opcija „nije nađeno"), a isti niz klikova rukom
       * prolazi svih 7. Kvar je bio u instrumentu, ne u igrici.
       *
       * Sada svaki zadatak počinje od svoje adrese (`?tasca=N`), pa pomeraj
       * koraka više nije moguć. Adresa kao stanje radi od 31.07.2026 (nalaz S3).
       */
      await page.goto(`${BASE}/tema/${slug}?tasca=${t + 1}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForSelector('main', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(600);

      const before = await taskCounter(page);

      /**
       * SLIKE SE MERE TEK KAD SE UČITAJU (26.08.2026, audit).
       *
       * Prolaz je merio širinu slike odmah po dolasku na zadatak i prijavljivao
       * „SLIKA oštećena" za slike koje se prosto još nisu učitale. Provereno:
       * `boca.webp` i `nas.webp` prijavljene kao oštećene, a na produkciji se
       * učitavaju sa 200 i pune veličine (8.446 i 6.594 bajta), i u pregledaču
       * se iscrtavaju na 512 px.
       *
       * Čeka se da svaka slika u zadatku dobije stvarnu širinu, najviše 4 s.
       */
      await page.waitForFunction(
        () => [...document.querySelectorAll('main img')].every((i) => i.complete),
        null, { timeout: 4000 }
      ).catch(() => {});
      // slike pre rešavanja
      const imgs = await imgReport(page);
      for (const im of imgs) if (im.w === 0) brokenSet.add(`${slug}:${task.id || t}:${im.src}(alt=${im.alt})`);

      let solveErr = null;
      // VREMENSKO OGRANIČENJE PO ZADATKU (audit 30.07.2026, rupa T1).
      // Ranije je jedan zadatak koji se ne da rešiti (npr. copy-word sa razmakom)
      // zaglavljivao CEO prolaz — tema les-botigues nikad nije bila odigrana do
      // kraja, a 8 zadataka nikad odigrano. Sada se takav zadatak posle
      // TASK_TIMEOUT_MS zabeleži kao "ISTEKLO VREME", prolaz ide dalje, i na kraju
      // se tačno vidi šta nije odrađeno. Zaglavljen zadatak ne sme da obori prolaz.
      const TASK_TIMEOUT_MS = Number(process.env.TASK_TIMEOUT_MS || 45000);
      try {
        let isteklo;
        const budilnik = new Promise((_, rej) => {
          isteklo = setTimeout(() => rej(new Error(`ISTEKLO VREME (${TASK_TIMEOUT_MS} ms)`)), TASK_TIMEOUT_MS);
        });
        try {
          await Promise.race([solveTask(page, task, notes), budilnik]);
        } finally {
          clearTimeout(isteklo);
        }
      }
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

      /**
       * RUPA T2 ZATVORENA (26.08.2026) — PROVERAVA SE DA JE ODGOVOR TAČAN,
       * NE SAMO DA JE ZADATAK ODIGRAN.
       *
       * Rupa je stajala od 30.07. i kroz nju su prošla SVA ČETIRI zadatka koja
       * je vlasnica našla igrajući sa detetom 24–26.08.: nerešiv zadatak 17
       * (dve kolone od četiri), zadatak 16 bez slika, zadatak 13 sa tri
       * netačna odgovora i bez ičega za čitanje, i samoprocena sa 18 slika bez
       * ijedne napisane reči. Svi su se „odigrali" i prešli dalje — a nijedan
       * se nije mogao REŠITI.
       *
       * Sada se posle svakog zadatka pita SAMU APLIKACIJU šta je zapisala:
       *   • je li zadatak u `completedTasks` (dakle stvarno završen), i
       *   • ima li ijednu zapisanu grešku (u `progress.taskErrors` ILI u
       *     `catala-errors` — greške žive na dva mesta, v. nalaz N-26.4).
       *
       * Prolaz igra TAČNIM odgovorima iz odgovornika. Ako posle toga ostane
       * makar jedna greška, ili zadatak nije upisan kao završen — nešto NE
       * VALJA: ili zadatak nije rešiv, ili odgovornik ne odgovara ekranu.
       * Oba su kvar i oba moraju da se prijave.
       *
       * Dva tipa se ne mogu ovako suditi i to se KAŽE, ne prećuti:
       *   • `drawing-canvas` — slobodno crtanje, nema tačan odgovor
       *   • `self-assessment` — traži da dete IZGOVORI reč; mašina ne govori
       */
      /**
       * ČEKA SE DA APLIKACIJA UPIŠE ISHOD (26.08.2026).
       *
       * Zadatak se ne upisuje u trenutku poslednjeg tačnog odgovora nego posle
       * proslave — konfeti i zeleni okvir traju oko sekundu i po. Prolaz je
       * gledao odmah i zato je zatekao PRAZNU memoriju, pa je svaki zadatak
       * prijavljivao kao „nije završen".
       *
       * Ovo je ISTA greška kao onih pet iz audita 26.08.: merenje u pogrešnom
       * trenutku. Zato se ovde ne meri jednom nego se ČEKA da se upiše, najviše
       * 6 s. Ako se ne upiše ni tada — to je stvaran nalaz.
       */
      for (let i = 0; i < 24; i++) {
        const upisano = await page.evaluate(({ slug, id }) => {
          const P = (JSON.parse(localStorage.getItem('catala-progress') || '{}')[slug]) || {};
          return Array.isArray(P.completedTasks) && P.completedTasks.includes(id);
        }, { slug, id: task.id }).catch(() => false);
        if (upisano) break;
        await page.waitForTimeout(250);
      }

      const ishod = await page.evaluate(({ slug, id }) => {
        const P = (JSON.parse(localStorage.getItem('catala-progress') || '{}')[slug]) || {};
        const E = (JSON.parse(localStorage.getItem('catala-errors') || '{}')[slug]) || {};
        return {
          zavrsen: Array.isArray(P.completedTasks) && P.completedTasks.includes(id),
          greske: [...((P.taskErrors || {})[id] || []), ...((E || {})[id] || [])],
        };
      }, { slug, id: task.id }).catch(() => ({ zavrsen: false, greske: [] }));

      let tacno;
      if (task.type === 'drawing-canvas') tacno = 'slobodno';
      else if (task.type === 'self-assessment') tacno = 'trazi-glas';
      else if (ishod.zavrsen && ishod.greske.length === 0) tacno = true;
      else {
        tacno = false;
        notes.push(ishod.zavrsen
          ? `NIJE TAČNO: ostalo grešaka ${ishod.greske.length} (${ishod.greske.slice(0, 4).join(', ')})`
          : 'NIJE ZAVRŠEN: aplikacija ga nije upisala kao rešen');
      }

      themeRep.tasks.push({ i: t + 1, id: task.id, type: task.type, before, after: await taskCounter(page), advanced, tacno, greske: ishod.greske, notes });
      themeRep.played++;
    }

    themeRep.brokenImages = [...brokenSet];
    report[slug] = themeRep;
    // inkrementalni upis — ako spoljni prekid ubije proces, odrađene teme ostaju sačuvane
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

    // sažetak teme
    /**
     * CRTANJE NIJE ZAGLAVLJEN ZADATAK (26.08.2026, audit).
     *
     * `drawing-canvas` je slobodna aktivnost — nema tačan odgovor i ne završava
     * se sam. Prolaz ga je u SVAKOJ temi prijavljivao kao „ZAGLAVLJEN", dakle
     * dvanaest lažnih uzbuna po prolazu. Tolika buka zaklanja prave zastoje:
     * kad se svaki put javi dvanaest, niko ne primeti trinaesti.
     */
    // T2: koliko je zadataka STVARNO REŠENO TAČNO (v. objašnjenje gore)
    const suditi = themeRep.tasks.filter((x) => x.tacno === true || x.tacno === false);
    const tacnih = themeRep.tasks.filter((x) => x.tacno === true);
    const netacnih = themeRep.tasks.filter((x) => x.tacno === false);
    const stuck = themeRep.tasks.filter((x) => !x.advanced && x.type !== 'drawing-canvas');
    const slobodne = themeRep.tasks.filter((x) => !x.advanced && x.type === 'drawing-canvas');
    const noted = themeRep.tasks.filter((x) => x.notes.length);
    console.log(`\n■ ${slug}: REŠENO TAČNO ${tacnih.length}/${suditi.length}  | odigrano ${themeRep.played}/${themeTasks.length} | zaglavljeno: ${stuck.length} | sa napomenom: ${noted.length} | console-err: ${consoleErrors.length} | slike-oštećene: ${themeRep.brokenImages.length}`);
    for (const x of netacnih) console.log(`   ✖ NIJE REŠEN TAČNO #${x.i} ${x.type} (${x.id})${x.greske.length ? ' — ostalo: ' + x.greske.slice(0, 4).join(', ') : ''}`);
    for (const s of stuck) console.log(`   ⚠ ZAGLAVLJEN #${s.i} ${s.type} (${s.id})`);
    if (slobodne.length) console.log(`   · slobodna aktivnost (crtanje), nema tačnog odgovora: ${slobodne.length}`);
    for (const n of noted) console.log(`   • #${n.i} ${n.type}: ${n.notes.join(' | ')}`);
    for (const b of themeRep.brokenImages) console.log(`   ✖ SLIKA: ${b}`);
    for (const e of consoleErrors.slice(0, 5)) console.log(`   ✖ CONSOLE: ${e}`);
  }

  fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`\n✅ Izveštaj: e2e/qa/report.json`);
  await browser.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
