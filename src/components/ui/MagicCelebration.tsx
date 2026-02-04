"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

interface Confetti {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  shape: "square" | "circle" | "star" | "heart";
}

interface MagicStar {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const SPARKLE_COLORS = [
  "#FFD700", "#FFF8DC", "#FFFACD", "#FFE4B5", "#FFEFD5",
  "#FF69B4", "#FF1493", "#FFB6C1", "#DDA0DD", "#EE82EE",
];

const CONFETTI_COLORS = [
  "#FF6B6B", "#0984E3", "#00B894", "#FDCB6E", "#FF9F43",
  "#A29BFE", "#E17055", "#00CECE", "#FDA7DF", "#6C5CE7",
  "#55EFC4", "#FF7675", "#74B9FF", "#F8B500", "#FF85A2",
];

/**
 * Magical celebration overlay with sparkles, confetti rain, and twinkling stars.
 * Creates a festive, magical atmosphere for kids!
 */
export default function MagicCelebration({ intensity = "high" }: { intensity?: "low" | "medium" | "high" }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [magicStars, setMagicStars] = useState<MagicStar[]>([]);

  const counts = {
    low: { sparkles: 15, confetti: 20, stars: 5 },
    medium: { sparkles: 25, confetti: 40, stars: 10 },
    high: { sparkles: 40, confetti: 60, stars: 15 },
  }[intensity];

  // Generate sparkles continuously
  useEffect(() => {
    const createSparkles = () => {
      const newSparkles: Sparkle[] = Array.from({ length: counts.sparkles }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + Math.random() * 16,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        delay: Math.random() * 3,
        duration: 1 + Math.random() * 2,
      }));
      setSparkles(newSparkles);
    };

    createSparkles();
    const interval = setInterval(createSparkles, 3000);
    return () => clearInterval(interval);
  }, [counts.sparkles]);

  // Generate confetti rain
  useEffect(() => {
    const createConfetti = () => {
      const newConfetti: Confetti[] = Array.from({ length: counts.confetti }, (_, i) => ({
        id: Date.now() + i + 1000,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 8 + Math.random() * 12,
        rotation: Math.random() * 360,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        shape: (["square", "circle", "star", "heart"] as const)[Math.floor(Math.random() * 4)],
      }));
      setConfetti((prev) => [...prev.slice(-30), ...newConfetti]);
    };

    createConfetti();
    const interval = setInterval(createConfetti, 2000);
    return () => clearInterval(interval);
  }, [counts.confetti]);

  // Generate magic twinkling stars
  useEffect(() => {
    const createStars = () => {
      const newStars: MagicStar[] = Array.from({ length: counts.stars }, (_, i) => ({
        id: Date.now() + i + 2000,
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        size: 20 + Math.random() * 30,
        delay: Math.random() * 2,
      }));
      setMagicStars(newStars);
    };

    createStars();
    const interval = setInterval(createStars, 4000);
    return () => clearInterval(interval);
  }, [counts.stars]);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Gradient magical background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-pink-500/10" />

      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
            className="absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
            }}
          >
            {/* 4-point sparkle star */}
            <svg viewBox="0 0 24 24" fill={sparkle.color}>
              <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confetti rain */}
      <AnimatePresence>
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: `${piece.x}vw`,
              y: "-5vh",
              rotate: piece.rotation,
              opacity: 1,
            }}
            animate={{
              y: "110vh",
              rotate: piece.rotation + 720,
              x: `${piece.x + (Math.random() - 0.5) * 20}vw`,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: "linear",
            }}
            className="absolute"
            style={{ width: piece.size, height: piece.size }}
          >
            {piece.shape === "square" && (
              <div
                className="w-full h-full rounded-sm"
                style={{ backgroundColor: piece.color }}
              />
            )}
            {piece.shape === "circle" && (
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: piece.color }}
              />
            )}
            {piece.shape === "star" && (
              <svg viewBox="0 0 24 24" fill={piece.color}>
                <path d="M12 2L15 8.5L22 9.5L17 14.5L18 21.5L12 18L6 21.5L7 14.5L2 9.5L9 8.5L12 2Z" />
              </svg>
            )}
            {piece.shape === "heart" && (
              <svg viewBox="0 0 24 24" fill={piece.color}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Magic twinkling stars */}
      <AnimatePresence>
        {magicStars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.5, 1, 0],
              scale: [0, 1.2, 0.8, 1.1, 0],
            }}
            transition={{
              duration: 3,
              delay: star.delay,
              ease: "easeInOut",
            }}
            className="absolute text-yellow-300"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              fontSize: star.size,
              filter: "drop-shadow(0 0 8px gold)",
            }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Glitter dust effect (tiny dots) */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`glitter-${i}`}
            className="absolute w-1 h-1 rounded-full bg-yellow-200"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 4px gold",
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
