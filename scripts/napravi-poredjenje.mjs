#!/usr/bin/env node
/**
 * SLIKE POREĐENJA: „alt / baix / vell / jove" — dečak i devojčica.
 *
 * ZAŠTO OVAKO, A NE KROZ ChatGPT (14.08.2026)
 * Zadatak 15 u temi 3 traži da dete vidi ko je viši, ko niži, ko stariji, ko
 * mlađi. Da se to naruči od ChatGPT-a, dobilo bi se osam novih likova u osam
 * malo različitih rukopisa — a u JEDNOM zadatku bi stajali jedan pored drugog.
 * Zato se slike SASTAVLJAJU od likova koje aplikacija već ima (`germa`,
 * `germana`, `avi`, `avia`). Tako su sve četiri slike u istom stilu, jer su i
 * napravljene od istih crteža, a visina se poredi na jedinom poštenom način:
 * isti lik, dve visine — ništa drugo se ne menja.
 *
 * Dogovor: onaj o kome rečenica govori stoji LEVO i ima meki krug iza sebe.
 *
 * Pokretanje:  node scripts/napravi-poredjenje.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "fs";

const IZVOR = "public/illustrations";
const PLATNO = 900;      // kvadratno platno, kao i ostale ilustracije
const DNO = 800;         // linija na kojoj oba lika stoje

/**
 * Skine belu/kremastu pozadinu i vrati SAMO lik, opsečen na sredinu slike.
 *
 * Ukrasi (srca, zvezdice) stoje po ivicama izvorne slike, pa se seče na
 * srednjih 86% širine — inače bi oko sastavljenog para lebdele zvezdice iz
 * dve različite slike i izgledalo bi neuredno.
 */
async function izvadiLik(ime) {
  const ulaz = sharp(`${IZVOR}/${ime}.webp`);
  const { width, height } = await ulaz.metadata();
  const secenje = {
    left: Math.round(width * 0.14),
    top: 0,
    width: Math.round(width * 0.86),
    height,
  };
  const { data, info } = await sharp(`${IZVOR}/${ime}.webp`)
    .extract(secenje)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Providno sve što je skoro belo. Granice su namerno visoke: koža je oko
  // (255,224,200), a `g < 230` je zadržava. Kremasta pozadina dede i bake je
  // oko (253,248,240) i pada ispod praga.
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 236 && data[i + 1] > 232 && data[i + 2] > 224) data[i + 3] = 0;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer()
    .then((b) => sharp(b).trim({ threshold: 10 }).png().toBuffer());
}

/** Meki krug iza lika o kome je reč — da dete zna na koga se rečenica odnosi. */
function krug(cx, cy, r) {
  return Buffer.from(
    `<svg width="${PLATNO}" height="${PLATNO}">
       <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFE9A8" opacity="0.55"/>
     </svg>`
  );
}

/**
 * @param izlaz    ime fajla bez nastavka
 * @param subjekt  {ime, visina} — lik o kome rečenica govori, ide LEVO
 * @param drugi    {ime, visina} — lik sa kojim se poredi, ide DESNO
 */
async function napravi(izlaz, subjekt, drugi) {
  const [a, b] = await Promise.all([izvadiLik(subjekt.ime), izvadiLik(drugi.ime)]);
  const A = await sharp(a).resize({ height: subjekt.visina }).toBuffer();
  const B = await sharp(b).resize({ height: drugi.visina }).toBuffer();
  const mA = await sharp(A).metadata();
  const mB = await sharp(B).metadata();

  const levoX = Math.round(PLATNO * 0.30 - mA.width / 2);
  const desnoX = Math.round(PLATNO * 0.76 - mB.width / 2);

  const slika = await sharp({
    create: { width: PLATNO, height: PLATNO, channels: 4, background: "#ffffff" },
  })
    .composite([
      // Krug se crta oko STVARNOG lika (levoX + pola njegove širine), a ne oko
      // pretpostavljene tačke — inače kod niskog lika ispadne pomeren u stranu.
      // Poluprečnik je ograničen i razmakom do ivice platna, da se ne odseče.
      {
        input: krug(
          levoX + Math.round(mA.width / 2),
          DNO - Math.round(subjekt.visina / 2),
          Math.min(
            Math.round(Math.max(mA.width, subjekt.visina) * 0.62),
            levoX + Math.round(mA.width / 2) - 24,
            DNO - Math.round(subjekt.visina / 2) - 24
          )
        ),
        top: 0,
        left: 0,
      },
      { input: A, left: levoX, top: DNO - subjekt.visina },
      { input: B, left: desnoX, top: DNO - drugi.visina },
    ])
    .png()
    .toBuffer();

  writeFileSync(`Ilustracije/${izlaz}.png`, slika);
  await sharp(slika).webp({ quality: 82 }).toFile(`public/illustrations/${izlaz}.webp`);
  console.log(`  ${izlaz}.webp  (${subjekt.ime} ${subjekt.visina}px  |  ${drugi.ime} ${drugi.visina}px)`);
}

const VISOK = 560;
const NIZAK = 360;
const ODRASTAO = 580;
const DETE = 410;

console.log("pravim slike poređenja…");
await napravi("noi-alt", { ime: "germa", visina: VISOK }, { ime: "germa", visina: NIZAK });
await napravi("noi-baix", { ime: "germa", visina: NIZAK }, { ime: "germa", visina: VISOK });
await napravi("noia-alta", { ime: "germana", visina: VISOK }, { ime: "germana", visina: NIZAK });
await napravi("noia-baixa", { ime: "germana", visina: NIZAK }, { ime: "germana", visina: VISOK });
await napravi("noi-vell", { ime: "avi", visina: ODRASTAO }, { ime: "germa", visina: DETE });
await napravi("noi-jove", { ime: "germa", visina: DETE }, { ime: "avi", visina: ODRASTAO });
await napravi("noia-vella", { ime: "avia", visina: ODRASTAO }, { ime: "germana", visina: DETE });
await napravi("noia-jove", { ime: "germana", visina: DETE }, { ime: "avia", visina: ODRASTAO });
console.log("gotovo — 8 slika");
