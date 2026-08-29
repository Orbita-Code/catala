"use client";

/**
 * PRENOS NAPRETKA IZ JEDNOG PREGLEDAČA U DRUGI.
 *
 * ZAŠTO POSTOJI (17.08.2026, prijava vlasnice)
 * Dete je završilo dve teme u Safariju. Pošto mikrofon u Safariju ne radi,
 * moralo je da pređe na Chrome — i tamo je zateklo prazno, pa je krenulo
 * ispočetka. Za dete koje se trudilo dve teme to je najgore moguće.
 *
 * ZAŠTO SE TO NE MOŽE REŠITI SAMO OD SEBE: napredak stoji u `localStorage`, a
 * jedan pregledač NE SME da čita podatke drugog — to je bezbednosno pravilo
 * svih pregledača, ne propust aplikacije. Isto važi i za dva uređaja.
 * Jedini pravi lek je nalog (v. `TODO.md`); ovo je most dotle, i koristan je
 * i posle njega (nov laptop, obrisan keš, drugi profil).
 *
 * Kako radi: u starom pregledaču se napravi kod, u novom se nalepi.
 * Kod je običan tekst — nema imena, nema ičega ličnog, samo koje su teme
 * urađene, koliko zvezdica i bodova, i koje reči treba vežbati.
 */

/** Šta se prenosi. `catala-mikrofon` NAMERNO nije tu — izbor mikrofona važi za taj uređaj. */
const KLJUCEVI = [
  "catala-progress",
  "catala-xp",
  "catala-daily-streak",
  "catala-errors",
  "catala-settings",
  // Album ide sa napretkom — inače bi se na novom uređaju svečano otvaranje
  // sličica ponovilo za svaku već završenu temu (28.08.2026).
  "catala-album",
];

const ZAGLAVLJE = "CATALA1:";

/** Napravi kod iz tekućeg pregledača. Vrati `null` ako nema šta da se prenese. */
export function napraviKod(): string | null {
  if (typeof window === "undefined") return null;
  const podaci: Record<string, string> = {};
  for (const k of KLJUCEVI) {
    try {
      const v = localStorage.getItem(k);
      if (v) podaci[k] = v;
    } catch { /* zabranjen localStorage — kod prosto neće imati taj deo */ }
  }
  if (!Object.keys(podaci).length) return null;
  try {
    // `unescape(encodeURIComponent(...))` je jedini način da `btoa` progura
    // slova sa kvačicama (à, ó, ç). Bez toga puca na prvoj katalonskoj reči.
    return ZAGLAVLJE + btoa(unescape(encodeURIComponent(JSON.stringify(podaci))));
  } catch {
    return null;
  }
}

export type IshodPrenosa =
  | { ok: true; teme: number }
  | { ok: false; razlog: "prazno" | "neispravan" | "nema-mesta" };

/**
 * Primeni kod u ovom pregledaču.
 *
 * NAMERNO PREPISUJE zatečeno stanje: dete koje prenosi napredak sa starog
 * uređaja hoće baš taj napredak. Zato UI mora da upozori pre nego što pozove
 * ovu funkciju.
 */
export function primeniKod(kod: string): IshodPrenosa {
  if (typeof window === "undefined") return { ok: false, razlog: "neispravan" };
  const ocisceno = kod.trim().replace(/\s+/g, "");
  if (!ocisceno) return { ok: false, razlog: "prazno" };
  if (!ocisceno.startsWith(ZAGLAVLJE)) return { ok: false, razlog: "neispravan" };

  let podaci: Record<string, string>;
  try {
    podaci = JSON.parse(decodeURIComponent(escape(atob(ocisceno.slice(ZAGLAVLJE.length)))));
    if (!podaci || typeof podaci !== "object") throw new Error("nije objekat");
  } catch {
    return { ok: false, razlog: "neispravan" };
  }

  try {
    for (const [k, v] of Object.entries(podaci)) {
      if (KLJUCEVI.includes(k) && typeof v === "string") localStorage.setItem(k, v);
    }
  } catch {
    return { ok: false, razlog: "nema-mesta" };
  }

  // Koliko je tema preneto — da poruka bude provera, a ne samo „gotovo".
  let teme = 0;
  try {
    const p = JSON.parse(podaci["catala-progress"] || "{}");
    teme = Object.keys(p).length;
  } catch { /* broj je samo lepa vest, ne uslov */ }

  return { ok: true, teme };
}
