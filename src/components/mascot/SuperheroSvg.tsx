"use client";

import { motion, type Transition } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { daLiGovori, pretplatiSeNaGovor } from "@/lib/tts";
import type { MascotCharacter } from "@/lib/mascot";

/**
 * ⚠️ TRENUTNO SE NE KORISTI — stoji spreman za sledeći korak.
 *
 * Ovaj crtež je 03.08.2026. nakratko bio maskota uz zadatke i sve je radilo:
 * treptaj, pokret usta uz izgovaranje, dizanje ruku. Vraćene su gotove 3D
 * ilustracije jer ravan vektor pored 363 mekane 3D slike izgleda kao da su iz
 * dve različite aplikacije — ujednačen izgled je pretegao nad pokretom.
 *
 * ČEMU SLUŽI DALJE: kad se isti 3D lik izvuče iz ChatGPT-a U DELOVIMA (telo,
 * glava, ruka gore, ruka dole, zatvorene oči, otvorena usta), ovde je već
 * napisana sva logika koja te delove pomera — treptaj na 3–6 s, usta koja prate
 * govor, uglovi ruku po pozi. Tada se samo `<path>`/`<ellipse>` zamene sa
 * `<image>` i dobija se lik koji je i lep i živ. NE BRISATI.
 *
 * MASKOTA KAO CRTEŽ U SLOJEVIMA (03.08.2026)
 *
 * Zašto ovako, a ne kao gotova slika: gotova slika je jedan komad — kod može
 * samo da je zameni drugom ili da pomera CELU sliku. Zato su likovi izgledali
 * kao nalepnice koje se klize: oči im se nisu micale, usta se nisu otvarala,
 * ruka se nije dizala. Vlasnica je to odmah primetila („vidi se da se pomera
 * slika, a ne oni").
 *
 * Ovde je lik rasklopljen na delove — glava, oči, kapci, obrve, usta, dve ruke,
 * plašt — pa svaki deo ima svoj pokret:
 *   • kapci se spuštaju na 0,14 s svakih 3–6 s → treptaj
 *   • usta se otvaraju i zatvaraju DOK aplikacija izgovara reč (v. `lib/tts.ts`)
 *   • ruke se dižu u vis kad dete pogodi
 *   • plašt se talasa stalno, da lik izgleda kao da lebdi
 *
 * Sve je čist SVG i CSS pokret — nema nove slike za skidanje, radi i offline,
 * i menja se u kodu, ne u ChatGPT-u.
 */

export type Poza =
  | "mirno"    // lebdi, diše
  | "navija"   // obe ruke u vis — tačan odgovor, niska tačnih, kraj teme
  | "stit"     // ruka napred sa štitom — greška („čuvam te, probaj opet")
  | "maha"     // jedna ruka maše — dete duže ne dira ekran
  | "pita";    // prst uz bradu — nudi savet

interface Props {
  character: MascotCharacter;
  poza: Poza;
  /** Veličina u pikselima (crtež je kvadratan) */
  size: number;
  /** Poštuj sistemsku postavku „manje pokreta" */
  smanjenPokret?: boolean;
}

/** Boje po liku — sve ostalo je zajedničko, pa se lik menja samo paletom i kosom */
const PALETA = {
  devojcica: {
    koza: "#FBD3B0",
    kozaSenka: "#EDBB93",
    kosa: "#6B3E26",
    kosaSvetlo: "#8A5433",
    odelo: "#2E6BE6",
    odeloTamno: "#2154B8",
    plast: "#E8453C",
    plastTamno: "#C1332C",
    detalj: "#FF7BAC",
  },
  decak: {
    koza: "#F7C9A3",
    kozaSenka: "#E4B183",
    kosa: "#7A4A2B",
    kosaSvetlo: "#96603A",
    odelo: "#2E6BE6",
    odeloTamno: "#2154B8",
    plast: "#E8453C",
    plastTamno: "#C1332C",
    detalj: "#FFD43B",
  },
} as const;

/** Ugao obe ruke po pozi (stepeni; 0 = ruka opuštena niz telo) */
const RUKE: Record<Poza, { leva: number; desna: number }> = {
  mirno: { leva: 11, desna: -11 },
  navija: { leva: 150, desna: -150 },
  stit: { leva: 8, desna: -74 },
  maha: { leva: 12, desna: -128 },
  pita: { leva: 10, desna: -96 },
};

