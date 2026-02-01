"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { UnscrambleTask, TaskResult } from "@/types/tasks";
import { getWordEmoji, getWordIllustration } from "@/lib/illustrations";
import LetterTile from "@/components/ui/LetterTile";
import SlotRow from "@/components/ui/SlotRow";
import InlineHintMascot from "@/components/ui/InlineHintMascot";
import { useHintSystem } from "@/hooks/useHintSystem";
import { ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { speak } from "@/lib/tts";
import SpeakerButton from "@/components/ui/SpeakerButton";

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
  const [hintLetterIdx, setHintLetterIdx] = useState<number | null>(null);
  const hints = useHintSystem();

  const currentWord = task.words[currentIdx];

  // When hint is accepted, find the correct letter in the bank and highlight it
  useEffect(() => {
    if (hints.showHint && hints.hintItemId === currentWord.correct) {
      const nextSlotIdx = slots.findIndex((s) => s === null);
      if (nextSlotIdx === -1) return;
      const correctLetter = currentWord.correct[nextSlotIdx];
      const bankIdx = bank.findIndex(
        (b) => !b.used && b.letter.toLowerCase() === correctLetter.toLowerCase()
      );
      setHintLetterIdx(bankIdx >= 0 ? bankIdx : null);
    } else {
      setHintLetterIdx(null);
    }
  }, [hints.showHint, hints.hintItemId, currentWord.correct, slots, bank]);

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

    setHintLetterIdx(null);
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

  const moveToNext = useCallback(() => {
    if (currentIdx < task.words.length - 1) {
      const nextIdx = currentIdx + 1;
      const nextWord = task.words[nextIdx];
      setCurrentIdx(nextIdx);
      setSlots(Array(nextWord.correct.length).fill(null));
      setBank(nextWord.scrambled.split("").map((l) => ({ letter: l, used: false })));
      setChecked(false);
      setCorrect(null);
      setHintLetterIdx(null);
    } else {
      onComplete({
        allCorrect: hints.erroredItems.length === 0,
        erroredItems: hints.erroredItems,
      });
    }
  }, [currentIdx, task.words, onComplete, hints.erroredItems]);

  const handleCheck = useCallback(() => {
    const answer = slots.join("").toLowerCase();
    const isCorrect = answer === currentWord.correct.toLowerCase();
    setChecked(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      hints.dismissHint();
      setHintLetterIdx(null);

      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#6C5CE7", "#FDCB6E", "#00CECE"],
      });

      speak(currentWord.correct);

      setTimeout(() => moveToNext(), 1000);
    } else {
      hints.recordWrongAttempt(currentWord.correct);
    }
  }, [slots, currentWord, hints, moveToNext]);

  // Auto-advance after 5 wrong attempts
  useEffect(() => {
    if (hints.shouldAutoAdvance(currentWord.correct) && checked && !correct) {
      hints.addError(currentWord.correct);
      hints.dismissHint();
      setTimeout(() => moveToNext(), 300);
    }
  }, [hints, currentWord.correct, checked, correct, moveToNext]);

  const handleRetry = useCallback(() => {
    setSlots(Array(currentWord.correct.length).fill(null));
    setBank(currentWord.scrambled.split("").map((l) => ({ letter: l, used: false })));
    setChecked(false);
    setCorrect(null);
    setHintLetterIdx(null);
  }, [currentWord]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (checked && !correct) {
          handleRetry();
        } else if (!checked && allFilled) {
          handleCheck();
        }
        return;
      }

      if (checked) return;

      if (e.key === "Backspace") {
        e.preventDefault();
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

      // Match letter keys including accented Catalan characters
      if (e.key.length === 1 && /^[a-zA-ZàèéìòóùúïüçÀÈÉÌÒÓÙÚÏÜÇ]$/.test(e.key)) {
        e.preventDefault();
        const pressedLetter = e.key.toLowerCase();
        const stripAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let bankIdx = bank.findIndex(
          (b) => !b.used && b.letter.toLowerCase() === pressedLetter
        );
        if (bankIdx === -1) {
          bankIdx = bank.findIndex(
            (b) => !b.used && stripAccents(b.letter.toLowerCase()) === stripAccents(pressedLetter)
          );
        }
        if (bankIdx !== -1) {
          handleLetterTap(bankIdx);
        }
      }
    },
    [checked, correct, slots, bank, allFilled, handleCheck, handleRetry]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
              setHintLetterIdx(null);
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
        <div className="flex items-center justify-center gap-2 mb-3">
          {getWordIllustration(currentWord.correct) ? (
            <img
              src={getWordIllustration(currentWord.correct)!}
              alt={currentWord.correct}
              className="w-20 h-20 object-contain"
            />
          ) : getWordEmoji(currentWord.correct) ? (
            <div className="text-4xl">{getWordEmoji(currentWord.correct)}</div>
          ) : null}
          <SpeakerButton text={currentWord.correct} />
        </div>

        <p className="text-center text-sm text-[var(--text-light)] mb-4">
          Ordena les lletres tocant-les
        </p>

        {/* Inline hint mascot */}
        <InlineHintMascot
          visible={hints.showHintDialog}
          onAccept={() => {
            hints.acceptHint();
            // Auto-reset slots so child can retry with hint visible
            setSlots(Array(currentWord.correct.length).fill(null));
            setBank(currentWord.scrambled.split("").map((l) => ({ letter: l, used: false })));
            setChecked(false);
            setCorrect(null);
          }}
          onDecline={hints.declineHint}
        />

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
            <div key={i} className={hintLetterIdx === i ? "hint-pulse rounded-xl" : ""}>
              <LetterTile
                letter={item.letter}
                disabled={item.used || checked}
                onClick={() => handleLetterTap(i)}
              />
            </div>
          ))}
        </div>

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
