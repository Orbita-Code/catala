// Provera K1: sa ZABRANJENIM localStorage-om aplikacija mora da radi.
// Pušta se i protiv STAROG koda (produkcija) — tamo MORA da padne, inače provera ne valja.
import { createRequire } from "module";
const require = createRequire("/Users/jovana.jovic/Projects/Katalonski/");
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3000";
const CRED = process.env.BASIC_AUTH
  ? { username: process.env.BASIC_AUTH.split(":")[0], password: process.env.BASIC_AUTH.split(":")[1] }
  : { username: "catala", password: "changeme" };

const SCENARIJI = [
  ["localStorage potpuno zabranjen", () => { const baci=()=>{throw new DOMException('The operation is insecure.','SecurityError');};
      Object.defineProperty(window,'localStorage',{get:baci,configurable:true}); }],
  ["samo UPIS baca", () => { localStorage.setItem=()=>{ throw new DOMException('The operation is insecure.','SecurityError'); }; }],
  ["samo BRISANJE baca", () => { localStorage.removeItem=()=>{ throw new DOMException('The operation is insecure.','SecurityError'); }; }],
  ["localStorage pokvaren", () => { try{ for(const k of ["catala-progress","catala-settings","catala-xp","catala-errors","catala-daily-streak"]) localStorage.setItem(k,"{nije-json"); }catch{} }],
];
const STRANE = ["/", "/tema/la-classe", "/stats", "/configuracio"];

const b = await chromium.launch({ headless: true });
let palo = 0, ukupno = 0;
for (const [ime, init] of SCENARIJI) {
  for (const put of STRANE) {
    ukupno++;
    const c = await b.newContext({ httpCredentials: CRED, viewport: { width: 390, height: 844 } });
    const p = await c.newPage();
    await p.addInitScript(init);
    await p.goto(BASE + put, { waitUntil: "domcontentloaded", timeout: 90000 });
    await p.waitForTimeout(3500);
    const d = await p.evaluate(() => ({
      dugmad: document.querySelectorAll("button,a").length,
      pao: /Application error|client-side exception/.test(document.body.innerText),
    }));
    const ok = d.dugmad > 0 && !d.pao;
    if (!ok) palo++;
    console.log(`${ok ? "OK  " : "PAO "} ${ime.padEnd(30)} ${put.padEnd(18)} elemenata=${String(d.dugmad).padStart(3)}`);
    await c.close();
  }
}
await b.close();
console.log(`\nrezultat: ${ukupno - palo}/${ukupno} prošlo`);
process.exit(palo > 0 ? 1 : 0);
