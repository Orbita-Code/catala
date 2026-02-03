"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AddArticleTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { ArrowLeft } from "lucide-react";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";

interface Props {
  task: AddArticleTask;
  onComplete: (result: TaskResult) => void;
}

export default function AddArticle({ task, onComplete }: Props) {
  // Derive article options from the task data instead of hardcoding
  const articles = (() => {
    const unique = [...new Set(task.words.map((w) => w.article.toLowerCase()))];
    // Sort in a natural order: definite first (el, la, l', els, les), then indefinite (un, una)
    const order = ["el", "la", "l'", "els", "les", "un", "una"];
    return unique.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  })();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [erroredItems, setErroredItems] = useState<string[]>([]);

  const currentWord = task.words[currentIdx];

  const moveToNext = useCallback(() => {
    if (currentIdx < task.words.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setCorrect(null);
    } else {
      onComplete({
        allCorrect: erroredItems.length === 0,
        erroredItems,
      });
    }
  }, [currentIdx, task.words.length, onComplete, erroredItems]);

  const handleSelect = (article: string) => {
    if (correct !== null) return;
    setSelected(article);
    const isCorrect = article.toLowerCase() === currentWord.article.toLowerCase();
    setCorrect(isCorrect);

    if (isCorrect) {
      celebrate();
      speak(`${currentWord.article} ${currentWord.word}`);
      setTimeout(() => moveToNext(), 1000);
    } else {
      setErroredItems((prev) =>
        prev.includes(currentWord.word) ? prev : [...prev, currentWord.word]
      );
      // Show correct answer briefly then move on
      setTimeout(() => {
        setSelected(null);
        setCorrect(null);
      }, 1200);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3 text-sm text-[var(--text-light)]">
        {currentIdx > 0 && (
          <button
            onClick={() => {
              setCurrentIdx(currentIdx - 1);
              setSelected(null);
              setCorrect(null);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Anterior"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <span>
          {currentIdx + 1} / {task.words.length}
        </span>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm text-center"
      >
        {getWordIllustration(currentWord.word) ? (
          <div className="mb-3 flex justify-center"><img src={getWordIllustration(currentWord.word)!} alt="" className="w-44 h-44 object-contain" /></div>
        ) : null}

        <div className="flex items-center justify-center gap-3 mb-2">
          <span
            className={`text-2xl font-bold px-4 py-2 rounded-xl ${
              selected
                ? correct
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {selected || "___"}
          </span>
          <span className="text-3xl font-black text-[var(--primary)] font-handwriting">
            {currentWord.word}
          </span>
        </div>

        <p className="text-sm text-[var(--text-light)] mb-5">
          Tria l&apos;article correcte
        </p>

        <AnimatePresence>
          {correct === false && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[var(--error)] font-bold mb-3"
            >
              La resposta correcta és: {currentWord.article} {currentWord.word}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap justify-center gap-3">
          {articles.map((article) => (
            <motion.button
              key={article}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(article)}
              disabled={correct !== null}
              className={`px-6 py-3 min-w-[70px] rounded-2xl font-bold text-xl transition-all ${
                selected === article
                  ? correct
                    ? "bg-green-500 text-white"
                    : "bg-red-400 text-white animate-[shake_0.3s]"
                  : correct !== null && article === currentWord.article
                    ? "bg-green-100 text-green-700 ring-2 ring-green-400"
                    : "bg-gray-100 text-[var(--text)] hover:bg-purple-50"
              } disabled:cursor-default`}
            >
              {article}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
