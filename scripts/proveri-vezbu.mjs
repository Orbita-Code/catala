/**
 * VEŽBA („Practicar paraules") SME DA NUDI SAMO REČI — NE PITANJA.
 *
 * Prijava vlasnice 27.08.2026, na kraju teme „Els animals": u vežbi su stajala
 * PITANJA („Amb què vola l'au?") umesto reči koja se uči („ales"). Dete vidi
 * pitanje, a nema nijedan ponuđen odgovor — samo „Ho sé" i „Encara no". Uz to
 * snimak za celo pitanje ne postoji, pa ga je čitao glas uređaja i izgovarao
 * „què" kao „k".
 *
 * Takvi zapisi su ušli iz starije verzije zadatka i STOJE U PREGLEDAČU DETETA
 * i posle popravke. Zato aplikacija mora da ih izbaci pri čitanju.
 *
 * Ova provera to i meri: u pamćenje pregledača se upiše mešavina — pitanje,
 * dug opis, slepljena rečenica i jedna prava reč — pa se gleda šta aplikacija
 * ponudi za vežbanje. Sme da ostane samo prava reč.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const [KOR, LOZ] = (process.env.BASIC_AUTH || "catala:changeme").split(":");

const SMECE = [
  "Amb què vola l'au?",                          // pitanje — nema gde da se odgovori
  "Gran, mamífer, cobert de pel, viu al bosc",   // opis, ne reč
  "Lapeixeteriavenpeix.",                        // slepljena rečenica
];
const PRAVA_REC = "ales";

const b = await chromium.launch({ headless: true });
const c = await b.newContext({
  viewport: { width: 1440, height: 900 },
  httpCredentials: { username: KOR, password: LOZ },
});
const p = await c.newPage();

await p.goto(BASE, { waitUntil: "domcontentloaded" });
await p.evaluate(([smece, rec]) => {
  localStorage.setItem("catala-errors", JSON.stringify({
    "els-animals": { "els-animals-13": [...smece, rec] },
  }));
  localStorage.setItem("catala-progress", JSON.stringify({
    "els-animals": {
      currentTask: 0, completedTasks: [], streak: 0, bestStreak: 0, stars: 0,
      taskErrors: { "els-animals-13": [...smece, rec] },
    },
  }));
}, [SMECE, PRAVA_REC]);

await p.goto(BASE, { waitUntil: "networkidle" });
await p.waitForTimeout(1200);

const natpis = await p
  .locator("text=/paraul(a|es) per practicar/i")
  .first()
  .innerText()
  .catch(() => "(nema natpisa)");

const koliko = parseInt((natpis.match(/(\d+)/) || [])[1] ?? "0", 10);

console.log(`upisano u pamćenje: ${SMECE.length} nepodobnih + 1 prava reč`);
console.log(`aplikacija nudi za vežbanje: „${natpis}"`);

if (koliko !== 1) {
  console.error(
    `\nPADA: za vežbanje se nudi ${koliko} stavki, a sme samo 1 (reč „${PRAVA_REC}").\n` +
    `      Pitanja i opisi i dalje ulaze u vežbu — dete dobija pitanje bez ijednog odgovora.`
  );
  await b.close();
  process.exit(1);
}

console.log("\nOK: od 4 upisane stavke za vežbanje je ostala samo prava reč.");
await b.close();
