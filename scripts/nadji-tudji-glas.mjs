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
import path from "path";
import { fileURLToPath } from "url";
import { solveTask } from "../e2e/qa/solve-lib.mjs";

const __dirname_ = path.dirname(fileURLToPath(import.meta.url));
/** Tačni odgovori — da prolaz zadatke REŠAVA, ne samo da klikće (v. dole). */
const ODGOVORI = JSON.parse(
  fs.readFileSync(path.join(__dirname_, "..", "e2e", "qa", "tasks.json"), "utf8")
);

const BASE = process.env.BASE || "http://localhost:3200";
/**
 * LOZINKA SE ČITA IZ OKOLINE, NE UPISUJE SE (24.08.2026).
 *
 * Ranije je ovde stajalo `changeme` — lokalna rezervna lozinka. Protiv
 * PRODUKCIJE to znači 401 na svakoj strani: skripta ne vidi nijedan zadatak,
 * prekine posle prve, i prijavi „tuđim glasom: 0". Pre-deploy test je to
 * čitao kao „sve u redu", a vlasnica je u isto vreme slušala tuđe glasove u
 * temama 4 i 5. **Provera koja se nije izvršila prijavljivala se kao prošla.**
 */
const [KOR, LOZ] = (process.env.BASIC_AUTH || "catala:changeme").split(":");
const SVE_TEME = ["la-classe","l-escola","el-cos","la-roba","la-casa","la-familia",
              "les-botigues","el-menjar","els-animals","la-ciutat","els-vehicles","els-oficis"];

/**
 * MOŽE I SAMO JEDNA TEMA (27.08.2026).
 *
 * Prolaz sada REŠAVA svaki zadatak da bi čuo šta se izgovori, pa mu treba oko
 * osam sekundi po zadatku — za svih 226 to je preko pola sata, i to kao
 * POSLEDNJA kapija pred objavljivanje. Vlasnica je čekala i s pravom pitala
 * dokle.
 *
 * Zato prima imena tema kao argumente: `node scripts/nadji-tudji-glas.mjs
 * el-cos la-roba`. Tako se dvanaest tema pusti uporedo, u dvanaest procesa, i
 * ceo prolaz traje koliko najduža tema — ne koliko sve zajedno. Bez argumenata
 * radi kao i dosad, sve teme redom.
 */
const trazene = process.argv.slice(2).filter((x) => SVE_TEME.includes(x));
const TEME = trazene.length ? trazene : SVE_TEME;

const b = await chromium.launch({ headless: true });
const c = await b.newContext({ httpCredentials: { username: KOR, password: LOZ }, viewport: { width: 1300, height: 950 } });
const p = await c.newPage();
await p.addInitScript(() => {
  window.__g = [];
  const o = window.speechSynthesis?.speak?.bind(window.speechSynthesis);
  if (o) window.speechSynthesis.speak = (u) => { window.__g.push(u.text); return o(u); };
});

const nadjeno = new Map();   // tekst → gde je viđen
let obidjeno = 0;            // koliko je zadataka STVARNO otvoreno
for (const tema of TEME) {
  for (let n = 1; n <= 30; n++) {
    await p.goto(`${BASE}/tema/${tema}?tasca=${n}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(600);
    const naslov = (await p.locator("main").innerText().catch(() => "")).split("\n")[0] || "";
    if (!naslov || !/^\d+\./.test(naslov)) break;   // nema više zadataka u temi
    obidjeno++;
    await p.evaluate(() => { window.__g = []; });
    /**
     * PROLAZ ZADATKE REŠAVA, NE SAMO KLIKĆE (27.08.2026).
     *
     * Prijava vlasnice: „tema 7, zadatak 3 — kad dete pogodi celu rečenicu, glas
     * koji je ponavlja opet nije Montse. Dokle više da nalazim tuđe glasove?"
     *
     * Uzrok NIJE bio u snimcima nego u ovom prolazu. On je klikao po strani, ali
     * zadatke nije REŠAVAO — a četiri tipa zadatka izgovaraju celu rečenicu TEK
     * KAD JE ODGOVOR TAČAN („Compro fruita a la fruiteria."). Prolaz nikad nije
     * pogodio, pa te rečenice nikad nije ni čuo, i javljao je „0 tuđih glasova"
     * dok ih je dete slušalo.
     *
     * Zato se sada prvo pusti PRAVI REŠAVAČ sa tačnim odgovorima, pa tek onda
     * diranje po strani kao dopuna. Tako prolaz čuje sve što čuje i dete.
     */
    const zadatak = (ODGOVORI[tema] || [])[n - 1];
    if (zadatak) {
      await Promise.race([
        solveTask(p, zadatak, []).catch(() => {}),
        new Promise((r) => setTimeout(r, 45000)),
      ]);
      await p.waitForTimeout(1500);
    }

    /**
     * VIŠE KRUGOVA DIRANJA (24.08.2026).
     *
     * Ranije se dugmad hvatala JEDNOM, najviše 26 komada. Ali posle svakog
     * klika se strana promeni i nikne nova dugmad — ponuđene reči, sledeća
     * reč, prikaz rezultata. Tako su ostajali neprobani baš oni izgovori koji
     * se SASTAVLJAJU tek kad je odgovor tačan („A l'aiguera, hi ha els plats
     * bruts.", „un camisa", „CUI, NA"). Vlasnica ih je čula, test nije.
     */
    for (let krug = 0; krug < 4; krug++) {
      const d = p.locator("main button, main [role=button]");
      const k = Math.min(await d.count(), 40);
      for (let i = 0; i < k; i++) {
        await d.nth(i).click({ force: true, timeout: 700 }).catch(() => {});
        await p.waitForTimeout(120);
      }
      await p.waitForTimeout(300);
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
/**
 * OBIĐENIH ZADATAKA SE ISPISUJE UVEK — po tome se vidi da li je provera
 * uopšte radila. Nula obiđenih uz nula nalaza NIJE dobra vest nego kvar
 * (najčešće pogrešna lozinka ili ugašen server).
 */
process.stderr.write(`\nOBIĐENO ZADATAKA: ${obidjeno}\n`);
process.stderr.write(`TUĐIM GLASOM SE IZGOVARA: ${nadjeno.size} različitih tekstova\n`);
