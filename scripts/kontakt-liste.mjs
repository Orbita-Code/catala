/**
 * KONTAKT LISTA ILUSTRACIJA — sve slike jedne teme na jednom listu.
 *
 * Izraz je iz fotografije: kad se razvije film, sve sličice se odštampaju jedna
 * do druge, pa se na prvi pogled vidi koja je promašena.
 *
 * ZAŠTO POSTOJI: u aplikaciji dete vidi JEDNU sliku u jednom trenutku i svaka za
 * sebe izgleda u redu. Neujednačen stil, tekst na slici ili lice na predmetu vide
 * se SAMO u poređenju. Prebrojavanje fajlova prolazi uredno i kad na čaši piše
 * „Yogurt" — a to je stajalo mesecima. Slika se ne ocenjuje spiskom nego gledanjem.
 *
 * ZAŠTO NODE, A NE PYTHON: 10.08.2026. je `python3` na ovom Mac-u prestao da radi
 * (traži prihvatanje Xcode licence, što može samo vlasnica), a ImageMagick pada iz
 * istog razloga. `sharp` dolazi uz Next.js i ne traži nikakvu dozvolu.
 *
 * Pokretanje:
 *     node scripts/kontakt-liste.mjs           # sve teme
 *     node scripts/kontakt-liste.mjs el-menjar # jedna tema
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PROJ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const IZLAZ = path.join(PROJ, "AUDIT", "kontakt-liste");
const SLIKE = path.join(PROJ, "public", "illustrations");

const TEME = ["la-classe", "l-escola", "el-cos", "la-roba", "la-casa", "la-familia",
  "les-botigues", "el-menjar", "els-animals", "la-ciutat", "els-vehicles", "els-oficis"];

/** Reč → ime fajla: skida naglaske, srednju tačku i razmake. */
function kljuc(w) {
  return w.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/·/g, "-").toLowerCase().replace(/[\s']+/g, "-");
}

/** Natpis ispod slike — SVG jer sharp ne ume da crta tekst direktno. */
function natpis(tekst, sirina) {
  const t = tekst.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return Buffer.from(
    `<svg width="${sirina}" height="26"><text x="4" y="19" font-family="Helvetica,Arial"
     font-size="16" fill="#1a1a1a">${t}</text></svg>`
  );
}

async function listaZaTemu(slug) {
  const data = fs.readFileSync(path.join(PROJ, "src", "data", `${slug}.ts`), "utf8");
  const reci = new Set();
  const re = /(?:catalan|word|correct|targetItem|item|image|blank|left|right):\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(data))) reci.add(m[1].trim());

  const ima = [], nema = [], pokvarene = [], vidjene = new Set();
  for (const w of [...reci].sort()) {
    const k = kljuc(w);
    if (vidjene.has(k)) continue;
    vidjene.add(k);
    const p = path.join(SLIKE, `${k}.webp`);
    if (!fs.existsSync(p)) { nema.push(w); continue; }
    try {
      const buf = await sharp(p).resize(200, 200, { fit: "contain", background: "#fff" })
        .flatten({ background: "#fff" }).png().toBuffer();
      ima.push({ w, buf });
    } catch { pokvarene.push(w); }
  }
  if (!ima.length) return { slug, n: 0, nema, pokvarene };

  const K = 6, C = 216, H = 244;
  const R = Math.ceil(ima.length / K);
  const slojevi = [];
  ima.forEach(({ w, buf }, i) => {
    const x = (i % K) * C, y = Math.floor(i / K) * H;
    slojevi.push({ input: buf, left: x + 8, top: y + 8 });
    slojevi.push({ input: natpis(w, C - 8), left: x + 8, top: y + 212 });
  });

  const put = path.join(IZLAZ, `kontakt-${slug}.png`);
  await sharp({ create: { width: K * C, height: R * H, channels: 3, background: "#ffffff" } })
    .composite(slojevi).png().toFile(put);

  return { slug, n: ima.length, nema, pokvarene, put };
}

const trazena = process.argv[2];
const teme = trazena ? [trazena] : TEME;
fs.mkdirSync(IZLAZ, { recursive: true });

let uk = 0;
for (const t of teme) {
  const r = await listaZaTemu(t);
  uk += r.n;
  console.log(`${t.padEnd(14)} ${String(r.n).padStart(3)} slika` + (r.put ? ` → ${path.basename(r.put)}` : ""));
  if (r.pokvarene.length) console.log("               OŠTEĆENE: " + r.pokvarene.join(", "));
  if (r.nema.length) {
    console.log(`               BEZ slike (${r.nema.length}): ` + r.nema.slice(0, 10).join(", ")
      + (r.nema.length > 10 ? " …" : ""));
  }
}
console.log(`\nukupno slika na listama: ${uk}`);
console.log(`liste su u: ${IZLAZ}`);
