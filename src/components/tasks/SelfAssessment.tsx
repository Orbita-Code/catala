"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SelfAssessmentTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { speak } from "@/lib/tts";
import { Eye } from "lucide-react";

interface Props {
  task: SelfAssessmentTask;
  onComplete: (result: TaskResult) => void;
}

export default function SelfAssessment({ task, onComplete }: Props) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [ratings, setRatings] = useState<Record<number, "yes" | "no" | "maybe">>({});

  const handleReveal = (idx: number, catalanWord: string) => {
    const newRevealed = new Set(revealed);
    newRevealed.add(idx);
    setRevealed(newRevealed);
    // Auto-speak the Catalan word when revealed
    speak(catalanWord);
  };

  const handleRate = (idx: number, rating: "yes" | "no" | "maybe") => {
    setRatings({ ...ratings, [idx]: rating });
  };

  const allRated = task.items.every((_, i) => ratings[i]);

  return (
    <div className="space-y-3">
      {/* Instruction with speaker */}
      <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-purple-50 rounded-xl">
        <SpeakerButton text="Mira el dibuix i intenta dir la paraula en català!" size={20} />
        <p className="text-sm text-[var(--primary)] font-semibold">
          Mira el dibuix i intenta dir la paraula en català!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {task.items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center"
          >
            {/* Show illustration only - no text! */}
            {getWordIllustration(item.catalan) ? (
              <img
                src={getWordIllustration(item.catalan)!}
                alt=""
                className="w-20 h-20 object-contain mb-2"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-xl mb-2 flex items-center justify-center text-3xl">
                ❓
              </div>
            )}

            {/* Reveal button or revealed answer */}
            {revealed.has(i) ? (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                  <span className="text-base font-bold text-green-600 font-handwriting">
                    {item.catalan}
                  </span>
                  <SpeakerButton text={item.catalan} size={16} />
                </div>

                {/* Rating buttons */}
                <div className="flex gap-1 mt-2">
                  {(["yes", "maybe", "no"] as const).map((rating) => (
                    <motion.button
                      key={rating}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRate(i, rating)}
                      className={`w-8 h-8 rounded-full text-lg transition-all ${
                        ratings[i] === rating
                          ? rating === "yes"
                            ? "bg-green-200 ring-2 ring-green-400"
                            : rating === "maybe"
                              ? "bg-yellow-200 ring-2 ring-yellow-400"
                              : "bg-red-200 ring-2 ring-red-400"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {rating === "yes" ? "✅" : rating === "maybe" ? "🤔" : "😅"}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReveal(i, item.catalan)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[var(--primary)] text-white rounded-xl font-semibold text-xs shadow-md"
              >
                <Eye className="w-3 h-3" />
                Mostra
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {allRated && (
        <div className="flex justify-center pt-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete({ allCorrect: true, erroredItems: [] })}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
          >
            Molt bé! Continua! 🎉
          </motion.button>
        </div>
      )}
    </div>
  );
}
