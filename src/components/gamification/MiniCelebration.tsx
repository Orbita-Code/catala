"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mascotImage } from "@/lib/mascot";
import { celebrate } from "@/lib/confetti";
import { playCombo } from "@/lib/audio";

interface MiniCelebrationProps {
  show: boolean;
  /** Main message, e.g. "5 tasques completades!" */
  message: string;
  /** Optional second line, e.g. "Ets una superestrella!" */
  subMessage?: string;
  /** When set, a continue button is shown and the overlay stays until the child taps it. */
  buttonText?: string;
  /** Auto-dismiss delay when there is no button (default 2800ms). */
  duration?: number;
  onDone: () => void;
}

/**
 * Mala proslava usred teme: OBA SUPERHEROJA + konfete + čestitka.
 * Pojavljuje se na svakih 5 rešenih zadataka i između rundi prepisivanja reči.
 *
 * Ovde je do 06.08.2026. stajala animirana ZVEZDA, i vlasnica je s pravom
 * prijavila da to nije u redu: maskote aplikacije su dva superheroja, a zvezda
 * po dogovoru ostaje samo u savetima, na početnoj strani i kao slika nivoa.
 * Dete koje ceo zadatak gleda heroje ne sme da za pohvalu dobije drugog lika —
 * pohvala tada deluje kao da dolazi od nekog trećeg.
 */
export default function MiniCelebration({
  show,
  message,
  subMessage,
  buttonText,
  duration = 2800,
  onDone,
}: MiniCelebrationProps) {
  useEffect(() => {
    if (!show) return;
    celebrate(["#6C5CE7", "#FDCB6E", "#00CECE"]);
    playCombo();
    if (buttonText) return; // waits for the child to tap
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [show, buttonText, duration, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(45,52,54,0.35)] backdrop-blur-[2px] px-6"
          onClick={buttonText ? undefined : onDone}
        >
          <motion.div
            initial={{ scale: 0.6, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 16, stiffness: 220 }}
            className="bg-white rounded-3xl shadow-2xl px-8 py-7 flex flex-col items-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Oba lika skaču, svaki svojim ritmom (drugi kreće 0,15 s kasnije)
                — kad skaču u istom trenutku, izgledaju kao jedna slika. */}
            <div className="flex items-end justify-center gap-2">
              {(["devojcica", "decak"] as const).map((lik, i) => (
                <motion.img
                  key={lik}
                  src={mascotImage(lik, "poza")}
                  alt=""
                  aria-hidden="true"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain select-none"
                  style={{ transform: lik === "devojcica" ? "scaleX(-1)" : undefined }}
                  animate={{ y: [0, -14, 0, -8, 0], rotate: [0, -4, 3, -2, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                />
              ))}
            </div>
            <p className="mt-4 text-2xl font-black text-[var(--primary)] font-handwriting text-center">
              {message}
            </p>
            {subMessage && (
              <p className="mt-1 text-lg font-bold text-[var(--text)] text-center">
                {subMessage}
              </p>
            )}
            {buttonText && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={onDone}
                className="mt-5 px-8 py-3 bg-[var(--secondary)] text-white font-bold rounded-2xl text-lg shadow-md"
              >
                {buttonText}
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
