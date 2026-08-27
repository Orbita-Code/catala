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

/**
 * PREGLEDAČ SE PODIŽE PONOVO AKO USPUT CRKNE (27.08.2026).
 *
 * Test je pred kraj pucao sa „Target page, context or browser has been closed"
 * i tu se prekidao — poslednje provere se nikad nisu izvršile, a na ekranu je
 * ostajao spisak koji izgleda uredno. Prekinut test koji ne kaže da je prekinut
 * gori je od pale provere, jer se čita kao da je sve prošlo.
 *
 * Uzrok je sam Chromium: posle mnogo otvorenih prozora ume da se ugasi (u
 * ispisu se vidi „GPU process exited unexpectedly"). Zato se sada pre svakog
 * novog prozora proveri je li pregledač živ i po potrebi podigne ponovo.
 */
let b = await chromium.launch({ headless: true });
const noviKontekst = async (w = 390, h = 844) => {
  if (!b.isConnected()) {
    console.log("  (pregledač je crkao usput — podižem ga ponovo)");
    b = await chromium.launch({ headless: true });
  }
  return b.newContext({ httpCredentials: CRED, viewport: { width: w, height: h } });
};

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
  /**
   * MERI SE DVAPUT (26.08.2026, audit).
   *
   * Kartice tema ulaze animacijom, a slike i font stižu naknadno. Merenje u
   * pogrešnom trenutku uhvati element pre nego što dobije konačnu veličinu:
   * ista provera je u jednom prolazu javila „1 manjih, najmanja 40px", a u
   * ponovljenom merenju istog trena — nula. Lažna uzbuna troši poverenje u
   * test isto koliko i propušten kvar.
   *
   * Zato: ako prvo merenje nešto nađe, sačeka se da se strana smiri i meri
   * ponovo. Prijavljuje se DRUGO merenje. Pravi kvar preživi oba.
   */
  const izmeri = () => p.evaluate(() => { let male = 0, min = 999;
    document.querySelectorAll("button,a,[role=button],input").forEach((e) => { const r = e.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return; const m = Math.min(r.width, r.height); if (m < 44) { male++; if (m < min) min = Math.round(m); } });
    return { male, min: min === 999 ? "-" : min }; });
  let d = await izmeri();
  if (d.male > 0) {
    await p.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(2000);
    d = await izmeri();
  }
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

