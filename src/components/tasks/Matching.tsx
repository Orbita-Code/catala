"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MatchingTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import DragOverlay from "@/components/ui/DragOverlay";

interface Props {
  task: MatchingTask;
  onComplete: (result: TaskResult) => void;
}

// 18 distinct colors for matched pairs
const PAIR_COLORS = [
  "#FF6B6B", "#0984E3", "#00B894", "#FDCB6E", "#FF9F43",
  "#A29BFE", "#E17055", "#00CECE", "#FDA7DF", "#6C5CE7",
  "#55EFC4", "#FF7675", "#74B9FF", "#FFEAA7", "#DFE6E9",
  "#81ECEC", "#FAB1A0", "#636E72",
];

export default function Matching({ task, onComplete }: Props) {
  const illustrationMode = task.illustrationMatch === true;
  const [selected, setSelected] = useState<{ side: "left" | "right"; index: number } | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [matchOrder, setMatchOrder] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null);
  const [lastMatchedIdx, setLastMatchedIdx] = useState<number | null>(null);
  const shuffledRight = useState(() => {
    const indices = task.pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  })[0];

  // Map each pair index to its color (assigned in order of matching)
  const getMatchColor = (pairIdx: number): string | null => {
    const order = matchOrder.indexOf(pairIdx);
    if (order === -1) return null;
    return PAIR_COLORS[order % PAIR_COLORS.length];
  };

  const tryMatch = useCallback(
    (leftIdx: number, rightDisplayIdx: number) => {
      const rightActualIdx = shuffledRight[rightDisplayIdx];

      if (leftIdx === rightActualIdx) {
        const newMatched = new Set(matched);
        newMatched.add(leftIdx);
        setMatched(newMatched);
        setMatchOrder((prev) => [...prev, leftIdx]);
        setSelected(null);
        setWrongPair(null);
        setLastMatchedIdx(leftIdx);
        celebrate();
        // Speak only once if left and right are the same word (illustration matching)
        const pair = task.pairs[leftIdx];
        speak(pair.left === pair.right ? pair.left : `${pair.left}, ${pair.right}`);

        if (newMatched.size === task.pairs.length) {
          setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 800);
        }
      } else {
        setWrongPair({ left: leftIdx, right: rightDisplayIdx });
        setSelected(null);
        setTimeout(() => setWrongPair(null), 600);
      }
    },
    [matched, shuffledRight, task.pairs, onComplete]
  );

  const handleDrop = useCallback(
    (item: string, targetId: string) => {
      const leftIdx = parseInt(item.replace("left-", ""), 10);
      const rightDisplayIdx = parseInt(targetId.replace("right-", ""), 10);
      if (isNaN(leftIdx) || isNaN(rightDisplayIdx)) return;
      if (matched.has(leftIdx) || matched.has(shuffledRight[rightDisplayIdx])) return;
      tryMatch(leftIdx, rightDisplayIdx);
    },
    [matched, shuffledRight, tryMatch]
  );

  const { dragState, handlePointerDown } =
    useDragAndDrop({ onDrop: handleDrop });

  const handleSelect = (side: "left" | "right", index: number) => {
    if (dragState.isDragging) return;
    if (matched.has(index) && side === "left") return;
    if (side === "right" && matched.has(shuffledRight[index])) return;

    if (!selected) {
      setSelected({ side, index });
      return;
    }

    if (selected.side === side) {
      setSelected({ side, index });
      return;
    }

    const leftIdx = side === "left" ? index : selected.index;
    const rightDisplayIdx = side === "right" ? index : selected.index;
    tryMatch(leftIdx, rightDisplayIdx);
  };

  // Progress indicator
  const progress = matched.size / task.pairs.length;

  // Illustration grid mode: images on top, labels below
  if (illustrationMode) {
    return (
      <div
        className="space-y-3"
        style={{ touchAction: dragState.isDragging ? "none" : "auto" }}
      >
        {/* Progress bar */}
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
          <AnimatePresence>
            {lastMatchedIdx !== null && (
              <motion.span
                key={lastMatchedIdx}
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: -25 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-0 -top-1 text-lg"
              >
                ⭐
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-[var(--text-light)] text-center">
          {matched.size} / {task.pairs.length} ✨
        </p>

        {/* Illustrations grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {task.pairs.map((pair, i) => {
            const isMatched = matched.has(i);
            const isSelected = selected?.side === "left" && selected.index === i;
            const isWrong = wrongPair?.left === i;
            const isBeingDragged = dragState.isDragging && dragState.draggedItem === `left-${i}`;
            const matchColor = getMatchColor(i);

            return (
              <motion.button
                key={`img-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileTap={dragState.isDragging ? undefined : { scale: 0.93 }}
                onClick={() => handleSelect("left", i)}
                onPointerDown={(e) => {
                  if (!isMatched) handlePointerDown(`left-${i}`, "left", e);
                }}
                className={`rounded-xl p-1.5 transition-all select-none flex items-center justify-center aspect-square ${
                  isBeingDragged
                    ? "opacity-40 bg-gray-100 border-2 border-gray-200"
                    : isMatched
                      ? "bg-white scale-95"
                      : isSelected
                        ? "bg-purple-100 shadow-lg shadow-purple-200"
                        : isWrong
                          ? "bg-red-100 animate-[shake_0.3s]"
                          : "bg-white hover:shadow-md"
                }`}
                style={{
                  borderWidth: 3,
                  borderColor: isBeingDragged
                    ? undefined
                    : isMatched && matchColor
                      ? matchColor
                      : isSelected
                        ? "var(--primary)"
                        : isWrong
                          ? "var(--error)"
                          : "#E2E8F0",
                  cursor: isMatched ? "default" : "grab",
                }}
              >
                {getWordIllustration(pair.left) ? (
                  <img
                    src={getWordIllustration(pair.left)!}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <span className="text-sm font-handwriting font-bold">{pair.left}</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 px-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-[var(--text-light)]">Tria la paraula</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Text labels grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {shuffledRight.map((actualIdx, displayIdx) => {
            const isMatched = matched.has(actualIdx);
            const isSelected = selected?.side === "right" && selected.index === displayIdx;
            const isWrong = wrongPair?.right === displayIdx;
            const matchColor = getMatchColor(actualIdx);

            return (
              <motion.button
                key={`txt-${displayIdx}`}
                data-drop-target={`right-${displayIdx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: displayIdx * 0.03 }}
                whileTap={dragState.isDragging ? undefined : { scale: 0.93 }}
                onClick={() => handleSelect("right", displayIdx)}
                className={`rounded-xl px-2 py-2 font-bold text-center transition-all text-sm font-handwriting ${
                  dragState.isDragging && !isMatched
                    ? "bg-purple-50 border-dashed animate-pulse"
                    : isMatched
                      ? "bg-white scale-95"
                      : isSelected
                        ? "bg-purple-100 shadow-lg shadow-purple-200"
                        : isWrong
                          ? "bg-red-100 animate-[shake_0.3s]"
                          : "bg-white hover:shadow-md"
                }`}
                style={{
                  borderWidth: 3,
                  borderColor: dragState.isDragging && !isMatched
                    ? "var(--primary)"
                    : isMatched && matchColor
                      ? matchColor
                      : isSelected
                        ? "var(--primary)"
                        : isWrong
                          ? "var(--error)"
                          : "#E2E8F0",
                  color: isMatched && matchColor ? matchColor : undefined,
                }}
              >
                {task.pairs[actualIdx].right}
              </motion.button>
            );
          })}
        </div>

        {/* Drag overlay */}
        {dragState.isDragging && dragState.draggedItem && (
          <DragOverlay
            word={task.pairs[parseInt(dragState.draggedItem.replace("left-", ""), 10)]?.left ?? null}
            position={dragState.dragPosition}
          />
        )}
      </div>
    );
  }

  // Default two-column mode (non-illustration)
  return (
    <div
      className="space-y-3"
      style={{ touchAction: dragState.isDragging ? "none" : "auto" }}
    >
      {/* Fun progress bar */}
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        <AnimatePresence>
          {lastMatchedIdx !== null && (
            <motion.span
              key={lastMatchedIdx}
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: -25 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-0 -top-1 text-lg"
            >
              ⭐
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-[var(--text-light)] text-center">
        {matched.size} / {task.pairs.length} ✨
      </p>

      {dragState.isDragging && (
        <p className="text-xs text-[var(--text-light)] text-center animate-pulse">
          Arrossega fins al parell correcte!
        </p>
      )}

      <div className="flex gap-3 justify-center">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-2 flex-1 max-w-[200px]">
          {task.pairs.map((pair, i) => {
            const isBeingDragged = dragState.isDragging && dragState.draggedItem === `left-${i}`;
            const isMatched = matched.has(i);
            const isSelected = selected?.side === "left" && selected.index === i;
            const isWrong = wrongPair?.left === i;

            return (
              <motion.button
                key={`left-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={dragState.isDragging ? undefined : { scale: 0.93 }}
                onClick={() => handleSelect("left", i)}
                onPointerDown={(e) => {
                  if (!isMatched) handlePointerDown(`left-${i}`, "left", e);
                }}
                className={`rounded-2xl font-bold text-center transition-all select-none p-3 text-base ${
                  isBeingDragged
                    ? "opacity-40 bg-gray-100 text-gray-300 border-2 border-gray-200"
                    : isMatched
                      ? "bg-green-100 text-green-700 border-2 border-green-400 scale-95"
                      : isSelected
                        ? "bg-purple-100 border-2 border-[var(--primary)] text-[var(--primary)] shadow-lg shadow-purple-200"
                        : isWrong
                          ? "bg-red-100 border-2 border-[var(--error)] animate-[shake_0.3s]"
                          : "bg-white border-2 border-gray-200 text-[var(--text)] hover:border-purple-300 hover:shadow-md"
                }`}
                style={{ cursor: isMatched ? "default" : "grab" }}
              >
                {(() => {
                  const fullWord = pair.left + pair.right;
                  const ill = getWordIllustration(pair.left) || getWordIllustration(fullWord);
                  return ill ? <img src={ill} alt="" className="w-10 h-10 object-contain inline mr-1" /> : null;
                })()}
                <span className="font-handwriting text-lg">{pair.left}</span>
              </motion.button>
            );
          })}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-2 flex-1 max-w-[200px]">
          {shuffledRight.map((actualIdx, displayIdx) => {
            const isMatched = matched.has(actualIdx);
            const isSelected = selected?.side === "right" && selected.index === displayIdx;
            const isWrong = wrongPair?.right === displayIdx;

            return (
              <motion.button
                key={`right-${displayIdx}`}
                data-drop-target={`right-${displayIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: displayIdx * 0.05 }}
                whileTap={dragState.isDragging ? undefined : { scale: 0.93 }}
                onClick={() => handleSelect("right", displayIdx)}
                className={`rounded-2xl font-bold text-center transition-all p-3 text-base ${
                  dragState.isDragging && !isMatched
                    ? "border-[var(--primary)] bg-purple-50 border-2 border-dashed animate-pulse"
                    : isMatched
                      ? "bg-green-100 text-green-700 border-2 border-green-400 scale-95"
                      : isSelected
                        ? "bg-purple-100 border-2 border-[var(--primary)] text-[var(--primary)] shadow-lg shadow-purple-200"
                        : isWrong
                          ? "bg-red-100 border-2 border-[var(--error)] animate-[shake_0.3s]"
                          : "bg-white border-2 border-gray-200 text-[var(--text)] hover:border-purple-300 hover:shadow-md"
                }`}
              >
                {(() => {
                  const p = task.pairs[actualIdx];
                  const fullWord = p.left + p.right;
                  const ill = getWordIllustration(p.right) || getWordIllustration(fullWord);
                  return ill ? <img src={ill} alt="" className="w-10 h-10 object-contain inline mr-1" /> : null;
                })()}
                <span className="font-handwriting text-lg">{task.pairs[actualIdx].right}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Drag overlay */}
      {dragState.isDragging && dragState.draggedItem && (
        <DragOverlay
          word={task.pairs[parseInt(dragState.draggedItem.replace("left-", ""), 10)]?.left ?? null}
          position={dragState.dragPosition}
        />
      )}
    </div>
  );
}
