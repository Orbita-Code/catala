"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ColorByInstructionTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import confetti from "canvas-confetti";
import { speak } from "@/lib/tts";

interface Props {
  task: ColorByInstructionTask;
  onComplete: (result: TaskResult) => void;
}

const PALETTE = [
  { name: "vermell", color: "#FF6B6B", label: "vermell" },
  { name: "blau", color: "#0984E3", label: "blau" },
  { name: "verd", color: "#00B894", label: "verd" },
  { name: "groc", color: "#FDCB6E", label: "groc" },
  { name: "taronja", color: "#FF9F43", label: "taronja" },
  { name: "lila", color: "#A29BFE", label: "lila" },
  { name: "marró", color: "#8B6F47", label: "marró" },
  { name: "negre", color: "#2D3436", label: "negre" },
  { name: "blanc", color: "#F5F5F5", label: "blanc" },
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
    speak(targetItem);
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
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#6C5CE7", "#FDCB6E", "#00CECE", "#FF6B6B"],
      });
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
      {/* Instructions list */}
      <div className="space-y-1.5">
        {task.instructions.map((inst, i) => {
          const isColored = !!coloredItems[inst.targetItem];
          const isChecked = checked && results[inst.targetItem] !== undefined;
          return (
            <div
              key={i}
              className={`bg-white rounded-xl px-3 py-2 shadow-sm text-sm font-semibold flex items-center gap-2 ${
                isChecked
                  ? results[inst.targetItem]
                    ? "ring-2 ring-green-400"
                    : "ring-2 ring-red-400"
                  : isColored
                    ? "ring-1 ring-purple-200"
                    : ""
              }`}
            >
              <span
                className="w-4 h-4 rounded-full flex-shrink-0 border"
                style={{ backgroundColor: getHex(inst.targetColor) }}
              />
              <span className="flex-1">{inst.text}</span>
              {isChecked && (results[inst.targetItem] ? " ✅" : " ❌")}
            </div>
          );
        })}
      </div>

      {/* Color palette */}
      <div>
        <p className="text-sm text-[var(--text-light)] mb-2 text-center">
          {selectedColor ? `Color triat: ${selectedColor}` : "Tria un color:"}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {PALETTE.map((p) => (
            <motion.button
              key={p.name}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColor(p.name)}
              disabled={checked}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                selectedColor === p.name
                  ? "ring-3 ring-[var(--primary)] scale-110 border-[var(--primary)]"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: p.color }}
              aria-label={p.name}
            />
          ))}
        </div>
      </div>

      {/* Objects to color - real illustrations */}
      <div className="grid grid-cols-2 gap-3">
        {task.instructions.map((inst, i) => {
          const illustration = getWordIllustration(inst.targetItem);
          const appliedColor = coloredItems[inst.targetItem];
          const isCorrect = checked ? results[inst.targetItem] : null;

          return (
            <motion.button
              key={i}
              whileTap={checked ? undefined : { scale: 0.95 }}
              onClick={() => handleItemTap(inst.targetItem)}
              disabled={checked || !selectedColor}
              className={`relative bg-white rounded-2xl p-3 shadow-sm border-3 transition-all flex flex-col items-center gap-1 ${
                isCorrect === true
                  ? "border-green-400"
                  : isCorrect === false
                    ? "border-red-400"
                    : appliedColor
                      ? "border-opacity-100"
                      : selectedColor
                        ? "border-gray-200 hover:border-purple-300 cursor-pointer"
                        : "border-gray-200 opacity-70"
              }`}
              style={{
                borderColor:
                  isCorrect === true
                    ? undefined
                    : isCorrect === false
                      ? undefined
                      : appliedColor
                        ? getHex(appliedColor)
                        : undefined,
              }}
            >
              {illustration ? (
                <img
                  src={illustration}
                  alt={inst.targetItem}
                  className="w-20 h-20 object-contain transition-all duration-500"
                  style={{
                    filter: appliedColor ? "none" : "grayscale(1) opacity(0.6)",
                  }}
                />
              ) : (
                <span className="text-3xl">{inst.targetItem}</span>
              )}
              <span className="text-xs font-bold text-[var(--text)] font-handwriting">
                {inst.targetItem}
              </span>
              {/* Color dot overlay when colored */}
              <AnimatePresence>
                {appliedColor && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: getHex(appliedColor) }}
                  />
                )}
              </AnimatePresence>
              {isCorrect !== null && (
                <span className="absolute top-1 left-1 text-lg">
                  {isCorrect ? "✅" : "❌"}
                </span>
              )}
            </motion.button>
          );
        })}
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
