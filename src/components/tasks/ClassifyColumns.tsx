"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ClassifyColumnsTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import DragOverlay from "@/components/ui/DragOverlay";
import { RefreshCcw } from "lucide-react";

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
        celebrate();
        // Extract article from column title
        const title = task.columns[colIdx].title;
        const articleMatch = title.match(/\(([^)]+)\)/);
        // Check if title itself is an article (EL, LA, UN, UNA, ELS, LES, L')
        const shortArticles = ["el", "la", "un", "una", "els", "les", "l'"];
        const titleLower = title.toLowerCase().trim();
        const isArticleTitle = shortArticles.includes(titleLower);
        // Use parentheses content, or title if it's an article, or nothing
        const article = articleMatch ? articleMatch[1] : (isArticleTitle ? title.toLowerCase() : "");
        // Speak article + word (e.g. "una carpeta", "el balcó")
        speak(article ? `${article} ${item}` : item);
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

  const { dragState, handlePointerDown } =
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
      style={{ touchAction: dragState.isDragging ? "none" : "auto" }}
    >
      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {Math.min(currentItemIdx + 1, items.length)} / {items.length}
      </div>

      {/* Circle mode: horizontal layout - left circle | item | right circle */}
      {task.circleMode && !allPlaced && currentItem && !showResults ? (
        <div className="flex items-center gap-2 justify-center">
          {/* Left column circle */}
          <motion.button
            data-drop-target="col-0"
            whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
            onClick={() => handleColumnTap(0)}
            disabled={lastPlacedCorrect !== null}
            className={`aspect-square rounded-full w-[150px] sm:w-[190px] md:w-[240px] flex-shrink-0 bg-white p-3 shadow-sm border-2 transition-all flex flex-col items-center justify-center gap-1 ${
              dragState.isDragging
                ? "border-[var(--primary)] bg-purple-50 animate-pulse"
                : "border-gray-200 hover:border-[var(--primary)]"
            }`}
          >
            <h4 className="text-sm sm:text-base md:text-lg font-black text-[var(--primary)] leading-tight text-center whitespace-nowrap">
              {task.columns[0].title}
            </h4>
            <div className="text-xs text-[var(--text-light)]">
              {Object.values(placed).filter((c) => c === 0).length} posades
            </div>
            {dragState.isDragging && <span className="text-xl md:text-2xl">⬅️</span>}
          </motion.button>

          {/* Center: current item */}
          <motion.div
            key={currentItem}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 text-center"
          >
            <div
              onPointerDown={(e) => {
                if (lastPlacedCorrect === null && !showResults) {
                  handlePointerDown(currentItem, "current", e);
                }
              }}
              className="inline-flex flex-col items-center select-none"
              style={{ cursor: lastPlacedCorrect !== null || showResults ? "default" : "grab" }}
            >
              {getWordIllustration(currentItem) ? (
                <div className="mb-2 flex justify-center"><img src={getWordIllustration(currentItem)!} alt="" className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain pointer-events-none" /></div>
              ) : null}
              <div
                className={`inline-block px-5 py-3 rounded-2xl text-2xl sm:text-3xl md:text-4xl font-black font-handwriting transition-all ${
                  dragState.isDragging && dragState.draggedItem === currentItem
                    ? "opacity-40 bg-gray-100 text-gray-300"
                    : lastPlacedCorrect === true
                      ? "bg-green-100 text-green-700"
                      : lastPlacedCorrect === false
                        ? "bg-red-100 text-red-700"
                        : "bg-[var(--accent)] text-[var(--text)]"
                }`}
              >
                {currentItem}
                {lastPlacedCorrect === true && " ✅"}
                {lastPlacedCorrect === false && <RefreshCcw className="inline w-5 h-5 md:w-6 md:h-6 text-orange-500 ml-1" />}
              </div>
            </div>
            {lastPlacedCorrect === null && (
              <p className="text-xs md:text-sm text-[var(--text-light)] mt-2">
                {dragState.isDragging ? "Arrossega!" : "Toca o arrossega"}
              </p>
            )}
          </motion.div>

          {/* Right column circle */}
          <motion.button
            data-drop-target="col-1"
            whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
            onClick={() => handleColumnTap(1)}
            disabled={lastPlacedCorrect !== null}
            className={`aspect-square rounded-full w-[150px] sm:w-[190px] md:w-[240px] flex-shrink-0 bg-white p-3 shadow-sm border-2 transition-all flex flex-col items-center justify-center gap-1 ${
              dragState.isDragging
                ? "border-[var(--primary)] bg-purple-50 animate-pulse"
                : "border-gray-200 hover:border-[var(--primary)]"
            }`}
          >
            <h4 className="text-sm sm:text-base md:text-lg font-black text-[var(--primary)] leading-tight text-center whitespace-nowrap">
              {task.columns[1].title}
            </h4>
            <div className="text-xs text-[var(--text-light)]">
              {Object.values(placed).filter((c) => c === 1).length} posades
            </div>
            {dragState.isDragging && <span className="text-xl md:text-2xl">➡️</span>}
          </motion.button>
        </div>
      ) : (
        <>
          {/* Non-circle mode: vertical layout (item on top, columns below) */}
          {!allPlaced && currentItem && (
            <motion.div
              key={currentItem}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div
                onPointerDown={(e) => {
                  if (lastPlacedCorrect === null && !showResults) {
                    handlePointerDown(currentItem, "current", e);
                  }
                }}
                className="inline-flex flex-col items-center select-none"
                style={{ cursor: lastPlacedCorrect !== null || showResults ? "default" : "grab" }}
              >
                {getWordIllustration(currentItem) ? (
                  <div className="mb-2 flex justify-center"><img src={getWordIllustration(currentItem)!} alt="" className="w-48 h-48 sm:w-56 sm:h-56 object-contain pointer-events-none" /></div>
                ) : null}
                <div
                  className={`inline-block px-6 py-3 rounded-2xl text-2xl font-black font-handwriting transition-all ${
                    dragState.isDragging && dragState.draggedItem === currentItem
                      ? "opacity-40 bg-gray-100 text-gray-300"
                      : lastPlacedCorrect === true
                        ? "bg-green-100 text-green-700"
                        : lastPlacedCorrect === false
                          ? "bg-red-100 text-red-700"
                          : "bg-[var(--accent)] text-[var(--text)]"
                  }`}
                >
                  {currentItem}
                  {lastPlacedCorrect === true && " ✅"}
                  {lastPlacedCorrect === false && <RefreshCcw className="inline w-4 h-4 text-orange-500 ml-1" />}
                </div>
              </div>
              {!showResults && lastPlacedCorrect === null && (
                <p className="text-xs text-[var(--text-light)] mt-2">
                  {dragState.isDragging ? "Arrossega al grup correcte!" : "Toca un grup o arrossega la paraula"}
                </p>
              )}
            </motion.div>
          )}

          {/* Column buttons below (non-circle mode) */}
          {!allPlaced && !showResults && !task.circleMode && (
            <div className={`grid gap-2 ${task.columns.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
              {task.columns.map((col, colIdx) => (
                <motion.button
                  key={colIdx}
                  data-drop-target={`col-${colIdx}`}
                  whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
                  onClick={() => handleColumnTap(colIdx)}
                  disabled={lastPlacedCorrect !== null}
                  className={`min-h-[100px] rounded-2xl bg-white p-3 shadow-sm border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    dragState.isDragging
                      ? "border-[var(--primary)] bg-purple-50 animate-pulse"
                      : "border-gray-200 hover:border-[var(--primary)]"
                  }`}
                >
                  <h4 className={`font-black text-[var(--primary)] ${task.columns.length === 3 ? "text-base md:text-lg" : "text-2xl md:text-3xl"}`}>
                    {col.title}
                  </h4>
                  <div className="text-xs text-[var(--text-light)]">
                    {Object.values(placed).filter((c) => c === colIdx).length} posades
                  </div>
                  {dragState.isDragging && (
                    <span className={task.columns.length === 3 ? "text-xl" : "text-3xl"}>⬇️</span>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Results view */}
      {showResults && (
        <div className={`grid gap-3 ${task.columns.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {task.columns.map((col, colIdx) => {
            const colItems = Object.entries(placed)
              .filter(([, idx]) => idx === colIdx)
              .map(([item]) => item);
            return (
              <div key={colIdx} className={`bg-white ${task.circleMode ? "rounded-full aspect-square flex flex-col justify-center" : "rounded-2xl"} p-3 shadow-sm border-2 border-gray-100`}>
                <h4 className={`text-center font-black text-[var(--primary)] mb-2 ${task.columns.length === 3 ? "text-base" : "text-xl md:text-2xl"}`}>
                  {col.title}
                </h4>
                <div className="space-y-1">
                  {colItems.map((item) => {
                    const isCorrect = col.items.includes(item);
                    return (
                      <div
                        key={item}
                        className={`px-2 py-1 rounded-lg text-sm font-semibold text-center font-handwriting ${
                          isCorrect
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {getWordIllustration(item) ? <img src={getWordIllustration(item)!} alt="" className="w-8 h-8 object-contain inline mr-1" /> : null} {item} {isCorrect ? "✅" : "❌"}
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