// ─── 12. ZADATAK KORISTI ŠIRINU EKRANA (nalaz S6, popravljen 03.08.2026) ───
//
// Šta je bilo: sadržaj zadatka stajao je u okviru od najviše 672 px, dok je
// traka napretka išla celom širinom. Na ekranu od 1512 px kartice su padale
// u dva-tri reda, a drugi red ispod donje ivice — dete ne zna da ima još dole.
//
// Provera meri DVE stvari, jer jedna bez druge ne znači ništa:
//   1. okvir zadatka koristi bar 70% širine ekrana (pre popravke: 44%);
//   2. zadatak sa 4–8 kartica sa slikom drži sve kartice u ISTOM redu.
//
// Zadatak se traži PO SADRŽAJU, ne po rednom broju. Prvo izdanje ove provere
// gledalo je `?tasca=9` i palo je čim su dugački zadaci podeljeni na delove —
// brojevi su se pomerili, a provera je i dalje gledala u stari broj i javila
// kvar koga nema. Broj zadatka nije osobina zadatka.
{
  const c = await noviKontekst(1512, 900); const p = await c.newPage();
  let sirina = 0, nadjen = null;
  for (let n = 1; n <= 24 && !nadjen; n++) {
    await p.goto(`${BASE}/tema/la-classe?tasca=${n}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await p.waitForSelector("main", { timeout: 30000 });
    /**
     * ČEKA SE DA SE SLIKE STVARNO UČITAJU (27.08.2026).
     *
     * Provera je javljala „7 kartica u 4 reda", pa u sledećem prolazu „u 5
     * redova" — a ručnim merenjem posle učitavanja: **7 kartica u JEDNOM redu**.
     * Merilo se dok su slike još stizale, dok kartice nemaju visinu i mreža ih
     * lomi. Broj koji se menja od prolaza do prolaza nije nalaz nego trenutak
     * merenja.
     */
    await p.waitForLoadState("networkidle").catch(() => {});
    await p.evaluate(() => Promise.all(
      [...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))
    )).catch(() => {});
    await p.waitForTimeout(600);
    const d = await p.evaluate(() => {
      const m = document.querySelector("main");
      const sirina = m ? Math.round(m.getBoundingClientRect().width) : 0;
      const mreza = document.querySelector(".task-cards");
      if (!mreza) return { sirina, kartica: 0, redova: 0 };
      const kartice = [...mreza.children].filter((e) => e.querySelector("img"));
      const redovi = new Set(kartice.map((e) => Math.round(e.getBoundingClientRect().top)));
      return { sirina, kartica: kartice.length, redova: redovi.size };
    });
    sirina = d.sirina || sirina;
    if (d.kartica >= 4 && d.kartica <= 8) nadjen = { ...d, broj: n };
  }
  await c.close();
  const dovoljnoSiroko = sirina >= 1512 * 0.7;
  const jedanRed = !!nadjen && nadjen.redova === 1;
  zapisi("BLOK", "Zadatak koristi širinu ekrana (nalaz S6)", dovoljnoSiroko && jedanRed,
         nadjen
           ? `okvir ${sirina}px (${Math.round(sirina / 1512 * 100)}% ekrana), zadatak ${nadjen.broj}: ${nadjen.kartica} kartica u ${nadjen.redova} red(a)`
           : `okvir ${sirina}px — nije nađen nijedan zadatak sa 4–8 kartica`);
}

// ─── 13. ZADATAK MORA BITI REŠIV, NE POGODIV (nalazi vlasnice 14.08.2026) ───
//
// Tri odvojena kvara iz istog dana, sva tri „prošla" sva dotadašnja testiranja
// jer je test gledao da li se zadatak MOŽE završiti, a ne da li dete IMA
// ODAKLE da zna odgovor:
//
//   a) „Qui és qui?" — dete čita „ima dugu crnu kosu i naočare", a nigde
//      nijedne slike. Moglo je samo da pogađa. Sada četiri lika stoje na vrhu.
//   b) „noi → noia" — jedna ista slika za sve četiri rečenice, pa se nije
//      videlo šta znači „alt" a šta „baix". Sada svaka rečenica ima svoju.
//   c) tačke na slici su se POMERALE na dodir, jer su položaj i animacija
//      pisali u isto polje. Tačka bi odšetala sa brka na obraz.
//
// Provera se ne oslanja na redne brojeve zadataka — traži ih po sadržaju.
{
  const c = await noviKontekst(1440, 900); const p = await c.newPage();
  let quiEsQui = null, noiNoia = null, tacke = null;

  for (let n = 1; n <= 20 && !(quiEsQui && noiNoia && tacke); n++) {
    await p.goto(`${BASE}/tema/el-cos?tasca=${n}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await p.waitForSelector("main", { timeout: 30000 });
    await p.waitForTimeout(900);
    const d = await p.evaluate(() => {
      const tekst = document.querySelector("main")?.innerText || "";
      const slike = [...document.querySelectorAll("img")]
        .map((i) => (i.getAttribute("src") || "").split("/").pop())
        .filter((s) => s && s.endsWith(".webp"));
      return { tekst, slike, tacaka: document.querySelectorAll("[data-drop-target^='slot-']").length };
    });
    if (/Qui és qui/i.test(d.tekst)) quiEsQui = d;
    if (/noi\s*→\s*noia/i.test(d.tekst)) noiNoia = d;

    if (d.tacaka >= 3 && !tacke) {
      // Pritisni svaku tačku dvaput pa izmeri da li je ostala gde je bila.
      const pre = await p.$$eval("[data-drop-target^='slot-']", (e) =>
        e.map((x) => { const r = x.getBoundingClientRect(); return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]; }));
      for (const el of await p.$$("[data-drop-target^='slot-']")) {
        await el.click({ force: true }); await p.waitForTimeout(90);
        await el.click({ force: true }); await p.waitForTimeout(90);
      }
      const posle = await p.$$eval("[data-drop-target^='slot-']", (e) =>
        e.map((x) => { const r = x.getBoundingClientRect(); return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]; }));
      const najveciPomak = Math.max(...pre.map((a, i) => Math.hypot(a[0] - posle[i][0], a[1] - posle[i][1])));
      // Sličice uz ponuđene reči odaju odgovor i stoje samo uz neke reči —
      // u spisku ponuđenih reči ne sme biti nijedne slike.
      const slikaUzRec = await p.evaluate(() => {
        const naslov = [...document.querySelectorAll("p")].find((x) => /Tria o arrossega/i.test(x.textContent || ""));
        return naslov?.nextElementSibling?.querySelectorAll("img").length ?? 0;
      });
      tacke = { pomak: najveciPomak, slikaUzRec, broj: n };
    }
  }
  await c.close();

  const raznihSlika = noiNoia ? new Set(noiNoia.slike).size : 0;
  zapisi("BLOK", "„Qui és qui?“ pokazuje likove (a)", !!quiEsQui && quiEsQui.slike.length >= 4,
         quiEsQui ? `${quiEsQui.slike.length} slika na strani` : "zadatak nije nađen");
  zapisi("BLOK", "„noi → noia“: svaka rečenica svoju sliku (b)", raznihSlika >= 4,
         noiNoia ? `${raznihSlika} različitih slika` : "zadatak nije nađen");
  zapisi("BLOK", "Tačke na slici se ne pomeraju na dodir (c)", !!tacke && tacke.pomak < 2,
         tacke ? `najveći pomak ${tacke.pomak.toFixed(1)} px (zadatak ${tacke.broj})` : "zadatak nije nađen");
  zapisi("BLOK", "Ponuđene reči bez sličica (ne odaju odgovor)", !!tacke && tacke.slikaUzRec === 0,
         tacke ? `${tacke.slikaUzRec} slika uz ponuđene reči` : "zadatak nije nađen");
}

