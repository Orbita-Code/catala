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
 * Continuous fireworks in top left and right corners.
 * Fires forever while visible on the celebration screen.
 */
export default function FireworksBurst({ continuous = true }: { continuous?: boolean; waves?: number }) {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const createBurst = (corner: "left" | "right"): Burst => {
      // Left corner: 5-20%, Right corner: 80-95%
      const cx = corner === "left"
        ? 5 + Math.random() * 15
        : 80 + Math.random() * 15;
      const cy = 5 + Math.random() * 20; // Top 5-25%

      const particleCount = 12 + Math.floor(Math.random() * 8);
      const burstColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const particles: Particle[] = Array.from({ length: particleCount }, (_, pi) => ({
        id: pi,
        x: 0,
        y: 0,
        angle: (pi / particleCount) * 360,
        distance: 40 + Math.random() * 60,
        color: Math.random() > 0.3 ? burstColor : COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 4 + Math.random() * 5,
      }));

      return {
        id: Date.now() + Math.random() * 1000,
        cx,
        cy,
        particles,
      };
    };

    // Fire initial bursts
    setBursts([createBurst("left"), createBurst("right")]);

    // Continuously fire new fireworks
    const interval = setInterval(() => {
      // Alternate between corners or fire both
      const shouldFireBoth = Math.random() > 0.5;
      const newBursts: Burst[] = [];

      if (shouldFireBoth) {
        newBursts.push(createBurst("left"), createBurst("right"));
      } else {
        newBursts.push(createBurst(Math.random() > 0.5 ? "left" : "right"));
      }

      setBursts((prev) => [...prev, ...newBursts]);
    }, 600 + Math.random() * 400); // Fire every 600-1000ms

    return () => clearInterval(interval);
  }, [continuous]);

  // Clean up old bursts to prevent memory issues
  useEffect(() => {
    const timer = setInterval(() => {
      setBursts((prev) => {
        if (prev.length > 20) return prev.slice(-10);
        return prev;
      });
    }, 2000);
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
                    scale: 0.2,
                  }}
                  transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
                  className="absolute rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                  }}
                />
              );
            })}
            {/* Center flash */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute w-4 h-4 -translate-x-2 -translate-y-2 rounded-full bg-white"
              style={{ boxShadow: "0 0 20px white, 0 0 40px white" }}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
