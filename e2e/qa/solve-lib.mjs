// solve-lib.mjs — Playwright solveri za svih 18 tipova zadataka Katalonski igrice.
// Rešava zadatke TAČNIM odgovorima iz tasks.json (izvor istine), pravim klik-događajima.
// Ne pogađa tip iz naslova — pozivalac zna redosled zadataka iz tasks.json.
//
// Izvozi: solveTask(page, task, helpers) i pomoćne funkcije.
// Koristi ga runner run.mjs. Vidi e2e/qa/README.md.

const sleep = (page, ms) => page.waitForTimeout(ms);
// strip = normalizuj za poređenje reči: bez akcenata, ·, ✅ i suvišnih simbola
const strip = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/·/g, '').toLowerCase().replace(/[^a-z' ]/g, '').trim();

// ── zajednički pomoćnici ──────────────────────────────────────────────
async function clickByText(page, selector, text, exact = true) {
  const t = strip(text);
  const xy = await page.evaluate(({ selector, t, exact }) => {
    const els = [...document.querySelectorAll(selector)];
    const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/·/g, '').toLowerCase();
    const el = els.find((e) => !e.disabled && (exact ? norm(e.textContent.trim()) === t : norm(e.textContent).includes(t)));
    if (!el) return null;
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, { selector, t, exact });
  if (!xy) return false;
  await page.mouse.click(xy.x, xy.y);
  return true;
}
async function clickSelectorNth(page, selector, n = 0) {
  const xy = await page.evaluate(({ selector, n }) => {
    const els = [...document.querySelectorAll(selector)].filter((e) => !e.disabled);
    const el = els[n];
    if (!el) return null;
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, { selector, n });
  if (!xy) return false;
  await page.mouse.click(xy.x, xy.y);
  return true;
}
async function clickComprova(page) {
  return clickByText(page, 'main button', 'Comprova', false);
}
async function mainText(page) {
  return page.evaluate(() => document.querySelector('main')?.textContent || '');
}
async function progress(page) {
  return page.evaluate(() => {
    const m = document.querySelector('main');
    return [...(m ? m.querySelectorAll('*') : [])].map((e) => e.textContent.trim()).find((x) => /^\d+ \/ \d+$/.test(x)) || '';
  });
}

// ── COPY-WORD ─────────────────────────────────────────────────────────
async function solveCopyWord(page, task, notes) {
  const words = task.words.map((w) => (typeof w === 'string' ? w : w.catalan));
  // spreman = postoji OMOGUĆENO slovo (novi tiles montirani, ne stari disabled)
  const enabledTiles = async () => page.evaluate(() => [...document.querySelectorAll('main button')].filter((b) => /w-12/.test(b.className) && !b.disabled && b.textContent.trim().length === 1).length);
  for (let i = 0; i < words.length + 3; i++) {
    // sačekaj da se OMOGUĆENA slova sledeće reči renderuju
    for (let k = 0; k < 25 && (await enabledTiles()) === 0; k++) await sleep(page, 100);
    // trenutna reč = donji prikaz (lowercase paragraph) ili iz slike
    const cur = await page.evaluate(() => {
      const m = document.querySelector('main');
      const p = [...m.querySelectorAll('p')].find((p) => { const t = p.textContent.trim(); return t.length >= 1 && t === t.toLowerCase() && /^[a-zàáéèíóòúüç·'’ ]+$/i.test(t) && !/copia|toca|escolta|paraula/i.test(t); });
      return p ? p.textContent.trim() : null;
    });
    if (!cur) break;
    const target = cur.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
    const filled = async () => page.evaluate(() => [...document.querySelectorAll('main button')].filter((b) => /w-11/.test(b.className) && b.textContent.trim() !== '_').length);
    for (const c of target) {
      if (c === ' ' || c === "'" || c === '’' || c === '·') { await page.keyboard.press('Space').catch(() => {}); await sleep(page, 80); continue; }
      const before = await filled();
      const xy = await page.evaluate((c) => {
        const t = [...document.querySelectorAll('main button')].find((b) => /w-12/.test(b.className) && !b.disabled && b.textContent.trim().normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase() === c);
        if (!t) return null; const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }, c);
      if (!xy) { notes.push(`copy-word: nema slova ${c} za "${cur}"`); continue; }
      await page.mouse.click(xy.x, xy.y);
      for (let k = 0; k < 16; k++) { await sleep(page, 40); if (await filled() > before) break; }
    }
    await sleep(page, 250);
    await clickComprova(page);
    await sleep(page, 300);
    // retry ako je nešto pošlo naopako
    if (await clickByText(page, 'main button', 'Torna a provar', false)) { notes.push(`copy-word: retry na "${cur}"`); await sleep(page, 250); }
  }
  return true;
}

// ── FILL-LETTERS ──────────────────────────────────────────────────────
async function solveFillLetters(page, task, notes) {
  // words: {word, hint, image} — blank pozicije = gde hint ima '_'
  const words = (task.words || []).map((w) => ({ word: (w.word || w.catalan || ''), image: (w.image || ''), hint: (w.hint || '') }));
  const byImg = (alt) => words.find((w) => strip(w.image) === strip(alt) || strip(w.word) === strip(alt));
  for (let guard = 0; guard < 80; guard++) {
    // nađi prvi aktivan/prazan blank + sliku njegove reči
    const info = await page.evaluate(() => {
      const m = document.querySelector('main');
      const blanks = [...m.querySelectorAll('button')].filter((b) => /w-8|w-10/.test(b.className) && (b.textContent.trim() === '' || /dashed|border/.test(b.className)) && !/w-12/.test(b.className));
      const empty = blanks.find((b) => b.textContent.trim() === '');
      if (!empty) return null;
      // pozicija blanka u okviru njegovog reda slova
      const row = empty.parentElement;
      const cells = [...row.children];
      const idx = cells.indexOf(empty);
      let sec = row; while (sec && !sec.querySelector('img[alt]')) sec = sec.parentElement;
      const alt = sec?.querySelector('img[alt]')?.alt || '';
      const r = empty.getBoundingClientRect();
      return { idx, alt, xy: { x: r.x + r.width / 2, y: r.y + r.height / 2 } };
    });
    if (!info) break; // sve popunjeno
    const w = byImg(info.alt);
    const need = w ? w.word.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()[info.idx] : null;
    await page.mouse.click(info.xy.x, info.xy.y);
    await sleep(page, 200);
    let clicked = false;
    if (need) clicked = await clickByText(page, 'main button[class*="w-12"]', need, true);
    if (!clicked) { notes.push(`fill-letters: nepoznato slovo za "${info.alt}" idx${info.idx}`); await clickSelectorNth(page, 'main button[class*="w-12"]', 0); }
    await sleep(page, 300);
  }
  await sleep(page, 300);
  await clickComprova(page);
  await sleep(page, 300);
  return true;
}

// ── UNSCRAMBLE ────────────────────────────────────────────────────────
async function solveUnscramble(page, task, notes) {
  const words = (task.words || []).map((w) => (typeof w === 'string' ? w : (w.catalan || w.word)));
  for (let wi = 0; wi < words.length + 2; wi++) {
    const tiles = await page.evaluate(() => [...document.querySelectorAll('main button')].filter((b) => /rounded-xl|rounded-2xl/.test(b.className) && !/Comprova|Torna|Següent|Anterior|Escolta/i.test(b.textContent) && b.textContent.trim().length && b.textContent.trim().length <= 6).map((b) => b.textContent.trim()));
    if (!tiles.length) break;
    // ciljna reč = ona čije se sve slogovi poklapaju sa raspoloživim
    const target = words.find((w) => strip(w).length === tiles.join('').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/·/g, '').length) || words[wi];
    if (!target) break;
    // klikaj slogove tako da formiraju target redom
    let remaining = strip(target);
    let safety = tiles.length + 2;
    while (remaining.length && safety-- > 0) {
      const pick = await page.evaluate((remaining) => {
        const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/·/g, '').toLowerCase();
        const btns = [...document.querySelectorAll('main button')].filter((b) => !b.disabled && /rounded-xl|rounded-2xl/.test(b.className) && b.textContent.trim().length <= 6 && !/Comprova|Torna|Següent|Anterior|Escolta/i.test(b.textContent));
        // izaberi slog koji je prefiks preostalog
        const el = btns.find((b) => remaining.startsWith(norm(b.textContent.trim())) && norm(b.textContent.trim()).length);
        if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, syl: norm(el.textContent.trim()) };
      }, remaining);
      if (!pick) { notes.push(`unscramble: ne mogu složiti "${target}" (ostalo "${remaining}")`); break; }
      await page.mouse.click(pick.x, pick.y);
      remaining = remaining.slice(pick.syl.length);
      await sleep(page, 200);
    }
    await sleep(page, 200);
    await clickByText(page, 'main button', 'Comprova', false);
    await sleep(page, 300);
    if (await clickByText(page, 'main button', 'Torna a provar', false)) { notes.push(`unscramble: retry "${target}"`); await sleep(page, 250); }
  }
  return true;
}

// ── CLASSIFY-COLUMNS ──────────────────────────────────────────────────
async function solveClassifyColumns(page, task, notes) {
  const cols = task.columns || [];
  const colOf = (word) => cols.findIndex((c) => (c.items || []).some((it) => strip(it) === strip(word)));
  for (let guard = 0; guard < 40; guard++) {
    // trenutna reč = veliki font-handwriting element (px-5/py-3, text-2xl+), bez ✅
    const cur = await page.evaluate(() => {
      const m = document.querySelector('main');
      const el = [...m.querySelectorAll('[class*="font-handwriting"]')].find((e) => /text-2xl|text-3xl|text-4xl/.test(e.className) && e.textContent.trim().length && !e.textContent.includes('✅') && !/Comprova|Torna/.test(e.textContent));
      return el ? el.textContent.replace('✅', '').trim() : null;
    });
    if (!cur) break;
    let ci = colOf(cur);
    if (ci < 0) { ci = 0; notes.push(`classify: nepoznata kolona za "${cur}" -> col0`); }
    const ok = await clickSelectorTarget(page, `[data-drop-target="col-${ci}"]`);
    if (!ok) { notes.push(`classify: nema drop kolone col-${ci}`); break; }
    await sleep(page, 320);
  }
  await sleep(page, 300);
  await clickComprova(page);
  await sleep(page, 300);
  return true;
}
async function clickSelectorTarget(page, selector) {
  const xy = await page.evaluate((selector) => {
    const el = document.querySelector(selector); if (!el) return null;
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, selector);
  if (!xy) return false; await page.mouse.click(xy.x, xy.y); return true;
}

// ── MATCHING ──────────────────────────────────────────────────────────
async function solveMatching(page, task, notes) {
  // pairs: [{left, right}] — left je slika (illustrationMatch) ili tekst, right je tekst
  const pairs = (task.pairs || []).map((p) => (Array.isArray(p) ? { left: p[0], right: p[1] } : p));
  const rightOf = (leftWord) => { const p = pairs.find((p) => strip(p.left) === strip(leftWord)); return p ? p.right : null; };
  for (let guard = 0; guard < (pairs.length + 4); guard++) {
    const state = await page.evaluate(() => {
      const m = document.querySelector('main');
      const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/·/g, '').toLowerCase().replace(/[^a-z' ]/g, '').trim();
      // levi = buttoni BEZ data-drop-target (imaju sliku ili tekst)
      const lefts = [...m.querySelectorAll('button')].filter((b) => !b.hasAttribute('data-drop-target') && !/Comprova|Torna|Següent|Anterior|Escolta|Silencia|Men/i.test(b.textContent) && (b.querySelector('img') || /aspect-square|min-h-\[60px\]/.test(b.className)));
      const rights = [...m.querySelectorAll('[data-drop-target^="right-"]')];
      const rd = (b) => { const img = b.querySelector('img'); const src = img && img.getAttribute('src') ? img.getAttribute('src').split('/').pop().replace(/\.\w+$/, '') : ''; return { word: norm(b.textContent.trim()) || norm(src), disabled: b.disabled || /opacity-40|opacity-0|line-through|pointer-events-none/.test(b.className) }; };
      const box = (el) => { el.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
      return {
        lefts: lefts.map((b) => ({ ...rd(b), xy: box(b) })),
        rights: rights.map((b) => ({ key: b.getAttribute('data-drop-target'), ...rd(b), xy: box(b) })),
      };
    });
    const openLeft = state.lefts.find((l) => !l.disabled && l.word);
    if (!openLeft) break;
    const want = rightOf(openLeft.word);
    if (!want) { notes.push(`matching: nema para za "${openLeft.word}"`); break; }
    const right = state.rights.find((r) => strip(r.word) === strip(want) && !r.disabled);
    await page.mouse.click(openLeft.xy.x, openLeft.xy.y);
    await sleep(page, 250);
    if (right) await page.mouse.click(right.xy.x, right.xy.y);
    else { notes.push(`matching: nema desnog "${want}"`); break; }
    await sleep(page, 300);
  }
  await sleep(page, 300);
  await clickComprova(page);
  await sleep(page, 250);
  return true;
}

// ── FILL-SENTENCE ─────────────────────────────────────────────────────
async function solveFillSentence(page, task, notes) {
  // tačni odgovori: task.sentences[].blank ili task.blanks — čuvaj ORIGINAL (sa akcentima),
  // jer dugme na ekranu ima akcente ("avió", "autobús"); poređenje po skinutim akcentima kao fallback.
  const answers = [];
  if (Array.isArray(task.sentences)) for (const s of task.sentences) { if (s.blank) answers.push(s.blank); if (Array.isArray(s.blanks)) s.blanks.forEach((b) => answers.push(b)); }
  if (Array.isArray(task.blanks)) task.blanks.forEach((b) => answers.push(b));
  // klikni tačne opcije redom (svaka popuni sledeći prazan blank)
  await page.waitForSelector('main button', { timeout: 4000 }).catch(() => {});
  await sleep(page, 300);
  for (let bi = 0; bi < answers.length; bi++) {
    const want = answers[bi];
    if (!want) continue;
    // PRAVI Playwright lokator-klik sa timeout-om (SAM čeka render/scroll; koordinatni klik promašuje zbog framer-motion transforma)
    let clicked = false;
    try {
      const loc = page.getByRole('button', { name: want, exact: true });
      if (await loc.count()) { await loc.first().click({ timeout: 2500 }); clicked = true; }
    } catch { /* fallthrough */ }
    // fallback: nađi dugme čiji tekst (bez akcenata) == want (bez akcenata) — rešava "avió" vs "avio"
    if (!clicked) {
      clicked = await page.evaluate((w) => {
        const S = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/·/g, '').toLowerCase().trim();
        const btn = [...document.querySelectorAll('main button')].find((b) => S(b.textContent || '') === S(w) && !b.disabled);
        if (btn) { btn.click(); return true; }
        return false;
      }, want).catch(() => false);
    }
    if (!clicked) notes.push(`fill-sentence: nije nađena opcija "${want}"`);
    await sleep(page, 450);
  }
  if (!answers.length) notes.push('fill-sentence: nema odgovora u data (proveri oblik)');
  await sleep(page, 200);
  await clickByText(page, 'main button', 'Comprova', false);
  await sleep(page, 250);
  return true;
}

// ── MULTIPLE-CHOICE ───────────────────────────────────────────────────
async function solveMultipleChoice(page, task, notes) {
  const qs = task.questions || [task];
  for (let qi = 0; qi < qs.length + 2; qi++) {
    const q = qs[Math.min(qi, qs.length - 1)];
    // tačan odgovor: correctIndex/correct/answer
    const correct = q.correctAnswer ?? q.correct ?? (Array.isArray(q.options) && q.correctIndex != null ? q.options[q.correctIndex] : null);
    const opts = await page.evaluate(() => {
      const m = document.querySelector('main');
      return [...m.querySelectorAll('button')].filter((b) => /rounded-2xl/.test(b.className) && b.textContent.trim().length && !/Comprova|Torna|Següent|Anterior|Escolta/i.test(b.textContent) && !b.disabled).map((b) => b.textContent.trim());
    });
    if (!opts.length) break;
    let clicked = false;
    if (correct) { try { const loc = page.getByRole('button', { name: String(correct), exact: true }); if (await loc.count()) { await loc.first().click({ timeout: 2500 }); clicked = true; } } catch { /* */ } }
    if (!clicked && correct) clicked = await clickByText(page, 'main button', String(correct), false);
    if (!clicked) { await clickSelectorNth(page, 'main button[class*="rounded-2xl"]', 0); notes.push('MC: pogađan odgovor'); }
    await sleep(page, 450);
    // sledeće pitanje se pojavi automatski; prekini ako nema promene
    if (qi >= qs.length - 1) break;
  }
  return true;
}

// ── ADD-ARTICLE ───────────────────────────────────────────────────────
async function solveAddArticle(page, task, notes) {
  const words = (task.words || []).map((w) => ({ word: (w.word || w.catalan || ''), article: (w.article || w.correct || '') }));
  // zadatak napreduje reč-po-reč; mapiramo po prikazanoj reči (pouzdanije od indeksa)
  let lastWord = '';
  for (let guard = 0; guard < words.length + 6; guard++) {
    // reč = span.font-handwriting (text-3xl font-black)
    const curWord = await page.evaluate(() => {
      const m = document.querySelector('main');
      const el = [...m.querySelectorAll('span')].find((e) => /font-handwriting/.test(e.className) && e.textContent.trim().length);
      return el ? el.textContent.replace(/[✅❌]/g, '').trim() : null;
    });
    if (!curWord) break;
    if (curWord === lastWord) { // nije napredovalo — sačekaj malo pa probaj opet
      await sleep(page, 250);
    }
    const w = words.find((x) => strip(x.word) === strip(curWord));
    let clicked = false;
    if (w && w.article) { try { const loc = page.getByRole('button', { name: w.article, exact: true }); if (await loc.count()) { await loc.first().click({ timeout: 2500 }); clicked = true; } } catch { /* */ } }
    if (!clicked) { notes.push(`add-article: nepoznat član za "${curWord}"`); await clickSelectorNth(page, 'main button[class*="min-w-[70px]"]', 0); }
    lastWord = curWord;
    await sleep(page, 450);
  }
  return true;
}

// ── SEPARATE-WORDS ────────────────────────────────────────────────────
async function solveSeparateWords(page, task, notes) {
  // task.sentence (spojeno) + task.words (razdvojeno) → pozicije granica
  const solution = task.solution || task.correct || (Array.isArray(task.words) ? task.words.join(' ') : null);
  const joined = (task.text || task.sentence || '').replace(/\s+/g, '');
  // pozicije separatora = kumulativne dužine reči
  const parts = (solution || '').split(/\s+/).filter(Boolean);
  let pos = 0; const boundaries = [];
  for (let i = 0; i < parts.length - 1; i++) { pos += strip(parts[i]).length; boundaries.push(pos); }
  // klikaj separator na tim pozicijama (toggleSeparator(i+1) → i = index karaktera)
  for (const b of boundaries) {
    // nađi b-ti separator klikabilni element
    const ok = await page.evaluate((b) => {
      const m = document.querySelector('main');
      const seps = [...m.querySelectorAll('[class*="min-h-[56px]"]')];
      const el = seps[b - 1];
      if (!el) return false; el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = el.getBoundingClientRect(); window.__sx = r.x + r.width / 2; window.__sy = r.y + r.height / 2; return true;
    }, b);
    if (ok) { const xy = await page.evaluate(() => ({ x: window.__sx, y: window.__sy })); await page.mouse.click(xy.x, xy.y); await sleep(page, 250); }
    else notes.push(`separate-words: nema separatora na ${b}`);
  }
  await sleep(page, 200);
  await clickByText(page, 'main button', 'Comprova', false);
  await sleep(page, 300);
  return true;
}

// ── COUNT-AND-WRITE ───────────────────────────────────────────────────
async function solveCountAndWrite(page, task, notes) {
  const answers = (task.items || task.questions || []).map((q) => String(q.count ?? q.answer ?? q.correct ?? ''));
  const inputs = await page.$$('main input[type="text"], main input[type="number"]');
  for (let i = 0; i < inputs.length; i++) {
    const val = answers[i] || String(task.answer ?? '1');
    await inputs[i].fill(val);
    await sleep(page, 150);
  }
  await clickByText(page, 'main button', 'Comprova', false);
  await sleep(page, 300);
  return true;
}

// ── WRITE-ANTONYM ─────────────────────────────────────────────────────
async function solveWriteAntonym(page, task, notes) {
  const pairs = task.pairs || task.items || [];
  // ima varijanta sa opcijama (klik) i sa input poljem
  const optClicked = await page.evaluate(() => [...document.querySelectorAll('main button')].some((b) => /font-handwriting/.test(b.className)));
  if (optClicked) {
    for (let i = 0; i < pairs.length + 1; i++) {
      const want = pairs[i] ? (pairs[i].antonym || pairs[i].answer || pairs[i][1]) : null;
      if (!want) break;
      if (!(await clickByText(page, 'main button', want, true))) { notes.push(`antonym: nema opcije "${want}"`); }
      await sleep(page, 250);
    }
  } else {
    const inputs = await page.$$('main input');
    for (let i = 0; i < inputs.length; i++) { const want = pairs[i]?.antonym || pairs[i]?.answer || pairs[i]?.[1] || ''; await inputs[i].fill(want); await sleep(page, 150); }
  }
  await clickByText(page, 'main button', 'Comprova', false);
  await sleep(page, 300);
  return true;
}

// ── ORDER-WORDS ───────────────────────────────────────────────────────
async function solveOrderWords(page, task, notes) {
  const order = (task.correctOrder || task.words || task.solution?.split(/\s+/) || []).map((w) => strip(w));
  for (const w of order) {
    if (!(await clickByText(page, 'main button', w, true))) notes.push(`order-words: nema reči "${w}"`);
    await sleep(page, 250);
  }
  await clickByText(page, 'main button', 'Comprova', false);
  await sleep(page, 300);
  return true;
}

// ── DECODE-GRID ───────────────────────────────────────────────────────
async function solveDecodeGrid(page, task, notes) {
  const answer = (task.answer || task.solution || task.word || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  const inputs = await page.$$('main input[type="text"]');
  for (let i = 0; i < inputs.length && i < answer.length; i++) { await inputs[i].fill(answer[i]); await sleep(page, 120); }
  if (!answer) notes.push('decode-grid: nepoznat odgovor u data');
  await clickByText(page, 'main button', 'Comprova', false);
  await sleep(page, 300);
  return true;
}

// ── LABEL-IMAGE / LABEL-WRITE ─────────────────────────────────────────
async function solveLabelImage(page, task, notes) {
  const labels = (task.labels || task.hotspots || []).map((l) => (typeof l === 'string' ? l : (l.label || l.correct || l.word)));
  for (let i = 0; i < labels.length; i++) {
    const w = labels[i]; if (!w) continue;
    const clickedWord = await clickByText(page, 'main button', w, true);
    await sleep(page, 250);
    await clickSelectorTarget(page, `[data-drop-target="slot-${i}"]`);
    await sleep(page, 300);
    if (!clickedWord) notes.push(`label-image: nema reči "${w}"`);
  }
  await clickByText(page, 'main button', 'Comprova', false);
  await sleep(page, 300);
  return true;
}
async function solveLabelWrite(page, task, notes) {
  const labels = (task.labels || task.hotspots || []).map((l) => (typeof l === 'string' ? l : (l.label || l.correct || l.word)));
  const inputs = await page.$$('main input[type="text"]');
  for (let i = 0; i < inputs.length && i < labels.length; i++) { await inputs[i].fill(labels[i] || ''); await sleep(page, 150); }
  await clickByText(page, 'main button', 'Comprova', false);
  await sleep(page, 300);
  return true;
}

// ── COLOR-BY-INSTRUCTION (best-effort) ────────────────────────────────
async function solveColorByInstruction(page, task, notes) {
  const areas = task.areas || task.items || [];
  for (const a of areas) {
    const color = a.color; const target = a.area || a.item || a.name;
    if (color) await clickByText(page, 'main button', color, false);
    await sleep(page, 200);
    if (target) await clickByText(page, 'main button', target, false);
    await sleep(page, 300);
  }
  notes.push('color-by-instruction: best-effort (vizuelno proveriti)');
  return true;
}

// ── SELF-ASSESSMENT ───────────────────────────────────────────────────
async function solveSelfAssessment(page) {
  // samoprocena — nema tačnosti; oceni sve "da" (zeleno) ili skloni (skip), pa nastavi
  for (let i = 0; i < 30; i++) {
    const did = await page.evaluate(() => {
      const m = document.querySelector('main');
      const btn = [...m.querySelectorAll('button')].find((b) => /bg-green-100/.test(b.className) && !b.disabled);
      if (btn) { btn.scrollIntoView({ block: 'center', behavior: 'instant' }); btn.click(); return true; }
      return false;
    });
    if (!did) break;
    await sleep(page, 250);
  }
  // dugme za nastavak/kraj (primary)
  await clickByText(page, 'main button', 'Continua', false);
  await clickByText(page, 'main button', 'Acaba', false);
  await sleep(page, 250);
  return true;
}

// ── DRAWING-CANVAS ────────────────────────────────────────────────────
async function solveDrawingCanvas(page) {
  // povuci jednu liniju na canvasu pa klikni dugme za kraj
  const box = await page.evaluate(() => { const c = document.querySelector('main canvas'); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  if (box) {
    await page.mouse.move(box.x + box.w * 0.3, box.y + box.h * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.w * 0.7, box.y + box.h * 0.5, { steps: 8 });
    await page.mouse.up();
    await sleep(page, 300);
  }
  await clickByText(page, 'main button', 'He acabat', false);
  await sleep(page, 250);
  return true;
}

// ── DISPATCHER ────────────────────────────────────────────────────────
export async function solveTask(page, task, notes) {
  switch (task.type) {
    case 'copy-word': return solveCopyWord(page, task, notes);
    case 'fill-letters': return solveFillLetters(page, task, notes);
    case 'unscramble': return solveUnscramble(page, task, notes);
    case 'classify-columns': return solveClassifyColumns(page, task, notes);
    case 'matching': return solveMatching(page, task, notes);
    case 'fill-sentence': return solveFillSentence(page, task, notes);
    case 'multiple-choice': return solveMultipleChoice(page, task, notes);
    case 'add-article': return solveAddArticle(page, task, notes);
    case 'separate-words': return solveSeparateWords(page, task, notes);
    case 'count-and-write': return solveCountAndWrite(page, task, notes);
    case 'write-antonym': return solveWriteAntonym(page, task, notes);
    case 'order-words': return solveOrderWords(page, task, notes);
    case 'decode-grid': return solveDecodeGrid(page, task, notes);
    case 'word-search': return solveWordSearch(page, task, notes);
    case 'label-image': return solveLabelImage(page, task, notes);
    case 'label-write': return solveLabelWrite(page, task, notes);
    case 'color-by-instruction': return solveColorByInstruction(page, task, notes);
    case 'self-assessment': return solveSelfAssessment(page);
    case 'drawing-canvas': return solveDrawingCanvas(page);
    default: notes.push(`NEPOZNAT tip: ${task.type}`); return false;
  }
}

// ── WORD-SEARCH (drag u gridu) ────────────────────────────────────────
async function solveWordSearch(page, task, notes) {
  const grid = task.grid; const words = task.words || [];
  if (!grid) { notes.push('word-search: nema grida u data'); return false; }
  await page.waitForSelector('[data-cell]', { timeout: 5000 }).catch(() => {});
  await sleep(page, 300);
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  const S = (s) => strip(s);
  for (const wd of words) {
    const w = S(wd); let placed = false;
    for (let r = 0; r < grid.length && !placed; r++) for (let c = 0; c < grid[r].length && !placed; c++) for (const [dr, dc] of dirs) {
      // izračunaj CELU putanju ćelija (ne samo start/kraj)
      const path = []; let ok = true;
      for (let i = 0; i < w.length; i++) { const nr = r + dr * i, nc = c + dc * i; if (nr < 0 || nc < 0 || nr >= grid.length || nc >= grid[r].length || S(grid[nr][nc]) !== w[i]) { ok = false; break; } path.push([nr, nc]); }
      if (!ok) continue;
      // uzmi centar svake ćelije
      const pts = [];
      for (const [pr, pc] of path) { const xy = await cellXY(page, pr, pc); if (xy) pts.push(xy); }
      if (pts.length === path.length) {
        // prevuci: down na prvoj, pređi kroz centar SVAKE ćelije (okida onMouseEnter), up
        await page.mouse.move(pts[0].x, pts[0].y); await page.mouse.down();
        for (let i = 1; i < pts.length; i++) { await page.mouse.move(pts[i].x, pts[i].y); await sleep(page, 90); }
        await page.mouse.up(); await sleep(page, 250); placed = true;
      }
    }
    if (!placed) notes.push(`word-search: nije nađena reč "${wd}"`);
  }
  return true;
}
async function cellXY(page, r, c) {
  return page.evaluate(({ r, c }) => {
    const el = document.querySelector(`[data-row="${r}"][data-col="${c}"]`) || document.querySelector(`[data-cell="${r}-${c}"]`);
    if (!el) return null; el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const rc = el.getBoundingClientRect(); return { x: rc.x + rc.width / 2, y: rc.y + rc.height / 2 };
  }, { r, c });
}

export { clickComprova, mainText, progress };
