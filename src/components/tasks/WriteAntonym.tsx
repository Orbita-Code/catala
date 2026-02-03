"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WriteAntonymTask, TaskResult } from "@/types/tasks";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";

interface Props {
  task: WriteAntonymTask;
  onComplete: (result: TaskResult) => void;
}

export default function WriteAntonym({ task, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleSelect = (pairIdx: number, option: string) => {
    if (checked) return;
    setAnswers({ ...answers, [pairIdx]: option });
  };

  const handleInput = (pairIdx: number, value: string) => {
    if (checked) return;
    setAnswers({ ...answers, [pairIdx]: value });
  };

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    const erroredItems: string[] = [];

    task.pairs.forEach((pair, i) => {
      const isCorrect =
        answers[i]?.trim().toLowerCase() === pair.antonym.toLowerCase();
      newResults[i] = isCorrect;
      if (!isCorrect) {
        allCorrect = false;
        erroredItems.push(pair.word);
      }
    });

    setResults(newResults);
    setChecked(true);

    if (allCorrect) {
      const words = task.pairs.map((p) => `${p.word} - ${p.antonym}`).join(", ");
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

  const allAnswered = task.pairs.every((_, i) => answers[i]?.trim());
  const allCorrect = checked && Object.values(results).every(Boolean);

  return (
    <div className="space-y-4">
      {task.pairs.map((pair, i) => (
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
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-black text-[var(--primary)] font-handwriting">
              {pair.word}
            </span>
            <span className="text-xl text-[var(--text-light)]">→</span>
            {!pair.options ? (
              <input
                type="text"
                value={answers[i] || ""}
                onChange={(e) => handleInput(i, e.target.value)}
                disabled={checked}
                placeholder="el contrari..."
                className={`flex-1 h-12 px-4 text-lg font-bold rounded-xl border-2 font-handwriting ${
                  checked
                    ? results[i]
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-[var(--primary)]"
                } outline-none`}
              />
            ) : (
              <span
                className={`text-xl font-bold px-3 py-1 rounded-lg ${
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
            <AnimatePresence>
              {checked && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  {results[i] ? "✅" : "❌"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {pair.options && (
            <div className="flex flex-wrap gap-2">
              {pair.options.map((option) => (
                <motion.button
                  key={option}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(i, option)}
                  disabled={checked}
                  className={`px-5 py-3 min-h-[48px] rounded-xl font-bold text-lg font-handwriting transition-all ${
                    answers[i] === option
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-100 text-[var(--text)] hover:bg-gray-200"
                  } disabled:cursor-default`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          )}

          {checked && !results[i] && (
            <p className="text-sm text-[var(--error)] mt-2">
              Resposta: {pair.antonym}
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
