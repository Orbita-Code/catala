"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MatchingTask } from "@/types/tasks";

interface Props {
  task: MatchingTask;
  onComplete: (correct: boolean) => void;
}

export default function Matching({ task, onComplete }: Props) {
  const [selected, setSelected] = useState<{ side: "left" | "right"; index: number } | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null);
  const shuffledRight = useState(() => {
    const indices = task.pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  })[0];

  const handleSelect = (side: "left" | "right", index: number) => {
    if (matched.has(index) && side === "left") return;
    if (side === "right" && matched.has(shuffledRight[index])) return;

    if (!selected) {
      setSelected({ side, index });
      return;
    }

    if (selected.side === side) {
      setSelected({ side, index });
      return;
    }

    const leftIdx = side === "left" ? index : selected.index;
    const rightDisplayIdx = side === "right" ? index : selected.index;
    const rightActualIdx = shuffledRight[rightDisplayIdx];

    if (leftIdx === rightActualIdx) {
      const newMatched = new Set(matched);
      newMatched.add(leftIdx);
      setMatched(newMatched);
      setSelected(null);
      setWrongPair(null);

      if (newMatched.size === task.pairs.length) {
        setTimeout(() => onComplete(true), 800);
      }
    } else {
      setWrongPair({ left: leftIdx, right: rightDisplayIdx });
      setSelected(null);
      setTimeout(() => setWrongPair(null), 600);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <div className="flex flex-col gap-2 flex-1 max-w-[200px]">
        {task.pairs.map((pair, i) => (
          <motion.button
            key={`left-${i}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect("left", i)}
            className={`p-3 rounded-2xl text-base font-bold text-center transition-all ${
              matched.has(i)
                ? "bg-green-100 text-green-700 border-2 border-green-400"
                : selected?.side === "left" && selected.index === i
                  ? "bg-purple-100 border-2 border-[var(--primary)] text-[var(--primary)]"
                  : wrongPair?.left === i
                    ? "bg-red-100 border-2 border-[var(--error)] animate-[shake_0.3s]"
                    : "bg-white border-2 border-gray-200 text-[var(--text)]"
            }`}
          >
            {pair.left}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col gap-2 flex-1 max-w-[200px]">
        {shuffledRight.map((actualIdx, displayIdx) => (
          <motion.button
            key={`right-${displayIdx}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect("right", displayIdx)}
            className={`p-3 rounded-2xl text-base font-bold text-center transition-all ${
              matched.has(actualIdx)
                ? "bg-green-100 text-green-700 border-2 border-green-400"
                : selected?.side === "right" && selected.index === displayIdx
                  ? "bg-purple-100 border-2 border-[var(--primary)] text-[var(--primary)]"
                  : wrongPair?.right === displayIdx
                    ? "bg-red-100 border-2 border-[var(--error)] animate-[shake_0.3s]"
                    : "bg-white border-2 border-gray-200 text-[var(--text)]"
            }`}
          >
            {task.pairs[actualIdx].right}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
