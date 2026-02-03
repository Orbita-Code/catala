"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  color: string;
  size: number;
}

interface Burst {
  id: number;
  cx: number;
  cy: number;
  particles: Particle[];
}

const COLORS = [
  "#FF6B6B", "#FDCB6E", "#00CECE", "#6C5CE7", "#00B894",
  "#FF9F43", "#A29BFE", "#FDA7DF", "#55EFC4", "#FF7675",
];

/**
 * Animated fireworks bursts that appear at random positions.
 * Used on the theme celebration screen.
 */
export default function FireworksBurst({ waves = 4 }: { waves?: number }) {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    let wave = 0;
    const interval = setInterval(() => {
      if (wave >= waves) {
        clearInterval(interval);
        return;
      }
      const burstCount = 1 + Math.floor(Math.random() * 2);
      const newBursts: Burst[] = Array.from({ length: burstCount }, (_, bi) => {
        const cx = 15 + Math.random() * 70;
        const cy = 10 + Math.random() * 40;
        const particleCount = 10 + Math.floor(Math.random() * 8);
        const burstColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const particles: Particle[] = Array.from({ length: particleCount }, (_, pi) => ({
          id: pi,
          x: 0,
          y: 0,
          angle: (pi / particleCount) * 360,
          distance: 30 + Math.random() * 50,
          color: Math.random() > 0.3 ? burstColor : COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 3 + Math.random() * 4,
        }));
        return {
          id: Date.now() + bi,
          cx,
          cy,
          particles,
        };
      });
      setBursts((prev) => [...prev, ...newBursts]);
      wave++;
    }, 800);

    return () => clearInterval(interval);
  }, [waves]);

  // Clean up old bursts
  useEffect(() => {
    const timer = setInterval(() => {
      setBursts((prev) => {
        if (prev.length > 12) return prev.slice(-6);
        return prev;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="absolute"
            style={{ left: `${burst.cx}%`, top: `${burst.cy}%` }}
          >
            {burst.particles.map((p) => {
              const rad = (p.angle * Math.PI) / 180;
              const tx = Math.cos(rad) * p.distance;
              const ty = Math.sin(rad) * p.distance;
              return (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: tx,
                    y: ty,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  transition={{ duration: 0.8 + Math.random() * 0.4, ease: "easeOut" }}
                  className="absolute rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
