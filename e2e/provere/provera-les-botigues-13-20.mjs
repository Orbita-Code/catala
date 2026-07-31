// Određuje zadatke 13–20 teme les-botigues, svaki u SVEŽOJ strani (bez drifta).
import { createRequire } from "module";
const require = createRequire("/Users/jovana.jovic/Projects/Katalonski/");
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3000";
const CRED = process.env.BASIC_AUTH
  ? { username: process.env.BASIC_AUTH.split(":")[0], password: process.env.BASIC_AUTH.split(":")[1] }
  : { username: "catala", password: "changeme" };

const b = await chromium.launch({ headless: true });
console.log("zad  brojač   naslov                                        klikljivih  slika  ucitane  konzola  presuda");
let lose = 0;
for (let n = 13; n <= 20; n++) {
  const c = await b.newContext({ httpCredentials: CRED, viewport: { width: 390, height: 900 } });
  const p = await c.newPage();
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 70)));
  p.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 70)));
  await p.goto(BASE + "/tema/les-botigues", { waitUntil: "domcontentloaded", timeout: 90000 });
  await p.waitForSelector("button", { timeout: 30000 });
  await p.waitForTimeout(2500);
  for (let i = 0; i < n - 1; i++) {
    const s = await p.$('button:has-text("Següent")');
    if (s) { await s.click(); await p.waitForTimeout(320); }
  }
  await p.waitForTimeout(2200);
  const d = await p.evaluate(() => {
    const t = document.body.innerText;
    const brojac = (t.match(/(\d+)\/(\d+)/) || []).slice(1).join("/");
    const naslov = (t.split("\n").find((x) => /^\d+\./.test(x.trim())) || "").trim().slice(0, 44);
    const m = document.querySelector("main");
    const klik = m ? [...m.querySelectorAll("button,[role=button],input,canvas")].filter((e) => {
      const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4;
    }).length : 0;
    const imgs = [...(m ? m.querySelectorAll("img") : [])];
    return { brojac, naslov, klik, slika: imgs.length, ucitane: imgs.filter((i) => i.naturalWidth > 0).length };
  });
  const ok = d.klik > 0 && errs.length === 0 && d.slika === d.ucitane;
  if (!ok) lose++;
  console.log(
    String(n).padEnd(5) + d.brojac.padEnd(9) + d.naslov.padEnd(46) +
    String(d.klik).padStart(9) + String(d.slika).padStart(7) + String(d.ucitane).padStart(9) +
    String(errs.length).padStart(9) + "  " + (ok ? "ODREĐEN — radi" : "PROBLEM")
  );
  if (errs.length) errs.slice(0, 2).forEach((e) => console.log("        ! " + e));
  await c.close();
}
await b.close();
console.log(`\n${8 - lose}/8 zadataka određeno kao ispravno`);
process.exit(lose ? 1 : 0);