// ─── 14. IME U ZADATKU, A SLIKA STOJI NEISKORIŠĆENA (nalaz 14.08.2026) ───
//
// Klasa greške koja se ponovila DVA puta u istoj temi: ilustracija je bila
// napravljena, uredno stoji u `public/illustrations/`, i nikad se ne prikaže.
//   • „Qui és qui?" — postoje `carolina`, `sara`, `sergi`, `xavier`, zadatak
//     ih ne pokazuje, pa dete pogađa ko ima naočare.
//   • „La Laura és més ___ que en Carles" — postoji `laura-carles` sa
//     napisanim imenima, a zadatak je prikazivao `alt-baix`, gde su devojčica
//     i dečak BEZ imena. Nije se moglo znati ko je Laura.
//
// Provera je nad PODACIMA (ne otvara pregledač): za svaki zadatak koji pominje
// lično ime traži da se u njemu koristi ilustracija čije ime sadrži to ime —
// ali samo ako takva ilustracija uopšte postoji. Zadaci gde ime nije bitno za
// rešavanje (slaganje reči, razdvajanje spojenih reči) se preskaču, jer tamo
// dete ne mora da zna ko je ko.
{
  const fs = require("fs");
  const IMENA = /\b(Carolina|Sara|Sergi|Xavier|Maria|Laura|Carles|Anna|Joan|Marc|Marta|Jordi|Núria|Pau|Laia|Pere|Jaume|Berta|Clara|Ona|Bruno|Albert|Júlia|Mireia)\b/g;
  const TIPOVI_BEZ_SLIKE = ["order-words", "separate-words", "decode-grid", "word-search"];
  const slike = new Set(fs.readdirSync("public/illustrations").filter((f) => f.endsWith(".webp")).map((f) => f.replace(".webp", "").toLowerCase()));
  const lose = [];

  for (const f of fs.readdirSync("src/data").filter((x) => x.endsWith(".ts") && !["themes.ts", "task-data.ts"].includes(x))) {
    const s = fs.readFileSync("src/data/" + f, "utf8");
    // Komentari se sklanjaju PRE traženja imena: red `// ── Task 2 (Albert's
    // family) ──` stoji ispred SLEDEĆEG zadatka, pa je bez ovoga ime upadalo
    // u prethodni i pravilo lažan nalaz.
    for (const d of s.replace(/^\s*\/\/.*$/gm, "").split(/\n  \{\n/).slice(1)) {
      const id = (d.match(/id: "([^"]+)"/) || [])[1];
      const tip = (d.match(/type: "([^"]+)"/) || [])[1];
      if (!id || TIPOVI_BEZ_SLIKE.includes(tip)) continue;
      const imena = [...new Set(d.match(IMENA) || [])].map((x) => x.toLowerCase());
      if (!imena.length) continue;
      const koriscene = (d.match(/(?:image|imageAfter):\s*"([^"]+)"/g) || []).join(" ").toLowerCase()
                      + " " + (d.match(/referenceImages:\s*\[[^\]]*\]/) || [""])[0].toLowerCase();
      // Slika se traži SAMO ako je napravljena baš za te likove — to jest ako
      // se ceo naziv fajla sastoji od ličnih imena (`laura-carles`, `carolina`).
      // `albert-dibuix-3` NE ulazi: to je crtež uz jedan drugi zadatak, a ne
      // slika Alberta. Bez ovog sužavanja provera je javljala dva lažna nalaza
      // — svaki zadatak koji samo kaže „Jo soc l'Albert" tražio je te crteže.
      const svePoznateReci = new Set(IMENA.source.replace(/\\b|[()]/g, "").split("|").map((x) => x.toLowerCase()));
      const moguce = [...slike].filter((s2) => {
        const delovi = s2.split(/[-_]/);
        return delovi.every((d) => svePoznateReci.has(d)) && delovi.some((d) => imena.includes(d));
      });
      if (!moguce.length) continue;                       // nema šta da se prikaže — nije nalaz
      if (moguce.some((s2) => koriscene.includes(s2))) continue;  // koristi se — u redu
      lose.push(`${id} (imena: ${imena.join("/")}, stoji neiskorišćeno: ${moguce.slice(0, 3).join(", ")})`);
    }
  }
  zapisi("BLOK", "Ime u zadatku → slika sa tim imenom se koristi", lose.length === 0,
         lose.length ? lose.slice(0, 3).join("  |  ") : "svi zadaci sa imenima pokazuju prave likove");
}

