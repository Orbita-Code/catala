"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TaskRenderer from "@/components/tasks/TaskRenderer";
import { themes } from "@/data/themes";
import { laClasseTasks } from "@/data/la-classe";
import { getThemeProgress, completeTask } from "@/lib/progress";
import { Task } from "@/types/tasks";
import confetti from "canvas-confetti";

const taskData: Record<string, Task[]> = {
  "la-classe": laClasseTasks,
};

export default function TemaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const theme = themes.find((t) => t.slug === slug);
  const tasks = taskData[slug] || [];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const progress = getThemeProgress(slug);
    if (progress.currentTask > 0 && progress.currentTask < tasks.length) {
      setCurrentTaskIndex(progress.currentTask);
    }
    setStreak(progress.streak);
  }, [slug, tasks.length]);

  if (!theme) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-xl text-[var(--text-light)]">Tema no trobat</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-4">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
          style={{ backgroundColor: `${theme.color}15` }}
        >
          {theme.icon}
        </div>
        <h2 className="text-2xl font-bold text-[var(--text)]">{theme.name}</h2>
        <p className="text-[var(--text-light)] text-center">
          Aquesta tema encara no està disponible. Pròximament!
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl"
        >
          Torna a l&apos;inici
        </button>
      </div>
    );
  }

  const currentTask = tasks[currentTaskIndex];
  const progress = ((currentTaskIndex + 1) / tasks.length) * 100;

  const handleTaskComplete = (correct: boolean) => {
    const result = completeTask(slug, currentTask.id, correct);
    setStreak(result.streak);

    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [theme.color, "#FDCB6E", "#00CECE"],
      });
    }

    if (currentTaskIndex < tasks.length - 1) {
      setTimeout(() => {
        setCurrentTaskIndex(currentTaskIndex + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowCelebration(true);
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 },
          colors: [theme.color, "#FDCB6E", "#00CECE", "#00B894"],
        });
      }, 1500);
    }
  };

  if (showCelebration) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-dvh flex flex-col items-center justify-center gap-6 px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="text-7xl"
        >
          🏆
        </motion.div>
        <h1 className="text-3xl font-black text-[var(--text)]">Fantàstic!</h1>
        <p className="text-xl text-[var(--text-light)]">
          Has completat &ldquo;{theme.name}&rdquo;!
        </p>
        <div className="space-y-2">
          <p className="text-lg">
            ⭐ {tasks.length}/{tasks.length} tasques
          </p>
          <p className="text-lg">🔥 Millor ratxa: {streak}</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg"
          >
            Torna a l&apos;inici
          </button>
          <button
            onClick={() => {
              setCurrentTaskIndex(0);
              setShowCelebration(false);
            }}
            className="w-full py-3 bg-gray-100 text-[var(--text)] font-bold rounded-2xl text-lg"
          >
            Repeteix el tema
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--background)] px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-[var(--text)]" />
          </button>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span
                className="text-sm font-bold"
                style={{ color: theme.color }}
              >
                {theme.name}
              </span>
              <span className="text-sm text-[var(--text-light)]">
                {currentTaskIndex + 1}/{tasks.length}
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: theme.color }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full"
            >
              <span className="text-sm">🔥</span>
              <span className="text-sm font-bold text-orange-600">
                {streak}
              </span>
            </motion.div>
          )}
        </div>
      </header>

      {/* Task Content */}
      <main className="flex-1 px-4 pb-4 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTask.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-[var(--text)] mb-4">
              {currentTask.prompt}
            </h2>
            <TaskRenderer
              task={currentTask}
              onComplete={handleTaskComplete}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="sticky bottom-0 bg-[var(--background)] px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between max-w-2xl mx-auto">
          <button
            onClick={() =>
              setCurrentTaskIndex(Math.max(0, currentTaskIndex - 1))
            }
            disabled={currentTaskIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[var(--text-light)] disabled:opacity-30 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} /> Anterior
          </button>
          <button
            onClick={() =>
              setCurrentTaskIndex(
                Math.min(tasks.length - 1, currentTaskIndex + 1)
              )
            }
            disabled={currentTaskIndex === tasks.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[var(--text-light)] disabled:opacity-30 hover:bg-gray-100 transition-colors"
          >
            Següent <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
