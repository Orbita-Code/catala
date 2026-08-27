"use client";

import { useState, useCallback, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WriteAntonymTask, TaskResult } from "@/types/tasks";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import { RefreshCcw } from "lucide-react";

interface Props {
  task: WriteAntonymTask;
  onComplete: (result: TaskResult) => void;
  /** When true, show the solved state: every antonym pre-filled and marked green. */
  review?: boolean;
}

export default function WriteAntonym({ task, onComplete, review = false }: Props) {
  // In review mode the task is already solved: pre-fill every pair with its correct
  // antonym and mark it checked+correct (shown green with a ✅).
  const [answers, setAnswers] = useState<Record<number, string>>(() =>
    review
      ? Object.fromEntries(task.pairs.map((p, i) => [i, p.antonym]))
      : {}
  );
  const [checked, setChecked] = useState(review);
  const [results, setResults] = useState<Record<number, boolean>>(() =>
    review
      ? Object.fromEntries(task.pairs.map((_, i) => [i, true]))
      : {}
  );

  const handleSelect = (pairIdx: number, option: string) => {
    if (checked) return;
    setAnswers({ ...answers, [pairIdx]: option });
  };

  const handleInput = (pairIdx: number, value: string) => {
    if (checked) return;
    setAnswers({ ...answers, [pairIdx]: value });
  };

  const handleCheck = useCallback(() => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    const erroredItems: string[] = [];

    task.pairs.forEach((pair, i) => {
      const isCorrect =
        answers[i]?.trim().toLowerCase() === pair.antonym.toLowerCase();
      newResults[i] = isCorrect;
      if (!isCorrect) {
        allCorrect = false;
        /**
         * VEŽBA SE REČ KOJU DETE NIJE ZNALO, NE ONA KOJU JE DOBILO
         * (27.08.2026). Ranije se pamtila `pair.word` — reč koja je detetu
         * bila DATA na ekranu. Ona mu nije bila problem; problem je bio njen
         * suprotan par, koji nije umelo da napiše.
         */
        erroredItems.push(pair.antonym);
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
  }, [answers, task.pairs, onComplete]);

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setAnswers({});
  };

  // Retry only a single wrong pair
  const handleRetrySingle = (pairIdx: number) => {
    const newAnswers = { ...answers };
    delete newAnswers[pairIdx];
    setAnswers(newAnswers);

    const newResults = { ...results };
    delete newResults[pairIdx];
    setResults(newResults);

    setChecked(false);
  };

  const allAnswered = task.pairs.every((_, i) => answers[i]?.trim());
  const allCorrect = checked && Object.values(results).every(Boolean);

  return (
    <div className="space-y-4">
      {/* Parovi idu dva-tri u red kad ima mesta umesto jedan ispod drugog. */}
      <div
        className="task-cards-fill"
        style={{ "--card-min": "320px", "--card-gap": "1rem" } as CSSProperties}
      >
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
                  {results[i] ? "✅" : (
                    <button
                      onClick={() => handleRetrySingle(i)}
                      className="inline-flex items-center justify-center p-1 rounded-full hover:bg-orange-100 transition-colors"
                      aria-label="Torna a provar"
                    >
                      <RefreshCcw className="w-5 h-5 text-orange-500" />
                    </button>
                  )}
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
      </div>

      {/* Comprova button */}
      {allAnswered && !checked && (
        <div className="task-action-bar">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Comprova!
          </motion.button>
        </div>
      )}

      {/* Retry button - only shown after wrong answer */}
      {checked && !allCorrect && (
        <div className="task-action-bar">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="px-8 py-3 bg-[var(--secondary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Torna a provar!
          </motion.button>
        </div>
      )}
    </div>
  );
}