// ─── 15. MIKROFON STVARNO SNIMA (nalaz 16.08.2026) ───
//
// Najskuplji nalaz do sada: mikrofon je radio kod vlasnice, a kod deteta se
// palio zeleno i nije čuo ništa. Uzrok je bio to što je CEO zadatak zavisio od
// `SpeechRecognition` — usluge koja zvuk šalje tuđem serveru. Kad ta usluga
// ćuti, ništa se ne desi i ne javi se greška.
//
// Sada je osnova SNIMANJE (`getUserMedia` + merač jačine + `MediaRecorder`),
// a prepoznavanje je samo dodatak. Ova provera to i dokazuje, sa LAŽNIM
// mikrofonom koji Chrome ume da pusti (`--use-fake-device-for-media-stream`),
// pa ne treba nikakav pravi uređaj:
//   1. dugmad za snimanje postoje;
//   2. traka jačine se POMERI dok „zvuk" stiže  → merač radi;
//   3. posle snimanja se ponudi da dete ČUJE sebe i uporedi sa modelom.
// Ako ijedno od toga zataji, mikrofon je opet nem — i deploy pada.
{
  const bb = await chromium.launch({ headless: true, args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  const c = await bb.newContext({ httpCredentials: CRED, viewport: { width: 1440, height: 900 }, permissions: ["microphone"] });
  const p = await c.newPage();
  let dugmadi = 0, najveciNivo = 0, ponudaSluhu = false;
  try {
    let nadjen = 0;
    /**
     * ZADATAK SE TRAŽI PO SAMOM MIKROFONU (27.08.2026).
     *
     * Ranije se tražio natpis „Autoavaluació" — a taj natpis NIGDE NE STOJI NA
     * EKRANU, postoji samo kao komentar u fajlu sa podacima. Petlja zato nikad
     * nije ništa našla, pa je izlazila na poslednjem obiđenom zadatku i tamo
     * brojala dugmad. Dok je taj poslednji slučajno bio zadatak sa mikrofonom,
     * provera je bila zelena — bez ijednog razloga. Kad se broj zadataka u temi
     * promenio, ista provera je pocrvenela, iako mikrofon radi.
     *
     * Provera koja zavisi od slučaja nije provera. Sada se traži baš ono što se
     * meri: dugme za snimanje.
     */
    /**
     * ČEKA SE DUGME, NE FIKSNIH 700 ms (27.08.2026).
     *
     * Prvo izdanje ove petlje je posle otvaranja strane spavalo 700 ms pa
     * brojalo. Na praznoj mašini je stizalo, na zauzetoj nije — ista provera je
     * u jednom prolazu našla 12 dugmadi, a u sledećem nijedno, bez ijedne
     * izmene u aplikaciji (ručno izmereno u istom trenutku: `el-cos` zadatak 18
     * ima 12 dugmadi). Provera koja zavisi od brzine mašine nije provera.
     */
    for (let n = 1; n <= 24 && !nadjen; n++) {
      await p.goto(`${BASE}/tema/el-cos?tasca=${n}`, { waitUntil: "domcontentloaded", timeout: 90000 });
      const ima = await p.waitForSelector('button[aria-label^="Digues"]', { timeout: 4000 })
        .then(() => true).catch(() => false);
      if (ima) nadjen = n;
    }
    await p.waitForTimeout(1200);
    dugmadi = nadjen ? await p.locator('button[aria-label^="Digues"]').count() : 0;
    if (dugmadi) {
      /**
       * MERI SE GUŠĆE I POKUŠAVA DVAPUT (26.08.2026, audit).
       *
       * Uzorak na svakih 200 ms promašivao je vrhove: lažni mikrofon u testu
       * daje kratke impulse, pa je ista provera kroz četiri prolaza dala
       * 100%, 76%, 29% i 0% — i pala na poslednjem. Provera koja zavisi od
       * trenutka nije provera nego kockanje, a lažna uzbuna troši poverenje
       * isto kao propušten kvar.
       *
       * Sada: uzorak svakih 60 ms (oko 95 umesto 28 po pokušaju), i ako se
       * ništa ne uhvati — snimanje se pokrene još jednom.
       */
      for (let pokusaj = 1; pokusaj <= 2 && najveciNivo === 0; pokusaj++) {
        await p.locator('button[aria-label^="Digues"]').first().click();
        for (let i = 0; i < 95; i++) {
          const w = await p.evaluate(`(() => { const t=document.querySelector(".bg-green-500"); return t ? (parseFloat(t.style.width)||0) : 0; })()`);
          if (w > najveciNivo) najveciNivo = w;
          await p.waitForTimeout(60);
        }
        if (najveciNivo === 0) await p.waitForTimeout(1200);
      }
      await p.waitForTimeout(2500);
      const tekst = await p.locator("main").innerText();
      // OBRNUTO OD RANIJEG (16.08.2026, zahtev vlasnice): posle snimanja u
      // zadatku NE SME da se pojavi ništa osim zelene kvačice kad je reč
      // pogođena. Ranije su tu iskakala dugmad „Jo" i „Model" (poslušaj sebe /
      // poslušaj model) — dete tog uzrasta to ne razume i nije mu potrebno.
      ponudaSluhu = !/Igual|Model|\bJo\b|Un altre cop/.test(tekst);
    }
  } catch { /* ostaje na nuli i pada dole */ }
  await c.close(); await bb.close();

  zapisi("BLOK", "Mikrofon: dugmad za snimanje postoje", dugmadi > 0, `${dugmadi} dugmadi`);
  zapisi("BLOK", "Mikrofon: merač jačine se pomera", najveciNivo > 0, `najveći nivo ${Math.round(najveciNivo)}%`);
  zapisi("BLOK", "Mikrofon: posle snimanja nema suvisnih dugmadi", ponudaSluhu, ponudaSluhu ? "cisto — samo kvacica kad je tacno" : "iskacu dugmad koja dete ne razume");
}

// ─── 16. JEDAN GLAS KROZ CELU IGRU (nalaz 16.08.2026) ───
//
// Prijava vlasnice: „el laboratori" i „el gimnàs" govori DRUGI ženski glas.
// Uzrok: ti zadaci ne izgovaraju go podatak nego SASTAVE tekst u kodu
// (`speak(`${article} ${word}`)`). Snimak je postojao za „laboratori", ali ne
// i za „el laboratori" — pa je aplikacija tiho pala na glas uređaja, koji je
// drugi. Dete usred iste igre čuje dva različita glasa i to zvuči pokvareno.
//
// Provera je nad podacima: svaki SASTAVLJENI izgovor mora imati svoj snimak.
{
  const fs = require("fs");
  const spisak = fs.readFileSync("src/lib/audio-reci.ts", "utf8");
  const kljuc = (t) => t.replace(/[→←↓↑↗↘↙↖⇒⇐]/g, " ").replace(/_{2,}/g, " ")
                        .replace(/\s+/g, " ").trim().toLowerCase();
  const imaSnimak = (t) => spisak.includes(`"${kljuc(t)}"`);
  const fale = [];

  for (const f of fs.readdirSync("src/data").filter((x) => x.endsWith(".ts") && !["themes.ts", "task-data.ts"].includes(x))) {
    const s = fs.readFileSync("src/data/" + f, "utf8");
    for (const m of s.matchAll(/\{[^{}]*?word:\s*"([^"]+)"[^{}]*?article:\s*"([^"]+)"[^{}]*?\}/g))
      if (!imaSnimak(`${m[2]} ${m[1]}`)) fale.push(`${m[2]} ${m[1]}`);
    for (const m of s.matchAll(/\{[^{}]*?article:\s*"([^"]+)"[^{}]*?word:\s*"([^"]+)"[^{}]*?\}/g))
      if (!imaSnimak(`${m[1]} ${m[2]}`)) fale.push(`${m[1]} ${m[2]}`);
    for (const m of s.matchAll(/\{[^{}]*?count:\s*(\d+)[^{}]*?description:\s*"([^"]+)"[^{}]*?\}/g))
      if (!imaSnimak(`${m[1]} ${m[2]}`)) fale.push(`${m[1]} ${m[2]}`);
  }
  const jedinstveni = [...new Set(fale)];
  zapisi("BLOK", "Jedan glas: svaki sastavljeni izgovor ima snimak", jedinstveni.length === 0,
         jedinstveni.length ? `bez snimka: ${jedinstveni.slice(0, 4).join(", ")}` : "svi sastavljeni izgovori snimljeni");

  // ŠIROKA PROVERA — pušta se ISTA skripta koja i snima (`--proveri`), da se
  // pravilo ne drži na dva mesta. Dve kopije istog pravila se pre ili kasnije
  // raziđu, a tada provera prestane da proverava ono što se stvarno dešava.
  //
  // Nalaz koji je ovo iznudio (16.08.2026): skripta je hvatala samo pojedinačna
  // polja, a ne SPISKOVE reči (`options`, `items`, `allItems`). Tamo živi
  // većina reči i gotovo sve množine — 153 reči je bez snimka prelazilo na glas
  // uređaja, pa je dete usred igre čulo dva različita glasa.
  let sve = "", ok = false;
  try {
    sve = require("child_process").execFileSync("node", ["scripts/snimi-izgovor.mjs", "--proveri"], { encoding: "utf8" });
    ok = /ima snimak/.test(sve);
  } catch (e) {
    sve = String(e.stdout || e).slice(0, 200);
  }
  zapisi("BLOK", "Jedan glas: SVAKA izgovorena reč ima snimak", ok,
         (sve.match(/svih \d+ izgovora ima snimak|BEZ SNIMKA: \d+/) || ["nije se pokrenulo"])[0]);
}

// ─── 17. POPRAVLJENA GREŠKA NIJE GREŠKA (nalaz 16.08.2026) ───
//
// Najgori nalaz za dete do sada. Ćerka je celu temu 2 uradila TAČNO, a na kraju
// je pisalo „imaš još 9 reči za vežbanje" i vratilo je na zadatke koji su na
// ekranu zeleni. Vraćati dete na već rešene zadatke oduzima smisao trudu i
// najbrži je način da prestane da igra.
//
// Uzrok: greška zapisana usput nije se brisala kad dete odmah zatim odgovori
// tačno. Provera to i reprodukuje: namerno pogreši, popravi, pa gleda da li je
// u pamćenju ostala ijedna greška.
{
  const c = await noviKontekst(1280, 900); const p = await c.newPage();
  let ostalo = -1, nasao = false;
  try {
    // Marijin zadatak u temi 3 je višestruki izbor sa Sí/No — najlakše je
    // tamo namerno pogrešiti pa popraviti.
    for (let n = 1; n <= 22 && !nasao; n++) {
      await p.goto(`${BASE}/tema/el-cos?tasca=${n}`, { waitUntil: "domcontentloaded", timeout: 90000 });
      await p.waitForTimeout(700);
      if (!(await p.locator("main").innerText()).includes("contesta SÍ o NO")) continue;
      nasao = true;
      await p.evaluate(() => localStorage.removeItem("catala-errors"));

      // Zadatak ima 8 pitanja sa Sí/No. Greška se u pamćenje upisuje TEK kad se
      // ceo zadatak završi, pa se mora proći do kraja — inače provera ništa ne
      // meri (prva verzija je baš zato prolazila i na pokvarenom kodu).
      //
      // Odgovori se ne prepisuju iz podataka nego se nalaze u hodu: klikni
      // „Sí"; ako iskoči ikonica za ponovni pokušaj, odgovor je bio pogrešan —
      // klikni je pa izaberi „No". Tako provera radi i kad se pitanja promene.
      //
      // NA PRVOM PITANJU SE NAMERNO GREŠI PA POPRAVLJA — to je ceo smisao.
      // ZAMKA: ikonica „pokušaj ponovo" NIJE <button> nego <span role="button">,
      // pa je prvo izdanje ove provere nikad nije našlo — klikala je pored,
      // pogrešni odgovori su ostajali, i provera je merila nešto sasvim drugo.
      // Traži se po `aria-label`, koji je i namenjen tome.
      const ponoviIkonicu = async () => {
        const ikonica = p.locator('[aria-label="Torna a provar"]');
        if (await ikonica.count()) { await ikonica.first().click({ force: true }); return true; }
        return false;
      };

      for (let q = 0; q < 12; q++) {
        // ZAMKA: kad se zadatak završi, dugmadi „Sí"/„No" nestanu, a Playwright
        // na klik po imenu čeka 30 s pre nego što odustane — provera je zato
        // visila preko deset minuta. Zato se prvo PROVERI da dugme postoji, i
        // svaki klik ima kratko vreme čekanja.
        if (await p.getByRole("button", { name: "Sí", exact: true }).count() === 0) break;
        const prvi = q === 0 ? "No" : "Sí";
        const drugi = q === 0 ? "Sí" : "No";
        await p.getByRole("button", { name: prvi, exact: true }).first().click({ force: true, timeout: 2000 }).catch(() => {});
        await p.waitForTimeout(350);
        if (await ponoviIkonicu()) {
          await p.waitForTimeout(250);
          await p.getByRole("button", { name: drugi, exact: true }).first().click({ force: true, timeout: 2000 }).catch(() => {});
          await p.waitForTimeout(350);
          // ako je i drugi pogrešan, popravi natrag na prvi
          if (await ponoviIkonicu()) {
            await p.waitForTimeout(250);
            await p.getByRole("button", { name: prvi, exact: true }).first().click({ force: true, timeout: 2000 }).catch(() => {});
          }
        }
        await p.waitForTimeout(1500);
      }
      await p.waitForTimeout(1500);

      ostalo = await p.evaluate(() => {
        try {
          const s = localStorage.getItem("catala-errors");
          if (!s) return 0;
          const o = JSON.parse(s);
          let n = 0;
          for (const t of Object.values(o)) for (const a of Object.values(t)) n += a.length;
          return n;
        } catch { return -1; }
      });
    }
  } catch { /* ostaje -1 */ }
  await c.close();
  // Provera je namerno blaga u broju: bitno je da promašaj koji je dete
  // ispravilo NE ostavlja trag. Ako je zadatak završen tačno, mora biti 0.
  // Ako zadatak za probu NIJE nađen, provera PADA — provera koja se nije
  // izvršila ne sme da se prijavi kao prošla. Lažno zeleno je gore od crvenog.
  zapisi("BLOK", "Popravljena greska ne ostaje za vezbanje", nasao && ostalo === 0,
         nasao ? `u pamćenju ostalo ${ostalo} grešaka (traži se 0)` : "zadatak za probu NIJE NAĐEN");
}

// ─── 18. DETE SME DA KUCA, BRIŠE I POPRAVLJA (nalaz 17.08.2026) ───
//
// Prijava vlasnice: dete je umesto „orella" počelo da piše „urella" i ČIM je
// otkucalo prvo slovo u poslednjem praznom polju sve je bilo precrtano i
// moralo se ispočetka. Desilo se tri puta.
//
// Uzrok: provera je kretala 300 ms pošto SVA polja imaju bilo kakav tekst —
// dakle na prvo slovo poslednjeg polja. Kod zadatka gde se kuca to je pogrešno
// po sebi: dete piše, briše, popravlja, i samo kaže kad je gotovo.
//
// Provera upiše po jedno slovo u svako polje i traži da NIŠTA nije presuđeno,
// nego da se pojavi dugme „Comprova!".
{
  const c = await noviKontekst(1200, 900); const p = await c.newPage();
  let cekaDugme = false, presudio = true, nadjen = false;
  try {
    for (let n = 1; n <= 20 && !nadjen; n++) {
      await p.goto(`${BASE}/tema/el-cos?tasca=${n}`, { waitUntil: "domcontentloaded", timeout: 90000 });
      await p.waitForTimeout(700);
      if (!(await p.locator("main").innerText()).includes("parts del cap")) continue;
      nadjen = true;
      await p.waitForTimeout(900);
      const polja = p.locator("main input");
      const koliko = await polja.count();
      for (let i = 0; i < koliko; i++) await polja.nth(i).fill("u");
      await p.waitForTimeout(1500);
      cekaDugme = /Comprova/.test(await p.locator("main").innerText());
      presudio = (await p.locator("main input[disabled]").count()) > 0;
    }
  } catch { /* ostaje kako jeste */ }
  await c.close();
  zapisi("BLOK", "Kucanje: ne presuđuje se dok dete piše", nadjen && cekaDugme && !presudio,
         nadjen ? `dugme Comprova: ${cekaDugme ? "ima" : "NEMA"}, polja zaključana: ${presudio ? "DA" : "ne"}`
                : "zadatak za probu NIJE NAĐEN");
}

// ─── 19. NIŠTA SE NE ČITA GLASOM UREĐAJA — SVI ZADACI, SVE TEME ───
//
// Vlasnica, 17.08.2026: „svaki put kažeš da si rešio i uvek se otkrije nov
// zadatak gde pričaju čudni glasovi."
//
// Bila je u pravu, i uzrok je bio u načinu provere. Proveravalo se da svaki
// tekst IZ PODATAKA ima snimak — a aplikacija dosta toga SASTAVLJA u kodu
// („la cortina", „el laboratori", „3 pomes"), i toga u podacima nema. Zato je
// svaka popravka rešavala samo prijavljeni slučaj.
//
// Ova provera ne gleda podatke nego SLUŠA aplikaciju: obiđe SVAKI zadatak u
// SVIH 12 tema, pritisne sve što se da pritisnuti, i broji koliko je puta nešto
// otišlo na glas uređaja. Traži se nula.
{
  const { spawnSync } = require("child_process");
  let izlaz = "", broj = -1, obidjeno = -1;
  /**
   * ČITAJU SE OBA IZLAZA, I KAD PROĐE I KAD PADNE (24.08.2026).
   *
   * Skripta svoje brojeve piše na `stderr` (`process.stderr.write`). Ranije je
   * ovde stajao `execFileSync`, koji kad komanda PROĐE vraća samo `stdout` —
   * pa se nijedan broj nije ni pročitao, nego se naslepo upisivalo `broj = 0`.
   * Zato je provera prolazila i onda kad nije obišla nijedan zadatak.
   * `spawnSync` vraća oba izlaza, uvek.
   *
   * Skripta pravi svoj pregledač, pa mora da dobije I ADRESU I LOZINKU —
   * bez lozinke protiv produkcije vidi samo 401.
   */
  {
    const r = spawnSync("node", ["scripts/nadji-tudji-glas.mjs"],
                        { encoding: "utf8",
                          env: { ...process.env, BASE, BASIC_AUTH: process.env.BASIC_AUTH || "" },
                          maxBuffer: 32 * 1024 * 1024 });
    izlaz = String(r.stdout || "") + String(r.stderr || "");
  }
  const m = (izlaz + "").match(/TUĐIM GLASOM SE IZGOVARA: (\d+)/);
  if (m) broj = Number(m[1]);
  const mo = (izlaz + "").match(/OBIĐENO ZADATAKA: (\d+)/);
  if (mo) obidjeno = Number(mo[1]);
  /**
   * NULA NALAZA UZ NULA OBIĐENIH ZADATAKA NIJE PROLAZ (24.08.2026).
   *
   * Do danas je ovde stajalo samo `broj === 0`. Skripta je imala UPISANU
   * lokalnu lozinku `changeme`, pa je protiv produkcije dobijala 401 na svakoj
   * strani, prekidala posle prve i javljala „0 tekstova". Test je to čitao kao
   * čisto, a vlasnica je u isto vreme slušala tuđe glasove u temama 4 i 5.
   * Zato se sada traži i da je provera STVARNO nešto obišla.
   */
  zapisi("BLOK", "Ništa se ne čita glasom uređaja (sve teme)", broj === 0 && obidjeno > 100,
         obidjeno < 1 ? "PROVERA NIJE NIŠTA OBIŠLA (lozinka? server?)"
                      : `tuđim glasom: ${broj} tekstova, obiđeno ${obidjeno} zadataka`);
}

// ─── 20. SVAKA REČ POSTOJI U SLAGALICI SLOVA (nalaz 17.08.2026) ───
//
// Dete je reklo da mu je „sopa de lletres" najzabavnija i da hoće više reči.
// Reč se ne sme samo dopisati u spisak — mora STVARNO da postoji u mreži,
// inače je zadatak nerešiv, a dete traži nešto čega nema.
// Provera traži svaku traženu reč u samoj mreži, u svih osam pravaca.
{
  const { execFileSync } = require("child_process");
  let izlaz = "", ok = false;
  try {
    izlaz = execFileSync("node", ["scripts/proveri-sopu.mjs"], { encoding: "utf8" });
    ok = /nedostaje: 0, unazad\/ukoso: 0, bez slike ili van teme: 0/.test(izlaz);
  } catch (e) { izlaz = String(e.stdout || e).slice(0, 300); }
  /**
   * OD 25.08.2026 SE TRAŽI I „ukoso: 0" (prijava vlasnice).
   * Reč sme da stoji samo pravo — vodoravno ili uspravno. Dete koje je naučilo
   * da traži pravo nema kako da pogodi da odjednom sme i ukoso, a nigde mu se
   * to ne kaže. Vidi napomenu u `scripts/proveri-sopu.mjs`.
   */
  zapisi("BLOK", "Slagalica slova: reči postoje, stoje PRAVO i uče se u temi", ok,
         (izlaz.match(/provereno \d+ reči u mrežama, nedostaje: \d+, unazad\/ukoso: \d+, bez slike ili van teme: \d+/) || ["nije se pokrenulo"])[0]);
}

// ─── 21. NAPREDAK U ZADATKU SE NE GUBI (nalaz 17.08.2026) ───
//
// Prijava vlasnice: dete je stiglo do pete reči od šest, slučajno prešlo
// prstima preko dodirne ploče i otišlo na prethodni zadatak. Vratilo se odmah
// — i zateklo 1/6. Pet rešenih reči je nestalo.
//
// Ne pita se „hoćeš li izaći?" — dete od sedam godina to ne pročita nego klikne
// bilo šta. A ni ne dešava se samo klikom: poklopi se laptop, crkne baterija,
// zvoni školsko zvono. Zato aplikacija pamti sama, tiho, i vraća dete tamo gde
// je stalo.
{
  const c = await noviKontekst(1200, 900); const p = await c.newPage();
  let bez = "", sa = "", star = "";
  try {
    const brojac = async () => ((await p.locator("main").innerText()).match(/\d+ \/ \d+/) || ["?"])[0];
    await p.goto(`${BASE}/tema/la-casa?tasca=7`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await p.waitForTimeout(1200);
    bez = await brojac();
    await p.evaluate(() => localStorage.setItem("catala-napredak-zadatka",
      JSON.stringify({ "la-casa-7": { idx: 4, kada: Date.now() } })));
    await p.goto(`${BASE}/tema/la-casa?tasca=7`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await p.waitForTimeout(1600);
    sa = await brojac();
    // zapis stariji od nedelju dana se ne koristi — to više nije „nastavi"
    await p.evaluate(() => localStorage.setItem("catala-napredak-zadatka",
      JSON.stringify({ "la-casa-7": { idx: 4, kada: Date.now() - 9 * 24 * 60 * 60 * 1000 } })));
    await p.goto(`${BASE}/tema/la-casa?tasca=7`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await p.waitForTimeout(1400);
    star = await brojac();
  } catch { /* ostaje prazno i pada */ }
  await c.close();
  const ok = bez.startsWith("1 /") && sa.startsWith("5 /") && star.startsWith("1 /");
  zapisi("BLOK", "Napredak u zadatku se ne gubi", ok,
         `bez pamćenja ${bez || "?"}, posle povratka ${sa || "?"}, star zapis ${star || "?"}`);
}

// ─── 22. NIJEDNA REČ BEZ SLIKE (nalaz 17.08.2026) ───
//
// Vlasnica: „llençols u zadatku 17 nema sliku!!! zašto i dalje imamo zadatke
// bez slike????"
//
// Bila je u pravu što je pitala tako. Do sada se to otkrivalo samo tako što
// ona naiđe na takav zadatak — nije postojala nijedna provera koja bi to
// našla unapred. Ova prolazi sve teme i sve zadatke i traži svaku reč koju
// dete vidi, a koja nema svoju sliku.
//
// Poštuje polje `image` iz podataka (ono ima prednost nad samom rečju, kao i
// u aplikaciji) i preskače zadatke gde slika i ne treba — antonimi u frazama,
// slaganje reči iz dva dela, slagalica slova.
{
  const { execFileSync } = require("child_process");
  let izlaz = "", broj = -1;
  try {
    izlaz = execFileSync("node", ["scripts/proveri-slike.mjs"], { encoding: "utf8" });
  } catch (e) { izlaz = String(e.stdout || e); }
  const m = izlaz.match(/BEZ SLIKE: (\d+)/);
  if (m) broj = Number(m[1]);
  const prve = izlaz.split("\n").filter((r) => r.startsWith("  ")).slice(0, 3).map((r) => r.trim());
  zapisi("BLOK", "Nijedna reč se ne prikazuje bez slike", broj === 0,
         broj < 0 ? "provera se nije pokrenula" : `bez slike: ${broj}${prve.length ? " — " + prve.join(", ") : ""}`);
}

// ─── U PREGLEDU ZAVRŠENOG ZADATKA STRELICE RADE (prijava vlasnice 27.08.2026) ───
//
// „Ako odem na zadnjoj strani proslave na pregledaj sve zadatke, strelica za
//  listanje reči npr. u prvom zadatku ne radi."
//
// Tačno tako: u pregledu je ceo zadatak umotan u `pointer-events-none`, da dete
// ne bi ponovo rešavalo ono što je već rešilo. Ali to gasi SVE klikove, pa i
// listanje — dete koje hoće da pogleda drugu reč ostane bez ijednog dugmeta.
//
// Provera: zadatak se označi kao završen, otvori se, i strelica se klikne.
// Brojač reči mora da se pomeri, a reč mora i dalje da stoji POPUNJENA (u
// pregledu je već rešena; prazna polja bi izgledala kao izgubljen napredak).
{
  const c = await noviKontekst(1200, 900); const p = await c.newPage();
  let pre = "", posle = "", slova = 0;
  try {
    await p.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.evaluate(() => localStorage.setItem("catala-progress", JSON.stringify({
      "la-classe": { currentTask: 0, completedTasks: ["la-classe-1-1"], streak: 1, bestStreak: 1, stars: 3, taskErrors: {} },
    })));
    await p.goto(`${BASE}/tema/la-classe?tasca=1`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForLoadState("networkidle").catch(() => {});
    await p.waitForTimeout(1200);
    const brojac = () => p.locator("text=/^\\d+ \\/ \\d+$/").first().innerText().catch(() => "?");
    pre = await brojac();
    await p.locator('button[aria-label="Paraula següent"]').click({ timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(800);
    posle = await brojac();
    slova = await p.evaluate(() => [...document.querySelectorAll("main *")]
      .filter((e) => e.children.length === 0 && /^[a-zà-úç]$/i.test(e.textContent.trim())).length);
  } catch { /* ostaje prazno i pada dole */ }
  await c.close();
  zapisi("BLOK", "Pregled završenog zadatka: strelice listaju reči", pre !== "" && pre !== posle && slova > 0,
         `brojač ${pre} → ${posle}, slova na ekranu: ${slova}`);
}

// ─── VEŽBA NUDI SAMO REČI, NE PITANJA (prijava vlasnice 27.08.2026) ───
//
// „imam practica paraulas i glas ne izgovara dobro, umesto Amb què čita amb k,
//  a onda mi ništa nije jasno jer su to neke reči sa postavljanjem pitanja, a
//  nema nigde odgovora da se klikne nego samo dugmići Znam i ne znam."
//
// Zadatak sa ponuđenim odgovorima je kao grešku pamtio CELO PITANJE („Amb què
// vola l'au?") umesto reči koja se uči („ales"). U vežbi se prikazuje samo
// tekst i dva dugmeta, pa dete dobije pitanje bez ijednog odgovora; snimak za
// pitanje ne postoji, pa ga je čitao glas uređaja.
//
// Takvi zapisi ostaju u pregledaču deteta i posle popravke zadatka, zato ih
// aplikacija izbacuje pri čitanju. Ova provera upiše mešavinu (pitanje, opis,
// slepljenu rečenicu i jednu pravu reč) i gleda šta ostane za vežbanje.
{
  const { spawnSync } = require("child_process");
  const r = spawnSync("node", ["scripts/proveri-vezbu.mjs"],
                      { encoding: "utf8", env: { ...process.env, BASE, BASIC_AUTH: process.env.BASIC_AUTH || "" } });
  const izlaz = String(r.stdout || "") + String(r.stderr || "");
  const m = izlaz.match(/nudi za vežbanje: \u201e([^\u201c]*)\u201c/);
  zapisi("BLOK", "Za vežbanje se nude samo reči (ne pitanja)", r.status === 0,
         m ? `posle 3 nepodobna zapisa ostalo: ${m[1]}` : "provera se nije pokrenula");
}

// ─── 23. RAZVRSTAVANJE MORA BITI REŠIVO (nalaz 24.08.2026) ───
//
// Vlasnica: „tema 5 zadatak 17 je nerešiv… treba da se stavi banyera ili u
// sobu ili u dnevnu sobu; takođe nevera mora da se stavi, to nije normalno".
//
// Zadatak je imao ČETIRI sobe, a bio je označen kao `circleMode` — raspored
// koji crta tačno DVA izbora. `Lavabo` i `Cuina` se nisu ni iscrtavale, pa
// osam od šesnaest reči nije imalo nijedan tačan odgovor.
//
// Provera prolazi SVE teme i traži svaku reč kojoj tačan odgovor nije na
// ekranu, reč koja ne pripada nijednoj koloni, i reč koja stoji u dve.
{
  const { execFileSync } = require("child_process");
  let izlaz = "", broj = -1;
  try {
    izlaz = execFileSync("node", ["scripts/proveri-razvrstavanje.mjs"], { encoding: "utf8" });
  } catch (e) { izlaz = String(e.stdout || e); }
  const m = izlaz.match(/NEREŠIVO: (\d+)/);
  if (m) broj = Number(m[1]);
  const prve = izlaz.split("\n").filter((r) => r.startsWith("  ")).slice(0, 2).map((r) => r.trim());
  zapisi("BLOK", "Svako razvrstavanje je rešivo", broj === 0,
         broj < 0 ? "provera se nije pokrenula" : `nerešivo: ${broj}${prve.length ? " — " + prve.join(" | ") : ""}`);
}

// ─── 24. SLIKU IMAMO, A ZADATAK JE NE PRIKAZUJE (nalaz 24.08.2026) ───
//
// Vlasnica: „zadatak 16 nema nijednu sličicu, a mislim da imamo svaku reč".
// Imali smo četiri od pet — samo se nisu prikazivale, jer je odgovor rečenica
// („És a la teulada"), a zadatak označen kao „samo tekst".
//
// UPOZORENJE, ne BLOK: negde je odgovor zaista apstraktan pa slika ne treba.
// Spisak čeka odluku vlasnice koja mesta da dobiju sliku.
{
  const { execFileSync } = require("child_process");
  let izlaz = "", broj = -1;
  try {
    izlaz = execFileSync("node", ["scripts/proveri-parove-bez-slike.mjs"], { encoding: "utf8" });
  } catch (e) { izlaz = String(e.stdout || e); }
  const m = izlaz.match(/SAKRIVENIH SLIKA: (\d+)/);
  if (m) broj = Number(m[1]);
  /**
   * OD 25.08.2026 OVO JE BLOK, NE UPOZORENJE.
   *
   * Svih 14 prijavljenih mesta je presuđeno: četiri su dobila sliku, tri su
   * izričito označena da je ne treba (`rightNoImage` — slika bi bila pogrešna),
   * a sedam se više i ne prijavljuje jer su strukturno pogrešna prijava
   * (delovi reči i zadaci gde slika već stoji sa leve strane).
   * Pošto je spisak sveden na nulu, svako novo sakrivanje slike je greška —
   * a upozorenje koje se nikad ne rešava prestaje da se čita.
   */
  const prve = izlaz.split("\n").filter((r) => r.startsWith("  ")).slice(0, 2).map((r) => r.trim());
  zapisi("BLOK", "Nijedna postojeća slika nije sakrivena", broj === 0,
         broj < 0 ? "provera se nije pokrenula" : `sakriveno: ${broj}${prve.length ? " — " + prve.join(" | ") : ""}`);
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
