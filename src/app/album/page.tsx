"use client";

/**
 * STRANA ALBUMA (28.08.2026, zahtev vlasnice).
 *
 * „I onda imamo i pristup tom albumu… dete uvek može da lista svoje sličice."
 *
 * Album je nagrada, pa i strana izgleda kao nagrada: tamna topla podloga na
 * kojoj knjiga „stoji", brojač koliko je sličica skupljeno, i put nazad.
 * Otvara se i sa `?tema=<slug>` — tada odmah stane na tu temu, što koristi
 * svečano otvaranje na kraju teme.
 */

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Album from "@/components/album/Album";
import { brojSlicica } from "@/lib/album";

function Sadrzaj() {
  const parametri = useSearchParams();
  const tema = parametri.get("tema") || undefined;
  const [broj, setBroj] = useState({ otkriveno: 0, ukupno: 0 });

  useEffect(() => setBroj(brojSlicica()), []);

  const postotak = broj.ukupno ? Math.round((broj.otkriveno / broj.ukupno) * 100) : 0;

  return (
    <main className="min-h-dvh px-4 py-5"
          style={{ background: "linear-gradient(180deg,#2b1f4a 0%,#3d2c63 45%,#59406f 100%)" }}>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5">
        <header className="flex w-full items-center gap-3">
          <Link href="/" aria-label="Torna a l'inici"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-black text-white sm:text-2xl">El meu àlbum</h1>
            <p className="text-sm text-white/70">
              {broj.otkriveno} de {broj.ukupno} cromos
            </p>
          </div>
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white/25 text-sm font-black text-white sm:flex">
            {postotak}%
          </div>
        </header>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-gradient-to-r from-[#f5c14e] to-[#f0645f]"
               style={{ width: `${postotak}%` }} />
        </div>

        <Album pocetnaTema={tema} />
      </div>
    </main>
  );
}

export default function StranaAlbuma() {
  return (
    <Suspense fallback={null}>
      <Sadrzaj />
    </Suspense>
  );
}
