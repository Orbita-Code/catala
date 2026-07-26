"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedStar from "@/components/star/AnimatedStar";
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
 * Small mid-theme celebration: dancing star + confetti + encouraging message.
 * Used every 5 completed tasks (theme level) and between copy-word rounds.
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
            <AnimatedStar
              size="lg"
              expression="celebrating"
              animation="dance"
              showSparkles
            />
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
