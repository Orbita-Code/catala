/**
 * SNIMANJE IZGOVORA — da glas pripada IGRICI, a ne uređaju.
 *
 * ZAŠTO POSTOJI (13.08.2026, pitanje vlasnice „zar se glas ne vezuje za igricu
 * a ne za uređaj"): aplikacija je do sada molila RAČUNAR da izgovori reč, pa je
 * glas zavisio od toga koje glasove uređaj ima. Na maminom Mac-u je to
 * katalonska Montse, a na ćerkinom laptopu nijedan katalonski — pa je padalo na
 * španski. Španski glas čita „estoig" slovo po slovo umesto „estodj", i ne
 * stišava „e" na kraju („regle" izgovara kao „regle", a treba „regla"). Dete uči
 * izgovor po tome što čuje, pa to nije sitnica nego pogrešno gradivo.
 *
 * Sada se izgovor snima JEDNOM, glasom Montse, i snimci putuju sa igricom.
 * Svaki uređaj čuje isto, radi bez interneta, i ništa se ne instalira.
 *
 * BRZINA: `say -r` na Montse skoro ne radi — merenjem: 1,42 s na 175 i na 155
 * reči/min, pa skok na 1,56 s. Zato se usporava POSLE snimanja, ffmpeg-ovim
 * `atempo`, koji menja tempo a NE menja visinu glasa (bez toga bi Montse zvučala
 * kao da govori u bunaru). 0,85 = 17% sporije.
 *
 * Pokretanje:
 *     node scripts/snimi-izgovor.mjs                 # što još nema snimak
 *     node scripts/snimi-izgovor.mjs --sve           # snimi sve iznova
 *     node scripts/snimi-izgovor.mjs --spisak        # samo prebroj
 *     node scripts/snimi-izgovor.mjs --tempo 0.8     # drugi tempo
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const PROJ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const IZLAZ = path.join(PROJ, "public", "audio");
const TMP = path.join(IZLAZ, ".tmp");
const GLAS = "Montse";

const TEME = ["la-classe", "l-escola", "el-cos", "la-roba", "la-casa", "la-familia",
  "les-botigues", "el-menjar", "els-animals", "la-ciutat", "els-vehicles", "els-oficis"];

const arg = process.argv.slice(2);
const SVE = arg.includes("--sve");
const SAMO_SPISAK = arg.includes("--spisak");
/**
 * TEMPO PO VRSTI (14.08.2026, prijava vlasnice).
 *
 * Reči su na 0,85 bile taman („čitanje reči je dobro"), ali rečenice zadatka i
 * naslovi — ono što detetu OBJAŠNJAVA šta treba da uradi — bili su prebrzi.
 * I ima smisla: jedna reč se sluša kao celina, a rečenicu dete mora da isprati
 * do kraja i razume. Zato rečenice i naslovi idu na 0,72 (28% sporije od
 * Montseinog govora), a reči ostaju na 0,85.
 *
 * Zadaje se i ručno: `--tempo 0.8` postavlja SVE na tu vrednost.
 */
const TEMPO_PO_VRSTI = { rec: 0.85, recenica: 0.73, naslov: 0.73 };

/**
 * `--samo recenica,naslov` presnima SAMO te vrste. Bez toga bi promena tempa
 * za rečenice tražila presnimavanje i svih 555 reči bez potrebe (20 minuta).
 */
const SAMO_VRSTE = (() => {
  const i = arg.indexOf("--samo");
  return i >= 0 && arg[i + 1] ? new Set(arg[i + 1].split(",")) : null;
})();
const TEMPO_RUCNO = (() => {
  const i = arg.indexOf("--tempo");
  return i >= 0 && arg[i + 1] ? parseFloat(arg[i + 1]) : null;
})();
const tempoZa = (vrsta) => TEMPO_RUCNO ?? TEMPO_PO_VRSTI[vrsta] ?? 0.85;

