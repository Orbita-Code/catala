"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CopyWordTask } from "@/types/tasks";
import type { TaskResult } from "@/types/tasks";
import { getWordEmoji, getWordIllustration } from "@/lib/illustrations";
import LetterTile from "@/components/ui/LetterTile";
import SlotRow from "@/components/ui/SlotRow";
import SpeakerButton from "@/components/ui/SpeakerButton";
import InlineHintMascot from "@/components/ui/InlineHintMascot";
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
  const [hintLetterIdx, setHintLetterIdx] = useState<number | null>(null);
  const hints = useHintSystem();

  const currentWord = task.words[currentWordIdx];
  const activeSlotIdx = slots.findIndex((s) => s === null);

  // When hint is accepted, find the correct letter in the bank and highlight it
  useEffect(() => {
    if (hints.showHint && hints.hintItemId === currentWord.catalan) {
      // Find the next empty slot index
      const nextSlotIdx = slots.findIndex((s) => s === null);
      if (nextSlotIdx === -1) return;
      // The correct letter for that slot
      const correctLetter = currentWord.catalan[nextSlotIdx];
      // Find that letter in the bank (unused)
      const bankIdx = bank.findIndex(
        (b) => !b.used && b.letter.toLowerCase() === correctLetter.toLowerCase()
      );
      setHintLetterIdx(bankIdx >= 0 ? bankIdx : null);
    } else {
      setHintLetterIdx(null);
    }
  }, [hints.showHint, hints.hintItemId, currentWord.catalan, slots, bank]);

  const handleLetterTap = useCallback((bankIdx: number) => {
    if (checked || bank[bankIdx].used) return;
    const slotIdx = slots.findIndex((s) => s === null);
    if (slotIdx === -1) return;

    const newSlots = [...slots];
    newSlots[slotIdx] = bank[bankIdx].letter;
    setSlots(newSlots);

    const newBank = [...bank];
    newBank[bankIdx] = { ...newBank[bankIdx], used: true };
    setBank(newBank);

    // Clear hint highlight after placing a letter
    setHintLetterIdx(null);
  }, [checked, bank, slots]);

  const handleSlotTap = useCallback((slotIdx: number) => {
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
  }, [checked, slots, bank]);

  const allFilled = slots.every((s) => s !== null);

  const moveToNext = useCallback(() => {
    if (currentWordIdx < task.words.length - 1) {
      const nextIdx = currentWordIdx + 1;
      const nextWord = task.words[nextIdx];
      setCurrentWordIdx(nextIdx);
      setSlots(Array(nextWord.catalan.length).fill(null));
      setBank(shuffleArray(nextWord.catalan.split("")).map((l) => ({ letter: l, used: false })));
      setChecked(false);
      setCorrect(null);
      setHintLetterIdx(null);
    } else {
      onComplete({
        allCorrect: hints.erroredItems.length === 0,
        erroredItems: hints.erroredItems,
      });
    }
  }, [currentWordIdx, task.words, onComplete, hints.erroredItems]);

  const handleCheck = useCallback(() => {
    const answer = slots.join("").toLowerCase();
    const isCorrect = answer === currentWord.catalan.toLowerCase();
    setChecked(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      const newCount = completedCount + 1;
      setCompletedCount(newCount);
      hints.dismissHint();
      setHintLetterIdx(null);

      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#6C5CE7", "#FDCB6E", "#00CECE"],
      });
      speak(currentWord.catalan);

      setTimeout(() => moveToNext(), 1000);
    } else {
      hints.recordWrongAttempt(currentWord.catalan);
    }
  }, [slots, currentWord, completedCount, hints, moveToNext]);

  // Auto-advance after 5 wrong attempts
  useEffect(() => {
    if (hints.shouldAutoAdvance(currentWord.catalan) && checked && !correct) {
      hints.addError(currentWord.catalan);
      hints.dismissHint();
      setTimeout(() => moveToNext(), 300);
    }
  }, [hints, currentWord.catalan, checked, correct, moveToNext]);

  const handleRetry = useCallback(() => {
    setSlots(Array(currentWord.catalan.length).fill(null));
    setBank(shuffleArray(currentWord.catalan.split("")).map((l) => ({ letter: l, used: false })));
    setChecked(false);
    setCorrect(null);
    setHintLetterIdx(null);
  }, [currentWord.catalan]);

  // Keyboard input support
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (checked && !correct) {
          handleRetry();
        } else if (!checked && allFilled) {
          handleCheck();
        }
        return;
      }

      if (checked) return;

      if (e.key === "Backspace") {
        // Find the last filled slot
        let lastFilledIdx = -1;
        for (let i = slots.length - 1; i >= 0; i--) {
          if (slots[i] !== null) {
            lastFilledIdx = i;
            break;
          }
        }
        if (lastFilledIdx !== -1) {
          handleSlotTap(lastFilledIdx);
        }
        return;
      }

      // Match letter keys (including accented Catalan characters)
      if (e.key.length === 1 && /^[a-zA-ZàèéìòóùúïüçÀÈÉÌÒÓÙÚÏÜÇ]$/.test(e.key)) {
        const pressed = e.key.toLowerCase();
        const stripAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        // First try exact match, then try base-letter match (e.g. "i" matches "í")
        let bankIdx = bank.findIndex(
          (b) => !b.used && b.letter.toLowerCase() === pressed
        );
        if (bankIdx === -1) {
          bankIdx = bank.findIndex(
            (b) => !b.used && stripAccents(b.letter.toLowerCase()) === stripAccents(pressed)
          );
        }
        if (bankIdx !== -1) {
          handleLetterTap(bankIdx);
        }
      }
    },
    [checked, correct, allFilled, slots, bank, handleCheck, handleRetry, handleSlotTap, handleLetterTap]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="space-y-5">
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
              setHintLetterIdx(null);
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
        {/* Word display with illustration or emoji */}
        <div className="text-center mb-4">
          {getWordIllustration(currentWord.catalan) ? (
            <div className="mb-2 flex justify-center">
              <img
                src={getWordIllustration(currentWord.catalan)!}
                alt={currentWord.catalan}
                className="w-32 h-32 object-contain"
              />
            </div>
          ) : getWordEmoji(currentWord.catalan) ? (
            <div className="text-4xl mb-2">{getWordEmoji(currentWord.catalan)}</div>
          ) : null}
          <div className="flex items-center justify-center gap-2">
            <p className="text-3xl font-black text-[var(--primary)] font-handwriting">
              {currentWord.catalan}
            </p>
            <SpeakerButton text={currentWord.catalan} size={26} />
          </div>
          <p className="text-sm text-[var(--text-light)] mt-1">
            Copia la paraula tocant les lletres
          </p>
        </div>

        {/* Inline hint mascot */}
        <InlineHintMascot
          visible={hints.showHintDialog}
          onAccept={() => {
            hints.acceptHint();
            // Auto-reset slots so child can retry with hint visible
            setSlots(Array(currentWord.catalan.length).fill(null));
            setBank(shuffleArray(currentWord.catalan.split("")).map((l) => ({ letter: l, used: false })));
            setChecked(false);
            setCorrect(null);
          }}
          onDecline={hints.declineHint}
        />

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
            <div key={i} className={hintLetterIdx === i ? "hint-pulse rounded-xl" : ""}>
              <LetterTile
                letter={item.letter}
                disabled={item.used || checked}
                selected={false}
                onClick={() => handleLetterTap(i)}
              />
            </div>
          ))}
        </div>

        {/* Check / Retry buttons */}
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              className="px-6 py-3 bg-[var(--secondary)] text-white font-bold rounded-2xl text-lg shadow-md"
            >
              Torna a provar!
            </motion.button>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
