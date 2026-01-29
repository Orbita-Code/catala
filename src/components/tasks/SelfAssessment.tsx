"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SelfAssessmentTask, TaskResult } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";
import SpeakerButton from "@/components/ui/SpeakerButton";

interface Props {
  task: SelfAssessmentTask;
  onComplete: (result: TaskResult) => void;
}

export default function SelfAssessment({ task, onComplete }: Props) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [ratings, setRatings] = useState<Record<number, "yes" | "no" | "maybe">>({});

  const handleReveal = (idx: number) => {
    const newRevealed = new Set(revealed);
    newRevealed.add(idx);
    setRevealed(newRevealed);
  };

  const handleRate = (idx: number, rating: "yes" | "no" | "maybe") => {
    setRatings({ ...ratings, [idx]: rating });
  };

  const allRated = task.items.every((_, i) => ratings[i]);

  return (
    <div className="space-y-3">
      {task.items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2">
              {getWordEmoji(item.catalan) && <span className="text-2xl">{getWordEmoji(item.catalan)}</span>}
              <span className="text-xl font-bold text-[var(--primary)] font-handwriting">{item.catalan}</span>
              <SpeakerButton text={item.catalan} size={16} />
            </span>
            {revealed.has(i) ? (
              <span className="text-base text-[var(--text-light)] italic">
                ({item.translation})
              </span>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReveal(i)}
                className="text-xs px-3 py-1 bg-gray-100 rounded-full text-[var(--text-light)] font-semibold"
              >
                Mostra traducció
              </motion.button>
            )}
          </div>
          <div className="flex gap-2">
            {(["yes", "maybe", "no"] as const).map((rating) => (
              <motion.button
                key={rating}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRate(i, rating)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  ratings[i] === rating
                    ? rating === "yes"
                      ? "bg-green-100 text-green-700 ring-2 ring-green-400"
                      : rating === "maybe"
                        ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400"
                        : "bg-red-100 text-red-700 ring-2 ring-red-400"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                {rating === "yes" ? "Ho sé! ✅" : rating === "maybe" ? "Quasi 🤔" : "No ho sé ❌"}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}

      {allRated && (
        <div className="flex justify-center pt-2">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete({ allCorrect: true, erroredItems: [] })}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
          >
            Continua!
          </motion.button>
        </div>
      )}
    </div>
  );
}
