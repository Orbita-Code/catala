"use client";

/**
 * ALBUM SLIČICA — knjiga koja se lista, sa koricama i okretanjem strana.
 *
 * ZAŠTO POSTOJI (28.08.2026, zahtev vlasnice)
 * „Da se lista kao pravi album, sa okretanjem strana, kao ono pre kakvi su bili
 *  katalozi… i onda dete uvek može da lista svoje sličice. Ali baš bruka dobro
 *  mora da izgleda taj album, kao da ga je radio sam Cocomelon, da bude toliko
 *  profesionalan da izgleda svetski."
 *
 * ŠTA GA ČINI KNJIGOM, A NE SPISKOM
 *   • strana se OKREĆE oko leve ivice, u prostoru (`rotateY` sa perspektivom),
 *     i pri okretanju baca senku koja putuje — bez toga izgleda kao da slika
 *     klizi, a ne kao da se papir prevrće;
 *   • poleđina strane se vidi dok se okreće, i na njoj je ono što sledi;
 *   • hrbat u sredini ima tamniji prelaz, kao kod prave sveske;
 *   • papir nije čisto beo nego topao, sa jedva vidljivom teksturom.
 *
 * ZAŠTO NA TELEFONU NEMA DVE STRANE
 * Na 390 px širine dve strane bi dale sličice od dva santimetra — dete ih ne bi
 * ni videlo ni pogodilo prstom. Zato je na uskom ekranu jedna strana preko cele
 * širine, a na širokom pravi otvoren album sa dve strane.
 *
 * ZNAK PITANJA UMESTO SLIČICE
 * Neotkrivena sličica NIJE prazno mesto nego kartica sa znakom pitanja i imenom
 * teme — dete vidi da tu nešto postoji i da može da ga zaradi. Znak pitanja je
 * nacrtan (SVG), ne emodži.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SLICICE, type Slicica } from "@/data/album-slicice";
import { themes } from "@/data/themes";
import { getWordIllustration } from "@/lib/illustrations";
import { speak, imaSnimak } from "@/lib/tts";
import { otkriveneTeme } from "@/lib/album";

interface Strana {
  tema: string;
  naslovTeme: string;
  boja: string;
  /** Koji je ovo list te teme (1/3, 2/3…) — piše u podnožju. */
  list: number;
  ukupnoListova: number;
  slicice: Slicica[];
  otkrivena: boolean;
}

/** Koliko sličica staje na jednu stranu. Devet je taman: 3×3, kao u albumu. */
const PO_STRANI = 9;

/** Koliko traje okret lista. Isto vreme koristi i animacija i čekanje. */
const OKRET_MS = 620;

