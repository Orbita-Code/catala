#!/usr/bin/env node
/**
 * SVAKA REČ U ZADATKU RAZVRSTAVANJA MORA IMATI TAČAN ODGOVOR NA EKRANU.
 *
 * ZAŠTO POSTOJI (24.08.2026, vlasnica: „tema 5 zadatak 17 je nerešiv…
 * treba da se stavi banyera ili u sobu ili u dnevnu sobu; takođe nevera
 * mora da se stavi, to nije normalno").
 *
 * Bila je u pravu. Zadatak `la-casa-17` ima ČETIRI sobe, ali je bio označen
 * kao `circleMode`, a taj raspored („krug — reč — krug") crta tačno DVA
 * izbora — u kodu su `columns[0]` i `columns[1]` upisani rukom. `Lavabo` i
 * `Cuina` se nisu ni iscrtavale, pa osam od šesnaest reči nije imalo nijedan
 * tačan odgovor. Zadatak se NIJE MOGAO ZAVRŠITI.
 *
 * Ova provera to hvata unapred, za sve teme:
 *   1. reč koju dete dobija mora da pripada nekoj koloni  (inače je tačan
 *      odgovor nemoguć);
 *   2. ta kolona mora da bude MEĐU ISCRTANIMA  (`circleMode` iscrtava samo
 *      prve dve — zato `circleMode` sme samo uz tačno dve kolone);
 *   3. ista reč ne sme da stoji u dve kolone  (dete bi moralo da nagađa).
 *
 * Ispisuje `NEREŠIVO: <broj>`; nula znači da je sve u redu.
 */
import fs from "fs";

const izuzmi = ["themes.ts", "task-data.ts"];
const problemi = [];

for (const f of fs.readdirSync("src/data").filter((x) => x.endsWith(".ts") && !izuzmi.includes(x))) {
  const tema = f.replace(".ts", "");
  const s = fs.readFileSync("src/data/" + f, "utf8").replace(/^\s*\/\/.*$/gm, "");
  const zadaci = s.split(/\n  \{\n/).slice(1);

  zadaci.forEach((d, i) => {
    if (!/type: "classify-columns"/.test(d)) return;
    const id = (d.match(/id: "([^"]+)"/) || [])[1] || "?";
    const redni = i + 1; // isti broj koji dete vidi u adresi (`?tasca=N`)
    const gde = `${tema} · ${id} · zadatak ${redni}`;

    // kolone i njihove stavke
    const blokKolona = (d.match(/columns: \[([\s\S]*?)\n    \],/) || [])[1] || "";
    const kolone = [...blokKolona.matchAll(/title: "([^"]*)",\s*\n\s*items: \[([^\]]*)\]/g)]
      .map((m) => ({
        naslov: m[1],
        stavke: [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      }));
    if (!kolone.length) { problemi.push(`${gde} — kolone se ne mogu pročitati`); return; }

    const krugovi = /circleMode: true/.test(d);
    // KOLIKO SE KOLONA ZAISTA ISCRTA (v. ClassifyColumns.tsx)
    const iscrtane = krugovi ? kolone.slice(0, 2) : kolone;

    if (krugovi && kolone.length !== 2) {
      problemi.push(
        `${gde} — circleMode uz ${kolone.length} kolone; iscrtavaju se samo ` +
        `„${kolone[0].naslov}" i „${kolone[1]?.naslov}", a ` +
        `„${kolone.slice(2).map((k) => k.naslov).join("”, „")}" nestaju`
      );
    }

    const blokSvih = (d.match(/allItems: \[([\s\S]*?)\n    \],/) || [])[1] || "";
    const sve = [...blokSvih.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    if (!sve.length) { problemi.push(`${gde} — allItems se ne može pročitati`); return; }

    for (const rec of sve) {
      const uIscrtanim = iscrtane.filter((k) => k.stavke.includes(rec));
      const uSvim = kolone.filter((k) => k.stavke.includes(rec));
      if (!uSvim.length) {
        problemi.push(`${gde} — „${rec}" ne pripada nijednoj koloni`);
      } else if (!uIscrtanim.length) {
        problemi.push(
          `${gde} — „${rec}" je tačna u koloni „${uSvim[0].naslov}", ` +
          `a ta kolona se ne iscrtava`
        );
      } else if (uSvim.length > 1) {
        problemi.push(
          `${gde} — „${rec}" stoji u dve kolone (${uSvim.map((k) => k.naslov).join(", ")})`
        );
      }
    }

    // stavka koja stoji u koloni, a dete je nikad ne dobije
    for (const k of kolone) {
      for (const rec of k.stavke) {
        if (!sve.includes(rec)) problemi.push(`${gde} — „${rec}" je u koloni „${k.naslov}", a nije u allItems`);
      }
    }
  });
}

problemi.forEach((p) => console.log("  " + p));
console.log(`NEREŠIVO: ${problemi.length}`);
process.exit(problemi.length ? 1 : 0);
