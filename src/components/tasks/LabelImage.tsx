"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { LabelImageTask, TaskResult } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { speak } from "@/lib/tts";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import DragOverlay from "@/components/ui/DragOverlay";

interface Props {
  task: LabelImageTask;
  onComplete: (result: TaskResult) => void;
}

export default function LabelImage({ task, onComplete }: Props) {
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const usedWords = new Set(Object.values(placed));

  const handleDrop = useCallback(
    (item: string, targetId: string) => {
      if (checked) return;
      const idx = parseInt(targetId.replace("slot-", ""), 10);
      if (isNaN(idx)) return;
      // Remove item from any other slot first
      const newPlaced = { ...placed };
      for (const [key, val] of Object.entries(newPlaced)) {
        if (val === item) delete newPlaced[Number(key)];
      }
      newPlaced[idx] = item;
      setPlaced(newPlaced);
      setSelectedWord(null);
    },
    [placed, checked]
  );

  const { dragState, handlePointerDown } =
    useDragAndDrop({ onDrop: handleDrop, disabled: checked });

  const handleHotspotTap = (labelIdx: number) => {
    if (checked) return;
    if (dragState.isDragging) return;
    if (!selectedWord) {
      // If slot has a word, remove it
      if (placed[labelIdx]) {
        const newPlaced = { ...placed };
        delete newPlaced[labelIdx];
        setPlaced(newPlaced);
      }
      return;
    }
    // Remove selected word from other slots
    const newPlaced = { ...placed };
    for (const [key, val] of Object.entries(newPlaced)) {
      if (val === selectedWord) delete newPlaced[Number(key)];
    }
    newPlaced[labelIdx] = selectedWord;
    setPlaced(newPlaced);
    setSelectedWord(null);
  };

  const handleWordTap = (word: string) => {
    if (checked) return;
    if (dragState.isDragging) return;
    if (usedWords.has(word)) {
      // Unplace word
      const newPlaced = { ...placed };
      for (const [key, val] of Object.entries(newPlaced)) {
        if (val === word) delete newPlaced[Number(key)];
      }
      setPlaced(newPlaced);
      setSelectedWord(null);
      return;
    }
    setSelectedWord(word === selectedWord ? null : word);
  };

  const allPlaced = task.labels.every((_, i) => placed[i]);

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;

    const rowGroups: Record<number, number[]> = {};
    task.labels.forEach((label, i) => {
      const y = label.y;
      if (!rowGroups[y]) rowGroups[y] = [];
      rowGroups[y].push(i);
    });

    for (const indices of Object.values(rowGroups)) {
      if (indices.length === 1) {
        const i = indices[0];
        const correct = placed[i]?.toLowerCase() === task.labels[i].text.toLowerCase();
        newResults[i] = correct;
        if (!correct) allCorrect = false;
      } else {
        const expectedWords = new Set(indices.map((i) => task.labels[i].text.toLowerCase()));
        const placedWords = indices.map((i) => placed[i]?.toLowerCase() || "");
        const placedSet = new Set(placedWords);

        const rowCorrect =
          placedWords.length === expectedWords.size &&
          placedWords.every((w) => expectedWords.has(w)) &&
          placedSet.size === expectedWords.size;

        indices.forEach((i) => {
          newResults[i] = rowCorrect;
        });
        if (!rowCorrect) allCorrect = false;
      }
    }

    setResults(newResults);
    setChecked(true);
    if (allCorrect) {
      const words = task.labels.map((l) => l.text).join(", ");
      speak(words);
      setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
    }
  };

  const handleRetry = () => {
    setPlaced({});
    setChecked(false);
    setResults({});
    setSelectedWord(null);
  };

  const allCorrect = checked && Object.values(results).every(Boolean);

  const rowGroups = useMemo(() => {
    const groups: { y: number; indices: number[] }[] = [];
    const yMap = new Map<number, number[]>();
    task.labels.forEach((label, i) => {
      const y = label.y;
      if (!yMap.has(y)) yMap.set(y, []);
      yMap.get(y)!.push(i);
    });
    [...yMap.entries()]
      .sort(([a], [b]) => a - b)
      .forEach(([y, indices]) => groups.push({ y, indices }));
    return groups;
  }, [task.labels]);

  const hasMultipleRows = rowGroups.length > 1;

  return (
    <div
      className="space-y-4"
      style={{ touchAction: dragState.isDragging ? "none" : "auto" }}
    >
      {/* Hotspots - drop targets */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm min-h-[200px]">
        <div className="space-y-3">
          {rowGroups.map((row, rowIdx) => (
            <div key={row.y}>
              {hasMultipleRows && rowIdx > 0 && (
                <div className="border-t border-dashed border-gray-200 mb-3" />
              )}
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${row.indices.length}, 1fr)` }}>
                {row.indices.map((i) => (
                  <motion.button
                    key={i}
                    data-drop-target={`slot-${i}`}
                    whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
                    onClick={() => handleHotspotTap(i)}
                    className={`min-h-[60px] rounded-xl border-2 flex items-center justify-center gap-2 p-3 text-base font-bold transition-all ${
                      dragState.isDragging && !placed[i]
                        ? "border-[var(--primary)] bg-purple-50 border-dashed animate-pulse"
                        : checked
                          ? results[i]
                            ? "border-green-400 bg-green-50 text-green-700"
                            : "border-red-400 bg-red-50 text-red-700"
                          : placed[i]
                            ? "border-[var(--primary)] bg-purple-50 text-[var(--primary)]"
                            : "border-dashed border-gray-300 bg-gray-50 text-gray-400"
                    }`}
                  >
                    {placed[i] ? (
                      <>
                        {getWordEmoji(placed[i]) && <span>{getWordEmoji(placed[i])}</span>}
                        {placed[i]}
                        {checked && (results[i] ? " ✅" : " ❌")}
                      </>
                    ) : (
                      <span className="text-2xl">{dragState.isDragging ? "⬇️" : "❓"}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Word bank - drag sources */}
      <div>
        <p className="text-sm text-[var(--text-light)] mb-2">
          {dragState.isDragging
            ? "Arrossega la paraula al lloc correcte!"
            : selectedWord
              ? `Col·loca "${selectedWord}" en el lloc correcte`
              : "Tria o arrossega una paraula:"}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {task.options.map((word) => {
            const isBeingDragged = dragState.isDragging && dragState.draggedItem === word;
            return (
              <motion.button
                key={word}
                whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
                onClick={() => handleWordTap(word)}
                onPointerDown={(e) => {
                  if (!checked && !usedWords.has(word)) {
                    handlePointerDown(word, "bank", e);
                  }
                }}
                disabled={checked}
                className={`px-4 py-3 min-h-[48px] rounded-xl font-bold text-base transition-all select-none ${
                  isBeingDragged
                    ? "opacity-40 bg-gray-100 text-gray-300"
                    : usedWords.has(word)
                      ? "bg-gray-100 text-gray-300 line-through"
                      : selectedWord === word
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--accent)] text-[var(--text)]"
                }`}
                style={{ cursor: checked || usedWords.has(word) ? "default" : "grab" }}
              >
                {getWordEmoji(word) && <span className="mr-1">{getWordEmoji(word)}</span>}
                {word}
                {!checked && !usedWords.has(word) && (
                  <SpeakerButton text={word} size={14} className="ml-1 inline-block" light={selectedWord === word} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Check / Retry */}
      <div className="flex justify-center pt-2">
        {!checked ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            disabled={!allPlaced}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg disabled:opacity-40 shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
          >
            Comprova!
          </motion.button>
        ) : !allCorrect ? (
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

      {/* Drag overlay */}
      <DragOverlay word={dragState.draggedItem} position={dragState.dragPosition} />
    </div>
  );
}
