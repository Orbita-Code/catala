"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MultipleChoiceTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { RefreshCcw } from "lucide-react";

interface Props {
  task: MultipleChoiceTask;
  onComplete: (result: TaskResult) => void;
  /** When true, show the solved state: the correct option selected and marked green. */
  review?: boolean;
}

export default function MultipleChoice({ task, onComplete, review = false }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  // In review mode the task is already solved: pre-select the correct option for the
  // current (first) question and reveal the result (green + ✅).
  const [selected, setSelected] = useState<number | null>(() =>
    review ? task.questions[0].correct : null
  );
  const [showResult, setShowResult] = useState(review);
  const [wrongQuestions, setWrongQuestions] = useState<string[]>([]);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  const question = task.questions[currentQ];
  const isCorrect = selected === question.correct;

  const handleSelect = (optionIdx: number) => {
    if (showResult) return;
    setSelected(optionIdx);
    setShowResult(true);

    const isRight = optionIdx === question.correct;
    const newWrong = isRight ? wrongQuestions : [...wrongQuestions, question.question];
    if (!isRight) setWrongQuestions(newWrong);

    // Speak whichever option the kid picked, right or wrong
    speak(question.options[optionIdx]);
    if (isRight) {
      celebrate();
    }

    // Clear any existing timer
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }

    autoAdvanceTimer.current = setTimeout(() => {
      if (currentQ < task.questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        onComplete({
          allCorrect: newWrong.length === 0,
          erroredItems: newWrong,
        });
      }
    }, 1200);
  };

  const handleRetry = () => {
    // Cancel auto-advance
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div>
      {/* Reference image when provided */}
      {task.image && getWordIllustration(task.image) && (
        <div className="flex justify-center mb-3">
          <img
            src={getWordIllustration(task.image)!}
            alt=""
            className="w-full max-w-md h-auto object-contain rounded-2xl bg-white shadow-sm p-2"
          />
        </div>
      )}

      <div className="text-sm text-[var(--text-light)] mb-2 text-center">
        {currentQ + 1} / {task.questions.length}
      </div>

      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        {/* Per-question image (e.g. the animal the question is about) */}
        {question.image && getWordIllustration(question.image) && (
          <div className="flex justify-center mb-3">
            <img
              src={getWordIllustration(question.image)!}
              alt=""
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-1 mb-4">
          <SpeakerButton text={question.question} size={18} />
          <h3 className="text-xl font-bold text-[var(--text)] text-center font-handwriting">
            {question.question}
          </h3>
        </div>

        <div className="space-y-2">
          {question.options.map((option, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={`w-full p-4 rounded-2xl text-left text-lg font-semibold font-handwriting transition-all ${
                showResult
                  ? i === question.correct
                    ? "bg-green-100 text-green-700 border-2 border-green-400"
                    : i === selected
                      ? "bg-red-100 text-red-700 border-2 border-red-400"
                      : "bg-gray-50 text-gray-400 border-2 border-gray-100"
                  : selected === i
                    ? "bg-purple-100 border-2 border-[var(--primary)] text-[var(--primary)]"
                    : "bg-gray-50 border-2 border-gray-200 text-[var(--text)] hover:bg-gray-100"
              }`}
            >
              {getWordIllustration(option) ? <img src={getWordIllustration(option)!} alt="" className="w-12 h-12 object-contain inline mr-2" /> : null}
              {option}
              {showResult && i === question.correct && " ✅"}
              {showResult && i === selected && !isCorrect && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetry();
                  }}
                  className="inline-flex items-center justify-center p-1 ml-1 rounded-full hover:bg-orange-100 transition-colors"
                  aria-label="Torna a provar"
                >
                  <RefreshCcw className="w-5 h-5 text-orange-500" />
                </button>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
