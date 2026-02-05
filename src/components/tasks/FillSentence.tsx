"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FillSentenceTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { RefreshCcw } from "lucide-react";

interface Props {
  task: FillSentenceTask;
  onComplete: (result: TaskResult) => void;
}

export default function FillSentence({ task, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleSelect = (sentenceIdx: number, option: string) => {
    if (checked) return;
    setAnswers({ ...answers, [sentenceIdx]: option });

    // Speak the answer immediately when selected (if correct)
    const sentence = task.sentences[sentenceIdx];
    if (option.toLowerCase() === sentence.blank.toLowerCase()) {
      speak(option);
    }
  };

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    task.sentences.forEach((s, i) => {
      const correct = answers[i]?.toLowerCase() === s.blank.toLowerCase();
      newResults[i] = correct;
      if (!correct) allCorrect = false;
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect) {
      // Celebration confetti (answers already spoken when selected)
      celebrateBig();
      setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
    }
  };

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setAnswers({});
  };

  const allAnswered = task.sentences.every((_, i) => answers[i]);
  const allCorrect = checked && Object.values(results).every(Boolean);

  const hasMainImage = task.image && getWordIllustration(task.image);

  // Check if all sentences have individual images (like task 9)
  const allSentencesHaveImages = task.sentences.every(
    (s) => s.image && getWordIllustration(s.image)
  );

  // Render sentences list
  const renderSentences = () => (
    <div
      className={
        allSentencesHaveImages
          ? "grid grid-cols-2 md:grid-cols-3 gap-3" // 3 columns for image-based sentences
          : task.columns === 2
            ? "grid grid-cols-1 md:grid-cols-2 gap-2"
            : "space-y-2"
      }
    >
      {task.sentences.map((sentence, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`bg-white rounded-xl p-3 shadow-sm ${
            checked
              ? results[i]
                ? "ring-2 ring-[var(--success)]"
                : "ring-2 ring-[var(--error)]"
              : ""
          }`}
        >
          {sentence.image && getWordIllustration(sentence.image) && (
            <div className="flex justify-center mb-2">
              <img
                src={getWordIllustration(sentence.image)!}
                alt=""
                className={allSentencesHaveImages ? "w-28 h-28 md:w-32 md:h-32 object-contain" : "w-20 h-20 object-contain"}
              />
            </div>
          )}
          <div className="flex items-start gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-start gap-1">
                <SpeakerButton text={sentence.text.replace(/\s*___\.?/, "")} size={14} />
                <p className="font-semibold text-[var(--text)] font-handwriting text-sm leading-tight">
                  {sentence.text.split("___").map((part, j, arr) => (
                    <span key={j}>
                      {part}
                      {j < arr.length - 1 && (
                        <span
                          className={`inline-block px-2 py-0.5 mx-0.5 rounded-lg font-bold text-sm ${
                            answers[i]
                              ? checked
                                ? results[i]
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                                : "bg-purple-100 text-[var(--primary)]"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {answers[i] || "___"}
                        </span>
                      )}
                    </span>
                  ))}
                  <AnimatePresence>
                    {checked && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-1"
                      >
                        {results[i] ? "✅" : <RefreshCcw className="inline w-4 h-4 text-orange-500" />}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </p>
              </div>
            </div>
            {/* Show illustration of correct answer when selected correctly */}
            <AnimatePresence>
              {answers[i] && answers[i].toLowerCase() === sentence.blank.toLowerCase() && getWordIllustration(sentence.blank) && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex-shrink-0"
                >
                  <img
                    src={getWordIllustration(sentence.blank)!}
                    alt={sentence.blank}
                    className="w-16 h-16 object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sentence.options?.map((option) => (
              <motion.button
                key={option}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(i, option)}
                disabled={checked}
                className={`rounded-lg font-bold font-handwriting transition-all px-3 py-1.5 text-sm ${
                  answers[i] === option
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-100 text-[var(--text)] hover:bg-gray-200"
                } disabled:cursor-default`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Layout: Image on right (sticky), sentences on left - for desktop */}
      {hasMainImage ? (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sentences - scrollable on left */}
          <div className="flex-1 order-2 md:order-1">
            {renderSentences()}
          </div>

          {/* Image - sticky on right for desktop, top for mobile */}
          <div className="order-1 md:order-2 md:w-64 md:flex-shrink-0">
            <div className="md:sticky md:top-4">
              <div className="flex justify-center">
                <img
                  src={getWordIllustration(task.image!)!}
                  alt=""
                  className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-xl bg-white p-2 shadow-sm"
                />
              </div>
              <p className="text-xs text-center text-[var(--text-light)] mt-1">
                👆 Mira la imatge!
              </p>
            </div>
          </div>
        </div>
      ) : (
        // No main image - just render sentences normally
        renderSentences()
      )}

      {/* Check/Retry button */}
      <div className="flex justify-center pt-2">
        {!checked ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            disabled={!allAnswered}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg disabled:opacity-40 shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
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
