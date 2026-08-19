"use client";

/**
 * NAPREDAK UNUTAR JEDNOG ZADATKA — čuva se sam, bez pitanja.
 *
 * ZAŠTO POSTOJI (17.08.2026, prijava vlasnice)
 * Dete je popunjavalo reči, stiglo do pete od šest, slučajno prešlo prstima
 * preko dodirne ploče i otišlo na prethodni zadatak. Vratilo se odmah — i
 * zateklo 1/6. Pet rešenih reči je nestalo.
 *
 * ZAŠTO SE ČUVA, A NE PITA „hoćeš li izaći?"
 * Zato što se detetu od sedam godina ne postavlja pitanje na koje ono ne ume
 * da odgovori. Prozorčić sa upozorenjem dete ne pročita nego klikne bilo šta
 * da nestane — a i dalje bi izgubilo napredak. Uz to se ovo ne dešava samo
 * klikom: poklopi se laptop, crkne baterija, zvoni školsko zvono.
 * Zato aplikacija pamti sama, tiho, kao što rade Duolingo i slične igre:
 * dete se vrati tamo gde je stalo i nastavi.
 *
 * Pamti se SAMO gde je dete stalo unutar zadatka. Kad se zadatak završi,
 * zapis se briše — sledeći put se kreće ispočetka, kako i treba.
 */

const KLJUC = "catala-napredak-zadatka";

export type StanjeZadatka = {
  /** Redni broj reči/stavke na kojoj je dete stalo. */
  idx: number;
  /** Koliko je stavki već tačno urađeno (za brojač „5 / 6"). */
  gotovo?: number;
  /** Kad je poslednji put dirano — stariji zapisi se sami čiste. */
  kada?: number;
};

/** Stariji od sedam dana se briše: to više nije „nastavi", nego stari trag. */
const ROK = 7 * 24 * 60 * 60 * 1000;

function sve(): Record<string, StanjeZadatka> {
  if (typeof window === "undefined") return {};
  try {
    const s = localStorage.getItem(KLJUC);
    if (!s) return {};
    const o = JSON.parse(s);
    return o && typeof o === "object" ? o : {};
  } catch {
    return {}; // zabranjen ili pokvaren localStorage ne sme da obori zadatak
  }
}

export function sacuvajNapredak(taskId: string, stanje: StanjeZadatka): void {
  if (typeof window === "undefined" || !taskId) return;
  try {
    const o = sve();
    o[taskId] = { ...stanje, kada: Date.now() };
    // Usput se čisti sve starije od nedelju dana, da spisak ne raste bez kraja.
    for (const [k, v] of Object.entries(o)) {
      if (v?.kada && Date.now() - v.kada > ROK) delete o[k];
    }
    localStorage.setItem(KLJUC, JSON.stringify(o));
  } catch { /* nema gde da se zapamti — zadatak i dalje radi */ }
}

export function ucitajNapredak(taskId: string): StanjeZadatka | null {
  if (!taskId) return null;
  const v = sve()[taskId];
  if (!v || typeof v.idx !== "number") return null;
  if (v.kada && Date.now() - v.kada > ROK) return null;
  return v;
}

export function obrisiNapredak(taskId: string): void {
  if (typeof window === "undefined" || !taskId) return;
  try {
    const o = sve();
    if (!(taskId in o)) return;
    delete o[taskId];
    localStorage.setItem(KLJUC, JSON.stringify(o));
  } catch { /* isto */ }
}
