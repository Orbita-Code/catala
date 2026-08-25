#!/usr/bin/env node
/**
 * SLAGALICA SLOVA — svaka reč mora da POSTOJI u mreži, i to PRAVO.
 *
 * Dva uslova:
 *   1. reč mora stvarno da stoji u mreži (inače je zadatak nerešiv);
 *   2. reč sme da stoji SAMO vodoravno ili uspravno — nikad ukoso.
 *
 * Drugi uslov je iz prijave vlasnice 25.08.2026: „u svakoj prethodnoj temi reči
 * su bile levo ili desno, gore ili dole, a odjednom su sve dijagonalno — deca se
 * zbune i ne znaju da može dijagonalno." Izmereno tog dana: tema 6 imala je 7 od
 * 9 reči SAMO ukoso, tema 10 šest od devet, teme 3 i 12 po pet od deset.
 *
 * Traži se i da se reč ne pojavi UKOSO SLUČAJNO, kad se mreža dopuni nasumičnim
 * slovima — dete ne zna razliku između namerne i slučajne dijagonale.
 */
import fs from "fs";

const PRAVO = [[0,1],[1,0],[0,-1],[-1,0]];
const UKOSO = [[1,1],[1,-1],[-1,-1],[-1,1]];
const osn = (r) => r.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z]/g,"");

function nadji(m, rec, pravci){
  const w = osn(rec), n = m.length;
  for (let r=0;r<n;r++) for (let c=0;c<n;c++) for (const [dr,dc] of pravci) {
    const r1=r+dr*(w.length-1), c1=c+dc*(w.length-1);
    if (r1<0||r1>=n||c1<0||c1>=n) continue;
    let ok=true;
    for (let i=0;i<w.length;i++) if (m[r+dr*i][c+dc*i]!==w[i]) { ok=false; break; }
    if (ok) return true;
  }
  return false;
}

let ukupno=0, fali=0, ukoso=0;
for (const f of fs.readdirSync("src/data").filter(x=>x.endsWith(".ts")&&!["themes.ts","task-data.ts"].includes(x))) {
  const s = fs.readFileSync("src/data/"+f,"utf8");
  for (const m of s.matchAll(/words: \[([^\]]*)\],\s*\n\s*grid: \[([\s\S]*?)\n\s*\],/g)) {
    const reci = [...m[1].matchAll(/"([^"]+)"/g)].map(x=>x[1]);
    const mreza = [...m[2].matchAll(/\[([^\]]*)\]/g)].map(r=>[...r[1].matchAll(/"([^"]*)"/g)].map(x=>x[1]));
    if (!mreza.length) continue;
    for (const r of reci) {
      ukupno++;
      if (!nadji(mreza, r, PRAVO)) { fali++; console.log(`  ✗ ${f}: „${r}" NIJE u mreži pravo`); }
      if (nadji(mreza, r, UKOSO))  { ukoso++; console.log(`  ✗ ${f}: „${r}" stoji UKOSO`); }
    }
  }
}
console.log(`provereno ${ukupno} reči u mrežama, nedostaje: ${fali}, ukoso: ${ukoso}`);
process.exit(fali || ukoso ? 1 : 0);