/** Kratke reči dobijaju čitljivo ime; duže rečenice kratak otisak, da ime ne bude beskrajno. */
function kljuc(tekst) {
  const osnova = tekst.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/·/g, "-").toLowerCase()
    .replace(/['’]/g, "-").replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  // AKCENAT MENJA REČ, PA MORA I IME FAJLA (16.08.2026).
  //
  // Ime fajla skida akcente, pa su „és" i „es", „ós" i „os", „lleó" i „lleo",
  // „pèl" i „pel" padali na ISTO ime. Skripta je drugu po redu preskakala kao
  // sudar — a preskočena reč nema snimak, pa je aplikacija za nju tiho prelazila
  // na glas uređaja. To je isti kvar zbog kog je vlasnica čula dva glasa, samo
  // skriven u četiri reči.
  // Zato reč koja ima akcent (ili razmak/apostrof koji ime pojede) dobija kratak
  // otisak na kraju — ime ostaje čitljivo, a sudara više nema.
  const bezAkcenata = tekst.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const razlicito = bezAkcenata !== tekst.normalize("NFC") && bezAkcenata !== tekst;
  if (osnova.length <= 28 && !razlicito) return osnova;
  const otisak = crypto.createHash("sha1").update(tekst).digest("hex").slice(0, 6);
  return osnova.slice(0, 28) + "-" + otisak;
}

/**
 * Tekst koji se STVARNO izgovara.
 *
 * Tri stvari koje se moraju očistiti (nađeno 14.08.2026 merenjem trajanja —
 * dva naslova su trajala 12 s umesto očekivanih 7):
 *
 * 1. `\uXXXX` — podaci se čitaju kao OBIČAN TEKST, ne izvršavaju, pa u nizu
 *    stoji doslovno „ ". Bez ovoga Montse naglas izgovara „beksleš u nula
 *    nula a nula". Zato se te oznake pretvaraju u pravi znak.
 * 2. Strelice (→ ← ↓ ↑ ↗) su uputstvo ZA OKO, ne za uvo — čitanje „strelica
 *    desno, strelica levo…" samo zbunjuje dete.
 * 3. Crta za prazninu (`___`) se ne izgovara.
 */
function zaIzgovor(t) {
  return t
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/[→←↓↑↗↘↙↖⇒⇐]/g, " ")
    .replace(/_{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sveStavke() {
  const mapa = new Map();   // tekst (mala slova) → {tekst, kljuc, vrsta}
  const sudari = [];
  const dodaj = (sirovo, vrsta) => {
    const t = zaIzgovor(sirovo);
    if (!t || /^[0-9\s.,!?¿¡]+$/.test(t)) return;
    const donji = t.toLowerCase();
    if (mapa.has(donji)) return;
    const k = kljuc(t);
    if (!k) return;
    // Sudar imena nije uvek greška: „Completa les frases." i „…frases:" daju
    // isti ključ i ZVUČE isto, pa treba da DELE snimak, a ne da drugi ostane
    // bez njega. Prijavljuje se samo kad se tekstovi razlikuju i po slovima.
    for (const v of mapa.values()) {
      if (v.kljuc !== k) continue;
      const a = v.tekst.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
      const b = t.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
      if (a !== b) sudari.push([k, v.tekst, t]);
      mapa.set(donji, { tekst: v.tekst, kljuc: k, vrsta });
      return;
    }
    mapa.set(donji, { tekst: t, kljuc: k, vrsta });
  };

  for (const tema of TEME) {
    const s = fs.readFileSync(path.join(PROJ, "src", "data", `${tema}.ts`), "utf8");
    for (const m of s.matchAll(/(?:catalan|word|blank|left|right|correct|targetItem|item):\s*"([^"]+)"/g)) {
      if (m[1].trim().length <= 24) dodaj(m[1], "rec");
    }
    for (const m of s.matchAll(/(?:text|question):\s*"([^"]+)"/g)) dodaj(m[1], "recenica");
    for (const m of s.matchAll(/prompt:\s*"([^"]+)"/g)) dodaj(m[1], "naslov");

    // SPISKOVI REČI (16.08.2026, prijava vlasnice: „bosc, muntanya, platja i
    // sve množine govori drugi glas").
    //
    // Ovde je bila najveća rupa. Skripta je hvatala samo pojedinačna polja
    // (`catalan:`, `word:`, `blank:`…), a NIJE gledala spiskove — `options`
    // (ponuđene reči, koje se izgovaraju čim ih dete izabere), `items` i
    // `allItems` (razvrstavanje po kolonama), `words` u slagalici slova.
    // Tamo živi većina reči i gotovo sve množine. Bez snimka aplikacija tiho
    // pređe na glas uređaja, pa dete usred igre čuje dva različita glasa.
    //
    // Uzimaju se SAMO spiskovi golih reči (bez `{`) — spiskovi objekata su već
    // pokriveni gornjim pravilima, a iz njih bi ovde ušla i imena slika.
    for (const m of s.matchAll(/(?:options|items|allItems|words|description|instructions):\s*\[([^\]]*)\]/g)) {
      if (m[1].includes("{")) continue;
      for (const r of m[1].matchAll(/"([^"]+)"/g)) {
        if (r[1].trim().length <= 24) dodaj(r[1], "rec");
      }
    }

    // SASTAVLJENI IZGOVORI (16.08.2026, prijava vlasnice: „el laboratori i
    // el gimnàs govori drugi ženski glas").
    //
    // Uzrok: neki zadaci ne izgovaraju go podatak nego SASTAVE rečenicu u kodu —
    // `speak(`${article} ${word}`)` u „Posa l'article" i `speak(`${count}
    // ${description}`)` u „Compta i escriu". Snimak je postojao za „laboratori",
    // ali ne i za „el laboratori", pa je aplikacija tiho padala na glas uređaja
    // i dete je usred iste igre čulo dva različita glasa.
    //
    // Pravilo koje ovo pamti: snima se ono što se IZGOVARA, ne ono što piše u
    // podacima. Svaki nov `speak(` sa sastavljenim tekstom mora doći i ovde.
    for (const m of s.matchAll(/\{[^{}]*?word:\s*"([^"]+)"[^{}]*?article:\s*"([^"]+)"[^{}]*?\}/g)) {
      dodaj(`${m[2]} ${m[1]}`, "rec");
    }
    for (const m of s.matchAll(/\{[^{}]*?article:\s*"([^"]+)"[^{}]*?word:\s*"([^"]+)"[^{}]*?\}/g)) {
      dodaj(`${m[1]} ${m[2]}`, "rec");
    }
    for (const m of s.matchAll(/\{[^{}]*?count:\s*(\d+)[^{}]*?description:\s*"([^"]+)"[^{}]*?\}/g)) {
      dodaj(`${m[1]} ${m[2]}`, "rec");
    }
    for (const m of s.matchAll(/\{[^{}]*?description:\s*"([^"]+)"[^{}]*?count:\s*(\d+)[^{}]*?\}/g)) {
      dodaj(`${m[2]} ${m[1]}`, "rec");
    }
  }
  return { mapa, sudari };
}

