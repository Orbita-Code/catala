"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MatchingTask, TaskResult } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";
import confetti from "canvas-confetti";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import DragOverlay from "@/components/ui/DragOverlay";

interface Props {
  task: MatchingTask;
  onComplete: (result: TaskResult) => void;
}

export default function Matching({ task, onComplete }: Props) {
  const [selected, setSelected] = useState<{ side: "left" | "right"; index: number } | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null);
  const shuffledRight = useState(() => {
    const indices = task.pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  })[0];

  const tryMatch = useCallback(
    (leftIdx: number, rightDisplayIdx: number) => {
      const rightActualIdx = shuffledRight[rightDisplayIdx];

      if (leftIdx === rightActualIdx) {
        const newMatched = new Set(matched);
        newMatched.add(leftIdx);
        setMatched(newMatched);
        setSelected(null);
        setWrongPair(null);

        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.6 },
          colors: ["#6C5CE7", "#FDCB6E", "#00CECE"],
        });

        if (newMatched.size === task.pairs.length) {
          setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 800);
        }
      } else {
        setWrongPair({ left: leftIdx, right: rightDisplayIdx });
        setSelected(null);
        setTimeout(() => setWrongPair(null), 600);
      }
    },
    [matched, shuffledRight, task.pairs.length, onComplete]
  );

  const handleDrop = useCallback(
    (item: string, targetId: string) => {
      // item is "left-{idx}" dragged to "right-{displayIdx}"
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

  return (
    <div
      className="space-y-2"
      style={{ touchAction: dragState.isDragging ? "none" : "auto" }}
    >
      {dragState.isDragging && (
        <p className="text-xs text-[var(--text-light)] text-center">
          Arrossega fins al parell correcte!
        </p>
      )}
      <div className="flex gap-4 justify-center">
        <div className="flex flex-col gap-2 flex-1 max-w-[200px]">
          {task.pairs.map((pair, i) => {
            const isBeingDragged = dragState.isDragging && dragState.draggedItem === `left-${i}`;
            return (
              <motion.button
                key={`left-${i}`}
                whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
                onClick={() => handleSelect("left", i)}
                onPointerDown={(e) => {
                  if (!matched.has(i)) {
                    handlePointerDown(`left-${i}`, "left", e);
                  }
                }}
                className={`p-3 rounded-2xl text-base font-bold text-center transition-all select-none ${
                  isBeingDragged
                    ? "opacity-40 bg-gray-100 text-gray-300 border-2 border-gray-200"
                    : matched.has(i)
                      ? "bg-green-100 text-green-700 border-2 border-green-400"
                      : selected?.side === "left" && selected.index === i
                        ? "bg-purple-100 border-2 border-[var(--primary)] text-[var(--primary)]"
                        : wrongPair?.left === i
                          ? "bg-red-100 border-2 border-[var(--error)] animate-[shake_0.3s]"
                          : "bg-white border-2 border-gray-200 text-[var(--text)]"
                }`}
                style={{ cursor: matched.has(i) ? "default" : "grab" }}
              >
                {getWordEmoji(pair.left) && <span className="mr-1">{getWordEmoji(pair.left)}</span>}
                <span className="font-handwriting text-lg">{pair.left}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 flex-1 max-w-[200px]">
          {shuffledRight.map((actualIdx, displayIdx) => (
            <motion.button
              key={`right-${displayIdx}`}
              data-drop-target={`right-${displayIdx}`}
              whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
              onClick={() => handleSelect("right", displayIdx)}
              className={`p-3 rounded-2xl text-base font-bold text-center transition-all ${
                dragState.isDragging && !matched.has(actualIdx)
                  ? "border-[var(--primary)] bg-purple-50 border-2 animate-pulse"
                  : matched.has(actualIdx)
                    ? "bg-green-100 text-green-700 border-2 border-green-400"
                    : selected?.side === "right" && selected.index === displayIdx
                      ? "bg-purple-100 border-2 border-[var(--primary)] text-[var(--primary)]"
                      : wrongPair?.right === displayIdx
                        ? "bg-red-100 border-2 border-[var(--error)] animate-[shake_0.3s]"
                        : "bg-white border-2 border-gray-200 text-[var(--text)]"
              }`}
            >
              {getWordEmoji(task.pairs[actualIdx].right) && <span className="mr-1">{getWordEmoji(task.pairs[actualIdx].right)}</span>}
              <span className="font-handwriting text-lg">{task.pairs[actualIdx].right}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Drag overlay - show the word text, not the ID */}
      {dragState.isDragging && dragState.draggedItem && (
        <DragOverlay
          word={task.pairs[parseInt(dragState.draggedItem.replace("left-", ""), 10)]?.left ?? null}
          position={dragState.dragPosition}
        />
      )}
    </div>
  );
}
