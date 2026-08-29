"use client";

/**
 * PREDLOG NOVE POČETNE STRANE (28.08.2026, zahtev vlasnice).
 *
 * „Mozda cak i bolje nego sto je trenutno ovo na pocetnoj strani, a to su ove
 *  mini ikonice tema, neki plan i pojma nemam sta, nekako mi se ne svidja to
 *  resenje, mozda umesto toga da stavimo album sa slikama."
 *
 * OVO NE MENJA POSTOJEĆU POČETNU. Stoji na svojoj adresi (`/inici-nou`) da se
 * dve mogu uporediti pre odluke — izmena navigacije je krupna i nije moja da je
 * donesem sam.
 *
 * ŠTA JE DRUGAČIJE I ZAŠTO
 *
 * 1. NASTAVI TAMO GDE SI STAO — najveća stvar na strani.
 *    Dete koje otvori igru hoće da NASTAVI, ne da bira. Do sada je moralo da
 *    prepozna svoju temu među dvanaest sitnih pločica. Sada mu prva kartica
 *    kaže gde je stalo, sa slikom iz te teme i koliko je uradilo.
 *
 * 2. TEME KAO PUT, NE KAO REŠETKA.
 *    Rešetka od dvanaest pločica ne kaže ništa o redosledu ni o tome dokle se
 *    stiglo. Put koji vijuga to kaže sam: iza tebe je pređeno, ispred stoji ono
 *    što sledi. Svaka stanica nosi SLIKU iz svoje teme, ne emodži.
 *
 * 3. ALBUM JE POLICA, NE DUGME.
 *    Umesto reda teksta, vide se poslednje osvojene sličice i koliko ih fali —
 *    to je ono zbog čega se dete vraća.
 *
 * Ništa se ne izmišlja: brojevi dolaze iz istog napretka kao i na staroj strani.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { themes } from "@/data/themes";
import { getScoringTaskCount, getCompletedScoringCount } from "@/data/task-data";
import { getProgress } from "@/lib/progress";
import { getLevelProgress } from "@/lib/levels";
import { getDailyStreak } from "@/lib/progress";
import { getWordIllustration } from "@/lib/illustrations";
import { SLICICE } from "@/data/album-slicice";
import { SLAVLJE, SLAVLJE_PODRAZUMEVANO } from "@/data/slavlje-teme";
import { brojSlicica, otkriveneTeme } from "@/lib/album";
import type { UserProgress } from "@/types/tasks";

export default function PredlogPocetne() {
  const [napredak, setNapredak] = useState<UserProgress>({});
  const [album, setAlbum] = useState({ otkriveno: 0, ukupno: 0 });
  const [otkrivene, setOtkrivene] = useState<string[]>([]);
  const [nivo, setNivo] = useState<{ broj: number; postotak: number; xp: number }>({ broj: 1, postotak: 0, xp: 0 });
  const [niz, setNiz] = useState(0);

  useEffect(() => {
    setNapredak(getProgress());
    setAlbum(brojSlicica());
    setOtkrivene(otkriveneTeme());
    const n = getLevelProgress();
    setNivo({ broj: n.currentLevel.level, postotak: n.progressPercent, xp: n.currentXP });
    setNiz(getDailyStreak());
  }, []);

  const stanje = useMemo(() => themes.map((t) => {
    const ukupno = getScoringTaskCount(t.slug);
    const gotovo = getCompletedScoringCount(t.slug, napredak[t.slug]?.completedTasks || []);
    return {
      ...t,
      ukupno,
      gotovo,
      zavrsena: ukupno > 0 && gotovo >= ukupno,
      zapoceta: gotovo > 0,
      junak: (SLAVLJE[t.slug] || SLAVLJE_PODRAZUMEVANO).junak,
    };
  }), [napredak]);

  /** Gde je dete stalo: prva započeta a nezavršena, inače prva nezavršena. */
  const tekuca = stanje.find((t) => t.zapoceta && !t.zavrsena) || stanje.find((t) => !t.zavrsena);

  /** Poslednje osvojene sličice — polica albuma. */
  const poslednje = useMemo(() => {
    const redom = [...otkrivene].reverse();
    const izlaz: { kljuc: string; rec: string }[] = [];
    for (const slug of redom) {
      for (const s of SLICICE[slug] || []) {
        izlaz.push(s);
        if (izlaz.length >= 7) return izlaz;
      }
    }
    return izlaz;
  }, [otkrivene]);

  return (
    <div className="min-h-dvh pb-10" style={{ background: "linear-gradient(180deg,#faf7ff 0%,#f2ecff 100%)" }}>
      {/* ── ZAGLAVLJE: nivo, bodovi, niz dana ── */}
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#6C5CE7] text-lg font-black text-white shadow-md">
            {nivo.broj}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-sm font-black text-[#3d2c63]">Nivell {nivo.broj}</span>
              <span className="text-xs font-bold text-[#7a6a9e]">{nivo.xp} punts</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#e2d8f7]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00CECE]"
                initial={{ width: 0 }}
                animate={{ width: `${nivo.postotak}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="flex h-12 shrink-0 items-center gap-1.5 rounded-2xl bg-white px-3 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="#FF7043">
              <path d="M12 2c1.6 3.4.6 5.3-.8 7-1.5 1.8-3.2 3.4-3.2 6a4 4 0 0 0 8 0c0-1.2-.4-2.2-1-3 2.3.7 4 2.9 4 5.4A6.4 6.4 0 0 1 12 24a6.4 6.4 0 0 1-7-6.6C5 12 9.6 9.8 12 2z" />
            </svg>
            <span className="text-sm font-black text-[#3d2c63]">{niz}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-5 max-w-3xl px-4">
        {/* ── 1. NASTAVI ── */}
        {tekuca && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 190, damping: 20 }}
          >
            <Link
              href={`/tema/${tekuca.slug}`}
              className="relative flex items-center gap-4 overflow-hidden rounded-3xl p-4 text-white shadow-[0_12px_30px_rgba(60,40,110,0.28)]"
              style={{ background: `linear-gradient(115deg,${tekuca.color} 0%,${tekuca.color}cc 55%,#3d2c63 130%)` }}
            >
              {getWordIllustration(tekuca.junak) && (
                <img
                  src={getWordIllustration(tekuca.junak)!}
                  alt=""
                  draggable={false}
                  className="h-24 w-24 shrink-0 select-none rounded-2xl bg-white/90 object-contain p-1 shadow-md"
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-black uppercase tracking-wider text-white/75">
                  {tekuca.zapoceta ? "Continua" : "Comença"}
                </span>
                <span className="block truncate text-2xl font-black leading-tight">{tekuca.name}</span>
                <span className="mt-2 block h-2 overflow-hidden rounded-full bg-black/20">
                  <span
                    className="block h-full rounded-full bg-white"
                    style={{ width: `${tekuca.ukupno ? (tekuca.gotovo / tekuca.ukupno) * 100 : 0}%` }}
                  />
                </span>
                <span className="mt-1 block text-sm font-bold text-white/85">
                  {tekuca.gotovo} de {tekuca.ukupno} activitats
                </span>
              </span>
            </Link>
          </motion.div>
        )}

        {/* ── 2. POLICA ALBUMA ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 190, damping: 20 }}
          className="mt-4"
        >
          <Link href="/album" className="block rounded-3xl bg-white p-4 shadow-[0_8px_22px_rgba(60,40,110,0.12)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-black text-[#3d2c63]">El meu àlbum</span>
              <span className="text-sm font-bold text-[#7a6a9e]">
                {album.otkriveno} / {album.ukupno}
              </span>
            </div>

            <div className="flex gap-2 overflow-hidden">
              {poslednje.map((s) => (
                <div key={s.kljuc}
                     className="h-16 w-16 shrink-0 rounded-xl border-2 border-[#efe7ff] bg-white p-1 shadow-sm">
                  <img src={getWordIllustration(s.rec) || `/illustrations/${s.kljuc}.webp`}
                       alt="" draggable={false} className="h-full w-full select-none object-contain" />
                </div>
              ))}
              {/* Mesta koja tek treba osvojiti — isti znak pitanja kao u albumu. */}
              {Array.from({ length: Math.max(0, 7 - poslednje.length) }).map((_, i) => (
                <div key={`prazno-${i}`}
                     className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
                     style={{
                       background: "repeating-linear-gradient(135deg,#f1ecff 0px,#f1ecff 7px,#e7dffb 7px,#e7dffb 14px)",
                     }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M9.2 9a2.9 2.9 0 1 1 4 2.7c-.8.4-1.2 1-1.2 1.9v.5" stroke="#b3a3d8" />
                    <circle cx="12" cy="17.6" r="1.15" fill="#b3a3d8" />
                  </svg>
                </div>
              ))}
            </div>
          </Link>
        </motion.div>

        {/* ── 3. PUT KROZ TEME ── */}
        <h2 className="mb-2 mt-7 px-1 text-lg font-black text-[#3d2c63]">El camí</h2>

        <ol className="relative">
          {/* Linija puta — vijuga iza stanica. */}
          <span aria-hidden className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-[#e2d8f7]" />

          {stanje.map((t, i) => {
            const levo = i % 2 === 0;
            const naRedu = tekuca?.slug === t.slug;
            return (
              <li key={t.slug} className="relative py-2">
                <div className={`flex ${levo ? "justify-start" : "justify-end"}`}>
                  <motion.div
                    initial={{ opacity: 0, x: levo ? -18 : 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, type: "spring", stiffness: 200, damping: 22 }}
                    className="w-[46%]"
                  >
                    <Link
                      href={`/tema/${t.slug}`}
                      className="flex flex-col items-center gap-1 rounded-2xl bg-white p-2 shadow-[0_6px_16px_rgba(60,40,110,0.12)]"
                      style={naRedu ? { outline: `3px solid ${t.color}`, outlineOffset: 2 } : undefined}
                    >
                      <span className="relative">
                        {getWordIllustration(t.junak) && (
                          <img
                            src={getWordIllustration(t.junak)!}
                            alt=""
                            draggable={false}
                            className="h-16 w-16 select-none object-contain sm:h-20 sm:w-20"
                            style={{ filter: t.zapoceta ? undefined : "grayscale(1) opacity(0.45)" }}
                          />
                        )}
                        {t.zavrsena && (
                          <span
                            aria-hidden
                            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-white shadow"
                            style={{ backgroundColor: t.color }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                          </span>
                        )}
                      </span>
                      <span className="text-center text-sm font-black leading-tight" style={{ color: t.color }}>
                        {t.name}
                      </span>
                      <span className="h-1.5 w-full overflow-hidden rounded-full bg-[#eee8fb]">
                        <span className="block h-full rounded-full"
                              style={{ width: `${t.ukupno ? (t.gotovo / t.ukupno) * 100 : 0}%`, backgroundColor: t.color }} />
                      </span>
                      <span className="text-[11px] font-bold text-[#7a6a9e]">
                        {t.gotovo}/{t.ukupno}
                      </span>
                    </Link>
                  </motion.div>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
