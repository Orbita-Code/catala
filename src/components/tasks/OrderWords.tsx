"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { OrderWordsTask, TaskResult } from "@/types/tasks";
import { ArrowLeft } from "lucide-react";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";

interface Props {
  task: OrderWordsTask;
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

export default function OrderWords({ task, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [bank, setBank] = useState<{ word: string; used: boolean }[]>(() =>
    shuffleArray(task.sentences[0].scrambled).map((w) => ({ word: w, used: false }))
  );
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [erroredItems, setErroredItems] = useState<string[]>([]);

  const currentSentence = task.sentences[currentIdx];

  const moveToNext = useCallback(() => {
    if (currentIdx < task.sentences.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setSelectedWords([]);
      setBank(
        shuffleArray(task.sentences[nextIdx].scrambled).map((w) => ({
          word: w,
          used: false,
        }))
      );
      setChecked(false);
      setCorrect(null);
    } else {
      onComplete({
        allCorrect: erroredItems.length === 0,
        erroredItems,
      });
    }
  }, [currentIdx, task.sentences, onComplete, erroredItems]);

  const handleWordTap = (bankIdx: number) => {
    if (checked || bank[bankIdx].used) return;
    setSelectedWords([...selectedWords, bank[bankIdx].word]);
    const newBank = [...bank];
    newBank[bankIdx] = { ...newBank[bankIdx], used: true };
    setBank(newBank);
  };

  const handleSlotTap = (slotIdx: number) => {
    if (checked) return;
    const word = selectedWords[slotIdx];
    const newSelected = [...selectedWords];
    newSelected.splice(slotIdx, 1);
    setSelectedWords(newSelected);

    const bankIdx = bank.findIndex((b) => b.used && b.word === word);
    if (bankIdx !== -1) {
      const newBank = [...bank];
      newBank[bankIdx] = { ...newBank[bankIdx], used: false };
      setBank(newBank);
    }
  };

  const allFilled = selectedWords.length === currentSentence.correct.length;

  const handleCheck = useCallback(() => {
    const isCorrect = selectedWords.every(
      (w, i) => w.toLowerCase() === currentSentence.correct[i].toLowerCase()
    );
    setChecked(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      celebrate();
      speak(currentSentence.correct.join(" "));
      setTimeout(() => moveToNext(), 1200);
    } else {
      setErroredItems((prev) => {
        const key = currentSentence.correct.join(" ");
        return prev.includes(key) ? prev : [...prev, key];
      });
    }
  }, [selectedWords, currentSentence, moveToNext]);

  const handleRetry = useCallback(() => {
    setSelectedWords([]);
    setBank(
      shuffleArray(currentSentence.scrambled).map((w) => ({
        word: w,
        used: false,
      }))
    );
    setChecked(false);
    setCorrect(null);
  }, [currentSentence]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3 text-sm text-[var(--text-light)]">
        {currentIdx > 0 && (
          <button
            onClick={() => {
              const prevIdx = currentIdx - 1;
              setCurrentIdx(prevIdx);
              setSelectedWords([]);
              setBank(
                shuffleArray(task.sentences[prevIdx].scrambled).map((w) => ({
                  word: w,
                  used: false,
                }))
              );
              setChecked(false);
              setCorrect(null);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Anterior"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <span>
          {currentIdx + 1} / {task.sentences.length}
        </span>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        <p className="text-center text-sm text-[var(--text-light)] mb-4">
          Ordena les paraules per formar la frase
        </p>

        {/* Sentence slots */}
        <div className="flex flex-wrap justify-center gap-2 mb-5 min-h-[52px] p-3 bg-gray-50 rounded-xl">
          {selectedWords.length === 0 ? (
            <span className="text-gray-300 text-lg">Toca les paraules...</span>
          ) : (
            selectedWords.map((word, i) => (
              <motion.button
                key={`slot-${i}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSlotTap(i)}
                disabled={checked}
                className={`px-4 py-2 rounded-xl font-bold text-lg font-handwriting transition-all ${
                  checked
                    ? correct
                      ? "bg-green-100 text-green-700 border-2 border-green-400"
                      : selectedWords[i].toLowerCase() ===
                          currentSentence.correct[i]?.toLowerCase()
                        ? "bg-green-100 text-green-700 border-2 border-green-400"
                        : "bg-red-100 text-red-700 border-2 border-red-400"
                    : "bg-white text-[var(--primary)] border-2 border-[var(--primary)] shadow-sm"
                }`}
              >
                {word}
              </motion.button>
            ))
          )}
        </div>

        {/* Correct answer display */}
        {checked && !correct && (
          <div className="text-center mb-4">
            <p className="text-[var(--error)] font-bold text-sm mb-1">Resposta correcta:</p>
            <p className="text-green-600 font-bold text-lg font-handwriting">
              {currentSentence.correct.join(" ")}
            </p>
          </div>
        )}

        {/* Word bank */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {bank.map((item, i) => (
            <motion.button
              key={`bank-${i}`}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleWordTap(i)}
              disabled={item.used || checked}
              className={`px-4 py-2 rounded-xl font-bold text-lg font-handwriting transition-all ${
                item.used
                  ? "bg-gray-100 text-gray-300 border-2 border-gray-200"
                  : "bg-purple-50 text-[var(--text)] border-2 border-gray-200 hover:border-[var(--primary)] hover:bg-purple-100"
              } disabled:cursor-default`}
            >
              {item.word}
            </motion.button>
          ))}
        </div>

        {/* Comprova button */}
        {allFilled && !checked && (
          <div className="flex justify-center pt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheck}
              className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
            >
              Comprova!
            </motion.button>
          </div>
        )}

        {/* Retry button - only shown after wrong answer */}
        {checked && !correct && (
          <div className="flex justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              className="px-8 py-3 bg-[var(--secondary)] text-white font-bold rounded-2xl text-lg shadow-md"
            >
              Torna a provar!
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
