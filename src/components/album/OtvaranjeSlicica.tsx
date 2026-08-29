"use client";

/**
 * SVEČANO OTVARANJE SLIČICA — kraj teme.
 *
 * ZAŠTO POSTOJI (28.08.2026, zahtev vlasnice)
 * „Kad završe temu, da im se otvore te sličice jedna po jedna, da budu srećni
 *  koliko su sličica dobili, a onda ostale sličice (za druge teme) su i dalje
 *  pod znakom pitanja."
 *
 * KAKO IZGLEDA
 * Sličice stoje u mreži, sve pod znakom pitanja. Onda se okreću JEDNA PO JEDNA,
 * kao karte — kartica se obrne oko svoje ose (`rotateY`), a s druge strane je
 * slika. Nije nasumično: ide redom, sleva nadesno, da dete može da prati.
 *
 * ZAŠTO OKRETANJE, A NE PRELIV
 * Kad bi se slika samo pojavila, dete ne bi videlo DA JE NEŠTO OTKRIVENO nego
 * da se strana učitala. Okretanje karte je pokret koji svako dete razume kao
 * „ovo se sad otvorilo za mene".
 *
 * ZVUK
 * Svaka sličica koja se otvori izgovori se glasom Montse — ali samo ako snimak
 * postoji, da se ne oglasi glas uređaja.
 *
 * Ko je tražio manje pokreta, dobija sve sličice otvorene odjednom, bez
 * okretanja.
 */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Slicica } from "@/data/album-slicice";
import { getWordIllustration } from "@/lib/illustrations";
import { speak, imaSnimak } from "@/lib/tts";

interface Props {
  slicice: Slicica[];
  bojaTeme: string;
  /** Poziva se kad se poslednja sličica otvori. */
  gotovo?: () => void;
}

/**
 * TEMPO OTKRIVANJA — prve idu polako, ostale ubrzavaju (28.08.2026).
 *
 * Tema „La casa" ima 50 sličica. Da se svaka otvara po 260 ms, otvaranje bi
 * trajalo trinaest sekundi i dete bi otišlo pre kraja. Zato prvih osam ide
 * sporo — toliko da se svaka vidi i čuje — a posle se ubrzava, pa ceo talas
 * prođe kao jedan pokret. Utisak „koliko sam ih dobio" ostaje, a čekanja nema.
 */
const RAZMAK_SPORO = 260;
const RAZMAK_BRZO = 70;
const SPORIH = 8;

export default function OtvaranjeSlicica({ slicice, bojaTeme, gotovo }: Props) {
  const manjePokreta = useReducedMotion();
  const [otvoreno, setOtvoreno] = useState(manjePokreta ? slicice.length : 0);

  useEffect(() => {
    if (manjePokreta) { gotovo?.(); return; }
    if (otvoreno >= slicice.length) { gotovo?.(); return; }
    const t = setTimeout(() => {
      const s = slicice[otvoreno];
      // Glasom se prate samo prve sličice — posle bi se reči preklapale.
      if (s && otvoreno < SPORIH && imaSnimak(s.rec)) speak(s.rec);
      setOtvoreno((n) => n + 1);
    }, otvoreno === 0 ? 500 : otvoreno < SPORIH ? RAZMAK_SPORO : RAZMAK_BRZO);
    return () => clearTimeout(t);
  }, [otvoreno, slicice, manjePokreta, gotovo]);

  return (
    <div className="w-full">
      {/* Kad sličica ima pedeset, mreža se skroluje umesto da izgura dugmad
          ispod ekrana. */}
      <div className="grid max-h-[46vh] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 sm:gap-3">
        {slicice.map((s, i) => (
          <Kartica
            key={s.kljuc}
            slicica={s}
            boja={bojaTeme}
            otvorena={i < otvoreno}
            mirno={!!manjePokreta}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-lg font-black text-white">
        {Math.min(otvoreno, slicice.length)} / {slicice.length} cromos nous
      </p>
    </div>
  );
}

function Kartica({
  slicica, boja, otvorena, mirno,
}: { slicica: Slicica; boja: string; otvorena: boolean; mirno: boolean }) {
  const izvor = getWordIllustration(slicica.rec) || `/illustrations/${slicica.kljuc}.webp`;

  return (
    <div className="aspect-square" style={{ perspective: 700 }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: otvorena ? 180 : 0, scale: otvorena ? 1 : 0.96 }}
        transition={mirno ? { duration: 0 } : { type: "spring", stiffness: 190, damping: 17 }}
      >
        {/* POLEĐINA — znak pitanja, nacrtan, bez emodžija */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl"
          style={{
            backfaceVisibility: "hidden",
            background: "repeating-linear-gradient(135deg,#efe3cc 0px,#efe3cc 7px,#e8d9bd 7px,#e8d9bd 14px)",
            boxShadow: "inset 0 2px 7px rgba(120,95,50,0.3)",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden fill="none" strokeWidth="2.6" strokeLinecap="round">
            <path d="M9.2 9a2.9 2.9 0 1 1 4 2.7c-.8.4-1.2 1-1.2 1.9v.5" stroke="#b09773" />
            <circle cx="12" cy="17.6" r="1.15" fill="#b09773" />
          </svg>
        </div>

        {/* LICE — sličica */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white p-1"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            border: `2px solid ${boja}33`,
            boxShadow: "0 3px 10px rgba(30,18,60,0.28)",
          }}
        >
          <img src={izvor} alt="" draggable={false} className="h-[70%] w-full select-none object-contain" />
          <span className="line-clamp-1 px-0.5 text-[10px] font-bold leading-tight text-[#5b4a2f]">
            {slicica.rec}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
