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
  /** When true, show the solved state: separators placed at the correct splits, all green. */
  review?: boolean;
}

// Correct separator positions for an item = cumulative word lengths (splits).
function correctSeparatorsFor(item: SeparateWordsTask["items"][number]): Set<number> {
  const positions = new Set<number>();
  let pos = 0;
  for (let i = 0; i < item.words.length - 1; i++) {
    pos += item.words[i].length;
    positions.add(pos);
  }
  return positions;
}

export default function SeparateWords({ task, onComplete, review = false }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  // In review mode pre-place the correct separators for the first item and mark
  // it checked+correct so the splits render green with the solved sentence.
  const [separators, setSeparators] = useState<Set<number>>(() =>
    review ? correctSeparatorsFor(task.items[0]) : new Set()
  );
  const [checked, setChecked] = useState(review);
  const [correct, setCorrect] = useState<boolean | null>(review ? true : null);
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
        className="bg-white rounded-2xl px-2 py-4 shadow-sm"
      >
        <p className="text-center text-sm text-[var(--text-light)] mb-4">
          Toca les línies per separar les paraules
        </p>

        {/* Letters displayed with tap zones between them - wraps on narrow screens */}
        <div className="flex flex-wrap justify-center items-center mb-5 w-full px-1">
          {letters.map((letter, i) => {
            const hasSeparatorAfter = separators.has(i + 1);
            const isCorrectPosition = correctPositions?.has(i + 1);
            const isLastLetter = i === letters.length - 1;
            // Hide the tap zone right before sentence-final punctuation —
            // the period/comma/!/? stays attached to its word, so showing a
            // dashed line there only tempts kids to place a wrong separator.
            const nextIsPunctuation = !isLastLetter && /[.,!?]/.test(letters[i + 1]);

            return (
              <span key={i} className="inline-flex items-center">
                {/* The letter itself */}
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--primary)] font-handwriting select-none">
                  {letter}
                </span>

                {/* Clickable zone between letters (not after the last letter, not before punctuation) */}
                {!isLastLetter && !nextIsPunctuation && (
                  <button
                    onClick={() => toggleSeparator(i + 1)}
                    disabled={checked}
                    className={`relative inline-flex items-center justify-center transition-all duration-200 min-h-[56px] min-w-[44px] sm:min-w-[52px] rounded-lg ${
                      hasSeparatorAfter
                        ? ""
                        : checked && isCorrectPosition
                          ? ""
                          : "cursor-pointer active:scale-110 hover:bg-purple-50 active:bg-purple-100"
                    }`}
                    style={{ touchAction: "manipulation" }}
                    aria-label={hasSeparatorAfter ? "Treu espai" : "Afegeix espai"}
                  >
                    {/* Visual indicator — fills the full tap area so any tap on the strip works */}
                    {hasSeparatorAfter ? (
                      // User placed a separator here
                      <span
                        className={`w-2.5 h-12 rounded-full ${
                          checked
                            ? isCorrectPosition
                              ? "bg-green-500"
                              : "bg-red-500"
                            : "bg-amber-400"
                        }`}
                      />
                    ) : checked && isCorrectPosition ? (
                      // Missed separator - show in light green
                      <span className="w-2.5 h-12 rounded-full bg-green-300" />
                    ) : (
                      // Default: dashed line spans the full tap area, so kids can
                      // tap anywhere along the strip instead of having to aim at the tip
                      <span className="w-1.5 h-12 border-l-[4px] border-dashed border-purple-400 group-hover:border-purple-600" />
                    )}
                  </button>
                )}
              </span>
            );
          })}
        </div>

        {/* Hint text */}
        {!checked && separators.size === 0 && (
          <p className="text-center text-xs text-purple-400 mb-3 animate-pulse">
            👆 Toca les línies de punts per posar espais
          </p>
        )}

        {/* Show the correctly separated sentence after checking */}
        <AnimatePresence>
          {checked && correct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4"
            >
              <p className="text-green-600 font-bold text-2xl md:text-3xl font-handwriting">
                {currentItem.words.join(" ")} ✅
              </p>
            </motion.div>
          )}
          {checked && !correct && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4"
            >
              <p className="text-[var(--error)] font-bold text-xl md:text-2xl font-handwriting">
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
