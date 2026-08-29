#!/usr/bin/env node
/**
 * SPISAK SLIČICA ZA ALBUM — pravi `src/data/album-slicice.ts`.
 *
 * ZAŠTO POSTOJI (28.08.2026, zahtev vlasnice)
 * „Da napravimo posle svake teme album sa slikama, gde će se pojaviti nove reči
 *  tj. slike iz igrice koje su otkrili u toj temi… kao pravi album, sa znakovima
 *  pitanja umesto sličica, a onda kad završe temu da im se otvore te sličice
 *  jedna po jedna."
 *
 * ZAŠTO SE GENERIŠE, A NE KUCA RUČNO
 * Spisak sličica MORA da bude isti kao ono što dete stvarno vidi u zadacima. Kad
 * bi se kucao ručno, prva izmena u temi bi ga razišla — dete bi u albumu dobilo
 * reč koju nikad nije srelo, ili ne bi dobilo onu koju jeste. Zato se izvlači iz
 * samih podataka igre, isto kao što `proveri-slike.mjs` proverava da svaka reč
 * ima sliku.
 *
 * ŠTA ULAZI U ALBUM
 * Samo reč koja ima SVOJU SLIKU. Album je album SLIČICA — reč bez slike u njemu
 * nema šta da traži. Zato se ne uzimaju rečenice, naslovi ni jelovnici.
 *
 * Pokretanje:  node scripts/napravi-album.mjs
 */

import fs from "fs";
import path from "path";

const PROJ = process.cwd();
const CLAN = /^(a l'|a la |a les |als |al |el |la |l'|els |les |un |una |a )/;

