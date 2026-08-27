#!/usr/bin/env node
/**
 * SLAGALICA SLOVA — svaka reč mora da POSTOJI u mreži, i to PRAVO.
 *
 * Dva uslova:
 *   1. reč mora stvarno da stoji u mreži (inače je zadatak nerešiv);
 *   2. reč sme da stoji SAMO sleva nadesno ili odozgo nadole — nikad unazad,
 *      nikad ukoso. (26.08.2026: prvo je izbačena dijagonala, pa je vlasnica
 *      prijavila i reči unazad. Sveska ih nema — `CONILL` ide nadole,
 *      `TORTUGA` i `SERP` sleva nadesno.)
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

const NAPRED = [[0,1],[1,0]];                                  // sleva nadesno, odozgo nadole
const ZABRANJENO = [[0,-1],[-1,0],[1,1],[1,-1],[-1,-1],[-1,1]];  // unazad i ukoso
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
      if (!nadji(mreza, r, NAPRED)) { fali++; console.log(`  ✗ ${f}: „${r}" NIJE u mreži unapred`); }
      // Slučajne pojave kratkih reči (2–3 slova) se ne broje — v. objašnjenje
      // u `napravi-sopu.mjs`: u mreži od sto polja one su neizbežne, a dete
      // reč i dalje nalazi onako kako je napisana.
      if (osn(r).length >= 4 && nadji(mreza, r, ZABRANJENO)) {
        ukoso++; console.log(`  ✗ ${f}: „${r}" stoji UNAZAD ili UKOSO`);
      }
    }
  }
}
/**
 * REČ IZ MREŽE MORA DA POSTOJI I VAN MREŽE, I DA IMA SLIKU (27.08.2026).
 *
 * Prijava vlasnice: „nemamo slike za `granger` i `pintor` u sopa de lletres u
 * temi Els oficis; šta je granger, i ne vidim da se spominje kasnije u
 * zadacima."
 *
 * Bila je u pravu: obe reči stajale su SAMO u mreži — nigde drugde u temi, i
 * nijedna nije imala sliku. Dete tako traži reč koju nikad nije videlo, ne zna
 * šta znači, i posle je nigde ne sretne. Slagalica prestaje da bude vežbanje
 * naučenog i postaje traženje nepoznatog niza slova.
 *
 * Zato: svaka reč iz mreže mora da se pojavi bar još jednom u istoj temi (u
 * nekom drugom zadatku) i mora da ima svoju sliku.
 */
let siroce = 0;
{
  const slike = new Set(
    fs.readdirSync("public/illustrations").map((f) => f.replace(/\.webp$/, ""))
  );
  const kljuc = (x) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s']+/g, "-").toLowerCase();
  for (const f of fs.readdirSync("src/data").filter((f) => f.endsWith(".ts"))) {
    const izvor = fs.readFileSync("src/data/"+f, "utf8");
    const m = izvor.match(/type: "word-search"[\s\S]{0,600}?words: \[([^\]]+)\]/);
    if (!m) continue;
    for (const w of [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])) {
      const koliko = (izvor.match(new RegExp('"' + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"', "g")) || []).length;
      const imaSliku = slike.has(kljuc(w));
      if (koliko < 2 || !imaSliku) {
        siroce++;
        console.log(`  ✗ ${f}: „${w}" — u temi se pojavljuje ${koliko}x, slika: ${imaSliku ? "ima" : "NEMA"}`);
      }
    }
  }
}

console.log(`provereno ${ukupno} reči u mrežama, nedostaje: ${fali}, unazad/ukoso: ${ukoso}, bez slike ili van teme: ${siroce}`);
process.exit(fali || ukoso || siroce ? 1 : 0);
