"use client";

/**
 * VELIKO SLAVLJE — strana koja se otvara kad dete završi SVE teme.
 *
 * ZAŠTO POSTOJI (28.08.2026, zahtev vlasnice)
 * „Treba mi posebna strana slavlja, ali toliko profesionalno odrađena, kao da
 *  je sam Apple radio ili neka najpoznatija i najbolja app za igrice. Slavlje
 *  na kraju posle svih rešenih tema mora da bude veličanstveno, možda čak i da
 *  ubacujemo slike koje su se pojavljivale u igrici, npr policajac, Albert,
 *  mare, pare, conill, flamenc, familia, hot air baloon — ali kada bi oni
 *  ‚oživeli‘ to bi tek bilo posebna stvar. Napravi stranu da ne bude jeftina,
 *  nikako emodži i slično, baš kao da je app radio Cocomelon ili Duolingo."
 *
 * KAKO JE „OŽIVLJAVANJE" URAĐENO
 * Nijedan lik ne stoji mirno, ali se ni ne trza. Svaki diše (sasvim malo raste
 * i splašnjava) i lagano se ljulja, i to SVAKI SA SVOJIM RITMOM — kad bi se
 * pomerali u isti mah, oko bi videlo mašinu, a ne društvo. Ritam i kašnjenje
 * izvedeni su iz imena lika, pa su uvek isti (bez `Math.random()`, koji bi na
 * svakom učitavanju pomerio scenu i pravio nemiran utisak).
 *
 * Ulaze redom, odozdo, kao na pozornicu — jedan po jedan, sa oprugom. Kad dete
 * dodirne lika, on poskoči i Montse izgovori njegovo ime; izgovaraju se SAMO
 * reči koje imaju snimak (v. `imaSnimak`), da se ne oglasi glas uređaja.
 *
 * ZAŠTO NEMA NIJEDNOG EMODŽIJA
 * Emodži izgleda drugačije na svakom uređaju i uvek se vidi da je „zalepljen".
 * Sve što ovde svetli — medalja, lovorike, zvezde, sunce, oblaci, brda —
 * nacrtano je kao SVG ili čist CSS, pa je oštro na svakom ekranu i uklapa se
 * sa ilustracijama igre.
 *
 * PRISTUPAČNOST
 * Ko je u postavkama uređaja tražio manje pokreta (`prefers-reduced-motion`),
 * dobija istu scenu — bez lebdenja i bez balona koji prelazi nebo. Sadržaj se
 * ne gubi, samo miruje.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { themes } from "@/data/themes";
import { getScoringTaskCount, getCompletedScoringCount } from "@/data/task-data";
import { getProgress } from "@/lib/progress";
import { getTotalXP } from "@/lib/xp";
import { getWordIllustration } from "@/lib/illustrations";
import { speak, imaSnimak } from "@/lib/tts";
import { bezBelePozadine } from "@/lib/bez-pozadine";

/**
 * Ko izlazi na pozornicu. Redosled je namerno izmešan po vrsti (ljudi, životinje,
 * porodica, balon) da red ne izgleda kao spisak nego kao društvo.
 * `ime` je ono što Montse izgovori; `kljuc` je slika iz igre.
 */
const LIKOVI: { kljuc: string; ime: string }[] = [
  { kljuc: "policia", ime: "policia" },
  { kljuc: "conill", ime: "conill" },
  { kljuc: "mare", ime: "mare" },
  { kljuc: "flamenc", ime: "flamenc" },
  { kljuc: "pare", ime: "pare" },
  { kljuc: "papallona", ime: "papallona" },
  { kljuc: "metge", ime: "metge" },
  { kljuc: "gat", ime: "gat" },
  { kljuc: "avi", ime: "avi" },
  { kljuc: "gos", ime: "gos" },
  { kljuc: "germana", ime: "germana" },
  { kljuc: "cavall", ime: "cavall" },
];

