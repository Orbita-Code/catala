"use client";

import AnimatedStar from "@/components/star/AnimatedStar";
import type { StarExpression, StarAnimation } from "@/components/star/starTypes";

interface StarCompanionProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  mood?: StarExpression;
  animation?: StarAnimation;
  message?: string;
  className?: string;
}

/** @deprecated Use AnimatedStar directly */
export default function StarCompanion({
  size = "md",
  mood = "happy",
  animation = "none",
  message,
  className = "",
}: StarCompanionProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AnimatedStar
        size={size}
        expression={mood}
        animation={animation}
        message={message}
      />
    </div>
  );
}
