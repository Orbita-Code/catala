"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClassifyColumnsTask } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";

interface Props {
  task: ClassifyColumnsTask;
  onComplete: (correct: boolean) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ClassifyColumns({ task, onComplete }: Props) {
  const [items] = useState(() => shuffleArray(task.allItems));
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [placed, setPlaced] = useState<Record<string, number>>({});
  const [lastPlacedCorrect, setLastPlacedCorrect] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);

  const allPlaced = currentItemIdx >= items.length;
  const currentItem = allPlaced ? null : items[currentItemIdx];

  const handleColumnTap = (colIdx: number) => {
    if (allPlaced || showResults || !currentItem) return;

    const newPlaced = { ...placed, [currentItem]: colIdx };
    setPlaced(newPlaced);

    // Check if correct
    const correct = task.columns[colIdx].items.includes(currentItem);
    setLastPlacedCorrect(correct);

    setTimeout(() => {
      setLastPlacedCorrect(null);
      setCurrentItemIdx(currentItemIdx + 1);

      // Check if all items placed
      if (currentItemIdx + 1 >= items.length) {
        // Verify all correct
        let allCorrect = true;
        const allPlacements = { ...newPlaced };
        Object.entries(allPlacements).forEach(([item, col]) => {
          if (!task.columns[col].items.includes(item)) {
            allCorrect = false;
          }
        });
        setShowResults(true);
        if (allCorrect) {
          setTimeout(() => onComplete(true), 1200);
        }
      }
    }, 800);
  };

  const handleRetry = () => {
    setPlaced({});
    setCurrentItemIdx(0);
    setShowResults(false);
    setLastPlacedCorrect(null);
  };

  const allCorrect = showResults && Object.entries(placed).every(
    ([item, colIdx]) => task.columns[colIdx].items.includes(item)
  );

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {Math.min(currentItemIdx + 1, items.length)} / {items.length}
      </div>

      {/* Current item to classify */}
      {!allPlaced && currentItem && (
        <motion.div
          key={currentItem}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {getWordEmoji(currentItem) && (
            <div className="text-4xl mb-2">{getWordEmoji(currentItem)}</div>
          )}
          <div className={`inline-block px-6 py-3 rounded-2xl text-xl font-black transition-all ${
            lastPlacedCorrect === true
              ? "bg-green-100 text-green-700"
              : lastPlacedCorrect === false
                ? "bg-red-100 text-red-700"
                : "bg-[var(--accent)] text-[var(--text)]"
          }`}>
            {currentItem}
            {lastPlacedCorrect === true && " ✅"}
            {lastPlacedCorrect === false && " ❌"}
          </div>
        </motion.div>
      )}

      {/* Two big column buttons */}
      {!allPlaced && !showResults && (
        <div className="grid grid-cols-2 gap-4">
          {task.columns.map((col, colIdx) => (
            <motion.button
              key={colIdx}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleColumnTap(colIdx)}
              disabled={lastPlacedCorrect !== null}
              className="min-h-[120px] bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-200 hover:border-[var(--primary)] transition-all flex flex-col items-center justify-center gap-2"
            >
              <h4 className="text-xl font-black text-[var(--primary)]">
                {col.title}
              </h4>
              <div className="text-xs text-[var(--text-light)]">
                {Object.values(placed).filter((c) => c === colIdx).length} posades
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Results view */}
      {showResults && (
        <div className="grid grid-cols-2 gap-3">
          {task.columns.map((col, colIdx) => {
            const colItems = Object.entries(placed)
              .filter(([, idx]) => idx === colIdx)
              .map(([item]) => item);
            return (
              <div key={colIdx} className="bg-white rounded-2xl p-4 shadow-sm">
                <h4 className="text-center font-black text-lg text-[var(--primary)] mb-3">
                  {col.title}
                </h4>
                <div className="space-y-1">
                  {colItems.map((item) => {
                    const isCorrect = col.items.includes(item);
                    return (
                      <div
                        key={item}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold text-center ${
                          isCorrect
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {getWordEmoji(item)} {item} {isCorrect ? "✅" : "❌"}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Retry button */}
      {showResults && !allCorrect && (
        <div className="flex justify-center pt-2">
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
