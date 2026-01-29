"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FillSentenceTask, TaskResult } from "@/types/tasks";
import confetti from "canvas-confetti";

interface Props {
  task: FillSentenceTask;
  onComplete: (result: TaskResult) => void;
}

export default function FillSentence({ task, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleSelect = (sentenceIdx: number, option: string) => {
    if (checked) return;
    setAnswers({ ...answers, [sentenceIdx]: option });
  };

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    task.sentences.forEach((s, i) => {
      const correct = answers[i]?.toLowerCase() === s.blank.toLowerCase();
      newResults[i] = correct;
      if (!correct) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect) {
      // Celebration confetti
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#6C5CE7", "#FDCB6E", "#00CECE"],
      });
      setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
    }
  };

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setAnswers({});
  };

  const allAnswered = task.sentences.every((_, i) => answers[i]);
  const allCorrect = checked && Object.values(results).every(Boolean);

  return (
    <div className="space-y-4">
      {task.sentences.map((sentence, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`bg-white rounded-2xl p-4 shadow-sm ${
            checked
              ? results[i]
                ? "ring-2 ring-[var(--success)]"
                : "ring-2 ring-[var(--error)]"
              : ""
          }`}
        >
          <p className="text-lg font-semibold text-[var(--text)] mb-3">
            {sentence.text.split("___").map((part, j, arr) => (
              <span key={j}>
                {part}
                {j < arr.length - 1 && (
                  <span
                    className={`inline-block px-3 py-0.5 mx-1 rounded-lg font-bold ${
                      answers[i]
                        ? checked
                          ? results[i]
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          : "bg-purple-100 text-[var(--primary)]"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {answers[i] || "___"}
                  </span>
                )}
              </span>
            ))}
            <AnimatePresence>
              {checked && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2"
                >
                  {results[i] ? "✅" : "❌"}
                </motion.span>
              )}
            </AnimatePresence>
          </p>
          <div className="flex flex-wrap gap-2">
            {sentence.options?.map((option) => (
              <motion.button
                key={option}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(i, option)}
                disabled={checked}
                className={`px-5 py-3 min-h-[48px] rounded-xl font-bold text-base transition-all ${
                  answers[i] === option
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-100 text-[var(--text)] hover:bg-gray-200"
                } disabled:cursor-default`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}

      <div className="flex justify-center pt-2">
        {!checked ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            disabled={!allAnswered}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg disabled:opacity-40 shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
          >
            Comprova!
          </motion.button>
        ) : !allCorrect ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="px-8 py-3 bg-[var(--secondary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Torna a provar!
          </motion.button>
        ) : null}
      </div>
    </div>
  );
}
