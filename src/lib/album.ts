"use client";

/**
 * ALBUM SLIČICA — šta je otkriveno, a šta još stoji pod znakom pitanja.
 *
 * ZAŠTO POSTOJI (28.08.2026, zahtev vlasnice)
 * „Album sa slikama gde će se pojaviti nove reči tj. slike iz igrice koje su
 *  otkrili u toj temi… kao pravi album, sa znakovima pitanja umesto sličica, a
 *  onda kad završe temu da im se otvore te sličice jedna po jedna, da budu
 *  srećni koliko su sličica dobili, a onda ostale sličice su i dalje pod znakom
 *  pitanja."
 *
 * PRAVILO OTKRIVANJA
 * Sličice jedne teme se otvaraju kad je ta tema završena u celini. Tako dete
 * tačno zna šta je zaradilo i čime — a album ostaje nagrada, ne spisak.
 *
 * ŠTA SE PAMTI
 * Pamti se SAMO to da li je svečano otvaranje već odgledano (`prikazano`).
 * Šta je otključano NE pamti se posebno nego se računa iz napretka — da se dva
 * zapisa ne raziđu. Zapis koji se izvodi iz drugog zapisa uvek pre ili kasnije
 * počne da laže; ovde ima jedan izvor istine, a to je napredak deteta.
 */

import { SLICICE } from "@/data/album-slicice";
import { themes } from "@/data/themes";
import { getScoringTaskCount, getCompletedScoringCount } from "@/data/task-data";
import { getProgress } from "@/lib/progress";
import { safeSetJSON } from "@/lib/storage";

const KLJUC = "catala-album";

interface StanjeAlbuma {
  /** Teme čije je svečano otvaranje dete već videlo. */
  prikazano: string[];
}

function ucitaj(): StanjeAlbuma {
  if (typeof window === "undefined") return { prikazano: [] };
  try {
    const s = localStorage.getItem(KLJUC);
    const o = s ? JSON.parse(s) : null;
    return { prikazano: Array.isArray(o?.prikazano) ? o.prikazano : [] };
  } catch {
    return { prikazano: [] };
  }
}

/** Da li je tema završena u celini (bez dodatne aktivnosti, koja se ne boduje). */
export function temaZavrsena(slug: string): boolean {
  const ukupno = getScoringTaskCount(slug);
  if (ukupno <= 0) return false;
  const p = getProgress()[slug];
  if (!p) return false;
  return getCompletedScoringCount(slug, p.completedTasks || []) >= ukupno;
}

/** Sve teme čije su sličice otključane. */
export function otkriveneTeme(): string[] {
  return themes.map((t) => t.slug).filter(temaZavrsena);
}

/** Koliko je sličica otkriveno, i koliko ih ukupno ima. */
export function brojSlicica(): { otkriveno: number; ukupno: number } {
  let otkriveno = 0, ukupno = 0;
  for (const t of themes) {
    const s = SLICICE[t.slug] || [];
    ukupno += s.length;
    if (temaZavrsena(t.slug)) otkriveno += s.length;
  }
  return { otkriveno, ukupno };
}

/**
 * Tema koja je upravo zaslužila svečano otvaranje: završena je, a otvaranje
 * još nije odgledano. Vraća `null` kad nema takve.
 */
export function temaZaOtvaranje(): string | null {
  const { prikazano } = ucitaj();
  return otkriveneTeme().find((s) => !prikazano.includes(s)) || null;
}

/** Zapamti da je svečano otvaranje te teme odgledano. */
export function zapamtiOtvaranje(slug: string): void {
  const stanje = ucitaj();
  if (stanje.prikazano.includes(slug)) return;
  safeSetJSON(KLJUC, { prikazano: [...stanje.prikazano, slug] });
}
