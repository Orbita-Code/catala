"use client";

import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import StarSpeechBubble from "@/components/star/StarSpeechBubble";
import {
  getMascotState,
  mascotImage,
  mascotBlinkImage,
  type MascotCharacter,
  type MascotEvent,
} from "@/lib/mascot";

interface SuperheroMascotProps {
  character: MascotCharacter;
  /** Šta se desilo u igri; `idle` je mirno stanje */
  event: MascotEvent;
  /** Tekst u balonu — daje se samo jednom liku, da se baloni ne prekrivaju */
  message?: string | null;
  /** Sa koje strane ekrana stoji (utiče na to gde ide balon i kuda gleda) */
  side: "left" | "right";
  /** Osnovna veličina u px (uvećanje po stanju se množi na ovo) */
  size?: number;
}

/** Pokreti — svaki je namerno blag, jer lik stoji pored zadatka i ne sme da odvlači */
const MOTIONS: Record<
  string,
  { animate: TargetAndTransition; transition: Transition }
> = {
  // Mirno stanje: lebdi kao da se drži u vazduhu. Amplituda je namerno vidljiva —
  // sa prvobitnih 7 px / 3,2 s pokret se prosto NIJE primećivao (prijava vlasnice).
  // Sada se diže i spušta 14 px, blago se naginje i „diše", ali i dalje ne skače
  // i ne odvlači pogled sa zadatka.
  float: {
    animate: { y: [0, -14, 0], rotate: [0, 3, 0, -3, 0], scale: [1, 1.04, 1] },
    transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
  },
  // Tačan odgovor: skok pa se smiri
  pop: {
    animate: { y: [0, -18, 0], scale: [1, 1.08, 1] },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  // Niska tačnih: navija, dva poskoka
  cheer: {
    animate: { y: [0, -22, -4, -16, 0], rotate: [0, -5, 4, -3, 0] },
    transition: { duration: 1.1, ease: "easeInOut" },
  },
  // Greška: NE trese se (deca to čitaju kao kaznu) — nego se blago zaljulja
  sway: {
    animate: { rotate: [0, -6, 5, -3, 0], y: [0, -4, 0, -2, 0] },
    transition: { duration: 0.9, ease: "easeInOut" },
  },
  // Savet: tiho se pojavi i diše, bez skakanja.
  // PROVIDNOST JE UKLONJENA 03.08.2026: `opacity: [0.85, 1, 0.92]` je likove
  // činila izbledelim, pa je vlasnica to pročitala kao kvar („ledeni",
  // „providni"). Lik sada samo diše — pun je i jasan u svakom trenutku.
  appear: {
    animate: { y: [0, -5, 0], scale: [1, 1.03, 1] },
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  },
  wiggle: {
    animate: { x: [0, -4, 4, -2, 0] },
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

/**
 * TREPTAJ — kapak se spusti na 0,14 s, pa se sledeći zakazuje na 3–6 s.
 * Nasumičan razmak je bitan: kad oba lika trepću u isto vreme, izgleda
 * mehanički, kao dve iste lutke, a ne kao dvoje dece.
 */
function useTreptaj(ugasi: boolean): boolean {
  const [zatvoreno, setZatvoreno] = useState(false);
  useEffect(() => {
    if (ugasi) {
      setZatvoreno(false);
      return;
    }
    let zaTreptaj: ReturnType<typeof setTimeout>;
    let zaOtvaranje: ReturnType<typeof setTimeout>;
    const zakazi = () => {
      zaTreptaj = setTimeout(() => {
        setZatvoreno(true);
        zaOtvaranje = setTimeout(() => {
          setZatvoreno(false);
          zakazi();
        }, 140);
      }, 3000 + Math.random() * 3000);
    };
    zakazi();
    return () => {
      clearTimeout(zaTreptaj);
      clearTimeout(zaOtvaranje);
    };
  }, [ugasi]);
  return zatvoreno;
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Poštuje sistemsku postavku „manje pokreta" — lik koji stalno lebdi može da
 * smeta detetu osetljivom na pokret. `useSyncExternalStore` je ovde umesto
 * `useEffect` + `setState` da nema kaskadnog ponovnog iscrtavanja, a da se na
 * serveru vrati `false` bez neusklađenosti pri hidraciji.
 */
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false
  );
}

export default function SuperheroMascot({
  character,
  event,
  message = null,
  side,
  size = 88,
}: SuperheroMascotProps) {
  const reduced = useReducedMotion();

  const state = getMascotState(event);
  const motionSpec = MOTIONS[state.motion];
  const px = Math.round(size * (state.scale ?? 1));

  // Kadar sa zatvorenim očima postoji samo za mirno stanje — tamo lik i provede
  // najviše vremena. U ostalim stanjima `slikaTreptaja` je `null` i lik ne trepće.
  const slikaTreptaja = mascotBlinkImage(character, state.variant);
  const trepce = useTreptaj(reduced || !slikaTreptaja);


  return (
    <div className="relative" style={{ width: px, height: px }}>
      {/* SPOLJNI sloj = ulazak (jednom). Ne sme da se meša sa petljom ispod:
          ako `opacity 0→1` naslediti `repeat: Infinity` iz pokreta, lik zauvek
          bledi. Mereno pre razdvajanja: opacity je skakala 0,70 → 0,92 u mirnom
          stanju, pa su likovi izgledali kao izbledele nalepnice. */}
      <motion.div
        key={`${character}-${event}`}
        initial={{ scale: 0.86, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ width: px, height: px }}
      >
        {/* UNUTRAŠNJI sloj = sam pokret (lebdenje, skok, navijanje…), sa svojim
            trajanjem i ponavljanjem. */}
        <motion.div
          animate={reduced ? undefined : motionSpec.animate}
          transition={reduced ? { duration: 0.2 } : motionSpec.transition}
          style={{
            width: px,
            height: px,
            filter: "drop-shadow(0 5px 12px rgba(0,0,0,0.18))",
          }}
        >
          {/* GOTOVA 3D ILUSTRACIJA, ne crtež (odluka vlasnice 03.08.2026).
              Probano je da lik bude SVG u slojevima da bi mogao da trepće i
              priča — radilo je, ali ravan vektor pored 363 mekane 3D
              ilustracije izgleda kao da su iz dve različite aplikacije.
              Ujednačen izgled je pretegao. Crtež nije obrisan nego stoji u
              `SuperheroSvg.tsx` — poslužiće kad se isti 3D lik izvuče u
              delovima (glava, ruke, oči, usta), pa da bude i lep i živ. */}
          {/* DVA KADRA JEDAN PREKO DRUGOG: otvorene oči i zatvorene oči.
              Treptaj je prosto smena providnosti između njih. Oba kadra su ISTA
              slika (kapak je docrtan preko originala, v. `scripts/napravi-treptaj.py`),
              pa se poklapaju u piksel i smena se ne primeti.
              Gornji kadar stoji u DOM-u i kad je nevidljiv — tako je već skinut
              kad zatreba, pa prvi treptaj ne kasni. */}
          <div className="relative w-full h-full">
            <img
              src={mascotImage(character, state.variant)}
              alt=""
              aria-hidden="true"
              draggable={false}
              width={px}
              height={px}
              className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
              style={{
                // Obrtanje ide na SLIKU, ne na `motion.div` — Framer Motion sam
                // upisuje `transform` u taj div i pregazio bi ga, pa lik nikad
                // ne bi bio okrenut ka sredini ekrana.
                transform: side === "left" ? "scaleX(-1)" : undefined,
                // Lik je UVEK pun. Ranije je stanje „duh" išlo na 0,9 providnosti
                // i uz pulsiranje je izgledalo kao da se aplikacija kvari.
                opacity: 1,
              }}
            />
            {slikaTreptaja && (
              <img
                src={slikaTreptaja}
                alt=""
                aria-hidden="true"
                draggable={false}
                width={px}
                height={px}
                className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                style={{
                  transform: side === "left" ? "scaleX(-1)" : undefined,
                  opacity: trepce ? 1 : 0,
                }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Balon se ne obrće zajedno sa likom */}
      {message && (
        <div
          className="absolute inset-0"
          style={{ transform: side === "left" ? "scaleX(1)" : undefined }}
        >
          <StarSpeechBubble message={message} position="top" />
        </div>
      )}
    </div>
  );
}
