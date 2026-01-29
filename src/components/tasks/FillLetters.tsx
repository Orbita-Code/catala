"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FillLettersTask } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";
import confetti from "canvas-confetti";

interface Props {
  task: FillLettersTask;
  onComplete: (correct: boolean) => void;
}

// Generate letter options for a blank position: correct letter + distractors
function generateOptions(correctLetter: string, count: number = 5): string[] {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const options = new Set<string>([correctLetter.toLowerCase()]);
  while (options.size < count) {
    const rand = alphabet[Math.floor(Math.random() * alphabet.length)];
    options.add(rand);
  }
  // Shuffle
  const arr = Array.from(options);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function FillLetters({ task, onComplete }: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  // Pre-generate letter options for each blank
  const blankOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    task.words.forEach((item, wordIdx) => {
      const hint = item.hint || "";
      hint.split("").forEach((char, charIdx) => {
        if (char === "_") {
          const key = `${wordIdx}-${charIdx}`;
          options[key] = generateOptions(item.word[charIdx]);
        }
      });
    });
    return options;
  }, [task.words]);

  const getBlankPositions = (hint: string) => {
    const positions: number[] = [];
    for (let i = 0; i < hint.length; i++) {
      if (hint[i] === "_") positions.push(i);
    }
    return positions;
  };

  // Track which blank is active
  const [activeBlank, setActiveBlank] = useState<string | null>(() => {
    // Find first blank
    for (let w = 0; w < task.words.length; w++) {
      const hint = task.words[w].hint || "";
      for (let c = 0; c < hint.length; c++) {
        if (hint[c] === "_") return `${w}-${c}`;
      }
    }
    return null;
  });

  const handleOptionTap = (key: string, letter: string) => {
    if (checked) return;
    const newInputs = { ...inputs, [key]: letter };
    setInputs(newInputs);

    // Move to next unfilled blank
    const allBlanks: string[] = [];
    task.words.forEach((item, wordIdx) => {
      const hint = item.hint || "";
      hint.split("").forEach((char, charIdx) => {
        if (char === "_") allBlanks.push(`${wordIdx}-${charIdx}`);
      });
    });
    const currentBankIndex = allBlanks.indexOf(key);
    const nextBlank = allBlanks.find((b, i) => i > currentBankIndex && !newInputs[b]);
    setActiveBlank(nextBlank || null);
  };

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    task.words.forEach((item, wordIdx) => {
      const blanks = getBlankPositions(item.hint || "");
      let wordCorrect = true;
      blanks.forEach((pos) => {
        const key = `${wordIdx}-${pos}`;
        if (inputs[key]?.toLowerCase() !== item.word[pos]?.toLowerCase()) {
          wordCorrect = false;
        }
      });
      newResults[wordIdx] = wordCorrect;
      if (!wordCorrect) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect) {
      // Celebration confetti
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#6C5CE7", "#FDCB6E", "#00CECE"],
      });
      setTimeout(() => onComplete(true), 1200);
    }
  };

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setInputs({});
    // Reset to first blank
    for (let w = 0; w < task.words.length; w++) {
      const hint = task.words[w].hint || "";
      for (let c = 0; c < hint.length; c++) {
        if (hint[c] === "_") {
          setActiveBlank(`${w}-${c}`);
          return;
        }
      }
    }
  };

  const allCorrect = checked && Object.values(results).every(Boolean);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {task.words.map((item, wordIdx) => {
          const blanks = getBlankPositions(item.hint || "");
          return (
            <motion.div
              key={wordIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wordIdx * 0.05 }}
              className={`bg-white rounded-2xl p-4 shadow-sm ${
                checked
                  ? results[wordIdx]
                    ? "ring-2 ring-[var(--success)]"
                    : "ring-2 ring-[var(--error)]"
                  : ""
              }`}
            >
              {/* Emoji + word display */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {getWordEmoji(item.word) && (
                  <span className="text-2xl">{getWordEmoji(item.word)}</span>
                )}
                <div className="flex items-center gap-1 flex-wrap">
                  {(item.hint || item.word).split("").map((char, charIdx) => {
                    if (char === "_") {
                      const key = `${wordIdx}-${charIdx}`;
                      const filled = inputs[key];
                      const isActive = activeBlank === key;
                      return (
                        <motion.button
                          key={charIdx}
                          type="button"
                          onClick={() => {
                            if (!checked) {
                              setActiveBlank(key);
                              if (filled) {
                                const newInputs = { ...inputs };
                                delete newInputs[key];
                                setInputs(newInputs);
                              }
                            }
                          }}
                          className={`w-10 h-10 flex items-center justify-center text-xl font-bold rounded-lg border-2 transition-all ${
                            checked
                              ? results[wordIdx]
                                ? "border-[var(--success)] bg-green-50 text-green-700"
                                : "border-[var(--error)] bg-red-50 text-red-700"
                              : filled
                                ? "border-[var(--primary)] bg-purple-50 text-[var(--primary)]"
                                : isActive
                                  ? "border-[var(--primary)] border-solid bg-purple-50"
                                  : "border-[var(--primary)] border-dashed"
                          }`}
                        >
                          {filled?.toUpperCase() || ""}
                        </motion.button>
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
                </div>
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
              </div>

              {/* Letter options for active blank in this word */}
              {!checked && blanks.some((pos) => activeBlank === `${wordIdx}-${pos}`) && activeBlank && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {(blankOptions[activeBlank] || []).map((letter) => (
                    <motion.button
                      key={letter}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleOptionTap(activeBlank!, letter)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--text)] font-black text-xl border-2 border-amber-300"
                    >
                      {letter.toUpperCase()}
                    </motion.button>
                  ))}
                </div>
              )}
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
