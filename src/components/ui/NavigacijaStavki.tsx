"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * STRELICE ZA KRETANJE KROZ REČI UNUTAR ZADATKA.
 *
 * ZAŠTO POSTOJI (17.08.2026, zahtev vlasnice)
 * „Gde imamo u zadatku više reči da popunjavaju i sklapaju, pa tamo gde piše
 * npr. 5/9 reči, da imaju strelice da mogu da idu nazad ili napred kroz te
 * reči."
 *
 * Do sada se kroz reči išlo SAMO napred i samo kad se reč reši. Dete koje je
 * htelo da se vrati i pogleda prethodnu reč nije imalo kako — jedini izlaz je
 * bio da napusti ceo zadatak, a time je (do popravke od istog dana) gubilo i
 * napredak.
 *
 * Strelice su namerno velike i razmaknute: dete od pet do osam godina
 * promašuje sitne mete, a ovo stoji odmah uz brojač koji ionako gleda.
 * Kad se dođe do kraja, strelica se ne krije nego posivi — da dete vidi da
 * dalje nema, umesto da traži dugme koje je nestalo.
 */
export default function NavigacijaStavki({
  idx,
  ukupno,
  naIdx,
}: {
  /** Redni broj tekuće stavke, od nule. */
  idx: number;
  ukupno: number;
  /** Pozива se sa novim rednim brojem. */
  naIdx: (novi: number) => void;
}) {
  if (ukupno <= 1) return null;
  const prviJe = idx <= 0;
  const zadnjiJe = idx >= ukupno - 1;

  return (
    /**
     * STRELICE RADE I U PREGLEDU ZAVRŠENOG ZADATKA (27.08.2026, prijava vlasnice).
     *
     * „Ako odem na zadnjoj strani proslave na pregledaj sve zadatke, strelica za
     *  listanje reči npr. u prvom zadatku ne radi."
     *
     * Tačno tako: u pregledu je ceo zadatak umotan u `pointer-events-none`, da
     * dete ne bi ponovo rešavalo nešto što je već rešilo. Ali to gasi SVE klikove
     * na zadatku, pa i one koji nisu rešavanje nego listanje. Dete koje hoće da
     * pogleda drugu reč ostane bez ijednog dugmeta koje radi.
     *
     * `pointer-events-auto` vraća klik samo ovim strelicama — pločice sa slovima
     * ostaju zaključane.
     */
    <div className="flex items-center justify-center gap-3 pointer-events-auto">
      <button
        onClick={() => !prviJe && naIdx(idx - 1)}
        disabled={prviJe}
        aria-label="Paraula anterior"
        className="w-11 h-11 flex items-center justify-center rounded-full bg-white border-2 border-gray-200 text-[var(--primary)] shadow-sm disabled:opacity-30 disabled:text-gray-300 active:scale-95 transition-all"
      >
        <ChevronLeft size={22} />
      </button>

      <span className="text-sm font-bold text-[var(--text-light)] min-w-[62px] text-center">
        {idx + 1} / {ukupno}
      </span>

      <button
        onClick={() => !zadnjiJe && naIdx(idx + 1)}
        disabled={zadnjiJe}
        aria-label="Paraula següent"
        className="w-11 h-11 flex items-center justify-center rounded-full bg-white border-2 border-gray-200 text-[var(--primary)] shadow-sm disabled:opacity-30 disabled:text-gray-300 active:scale-95 transition-all"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
