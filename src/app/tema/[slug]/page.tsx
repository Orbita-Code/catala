"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import TaskRenderer from "@/components/tasks/TaskRenderer";
import { themes } from "@/data/themes";
import { laClasseTasks } from "@/data/la-classe";
import { lEscolaTasks } from "@/data/l-escola";
import { elCosTasks } from "@/data/el-cos";
import { laRobaTasks } from "@/data/la-roba";
import { laCasaTasks } from "@/data/la-casa";
import { laFamiliaTasks } from "@/data/la-familia";
import { lesBotiguesToasks } from "@/data/les-botigues";
import { elMenjarTasks } from "@/data/el-menjar";
import { elsAnimalsTasks } from "@/data/els-animals";
import { laCiutatTasks } from "@/data/la-ciutat";
import { elsVehiclesTasks } from "@/data/els-vehicles";
import { elsOficisTasks } from "@/data/els-oficis";
import { getThemeProgress, completeTask } from "@/lib/progress";
import { getEncouragement } from "@/lib/encouragement";
import { Task } from "@/types/tasks";
import confetti from "canvas-confetti";

const taskData: Record<string, Task[]> = {
  "la-classe": laClasseTasks,
  "l-escola": lEscolaTasks,
  "el-cos": elCosTasks,
  "la-roba": laRobaTasks,
  "la-casa": laCasaTasks,
  "la-familia": laFamiliaTasks,
  "les-botigues": lesBotiguesToasks,
  "el-menjar": elMenjarTasks,
  "els-animals": elsAnimalsTasks,
  "la-ciutat": laCiutatTasks,
  "els-vehicles": elsVehiclesTasks,
  "els-oficis": elsOficisTasks,
};

export default function TemaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const theme = themes.find((t) => t.slug === slug);
  const themeIndex = themes.findIndex((t) => t.slug === slug);
  const tasks = taskData[slug] || [];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackMood, setFeedbackMood] = useState<"happy" | "confused">(
    "happy"
  );

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

    // Show encouragement feedback
    if (correct) {
      const enc =
        result.streak > 1
          ? getEncouragement("streak", result.streak)
          : getEncouragement("correct");
      setFeedbackMessage(enc.text);
      setFeedbackMood("happy");

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [theme.color, "#FDCB6E", "#00CECE"],
      });
    } else {
      const enc = getEncouragement("wrong");
      setFeedbackMessage(enc.text);
      setFeedbackMood("confused");
    }

    // Clear feedback and advance
    if (currentTaskIndex < tasks.length - 1) {
      setTimeout(() => {
        setFeedbackMessage(null);
        setCurrentTaskIndex(currentTaskIndex + 1);
      }, 2000);
    } else {
      setTimeout(() => {
        setFeedbackMessage(null);
        setShowCelebration(true);
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 },
          colors: [theme.color, "#FDCB6E", "#00CECE", "#00B894"],
        });
      }, 2000);
    }
  };

  if (showCelebration) {
    // Find the next theme
    const nextTheme =
      themeIndex < themes.length - 1 ? themes[themeIndex + 1] : null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-dvh flex flex-col items-center justify-center gap-6 px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10 }}
          className="relative"
        >
          <Image
            src="/star-mascot.png"
            alt="Estrella"
            width={120}
            height={120}
            className="rounded-3xl"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-black text-[var(--text)]"
        >
          Fantàstic! 🏆
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-[var(--text-light)]"
        >
          Has completat &ldquo;Tema {themeIndex + 1}: {theme.name}&rdquo;!
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-2"
        >
          <p className="text-lg">
            ⭐ {tasks.length}/{tasks.length} tasques
          </p>
          <p className="text-lg">🔥 Millor ratxa: {streak}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-3 w-full max-w-xs mt-4"
        >
          {nextTheme && (
            <button
              onClick={() => router.push(`/tema/${nextTheme.slug}`)}
              className="w-full py-3 text-white font-bold rounded-2xl text-lg"
              style={{ backgroundColor: nextTheme.color }}
            >
              Següent: Tema {themeIndex + 2} →
            </button>
          )}
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
        </motion.div>
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
                Tema {themeIndex + 1}: {theme.name}
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

        {/* Star Mascot Feedback */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-lg border border-gray-100"
            >
              <motion.div
                animate={{
                  rotate: feedbackMood === "happy" ? [0, -10, 10, 0] : [0, -5, 5, 0],
                }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/star-mascot.png"
                  alt="Estrella"
                  width={48}
                  height={48}
                  className="rounded-full"
                  style={{
                    filter:
                      feedbackMood === "confused"
                        ? "hue-rotate(180deg) brightness(1.1)"
                        : "none",
                  }}
                />
              </motion.div>
              <p className="text-base font-bold text-[var(--text)] max-w-[200px]">
                {feedbackMessage}
              </p>
            </motion.div>
          )}
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