function trajanje(f) {
  try {
    const out = execFileSync("afinfo", [f], { encoding: "utf8" });
    const m = out.match(/estimated duration:\s*([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
  } catch { return 0; }
}

const { mapa, sudari } = sveStavke();
const po = (v) => [...mapa.values()].filter((x) => x.vrsta === v).length;
console.log(`reči: ${po("rec")}   rečenica: ${po("recenica")}   naslova: ${po("naslov")}   ukupno: ${mapa.size}`);
console.log(`tempo — reči: ${tempoZa("rec")}, rečenice i naslovi: ${tempoZa("recenica")}   (1.0 = kako Montse čita sama)`);
if (sudari.length) {
  console.log(`⚠ sudari imena (${sudari.length}), preskočeno:`);
  for (const [k, a, b] of sudari.slice(0, 8)) console.log(`   ${k}: „${a}" vs „${b}"`);
}
if (SAMO_SPISAK) process.exit(0);

/**
 * `--proveri` — SAMO PROVERI, NE SNIMAJ (16.08.2026).
 *
 * Postoji da bi pre-deploy test mogao da koristi OVU skriptu umesto da svoju
 * kopiju istog pravila drži pored. Dve kopije pravila se pre ili kasnije
 * raziđu, a tada provera prestane da proverava ono što se stvarno dešava.
 *
 * Izlazni kod 0 = sve što aplikacija izgovara ima svoj snimak.
 * Izlazni kod 1 = nešto se izgovara glasom uređaja, dakle drugim glasom.
 */
if (process.argv.includes("--proveri")) {
  const fale = [...mapa.values()].filter((x) => !fs.existsSync(path.join(IZLAZ, `${x.kljuc}.m4a`)));
  if (fale.length) {
    console.log(`BEZ SNIMKA: ${fale.length}`);
    for (const f of fale.slice(0, 12)) console.log(`   „${f.tekst}" → ${f.kljuc}.m4a`);
    process.exit(1);
  }
  console.log(`svih ${mapa.size} izgovora ima snimak`);
  process.exit(0);
}

fs.mkdirSync(IZLAZ, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

let novih = 0, preskoceno = 0;
const sumnjivi = [];

for (const { tekst, kljuc: k, vrsta } of mapa.values()) {
  const cilj = path.join(IZLAZ, `${k}.m4a`);
  const trazenaVrsta = !SAMO_VRSTE || SAMO_VRSTE.has(vrsta);
  if (fs.existsSync(cilj) && (!SVE || !trazenaVrsta)) { preskoceno++; continue; }
  const aiff = path.join(TMP, `${k}.aiff`);
  try {
    execFileSync("say", ["-v", GLAS, "-o", aiff, tekst]);
    execFileSync("ffmpeg", ["-y", "-i", aiff, "-filter:a", `atempo=${tempoZa(vrsta)}`,
      "-c:a", "aac", "-b:a", "32k", cilj], { stdio: "ignore" });
  } catch (e) {
    sumnjivi.push([tekst, k, "snimanje palo: " + String(e).slice(0, 50)]);
    continue;
  }
  const t = trajanje(cilj);
  try { fs.unlinkSync(aiff); } catch {}
  // Orijentir: oko 0,09 s po znaku. Ispod 0,25 s je progutano; preko 12 s nije rečenica.
  const ocekivano = Math.max(0.35, tekst.length * 0.075);
  if (t < 0.25 || t > 12 || t < ocekivano * 0.45) {
    sumnjivi.push([tekst, k, `trajanje ${t.toFixed(2)} s (očekivano ~${ocekivano.toFixed(1)} s)`]);
  }
  novih++;
  if (novih % 100 === 0) console.log(`   snimljeno ${novih}…`);
}

try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {}

// SIROČIĆI: kad se tekst promeni (npr. izbačene strelice), menja se i ime
// fajla, pa stari snimak ostane da leži i nikad se ne pusti. Briše se ovde da
// se ne vuče u repo i u keš na detetovom uređaju.
const trazeni = new Set([...mapa.values()].map((v) => `${v.kljuc}.m4a`));
let obrisano = 0;
for (const f of fs.readdirSync(IZLAZ)) {
  if (f.endsWith(".m4a") && !trazeni.has(f)) { fs.unlinkSync(path.join(IZLAZ, f)); obrisano++; }
}
if (obrisano) console.log(`obrisano siročića (stari nazivi): ${obrisano}`);

const fajlovi = fs.readdirSync(IZLAZ).filter((f) => f.endsWith(".m4a"));
const ukupno = fajlovi.reduce((a, f) => a + fs.statSync(path.join(IZLAZ, f)).size, 0);
console.log(`\nnovih: ${novih}   |   već postojalo: ${preskoceno}`);
console.log(`fajlova: ${fajlovi.length}   |   ukupno: ${(ukupno / 1048576).toFixed(1)} MB`);
if (sumnjivi.length) {
  console.log(`\n⚠ ZA PRESLUŠAVANJE (${sumnjivi.length}):`);
  for (const [t, k, z] of sumnjivi.slice(0, 25)) console.log(`   „${t}" (${k}.m4a): ${z}`);
}

const parovi = [...mapa.entries()].filter(([, v]) => fs.existsSync(path.join(IZLAZ, `${v.kljuc}.m4a`)));
fs.writeFileSync(path.join(PROJ, "src", "lib", "audio-reci.ts"),
`// GENERISANO — ne menjati rukom. Pravi ga \`node scripts/snimi-izgovor.mjs\`.
//
// Šta ima snimljen izgovor (glas Montse, katalonski).
// Aplikacija prvo traži snimak; ako ga nema, čita glasom uređaja kao i pre —
// zato dodavanje nove reči ništa ne kvari, samo joj fali snimak dok se skripta
// ne pusti ponovo.
export const SNIMLJENO: Record<string, string> = {
${parovi.map(([donji, v]) => `  ${JSON.stringify(donji)}: ${JSON.stringify(v.kljuc)},`).join("\n")}
};
`);
console.log(`\nspisak upisan: src/lib/audio-reci.ts (${parovi.length} stavki)`);
