#!/usr/bin/env node
/**
 * SLIKA ZA PARNI DEO TELA — dva primerka iste slike, jedan pored drugog.
 *
 * ZAŠTO POSTOJI (17.08.2026, prijava vlasnice: „tema 3, zadatak 11 nema slike
 * za sve reči nego samo za `ulls` i još nešto").
 *
 * Zadatak spaja radnju sa delom tela, a delovi su u MNOŽINI: `orelles`, `mans`,
 * `cames`. Postojale su samo slike za jedninu, pa je pola zadatka bilo bez
 * slika — dete je jedne reči prepoznavalo po slici, a druge nije, u istom
 * zadatku.
 *
 * Slika se SASTAVLJA od jednine, ne naručuje iznova: uvo i uvo su isto uvo, pa
 * razliku nosi samo broj. Da model crta množinu iznova, dobila bi se dva malo
 * različita uva i poruka bi se izgubila. Isti postupak kao za posuđe u temi 8.
 *
 * Desni primerak je OGLEDALSKI okrenut — tako par izgleda kao pravi par
 * (levo i desno uvo), a ne kao ista slika nalepljena dvaput.
 *
 * Pokretanje: node scripts/napravi-par.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "fs";

const PAROVI = {
  orella: "orelles", ma: "mans",
  // Množine iz teme 5 (17.08.2026, prijava vlasnice: „zadatak 3 tema 5 nema
  // sliku za persianes i antenes, verovatno zato što su množina").
  persiana: "persianes", antena: "antenes", garatge: "garatges",
};

/**
 * `cama` SE NE UDVAJA — njena slika VEĆ prikazuje obe noge.
 *
 * Prvo izdanje ove skripte je i nju udvojilo, pa su na slici bile ČETIRI noge.
 * Zato se `cames` prosto preslikava iz `cama`: dete u tom zadatku vidi samo
 * množinu, pa zabune nema, a četiri noge bi bile prava greška.
 * Pouka: pre udvajanja se POGLEDA izvorna slika — ime „jednina" ne znači da je
 * na slici jedan komad.
 */
const PRESLIKAJ = { cama: "cames" };
const PLATNO = 512;

for (const [jednina, mnozina] of Object.entries(PAROVI)) {
  const izvor = `public/illustrations/${jednina}.webp`;
  const { data, info } = await sharp(izvor).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // Bela pozadina postaje providna da se dva primerka ne seku belim kvadratom.
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 238 && data[i + 1] > 236 && data[i + 2] > 230) data[i + 3] = 0;
  }
  const lik = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png().toBuffer().then((b) => sharp(b).trim({ threshold: 10 }).resize({ height: 300 }).png().toBuffer());
  const ogledalo = await sharp(lik).flop().png().toBuffer();
  const m = await sharp(lik).metadata();

  const razmak = 24;
  const ukupno = m.width * 2 + razmak;
  const levo = Math.round((PLATNO - ukupno) / 2);
  const gore = Math.round((PLATNO - 300) / 2);

  const slika = await sharp({ create: { width: PLATNO, height: PLATNO, channels: 4, background: "#ffffff" } })
    .composite([
      { input: lik, left: levo, top: gore },
      { input: ogledalo, left: levo + m.width + razmak, top: gore },
    ]).png().toBuffer();

  writeFileSync(`Ilustracije/${mnozina}.png`, slika);
  await sharp(slika).webp({ quality: 82 }).toFile(`public/illustrations/${mnozina}.webp`);
  console.log(`  ${mnozina}.webp  (od ${jednina})`);
}

for (const [izvor, cilj] of Object.entries(PRESLIKAJ)) {
  const b = await sharp(`public/illustrations/${izvor}.webp`).toBuffer();
  await sharp(b).webp({ quality: 82 }).toFile(`public/illustrations/${cilj}.webp`);
  await sharp(b).png().toFile(`Ilustracije/${cilj}.png`);
  console.log(`  ${cilj}.webp  (preslikano iz ${izvor} — već prikazuje obe)`);
}
