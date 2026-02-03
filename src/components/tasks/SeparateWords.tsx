"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SeparateWordsTask, TaskResult } from "@/types/tasks";
import { ArrowLeft } from "lucide-react";
import { celebrate, celebrateBig } from "@/lib/confetti";
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
      celebrate();
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

        {/* Letters displayed CONNECTED - click between them to add space */}
        <div className="flex flex-wrap justify-center items-center mb-5 leading-relaxed">
          {letters.map((letter, i) => {
            const hasSeparatorAfter = separators.has(i + 1);
            const isCorrectPosition = correctPositions?.has(i + 1);
            const showSeparator = hasSeparatorAfter || (checked && isCorrectPosition);
            const isLastLetter = i === letters.length - 1;

            return (
              <span key={i} className="inline-flex items-center">
                {/* The letter itself - no padding, letters touch each other */}
                <span className="text-2xl font-black text-[var(--primary)] font-handwriting select-none">
                  {letter}
                </span>

                {/* Clickable gap between letters (not after the last letter) */}
                {!isLastLetter && (
                  <button
                    onClick={() => toggleSeparator(i + 1)}
                    disabled={checked}
                    className={`inline-flex items-center justify-center transition-all duration-200 ${
                      showSeparator
                        ? checked
                          ? hasSeparatorAfter && isCorrectPosition
                            ? "w-4 h-8 bg-green-400 rounded-sm mx-0.5" // Correct separator - green
                            : hasSeparatorAfter && !isCorrectPosition
                              ? "w-4 h-8 bg-red-400 rounded-sm mx-0.5" // Wrong separator - red
                              : "w-4 h-8 bg-green-300 rounded-sm mx-0.5" // Missed separator - light green
                          : "w-4 h-8 bg-amber-400 rounded-sm mx-0.5" // User-placed separator - yellow/amber
                        : "w-0 hover:w-2 hover:bg-purple-200 hover:mx-0.5 rounded-sm cursor-pointer" // Hidden but clickable
                    }`}
                    aria-label={showSeparator ? "Espai" : "Afegeix espai"}
                  />
                )}
              </span>
            );
          })}
        </div>

        {/* Show the correctly separated sentence after checking */}
        <AnimatePresence>
          {checked && correct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4"
            >
              <p className="text-green-600 font-bold text-lg font-handwriting">
                {currentItem.words.join(" ")}
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
                Resposta correcta: {currentItem.words.join(" ")}
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