export default function Album({ pocetnaTema }: { pocetnaTema?: string }) {
  const [otkrivene, setOtkrivene] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [okrece, setOkrece] = useState<null | "napred" | "nazad">(null);
  const [dvostrana, setDvostrana] = useState(false);
  const zauzet = useRef(false);

  useEffect(() => setOtkrivene(otkriveneTeme()), []);

  useEffect(() => {
    const meri = () => setDvostrana(window.innerWidth >= 900);
    meri();
    window.addEventListener("resize", meri);
    return () => window.removeEventListener("resize", meri);
  }, []);

  /** Sve strane albuma, redom kao teme u igri. */
  const strane = useMemo<Strana[]>(() => {
    const sve: Strana[] = [];
    for (const t of themes) {
      const s = SLICICE[t.slug] || [];
      if (!s.length) continue;
      const listova = Math.ceil(s.length / PO_STRANI);
      for (let i = 0; i < listova; i++) {
        sve.push({
          tema: t.slug,
          naslovTeme: t.name,
          boja: t.color,
          list: i + 1,
          ukupnoListova: listova,
          slicice: s.slice(i * PO_STRANI, (i + 1) * PO_STRANI),
          otkrivena: otkrivene.includes(t.slug),
        });
      }
    }
    return sve;
  }, [otkrivene]);

  // Kad se album otvori zbog jedne teme, otvori se baš na njoj.
  useEffect(() => {
    if (!pocetnaTema || !strane.length) return;
    const n = strane.findIndex((s) => s.tema === pocetnaTema);
    if (n >= 0) setIdx(dvostrana ? n - (n % 2) : n);
  }, [pocetnaTema, strane, dvostrana]);

  const korak = dvostrana ? 2 : 1;

  /**
   * SLIKE SLEDEĆE STRANE SE UČITAVAJU UNAPRED (28.08.2026).
   *
   * Bez ovoga se na kraju okreta na tren vide PRAZNE bele kartice — slika
   * stigne tek pošto se strana već okrenula. Dete to vidi kao treptaj i kao da
   * je nešto nestalo. Zato se slike susednih strana traže unapred, dok dete
   * gleda tekuću: kad okrene list, one su već tu.
   */
  useEffect(() => {
    for (const n of [idx + korak, idx + korak + 1, idx - korak, idx - korak + 1]) {
      const st = strane[n];
      if (!st) continue;
      for (const s of st.slicice) {
        const i = new Image();
        i.src = getWordIllustration(s.rec) || `/illustrations/${s.kljuc}.webp`;
      }
    }
  }, [idx, korak, strane]);
  const poslednji = Math.max(0, strane.length - korak);

  const okreni = useCallback((smer: "napred" | "nazad") => {
    if (zauzet.current) return;
    const novi = smer === "napred" ? idx + korak : idx - korak;
    if (novi < 0 || novi > poslednji) return;
    zauzet.current = true;
    setOkrece(smer);
    window.setTimeout(() => {
      setIdx(novi);
      setOkrece(null);
      zauzet.current = false;
    }, OKRET_MS);
  }, [idx, korak, poslednji]);

  useEffect(() => {
    const nataster = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") okreni("napred");
      if (e.key === "ArrowLeft") okreni("nazad");
    };
    window.addEventListener("keydown", nataster);
    return () => window.removeEventListener("keydown", nataster);
  }, [okreni]);

  if (!strane.length) return null;

  const leva = strane[idx];
  const desna = dvostrana ? strane[idx + 1] : undefined;
  /**
   * Šta stoji na POLEĐINI lista koji se okreće: kad se ide napred, to je prva
   * strana sledećeg otvorenog albuma; kad se ide nazad, poslednja strana
   * prethodnog. Bez ovoga list nema drugu stranu i nestaje usred okreta.
   */
  const poledjina = okrece === "napred"
    ? strane[idx + korak]
    : strane[Math.max(0, idx - korak) + (dvostrana ? 1 : 0)];

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        className="relative w-full"
        style={{ perspective: "2200px", maxWidth: dvostrana ? 980 : 460 }}
      >
        <div className="flex overflow-hidden rounded-[22px] shadow-[0_26px_60px_rgba(30,18,60,0.45)]">
          <StranaAlbuma strana={leva} strana2={false} />
          {dvostrana && desna && <StranaAlbuma strana={desna} strana2 />}
        </div>

        {/* HRBAT — tamniji prelaz u sredini, kao kod prave sveske. */}
        {dvostrana && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2"
            style={{
              background:
                "linear-gradient(90deg,rgba(60,40,20,0) 0%,rgba(60,40,20,0.16) 42%,rgba(60,40,20,0.26) 50%,rgba(60,40,20,0.16) 58%,rgba(60,40,20,0) 100%)",
            }}
          />
        )}

        {/**
          * LIST KOJI SE OKREĆE (28.08.2026, druga prijava vlasnice).
          *
          * „Album ti i dalje daje bag kod listanja… kao da se strane okreću
          *  ispod samog albuma."
          *
          * Prvo rešenje je koristilo `backface-visibility` — trik kojim
          * pregledač sam odlučuje koje se lice vidi. On zavisi od toga kako
          * pregledač složi trodimenzionalni prostor, i kod nas je list na pola
          * puta prosto NESTAJAO: prednje lice se sakrije, a zadnje se ne
          * pojavi. Zato je izgledalo kao da propada kroz album.
          *
          * Sada se ništa ne prepušta pregledaču: oba lica su uvek nacrtana, a
          * MI kažemo koje se vidi — prednje bledi tačno na polovini okreta,
          * zadnje se tada pojavljuje. Ishod je isti kao kod pravog papira, ali
          * ne zavisi ni od jednog trika.
          */}
        <AnimatePresence>
          {okrece && (
            <motion.div
              key={`list-${idx}-${okrece}`}
              aria-hidden
              className="absolute inset-y-0"
              style={{
                width: dvostrana ? "50%" : "100%",
                left: okrece === "napred" ? (dvostrana ? "50%" : 0) : 0,
                transformOrigin: okrece === "napred" ? "left center" : "right center",
                zIndex: 40,
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: okrece === "napred" ? -180 : 180 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: OKRET_MS / 1000, ease: [0.37, 0, 0.28, 1] }}
            >
              {/* LICE — odakle se kreće; nestaje tačno na polovini okreta */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-[22px]"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: OKRET_MS / 1000, times: [0, 0.49, 0.5, 1] }}
              >
                <StranaAlbuma
                  strana={okrece === "napred" ? (desna || leva) : leva}
                  strana2={okrece === "napred"}
                />
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  transition={{ duration: OKRET_MS / 1000 }}
                  style={{ background: "linear-gradient(90deg,rgba(40,25,10,0),rgba(40,25,10,0.5))" }}
                />
              </motion.div>

              {/* POLEĐINA — kuda se stiže; okrenuta, pojavljuje se na polovini */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-[22px]"
                style={{ transform: "rotateY(180deg)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 1] }}
                transition={{ duration: OKRET_MS / 1000, times: [0, 0.49, 0.5, 1] }}
              >
                {poledjina && <StranaAlbuma strana={poledjina} strana2={okrece !== "napred"} />}
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: OKRET_MS / 1000 }}
                  style={{ background: "linear-gradient(90deg,rgba(40,25,10,0.5),rgba(40,25,10,0))" }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* KRETANJE KROZ ALBUM */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => okreni("nazad")}
          disabled={idx <= 0}
          aria-label="Pàgina anterior"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#4a3670] shadow-md transition disabled:opacity-30 active:scale-95"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>

        <span className="min-w-[92px] text-center text-sm font-bold text-white/85">
          {Math.floor(idx / korak) + 1} / {Math.ceil(strane.length / korak)}
        </span>

        <button
          type="button"
          onClick={() => okreni("napred")}
          disabled={idx >= poslednji}
          aria-label="Pàgina següent"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#4a3670] shadow-md transition disabled:opacity-30 active:scale-95"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}

/** Jedna strana albuma: zaglavlje teme, mreža 3×3 i podnožje. */
function StranaAlbuma({ strana, strana2 }: { strana: Strana; strana2: boolean }) {
  return (
    <div
      className="relative flex min-h-[520px] w-full flex-col px-4 py-4 sm:px-6"
      style={{
        background:
          "linear-gradient(158deg,#fffdf7 0%,#fdf6e6 46%,#f7ecd8 100%)",
        boxShadow: strana2
          ? "inset 14px 0 22px -18px rgba(80,55,20,0.55)"
          : "inset -14px 0 22px -18px rgba(80,55,20,0.55)",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: strana.boja }} />
        <h3 className="text-base font-black tracking-tight" style={{ color: strana.boja }}>
          {strana.naslovTeme}
        </h3>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-2 sm:gap-3">
        {strana.slicice.map((s) => (
          <SlicicaKartica key={s.kljuc} slicica={s} otkrivena={strana.otkrivena} boja={strana.boja} />
        ))}
        {/* Prazna mesta na poslednjem listu da mreža ne „skoči" u drugi raspored. */}
        {Array.from({ length: PO_STRANI - strana.slicice.length }).map((_, i) => (
          <div key={`prazno-${i}`} />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#a08a63]">
        <span>{strana.otkrivena ? "Aconseguit" : "Encara per descobrir"}</span>
        <span>{strana.list} / {strana.ukupnoListova}</span>
      </div>
    </div>
  );
}

function SlicicaKartica({ slicica, otkrivena, boja }: { slicica: Slicica; otkrivena: boolean; boja: string }) {
  const izvor = getWordIllustration(slicica.rec) || `/illustrations/${slicica.kljuc}.webp`;

  if (!otkrivena) {
    return (
      <div
        className="flex aspect-square flex-col items-center justify-center rounded-xl"
        style={{
          background: "repeating-linear-gradient(135deg,#efe3cc 0px,#efe3cc 7px,#e8d9bd 7px,#e8d9bd 14px)",
          boxShadow: "inset 0 2px 7px rgba(120,95,50,0.28)",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden
             fill="none" strokeWidth="2.6" strokeLinecap="round">
          <path d="M9.2 9a2.9 2.9 0 1 1 4 2.7c-.8.4-1.2 1-1.2 1.9v.5" stroke="#b09773" />
          <circle cx="12" cy="17.6" r="1.15" fill="#b09773" stroke="none" />
        </svg>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => { if (imaSnimak(slicica.rec)) speak(slicica.rec); }}
      className="group flex aspect-square flex-col items-center justify-center rounded-xl bg-white p-1 shadow-[0_2px_6px_rgba(120,95,50,0.22)] transition active:scale-95"
      style={{ border: `2px solid ${boja}22` }}
      aria-label={slicica.rec}
    >
      <img src={izvor} alt="" draggable={false}
           className="h-[68%] w-full select-none object-contain" />
      <span className="mt-0.5 line-clamp-1 px-0.5 text-[10px] font-bold leading-tight text-[#5b4a2f] sm:text-[11px]">
        {slicica.rec}
      </span>
    </button>
  );
}
