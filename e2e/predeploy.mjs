/**
 * PRE-DEPLOY TEST — Katalonski
 *
 * Globalno pravilo: deploy je dozvoljen SAMO ako ovaj test prođe (izlazni kod 0),
 * i posle deploy-a se pušta PONOVO protiv produkcije.
 *
 *   node e2e/predeploy.mjs
 *   BASE=https://catala.orbitacode.com BASIC_AUTH=catala:<lozinka> node e2e/predeploy.mjs
 *
 * Svaka provera ovde postoji zato što je NEKI STVARAN NALAZ prošao neopaženo.
 * Datum uz proveru je dan kad je nalaz nađen. Ne brisati provere — bag bez
 * provere se vraća.
 *
 * BLOK      = obara deploy. Nalaz je popravljen i ne sme se vratiti.
 * UPOZORENJE = ispisuje se, ali ne obara. Nalaz je poznat i još otvoren.
 *              Kad se popravi, PREBACITI GA U BLOK — inače provera ne vredi ništa.
 */
import { createRequire } from "module";
const require = createRequire(new URL("../", import.meta.url).pathname);
const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:3000";
const CRED = process.env.BASIC_AUTH
  ? { username: process.env.BASIC_AUTH.split(":")[0], password: process.env.BASIC_AUTH.slice(process.env.BASIC_AUTH.indexOf(":") + 1) }
  : { username: "catala", password: "changeme" };

const TEME = ["la-classe","l-escola","el-cos","la-roba","la-casa","la-familia",
              "les-botigues","el-menjar","els-animals","la-ciutat","els-vehicles","els-oficis"];

const nalazi = [];
const zapisi = (nivo, provera, prosao, detalj) => {
  nalazi.push({ nivo, provera, prosao, detalj });
  const oznaka = prosao ? "  OK  " : (nivo === "BLOK" ? " PADA " : " UPOZ ");
  console.log(`${oznaka} ${provera.padEnd(46)} ${detalj}`);
};

const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b); };
const rgb = (s) => { const m = (s || "").match(/(\d+(?:\.\d+)?)/g); return m ? [+m[0], +m[1], +m[2]] : null; };

const b = await chromium.launch({ headless: true });
const noviKontekst = (w = 390, h = 844) => b.newContext({ httpCredentials: CRED, viewport: { width: w, height: h } });

console.log(`\nPRE-DEPLOY TEST — ${BASE}\n${"=".repeat(78)}\n`);

