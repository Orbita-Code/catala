"use client";

import { useState, useEffect, useCallback } from "react";
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

  const handleCheck = useCallback(() => {
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
  }, [answers, task.sentences, onComplete]);

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setAnswers({});
  };

  // Retry only a single wrong sentence
  const handleRetrySingle = (sentenceIdx: number) => {
    const newAnswers = { ...answers };
    delete newAnswers[sentenceIdx];
    setAnswers(newAnswers);

    const newResults = { ...results };
    delete newResults[sentenceIdx];
    setResults(newResults);

    setChecked(false);
  };

  const allAnswered = task.sentences.every((_, i) => answers[i]);
  const allCorrect = checked && Object.values(results).every(Boolean);

  // Auto-check when all answers are filled
  useEffect(() => {
    if (allAnswered && !checked) {
      const timer = setTimeout(() => {
        handleCheck();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [allAnswered, checked, handleCheck]);

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
          ? "flex flex-wrap justify-center gap-3" // Compact cards, centered
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
          className={`bg-white rounded-xl p-2 shadow-sm ${
            allSentencesHaveImages ? "w-[140px] md:w-[160px]" : ""
          } ${
            checked
              ? results[i]
                ? "ring-2 ring-[var(--success)]"
                : "ring-2 ring-[var(--error)]"
              : ""
          }`}
        >
          {/* Compact layout for image-based sentences */}
          {allSentencesHaveImages && sentence.image && getWordIllustration(sentence.image) ? (
            <>
              <div className="flex justify-center">
                <img
                  src={getWordIllustration(sentence.image)!}
                  alt=""
                  className="w-[120px] h-[120px] md:w-[140px] md:h-[140px] object-contain"
                />
              </div>
              {/* Answer display */}
              <div className="text-center my-1">
                <span
                  className={`inline-block px-3 py-1 rounded-lg font-bold text-sm font-handwriting ${
                    answers[i]
                      ? checked
                        ? results[i]
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        : "bg-purple-100 text-[var(--primary)]"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {answers[i] || "?"}
                </span>
                {checked && (
                  <span className="ml-1">
                    {results[i] ? "✅" : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetrySingle(i);
                        }}
                        className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-orange-100 transition-colors"
                        aria-label="Torna a provar"
                      >
                        <RefreshCcw className="w-4 h-4 text-orange-500" />
                      </button>
                    )}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              {sentence.image && getWordIllustration(sentence.image) && (
                <div className="flex justify-center mb-2">
                  <img
                    src={getWordIllustration(sentence.image)!}
                    alt=""
                    className="w-20 h-20 object-contain"
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
                            {results[i] ? "✅" : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRetrySingle(i);
                                }}
                                className="inline-flex items-center justify-center p-1 rounded-full hover:bg-orange-100 transition-colors"
                                aria-label="Torna a provar aquesta frase"
                              >
                                <RefreshCcw className="w-4 h-4 text-orange-500" />
                              </button>
                            )}
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
            </>
          )}
          <div className="flex flex-wrap gap-1.5 justify-center">
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

      {/* Retry button inside grid for tasks with images */}
      {allSentencesHaveImages && checked && !allCorrect && (
        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="px-6 py-3 bg-[var(--secondary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Torna a provar!
          </motion.button>
        </div>
      )}
    </div>
  );

  // Split sentences for 3-column layout (left | image | right)
  const midPoint = Math.ceil(task.sentences.length / 2);
  const leftSentences = task.sentences.slice(0, midPoint);
  const rightSentences = task.sentences.slice(midPoint);

  // Render a single sentence card
  const renderSentenceCard = (sentence: typeof task.sentences[0], i: number) => (
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
            <p className="font-semibold text-[var(--text)] font-handwriting text-base md:text-lg leading-snug">
              {sentence.text.split("___").map((part, j, arr) => (
                <span key={j}>
                  {part}
                  {j < arr.length - 1 && (
                    <span
                      className={`inline-block px-2 py-0.5 mx-0.5 rounded-lg font-bold text-base md:text-lg ${
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
                    {results[i] ? "✅" : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetrySingle(i);
                        }}
                        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-orange-100 transition-colors"
                        aria-label="Torna a provar aquesta frase"
                      >
                        <RefreshCcw className="w-4 h-4 text-orange-500" />
                      </button>
                    )}
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
                className="w-14 h-14 object-contain"
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
            className={`rounded-lg font-bold font-handwriting transition-all px-3 py-1.5 text-base ${
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
  );

  return (
    <div className="space-y-3">
      {/* 3-column layout for main image: LEFT sentences | CENTER image | RIGHT sentences */}
      {hasMainImage && !allSentencesHaveImages ? (
        <>
          {/* Mobile: Image on top, then all sentences */}
          <div className="md:hidden">
            <div className="flex justify-center mb-3">
              <img
                src={getWordIllustration(task.image!)!}
                alt=""
                className="w-40 h-40 object-contain rounded-xl bg-white p-2 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              {task.sentences.map((sentence, i) => renderSentenceCard(sentence, i))}
            </div>
          </div>

          {/* Desktop: 3-column layout */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
            {/* Left column - first half of sentences */}
            <div className="space-y-2">
              {leftSentences.map((sentence, i) => renderSentenceCard(sentence, i))}
            </div>

            {/* Center - image */}
            <div className="flex flex-col items-center justify-center">
              <img
                src={getWordIllustration(task.image!)!}
                alt=""
                className="w-48 h-auto max-h-[400px] object-contain rounded-xl bg-white p-3 shadow-sm"
              />
              <p className="text-xs text-center text-[var(--text-light)] mt-2">
                👆 Mira la imatge!
              </p>
            </div>

            {/* Right column - second half of sentences */}
            <div className="space-y-2">
              {rightSentences.map((sentence, i) => renderSentenceCard(sentence, i + midPoint))}
            </div>
          </div>
        </>
      ) : (
        // No main image OR all sentences have images - use original grid layout
        renderSentences()
      )}

      {/* Retry button - only show after wrong answer */}
      {!allSentencesHaveImages && checked && !allCorrect && (
        <div className="flex justify-center pt-2">
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
    </div>
  );
}
