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
  wobble: number;
}

const BALLOON_COLORS = [
  "#FF6B6B", "#0984E3", "#00B894", "#FDCB6E", "#FF9F43",
  "#A29BFE", "#E17055", "#00CECE", "#FDA7DF", "#6C5CE7",
  "#55EFC4", "#FF7675", "#74B9FF", "#F8B500", "#FF85A2",
];

/**
 * Balloons float up SLOWLY from the bottom. Kids can tap to pop them!
 * Balloons take 15-25 seconds to reach the top - plenty of time to pop.
 */
export default function BalloonCelebration({ count = 20 }: { count?: number }) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [popEffects, setPopEffects] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    // Create initial balloons
    const createBalloons = (startId: number, num: number): Balloon[] =>
      Array.from({ length: num }, (_, i) => ({
        id: startId + i,
        x: 5 + Math.random() * 85,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        size: 55 + Math.random() * 30, // Bigger balloons (55-85px)
        delay: Math.random() * 8, // Stagger over 8 seconds
        speed: 15 + Math.random() * 10, // SLOW: 15-25 seconds to reach top!
        popped: false,
        wobble: 10 + Math.random() * 15, // Side-to-side wobble amount
      }));

    setBalloons(createBalloons(0, count));

    // Add more balloons every 10 seconds to keep the party going
    const interval = setInterval(() => {
      setBalloons((prev) => {
        const activeCount = prev.filter((b) => !b.popped).length;
        if (activeCount < 8) {
          const maxId = Math.max(...prev.map((b) => b.id), 0);
          return [...prev, ...createBalloons(maxId + 1, 5)];
        }
        return prev;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [count]);

  const popBalloon = useCallback((id: number, event: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid any interference
    event.preventDefault();
    event.stopPropagation();

    const balloon = balloons.find((b) => b.id === id);
    if (!balloon || balloon.popped) return;

    // Get click/tap position for pop effect
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Add pop effect with unique ID
    const effectId = Date.now() + Math.random();
    setPopEffects((prev) => [...prev, { id: effectId, x, y, color: balloon.color }]);

    // Remove pop effect after animation
    setTimeout(() => {
      setPopEffects((prev) => prev.filter((e) => e.id !== effectId));
    }, 600);

    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setPoppedCount((c) => c + 1);
  }, [balloons]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Pop counter - fun display */}
      {poppedCount > 0 && (
        <motion.div
          key={poppedCount}
          initial={{ scale: 1.5, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg z-50 border-2 border-[var(--primary)]"
        >
          <div className="text-xs text-[var(--text-light)]">Globus explotats!</div>
          <div className="text-2xl font-black text-[var(--primary)] text-center">
            {poppedCount} 💥
          </div>
        </motion.div>
      )}

      {/* Pop effects - confetti burst where balloon was popped */}
      <AnimatePresence>
        {popEffects.map((effect) => (
          <div
            key={effect.id}
            className="fixed pointer-events-none z-50"
            style={{ left: effect.x, top: effect.y }}
          >
            {/* Burst particles */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * 360;
              const rad = (angle * Math.PI) / 180;
              const distance = 40 + Math.random() * 30;
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(rad) * distance,
                    y: Math.sin(rad) * distance,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ backgroundColor: effect.color }}
                />
              );
            })}
            {/* Pop text */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl font-black"
              style={{ color: effect.color }}
            >
              POP!
            </motion.div>
          </div>
        ))}
      </AnimatePresence>

      {/* Balloons */}
      <AnimatePresence>
        {balloons
          .filter((b) => !b.popped)
          .map((balloon) => (
            <motion.div
              key={balloon.id}
              initial={{ y: "110vh", x: `${balloon.x}vw`, opacity: 0 }}
              animate={{
                y: "-20vh",
                opacity: 1,
                x: [
                  `${balloon.x}vw`,
                  `${balloon.x + balloon.wobble}vw`,
                  `${balloon.x - balloon.wobble}vw`,
                  `${balloon.x + balloon.wobble / 2}vw`,
                  `${balloon.x}vw`,
                ],
              }}
              exit={{
                scale: [1, 1.4, 0],
                opacity: [1, 1, 0],
                transition: { duration: 0.3 },
              }}
              transition={{
                y: { duration: balloon.speed, delay: balloon.delay, ease: "linear" },
                x: {
                  duration: balloon.speed,
                  delay: balloon.delay,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                },
                opacity: { duration: 0.5, delay: balloon.delay },
              }}
              onMouseDown={(e) => popBalloon(balloon.id, e)}
              onTouchStart={(e) => popBalloon(balloon.id, e)}
              className="absolute pointer-events-auto cursor-pointer select-none"
              style={{ width: balloon.size, left: 0, top: 0 }}
            >
              {/* Balloon SVG - proper teardrop shape */}
              <svg
                viewBox="0 0 60 90"
                width={balloon.size}
                height={balloon.size * 1.5}
                className="drop-shadow-lg"
              >
                {/* Balloon body - teardrop shape with rounded top */}
                <path
                  d="M30 4
                     C12 4 4 18 4 32
                     C4 50 16 62 30 66
                     C44 62 56 50 56 32
                     C56 18 48 4 30 4 Z"
                  fill={balloon.color}
                  opacity="0.95"
                />
                {/* Main shine highlight */}
                <ellipse
                  cx="18"
                  cy="22"
                  rx="8"
                  ry="14"
                  fill="white"
                  opacity="0.45"
                  transform="rotate(-20 18 22)"
                />
                {/* Secondary small shine */}
                <ellipse
                  cx="40"
                  cy="38"
                  rx="4"
                  ry="6"
                  fill="white"
                  opacity="0.25"
                />
                {/* Knot at bottom */}
                <path
                  d="M26 66 L30 72 L34 66 L30 68 Z"
                  fill={balloon.color}
                  opacity="0.85"
                />
                {/* String with curve */}
                <path
                  d="M30 72 Q24 80 30 85 Q36 90 30 95"
                  stroke="#888"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
              {/* Tap hint for first few balloons */}
              {balloon.id < 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: 3 }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-black/50 rounded-full px-2 py-0.5 whitespace-nowrap"
                >
                  Toca'm!
                </motion.div>
              )}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
