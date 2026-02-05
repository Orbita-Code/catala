"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SelfAssessmentTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import SpeakerButton from "@/components/ui/SpeakerButton";
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
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [lastSpoken, setLastSpoken] = useState<string | null>(null);

  const { isListening, isSupported, startListening, error } = useSpeechRecognition({
    lang: "ca-ES",
    onResult: (transcript) => {
      if (selectedIdx === null) return;

      setLastSpoken(transcript);
      const item = task.items[selectedIdx];
      const isCorrect = wordsMatch(transcript, item.catalan);

      if (isCorrect) {
        setResults((prev) => ({ ...prev, [selectedIdx]: "correct" }));
        speak(item.catalan);
        celebrate();
        setSelectedIdx(null);
        setLastSpoken(null);

        // Check if all done
        const newResults = { ...results, [selectedIdx]: "correct" as const };
        const correctCount = Object.values(newResults).filter((r) => r === "correct").length;
        if (correctCount === task.items.length) {
          celebrateBig();
          setTimeout(() => {
            const erroredItems = Object.entries(newResults)
              .filter(([, r]) => r === "wrong")
              .map(([idx]) => task.items[parseInt(idx)].catalan);
            onComplete({ allCorrect: erroredItems.length === 0, erroredItems });
          }, 1200);
        }
      } else {
        setResults((prev) => ({ ...prev, [selectedIdx]: "retry" }));
      }
    },
  });

  const handleItemClick = (idx: number) => {
    if (results[idx] === "correct") return; // Already done
    setSelectedIdx(idx);
    setLastSpoken(null);
    setResults((prev) => {
      const newResults = { ...prev };
      delete newResults[idx]; // Clear previous state
      return newResults;
    });
  };

  const handleMicClick = () => {
    if (selectedIdx === null) return;
    startListening();
  };

  const handleSkip = (idx: number) => {
    setResults((prev) => ({ ...prev, [idx]: "wrong" }));
    speak(task.items[idx].catalan);
    setSelectedIdx(null);
    setLastSpoken(null);
  };

  const allDone = Object.values(results).filter((r) => r === "correct").length === task.items.length;

  // Fallback for browsers without speech recognition
  if (!isSupported) {
    return <FallbackSelfAssessment task={task} onComplete={onComplete} />;
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {Object.values(results).filter((r) => r === "correct").length} / {task.items.length} paraules
      </div>

      {/* Grid of all items */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {task.items.map((item, idx) => {
          const status = results[idx];
          const isSelected = selectedIdx === idx;
          const illustration = getWordIllustration(item.catalan);

          return (
            <motion.button
              key={idx}
              whileTap={status === "correct" ? undefined : { scale: 0.95 }}
              onClick={() => handleItemClick(idx)}
              disabled={status === "correct"}
              className={`relative rounded-xl p-2 transition-all border-3 ${
                status === "correct"
                  ? "bg-green-100 border-green-400"
                  : status === "retry"
                    ? "bg-orange-50 border-orange-300"
                    : status === "wrong"
                      ? "bg-red-50 border-red-300"
                      : isSelected
                        ? "bg-purple-100 border-[var(--primary)] ring-2 ring-[var(--primary)]"
                        : "bg-white border-gray-200 hover:border-purple-300"
              }`}
            >
              {/* Illustration */}
              <div className="flex justify-center">
                {illustration ? (
                  <img
                    src={illustration}
                    alt=""
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    ❓
                  </div>
                )}
              </div>

              {/* Status icon */}
              <AnimatePresence>
                {status === "correct" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 text-green-600"
                  >
                    ✅
                  </motion.div>
                )}
                {status === "retry" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1"
                  >
                    <RefreshCcw className="w-5 h-5 text-orange-500" />
                  </motion.div>
                )}
                {status === "wrong" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 text-red-500 font-bold"
                  >
                    ✗
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Word (shown when correct or wrong) */}
              {(status === "correct" || status === "wrong") && (
                <p className={`text-xs font-bold mt-1 text-center font-handwriting ${
                  status === "correct" ? "text-green-700" : "text-red-600"
                }`}>
                  {item.catalan}
                </p>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Microphone section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        {selectedIdx !== null ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-[var(--text-light)]">
              Digues la paraula en català:
            </p>

            {/* Show selected item larger */}
            <div className="flex items-center gap-3">
              {getWordIllustration(task.items[selectedIdx].catalan) && (
                <img
                  src={getWordIllustration(task.items[selectedIdx].catalan)!}
                  alt=""
                  className="w-20 h-20 object-contain"
                />
              )}
              <SpeakerButton text={task.items[selectedIdx].catalan} size={24} />
            </div>

            {/* Microphone button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMicClick}
              disabled={isListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? "bg-red-500 animate-pulse"
                  : "bg-[var(--primary)] hover:bg-[var(--secondary)]"
              } text-white shadow-lg`}
            >
              <Mic className={`w-8 h-8 ${isListening ? "animate-bounce" : ""}`} />
            </motion.button>

            <p className="text-xs text-[var(--text-light)]">
              {isListening ? "Escoltant... parla ara!" : "Toca el micròfon"}
            </p>

            {/* Last spoken feedback */}
            {lastSpoken && results[selectedIdx] === "retry" && (
              <div className="text-center">
                <p className="text-sm text-gray-500">Has dit: <span className="font-bold text-orange-500">"{lastSpoken}"</span></p>
                <p className="text-xs text-orange-500">Intenta-ho de nou! 🔄</p>
              </div>
            )}

            {/* Skip button */}
            {results[selectedIdx] === "retry" && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSkip(selectedIdx)}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold"
              >
                Passa →
              </motion.button>
            )}
          </div>
        ) : (
          <p className="text-center text-[var(--text-light)]">
            👆 Toca una imatge per començar
          </p>
        )}

        {error && (
          <p className="text-center text-sm text-[var(--error)] mt-2">{error}</p>
        )}
      </div>

      {/* Complete button when all done */}
      {allDone && (
        <div className="flex justify-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const erroredItems = Object.entries(results)
                .filter(([, r]) => r === "wrong")
                .map(([idx]) => task.items[parseInt(idx)].catalan);
              onComplete({ allCorrect: erroredItems.length === 0, erroredItems });
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
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [ratings, setRatings] = useState<Record<number, "yes" | "no">>({});

  const handleReveal = (idx: number, catalanWord: string) => {
    setRevealed((prev) => new Set(prev).add(idx));
    speak(catalanWord);
  };

  const handleRate = (idx: number, rating: "yes" | "no") => {
    setRatings((prev) => ({ ...prev, [idx]: rating }));
  };

  const allRated = task.items.every((_, i) => ratings[i]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-amber-50 rounded-xl">
        <MicOff className="w-5 h-5 text-amber-600" />
        <p className="text-sm text-amber-700">
          El micròfon no està disponible. Demana a un adult!
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {task.items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className={`bg-white rounded-xl p-2 shadow-sm flex flex-col items-center border-2 ${
              ratings[i] === "yes"
                ? "border-green-400 bg-green-50"
                : ratings[i] === "no"
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
            }`}
          >
            {getWordIllustration(item.catalan) ? (
              <img
                src={getWordIllustration(item.catalan)!}
                alt=""
                className="w-14 h-14 object-contain"
              />
            ) : (
              <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                ❓
              </div>
            )}

            {revealed.has(i) ? (
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[var(--primary)] font-handwriting">
                    {item.catalan}
                  </span>
                  <SpeakerButton text={item.catalan} size={12} />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleRate(i, "yes")}
                    className={`w-7 h-7 rounded-full text-sm ${
                      ratings[i] === "yes" ? "bg-green-200 ring-2 ring-green-400" : "bg-gray-100"
                    }`}
                  >
                    ✅
                  </button>
                  <button
                    onClick={() => handleRate(i, "no")}
                    className={`w-7 h-7 rounded-full text-sm ${
                      ratings[i] === "no" ? "bg-red-200 ring-2 ring-red-400" : "bg-gray-100"
                    }`}
                  >
                    😅
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleReveal(i, item.catalan)}
                className="mt-1 px-2 py-1 bg-[var(--primary)] text-white rounded-lg font-semibold text-xs"
              >
                Mostra
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {allRated && (
        <div className="flex justify-center pt-3">
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
