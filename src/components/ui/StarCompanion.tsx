"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { StarMood } from "@/lib/encouragement";

const moodStyles: Record<StarMood, string> = {
  happy: "none",
  smart: "hue-rotate(30deg)",
  confused: "hue-rotate(180deg) brightness(1.1)",
  sad: "saturate(0.5) brightness(0.9)",
  loving: "hue-rotate(300deg) brightness(1.1)",
};

interface StarCompanionProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  mood?: StarMood;
  animation?: "idle" | "bounce" | "spin" | "dance" | "wave" | "none";
  message?: string;
  className?: string;
}

const sizeMap = {
  xs: 28,
  sm: 40,
  md: 56,
  lg: 120,
  xl: 160,
};

const animationVariants = {
  idle: {
    y: [0, -4, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
  },
  bounce: {
    y: [0, -12, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" as const },
  },
  spin: {
    rotate: [0, 360],
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" as const },
  },
  dance: {
    rotate: [0, -15, 15, -15, 15, 0],
    scale: [1, 1.1, 1, 1.1, 1],
    transition: { duration: 1.2, repeat: Infinity },
  },
  wave: {
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.6, repeat: 2 },
  },
  none: {},
};

export default function StarCompanion({
  size = "md",
  mood = "happy",
  animation = "none",
  message,
  className = "",
}: StarCompanionProps) {
  const px = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={animationVariants[animation]}
        className="flex-shrink-0"
      >
        <Image
          src="/star-mascot.png"
          alt="Estrella mascota"
          width={px}
          height={px}
          className="rounded-full object-cover"
          style={{ filter: moodStyles[mood] }}
        />
      </motion.div>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-white rounded-2xl px-3 py-1.5 shadow-md border border-gray-100 max-w-[200px]"
        >
          <div className="absolute left-[-7px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[7px] border-r-white" />
          <p className="text-sm font-bold text-[var(--text)]">{message}</p>
        </motion.div>
      )}
    </div>
  );
}