const kljuc = (r) =>
  r.toLowerCase().trim().normalize("NFD")
    .replace(/[̀-̧̩-ͯ]/g, "")   // skida akcente, čuva ç
    .replace(/[\s']+/g, "-");

const slike = new Set(
  fs.readdirSync(path.join(PROJ, "public/illustrations"))
    .filter((f) => f.endsWith(".webp"))
    .map((f) => f.replace(/\.webp$/, ""))
);

/** Vraća ključ slike za reč, ili null ako slike nema. */
function slikaZa(rec) {
  const k = kljuc(rec);
  if (slike.has(k)) return k;
  const bezClana = kljuc(rec.toLowerCase().trim().replace(CLAN, ""));
  return slike.has(bezClana) ? bezClana : null;
}

/** Zadaci iz kojih se reči NE uzimaju — tamo reč nije pojam nego materijal. */
const PRESKOCI = ["word-search", "separate-words", "order-words", "decode-grid", "drawing-canvas"];

/**
 * REDOSLED JE ONAJ IZ IGRE, NE ABECEDNI (28.08.2026).
 *
 * Sličica pripada temi u kojoj se PRVI PUT pojavi. Ako se teme obiđu abecedno,
 * „el-cos" (tema 3) pokupi reči koje dete prvi put vidi u „la-classe" (tema 1),
 * pa bi ih otkrivalo tek u trećoj temi — a u prvoj bi im ostao znak pitanja
 * iako ih je već naučilo. Zato se redosled čita iz `themes.ts`.
 */
const TEME = [...fs.readFileSync(path.join(PROJ, "src/data/themes.ts"), "utf8")
  .matchAll(/slug: "([a-z-]+)"/g)].map((m) => m[1]);

const poTemi = {};
const svePoznate = new Set();

for (const tema of TEME) {
  const sirovo = fs.readFileSync(path.join(PROJ, "src/data", `${tema}.ts`), "utf8")
    .replace(/^\s*\/\/.*$/gm, "");
  const nadjene = new Map();   // kljucSlike → reč kako se piše u igri

  for (const zadatak of sirovo.split(/\n  \{\n/).slice(1)) {
    const tip = (zadatak.match(/type: "([^"]+)"/) || [])[1];
    if (!tip || PRESKOCI.includes(tip)) continue;
    const bezJelovnika = zadatak.replace(/readText:\s*\[[\s\S]*?\n    \],/g, "");

    const kandidati = [];
    for (const m of bezJelovnika.matchAll(/(?:catalan|word|targetItem):\s*"([^"]+)"/g)) kandidati.push(m[1]);

    /**
     * KOLONA „NE PRIPADA" NE ULAZI U ALBUM (28.08.2026).
     *
     * Zadatak „Què és de la classe?" ima kolonu `No són de classe` sa rečima
     * koje NAMERNO nisu iz te teme — `anell`, `bicicleta`, `collaret`, `gat`.
     * Prvi izvlačilac ih je pokupio, pa je album u temi „La classe" nudio
     * prsten i bicikl kao školski pribor. Isto važi i za `allItems`, koji je
     * spisak SVEGA što se razvrstava, dakle i pogrešnih reči.
     *
     * U album ulaze samo reči iz kolona koje nešto POTVRĐUJU. Kolona koja
     * počinje sa „No" je odricanje i preskače se.
     */
    for (const m of bezJelovnika.matchAll(/title:\s*"([^"]+)",\s*items:\s*\[([^\]]*)\]/g)) {
      if (/^no\b/i.test(m[1].trim())) continue;
      if (m[2].includes("{")) continue;
      for (const r of m[2].matchAll(/"([^"]+)"/g)) kandidati.push(r[1]);
    }

    for (const rec of kandidati) {
      const cist = rec.trim();
      if (!cist || cist.length > 24 || /[.!?:]/.test(cist)) continue;
      const k = slikaZa(cist);
      if (!k) continue;
      // Ista slika ne ulazi dvaput; pamti se prvi zapis reči.
      if (!nadjene.has(k)) nadjene.set(k, cist.toLowerCase());
    }
  }

  // Sličica pripada temi u kojoj se PRVI PUT pojavila — inače bi ista slika
  // stajala u tri albuma i dete bi je „otkrivalo" više puta.
  const svoje = [];
  for (const [k, rec] of nadjene) {
    if (svePoznate.has(k)) continue;
    svePoznate.add(k);
    svoje.push({ kljuc: k, rec });
  }
  svoje.sort((a, b) => a.rec.localeCompare(b.rec, "ca"));
  poTemi[tema] = svoje;
}

const redovi = Object.entries(poTemi)
  .map(([tema, s]) =>
    `  "${tema}": [\n` +
    s.map((x) => `    { kljuc: "${x.kljuc}", rec: ${JSON.stringify(x.rec)} },`).join("\n") +
    `\n  ],`
  ).join("\n");

const izlaz = `// GENERISANO — ne menjati rukom. Pravi ga \`node scripts/napravi-album.mjs\`.
//
// Sličice albuma po temi. Svaka ima svoju sliku u \`public/illustrations\`, i
// pripada temi u kojoj se PRVI PUT pojavljuje — da je dete ne otkriva dvaput.

export interface Slicica {
  /** Ime fajla slike bez nastavka (\`public/illustrations/<kljuc>.webp\`). */
  kljuc: string;
  /** Reč kako stoji u igri — to piše ispod sličice i to Montse izgovara. */
  rec: string;
}

export const SLICICE: Record<string, Slicica[]> = {
${redovi}
};

/** Koliko sličica ukupno ima album. */
export const UKUPNO_SLICICA = Object.values(SLICICE).reduce((z, s) => z + s.length, 0);
`;

fs.writeFileSync(path.join(PROJ, "src/data/album-slicice.ts"), izlaz);

const ukupno = Object.values(poTemi).reduce((z, s) => z + s.length, 0);
console.log(`album: ${ukupno} sličica u ${Object.keys(poTemi).length} tema`);
for (const [t, s] of Object.entries(poTemi)) console.log(`  ${t.padEnd(16)} ${s.length}`);
