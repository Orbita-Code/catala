"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountAndWriteTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import { RefreshCcw } from "lucide-react";

interface Props {
  task: CountAndWriteTask;
  onComplete: (result: TaskResult) => void;
}

export default function CountAndWrite({ task, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [erroredItems, setErroredItems] = useState<string[]>([]);

  const currentItem = task.items[currentIdx];
  const illustration = getWordIllustration(currentItem.description);

  const handleCheck = useCallback(() => {
    const trimmed = answer.trim();
    // Accept either the number or the word
    const isCorrect =
      trimmed === String(currentItem.count) ||
      trimmed.toLowerCase() === currentItem.word.toLowerCase();

    setChecked(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      celebrate();
      speak(`${currentItem.count} ${currentItem.description}`);
      setTimeout(() => {
        if (currentIdx < task.items.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setAnswer("");
          setChecked(false);
          setCorrect(null);
        } else {
          onComplete({
            allCorrect: erroredItems.length === 0,
            erroredItems,
          });
        }
      }, 1200);
    } else {
      setErroredItems((prev) =>
        prev.includes(currentItem.description)
          ? prev
          : [...prev, currentItem.description]
      );
    }
  }, [answer, currentItem, currentIdx, task.items.length, erroredItems, onComplete]);

  // Auto-check when answer is entered
  useEffect(() => {
    if (answer.trim() && !checked) {
      const timer = setTimeout(() => {
        handleCheck();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [answer, checked, handleCheck]);

  const handleRetry = () => {
    setChecked(false);
    setCorrect(null);
    setAnswer("");
  };

  // Generate array of items to display for counting
  const itemsToShow = Array(currentItem.count).fill(null);

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {currentIdx + 1} / {task.items.length}
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        {/* Instruction */}
        <p className="text-center text-sm text-[var(--text-light)] mb-4">
          Compta i escriu el número
        </p>

        {/* Images to count */}
        <div className="flex flex-wrap justify-center gap-2 mb-5 min-h-[100px]">
          {itemsToShow.map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
            >
              {illustration ? (
                <img
                  src={illustration}
                  alt={currentItem.description}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--primary)]">?</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Question */}
        <p className="text-center text-lg font-semibold text-[var(--text)] mb-4 font-handwriting">
          Quants/Quantes {currentItem.description} hi ha?
        </p>

        {/* Answer input */}
        <div className="flex justify-center gap-3 items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={answer}
            onChange={(e) => !checked && setAnswer(e.target.value)}
            disabled={checked}
            placeholder="?"
            className={`w-20 h-14 text-center text-2xl font-bold rounded-xl border-3 outline-none transition-all ${
              checked
                ? correct
                  ? "border-green-400 bg-green-50"
                  : "border-red-400 bg-red-50"
                : "border-gray-200 focus:border-[var(--primary)]"
            }`}
            autoFocus
          />
          <AnimatePresence>
            {checked && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">
                {correct ? "✅" : (
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center p-1 rounded-full hover:bg-orange-100 transition-colors"
                    aria-label="Torna a provar"
                  >
                    <RefreshCcw className="w-6 h-6 text-orange-500" />
                  </button>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Show correct answer if wrong */}
        {checked && !correct && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[var(--error)] mt-3 font-semibold"
          >
            Resposta: {currentItem.count} ({currentItem.word})
          </motion.p>
        )}

        {/* Retry button - only shown after wrong answer */}
        {checked && !correct && (
          <div className="flex justify-center pt-4">
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
      </motion.div>
    </div>
  );
}