const MEKO: Transition = { type: "spring", stiffness: 120, damping: 12 };

/**
 * ZAMKA KOJA JE POJELA RUKE (provereno merenjem 03.08.2026)
 *
 * Framer Motion svakom elementu koji animira upiše `transform-box: fill-box`.
 * Tada se `transform-origin: 78px 88px` meri OD UGLA SAMOG ELEMENTA, ne od
 * koordinatnog početka crteža — pa je uporište ruke završavalo na (141, 172),
 * ruka je odletela van tela i prosto se nije videla.
 *
 * Zato svaka grupa koja se okreće oko tačke u koordinatama crteža mora izričito
 * da traži `transformBox: "view-box"`. Uporište se pri tom MORA zadati Framerovim
 * `originX`/`originY` — ako se napiše kao obično CSS svojstvo `transformOrigin`,
 * Framer ga pregazi svojim podrazumevanim „50% 50%" i ruka opet ode.
 * Jedini izuzetak je kapak oka: njemu uporište i jeste sopstveni vrh, pa mu
 * odgovara `fill-box` sa uporištem na sredini gore.
 */

/** Da li se u ovom trenutku nešto izgovara — usta prate govor */
function useGovori(): boolean {
  return useSyncExternalStore(pretplatiSeNaGovor, daLiGovori, () => false);
}

/**
 * Treptaj: kapak se spusti na 0,14 s, pa se sledeći zakazuje na 3–6 s.
 * Nasumičan razmak je bitan — kad oba lika trepću u isto vreme, izgleda
 * mehanički, kao dve iste lutke, a ne kao dvoje dece.
 */
function useTreptaj(ugasi: boolean): boolean {
  const [zatvoreno, setZatvoreno] = useState(false);
  useEffect(() => {
    if (ugasi) return;
    let zaTreptaj: ReturnType<typeof setTimeout>;
    let zaOtvaranje: ReturnType<typeof setTimeout>;
    const zakaziTreptaj = () => {
      zaTreptaj = setTimeout(() => {
        setZatvoreno(true);
        zaOtvaranje = setTimeout(() => {
          setZatvoreno(false);
          zakaziTreptaj();
        }, 140);
      }, 3000 + Math.random() * 3000);
    };
    zakaziTreptaj();
    return () => {
      clearTimeout(zaTreptaj);
      clearTimeout(zaOtvaranje);
    };
  }, [ugasi]);
  return zatvoreno;
}

