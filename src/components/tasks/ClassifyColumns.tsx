"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ClassifyColumnsTask, TaskResult } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";
import confetti from "canvas-confetti";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import DragOverlay from "@/components/ui/DragOverlay";

interface Props {
  task: ClassifyColumnsTask;
  onComplete: (result: TaskResult) => void;
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

  const placeItem = useCallback(
    (item: string, colIdx: number) => {
      if (showResults || !item) return;

      const newPlaced = { ...placed, [item]: colIdx };
      setPlaced(newPlaced);

      const correct = task.columns[colIdx].items.includes(item);
      setLastPlacedCorrect(correct);

      if (correct) {
        confetti({
          particleCount: 15,
          spread: 35,
          origin: { y: 0.5 },
          colors: ["#6C5CE7", "#FDCB6E", "#00CECE"],
        });
      }

      setTimeout(() => {
        setLastPlacedCorrect(null);
        const nextIdx = currentItemIdx + 1;
        setCurrentItemIdx(nextIdx);

        if (nextIdx >= items.length) {
          let allCorrect = true;
          Object.entries(newPlaced).forEach(([itm, col]) => {
            if (!task.columns[col].items.includes(itm)) {
              allCorrect = false;
            }
          });
          setShowResults(true);
          if (allCorrect) {
            setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
          }
        }
      }, 800);
    },
    [placed, currentItemIdx, items.length, showResults, task.columns, onComplete]
  );

  const handleColumnTap = (colIdx: number) => {
    if (allPlaced || showResults || !currentItem || lastPlacedCorrect !== null) return;
    if (dragState.isDragging) return;
    placeItem(currentItem, colIdx);
  };

  const handleDrop = useCallback(
    (item: string, targetId: string) => {
      const colIdx = parseInt(targetId.replace("col-", ""), 10);
      if (isNaN(colIdx)) return;
      if (item !== currentItem) return;
      placeItem(item, colIdx);
    },
    [currentItem, placeItem]
  );

  const { dragState, handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragAndDrop({ onDrop: handleDrop, disabled: showResults || lastPlacedCorrect !== null });

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
    <div
      className="space-y-5"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: dragState.isDragging ? "none" : "auto" }}
    >
      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {Math.min(currentItemIdx + 1, items.length)} / {items.length}
      </div>

      {/* Current item to classify - draggable */}
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
          <div
            onPointerDown={(e) => {
              if (lastPlacedCorrect === null && !showResults) {
                handlePointerDown(currentItem, "current", e);
              }
            }}
            className={`inline-block px-6 py-3 rounded-2xl text-2xl font-black font-handwriting transition-all select-none ${
              dragState.isDragging && dragState.draggedItem === currentItem
                ? "opacity-40 bg-gray-100 text-gray-300"
                : lastPlacedCorrect === true
                  ? "bg-green-100 text-green-700"
                  : lastPlacedCorrect === false
                    ? "bg-red-100 text-red-700"
                    : "bg-[var(--accent)] text-[var(--text)]"
            }`}
            style={{ cursor: lastPlacedCorrect !== null || showResults ? "default" : "grab" }}
          >
            {currentItem}
            {lastPlacedCorrect === true && " ✅"}
            {lastPlacedCorrect === false && " ❌"}
          </div>
          {!showResults && lastPlacedCorrect === null && (
            <p className="text-xs text-[var(--text-light)] mt-2">
              {dragState.isDragging ? "Arrossega al grup correcte!" : "Toca un grup o arrossega la paraula"}
            </p>
          )}
        </motion.div>
      )}

      {/* Two big column buttons - drop targets */}
      {!allPlaced && !showResults && (
        <div className="grid grid-cols-2 gap-4">
          {task.columns.map((col, colIdx) => (
            <motion.button
              key={colIdx}
              data-drop-target={`col-${colIdx}`}
              whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
              onClick={() => handleColumnTap(colIdx)}
              disabled={lastPlacedCorrect !== null}
              className={`min-h-[120px] bg-white rounded-2xl p-4 shadow-sm border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                dragState.isDragging
                  ? "border-[var(--primary)] bg-purple-50 animate-pulse"
                  : "border-gray-200 hover:border-[var(--primary)]"
              }`}
            >
              <h4 className="text-xl font-black text-[var(--primary)]">
                {col.title}
              </h4>
              <div className="text-xs text-[var(--text-light)]">
                {Object.values(placed).filter((c) => c === colIdx).length} posades
              </div>
              {dragState.isDragging && (
                <span className="text-2xl">⬇️</span>
              )}
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
                        className={`px-3 py-1.5 rounded-lg text-base font-semibold text-center font-handwriting ${
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

      {/* Drag overlay */}
      <DragOverlay word={dragState.draggedItem} position={dragState.dragPosition} />
    </div>
  );
}
