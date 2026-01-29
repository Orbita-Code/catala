"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FillLettersTask } from "@/types/tasks";

interface Props {
  task: FillLettersTask;
  onComplete: (correct: boolean) => void;
}

export default function FillLetters({ task, onComplete }: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const getBlankPositions = (word: string, hint: string) => {
    const positions: number[] = [];
    for (let i = 0; i < hint.length; i++) {
      if (hint[i] === "_") positions.push(i);
    }
    return positions;
  };

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    task.words.forEach((item, wordIdx) => {
      const blanks = getBlankPositions(item.word, item.hint || "");
      let correct = true;
      blanks.forEach((pos) => {
        const key = `${wordIdx}-${pos}`;
        if (inputs[key]?.toLowerCase() !== item.word[pos]?.toLowerCase()) {
          correct = false;
        }
      });
      newResults[wordIdx] = correct;
      if (!correct) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect) {
      setTimeout(() => onComplete(true), 1200);
    }
  };

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setInputs({});
  };

  const allCorrect = checked && Object.values(results).every(Boolean);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {task.words.map((item, wordIdx) => {
          const blanks = getBlankPositions(item.word, item.hint || "");
          return (
            <motion.div
              key={wordIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wordIdx * 0.05 }}
              className={`flex items-center gap-2 bg-white rounded-2xl p-4 shadow-sm flex-wrap ${
                checked
                  ? results[wordIdx]
                    ? "ring-2 ring-[var(--success)]"
                    : "ring-2 ring-[var(--error)]"
                  : ""
              }`}
            >
              {(item.hint || item.word).split("").map((char, charIdx) => {
                if (char === "_") {
                  const key = `${wordIdx}-${charIdx}`;
                  return (
                    <input
                      key={charIdx}
                      type="text"
                      maxLength={1}
                      value={inputs[key] || ""}
                      onChange={(e) => {
                        setInputs({ ...inputs, [key]: e.target.value });
                        if (e.target.value) {
                          const next = document.querySelector(
                            `[data-key="${wordIdx}-${blanks[blanks.indexOf(charIdx) + 1]}"]`
                          ) as HTMLInputElement;
                          next?.focus();
                        }
                      }}
                      disabled={checked}
                      data-key={key}
                      className={`w-10 h-10 text-center text-xl font-bold rounded-lg border-2 outline-none transition-colors ${
                        checked
                          ? results[wordIdx]
                            ? "border-[var(--success)] bg-green-50 text-green-700"
                            : "border-[var(--error)] bg-red-50 text-red-700"
                          : "border-[var(--primary)] border-dashed focus:border-solid focus:bg-purple-50"
                      }`}
                    />
                  );
                }
                return (
                  <span
                    key={charIdx}
                    className="w-10 h-10 flex items-center justify-center text-xl font-bold text-[var(--text)]"
                  >
                    {char}
                  </span>
                );
              })}
              <AnimatePresence>
                {checked && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 text-xl"
                  >
                    {results[wordIdx] ? "✅" : "❌"}
                  </motion.span>
                )}
              </AnimatePresence>
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
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
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
