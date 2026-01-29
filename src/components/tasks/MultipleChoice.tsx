"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MultipleChoiceTask } from "@/types/tasks";
import { getWordEmoji } from "@/lib/illustrations";

interface Props {
  task: MultipleChoiceTask;
  onComplete: (correct: boolean) => void;
}

export default function MultipleChoice({ task, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const question = task.questions[currentQ];
  const isCorrect = selected === question.correct;

  const handleSelect = (optionIdx: number) => {
    if (showResult) return;
    setSelected(optionIdx);
    setShowResult(true);

    const newCorrectCount = optionIdx === question.correct ? correctCount + 1 : correctCount;
    setCorrectCount(newCorrectCount);

    setTimeout(() => {
      if (currentQ < task.questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        onComplete(newCorrectCount === task.questions.length);
      }
    }, 1200);
  };

  return (
    <div>
      <div className="text-sm text-[var(--text-light)] mb-2 text-center">
        {currentQ + 1} / {task.questions.length}
      </div>

      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        <h3 className="text-xl font-bold text-[var(--text)] mb-4 text-center">
          {question.question}
        </h3>

        <div className="space-y-2">
          {question.options.map((option, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={`w-full p-4 rounded-2xl text-left text-lg font-semibold transition-all ${
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
              {getWordEmoji(option) && <span className="mr-2">{getWordEmoji(option)}</span>}
              {option}
              {showResult && i === question.correct && " ✅"}
              {showResult && i === selected && !isCorrect && " ❌"}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