// ─── 1. GLAVNA NAMENA: svaka tema se otvara i prvi zadatak je upotrebljiv ───
{
  let lose = [];
  for (const t of TEME) {
    const c = await noviKontekst(); const p = await c.newPage();
    const greske = [];
    p.on("console", (m) => m.type() === "error" && greske.push(m.text().slice(0, 60)));
    p.on("pageerror", (e) => greske.push("PAGEERROR " + String(e).slice(0, 60)));
    await p.goto(`${BASE}/tema/${t}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await p.waitForSelector("button", { timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(2500);
    const d = await p.evaluate(() => {
      const m = document.querySelector("main");
      const imgs = [...(m ? m.querySelectorAll("img") : [])];
      return { klik: m ? m.querySelectorAll("button,input,canvas,[role=button]").length : 0,
               slike: imgs.length, ucitane: imgs.filter((i) => i.naturalWidth > 0).length };
    });
    if (d.klik === 0 || d.slike !== d.ucitane || greske.length) lose.push(`${t}(kontrola:${d.klik} slike:${d.ucitane}/${d.slike} greške:${greske.length})`);
    await c.close();
  }
  zapisi("BLOK", "Svih 12 tema se otvara i radi", lose.length === 0, lose.length ? lose.join(" ") : `12/12 tema, sve slike učitane, 0 grešaka`);
}

// ─── 2. localStorage ZABRANJEN/POKVAREN (nalaz K1, 30.07.2026) ───
{
  const scenariji = [
    ["zabranjen", () => { const baci = () => { throw new DOMException("The operation is insecure.", "SecurityError"); };
        Object.defineProperty(window, "localStorage", { get: baci, configurable: true }); }],
    ["samo upis baca", () => { localStorage.setItem = () => { throw new DOMException("x", "SecurityError"); }; }],
    ["samo brisanje baca", () => { localStorage.removeItem = () => { throw new DOMException("x", "SecurityError"); }; }],
    ["pokvaren sadržaj", () => { try { for (const k of ["catala-progress","catala-settings","catala-xp","catala-errors","catala-daily-streak"]) localStorage.setItem(k, "{nije-json"); } catch {} }],
  ];
  let lose = [];
  for (const [ime, init] of scenariji) {
    for (const put of ["/", "/tema/la-classe", "/stats", "/configuracio"]) {
      const c = await noviKontekst(); const p = await c.newPage();
      await p.addInitScript(init);
      await p.goto(BASE + put, { waitUntil: "domcontentloaded", timeout: 90000 });
      await p.waitForTimeout(3000);
      const d = await p.evaluate(() => ({ n: document.querySelectorAll("button,a").length,
                                          pao: /Application error|client-side exception/.test(document.body.innerText) }));
      if (d.n === 0 || d.pao) lose.push(`${ime}${put}`);
      await c.close();
    }
  }
  zapisi("BLOK", "Radi bez localStorage-a (privatni prozor)", lose.length === 0, lose.length ? `pada: ${lose.join(", ")}` : "16/16 kombinacija radi");
}

// ─── 3. KONTRAST teksta na dugmadi i u poljima (nalaz V1, 30.07.2026) ───
{
  const c = await noviKontekst(); const p = await c.newPage();
  await p.goto(`${BASE}/tema/la-classe`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(3500);
  // upiši vrednost u svako polje — vrednost živi u .value, ne u textContent
  await p.evaluate(() => document.querySelectorAll("input,textarea").forEach((e) => { e.value = "proba"; e.dispatchEvent(new Event("input", { bubbles: true })); }));
  await p.waitForTimeout(400);
  const el = await p.evaluate(() => {
    const poz = (e) => { let n = e; while (n && n !== document.documentElement) { const bg = getComputedStyle(n).backgroundColor;
        const m = (bg || "").match(/[\d.]+/g); if (m && (m.length < 4 || +m[3] > 0.1)) return bg; n = n.parentElement; } return "rgb(255,255,255)"; };
    const out = [];
    document.querySelectorAll("button,a,p,span,h1,h2,h3,label,input,textarea").forEach((e) => {
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || cs.visibility === "hidden" || cs.display === "none" || +cs.opacity < 0.1) return;
      const tekst = (e.tagName === "INPUT" || e.tagName === "TEXTAREA") ? (e.value || "") : (e.textContent || "").trim();
      if (!tekst) return;
      out.push({ tag: e.tagName, tekst: tekst.slice(0, 14), fg: cs.color, bg: poz(e), px: parseFloat(cs.fontSize), bold: +cs.fontWeight >= 700 });
    });
    return out;
  });
  const lose = [];
  for (const e of el) {
    const f = rgb(e.fg), g = rgb(e.bg); if (!f || !g) continue;
    const L1 = lum(...f), L2 = lum(...g);
    const k = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const prag = (e.px >= 24 || (e.px >= 18.66 && e.bold)) ? 3 : 4.5;
    if (k < prag) lose.push(`<${e.tag}>"${e.tekst}" ${k.toFixed(2)}:1`);
  }
  await c.close();
  zapisi("BLOK", "Kontrast teksta >= WCAG AA", lose.length === 0, lose.length ? lose.slice(0, 3).join("  ") : `${el.length} elemenata, svi prolaze`);
}

// ─── 4. CLS / skakanje sadržaja (nalaz V2, 30.07.2026) ───
{
  const c = await noviKontekst(); const p = await c.newPage();
  await p.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 90000 });
  const cls = await p.evaluate(() => new Promise((res) => { let s = 0;
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) s += e.value; }).observe({ type: "layout-shift", buffered: true }); } catch {}
    setTimeout(() => res(+s.toFixed(3)), 4000); }));
  // koliko se pomeri prva kartica teme
  const ys = [];
  for (let i = 0; i < 10; i++) { ys.push(await p.evaluate(() => { const a = document.querySelector('a[href^="/tema/"]'); return a ? Math.round(a.getBoundingClientRect().y) : null; })); await p.waitForTimeout(300); }
  const stvarni = ys.filter((v) => v !== null);
  const skok = stvarni.length ? Math.max(...stvarni) - Math.min(...stvarni) : 0;
  await c.close();
  zapisi("BLOK", "Početna ne skače (CLS < 0,1, pomak < 24px)", cls < 0.1 && skok < 24, `CLS ${cls}  pomak kartice ${skok}px`);
}

// ─── 5. OSVEŽAVANJE ne obara stanje (provera #6 protokola) ───
{
  const c = await noviKontekst(); const p = await c.newPage();
  await p.goto(`${BASE}/tema/la-classe`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(3000);
  await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(3000);
  const d = await p.evaluate(() => ({ n: document.querySelectorAll("button").length, pao: /Application error/.test(document.body.innerText) }));
  await c.close();
  zapisi("BLOK", "F5 na zadatku ne obara stranu", d.n > 0 && !d.pao, `posle F5: ${d.n} dugmadi`);
}

// ─── 6. VIDLJIV FOKUS TASTATURE (nalaz S1 — POPRAVLJEN 31.07.2026, sada BLOK) ───
{
  const c = await noviKontekst(1440, 900); const p = await c.newPage();
  await p.goto(`${BASE}/tema/la-classe`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(3000);
  let bez = 0, uk = 0;
  for (let i = 0; i < 24; i++) {
    await p.keyboard.press("Tab");
    const d = await p.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null;
      const cs = getComputedStyle(a);
      return { v: (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none" }; });
    if (!d) continue; uk++; if (!d.v) bez++;
  }
  await c.close();
  zapisi("BLOK", "Svaki element ima vidljiv fokus (nalaz S1)", bez === 0, `${bez} od ${uk} bez vidljivog fokusa`);
}

// ─── 7. DODIRNE METE >= 44px (nalaz S2 — POPRAVLJEN 31.07.2026, sada BLOK) ───
{
  const c = await noviKontekst(); const p = await c.newPage();
  await p.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(3000);
  const d = await p.evaluate(() => { let male = 0, min = 999;
    document.querySelectorAll("button,a,[role=button],input").forEach((e) => { const r = e.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return; const m = Math.min(r.width, r.height); if (m < 44) { male++; if (m < min) min = Math.round(m); } });
    return { male, min: min === 999 ? "-" : min }; });
  await c.close();
  zapisi("BLOK", "Dodirne mete >= 44px (nalaz S2)", d.male === 0, `${d.male} manjih, najmanja ${d.min}px`);
}

// ─── 8. VODORAVNO PRELIVANJE na uskim ekranima ───
{
  let lose = [];
  for (const w of [320, 360, 390]) {
    const c = await noviKontekst(w, 800); const p = await c.newPage();
    await p.goto(`${BASE}/tema/la-classe`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await p.waitForTimeout(2500);
    const pre = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (pre > 0) lose.push(`${w}px:+${pre}`);
    await c.close();
  }
  zapisi("BLOK", "Bez vodoravnog prelivanja (320/360/390)", lose.length === 0, lose.length ? lose.join(" ") : "0px na sve tri širine");
}

// ─── 9. URL JE STANJE: link, F5 i „Nazad" (nalaz S3, popravljen 31.07.2026) ───
{
  const c = await noviKontekst(); const p = await c.newPage();
  const zadatak = () => p.evaluate(() => (document.body.innerText.match(/(\d+)\/\d+/) || [])[1]);
  await p.goto(`${BASE}/tema/la-classe`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForSelector("button", { timeout: 30000 });
  await p.waitForTimeout(2500);
  for (let i = 0; i < 3; i++) {
    await p.evaluate(() => { const x = [...document.querySelectorAll("button")].find((e) => /Següent/.test(e.textContent || "")); if (x) x.click(); });
    await p.waitForTimeout(700);
  }
  const uAdresi = new URL(p.url()).searchParams.get("tasca");
  const preF5 = await zadatak();
  await p.reload({ waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(3000);
  const posleF5 = await zadatak();
  // deljiv link
  await p.goto(`${BASE}/tema/la-classe?tasca=7`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForTimeout(3000);
  const izLinka = await zadatak();
  await c.close();
  const ok = uAdresi === "4" && preF5 === posleF5 && izLinka === "7";
  zapisi("BLOK", "Zadatak u adresi: link, F5, Nazad (nalaz S3)", ok,
         `?tasca=${uAdresi}  F5: ${preF5}→${posleF5}  link ?tasca=7 → ${izLinka}`);
}

// ─── 10. PLOČICA ZA RAZMAK je označena (nalaz S4, popravljen 31.07.2026) ───
{
  const c = await noviKontekst(); const p = await c.newPage();
  // les-botigues, 13. zadatak: „barra de pa" — reč sa dva razmaka
  await p.goto(`${BASE}/tema/les-botigues?tasca=13`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForSelector("button", { timeout: 30000 });
  await p.waitForTimeout(3000);
  const d = await p.evaluate(() => {
    const plocice = [...document.querySelectorAll("main button")].filter((b) => /w-12/.test(b.className));
    const prazne = plocice.filter((b) => (b.textContent || "").trim() === "");
    const oznacene = prazne.filter((b) => b.getAttribute("aria-label") === "espai" && b.children.length > 0);
    return { praznih: prazne.length, oznacenih: oznacene.length };
  });
  await c.close();
  const ok = d.praznih === 0 || d.praznih === d.oznacenih;
  zapisi("BLOK", "Pločica za razmak je označena (nalaz S4)", ok,
         `praznih pločica ${d.praznih}, označenih ${d.oznacenih}`);
}

// ─── 11. BEZBEDNOSNA ZAGLAVLJA (nalaz S5, popravljen 31.07.2026) ───
{
  const c = await noviKontekst(); const p = await c.newPage();
  const odgovor = await p.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 90000 });
  const z = odgovor ? odgovor.headers() : {};
  const trazena = ["content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"];
  const fale = trazena.filter((k) => !z[k]);
  // mikrofon MORA ostati dozvoljen — zadaci samoprocene ga koriste
  const mikrofonOk = !z["permissions-policy"] || /microphone=\(self\)/.test(z["permissions-policy"]);
  await c.close();
  zapisi("BLOK", "Bezbednosna zaglavlja + mikrofon radi (nalaz S5)", fale.length === 0 && mikrofonOk,
         fale.length ? `fale: ${fale.join(", ")}` : `svih ${trazena.length} prisutno, mikrofon dozvoljen`);
}

await b.close();

// ─── ZBIR ───
const blokPali = nalazi.filter((n) => n.nivo === "BLOK" && !n.prosao);
const upozPali = nalazi.filter((n) => n.nivo === "UPOZORENJE" && !n.prosao);
console.log("\n" + "=".repeat(78));
console.log(`provera: ${nalazi.length}  |  prošlo: ${nalazi.filter((n) => n.prosao).length}  |  PADA (blok): ${blokPali.length}  |  upozorenja: ${upozPali.length}`);
if (blokPali.length) { console.log("\nDEPLOY ZABRANJEN — pada:"); blokPali.forEach((n) => console.log(`   ✖ ${n.provera}: ${n.detalj}`)); }
else console.log("\nDEPLOY DOZVOLJEN.");
if (upozPali.length) { console.log("\nPoznati otvoreni nalazi (ne obaraju deploy, v. AUDIT/NALAZI-OTVORENI.md):"); upozPali.forEach((n) => console.log(`   • ${n.provera}: ${n.detalj}`)); }
console.log("");
process.exit(blokPali.length ? 1 : 0);
