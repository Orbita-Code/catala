"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ColorByInstructionTask, TaskResult } from "@/types/tasks";
import { speak } from "@/lib/tts";

interface Props {
  task: ColorByInstructionTask;
  onComplete: (result: TaskResult) => void;
}

const PALETTE = [
  { name: "vermell", color: "#FF6B6B" },
  { name: "blau", color: "#0984E3" },
  { name: "verd", color: "#00B894" },
  { name: "groc", color: "#FDCB6E" },
  { name: "taronja", color: "#FF9F43" },
  { name: "rosa", color: "#E84393" },
  { name: "lila", color: "#A29BFE" },
  { name: "marró", color: "#8B6F47" },
  { name: "negre", color: "#2D3436" },
  { name: "blanc", color: "#FAFAFA" },
];

export default function ColorByInstruction({ task, onComplete }: Props) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [coloredItems, setColoredItems] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const getHex = (name: string) =>
    PALETTE.find((p) => p.name === name)?.color ?? "#ccc";

  const handleItemTap = (targetItem: string) => {
    if (checked || !selectedColor) return;
    setColoredItems({ ...coloredItems, [targetItem]: selectedColor });
  };

  const allColored = task.instructions.every(
    (inst) => coloredItems[inst.targetItem]
  );

  const handleCheck = () => {
    const newResults: Record<string, boolean> = {};
    let allCorrect = true;
    task.instructions.forEach((inst) => {
      const applied = coloredItems[inst.targetItem];
      const correct = applied?.toLowerCase() === inst.targetColor.toLowerCase();
      newResults[inst.targetItem] = correct;
      if (!correct) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect) {
      const colors = task.instructions.map((inst) => inst.targetColor).join(", ");
      speak(colors);
      setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
    }
  };

  const handleRetry = () => {
    setColoredItems({});
    setChecked(false);
    setResults({});
    setSelectedColor(null);
  };

  const allCorrect = checked && Object.values(results).every(Boolean);

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="space-y-2">
        {task.instructions.map((inst, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl p-3 shadow-sm text-base font-semibold ${
              checked
                ? results[inst.targetItem]
                  ? "ring-2 ring-green-400"
                  : "ring-2 ring-red-400"
                : ""
            }`}
          >
            {inst.text}
            {checked && (results[inst.targetItem] ? " ✅" : " ❌")}
          </div>
        ))}
      </div>

      {/* Color palette */}
      <div>
        <p className="text-sm text-[var(--text-light)] mb-2">Tria un color:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {PALETTE.map((p) => (
            <motion.button
              key={p.name}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColor(p.name)}
              disabled={checked}
              className={`w-12 h-12 rounded-xl border-3 transition-all ${
                selectedColor === p.name
                  ? "ring-3 ring-[var(--primary)] scale-110"
                  : "border-gray-200"
              }`}
              style={{ backgroundColor: p.color }}
              aria-label={p.name}
            />
          ))}
        </div>
      </div>

      {/* Objects to color */}
      <div className="flex flex-wrap gap-3 justify-center">
        {task.instructions.map((inst, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleItemTap(inst.targetItem)}
            disabled={checked || !selectedColor}
            className="w-24 h-24 rounded-2xl border-2 border-gray-200 flex flex-col items-center justify-center gap-1 text-4xl transition-all"
            style={{
              backgroundColor: coloredItems[inst.targetItem]
                ? `${getHex(coloredItems[inst.targetItem])}30`
                : "white",
              borderColor: coloredItems[inst.targetItem]
                ? getHex(coloredItems[inst.targetItem])
                : "#e5e7eb",
            }}
          >
            <span>{inst.targetItem}</span>
          </motion.button>
        ))}
      </div>

      {/* Check / Retry */}
      <div className="flex justify-center pt-2">
        {!checked ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            disabled={!allColored}
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
