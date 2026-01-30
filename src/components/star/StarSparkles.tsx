"use client";

import { motion, useReducedMotion } from "framer-motion";

interface StarSparklesProps {
  size: number;
}

const SPARKLE_COUNT = 5;

function sparklePositions(size: number) {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / SPARKLE_COUNT + Math.random() * 0.5;
    const dist = size * 0.55 + Math.random() * size * 0.15;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      delay: i * 0.15,
      scale: 0.5 + Math.random() * 0.5,
    };
  });
}

export default function StarSparkles({ size }: StarSparklesProps) {
  const prefersReduced = useReducedMotion();
  const positions = sparklePositions(size);

  if (prefersReduced) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ width: size, height: size }}
    >
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            marginLeft: pos.x,
            marginTop: pos.y,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, pos.scale, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            delay: pos.delay,
            repeat: Infinity,
            repeatDelay: 0.6,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
              fill="#FFF9C4"
              stroke="#FDCB6E"
              strokeWidth={0.5}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
