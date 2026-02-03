"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ColorByInstructionTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { RefreshCcw } from "lucide-react";

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
  { name: "lila", color: "#A29BFE" },
  { name: "marró", color: "#8B6F47" },
  { name: "negre", color: "#2D3436" },
  { name: "blanc", color: "#F5F5F5" },
  { name: "rosa", color: "#FDA7DF" },
];

export default function ColorByInstruction({ task, onComplete }: Props) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [coloredItems, setColoredItems] = useState<Record<string, string>>({});
  const [correctItems, setCorrectItems] = useState<Set<string>>(new Set());
  const [wrongItem, setWrongItem] = useState<string | null>(null);
  const [wrongColor, setWrongColor] = useState<string | null>(null);
  const [erroredItems, setErroredItems] = useState<Set<string>>(new Set());

  const getHex = (name: string) =>
    PALETTE.find((p) => p.name === name)?.color ?? "#ccc";

  const applyColor = (item: string, color: string) => {
    // Find the instruction for this item
    const inst = task.instructions.find((i) => i.targetItem === item);
    if (!inst) return;

    const isCorrect = color.toLowerCase() === inst.targetColor.toLowerCase();

    if (isCorrect) {
      setColoredItems((prev) => ({ ...prev, [item]: color }));
      setCorrectItems((prev) => new Set(prev).add(item));
      setSelectedItem(null);
      setSelectedColor(null);
      speak(item);
      celebrate();

      // Check if all done
      const newCorrectCount = correctItems.size + 1;
      if (newCorrectCount === task.instructions.length) {
        celebrateBig();
        setTimeout(
          () =>
            onComplete({
              allCorrect: erroredItems.size === 0,
              erroredItems: Array.from(erroredItems),
            }),
          1400
        );
      }
    } else {
      // Wrong — show X on item and color, then clear
      setWrongItem(item);
      setWrongColor(color);
      setErroredItems((prev) => new Set(prev).add(item));
      setTimeout(() => {
        setWrongItem(null);
        setWrongColor(null);
        // Clear the coloring so they can retry
        setColoredItems((prev) => {
          const next = { ...prev };
          delete next[item];
          return next;
        });
        setSelectedItem(null);
        setSelectedColor(null);
      }, 1200);
    }
  };

  const handleColorTap = (colorName: string) => {
    if (wrongItem) return; // wait for wrong feedback to clear

    if (selectedItem) {
      // Item was selected first → apply this color to it
      applyColor(selectedItem, colorName);
    } else {
      // Just select the color
      setSelectedColor(colorName);
    }
  };

  const handleItemTap = (targetItem: string) => {
    if (wrongItem) return; // wait for wrong feedback to clear
    if (correctItems.has(targetItem)) return; // already correct

    if (selectedColor) {
      // Color was selected first → apply it to this item
      applyColor(targetItem, selectedColor);
    } else {
      // Just select the item
      setSelectedItem(targetItem);
    }
  };

  const allDone = correctItems.size === task.instructions.length;

  return (
    <div className="space-y-4">
      {/* Instruction text */}
      <p className="text-sm text-[var(--text-light)] mb-2 text-center">
        {selectedItem && !selectedColor
          ? `Ara tria un color per a: ${selectedItem}`
          : selectedColor && !selectedItem
            ? `Color triat: ${selectedColor} — toca un objecte`
            : "Tria un color o un objecte:"}
      </p>

      {/* Color palette at top */}
      <div className="flex flex-wrap gap-2 justify-center">
        {PALETTE.map((p) => {
          const isWrong = wrongColor === p.name;
          return (
            <motion.button
              key={p.name}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleColorTap(p.name)}
              disabled={allDone}
              className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                isWrong
                  ? "ring-3 ring-red-400 scale-110 border-red-400"
                  : selectedColor === p.name
                    ? "ring-3 ring-[var(--primary)] scale-110 border-[var(--primary)]"
                    : "border-gray-300"
              }`}
              style={{ backgroundColor: p.color }}
              aria-label={p.name}
            >
              {isWrong && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center text-red-600 font-black text-lg drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                >
                  ✗
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Item cards grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {task.instructions.map((inst, i) => {
          const illustration = getWordIllustration(inst.targetItem);
          const appliedColor = coloredItems[inst.targetItem];
          const isCorrect = correctItems.has(inst.targetItem);
          const isWrong = wrongItem === inst.targetItem;
          const isSelected = selectedItem === inst.targetItem;

          return (
            <motion.button
              key={i}
              whileTap={isCorrect ? undefined : { scale: 0.95 }}
              onClick={() => handleItemTap(inst.targetItem)}
              disabled={allDone || isCorrect}
              className={`relative bg-white rounded-xl shadow-sm border-2 transition-all flex flex-col items-center p-2 gap-1 ${
                isCorrect
                  ? "border-green-400 bg-green-50"
                  : isWrong
                    ? "border-red-400 bg-red-50 animate-[shake_0.3s]"
                    : isSelected
                      ? "border-[var(--primary)] bg-purple-50 ring-2 ring-[var(--primary)]"
                      : appliedColor
                        ? ""
                        : "border-gray-200 hover:border-purple-300 cursor-pointer"
              }`}
              style={{
                borderColor:
                  isCorrect || isWrong || isSelected
                    ? undefined
                    : appliedColor
                      ? getHex(appliedColor)
                      : undefined,
                borderWidth:
                  appliedColor && !isCorrect && !isWrong && !isSelected
                    ? 3
                    : undefined,
              }}
            >
              {/* Illustration */}
              <div className="w-16 h-16 flex items-center justify-center">
                {illustration ? (
                  <img
                    src={illustration}
                    alt={inst.targetItem}
                    className="w-14 h-14 object-contain transition-all duration-500"
                    style={{
                      filter: isCorrect || appliedColor
                        ? "none"
                        : "grayscale(1) opacity(0.5)",
                    }}
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">?</span>
                )}
              </div>

              {/* Instruction text */}
              <div className="flex items-center gap-0.5">
                <SpeakerButton text={inst.text} size={12} className="p-1 flex-shrink-0" />
                <p className="text-[10px] leading-tight font-semibold text-[var(--text)] text-center">
                  {inst.text}
                </p>
              </div>

              {/* Applied color dot */}
              <AnimatePresence>
                {appliedColor && !isCorrect && !isWrong && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: getHex(appliedColor) }}
                  />
                )}
              </AnimatePresence>

              {/* Result icons */}
              {isCorrect && (
                <span className="absolute top-0.5 right-0.5 text-sm">✅</span>
              )}
              {isWrong && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0.5 right-0.5"
                >
                  <RefreshCcw className="w-4 h-4 text-orange-500" />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
