"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DecodeGridTask, TaskResult } from "@/types/tasks";
import { ArrowLeft } from "lucide-react";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";

interface Props {
  task: DecodeGridTask;
  onComplete: (result: TaskResult) => void;
}

export default function DecodeGrid({ task, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputs, setInputs] = useState<string[]>(
    Array(task.words[0].codes.length).fill("")
  );
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [erroredItems, setErroredItems] = useState<string[]>([]);

  const currentWord = task.words[currentIdx];

  // Extract unique row/column labels from grid keys
  const gridKeys = Object.keys(task.codeGrid);
  const rows = [...new Set(gridKeys.map((k) => k[0]))].sort();
  const cols = [...new Set(gridKeys.map((k) => k.slice(1)))].sort((a, b) => Number(a) - Number(b));

  const moveToNext = useCallback(() => {
    if (currentIdx < task.words.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setInputs(Array(task.words[nextIdx].codes.length).fill(""));
      setChecked(false);
      setCorrect(null);
    } else {
      onComplete({
        allCorrect: erroredItems.length === 0,
        erroredItems,
      });
    }
  }, [currentIdx, task.words, onComplete, erroredItems]);

  const handleInputChange = (idx: number, value: string) => {
    if (checked) return;
    const newInputs = [...inputs];
    newInputs[idx] = value.slice(0, 1);
    setInputs(newInputs);

    // Auto-focus next input
    if (value && idx < inputs.length - 1) {
      const nextInput = document.getElementById(`decode-input-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleCheck = useCallback(() => {
    const answer = inputs.join("").toLowerCase();
    const isCorrect = answer === currentWord.answer.toLowerCase();
    setChecked(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      celebrate();
      speak(currentWord.answer);
      setTimeout(() => moveToNext(), 1200);
    } else {
      setErroredItems((prev) =>
        prev.includes(currentWord.answer)
          ? prev
          : [...prev, currentWord.answer]
      );
    }
  }, [inputs, currentWord, moveToNext]);

  const handleRetry = useCallback(() => {
    setInputs(Array(currentWord.codes.length).fill(""));
    setChecked(false);
    setCorrect(null);
  }, [currentWord]);

  const allFilled = inputs.every((v) => v.trim() !== "");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3 text-sm text-[var(--text-light)]">
        {currentIdx > 0 && (
          <button
            onClick={() => {
              const prevIdx = currentIdx - 1;
              setCurrentIdx(prevIdx);
              setInputs(Array(task.words[prevIdx].codes.length).fill(""));
              setChecked(false);
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
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        {/* Reference grid */}
        <div className="mb-5 overflow-x-auto">
          <table className="mx-auto border-collapse">
            <thead>
              <tr>
                <th className="w-10 h-10"></th>
                {cols.map((col) => (
                  <th
                    key={col}
                    className="w-10 h-10 text-center font-bold text-[var(--primary)] bg-purple-50 border border-gray-200"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  <td className="w-10 h-10 text-center font-bold text-[var(--primary)] bg-purple-50 border border-gray-200">
                    {row}
                  </td>
                  {cols.map((col) => {
                    const key = `${row}${col}`;
                    return (
                      <td
                        key={key}
                        className="w-10 h-10 text-center font-bold text-lg border border-gray-200 font-handwriting"
                      >
                        {task.codeGrid[key] || ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Code sequence */}
        <div className="flex justify-center gap-2 mb-4">
          {currentWord.codes.map((code, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-[var(--primary)] bg-purple-50 px-2 py-1 rounded">
                {code}
              </span>
              <input
                id={`decode-input-${i}`}
                type="text"
                maxLength={1}
                value={inputs[i]}
                onChange={(e) => handleInputChange(i, e.target.value)}
                disabled={checked}
                className={`w-10 h-12 text-center text-xl font-bold rounded-xl border-2 font-handwriting ${
                  checked
                    ? correct
                      ? "border-green-400 bg-green-50 text-green-700"
                      : inputs[i].toLowerCase() ===
                          currentWord.answer[i]?.toLowerCase()
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-red-400 bg-red-50 text-red-700"
                    : "border-gray-200 focus:border-[var(--primary)]"
                } outline-none`}
              />
            </div>
          ))}
        </div>

        <AnimatePresence>
          {checked && !correct && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[var(--error)] font-bold mb-3"
            >
              Resposta: {currentWord.answer}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-3">
          {!checked ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheck}
              disabled={!allFilled}
              className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg disabled:opacity-40 shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
            >
              Comprova!
            </motion.button>
          ) : !correct ? (
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
      </motion.div>
    </div>
  );
}
