"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SelfAssessmentTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { speak } from "@/lib/tts";
import { Mic, MicOff, RefreshCcw } from "lucide-react";
import { useSpeechRecognition, wordsMatch } from "@/hooks/useSpeechRecognition";
import { celebrate, celebrateBig } from "@/lib/confetti";

interface Props {
  task: SelfAssessmentTask;
  onComplete: (result: TaskResult) => void;
}

export default function SelfAssessment({ task, onComplete }: Props) {
  const [results, setResults] = useState<Record<number, "correct" | "wrong" | "retry">>({});
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const { isListening, isSupported, startListening } = useSpeechRecognition({
    lang: "ca-ES",
    onResult: (transcript) => {
      if (activeIdx === null) return;

      const item = task.items[activeIdx];
      const isCorrect = wordsMatch(transcript, item.catalan);

      if (isCorrect) {
        setResults((prev) => ({ ...prev, [activeIdx]: "correct" }));
        celebrate();

        // Check if all done
        const newResults = { ...results, [activeIdx]: "correct" as const };
        const correctCount = Object.values(newResults).filter((r) => r === "correct").length;
        if (correctCount === task.items.length) {
          celebrateBig();
          setTimeout(() => {
            onComplete({ allCorrect: true, erroredItems: [] });
          }, 1200);
        }
      } else {
        setResults((prev) => ({ ...prev, [activeIdx]: "retry" }));
      }
      setActiveIdx(null);
    },
  });

  const handleMicClick = (idx: number) => {
    if (results[idx] === "correct") return; // Already done
    setActiveIdx(idx);
    startListening();
  };

  const handleSkip = (idx: number) => {
    setResults((prev) => ({ ...prev, [idx]: "wrong" }));
    speak(task.items[idx].catalan); // Speak the correct answer when skipped
  };

  const correctCount = Object.values(results).filter((r) => r === "correct").length;
  const allDone = correctCount === task.items.length;

  // Fallback for browsers without speech recognition
  if (!isSupported) {
    return <FallbackSelfAssessment task={task} onComplete={onComplete} />;
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {correctCount} / {task.items.length} paraules
      </div>

      {/* Grid of cards - full width */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {task.items.map((item, idx) => {
          const status = results[idx];
          const isRecording = activeIdx === idx && isListening;
          const illustration = getWordIllustration(item.catalan);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`bg-white rounded-xl p-3 shadow-sm border-3 transition-all flex items-center gap-3 ${
                status === "correct"
                  ? "border-green-500 bg-green-50"
                  : status === "retry"
                    ? "border-orange-400 bg-orange-50"
                    : status === "wrong"
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
              }`}
            >
              {/* Image - left side */}
              <div className="flex-shrink-0">
                {illustration ? (
                  <img
                    src={illustration}
                    alt=""
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    ❓
                  </div>
                )}
              </div>

              {/* Right side - microphone and status */}
              <div className="flex-1 flex flex-col items-center gap-2">
                {status === "correct" ? (
                  /* Correct - show checkmark */
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-3xl"
                  >
                    ✅
                  </motion.div>
                ) : status === "wrong" ? (
                  /* Wrong - show X */
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl text-red-500 font-bold"
                  >
                    ✗
                  </motion.div>
                ) : (
                  /* Microphone button */
                  <>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMicClick(idx)}
                      disabled={isListening && activeIdx !== idx}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
                        isRecording
                          ? "bg-red-500 animate-pulse shadow-lg shadow-red-300"
                          : "bg-[var(--primary)] hover:bg-[var(--secondary)]"
                      } text-white disabled:opacity-50`}
                    >
                      <Mic className={`w-6 h-6 ${isRecording ? "animate-bounce" : ""}`} />
                    </motion.button>

                    {/* Retry indicator */}
                    {status === "retry" && (
                      <div className="flex items-center gap-1">
                        <RefreshCcw className="w-4 h-4 text-orange-500" />
                        <button
                          onClick={() => handleSkip(idx)}
                          className="text-xs text-gray-500 underline"
                        >
                          Passa
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Complete button when all done */}
      {allDone && (
        <div className="flex justify-center pt-2">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onComplete({ allCorrect: true, erroredItems: [] });
            }}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Molt bé! Continua! 🎉
          </motion.button>
        </div>
      )}
    </div>
  );
}

// Fallback when speech recognition not supported
function FallbackSelfAssessment({
  task,
  onComplete,
}: {
  task: SelfAssessmentTask;
  onComplete: (result: TaskResult) => void;
}) {
  const [ratings, setRatings] = useState<Record<number, "yes" | "no">>({});

  const handleRate = (idx: number, rating: "yes" | "no", catalanWord: string) => {
    setRatings((prev) => ({ ...prev, [idx]: rating }));
    if (rating === "yes") {
      celebrate();
    }
    speak(catalanWord);
  };

  const allRated = task.items.every((_, i) => ratings[i]);
  const correctCount = Object.values(ratings).filter((r) => r === "yes").length;

  return (
    <div className="space-y-4">
      {/* Warning */}
      <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 rounded-xl">
        <MicOff className="w-5 h-5 text-amber-600" />
        <p className="text-sm text-amber-700">
          El micròfon no està disponible. Demana a un adult!
        </p>
      </div>

      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {correctCount} / {task.items.length} paraules
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {task.items.map((item, idx) => {
          const rating = ratings[idx];
          const illustration = getWordIllustration(item.catalan);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`bg-white rounded-xl p-3 shadow-sm border-3 transition-all ${
                rating === "yes"
                  ? "border-green-500 bg-green-50"
                  : rating === "no"
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
              }`}
            >
              {/* Image */}
              <div className="flex justify-center mb-2">
                {illustration ? (
                  <img
                    src={illustration}
                    alt=""
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    ❓
                  </div>
                )}
              </div>

              {/* Rating buttons or result */}
              {rating ? (
                <div className="text-center">
                  <p className="text-sm font-bold font-handwriting text-[var(--primary)]">
                    {item.catalan}
                  </p>
                  <span className="text-xl">{rating === "yes" ? "✅" : "😅"}</span>
                </div>
              ) : (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleRate(idx, "yes", item.catalan)}
                    className="px-3 py-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-bold"
                  >
                    Ho sé! ✅
                  </button>
                  <button
                    onClick={() => handleRate(idx, "no", item.catalan)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-bold"
                  >
                    No 😅
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Complete button */}
      {allRated && (
        <div className="flex justify-center pt-2">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const erroredItems = Object.entries(ratings)
                .filter(([, r]) => r === "no")
                .map(([idx]) => task.items[parseInt(idx)].catalan);
              onComplete({ allCorrect: erroredItems.length === 0, erroredItems });
            }}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Continua! 🎉
          </motion.button>
        </div>
      )}
    </div>
  );
}
