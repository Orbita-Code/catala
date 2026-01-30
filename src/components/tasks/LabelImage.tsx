"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LabelImageTask, TaskResult } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";
import SpeakerButton from "@/components/ui/SpeakerButton";

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

  const handleHotspotTap = (labelIdx: number) => {
    if (checked) return;
    if (!selectedWord) return;
    if (placed[labelIdx]) {
      // Remove existing label
      const newPlaced = { ...placed };
      delete newPlaced[labelIdx];
      setPlaced(newPlaced);
      return;
    }
    setPlaced({ ...placed, [labelIdx]: selectedWord });
    setSelectedWord(null);
  };

  const handleWordTap = (word: string) => {
    if (checked) return;
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

    // Group labels by y-coordinate so items in the same row are interchangeable
    // (e.g. in a family tree, "pare" and "mare" can be in either left/right position)
    const rowGroups: Record<number, number[]> = {};
    task.labels.forEach((label, i) => {
      const y = label.y;
      if (!rowGroups[y]) rowGroups[y] = [];
      rowGroups[y].push(i);
    });

    // For each row group, check if the placed words match the expected words
    // in any order within that row
    for (const indices of Object.values(rowGroups)) {
      if (indices.length === 1) {
        // Single label in this row — strict check
        const i = indices[0];
        const correct = placed[i]?.toLowerCase() === task.labels[i].text.toLowerCase();
        newResults[i] = correct;
        if (!correct) allCorrect = false;
      } else {
        // Multiple labels in same row — allow any order within the row
        const expectedWords = new Set(indices.map((i) => task.labels[i].text.toLowerCase()));
        const placedWords = indices.map((i) => placed[i]?.toLowerCase() || "");
        const placedSet = new Set(placedWords);

        // Check if placed words match expected words (regardless of position)
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

  // Group labels by y-coordinate into rows for visual structure
  const rowGroups = useMemo(() => {
    const groups: { y: number; indices: number[] }[] = [];
    const yMap = new Map<number, number[]>();
    task.labels.forEach((label, i) => {
      const y = label.y;
      if (!yMap.has(y)) yMap.set(y, []);
      yMap.get(y)!.push(i);
    });
    // Sort by y to maintain top-to-bottom order
    [...yMap.entries()]
      .sort(([a], [b]) => a - b)
      .forEach(([y, indices]) => groups.push({ y, indices }));
    return groups;
  }, [task.labels]);

  const hasMultipleRows = rowGroups.length > 1;

  return (
    <div className="space-y-4">
      {/* Hotspots - displayed as labeled positions, grouped by row */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm min-h-[200px]">
        <div className="space-y-3">
          {rowGroups.map((row, rowIdx) => (
            <div key={row.y}>
              {/* Row divider for multi-row layouts */}
              {hasMultipleRows && rowIdx > 0 && (
                <div className="border-t border-dashed border-gray-200 mb-3" />
              )}
              <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${row.indices.length}, 1fr)` }}>
                {row.indices.map((i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleHotspotTap(i)}
                    className={`min-h-[60px] rounded-xl border-2 flex items-center justify-center gap-2 p-3 text-base font-bold transition-all ${
                      checked
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
                      <span className="text-2xl">❓</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Word bank */}
      <div>
        <p className="text-sm text-[var(--text-light)] mb-2">
          {selectedWord ? `Col·loca "${selectedWord}" en el lloc correcte` : "Tria una paraula:"}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {task.options.map((word) => (
            <motion.button
              key={word}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordTap(word)}
              disabled={checked}
              className={`px-4 py-3 min-h-[48px] rounded-xl font-bold text-base transition-all ${
                usedWords.has(word)
                  ? "bg-gray-100 text-gray-300 line-through"
                  : selectedWord === word
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--accent)] text-[var(--text)]"
              }`}
            >
              {getWordEmoji(word) && <span className="mr-1">{getWordEmoji(word)}</span>}
              {word}
              {!checked && !usedWords.has(word) && (
                <SpeakerButton text={word} size={14} className="ml-1 inline-block" />
              )}
            </motion.button>
          ))}
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
    </div>
  );
}
