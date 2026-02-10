"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FillLettersTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import AnimatedStar from "@/components/star/AnimatedStar";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import { RefreshCcw } from "lucide-react";

const retryPhrases = [
  "Prova una altra vegada!",
  "Quasi! Torna-ho a provar!",
  "Vinga, tu pots!",
  "Ànims! Un altre cop!",
];

interface Props {
  task: FillLettersTask;
  onComplete: (result: TaskResult) => void;
}

// Strip accents to get base letter (e.g. "í" → "i", "ü" → "u")
function baseChar(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Map of base letters to their Catalan accented variants
const ACCENT_VARIANTS: Record<string, string[]> = {
  a: ["à"],
  e: ["è", "é"],
  i: ["í", "ï"],
  o: ["ò", "ó"],
  u: ["ú", "ü"],
};

// Build reverse map: accented → base
const ACCENT_TO_BASE: Record<string, string> = {};
for (const [base, accented] of Object.entries(ACCENT_VARIANTS)) {
  for (const a of accented) {
    ACCENT_TO_BASE[a] = base;
  }
}

// Generate letter options for a blank position: correct letter + distractors.
// Does NOT show both accented and non-accented versions to avoid confusing children.
function generateOptions(correctLetter: string, count: number = 5): string[] {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const correct = correctLetter.toLowerCase();
  const base = baseChar(correct);
  const options: string[] = [correct];
  const usedBases = new Set<string>([base]);

  // Fill remaining slots with random distractors (different bases, no accent variants)
  let attempts = 0;
  while (options.length < count && attempts < 100) {
    const rand = alphabet[Math.floor(Math.random() * alphabet.length)];
    const randBase = baseChar(rand);
    if (!usedBases.has(randBase)) {
      usedBases.add(randBase);
      options.push(rand);
    }
    attempts++;
  }
  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

export default function FillLetters({ task, onComplete }: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [wordResults, setWordResults] = useState<Record<number, boolean>>({});
  const [checkedWords, setCheckedWords] = useState<Set<number>>(new Set());
  const [allDone, setAllDone] = useState(false);
  const [retryWordIdx, setRetryWordIdx] = useState<number | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // All blanks in order
  const allBlanks = useMemo(() => {
    const blanks: string[] = [];
    task.words.forEach((item, wordIdx) => {
      const hint = item.hint || "";
      hint.split("").forEach((char, charIdx) => {
        if (char === "_") blanks.push(`${wordIdx}-${charIdx}`);
      });
    });
    return blanks;
  }, [task.words]);

  // Track which blank is active
  const [activeBlank, setActiveBlank] = useState<string | null>(() => {
    return allBlanks[0] || null;
  });

  // Track words that had errors (for final erroredItems report)
  const [erroredWordIndices, setErroredWordIndices] = useState<Set<number>>(new Set());

  // Check if all blanks for a word are filled and auto-check
  const checkWordCompletion = useCallback(
    (wordIdx: number, currentInputs: Record<string, string>) => {
      if (checkedWords.has(wordIdx)) return;

      const item = task.words[wordIdx];
      const blanks = getBlankPositions(item.hint || "");
      const allFilled = blanks.every((pos) => currentInputs[`${wordIdx}-${pos}`]);
      if (!allFilled) return;

      let wordCorrect = true;
      blanks.forEach((pos) => {
        const key = `${wordIdx}-${pos}`;
        if (currentInputs[key]?.toLowerCase() !== item.word[pos]?.toLowerCase()) {
          wordCorrect = false;
        }
      });

      setWordResults((prev) => ({ ...prev, [wordIdx]: wordCorrect }));
      setCheckedWords((prev) => new Set(prev).add(wordIdx));

      // Speak the word aloud when correct
      if (wordCorrect) {
        speak(item.word);
      }

      // Wrong word → show star encouragement, then auto-reset
      if (!wordCorrect) {
        setErroredWordIndices((prev) => new Set(prev).add(wordIdx));
        // Show animated star with retry message
        setRetryWordIdx(wordIdx);
        setRetryMessage(retryPhrases[Math.floor(Math.random() * retryPhrases.length)]);

        // Clear any existing timer
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
        }

        retryTimerRef.current = setTimeout(() => {
          resetWord(wordIdx, blanks);
        }, 2000);
      }
    },
    [task.words, checkedWords]
  );

  // Reset a specific word for retry
  const resetWord = useCallback((wordIdx: number, blanks: number[]) => {
    // Clear timer if exists
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    // Hide star
    setRetryWordIdx(null);
    setRetryMessage(null);
    // Clear this word's inputs
    setInputs((prev) => {
      const next = { ...prev };
      blanks.forEach((pos) => {
        delete next[`${wordIdx}-${pos}`];
      });
      return next;
    });
    // Uncheck so child can retry
    setCheckedWords((prev) => {
      const next = new Set(prev);
      next.delete(wordIdx);
      return next;
    });
    setWordResults((prev) => {
      const next = { ...prev };
      delete next[wordIdx];
      return next;
    });
    // Move focus to first blank of this word
    const firstBlank = blanks[0];
    if (firstBlank !== undefined) {
      setActiveBlank(`${wordIdx}-${firstBlank}`);
    }
  }, []);

  // Check if all words are done correctly → complete the task
  useEffect(() => {
    if (allDone) return;
    // Only complete when ALL words are checked AND all correct
    if (checkedWords.size === task.words.length) {
      const allCorrect = Object.values(wordResults).every(Boolean);
      if (allCorrect) {
      celebrateBig();
        setAllDone(true);
        setTimeout(
          () =>
            onComplete({
              allCorrect: erroredWordIndices.size === 0,
              erroredItems: Array.from(erroredWordIndices).map(
                (idx) => task.words[idx].word
              ),
            }),
          1200
        );
      }
    }
  }, [checkedWords.size, task.words.length, wordResults, onComplete, task.words, allDone, erroredWordIndices]);

  const handleOptionTap = (key: string, letter: string) => {
    const wordIdx = parseInt(key.split("-")[0]);
    if (checkedWords.has(wordIdx)) return;

    const newInputs = { ...inputs, [key]: letter };
    setInputs(newInputs);

    // Auto-check this word if all blanks are filled
    checkWordCompletion(wordIdx, newInputs);

    // Move to next unfilled blank (skip blanks in already-checked words)
    const currentIdx = allBlanks.indexOf(key);
    const nextBlank = allBlanks.find((b, i) => {
      if (i <= currentIdx) return false;
      if (newInputs[b]) return false;
      const bWordIdx = parseInt(b.split("-")[0]);
      if (checkedWords.has(bWordIdx)) return false;
      return true;
    });
    setActiveBlank(nextBlank || null);
  };

  // Keyboard input support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allDone) return;

      if (e.key === "Tab") {
        e.preventDefault();
        if (!activeBlank) return;
        const currentIdx = allBlanks.indexOf(activeBlank);
        for (let offset = 1; offset <= allBlanks.length; offset++) {
          const nextIdx = (currentIdx + offset) % allBlanks.length;
          const bWordIdx = parseInt(allBlanks[nextIdx].split("-")[0]);
          if (!inputs[allBlanks[nextIdx]] && !checkedWords.has(bWordIdx)) {
            setActiveBlank(allBlanks[nextIdx]);
            return;
          }
        }
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        if (!activeBlank) return;
        const wordIdx = parseInt(activeBlank.split("-")[0]);
        if (checkedWords.has(wordIdx)) return;
        if (inputs[activeBlank]) {
          setInputs((prev) => {
            const next = { ...prev };
            delete next[activeBlank];
            return next;
          });
        }
        return;
      }

      if (e.key.length === 1 && /\p{L}/u.test(e.key)) {
        e.preventDefault();
        if (!activeBlank) return;
        const wordIdx = parseInt(activeBlank.split("-")[0]);
        if (checkedWords.has(wordIdx)) return;
        const pressedLower = e.key.toLowerCase();
        const stripAccents = (s: string) =>
          s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const options = blankOptions[activeBlank] || [];
        let match = options.find((opt) => opt.toLowerCase() === pressedLower);
        if (!match) {
          match = options.find(
            (opt) =>
              stripAccents(opt.toLowerCase()) === stripAccents(pressedLower)
          );
        }
        if (match) {
          handleOptionTap(activeBlank, match);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, activeBlank, inputs, allBlanks, blankOptions, checkedWords]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {task.words.map((item, wordIdx) => {
          const blanks = getBlankPositions(item.hint || "");
          const isChecked = checkedWords.has(wordIdx);
          const isCorrect = wordResults[wordIdx];
          const illustration = getWordIllustration(item.word);
          return (
            <motion.div
              key={wordIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wordIdx * 0.05 }}
              className={`bg-white rounded-2xl p-4 shadow-sm ${
                isChecked
                  ? isCorrect
                    ? "ring-2 ring-[var(--success)]"
                    : "ring-2 ring-[var(--error)]"
                  : ""
              }`}
            >
              {/* Layout: image left, fields right */}
              <div className={illustration ? "flex gap-3 items-start" : ""}>
                <div className={illustration
                  ? "flex flex-col items-center flex-shrink-0 gap-1"
                  : "flex items-center gap-3 mb-2"
                }>
                  <span className="text-lg font-black text-[var(--text-light)] flex-shrink-0">
                    {wordIdx + 1}.
                  </span>
                  {illustration ? (
                    <img src={illustration} alt={item.word} className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                  ) : null}
                  <AnimatePresence>
                    {isChecked && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={illustration ? "text-xl" : "text-2xl ml-auto"}
                      >
                        {isCorrect ? "✅" : (
                          <button
                            onClick={() => resetWord(wordIdx, blanks)}
                            className="inline-flex items-center justify-center p-1 rounded-full hover:bg-orange-100 transition-colors"
                            aria-label="Torna a provar"
                          >
                            <RefreshCcw className="w-6 h-6 text-orange-500" />
                          </button>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className={illustration ? "flex-1 min-w-0" : ""}>
                  {/* Letter fields */}
                  <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 mb-1">
                  {(item.hint || item.word).split("").map((char, charIdx) => {
                    if (char === " ") {
                      return <div key={charIdx} className="w-2 sm:w-3" />;
                    }
                    if (char === "_") {
                      const key = `${wordIdx}-${charIdx}`;
                      const filled = inputs[key];
                      const isActive = activeBlank === key && !isChecked;
                      return (
                        <motion.button
                          key={charIdx}
                          type="button"
                          onClick={() => {
                            if (!isChecked) {
                              setActiveBlank(key);
                              if (filled) {
                                const newInputs = { ...inputs };
                                delete newInputs[key];
                                setInputs(newInputs);
                              }
                            }
                          }}
                          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-base sm:text-lg font-bold rounded-lg border-2 transition-all ${
                            isChecked
                              ? isCorrect
                                ? "border-[var(--success)] bg-green-50 text-green-700"
                                : "border-[var(--error)] bg-red-50 text-red-700"
                              : filled
                                ? "border-[var(--primary)] bg-purple-50 text-[var(--primary)]"
                                : isActive
                                  ? "border-[var(--success)] border-solid bg-green-50"
                                  : "border-gray-300 border-dashed"
                          }`}
                        >
                          {filled?.toUpperCase() || ""}
                        </motion.button>
                      );
                    }
                    return (
                      <span
                        key={charIdx}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-base sm:text-lg font-bold text-[var(--text)] font-handwriting"
                      >
                        {char.toUpperCase()}
                      </span>
                    );
                  })}
              </div>

              {/* Animated star retry encouragement */}
              <AnimatePresence>
                {retryWordIdx === wordIdx && retryMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 mb-2 justify-center"
                  >
                    <AnimatedStar
                      size="sm"
                      expression="confused"
                      animation="wave"
                      message={retryMessage}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Letter options for active blank in this word */}
              {!isChecked &&
                blanks.some((pos) => activeBlank === `${wordIdx}-${pos}`) &&
                activeBlank && (
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
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
