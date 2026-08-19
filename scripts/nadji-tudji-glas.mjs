#!/usr/bin/env node
/**
 * NAĐI SVE ŠTO APLIKACIJA IZGOVARA TUĐIM GLASOM.
 *
 * ZAŠTO POSTOJI (17.08.2026, vlasnica: „svaki put kažeš da si rešio i uvek se
 * otkrije nov zadatak gde pričaju čudni glasovi").
 *
 * Do sada se popravljao svaki prijavljeni slučaj posebno, a uzrok je ostajao:
 * proveravalo se da svaki tekst IZ PODATAKA ima snimak. Ali aplikacija dosta
 * toga SASTAVLJA u kodu („la cortina", „el laboratori", „3 pomes"), i to se u
 * podacima ne vidi.
 *
 * Ovaj prolaz ne gleda podatke nego SLUŠA aplikaciju: obiđe svaki zadatak u
 * svih 12 tema, pritisne sve što se da pritisnuti, i zapiše svaki tekst koji je
 * otišao na `speechSynthesis` — dakle na glas uređaja.
 *
 * Izlaz je spisak za snimanje. Kad je spisak prazan, ceo govor u igrici je
 * Montse i ničiji drugi.
 *
 * Pokretanje:  node scripts/nadji-tudji-glas.mjs > /tmp/tudji.txt
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
import fs from "fs";

const BASE = process.env.BASE || "http://localhost:3200";
const TEME = ["la-classe","l-escola","el-cos","la-roba","la-casa","la-familia",
              "les-botigues","el-menjar","els-animals","la-ciutat","els-vehicles","els-oficis"];

const b = await chromium.launch({ headless: true });
const c = await b.newContext({ httpCredentials: { username: "catala", password: "changeme" }, viewport: { width: 1300, height: 950 } });
const p = await c.newPage();
await p.addInitScript(() => {
  window.__g = [];
  const o = window.speechSynthesis?.speak?.bind(window.speechSynthesis);
  if (o) window.speechSynthesis.speak = (u) => { window.__g.push(u.text); return o(u); };
});

const nadjeno = new Map();   // tekst → gde je viđen
for (const tema of TEME) {
  for (let n = 1; n <= 30; n++) {
    await p.goto(`${BASE}/tema/${tema}?tasca=${n}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(500);
    const naslov = (await p.locator("main").innerText().catch(() => "")).split("\n")[0] || "";
    if (!naslov || !/^\d+\./.test(naslov)) break;   // nema više zadataka u temi
    await p.evaluate(() => { window.__g = []; });
    const d = p.locator("main button, main [role=button]");
    const k = Math.min(await d.count(), 26);
    for (let i = 0; i < k; i++) {
      await d.nth(i).click({ force: true, timeout: 900 }).catch(() => {});
      await p.waitForTimeout(140);
    }
    await p.waitForTimeout(500);
    for (const t of await p.evaluate(() => window.__g || [])) {
      if (t && !nadjeno.has(t)) nadjeno.set(t, `${tema} z${n}`);
    }
  }
  process.stderr.write(`  ${tema}: ukupno nađeno ${nadjeno.size}\n`);
}
await b.close();

if (nadjeno.size) console.log(JSON.stringify([...nadjeno.entries()], null, 1));
process.stderr.write(`\nTUĐIM GLASOM SE IZGOVARA: ${nadjeno.size} različitih tekstova\n`);
