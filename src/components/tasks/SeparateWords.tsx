"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SeparateWordsTask, TaskResult } from "@/types/tasks";
import { ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { speak } from "@/lib/tts";

interface Props {
  task: SeparateWordsTask;
  onComplete: (result: TaskResult) => void;
}

export default function SeparateWords({ task, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [separators, setSeparators] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [erroredItems, setErroredItems] = useState<string[]>([]);

  const currentItem = task.items[currentIdx];

  const getCorrectSeparatorPositions = (): Set<number> => {
    const positions = new Set<number>();
    let pos = 0;
    for (let i = 0; i < currentItem.words.length - 1; i++) {
      pos += currentItem.words[i].length;
      positions.add(pos);
    }
    return positions;
  };

  const moveToNext = useCallback(() => {
    if (currentIdx < task.items.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSeparators(new Set());
      setChecked(false);
      setCorrect(null);
    } else {
      onComplete({
        allCorrect: erroredItems.length === 0,
        erroredItems,
      });
    }
  }, [currentIdx, task.items.length, onComplete, erroredItems]);

  const toggleSeparator = (position: number) => {
    if (checked) return;
    const newSeps = new Set(separators);
    if (newSeps.has(position)) {
      newSeps.delete(position);
    } else {
      newSeps.add(position);
    }
    setSeparators(newSeps);
  };

  const handleCheck = () => {
    const correctPositions = getCorrectSeparatorPositions();
    const isCorrect =
      separators.size === correctPositions.size &&
      [...separators].every((p) => correctPositions.has(p));

    setChecked(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#6C5CE7", "#FDCB6E", "#00CECE"],
      });
      speak(currentItem.words.join(" "));
      setTimeout(() => moveToNext(), 1200);
    } else {
      setErroredItems((prev) =>
        prev.includes(currentItem.joined) ? prev : [...prev, currentItem.joined]
      );
    }
  };

  const handleRetry = () => {
    setSeparators(new Set());
    setChecked(false);
    setCorrect(null);
  };

  // Build letter array with clickable gaps between them
  const letters = currentItem.joined.split("");
  const correctPositions = checked ? getCorrectSeparatorPositions() : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3 text-sm text-[var(--text-light)]">
        {currentIdx > 0 && (
          <button
            onClick={() => {
              setCurrentIdx(currentIdx - 1);
              setSeparators(new Set());
              setChecked(false);
              setCorrect(null);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Anterior"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <span>
          {currentIdx + 1} / {task.items.length}
        </span>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        <p className="text-center text-sm text-[var(--text-light)] mb-4">
          Toca entre les lletres per separar les paraules
        </p>

        <div className="flex flex-wrap justify-center items-center gap-0 mb-5">
          {letters.map((letter, i) => (
            <div key={i} className="flex items-center">
              <span className="text-2xl font-black text-[var(--primary)] font-handwriting px-0.5">
                {letter}
              </span>
              {i < letters.length - 1 && (
                <button
                  onClick={() => toggleSeparator(i + 1)}
                  disabled={checked}
                  className={`w-6 h-10 flex items-center justify-center mx-0.5 rounded transition-all ${
                    separators.has(i + 1)
                      ? checked
                        ? correctPositions?.has(i + 1)
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                        : "bg-purple-200 text-[var(--primary)]"
                      : checked && correctPositions?.has(i + 1)
                        ? "bg-green-100 text-green-600"
                        : "hover:bg-gray-100"
                  }`}
                >
                  {separators.has(i + 1) ? (
                    <span className="text-lg font-bold">|</span>
                  ) : checked && correctPositions?.has(i + 1) ? (
                    <span className="text-lg font-bold text-green-500">|</span>
                  ) : (
                    <span className="text-gray-300">·</span>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {checked && correct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4"
            >
              <p className="text-green-600 font-bold text-lg">
                {currentItem.words.join(" / ")}
              </p>
            </motion.div>
          )}
          {checked && !correct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4"
            >
              <p className="text-[var(--error)] font-bold">
                Resposta correcta: {currentItem.words.join(" / ")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-3">
          {!checked ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheck}
              disabled={separators.size === 0}
              className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg disabled:opacity-40 shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
            >
              Comprova!
            </motion.button>
          ) : !correct ? (
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
      </motion.div>
    </div>
  );
}
