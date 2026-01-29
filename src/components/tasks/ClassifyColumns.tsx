"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClassifyColumnsTask } from "@/types/tasks";

interface Props {
  task: ClassifyColumnsTask;
  onComplete: (correct: boolean) => void;
}

export default function ClassifyColumns({ task, onComplete }: Props) {
  const [placed, setPlaced] = useState<Record<string, number>>({});
  const [available, setAvailable] = useState(() => {
    const items = [...task.allItems];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  });
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handlePlaceItem = (item: string) => {
    if (selectedColumn === null || checked) return;
    setPlaced({ ...placed, [item]: selectedColumn });
    setAvailable(available.filter((i) => i !== item));
    setSelectedColumn(null);
  };

  const handleRemoveItem = (item: string) => {
    if (checked) return;
    const newPlaced = { ...placed };
    delete newPlaced[item];
    setPlaced(newPlaced);
    setAvailable([...available, item]);
  };

  const handleCheck = () => {
    const newResults: Record<string, boolean> = {};
    let allCorrect = true;
    Object.entries(placed).forEach(([item, colIdx]) => {
      const correct = task.columns[colIdx].items.includes(item);
      newResults[item] = correct;
      if (!correct) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect && Object.keys(placed).length === task.allItems.length) {
      setTimeout(() => onComplete(true), 1200);
    }
  };

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setPlaced({});
    const items = [...task.allItems];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setAvailable(items);
  };

  const allPlaced = available.length === 0;
  const allCorrect = checked && Object.values(results).every(Boolean) && allPlaced;

  return (
    <div className="space-y-4">
      {available.length > 0 && (
        <div>
          <p className="text-sm text-[var(--text-light)] mb-2">
            {selectedColumn !== null
              ? `Tria una paraula per "${task.columns[selectedColumn].title}":`
              : "Primer, tria una columna:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {available.map((item) => (
              <motion.button
                key={item}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlaceItem(item)}
                disabled={selectedColumn === null}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  selectedColumn !== null
                    ? "bg-[var(--accent)] text-[var(--text)] cursor-pointer hover:brightness-95"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {task.columns.map((col, colIdx) => {
          const colItems = Object.entries(placed)
            .filter(([, idx]) => idx === colIdx)
            .map(([item]) => item);

          return (
            <motion.div
              key={colIdx}
              onClick={() => !checked && setSelectedColumn(colIdx)}
              className={`bg-white rounded-2xl p-4 shadow-sm cursor-pointer transition-all min-h-[120px] ${
                selectedColumn === colIdx
                  ? "ring-2 ring-[var(--primary)]"
                  : "border-2 border-gray-100"
              }`}
            >
              <h4 className="text-center font-black text-lg text-[var(--primary)] mb-3">
                {col.title}
              </h4>
              <div className="space-y-1">
                {colItems.map((item) => (
                  <motion.div
                    key={item}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold text-center cursor-pointer ${
                      checked
                        ? results[item]
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        : "bg-purple-50 text-[var(--primary)]"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item);
                    }}
                  >
                    {item} {checked && (results[item] ? "✅" : "❌")}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

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
