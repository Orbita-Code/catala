"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyWordTask } from "@/types/tasks";

interface Props {
  task: CopyWordTask;
  onComplete: (correct: boolean) => void;
}

export default function CopyWord({ task, onComplete }: Props) {
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    task.words.forEach((word, i) => {
      const isCorrect =
        inputs[i]?.trim().toLowerCase() === word.catalan.toLowerCase();
      newResults[i] = isCorrect;
      if (!isCorrect) allCorrect = false;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {task.words.map((word, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm"
          >
            <span className="text-lg font-bold text-[var(--primary)] min-w-[100px]">
              {word.catalan}
            </span>
            <span className="text-[var(--text-light)]">&rarr;</span>
            <input
              type="text"
              value={inputs[i] || ""}
              onChange={(e) =>
                setInputs({ ...inputs, [i]: e.target.value })
              }
              disabled={checked}
              className={`flex-1 px-3 py-2 rounded-xl border-2 text-base font-semibold outline-none transition-colors ${
                checked
                  ? results[i]
                    ? "border-[var(--success)] bg-green-50 text-green-700"
                    : "border-[var(--error)] bg-red-50 text-red-700"
                  : "border-gray-200 focus:border-[var(--primary)]"
              }`}
              placeholder="Escriu aquí..."
            />
            <AnimatePresence>
              {checked && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xl"
                >
                  {results[i] ? "✅" : "❌"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

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
