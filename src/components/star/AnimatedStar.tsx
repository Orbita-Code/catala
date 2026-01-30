"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { StarExpression, StarAnimation, StarReaction } from "./starTypes";
import StarSVG from "./StarSVG";
import StarSparkles from "./StarSparkles";
import StarSpeechBubble from "./StarSpeechBubble";
import { bodyAnimationVariants } from "./starAnimations";

const sizeMap: Record<string, number> = {
  xs: 28,
  sm: 40,
  md: 56,
  lg: 120,
  xl: 160,
};

interface AnimatedStarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  expression?: StarExpression;
  /** Backward-compatible alias for expression */
  mood?: StarExpression;
  animation?: StarAnimation;
  /** Reaction or sequence of reactions */
  reaction?: StarReaction | StarReaction[];
  message?: string | null;
  messagePosition?: "right" | "top" | "bottom";
  showSparkles?: boolean;
  show?: boolean;
  className?: string;
  onAnimationComplete?: () => void;
}

export default function AnimatedStar({
  size = "md",
  expression: expressionProp,
  mood,
  animation: animationProp = "none",
  reaction,
  message = null,
  messagePosition = "right",
  showSparkles = false,
  show = true,
  className = "",
  onAnimationComplete,
}: AnimatedStarProps) {
  const prefersReduced = useReducedMotion();

  // Reaction sequence state
  const [reactionIndex, setReactionIndex] = useState(0);
  const [activeExpression, setActiveExpression] = useState<StarExpression>(
    expressionProp ?? mood ?? "happy"
  );
  const [activeAnimation, setActiveAnimation] = useState<StarAnimation>(animationProp);
  const [activeSparkles, setActiveSparkles] = useState(showSparkles);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resolve reactions array
  const reactions: StarReaction[] | null = reaction
    ? Array.isArray(reaction)
      ? reaction
      : [reaction]
    : null;

  // Play reaction sequence
  const playReaction = useCallback(
    (idx: number) => {
      if (!reactions || idx >= reactions.length) {
        onAnimationComplete?.();
        return;
      }
      const r = reactions[idx];
      setActiveExpression(r.expression);
      setActiveAnimation(r.animation);
      setActiveSparkles(r.sparkles ?? false);

      const dur = r.duration ?? 1000;
      timeoutRef.current = setTimeout(() => {
        setReactionIndex(idx + 1);
      }, dur);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reactions?.length, onAnimationComplete]
  );

  useEffect(() => {
    if (reactions && reactions.length > 0) {
      playReaction(reactionIndex);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactionIndex]);

  // Reset when reaction prop changes
  useEffect(() => {
    if (reaction) {
      setReactionIndex(0);
    }
  }, [reaction]);

  // Sync from props when no reaction
  useEffect(() => {
    if (!reaction) {
      setActiveExpression(expressionProp ?? mood ?? "happy");
      setActiveAnimation(animationProp);
      setActiveSparkles(showSparkles);
    }
  }, [expressionProp, mood, animationProp, showSparkles, reaction]);

  const px = typeof size === "number" ? size : sizeMap[size] ?? 56;
  const animVariant = prefersReduced
    ? {}
    : bodyAnimationVariants[activeAnimation] ?? {};

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className={`relative inline-flex items-center ${className}`}
          style={{ width: px, height: px, flexShrink: 0 }}
        >
          {/* Sparkles layer */}
          {activeSparkles && <StarSparkles size={px} />}

          {/* Star body with animation */}
          <motion.div
            animate={animVariant}
            style={{ width: px, height: px }}
          >
            <StarSVG expression={activeExpression} />
          </motion.div>

          {/* Speech bubble */}
          <StarSpeechBubble message={message} position={messagePosition} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
