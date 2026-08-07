"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import SuperheroMascot from "./SuperheroMascot";
import { speakingCharacter, type MascotEvent } from "@/lib/mascot";

interface MascotPairProps {
  /** Trenutni događaj; `idle` = mirno stanje (oba tiho lebde) */
  event: MascotEvent;
  /** Tekst ohrabrenja; dobija ga SAMO jedan lik */
  message?: string | null;
  /**
   * Broji se koliko je puta lik reagovao — po tome se smenjuje ko govori,
   * da dete ne stekne osećaj da je jedan lik „glavni".
   */
  turn?: number;
}

/**
 * Dve maskote: devojčica u donjem LEVOM uglu, dečak u donjem DESNOM.
 * Oba reaguju na isti događaj, svaki svojom slikom.
 *
 * `pointer-events-none` je bitno: likovi stoje preko dna strane i ne smeju
 * da pojedu klik na dugme za navigaciju ispod njih.
 */
export default function MascotPair({ event, message = null, turn = 0 }: MascotPairProps) {
  const speaker = speakingCharacter(turn);
  // Na serveru nema `document`, pa portal ne sme da se pravi. `useSyncExternalStore`
  // vrati `false` na serveru i `true` na klijentu, bez efekta i bez kaskadnog
  // ponovnog iscrtavanja (isti razlog kao kod „manje pokreta" u SuperheroMascot).
  const naKlijentu = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  if (!naKlijentu) return null;

  /**
   * PORTAL U <body> JE OBAVEZAN, nije ukras.
   * `position: fixed` se NE računa prema ekranu ako bilo koji roditelj ima
   * `transform` (ili `filter`/`perspective`) — tada taj roditelj postaje okvir.
   * Framer Motion upisuje `transform` u omotače strane dok animira, pa su
   * maskote završavale zbijene u GORNJEM LEVOM uglu, preko zaglavlja.
   * Iz `<body>` ih nijedan takav roditelj ne može zarobiti.
   */
  return createPortal(
    // `bottom-16` (64 px) je bilo MANJE od visine trake sa dugmadima (69 px),
    // pa su likovi stajali preko nje i donji deo im se gubio (prijava vlasnice
    // 03.08.2026, izmereno: donja ivica lika 825 px, vrh trake 824 px).
    // `bottom-24` (96 px) ostavlja 27 px vazduha iznad trake.
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 flex items-end justify-between px-3 sm:px-8 lg:px-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={`dev-${event}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
        >
          <SuperheroMascot
            character="devojcica"
            event={event}
            side="left"
            message={speaker === "devojcica" ? message : null}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`dec-${event}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
        >
          <SuperheroMascot
            character="decak"
            event={event}
            side="right"
            message={speaker === "decak" ? message : null}
          />
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
}
