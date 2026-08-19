#!/usr/bin/env node
/**
 * SOPA DE LLETRES — generator mreže sa PROVEROM.
 *
 * ZAŠTO POSTOJI (17.08.2026): dete je reklo da mu je slagalica slova najzabavnija
 * i da hoće VIŠE REČI. Reč se ne sme samo dopisati u spisak — mora stvarno da
 * postoji u mreži, inače je zadatak nerešiv. Zato mreža i spisak nastaju
 * ZAJEDNO, i na kraju se svaka reč traži nazad u gotovoj mreži.
 *
 * Pravci: vodoravno, uspravno, dijagonalno — i unapred i unazad, kao u svesci.
 * Reči se namerno UKRŠTAJU gde mogu; tako mreža izgleda kao prava slagalica,
 * a ne kao spisak u redovima.
 *
 * Pokretanje:  node scripts/napravi-sopu.mjs
 */
import fs from "fs";

const PRAVCI = [
  [0, 1], [1, 0], [1, 1], [1, -1],
  [0, -1], [-1, 0], [-1, -1], [-1, 1],
];
const AZBUKA = "abcdefghijklmnopqrstuvwxyz";

/** Slova bez kvačica i bez razmaka — u mreži stoji samo osnovno slovo. */
const osnovno = (r) =>
  r.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");

function nasumicno(seme) {
  // Namerno DETERMINISTIČKI: isti ulaz uvek daje istu mrežu, pa se izmena vidi
  // u `git diff` i može da se ponovi. `Math.random` bi svaki put pravio drugu.
  let x = seme;
  return () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648;
}

function napraviMrezu(reci, velicina, seme) {
  const rnd = nasumicno(seme);
  const mreza = Array.from({ length: velicina }, () => Array(velicina).fill(null));
  const poredak = [...reci].sort((a, b) => osnovno(b).length - osnovno(a).length);

  for (const rec of poredak) {
    const w = osnovno(rec);
    let smesteno = false;
    for (let pokusaj = 0; pokusaj < 400 && !smesteno; pokusaj++) {
      const [dr, dc] = PRAVCI[Math.floor(rnd() * PRAVCI.length)];
      const r0 = Math.floor(rnd() * velicina);
      const c0 = Math.floor(rnd() * velicina);
      const r1 = r0 + dr * (w.length - 1);
      const c1 = c0 + dc * (w.length - 1);
      if (r1 < 0 || r1 >= velicina || c1 < 0 || c1 >= velicina) continue;
      let moze = true;
      for (let i = 0; i < w.length; i++) {
        const p = mreza[r0 + dr * i][c0 + dc * i];
        if (p !== null && p !== w[i]) { moze = false; break; }
      }
      if (!moze) continue;
      for (let i = 0; i < w.length; i++) mreza[r0 + dr * i][c0 + dc * i] = w[i];
      smesteno = true;
    }
    if (!smesteno) return null;   // ne staje — pozivalac neka poveća mrežu
  }
  for (let r = 0; r < velicina; r++)
    for (let c = 0; c < velicina; c++)
      if (mreza[r][c] === null) mreza[r][c] = AZBUKA[Math.floor(rnd() * 26)];
  return mreza;
}

/** Traži reč u gotovoj mreži — provera da zadatak NIJE nerešiv. */
function nadji(mreza, rec) {
  const w = osnovno(rec), n = mreza.length;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
    for (const [dr, dc] of PRAVCI) {
      const r1 = r + dr * (w.length - 1), c1 = c + dc * (w.length - 1);
      if (r1 < 0 || r1 >= n || c1 < 0 || c1 >= n) continue;
      let ok = true;
      for (let i = 0; i < w.length; i++) if (mreza[r + dr * i][c + dc * i] !== w[i]) { ok = false; break; }
      if (ok) return true;
    }
  return false;
}

export function sopa(reci, velicinaOd = 10) {
  for (let v = velicinaOd; v <= velicinaOd + 4; v++)
    for (let seme = 1; seme <= 300; seme++) {
      const m = napraviMrezu(reci, v, seme * 7919);
      if (m && reci.every((r) => nadji(m, r))) return { velicina: v, mreza: m };
    }
  return null;
}

if ((process.argv[1] || "").endsWith("napravi-sopu.mjs")) {
  const reci = process.argv.slice(2);
  const r = sopa(reci, 10);
  console.log(r ? JSON.stringify(r, null, 1) : "nije uspelo");
}
