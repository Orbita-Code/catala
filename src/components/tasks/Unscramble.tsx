"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UnscrambleTask } from "@/types/tasks";

interface Props {
  task: UnscrambleTask;
  onComplete: (correct: boolean) => void;
}

export default function Unscramble({ task, onComplete }: Props) {
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    task.words.forEach((w, i) => {
      const correct =
        inputs[i]?.trim().toUpperCase() === w.correct.toUpperCase();
      newResults[i] = correct;
      if (!correct) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect) {
      setTimeout(() => onComplete(true), 1200);
    }
  };

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setInputs({});
  };

  const allFilled = task.words.every((_, i) => inputs[i]?.trim());
  const allCorrect = checked && Object.values(results).every(Boolean);

  return (
    <div className="space-y-4">
      {task.words.map((word, i) => (
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
          <div className="flex items-center gap-2 mb-2">
            {word.scrambled.split("").map((letter, j) => (
              <span
                key={j}
                className="w-9 h-9 flex items-center justify-center bg-[var(--accent)] text-[var(--text)] font-black text-lg rounded-lg"
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputs[i] || ""}
              onChange={(e) =>
                setInputs({ ...inputs, [i]: e.target.value.toUpperCase() })
              }
              disabled={checked}
              maxLength={word.correct.length}
              className={`flex-1 px-3 py-2 rounded-xl border-2 text-base font-bold uppercase tracking-wider outline-none ${
                checked
                  ? results[i]
                    ? "border-[var(--success)] bg-green-50"
                    : "border-[var(--error)] bg-red-50"
                  : "border-gray-200 focus:border-[var(--primary)]"
              }`}
              placeholder="Escriu la paraula..."
            />
            <AnimatePresence>
              {checked && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  {results[i] ? "✅" : "❌"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}

      <div className="flex justify-center pt-2">
        {!checked ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            disabled={!allFilled}
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
