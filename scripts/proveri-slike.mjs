#!/usr/bin/env node
/**
 * NAĐI SVAKU REČ KOJU DETE VIDI, A KOJA NEMA SLIKU.
 *
 * ZAŠTO POSTOJI (17.08.2026, vlasnica: „zašto i dalje imamo zadatke bez
 * slike????"). Do sada se to otkrivalo tako što ona naiđe na zadatak. Ova
 * provera prolazi sve teme i sve zadatke i nabraja svaku takvu reč.
 *
 * Poštuje polje `image` iz podataka — ono ima prednost nad samom rečju, kao i
 * u aplikaciji. Preskaču se zadaci gde slika i ne treba: antonimi u frazama
 * („casa gran → casa petita"), slaganje reči iz dva dela, slagalica slova.
 */
import fs from "fs";

const slike = new Set(fs.readdirSync("public/illustrations").filter((f) => f.endsWith(".webp")).map((f) => f.replace(".webp", "")));
const reg = fs.readFileSync("src/lib/illustrations.ts", "utf8");
const kljuc = (w) => w.toLowerCase().trim().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/·/g, "").replace(/[\s'’]+/g, "-");
const CLAN = /^(el |la |l'|els |les |un |una |en |na )/;
const ima = (w) => {
  const k = kljuc(w);
  if (slike.has(k) && reg.includes(`"${k}"`)) return true;
  const k2 = kljuc(w.toLowerCase().trim().replace(CLAN, ""));
  return slike.has(k2) && reg.includes(`"${k2}"`);
};

const BEZ_SLIKE = ["write-antonym", "matching", "word-search", "separate-words", "order-words", "decode-grid", "drawing-canvas"];
const fale = [];
for (const f of fs.readdirSync("src/data").filter((x) => x.endsWith(".ts") && !["themes.ts", "task-data.ts"].includes(x))) {
  const s = fs.readFileSync("src/data/" + f, "utf8").replace(/^\s*\/\/.*$/gm, "");
  for (const d of s.split(/\n  \{\n/).slice(1)) {
    const id = (d.match(/id: "([^"]+)"/) || [])[1];
    const tip = (d.match(/type: "([^"]+)"/) || [])[1];
    if (!id || BEZ_SLIKE.includes(tip)) continue;
    // stavke koje NOSE svoju sliku preko `image:` su u redu
    for (const m of d.matchAll(/\{[^{}]*?(?:catalan|word):\s*"([^"]+)"[^{}]*?\}/g)) {
      if (/image:\s*"/.test(m[0])) continue;
      if (!ima(m[1])) fale.push(`${f.replace(".ts", "")} · ${id} · ${m[1]}`);
    }
    for (const m of d.matchAll(/(?:allItems|items):\s*\[([^\]]*)\]/g)) {
      if (m[1].includes("{")) continue;
      for (const r of m[1].matchAll(/"([^"]+)"/g)) if (!ima(r[1])) fale.push(`${f.replace(".ts", "")} · ${id} · ${r[1]}`);
    }
  }
}
const jedinstveni = [...new Set(fale)];
console.log(`BEZ SLIKE: ${jedinstveni.length}`);
for (const x of jedinstveni) console.log("  " + x);