/** Stalan „slučajan" broj iz imena — ista scena pri svakom otvaranju. */
function seme(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000;
  return h / 1000;
}

/** Broj koji se penje do cilja — brže na početku, sporije pri kraju. */
function useBrojac(cilj: number, radi: boolean, trajanje = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!radi) { setN(cilj); return; }
    let poništeno = false;
    const pocetak = performance.now();
    const korak = (t: number) => {
      if (poništeno) return;
      const p = Math.min(1, (t - pocetak) / trajanje);
      setN(Math.round(cilj * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(korak);
    };
    requestAnimationFrame(korak);
    return () => { poništeno = true; };
  }, [cilj, radi, trajanje]);
  return n;
}

export default function GranFinal() {
  const manjePokreta = useReducedMotion();
  const zivo = !manjePokreta;
  const [spremno, setSpremno] = useState(false);
  const [poskocio, setPoskocio] = useState<string | null>(null);
  const izgovoreno = useRef(false);

  /**
   * PRAVE BROJKE — I SAMO ONE KOJE APLIKACIJA STVARNO VODI (28.08.2026).
   *
   * Prijava vlasnice: „nije mi jasno zašto piše 0 estrellas."
   * Bila je u pravu, i greška je bila moja: prikazivao sam polje `stars` iz
   * napretka, a to polje NIKO NIKAD NE UPISUJE — postoji u zapisu, postavi se
   * na nulu i tu ostane zauvek. Broj koji aplikacija ne vodi ne sme da stoji na
   * ekranu; to je ista greška kao objaviti izmišljen podatak.
   *
   * Umesto zvezdica stoje BODOVI (XP), koje igra stvarno računa posle svakog
   * zadatka i pokazuje u zaglavlju — pa se broj na ovoj strani poklapa sa onim
   * što je dete videlo dok je igralo.
   */
  const [brojke, setBrojke] = useState({ teme: 0, zadaci: 0, bodovi: 0 });

  useEffect(() => {
    const napredak = getProgress();
    let teme = 0, zadaci = 0;
    for (const t of themes) {
      const p = napredak[t.slug];
      if (!p) continue;
      const ukupno = getScoringTaskCount(t.slug);
      const gotovo = getCompletedScoringCount(t.slug, p.completedTasks || []);
      zadaci += gotovo;
      if (ukupno > 0 && gotovo >= ukupno) teme += 1;
    }
    setBrojke({ teme, zadaci, bodovi: getTotalXP() });
    setSpremno(true);
  }, []);

  // Čestitka se izgovori jednom, i to tek kad se scena složi — da ne upadne
  // preko zvuka prethodne strane.
  useEffect(() => {
    if (!spremno || izgovoreno.current) return;
    izgovoreno.current = true;
    const t = setTimeout(() => { if (imaSnimak("Felicitats!")) speak("Felicitats!"); }, 900);
    return () => clearTimeout(t);
  }, [spremno]);

  const brojTema = useBrojac(brojke.teme, spremno);
  const brojZadataka = useBrojac(brojke.zadaci, spremno);
  const brojBodova = useBrojac(brojke.bodovi, spremno);

  const naslov = "Ho has aconseguit!";
  const slova = useMemo(() => naslov.split(""), [naslov]);

  const likovi = useMemo(
    () => LIKOVI.map((l) => ({ ...l, src: getWordIllustration(l.kljuc) })).filter((l) => l.src),
    []
  );

  /**
   * LIKOVI STOJE U PRIZORU, NE NA NJEMU (28.08.2026).
   *
   * Sve slike u igri nacrtane su na beloj podlozi. Na tamnom nebu bi svaka
   * dobila beo pravougaonik oko sebe i ceo prizor bi izgledao kao nalepnice.
   * Zato se pozadina skida u pregledaču (v. `bezBelePozadine`), a dok se to ne
   * završi stoji izvorna slika — nikad prazno mesto.
   */
  const [oslobodjene, setOslobodjene] = useState<Record<string, string>>({});
  const [balon, setBalon] = useState<string | null>(null);
  useEffect(() => {
    let vazi = true;
    (async () => {
      // Balon prvi — on je najviše u oku, leti preko celog neba.
      const izvorBalona = getWordIllustration("globus");
      if (izvorBalona) {
        const b = await bezBelePozadine(izvorBalona);
        if (!vazi) return;
        setBalon(b);
      }
      for (const l of likovi) {
        const nova = await bezBelePozadine(l.src!);
        if (!vazi) return;
        setOslobodjene((prev) => ({ ...prev, [l.kljuc]: nova }));
      }
    })();
    return () => { vazi = false; };
  }, [likovi]);

  const dodirni = (l: { kljuc: string; ime: string }) => {
    setPoskocio(l.kljuc);
    if (imaSnimak(l.ime)) speak(l.ime);
    setTimeout(() => setPoskocio((k) => (k === l.kljuc ? null : k)), 700);
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#0d1b3e]">
      {/* ── NEBO: zora koja se diže. Tri sloja boje, bez ijedne slike. ── */}
      <div
        aria-hidden
        className="fixed inset-0"
        style={{
          background:
            "linear-gradient(180deg,#0d1b3e 0%,#26307a 32%,#7a5ba8 58%,#e58a6b 82%,#f6c78a 100%)",
        }}
      />
      {/* Sunce iza brda — samo svetlost, bez oblika koji bi delovao nalepljeno. */}
      <motion.div
        aria-hidden
        className="fixed left-1/2 -translate-x-1/2"
        style={{
          bottom: "12%",
          width: "min(70vw,720px)",
          height: "min(70vw,720px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(255,214,150,0.95) 0%,rgba(255,186,120,0.45) 38%,rgba(255,170,110,0) 70%)",
          filter: "blur(2px)",
        }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: zivo ? 2.2 : 0, ease: "easeOut" }}
      />

      {/* ── SVETLE TAČKICE umesto konfeta. Konfete izgledaju jeftino; ovo je
             prašina u svetlu zore i ne otima pažnju od likova. ── */}
      {zivo && (
        <div aria-hidden className="fixed inset-0">
          {Array.from({ length: 26 }).map((_, i) => {
            const s = seme(`tackica-${i}`);
            const s2 = seme(`tackica2-${i}`);
            return (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${(s * 100).toFixed(2)}%`,
                  top: `${(s2 * 78).toFixed(2)}%`,
                  width: 3 + Math.round(s2 * 5),
                  height: 3 + Math.round(s2 * 5),
                  filter: "blur(0.4px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.75, 0], y: [0, -26 - s * 40, 0] }}
                transition={{
                  duration: 6 + s * 5,
                  repeat: Infinity,
                  delay: s2 * 6,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── BRDA: tri sloja, svetlija ka nazad, da scena ima dubinu. ── */}
      <svg aria-hidden viewBox="0 0 1440 320" preserveAspectRatio="none"
           className="fixed bottom-0 left-0 w-full" style={{ height: "34vh" }}>
        <path d="M0,190 C210,120 340,235 570,196 C790,158 940,86 1150,140 C1290,176 1380,166 1440,150 L1440,320 L0,320 Z"
              fill="#6b4f8f" opacity="0.55" />
        <path d="M0,232 C230,182 400,262 620,238 C860,212 1010,158 1230,206 C1330,228 1390,232 1440,226 L1440,320 L0,320 Z"
              fill="#4a3670" opacity="0.8" />
        <path d="M0,270 C260,238 430,296 700,276 C960,257 1120,224 1440,262 L1440,320 L0,320 Z"
              fill="#33255a" />
      </svg>

      {/* ── BALON PREKO NEBA. Diže se polako i blago se njiše, kao pravi. ── */}
      {balon && zivo && (
        <motion.img
          aria-hidden
          src={balon}
          alt=""
          className="fixed select-none pointer-events-none"
          style={{ width: "clamp(70px,9vw,130px)", left: "6%" }}
          /**
           * BALON NE NESTAJE (28.08.2026, prijava vlasnice):
           * „ne sviđa mi se što hot air baloon nestaje iz čista mira i onda se
           *  opet pojavljuje odozdo, trebalo bi stalno da leti po ekranu."
           *
           * Bio je postavljen da se penje od dna do vrha pa da krug krene
           * ispočetka — a to znači da svakih pola minuta ispari pred detetom.
           * Sada plovi po nebu u zatvorenom krugu: ide levo-desno i gore-dole,
           * uvek vidljiv, i vraća se tačno tamo odakle je pošao, pa se prelaz
           * ne primeti.
           */
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            left: ["6%", "34%", "62%", "84%", "58%", "26%", "6%"],
            bottom: ["36%", "58%", "44%", "66%", "40%", "60%", "36%"],
            rotate: [-3, 2, -2, 3, -2, 2, -3],
          }}
          transition={{
            opacity: { duration: 1.6, ease: "easeOut" },
            left: { duration: 72, repeat: Infinity, ease: "easeInOut", times: [0, 0.17, 0.34, 0.5, 0.67, 0.84, 1] },
            bottom: { duration: 72, repeat: Infinity, ease: "easeInOut", times: [0, 0.17, 0.34, 0.5, 0.67, 0.84, 1] },
            rotate: { duration: 72, repeat: Infinity, ease: "easeInOut", times: [0, 0.17, 0.34, 0.5, 0.67, 0.84, 1] },
          }}
        />
      )}

      {/* ── SADRŽAJ ── */}
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-between gap-4 px-5 py-6 sm:py-8">
        <div className="flex w-full max-w-3xl flex-col items-center">
          {/* MEDALJA — čist SVG: lovorike, traka, disk i prelaz svetla preko njega. */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.15 }}
            className="relative"
          >
            <motion.div
              animate={zivo ? { y: [0, -7, 0] } : undefined}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="132" height="150" viewBox="0 0 132 150" role="img"
                   aria-label="Medalla per haver acabat tots els temes">
                <defs>
                  <linearGradient id="zlato" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFE9A8" />
                    <stop offset="45%" stopColor="#F5C14E" />
                    <stop offset="100%" stopColor="#C98A21" />
                  </linearGradient>
                  <linearGradient id="traka" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F0645F" />
                    <stop offset="100%" stopColor="#C23C46" />
                  </linearGradient>
                  <clipPath id="disk"><circle cx="66" cy="94" r="43" /></clipPath>
                </defs>
                <path d="M40 6 L58 66 L44 74 L26 16 Z" fill="url(#traka)" />
                <path d="M92 6 L74 66 L88 74 L106 16 Z" fill="url(#traka)" />
                <circle cx="66" cy="94" r="47" fill="#8a5c12" opacity="0.35" />
                <circle cx="66" cy="94" r="43" fill="url(#zlato)" />
                <circle cx="66" cy="94" r="34" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
                {/* lovorike */}
                <path d="M46 108 C38 98 39 84 47 76" fill="none" stroke="#8B6A16" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
                <path d="M86 108 C94 98 93 84 85 76" fill="none" stroke="#8B6A16" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
                {/* zvezda u sredini — nacrtana, ne emodži */}
                <path d="M66 72 L73.2 87.4 L90 89.6 L77.8 101 L81 117.6 L66 109.6 L51 117.6 L54.2 101 L42 89.6 L58.8 87.4 Z"
                      fill="#fff" fillOpacity="0.95" />
                {zivo && (
                  <g clipPath="url(#disk)">
                    <motion.rect
                      x="-70" y="40" width="46" height="110" fill="#fff" fillOpacity="0.4"
                      transform="rotate(18 0 0)"
                      animate={{ x: [-70, 150] }}
                      transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 3.4, ease: "easeInOut" }}
                    />
                  </g>
                )}
              </svg>
            </motion.div>
          </motion.div>

          {/* NASLOV — slovo po slovo, kao da ga neko izgovara. */}
          <h1 className="mt-3 text-center font-black tracking-tight text-white"
              style={{ fontSize: "clamp(2rem,7vw,4rem)", textShadow: "0 4px 26px rgba(0,0,0,0.35)" }}>
            {slova.map((z, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: 26, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.035, type: "spring", stiffness: 320, damping: 22 }}
              >
                {z === " " ? " " : z}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-2 max-w-md text-center text-white/85"
            style={{ fontSize: "clamp(1rem,2.4vw,1.25rem)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Has acabat tots els temes. Ara ja parles català amb els teus amics.
          </motion.p>

          {/* BROJKE — prave, iz napretka; penju se do svog broja. */}
          <div className="mt-5 grid w-full max-w-lg grid-cols-3 gap-3">
            {[
              { broj: brojTema, natpis: "temes" },
              { broj: brojZadataka, natpis: "activitats" },
              { broj: brojBodova, natpis: "punts" },
            ].map((k, i) => (
              <motion.div
                key={k.natpis}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.25 + i * 0.12, type: "spring", stiffness: 200, damping: 20 }}
                className="rounded-2xl border border-white/20 bg-white/12 px-3 py-4 text-center backdrop-blur-md"
              >
                <div className="font-black text-white" style={{ fontSize: "clamp(1.6rem,5vw,2.4rem)" }}>
                  {k.broj}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/70">{k.natpis}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── DRUŠTVO NA POZORNICI ── */}
        <div className="w-full max-w-4xl">
          <div className="flex flex-wrap items-end justify-center gap-x-1 gap-y-4 sm:gap-x-2">
            {likovi.map((l, i) => {
              const s = seme(l.kljuc);
              return (
                <motion.button
                  key={l.kljuc}
                  type="button"
                  onClick={() => dodirni(l)}
                  aria-label={l.ime}
                  className="relative rounded-2xl p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  style={{ width: "clamp(74px,12vw,132px)", minWidth: 44, minHeight: 44 }}
                  initial={{ y: 90, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 1.35 + i * 0.09, type: "spring", stiffness: 220, damping: 16 }}
                >
                  {/* Senka na tlu — bez nje lik lebdi i odaje da je zalepljen. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 bottom-1 -translate-x-1/2 rounded-[50%]"
                    style={{
                      width: "62%",
                      height: "9%",
                      background: "radial-gradient(50% 50%,rgba(20,10,40,0.5) 0%,rgba(20,10,40,0) 72%)",
                      filter: "blur(1px)",
                    }}
                  />
                  <motion.img
                    src={oslobodjene[l.kljuc] || l.src!}
                    alt=""
                    draggable={false}
                    className="relative w-full select-none"
                    style={{ filter: "drop-shadow(0 12px 16px rgba(20,10,40,0.45))" }}
                    animate={
                      poskocio === l.kljuc
                        ? { y: [0, -22, 0], scale: [1, 1.12, 1], rotate: [0, -4, 3, 0] }
                        : zivo
                          ? { y: [0, -5 - s * 4, 0], scale: [1, 1.03, 1], rotate: [-1.4, 1.4, -1.4] }
                          : undefined
                    }
                    transition={
                      poskocio === l.kljuc
                        ? { duration: 0.62, ease: "easeOut" }
                        : { duration: 3 + s * 2.2, repeat: Infinity, ease: "easeInOut", delay: s * 1.6 }
                    }
                  />
                </motion.button>
              );
            })}
          </div>

          <motion.p
            className="mt-5 text-center text-sm text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.8 }}
          >
            Toca els amics i escolta com es diuen.
          </motion.p>
        </div>

        {/* ── IZLAZ ── */}
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
        >
          <Link
            href="/"
            className="flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-white px-6 text-lg font-black text-[#33255a] shadow-[0_10px_30px_rgba(0,0,0,0.28)] active:scale-[0.98] transition-transform"
          >
            Torna a l&apos;inici
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
