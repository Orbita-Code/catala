#!/usr/bin/env node
/**
 * SLIKU IMAMO, A ZADATAK JE NE PRIKAZUJE.
 *
 * ZAŠTO POSTOJI (24.08.2026, vlasnica: „zadatak 16 nema nijednu sličicu, a
 * mislim da imamo svaku reč — sabó, fusta, garatge, jardí, teulada").
 *
 * Bila je u pravu za četiri od pet. Slike su stajale u `public/illustrations/`
 * mesecima, a nisu se prikazivale iz dva razloga odjednom:
 *   1. odgovor je REČENICA („És a la teulada"), pa traženje slike po celom
 *      tekstu odgovora ne nađe ništa;
 *   2. zadatak je bio označen kao `rightTextOnly` (samo tekst).
 *
 * Provera `proveri-slike.mjs` to nije mogla da nađe jer ona preskače tip
 * `matching` u celini — tražila je reči BEZ slike, a ovde je reč IMALA sliku.
 * Zato ova provera gleda iz suprotnog smera: prolazi svaki par u „Relaciona"
 * zadacima i javlja gde slika postoji u biblioteci, a dete je ne vidi.
 *
 * Ispisuje `SAKRIVENIH SLIKA: <broj>`.
 */
import fs from "fs";

const slike = new Set(
  fs.readdirSync("public/illustrations").filter((f) => f.endsWith(".webp")).map((f) => f.replace(".webp", ""))
);
const reg = fs.readFileSync("src/lib/illustrations.ts", "utf8");
const kljuc = (w) =>
  w.toLowerCase().trim().normalize("NFD").replace(/[̀-ͯ]/g, "")
   .replace(/·/g, "").replace(/[.,!?¿¡]/g, "").replace(/[\s'’]+/g, "-");
const ima = (w) => { const k = kljuc(w); return !!k && slike.has(k) && reg.includes(`"${k}"`); };

/** Reči koje same po sebi nikad nisu predmet — ne traži im se slika. */
const SLUZBENE = new Set(["a","al","als","el","la","l","els","les","un","una","uns","unes",
  "de","del","dels","d","amb","en","hi","ha","es","és","son","són","per","i","que","no","sí",
  "tres","dues","dos","molt","molta","aqui","aquí"]);

const problemi = [];
const izuzmi = ["themes.ts", "task-data.ts"];

for (const f of fs.readdirSync("src/data").filter((x) => x.endsWith(".ts") && !izuzmi.includes(x))) {
  const tema = f.replace(".ts", "");
  const s = fs.readFileSync("src/data/" + f, "utf8").replace(/^\s*\/\/.*$/gm, "");
  const zadaci = s.split(/\n  \{\n/).slice(1);

  zadaci.forEach((d, i) => {
    if (!/type: "matching"/.test(d)) return;
    const id = (d.match(/id: "([^"]+)"/) || [])[1] || "?";
    const samoTekst = /rightTextOnly: true/.test(d);
    const gde = `${tema} · ${id} · zadatak ${i + 1}`;

    for (const m of d.matchAll(/\{\s*left: "((?:[^"\\]|\\.)*)",\s*right: "((?:[^"\\]|\\.)*)"([^}]*)\}/g)) {
      const desno = m[2];
      const rep = m[3];
      const imenovana = (rep.match(/rightImage: "((?:[^"\\]|\\.)*)"/) || [])[1];

      // Da li dete VIDI sliku?
      const vidi = imenovana ? ima(imenovana) : (!samoTekst && ima(desno));
      if (vidi) continue;

      // Imenovana slika koja ne postoji je greška sama po sebi.
      if (imenovana && !ima(imenovana)) {
        problemi.push(`${gde} — rightImage: "${imenovana}" ne postoji u biblioteci`);
        continue;
      }

      // Postoji li slika za neku punoznačnu reč iz odgovora?
      const reci = desno.split(/[\s']+/).map((r) => r.replace(/[.,!?¿¡]/g, "")).filter(Boolean);
      const kandidat = reci.filter((r) => !SLUZBENE.has(r.toLowerCase())).reverse().find((r) => ima(r));
      if (kandidat) {
        problemi.push(`${gde} — „${desno}" nema sliku, a „${kandidat}" postoji u biblioteci`);
      }
    }
  });
}

problemi.forEach((p) => console.log("  " + p));
console.log(`SAKRIVENIH SLIKA: ${problemi.length}`);
process.exit(problemi.length ? 1 : 0);
