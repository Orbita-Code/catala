"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Balloon {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  speed: number;
  popped: boolean;
}

const BALLOON_COLORS = [
  "#FF6B6B", "#0984E3", "#00B894", "#FDCB6E", "#FF9F43",
  "#A29BFE", "#E17055", "#00CECE", "#FDA7DF", "#6C5CE7",
  "#55EFC4", "#FF7675", "#74B9FF",
];

/**
 * Balloons float up from the bottom. Kids can tap to pop them.
 * Used on the theme celebration screen.
 */
export default function BalloonCelebration({ count = 15 }: { count?: number }) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);

  useEffect(() => {
    const newBalloons: Balloon[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      size: 40 + Math.random() * 25,
      delay: Math.random() * 2,
      speed: 3 + Math.random() * 3,
      popped: false,
    }));
    setBalloons(newBalloons);
  }, [count]);

  const popBalloon = useCallback((id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setPoppedCount((c) => c + 1);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Pop counter */}
      {poppedCount > 0 && (
        <motion.div
          key={poppedCount}
          initial={{ scale: 1.3, opacity: 1 }}
          animate={{ scale: 1, opacity: 0.8 }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-[var(--primary)] shadow-lg z-50"
        >
          {poppedCount} / {count}
        </motion.div>
      )}

      <AnimatePresence>
        {balloons
          .filter((b) => !b.popped)
          .map((balloon) => (
            <motion.div
              key={balloon.id}
              initial={{ y: "110vh", x: `${balloon.x}vw`, opacity: 1 }}
              animate={{ y: "-20vh" }}
              exit={{
                scale: [1, 1.3, 0],
                opacity: [1, 1, 0],
                transition: { duration: 0.3 },
              }}
              transition={{
                y: { duration: balloon.speed, delay: balloon.delay, ease: "linear" },
              }}
              onClick={() => popBalloon(balloon.id)}
              className="absolute pointer-events-auto cursor-pointer"
              style={{ width: balloon.size, left: 0, top: 0 }}
            >
              {/* Balloon SVG */}
              <svg
                viewBox="0 0 60 80"
                width={balloon.size}
                height={balloon.size * 1.33}
              >
                {/* Balloon body */}
                <ellipse
                  cx="30"
                  cy="28"
                  rx="24"
                  ry="28"
                  fill={balloon.color}
                  opacity="0.9"
                />
                {/* Shine */}
                <ellipse
                  cx="20"
                  cy="18"
                  rx="6"
                  ry="9"
                  fill="white"
                  opacity="0.35"
                  transform="rotate(-20 20 18)"
                />
                {/* Knot */}
                <polygon
                  points="27,55 30,58 33,55 30,56"
                  fill={balloon.color}
                  opacity="0.8"
                />
                {/* String */}
                <path
                  d="M30 58 Q28 68 30 78"
                  stroke="#999"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
