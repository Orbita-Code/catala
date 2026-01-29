"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyWordTask } from "@/types/tasks";
import type { TaskResult } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";
import LetterTile from "@/components/ui/LetterTile";
import SlotRow from "@/components/ui/SlotRow";
import SpeakerButton from "@/components/ui/SpeakerButton";
import HintDialog from "@/components/ui/HintDialog";
import { useHintSystem } from "@/hooks/useHintSystem";
import { speak } from "@/lib/tts";
import { ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  task: CopyWordTask;
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

export default function CopyWord({ task, onComplete }: Props) {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [slots, setSlots] = useState<(string | null)[]>(
    Array(task.words[0].catalan.length).fill(null)
  );
  const [bank, setBank] = useState<{ letter: string; used: boolean }[]>(() =>
    shuffleArray(task.words[0].catalan.split("")).map((l) => ({ letter: l, used: false }))
  );
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const hints = useHintSystem();

  const currentWord = task.words[currentWordIdx];
  const activeSlotIdx = slots.findIndex((s) => s === null);

  // When hint is accepted, play TTS
  useEffect(() => {
    if (hints.showHint && hints.hintItemId) {
      speak(hints.hintItemId);
    }
  }, [hints.showHint, hints.hintItemId]);

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

  const moveToNext = () => {
    if (currentWordIdx < task.words.length - 1) {
      const nextIdx = currentWordIdx + 1;
      const nextWord = task.words[nextIdx];
      setCurrentWordIdx(nextIdx);
      setSlots(Array(nextWord.catalan.length).fill(null));
      setBank(shuffleArray(nextWord.catalan.split("")).map((l) => ({ letter: l, used: false })));
      setChecked(false);
      setCorrect(null);
    } else {
      onComplete({
        allCorrect: hints.erroredItems.length === 0,
        erroredItems: hints.erroredItems,
      });
    }
  };

  const handleCheck = () => {
    const answer = slots.join("").toLowerCase();
    const isCorrect = answer === currentWord.catalan.toLowerCase();
    setChecked(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      const newCount = completedCount + 1;
      setCompletedCount(newCount);
      hints.dismissHint();

      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#6C5CE7", "#FDCB6E", "#00CECE"],
      });

      setTimeout(() => moveToNext(), 1000);
    } else {
      hints.recordWrongAttempt(currentWord.catalan);
    }
  };

  const handleRetry = () => {
    setSlots(Array(currentWord.catalan.length).fill(null));
    setBank(shuffleArray(currentWord.catalan.split("")).map((l) => ({ letter: l, used: false })));
    setChecked(false);
    setCorrect(null);
  };

  const handleSkip = () => {
    hints.skipItem(currentWord.catalan);
    setTimeout(() => moveToNext(), 300);
  };

  return (
    <div className="space-y-5">
      <HintDialog
        visible={hints.showHintDialog}
        onAccept={hints.acceptHint}
        onDecline={hints.declineHint}
      />

      {/* Progress with back arrow */}
      <div className="flex items-center justify-center gap-3 text-sm text-[var(--text-light)]">
        {currentWordIdx > 0 && (
          <button
            onClick={() => {
              const prevIdx = currentWordIdx - 1;
              const prevWord = task.words[prevIdx];
              setCurrentWordIdx(prevIdx);
              setSlots(Array(prevWord.catalan.length).fill(null));
              setBank(shuffleArray(prevWord.catalan.split("")).map((l) => ({ letter: l, used: false })));
              setChecked(false);
              setCorrect(null);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Anterior"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <span>{currentWordIdx + 1} / {task.words.length}</span>
      </div>

      <motion.div
        key={currentWordIdx}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        {/* Word display with emoji */}
        <div className="text-center mb-4">
          {getWordEmoji(currentWord.catalan) && (
            <div className="text-4xl mb-2">{getWordEmoji(currentWord.catalan)}</div>
          )}
          <div className="flex items-center justify-center gap-2">
            <p className="text-3xl font-black text-[var(--primary)] font-handwriting">
              {currentWord.catalan}
            </p>
            <SpeakerButton text={currentWord.catalan} />
          </div>
          <p className="text-sm text-[var(--text-light)] mt-1">
            Copia la paraula tocant les lletres
          </p>
        </div>

        {/* Hint: highlight next slot with golden glow */}
        {hints.showHint && hints.hintItemId === currentWord.catalan && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm font-semibold text-amber-600 mb-2"
          >
            💡 Fixa&apos;t en l&apos;ordre de les lletres!
          </motion.p>
        )}

        {/* Slots */}
        <div className="flex justify-center mb-5">
          <SlotRow
            slots={slots}
            activeIndex={activeSlotIdx >= 0 ? activeSlotIdx : undefined}
            correct={correct}
            onSlotTap={handleSlotTap}
          />
        </div>

        {/* Letter bank */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {bank.map((item, i) => (
            <LetterTile
              key={i}
              letter={item.letter}
              disabled={item.used || checked}
              selected={false}
              onClick={() => handleLetterTap(i)}
            />
          ))}
        </div>

        {/* Check / Retry / Skip buttons */}
        <div className="flex justify-center gap-3">
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
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                className="px-6 py-3 bg-[var(--secondary)] text-white font-bold rounded-2xl text-lg shadow-md"
              >
                Torna a provar!
              </motion.button>
              {hints.canSkip(currentWord.catalan) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="px-6 py-3 bg-gray-200 text-[var(--text-light)] font-bold rounded-2xl text-lg"
                >
                  Salta →
                </motion.button>
              )}
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
