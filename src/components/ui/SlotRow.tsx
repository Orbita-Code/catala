"use client";

import { motion } from "framer-motion";

interface SlotRowProps {
  slots: (string | null)[];
  activeIndex?: number;
  correct?: boolean | null;
  onSlotTap?: (index: number) => void;
}

export default function SlotRow({
  slots,
  activeIndex,
  correct = null,
  onSlotTap,
}: SlotRowProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {slots.map((letter, i) => {
        const filled = letter !== null;
        const isActive = activeIndex === i;

        const bgClass =
          correct === true
            ? "bg-green-100 border-green-400"
            : correct === false
              ? "bg-red-100 border-red-400"
              : filled
                ? "bg-purple-100 border-[var(--primary)]"
                : isActive
                  ? "bg-white border-[var(--primary)] border-solid"
                  : "bg-white border-gray-300 border-dashed";

        return (
          <motion.button
            key={i}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => onSlotTap?.(i)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl border-2 font-black text-xl transition-all ${bgClass}`}
          >
            {filled ? (
              <span className={correct === true ? "text-green-700" : correct === false ? "text-red-700" : "text-[var(--primary)]"}>
                {letter.toUpperCase()}
              </span>
            ) : (
              <span className="text-gray-300">_</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
