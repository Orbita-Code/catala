"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  StarMood,
  getEncouragement,
} from "@/lib/encouragement";

interface StarMascotProps {
  mood: StarMood;
  message?: string;
  show?: boolean;
}

// Map moods to clip regions of the sprite (5 stars in the image)
// The image has 5 star expressions arranged in a pattern:
// Row 1: happy (with pencil), smart (with glasses)
// Row 2: confused/surprised
// Row 3: sad, loving
const moodStyles: Record<StarMood, { filter: string }> = {
  happy: { filter: "none" },
  smart: { filter: "hue-rotate(30deg)" },
  confused: { filter: "hue-rotate(180deg) brightness(1.1)" },
  sad: { filter: "saturate(0.5) brightness(0.9)" },
  loving: { filter: "hue-rotate(300deg) brightness(1.1)" },
};

export default function StarMascot({
  mood,
  message,
  show = true,
}: StarMascotProps) {
  const [visible, setVisible] = useState(show);
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    setVisible(show);
    setDisplayMessage(message);
  }, [show, message]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{
              rotate: mood === "happy" ? [0, -5, 5, 0] : 0,
              scale: mood === "loving" ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: mood === "happy" || mood === "loving" ? 2 : 0,
            }}
            className="relative w-14 h-14 flex-shrink-0"
          >
            <Image
              src="/star-mascot.png"
              alt="Estrella mascota"
              width={56}
              height={56}
              className="rounded-full object-cover"
              style={{ filter: moodStyles[mood].filter }}
            />
          </motion.div>
          {displayMessage && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative bg-white rounded-2xl px-4 py-2 shadow-md border border-gray-100 max-w-[220px]"
            >
              <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-white" />
              <p className="text-sm font-bold text-[var(--text)]">
                {displayMessage}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper component that auto-shows encouragement on correct/wrong
export function TaskFeedback({
  result,
  streak,
}: {
  result: "correct" | "wrong" | null;
  streak?: number;
}) {
  if (!result) return null;

  const encouragement =
    streak && streak > 1
      ? getEncouragement("streak", streak)
      : getEncouragement(result);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <StarMascot
        mood={encouragement.mood}
        message={encouragement.text}
        show={true}
      />
    </motion.div>
  );
}
