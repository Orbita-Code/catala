"use client";

import { motion } from "framer-motion";

interface LetterTileProps {
  letter: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  correct?: boolean | null; // null = unchecked, true = correct, false = wrong
  size?: "sm" | "md" | "lg";
  wide?: boolean;
}

const sizeClasses = {
  sm: "w-10 h-10 text-lg",
  md: "w-12 h-12 text-xl",
  lg: "w-14 h-14 text-2xl",
};

const wideSizeClasses = {
  sm: "min-w-10 h-10 px-2 text-lg",
  md: "min-w-12 h-12 px-3 text-xl",
  lg: "min-w-14 h-14 px-4 text-2xl",
};

export default function LetterTile({
  letter,
  onClick,
  disabled = false,
  selected = false,
  correct = null,
  size = "md",
  wide = false,
}: LetterTileProps) {
  const classes = wide ? wideSizeClasses[size] : sizeClasses[size];
  const baseClasses = `${classes} flex items-center justify-center rounded-xl font-black select-none transition-all`;

  const stateClasses =
    correct === true
      ? "bg-green-100 text-green-700 border-2 border-green-400"
      : correct === false
        ? "bg-red-100 text-red-700 border-2 border-red-400"
        : selected
          ? "bg-[var(--primary)] text-white border-2 border-[var(--primary)] shadow-md"
          : disabled
            ? "bg-gray-100 text-gray-300 border-2 border-gray-200"
            : "bg-[var(--accent)] text-[var(--text)] border-2 border-amber-300 shadow-sm";

  return (
    <motion.button
      type="button"
      whileTap={!disabled ? { scale: 0.9 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${stateClasses}`}
    >
      {letter.toUpperCase()}
    </motion.button>
  );
}
