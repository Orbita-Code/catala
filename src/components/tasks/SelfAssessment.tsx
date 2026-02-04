"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SelfAssessmentTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { speak } from "@/lib/tts";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useSpeechRecognition, wordsMatch } from "@/hooks/useSpeechRecognition";

interface Props {
  task: SelfAssessmentTask;
  onComplete: (result: TaskResult) => void;
}

export default function SelfAssessment({ task, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<Record<number, "correct" | "incorrect">>({});
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [lastSpoken, setLastSpoken] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const currentItem = task.items[currentIdx];
  const illustration = getWordIllustration(currentItem.catalan);

  const handleResult = useCallback(
    (transcript: string) => {
      setLastSpoken(transcript);
      const isCorrect = wordsMatch(transcript, currentItem.catalan);

      if (isCorrect) {
        // Correct! Mark and move on
        setResults((prev) => ({ ...prev, [currentIdx]: "correct" }));
        speak(currentItem.catalan); // Reinforce with correct pronunciation

        setTimeout(() => {
          if (currentIdx < task.items.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setLastSpoken(null);
            setShowHint(false);
          } else {
            // All done
            const erroredItems = Object.entries(results)
              .filter(([, r]) => r === "incorrect")
              .map(([idx]) => task.items[parseInt(idx)].catalan);
            onComplete({ allCorrect: erroredItems.length === 0, erroredItems });
          }
        }, 1500);
      } else {
        // Incorrect - allow retry
        const newAttempts = (attempts[currentIdx] || 0) + 1;
        setAttempts((prev) => ({ ...prev, [currentIdx]: newAttempts }));

        if (newAttempts >= 2) {
          // After 2 failed attempts, show hint
          setShowHint(true);
        }
      }
    },
    [currentIdx, currentItem, task.items, results, attempts, onComplete]
  );

  const { isListening, isSupported, startListening, error } = useSpeechRecognition({
    lang: "ca-ES",
    onResult: handleResult,
  });

  const handleSkip = () => {
    // Skip this word (mark as incorrect)
    setResults((prev) => ({ ...prev, [currentIdx]: "incorrect" }));
    speak(currentItem.catalan); // Say the correct word

    setTimeout(() => {
      if (currentIdx < task.items.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setLastSpoken(null);
        setShowHint(false);
      } else {
        const erroredItems = Object.entries({ ...results, [currentIdx]: "incorrect" })
          .filter(([, r]) => r === "incorrect")
          .map(([idx]) => task.items[parseInt(idx)].catalan);
        onComplete({ allCorrect: erroredItems.length === 0, erroredItems });
      }
    }, 1500);
  };

  const handleListenFirst = () => {
    speak(currentItem.catalan);
  };

  const isCorrect = results[currentIdx] === "correct";
  const currentAttempts = attempts[currentIdx] || 0;

  // If speech recognition is not supported, fall back to simpler UI
  if (!isSupported) {
    return <FallbackSelfAssessment task={task} onComplete={onComplete} />;
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {currentIdx + 1} / {task.items.length}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + (isCorrect ? 1 : 0)) / task.items.length) * 100}%` }}
        />
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        {/* Instruction */}
        <p className="text-center text-sm text-[var(--text-light)] mb-4">
          Mira el dibuix i digues la paraula en català
        </p>

        {/* Illustration */}
        <div className="flex justify-center mb-5">
          {illustration ? (
            <motion.img
              src={illustration}
              alt=""
              className="w-40 h-40 object-contain"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
          ) : (
            <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-5xl">❓</span>
            </div>
          )}
        </div>

        {/* Listen first button */}
        <div className="flex justify-center mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleListenFirst}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-[var(--primary)] rounded-xl text-sm font-semibold"
          >
            <Volume2 className="w-4 h-4" />
            Escolta primer
          </motion.button>
        </div>

        {/* Microphone button */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startListening}
            disabled={isListening || isCorrect}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-500 animate-pulse"
                : isCorrect
                  ? "bg-green-500"
                  : "bg-[var(--primary)] hover:bg-[var(--secondary)]"
            } text-white shadow-lg`}
          >
            {isListening ? (
              <Mic className="w-10 h-10 animate-bounce" />
            ) : isCorrect ? (
              <span className="text-3xl">✅</span>
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </motion.button>

          <p className="text-sm text-[var(--text-light)]">
            {isListening
              ? "Escoltant... parla ara!"
              : isCorrect
                ? "Molt bé!"
                : "Toca el micròfon i digues la paraula"}
          </p>
        </div>

        {/* Last spoken text */}
        <AnimatePresence>
          {lastSpoken && !isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center"
            >
              <p className="text-sm text-gray-500">Has dit:</p>
              <p className="text-lg font-bold text-orange-500 font-handwriting">
                "{lastSpoken}"
              </p>
              <p className="text-sm text-[var(--error)] mt-1">
                Intenta-ho de nou! 🔄
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint after 2 failed attempts */}
        <AnimatePresence>
          {showHint && !isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-amber-50 rounded-xl text-center"
            >
              <p className="text-sm text-amber-700">Pista: la paraula és...</p>
              <p className="text-xl font-bold text-amber-600 font-handwriting">
                {currentItem.catalan}
              </p>
              <SpeakerButton text={currentItem.catalan} size={20} className="mt-1" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <p className="text-center text-sm text-[var(--error)] mt-3">{error}</p>
        )}

        {/* Skip button (after attempts) */}
        {currentAttempts >= 2 && !isCorrect && (
          <div className="flex justify-center mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              className="px-6 py-2 bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold"
            >
              Passa a la següent →
            </motion.button>
          </div>
        )}

        {/* Correct answer display */}
        <AnimatePresence>
          {isCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 text-center"
            >
              <p className="text-2xl font-bold text-green-600 font-handwriting">
                {currentItem.catalan} ✅
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {currentItem.translation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Fallback component when speech recognition is not supported
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
    const newRevealed = new Set(revealed);
    newRevealed.add(idx);
    setRevealed(newRevealed);
    speak(catalanWord);
  };

  const handleRate = (idx: number, rating: "yes" | "no") => {
    setRatings({ ...ratings, [idx]: rating });
  };

  const allRated = task.items.every((_, i) => ratings[i]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-amber-50 rounded-xl">
        <MicOff className="w-5 h-5 text-amber-600" />
        <p className="text-sm text-amber-700">
          El micròfon no està disponible. Demana a un adult que t'ajudi!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {task.items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center"
          >
            {getWordIllustration(item.catalan) ? (
              <img
                src={getWordIllustration(item.catalan)!}
                alt=""
                className="w-16 h-16 object-contain mb-2"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-xl mb-2 flex items-center justify-center text-2xl">
                ❓
              </div>
            )}

            {revealed.has(i) ? (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                  <span className="text-sm font-bold text-green-600 font-handwriting">
                    {item.catalan}
                  </span>
                  <SpeakerButton text={item.catalan} size={14} />
                </div>
                <div className="flex gap-1 mt-1">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRate(i, "yes")}
                    className={`w-8 h-8 rounded-full text-lg ${
                      ratings[i] === "yes"
                        ? "bg-green-200 ring-2 ring-green-400"
                        : "bg-gray-100"
                    }`}
                  >
                    ✅
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRate(i, "no")}
                    className={`w-8 h-8 rounded-full text-lg ${
                      ratings[i] === "no"
                        ? "bg-red-200 ring-2 ring-red-400"
                        : "bg-gray-100"
                    }`}
                  >
                    😅
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReveal(i, item.catalan)}
                className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-xl font-semibold text-xs shadow-md"
              >
                Mostra
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {allRated && (
        <div className="flex justify-center pt-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const erroredItems = Object.entries(ratings)
                .filter(([, r]) => r === "no")
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
