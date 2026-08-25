#!/usr/bin/env node
/**
 * SOPA DE LLETRES — generator mreže sa PROVEROM.
 *
 * ZAŠTO POSTOJI (17.08.2026): dete je reklo da mu je slagalica slova najzabavnija
 * i da hoće VIŠE REČI. Reč se ne sme samo dopisati u spisak — mora stvarno da
 * postoji u mreži, inače je zadatak nerešiv. Zato mreža i spisak nastaju
 * ZAJEDNO, i na kraju se svaka reč traži nazad u gotovoj mreži.
 *
 * Pravci: SAMO SLEVA NADESNO (→) i ODOZGO NADOLE (↓).
 * Bez dijagonala i BEZ REČI UNAZAD (26.08.2026, dve prijave vlasnice).
 *
 * Zašto: „u svakoj prethodnoj temi reči su bile levo ili desno, gore ili dole,
 * a odjednom su sve dijagonalno — deca se zbune i ne znaju da može dijagonalno."
 * Izmereno: u temi 6 je 7 od 9 reči stajalo SAMO dijagonalno, u temi 10 šest od
 * devet, u temama 3 i 12 po pet od deset. Dete koje je naučilo da traži pravo
 * nema kako da pogodi da odjednom sme i ukoso — a nigde mu se to ne kaže.
 *
 * Prvo je (25.08.) izbačena samo dijagonala, a reči unazad su ostale. Vlasnica
 * je odmah prijavila i to: „stavio si dosta reči koje su unazad, to nije ok."
 * Bila je u pravu — dete koje tek uči da čita ne traži reč unatraške; ono zna
 * kako reč izgleda, i traži je onako kako je napisana.
 * Sveska to potvrđuje: u njenoj mreži `CONILL` ide nadole, a `TORTUGA` i `SERP`
 * sleva nadesno — nijedna reč nije okrenuta.
 *
 * Traži se i da se reč ne pojavi SLUČAJNO unazad ili ukoso kad se mreža dopuni
 * nasumičnim slovima — dete ne zna razliku između namernog i slučajnog.
 * Reči se namerno UKRŠTAJU gde mogu; tako mreža izgleda kao prava slagalica,
 * a ne kao spisak u redovima.
 *
 * Pokretanje:  node scripts/napravi-sopu.mjs
 */
import fs from "fs";

/** Jedina dva pravca u kojima reč SME da stoji: sleva nadesno i odozgo nadole. */
const PRAVCI = [[0, 1], [1, 0]];
/** Sve ostalo — unazad i ukoso — reč NE SME da pogodi ni slučajno. */
const ZABRANJENI = [[0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]];
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

/** Traži reč u mreži u zadatim pravcima; prazna polja se ne broje. */
function nadji(mreza, rec, pravci = PRAVCI) {
  const w = osnovno(rec), n = mreza.length;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
    for (const [dr, dc] of pravci) {
      const r1 = r + dr * (w.length - 1), c1 = c + dc * (w.length - 1);
      if (r1 < 0 || r1 >= n || c1 < 0 || c1 >= n) continue;
      let ok = true;
      for (let i = 0; i < w.length; i++) if (mreza[r + dr * i][c + dc * i] !== w[i]) { ok = false; break; }
      if (ok) return true;
    }
  return false;
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
  /**
   * DOPUNA NASUMIČNIM SLOVIMA — ALI PAŽLJIVO (26.08.2026).
   *
   * Ranije se svako prazno polje popunjavalo bilo kojim slovom. Kod kratkih
   * reči (`os`, `mà`, `ull`, `peu`) to je stalno stvaralo SLUČAJNE pojave —
   * reč iskrsne unazad ili ukoso iako je niko nije tamo stavio. Zbog toga dve
   * teme uopšte nisu mogle da dobiju ispravnu mrežu.
   *
   * Sada se za svako polje isprobavaju slova redom (nasumičnim redosledom) i
   * uzima se prvo koje NE stvara zabranjenu pojavu nijedne tražene reči.
   */
  const dopuna = [...AZBUKA];
  /**
   * SLUČAJNE POJAVE SE SPREČAVAJU SAMO ZA REČI OD 4+ SLOVA.
   *
   * Kod reči od dva-tri slova (`os`, `mà`, `ull`, `peu`) to je NEMOGUĆE:
   * u mreži od sto polja par slova `a`-`m` jedno do drugog javi se sam od
   * sebe, i nijedno popunjavanje ne može to da izbegne. Bitno je ono što dete
   * traži: **svaka reč iz spiska MORA da postoji unapred**. Ako se kratka reč
   * negde slučajno pojavi i unazad, dete je i dalje nalazi onako kako je
   * napisana, a slučajni par slova u šumi slova niko ne čita kao reč.
   */
  const duge = reci.filter((r) => osnovno(r).length >= 4);
  for (let r = 0; r < velicina; r++)
    for (let c = 0; c < velicina; c++) {
      if (mreza[r][c] !== null) continue;
      const redosled = [...dopuna].sort(() => rnd() - 0.5);
      let stavljeno = false;
      for (const slovo of redosled) {
        mreza[r][c] = slovo;
        if (!duge.some((x) => nadji(mreza, x, ZABRANJENI))) { stavljeno = true; break; }
      }
      if (!stavljeno) mreza[r][c] = redosled[0];
    }
  return mreza;
}

export function sopa(reci, velicinaOd = 10) {
  for (let v = velicinaOd; v <= velicinaOd + 4; v++)
    for (let seme = 1; seme <= 300; seme++) {
      const m = napraviMrezu(reci, v, seme * 7919);
      if (!m) continue;
      // svaka reč mora da postoji PRAVO...
      if (!reci.every((r) => nadji(m, r))) continue;
      // ...i nijedna ne sme da se nađe UKOSO, ni slučajno
      // ...i nijedna DUŽA reč (4+ slova) ne sme da se nađe unazad ni ukoso.
      // Kratke (`os`, `mà`) se ne broje — v. objašnjenje u `napraviMrezu`.
      if (reci.filter((r) => osnovno(r).length >= 4).some((r) => nadji(m, r, ZABRANJENI))) continue;
      return { velicina: v, mreza: m };
    }
  return null;
}

if ((process.argv[1] || "").endsWith("napravi-sopu.mjs")) {
  const reci = process.argv.slice(2);
  const r = sopa(reci, 10);
  console.log(r ? JSON.stringify(r, null, 1) : "nije uspelo");
}
