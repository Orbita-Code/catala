"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  targetY: number;
  color: string;
  exploded: boolean;
  sparks: Spark[];
}

// Bright, vivid firework colors
const FIREWORK_COLORS = [
  "#FF0040", "#FF6B00", "#FFD700", "#00FF00", "#00FFFF",
  "#0080FF", "#8000FF", "#FF00FF", "#FF1493", "#00FF80",
  "#FFFF00", "#FF4500", "#7FFF00", "#00CED1", "#FF69B4",
];

/**
 * Solitaire-style magical fireworks!
 * Continuous explosions of color across the entire screen.
 * Never stops - pure celebration magic!
 */
export default function FireworksBurst({ waves = 4 }: { waves?: number }) {
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const createFirework = useCallback((): Firework => {
    return {
      id: Date.now() + Math.random() * 10000,
      x: 10 + Math.random() * 80, // Anywhere horizontally
      y: 100, // Start from bottom
      targetY: 15 + Math.random() * 40, // Explode at 15-55% from top
      color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
      exploded: false,
      sparks: [],
    };
  }, []);

  const createExplosion = useCallback((x: number, y: number, color: string): Spark[] => {
    const sparkCount = 30 + Math.floor(Math.random() * 20); // 30-50 sparks per explosion
    const newSparks: Spark[] = [];

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 2 + Math.random() * 4;
      const sparkColor = Math.random() > 0.3
        ? color
        : FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

      newSparks.push({
        id: Date.now() + i + Math.random() * 1000,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: sparkColor,
        size: 2 + Math.random() * 4,
        life: 1,
      });
    }

    return newSparks;
  }, []);

  // Launch fireworks continuously
  useEffect(() => {
    const launchInterval = setInterval(() => {
      setFireworks(prev => {
        // Keep max 8 active fireworks
        const active = prev.filter(f => !f.exploded || f.sparks.length > 0);
        if (active.length < 8) {
          return [...active, createFirework()];
        }
        return active;
      });
    }, 200 + Math.random() * 300); // Launch every 200-500ms

    return () => clearInterval(launchInterval);
  }, [createFirework]);

  // Animate fireworks rising and exploding
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setFireworks(prev => {
        const newFireworks = prev.map(fw => {
          if (fw.exploded) return fw;

          // Rise up
          const newY = fw.y - 2;

          // Check if reached target - explode!
          if (newY <= fw.targetY) {
            const explosion = createExplosion(fw.x, fw.y, fw.color);
            setSparks(s => [...s, ...explosion]);
            return { ...fw, y: newY, exploded: true };
          }

          return { ...fw, y: newY };
        });

        // Remove fully exploded fireworks
        return newFireworks.filter(fw => !fw.exploded || fw.y > fw.targetY - 5);
      });
    }, 30);

    return () => clearInterval(animationInterval);
  }, [createExplosion]);

  // Animate sparks falling with gravity and fading
  useEffect(() => {
    const sparkInterval = setInterval(() => {
      setSparks(prev => {
        return prev
          .map(spark => ({
            ...spark,
            x: spark.x + spark.vx,
            y: spark.y + spark.vy,
            vy: spark.vy + 0.1, // Gravity
            vx: spark.vx * 0.98, // Air resistance
            life: spark.life - 0.02,
          }))
          .filter(spark => spark.life > 0 && spark.y < 110);
      });
    }, 30);

    return () => clearInterval(sparkInterval);
  }, []);

  // Intensity based on waves prop
  const intensity = Math.min(waves, 8);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Rising fireworks - bright streaks going up */}
      {fireworks.filter(fw => !fw.exploded).map(fw => (
        <motion.div
          key={fw.id}
          className="absolute"
          style={{
            left: `${fw.x}%`,
            top: `${fw.y}%`,
          }}
        >
          {/* Firework trail */}
          <div
            className="absolute w-1 rounded-full"
            style={{
              height: 20,
              background: `linear-gradient(to top, transparent, ${fw.color})`,
              boxShadow: `0 0 10px ${fw.color}, 0 0 20px ${fw.color}`,
              transform: 'translateX(-50%)',
            }}
          />
          {/* Firework head - bright glowing point */}
          <div
            className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundColor: '#FFF',
              boxShadow: `0 0 10px ${fw.color}, 0 0 20px ${fw.color}, 0 0 30px white`,
            }}
          />
        </motion.div>
      ))}

      {/* Explosion sparks - the magic! */}
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="absolute rounded-full"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: spark.size * spark.life,
            height: spark.size * spark.life,
            backgroundColor: spark.color,
            opacity: spark.life,
            boxShadow: `0 0 ${spark.size * 2}px ${spark.color}, 0 0 ${spark.size * 4}px ${spark.color}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Extra sparkle layer - tiny twinkling stars */}
      <AnimatePresence>
        {Array.from({ length: intensity * 3 }).map((_, i) => (
          <motion.div
            key={`twinkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              repeatDelay: 1 + (i % 3),
            }}
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${10 + (i * 11) % 50}%`,
              boxShadow: '0 0 4px white, 0 0 8px white',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
