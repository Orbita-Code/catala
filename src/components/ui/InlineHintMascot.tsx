"use client";

import { motion, AnimatePresence } from "framer-motion";
import AnimatedStar from "@/components/star/AnimatedStar";

interface InlineHintMascotProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function InlineHintMascot({ visible, onAccept, onDecline }: InlineHintMascotProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="flex items-center gap-3 my-3 justify-center"
        >
          <AnimatedStar size={60} expression="smart" animation="peek" />
          <div className="bg-white border-2 border-[var(--accent)] rounded-2xl px-4 py-2.5 shadow-md relative">
            {/* Speech bubble tail */}
            <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[var(--accent)]" />
            <p className="text-sm font-bold text-[var(--text)] mb-2">
              Vols que t&apos;ajudi?
            </p>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onAccept}
                className="px-4 py-1.5 bg-[var(--success)] text-white font-bold rounded-xl text-sm shadow-sm"
              >
                Sí
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onDecline}
                className="px-4 py-1.5 bg-[var(--error)] text-white font-bold rounded-xl text-sm shadow-sm"
              >
                No
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
