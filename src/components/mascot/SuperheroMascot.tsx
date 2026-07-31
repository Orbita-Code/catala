"use client";

import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import { useSyncExternalStore } from "react";
import StarSpeechBubble from "@/components/star/StarSpeechBubble";
import {
  getMascotState,
  mascotImage,
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
  // Savet / ćutanje: tiho se pojavi i diše, bez skakanja
  appear: {
    animate: { y: [0, -5, 0], opacity: [0.85, 1, 0.92] },
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  },
  wiggle: {
    animate: { x: [0, -4, 4, -2, 0] },
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

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

  // Duh je providan po prirodi slike; dodatno ga stišavamo da ne odvlači pogled
  const isGhost = state.variant === "duh";

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
            trajanjem i ponavljanjem. Duhu `appear` namerno pulsira providnost. */}
        <motion.div
          animate={reduced ? undefined : motionSpec.animate}
          transition={reduced ? { duration: 0.2 } : motionSpec.transition}
          style={{
            width: px,
            height: px,
            filter: isGhost
              ? "drop-shadow(0 4px 12px rgba(120,180,255,0.45))"
              : "drop-shadow(0 5px 12px rgba(0,0,0,0.18))",
          }}
        >
        <img
          src={mascotImage(character, state.variant)}
          alt=""
          aria-hidden="true"
          draggable={false}
          width={px}
          height={px}
          className="w-full h-full object-contain select-none pointer-events-none"
          style={{
            // Obrtanje i providnost idu na SLIKU, ne na motion.div — Framer Motion
            // sam upisuje `transform` i `opacity` u style tog div-a i pregazio bi ih,
            // pa lik nikad ne bi bio okrenut ka sredini ekrana.
            transform: side === "left" ? "scaleX(-1)" : undefined,
            opacity: isGhost ? 0.9 : 1,
          }}
        />
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
