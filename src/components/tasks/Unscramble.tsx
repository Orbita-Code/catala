"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UnscrambleTask, TaskResult } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";
import LetterTile from "@/components/ui/LetterTile";
import SlotRow from "@/components/ui/SlotRow";
import { ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  task: UnscrambleTask;
  onComplete: (result: TaskResult) => void;
}

export default function Unscramble({ task, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [slots, setSlots] = useState<(string | null)[]>(
    Array(task.words[0].correct.length).fill(null)
  );
  const [bank, setBank] = useState<{ letter: string; used: boolean }[]>(() =>
    task.words[0].scrambled.split("").map((l) => ({ letter: l, used: false }))
  );
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const currentWord = task.words[currentIdx];

  const handleLetterTap = (bankIdx: number) => {
    if (checked || bank[bankIdx].used) return;
    const slotIdx = slots.findIndex((s) => s === null);
    if (slotIdx === -1) return;

    const newSlots = [...slots];
    newSlots[slotIdx] = bank[bankIdx].letter;
    setSlots(newSlots);

    const newBank = [...bank];
    newBank[bankIdx] = { ...newBank[bankIdx], used: true };
    setBank(newBank);
  };

  const handleSlotTap = (slotIdx: number) => {
    if (checked || slots[slotIdx] === null) return;
    const letter = slots[slotIdx]!;
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    const filled = newSlots.filter((s) => s !== null);
    const result = [...filled, ...Array(newSlots.length - filled.length).fill(null)];
    setSlots(result);

    const bankIdx = bank.findIndex((b) => b.used && b.letter === letter);
    if (bankIdx !== -1) {
      const newBank = [...bank];
      newBank[bankIdx] = { ...newBank[bankIdx], used: false };
      setBank(newBank);
    }
  };

  const allFilled = slots.every((s) => s !== null);

  const handleCheck = () => {
    const answer = slots.join("").toUpperCase();
    const isCorrect = answer === currentWord.correct.toUpperCase();
    setChecked(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      // Mini celebration for each correct word
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#6C5CE7", "#FDCB6E", "#00CECE"],
      });

      setTimeout(() => {
        if (currentIdx < task.words.length - 1) {
          const nextIdx = currentIdx + 1;
          const nextWord = task.words[nextIdx];
          setCurrentIdx(nextIdx);
          setSlots(Array(nextWord.correct.length).fill(null));
          setBank(nextWord.scrambled.split("").map((l) => ({ letter: l, used: false })));
          setChecked(false);
          setCorrect(null);
        } else {
          onComplete({ allCorrect: true, erroredItems: [] });
        }
      }, 1000);
    }
  };

  const handleRetry = () => {
    setSlots(Array(currentWord.correct.length).fill(null));
    setBank(currentWord.scrambled.split("").map((l) => ({ letter: l, used: false })));
    setChecked(false);
    setCorrect(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3 text-sm text-[var(--text-light)]">
        {currentIdx > 0 && (
          <button
            onClick={() => {
              const prevIdx = currentIdx - 1;
              const prevWord = task.words[prevIdx];
              setCurrentIdx(prevIdx);
              setSlots(Array(prevWord.correct.length).fill(null));
              setBank(prevWord.scrambled.split("").map((l) => ({ letter: l, used: false })));
              setChecked(false);
              setCorrect(null);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Anterior"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <span>{currentIdx + 1} / {task.words.length}</span>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        {getWordEmoji(currentWord.correct) && (
          <div className="text-4xl text-center mb-3">{getWordEmoji(currentWord.correct)}</div>
        )}

        <p className="text-center text-sm text-[var(--text-light)] mb-4">
          Ordena les lletres tocant-les
        </p>

        {/* Slots */}
        <div className="flex justify-center mb-5">
          <SlotRow
            slots={slots}
            activeIndex={slots.findIndex((s) => s === null)}
            correct={correct}
            onSlotTap={handleSlotTap}
          />
        </div>

        {/* Letter bank (scrambled) */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {bank.map((item, i) => (
            <LetterTile
              key={i}
              letter={item.letter}
              disabled={item.used || checked}
              onClick={() => handleLetterTap(i)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          {!checked ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheck}
              disabled={!allFilled}
              className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg disabled:opacity-40 shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
            >
              Comprova!
            </motion.button>
          ) : !correct ? (
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
      </motion.div>
    </div>
  );
}
