"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Quick sparkle burst that appears after a correct task answer.
 * Shows ~8 sparkle particles that expand outward and fade, lasting ~0.6s.
 */
export default function SparkleOverlay({ trigger }: { trigger: number }) {
  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number; size: number; color: string; delay: number }[]
  >([]);

  const COLORS = ["#FDCB6E", "#6C5CE7", "#00CECE", "#FF6B6B", "#00B894", "#A29BFE", "#FF9F43"];

  useEffect(() => {
    if (trigger === 0) return;
    const newSparkles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40, // center area (30-70% of screen width)
      y: 20 + Math.random() * 30, // upper-middle area
      size: 8 + Math.random() * 16,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.15,
    }));
    setSparkles(newSparkles);
    const timer = setTimeout(() => setSparkles([]), 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <AnimatePresence>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 1, scale: 0, x: "-50%", y: "-50%" }}
          animate={{ opacity: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: s.delay, ease: "easeOut" }}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
        >
          <svg viewBox="0 0 24 24" fill={s.color}>
            <path d="M12 0L14.5 8.5L24 12L14.5 15.5L12 24L9.5 15.5L0 12L9.5 8.5Z" />
          </svg>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
