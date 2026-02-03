"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LabelWriteTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";

interface Props {
  task: LabelWriteTask;
  onComplete: (result: TaskResult) => void;
}

export default function LabelWrite({ task, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate SVG lines from dots to fields
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLines: { x1: number; y1: number; x2: number; y2: number }[] =
        [];
      task.labels.forEach((_, i) => {
        const dot = dotRefs.current[i];
        const field = fieldRefs.current[i];
        if (dot && field) {
          const dotRect = dot.getBoundingClientRect();
          const fieldRect = field.getBoundingClientRect();
          newLines.push({
            x1: dotRect.left + dotRect.width / 2 - containerRect.left,
            y1: dotRect.top + dotRect.height / 2 - containerRect.top,
            x2:
              fieldRect.left < dotRect.left
                ? fieldRect.right - containerRect.left
                : fieldRect.left - containerRect.left,
            y2: fieldRect.top + fieldRect.height / 2 - containerRect.top,
          });
        }
      });
      setLines(newLines);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [task.labels]);

  const handleChange = (idx: number, value: string) => {
    if (checked) return;
    setAnswers({ ...answers, [idx]: value });
  };

  const handleCheck = () => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    const erroredItems: string[] = [];

    task.labels.forEach((label, i) => {
      const correct =
        answers[i]?.trim().toLowerCase() === label.text.toLowerCase();
      newResults[i] = correct;
      if (!correct) {
        allCorrect = false;
        erroredItems.push(label.text);
      }
    });

    setResults(newResults);
    setChecked(true);

    if (allCorrect) {
      const words = task.labels.map((l) => l.text).join(", ");
      speak(words);
      celebrate();
      setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
    }
  };

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setAnswers({});
  };

  const allAnswered = task.labels.every((_, i) => answers[i]?.trim());
  const allCorrect = checked && Object.values(results).every(Boolean);

  // Separate labels into left and right sides
  const leftLabels: number[] = [];
  const rightLabels: number[] = [];
  task.labels.forEach((label, i) => {
    if (label.x <= 50) {
      leftLabels.push(i);
    } else {
      rightLabels.push(i);
    }
  });

  return (
    <div className="space-y-4" ref={containerRef}>
      <p className="text-center text-sm text-[var(--text-light)] mb-2">
        Escriu el nom de cada part del cap:
      </p>

      <div className="relative bg-white rounded-2xl p-4 shadow-sm">
        {/* Three-column layout: left fields | image | right fields */}
        <div className="flex items-center justify-center gap-2 min-h-[320px]">
          {/* Left side fields */}
          <div className="flex flex-col gap-4 flex-1">
            {leftLabels.map((i) => (
              <div
                key={i}
                ref={(el) => { fieldRefs.current[i] = el; }}
                className="flex items-center gap-2"
              >
                <AnimatePresence>
                  {checked && results[i] && getWordIllustration(task.labels[i].text) && (
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      src={getWordIllustration(task.labels[i].text)!}
                      alt=""
                      className="w-8 h-8 object-contain"
                    />
                  )}
                </AnimatePresence>
                <input
                  type="text"
                  value={answers[i] || ""}
                  onChange={(e) => handleChange(i, e.target.value)}
                  disabled={checked}
                  placeholder="..."
                  className={`w-full h-10 px-3 text-base font-bold rounded-xl border-2 font-handwriting text-center ${
                    checked
                      ? results[i]
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-red-400 bg-red-50 text-red-700"
                      : "border-gray-200 focus:border-[var(--primary)] bg-white"
                  } outline-none`}
                />
                {checked && !results[i] && (
                  <span className="text-xs text-[var(--error)] whitespace-nowrap">
                    {task.labels[i].text}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Center image with hotspot dots */}
          <div className="relative w-48 h-72 sm:w-56 sm:h-80 flex-shrink-0 mx-2">
            <img
              src={`/illustrations/${task.image}.webp`}
              alt={task.image}
              className="w-full h-full object-contain"
            />
            {/* Pulsing dots on the image */}
            {task.labels.map((label, i) => (
              <motion.div
                key={i}
                ref={(el) => { dotRefs.current[i] = el; }}
                className="absolute w-4 h-4 rounded-full bg-[var(--primary)] border-2 border-white shadow-md"
                style={{
                  left: `${label.x}%`,
                  top: `${label.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          {/* Right side fields */}
          <div className="flex flex-col gap-4 flex-1">
            {rightLabels.map((i) => (
              <div
                key={i}
                ref={(el) => { fieldRefs.current[i] = el; }}
                className="flex items-center gap-2"
              >
                {checked && !results[i] && (
                  <span className="text-xs text-[var(--error)] whitespace-nowrap">
                    {task.labels[i].text}
                  </span>
                )}
                <input
                  type="text"
                  value={answers[i] || ""}
                  onChange={(e) => handleChange(i, e.target.value)}
                  disabled={checked}
                  placeholder="..."
                  className={`w-full h-10 px-3 text-base font-bold rounded-xl border-2 font-handwriting text-center ${
                    checked
                      ? results[i]
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-red-400 bg-red-50 text-red-700"
                      : "border-gray-200 focus:border-[var(--primary)] bg-white"
                  } outline-none`}
                />
                <AnimatePresence>
                  {checked && results[i] && getWordIllustration(task.labels[i].text) && (
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      src={getWordIllustration(task.labels[i].text)!}
                      alt=""
                      className="w-8 h-8 object-contain"
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* SVG lines connecting dots to fields */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: "visible" }}
        >
          {lines.map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="var(--primary)"
              strokeWidth={2}
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            />
          ))}
        </svg>
      </div>

      {/* Check / Retry */}
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