export default function SuperheroSvg({
  character,
  poza,
  size,
  smanjenPokret = false,
}: Props) {
  const b = PALETA[character];
  const govori = useGovori();
  const trepce = useTreptaj(smanjenPokret);
  const ruke = RUKE[poza];
  const devojcica = character === "devojcica";

  // Usta: dok govori se otvaraju i zatvaraju, inače su osmeh.
  // Kad navija — široko otvorena usta (viče „bravo!").
  const ustaOtvorena = govori || poza === "navija";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {/* ── OBLAK NA KOME STOJE ─────────────────────────────────────────── */}
      <motion.g
        animate={smanjenPokret ? undefined : { x: [0, 3, 0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="100" cy="180" rx="50" ry="13" fill="#E3EDFF" />
        <ellipse cx="76" cy="175" rx="22" ry="14" fill="#FFFFFF" />
        <ellipse cx="104" cy="172" rx="28" ry="17" fill="#FFFFFF" />
        <ellipse cx="128" cy="177" rx="20" ry="12" fill="#FFFFFF" />
      </motion.g>

      {/* ── CEO LIK: lebdi gore-dole ────────────────────────────────────── */}
      <motion.g
        animate={smanjenPokret ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* PLAŠT — iza tela, talasa se kao na vetru */}
        <motion.g
          style={{ transformBox: "view-box", originX: "100px", originY: "82px" }}
          animate={smanjenPokret ? undefined : { rotate: [0, 3, 0, -3, 0], skewX: [0, 4, 0, -4, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M80 80 C60 104 52 134 56 152 C68 150 80 138 88 120 L88 84 Z"
            fill={b.plastTamno}
          />
          <path
            d="M120 80 C140 104 148 134 144 152 C132 150 120 138 112 120 L112 84 Z"
            fill={b.plast}
          />
        </motion.g>

        {/* NOGE + ČIZME */}
        <rect x="87" y="118" width="11" height="32" rx="5.5" fill={b.odeloTamno} />
        <rect x="102" y="118" width="11" height="32" rx="5.5" fill={b.odeloTamno} />
        <rect x="80" y="148" width="19" height="13" rx="6" fill={b.plast} />
        <rect x="101" y="148" width="19" height="13" rx="6" fill={b.plast} />

        {/* ── RUKE ────────────────────────────────────────────────────────
             Crtaju se PRE tela pa ih telo delimično prekriva na ramenu —
             tako izgleda kao da rastu iz ramena, a ne kao da su nalepljene.
             `originX/originY` je tačka ramena; bez nje bi se ruka vrtela oko
             sredine crteža i odletela sa tela. */}
        <motion.g
          style={{ transformBox: "view-box", originX: "78px", originY: "88px" }}
          animate={{ rotate: ruke.leva }}
          transition={MEKO}
        >
          <rect x="64" y="84" width="15" height="44" rx="7.5" fill={b.odelo} />
          <rect x="64" y="84" width="15" height="44" rx="7.5" fill="#000" opacity="0.12" />
          <circle cx="71.5" cy="131" r="8" fill={b.plast} />
        </motion.g>

        <motion.g
          style={{ transformBox: "view-box", originX: "122px", originY: "88px" }}
          animate={
            poza === "maha" && !smanjenPokret
              ? { rotate: [ruke.desna, ruke.desna - 24, ruke.desna] }
              : { rotate: ruke.desna }
          }
          transition={
            poza === "maha" && !smanjenPokret
              ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
              : MEKO
          }
        >
          <rect x="121" y="84" width="15" height="44" rx="7.5" fill={b.odelo} />
          <circle cx="128.5" cy="131" r="8" fill={b.plast} />
          {poza === "stit" && (
            <path
              d="M128 143 L142 149 L142 163 C142 171 135 177 128 179
                 C121 177 114 171 114 163 L114 149 Z"
              fill="#8ED9F6"
              stroke="#2154B8"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          )}
        </motion.g>

        {/* TELO — uže od glave, da se ruke vide sa strane */}
        <path
          d="M100 74 C114 74 124 84 124 98 L124 114 C124 121 118 124 110 124
             L90 124 C82 124 76 121 76 114 L76 98 C76 84 86 74 100 74 Z"
          fill={b.odelo}
        />
        {/* Pojas */}
        <rect x="76" y="112" width="48" height="8" rx="4" fill={b.plast} />
        {/* Znak na grudima — zvezda, ista kao zvezda u savetima */}
        <path
          d="M100 82 L104 90.6 L113.4 91.9 L106.7 98.5 L108.3 107.8 L100 103.4
             L91.7 107.8 L93.3 98.5 L86.6 91.9 L96 90.6 Z"
          fill="#FFD43B"
          stroke="#F0A500"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* ── GLAVA ────────────────────────────────────────────────────── */}
        <motion.g
          style={{ transformBox: "view-box", originX: "100px", originY: "70px" }}
          animate={{ rotate: poza === "navija" ? -7 : poza === "pita" ? 9 : 0 }}
          transition={MEKO}
        >
          {/* Vrat */}
          <rect x="94" y="70" width="12" height="10" rx="4" fill={b.kozaSenka} />

          {/* Kosa pozadi — samo devojčica (duga, pada niz ramena) */}
          {devojcica && (
            <path
              d="M70 44 C70 18 130 18 130 44 L133 78 C133 88 124 90 119 82
                 L119 50 L81 50 L81 82 C76 90 67 88 67 78 Z"
              fill={b.kosa}
            />
          )}

          {/* KOSA KAO CELA LOBANJA, pa lice PREKO NJE, ali NIŽE.
              Ovako na vrhu glave ostane pojas kose širine ~12 px i lik ima kosu.
              Ranije je lice bilo isto veliko kao kosa i sedelo na istoj visini,
              pa ju je celu prekrilo — devojčica je izgledala ćelava (prijava
              vlasnice 03.08.2026). Kosa MORA biti i veća i više od lica. */}
          <ellipse cx="100" cy="42" rx="30" ry="28" fill={b.kosa} />

          {/* Lice */}
          <ellipse cx="100" cy="50" rx="26.5" ry="25" fill={b.koza} />

          {/* Šiške preko čela — devojčici meke, dečaku čupave */}
          {devojcica ? (
            <>
              <path
                d="M74 42 C76 24 124 24 126 42 C120 34 112 31 100 31
                   C88 31 80 34 74 42 Z"
                fill={b.kosa}
              />
              {/* Traka u kosi — po njoj se devojčica prepoznaje na prvi pogled */}
              <path d="M73 33 C85 23 115 23 127 33 L127 39 C115 29 85 29 73 39 Z" fill={b.detalj} />
            </>
          ) : (
            /* Šiške moraju imati GLATKU donju ivicu. Prva verzija je bila
               cik-cak („čuperci") i kroz svaki zarez se videla koža sa lica
               ispod — izgledalo je kao da je kosa polomljena na čelu
               (prijava vlasnice 03.08.2026). Razlika u odnosu na devojčicu
               sada je razdeljak sa strane, ne zupci. */
            <path
              d="M74 43 C76 24 124 24 126 43 C120 32 112 29 104 30
                 C95 31 83 34 74 43 Z"
              fill={b.kosa}
            />
          )}

          {/* Obrve */}
          <motion.g animate={{ y: poza === "navija" ? -3 : 0 }} transition={MEKO}>
            <rect x="82" y="40" width="13" height="3.2" rx="1.6" fill={b.kosaSvetlo} />
            <rect x="105" y="40" width="13" height="3.2" rx="1.6" fill={b.kosaSvetlo} />
          </motion.g>

          {/* ── OČI ──────────────────────────────────────────────────────
               Beonjača + zenica + odsjaj, pa kapak boje kože koji se spušta
               odozgo. Tako se dobija pravi treptaj, a ne nestajanje oka. */}
          {[89, 111].map((cx) => (
            <g key={cx}>
              <ellipse cx={cx} cy={52} rx="7.4" ry="8.4" fill="#FFFFFF" />
              <motion.g
                animate={{ x: poza === "pita" ? 2.4 : 0, y: poza === "navija" ? -1.4 : 0 }}
                transition={MEKO}
              >
                <circle cx={cx} cy={53} r="4.6" fill="#3B2A20" />
                <circle cx={cx + 1.7} cy={50.8} r="1.7" fill="#FFFFFF" />
              </motion.g>
              <motion.rect
                x={cx - 8}
                y={43}
                width={16}
                height={19}
                rx={7}
                fill={b.koza}
                style={{ transformBox: "fill-box", originX: 0.5, originY: 0 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: trepce ? 1 : 0 }}
                transition={{ duration: 0.07, ease: "linear" }}
              />
            </g>
          ))}

          {/* Uši i rumeni obrazi UKLONJENI 03.08.2026 (zahtev vlasnice):
              na 116 px su se čitali kao mrlje po licu, ne kao deo lika. */}

          {/* ── USTA ─────────────────────────────────────────────────────
               Kad ćuti — nacrtan osmeh (linija), jer puna elipsa na malom licu
               izgleda kao rupa. Kad govori ili navija — otvorena usta koja se
               pomeraju u ritmu izgovaranja (v. `lib/tts.ts`). */}
          {ustaOtvorena ? (
            <>
              <motion.ellipse
                cx="100"
                cy="66"
                rx={8}
                ry={5}
                fill="#8E3B45"
                initial={{ rx: 8, ry: 3 }}
                animate={
                  govori && !smanjenPokret
                    ? { ry: [2, 6.6, 3, 5.8, 2.2], rx: [8, 6.8, 8.4, 7.2, 8] }
                    : { ry: 6, rx: 8 }
                }
                transition={
                  govori && !smanjenPokret
                    ? { duration: 0.42, repeat: Infinity, ease: "easeInOut" }
                    : MEKO
                }
              />
              <ellipse cx="100" cy="69" rx="4.2" ry="2" fill="#FF7A8A" />
            </>
          ) : (
            <path
              d="M91 64 Q100 72 109 64"
              stroke="#8E3B45"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </motion.g>
      </motion.g>
    </svg>
  );
}
