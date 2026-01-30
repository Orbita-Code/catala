"use client";

import { motion } from "framer-motion";
import AnimatedStar from "@/components/star/AnimatedStar";
import type { StarExpression } from "@/components/star/starTypes";
import { getEncouragement } from "@/lib/encouragement";
import { getStarReaction, getReactionEvent } from "@/lib/starReactions";

interface StarMascotProps {
  mood: StarExpression;
  message?: string;
  show?: boolean;
}

export default function StarMascot({
  mood,
  message,
  show = true,
}: StarMascotProps) {
  return (
    <div className="flex items-center gap-3">
      <AnimatedStar
        size="md"
        expression={mood}
        animation={mood === "happy" ? "wave" : mood === "loving" ? "dance" : "none"}
        message={message}
        show={show}
      />
    </div>
  );
}

export function TaskFeedback({
  result,
  streak,
}: {
  result: "correct" | "wrong" | null;
  streak?: number;
}) {
  if (!result) return null;

  const encouragement =
    streak && streak > 1
      ? getEncouragement("streak", { streakCount: streak })
      : getEncouragement(result);

  const reactionEvent = result === "correct"
    ? getReactionEvent("correct", streak ?? 0)
    : "wrong";
  const reactions = getStarReaction(reactionEvent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <div className="flex items-center gap-3">
        <AnimatedStar
          size="md"
          reaction={reactions}
          message={encouragement.text}
          show={true}
        />
      </div>
    </motion.div>
  );
}
