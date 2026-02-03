"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountAndWriteTask, TaskResult } from "@/types/tasks";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";

interface Props {
  task: CountAndWriteTask;
  onComplete: (result: TaskResult) => void;
}

export default function CountAndWrite({ task, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, { count: string; word: string }>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleChange = (idx: number, field: "count" | "word", value: string) => {
    if (checked) return;
    setAnswers({
      ...answers,
      [idx]: {
        ...answers[idx],
        [field]: value,
      },
    });
  };

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    const erroredItems: string[] = [];

    task.items.forEach((item, i) => {
      const answer = answers[i];
      const countCorrect = answer?.count?.trim() === String(item.count);
      const wordCorrect = answer?.word?.trim().toLowerCase() === item.word.toLowerCase();
      const isCorrect = countCorrect && wordCorrect;
      newResults[i] = isCorrect;
      if (!isCorrect) {
        allCorrect = false;
        erroredItems.push(item.word);
      }
    });

    setResults(newResults);
    setChecked(true);

    if (allCorrect) {
      const words = task.items.map((item) => `${item.count} ${item.word}`).join(", ");
      speak(words);
      celebrate();
      setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
    }
  };

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setAnswers({});
  };

  const allAnswered = task.items.every(
    (_, i) => answers[i]?.count?.trim() && answers[i]?.word?.trim()
  );
  const allCorrect = checked && Object.values(results).every(Boolean);

  return (
    <div className="space-y-4">
      {task.items.map((item, i) => (
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
          <p className="text-lg font-semibold text-[var(--text)] mb-3 font-handwriting">
            {item.description}
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="99"
              value={answers[i]?.count || ""}
              onChange={(e) => handleChange(i, "count", e.target.value)}
              disabled={checked}
              placeholder="?"
              className={`w-16 h-12 text-center text-xl font-bold rounded-xl border-2 ${
                checked
                  ? results[i]
                    ? "border-green-400 bg-green-50"
                    : "border-red-400 bg-red-50"
                  : "border-gray-200 focus:border-[var(--primary)]"
              } outline-none`}
            />
            <input
              type="text"
              value={answers[i]?.word || ""}
              onChange={(e) => handleChange(i, "word", e.target.value)}
              disabled={checked}
              placeholder="paraula"
              className={`flex-1 h-12 px-4 text-lg font-bold rounded-xl border-2 font-handwriting ${
                checked
                  ? results[i]
                    ? "border-green-400 bg-green-50"
                    : "border-red-400 bg-red-50"
                  : "border-gray-200 focus:border-[var(--primary)]"
              } outline-none`}
            />
            <AnimatePresence>
              {checked && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  {results[i] ? "✅" : "❌"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {checked && !results[i] && (
            <p className="text-sm text-[var(--error)] mt-2">
              Resposta: {item.count} {item.word}
            </p>
          )}
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
