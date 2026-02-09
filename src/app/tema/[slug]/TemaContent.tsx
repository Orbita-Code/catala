"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Home } from "lucide-react";
import TaskRenderer from "@/components/tasks/TaskRenderer";
import SpeakerButton from "@/components/ui/SpeakerButton";
import AnimatedStar from "@/components/star/AnimatedStar";
import type { StarReaction } from "@/components/star/starTypes";
import { getStarReaction, getReactionEvent } from "@/lib/starReactions";
import { themes } from "@/data/themes";
import { taskData, getScoringTaskCount } from "@/data/task-data";
import { getThemeProgress, completeTask, isThemeFullyComplete } from "@/lib/progress";
import { getEncouragement } from "@/lib/encouragement";
import { addError, getThemeErrorCount, getErroredItemsList, removeError, clearThemeErrors } from "@/lib/errors";
import { speak } from "@/lib/tts";
import { getWordIllustration } from "@/lib/illustrations";
import { ErrorTrackingProvider } from "@/contexts/ErrorTrackingContext";

import type { TaskResult } from "@/types/tasks";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { initAudio, isMuted, toggleMute, playCorrect, playWrong, playCombo, playThemeComplete, playApplause } from "@/lib/audio";
import SparkleOverlay from "@/components/ui/SparkleOverlay";
import BalloonCelebration from "@/components/ui/BalloonCelebration";
import FireworksBurst from "@/components/ui/FireworksBurst";
import MagicCelebration from "@/components/ui/MagicCelebration";
import { calculateTaskXP, isFirstTaskOfDay, addXP } from "@/lib/xp";
import { updateDailyStreak } from "@/lib/progress";
import XPGainAnimation from "@/components/gamification/XPGainAnimation";
import LevelUpCelebration from "@/components/gamification/LevelUpCelebration";

interface TemaContentProps {
  slug: string;
}

export default function TemaContent({ slug }: TemaContentProps) {
  const router = useRouter();
  const theme = themes.find((t) => t.slug === slug);
  const themeIndex = themes.findIndex((t) => t.slug === slug);
  const tasks = taskData[slug] || [];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackReaction, setFeedbackReaction] = useState<StarReaction[] | null>(null);
  const [muted, setMuted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sparkleTrigger, setSparkleTrigger] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ prev: number; new: number } | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [themeErrorCount, setThemeErrorCount] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewItems, setReviewItems] = useState<{ taskId: string; item: string }[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    initAudio();
    setMuted(isMuted());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const progress = getThemeProgress(slug);
    if (progress.currentTask > 0 && progress.currentTask < tasks.length) {
      setCurrentTaskIndex(progress.currentTask);
    }
    setStreak(progress.streak);
  }, [slug, tasks.length, mounted]);

  if (!theme) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-xl text-[var(--text-light)]">Tema no trobat</p>
      </div>
    );
  }

  if (!mounted) {
    return null;
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
  const isBonus = !!currentTask.bonus;
  const scoringCount = getScoringTaskCount(slug);
  const scoringIndex = isBonus ? scoringCount : currentTaskIndex + 1;
  const progress = Math.min(((currentTaskIndex + 1) / tasks.length) * 100, 100);

  const handleTaskComplete = (taskResult: TaskResult) => {
    const progressResult = completeTask(slug, currentTask.id, taskResult, currentTaskIndex + 1, isBonus);
    setStreak(progressResult.streak);

    // Update daily streak on first task completion
    updateDailyStreak();

    // Track errors silently for later review
    if (taskResult.erroredItems && taskResult.erroredItems.length > 0) {
      for (const item of taskResult.erroredItems) {
        addError(slug, currentTask.id, item);
      }
    }

    if (taskResult.allCorrect) {
      if (progressResult.streak > 1) {
        playCombo();
      } else {
        playCorrect();
      }
      const enc =
        progressResult.streak > 1
          ? getEncouragement("streak", { streakCount: progressResult.streak, themeSlug: slug })
          : getEncouragement("correct", { themeSlug: slug, correctInRow: progressResult.streak });
      setFeedbackMessage(enc.text);
      const reactionEvent = getReactionEvent("correct", progressResult.streak);
      setFeedbackReaction(getStarReaction(reactionEvent));

      celebrate([theme.color, "#FDCB6E", "#00CECE"]);
      setSparkleTrigger((t) => t + 1);

      // Award XP for correct answers (not for bonus tasks)
      if (!isBonus) {
        const xpAmount = calculateTaskXP(
          taskResult.allCorrect,
          progressResult.streak,
          isFirstTaskOfDay()
        );
        const xpResult = addXP(xpAmount);

        // Show XP animation
        setXpGained(xpAmount);
        setShowXpAnimation(true);
        setTimeout(() => setShowXpAnimation(false), 1500);

        // Check for level up
        if (xpResult.isLevelUp) {
          setTimeout(() => {
            setLevelUpData({ prev: xpResult.previousLevel, new: xpResult.newLevel });
          }, 1800);
        }
      }
    } else {
      playWrong();
      const enc = getEncouragement("wrong");
      setFeedbackMessage(enc.text);
      setFeedbackReaction(getStarReaction("wrong"));
    }

    if (currentTaskIndex < tasks.length - 1) {
      setTimeout(() => {
        setFeedbackMessage(null);
        setFeedbackReaction(null);
        setCurrentTaskIndex(currentTaskIndex + 1);
      }, 2000);
    } else {
      setTimeout(() => {
        setFeedbackMessage(null);
        setFeedbackReaction(null);

        // Check for errors to offer review
        const errorCount = getThemeErrorCount(slug);
        setThemeErrorCount(errorCount);

        if (errorCount > 0) {
          // Show review dialog first
          setShowReviewDialog(true);
          playCorrect();
          celebrate([theme.color, "#FDCB6E"]);
        } else {
          // No errors - go straight to celebration
          setShowCelebration(true);

          const fullyComplete = isThemeFullyComplete(slug, scoringCount);
          // Play applause and cheering for all completions
          playApplause(fullyComplete ? 5 : 3);

          if (fullyComplete) {
            playThemeComplete();
            // Multiple confetti waves for perfect completion
            celebrateBig([theme.color, "#FDCB6E", "#00CECE", "#00B894"]);
            setTimeout(() => {
              celebrateBig([theme.color, "#FDCB6E"]);
            }, 500);
            setTimeout(() => {
              celebrateBig(["#00CECE", "#00B894"]);
            }, 1000);
          } else {
            playCorrect();
            celebrate([theme.color, "#FDCB6E"]);
          }
        }
      }, 2000);
    }
  };

  // Review mode - practice errored items
  if (reviewMode && reviewItems.length > 0) {
    const currentItem = reviewItems[reviewIndex];
    const illustration = getWordIllustration(currentItem.item);

    const handleCorrect = () => {
      // Remove this error
      removeError(slug, currentItem.taskId, currentItem.item);
      celebrate([theme.color, "#00B894"]);
      playCorrect();

      if (reviewIndex < reviewItems.length - 1) {
        // Next item
        setReviewIndex(reviewIndex + 1);
      } else {
        // All done!
        celebrateBig([theme.color, "#FDCB6E", "#00CECE"]);
        setReviewMode(false);
        setShowCelebration(true);
        playApplause(3);
      }
    };

    const handleSkipReview = () => {
      if (reviewIndex < reviewItems.length - 1) {
        setReviewIndex(reviewIndex + 1);
      } else {
        // Done with review (some errors may remain)
        setReviewMode(false);
        setShowCelebration(true);
        celebrate([theme.color, "#FDCB6E"]);
      }
    };

    return (
      <div className="min-h-dvh flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[var(--background)] px-4 pt-3 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => {
                setReviewMode(false);
                setShowCelebration(true);
              }}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Home size={24} className="text-[var(--text)]" />
            </button>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-orange-500">
                  🔄 Practicar paraules
                </span>
                <span className="text-sm text-[var(--text-light)]">
                  {reviewIndex + 1}/{reviewItems.length}
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-orange-500"
                  animate={{ width: `${((reviewIndex + 1) / reviewItems.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Review content */}
        <main className="flex-1 px-4 pb-24 flex flex-col items-center justify-center gap-6">
          <motion.div
            key={reviewIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full text-center"
          >
            {illustration ? (
              <img
                src={illustration}
                alt={currentItem.item}
                className="w-32 h-32 mx-auto mb-4 object-contain"
              />
            ) : (
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
                📝
              </div>
            )}

            <p className="text-2xl font-black font-handwriting text-[var(--primary)] mb-4">
              {currentItem.item}
            </p>

            <button
              onClick={() => speak(currentItem.item)}
              className="mb-6 px-4 py-2 bg-[var(--primary)] text-white rounded-full font-bold flex items-center gap-2 mx-auto"
            >
              <Volume2 size={20} /> Escolta
            </button>

            <p className="text-sm text-[var(--text-light)] mb-4">
              Pots dir-ho en veu alta?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleCorrect}
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-2xl text-lg shadow-md hover:bg-green-600 transition-colors"
              >
                Ho sé! ✅
              </button>
              <button
                onClick={handleSkipReview}
                className="px-6 py-3 bg-gray-200 text-[var(--text)] font-bold rounded-2xl text-lg"
              >
                Encara no 😅
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Review dialog - offer to practice errors
  if (showReviewDialog) {
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
        >
          <AnimatedStar
            size="lg"
            reaction={getStarReaction("correct")}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-black text-[var(--text)]"
        >
          Molt bé! 🎉
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-orange-50 rounded-2xl p-5 max-w-sm border border-orange-200"
        >
          <p className="text-lg font-bold text-orange-800 mb-2">
            🔄 Tens {themeErrorCount} {themeErrorCount === 1 ? "paraula" : "paraules"} per practicar!
          </p>
          <p className="text-sm text-orange-700">
            Vols practicar les paraules difícils ara?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          <button
            onClick={() => {
              // Enter review mode
              const items = getErroredItemsList(slug);
              setReviewItems(items);
              setReviewIndex(0);
              setShowReviewDialog(false);
              setReviewMode(true);
            }}
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-2xl text-lg shadow-md hover:bg-orange-600 transition-colors"
          >
            Sí, practica! 💪
          </button>
          <button
            onClick={() => {
              setShowReviewDialog(false);
              setShowCelebration(true);
              const fullyComplete = isThemeFullyComplete(slug, scoringCount);
              playApplause(fullyComplete ? 5 : 3);
              celebrate([theme.color, "#FDCB6E"]);
            }}
            className="w-full py-3 bg-gray-100 text-[var(--text)] font-bold rounded-2xl text-lg"
          >
            Ara no, després
          </button>
        </motion.div>
      </motion.div>
    );
  }

  if (showCelebration) {
    const nextTheme =
      themeIndex < themes.length - 1 ? themes[themeIndex + 1] : null;
    const fullyComplete = isThemeFullyComplete(slug, scoringCount);

    return (
      <>
        {/* Background celebration effects - MAGICAL! */}
        <MagicCelebration intensity={fullyComplete ? "high" : "medium"} />
        <BalloonCelebration count={fullyComplete ? 25 : 15} />
        <FireworksBurst waves={fullyComplete ? 8 : 4} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-dvh flex flex-col items-center justify-center gap-6 px-4 text-center relative z-10"
        >
          {/* Celebration emoji instead of mascot */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 10 }}
            className="text-8xl"
          >
            {fullyComplete ? "🏆" : "🎉"}
          </motion.div>

          {/* Pulsating hearts, stars, and Saturn decorations - AWAY from buttons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Pulsating hearts - only in corners, not over buttons */}
            {[
              { x: "5%", y: "12%", size: "2.5rem", delay: 0 },
              { x: "88%", y: "15%", size: "2rem", delay: 0.3 },
              { x: "8%", y: "38%", size: "2.2rem", delay: 0.6 },
              { x: "90%", y: "42%", size: "2rem", delay: 0.9 },
            ].map((heart, i) => (
              <motion.div
                key={`heart-${i}`}
                className="absolute"
                style={{ left: heart.x, top: heart.y, fontSize: heart.size }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.2,
                  delay: heart.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ❤️
              </motion.div>
            ))}

            {/* Pulsating stars - only on sides, not over buttons */}
            {[
              { x: "18%", y: "8%", size: "2.5rem", delay: 0.2 },
              { x: "80%", y: "6%", size: "2.2rem", delay: 0.5 },
              { x: "3%", y: "55%", size: "2rem", delay: 0.8 },
              { x: "94%", y: "58%", size: "2.3rem", delay: 1.1 },
            ].map((star, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute"
                style={{ left: star.x, top: star.y, fontSize: star.size }}
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 15, -15, 0],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ⭐
              </motion.div>
            ))}

            {/* Planet Saturn - upper left corner */}
            <motion.div
              className="absolute text-5xl"
              style={{ left: "8%", top: "5%", filter: "drop-shadow(0 0 10px rgba(255, 200, 100, 0.5))" }}
              animate={{
                rotate: [0, 360],
                y: [0, -8, 0],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              🪐
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-black text-[var(--text)]"
          >
            {fullyComplete ? "Perfecte! 🏆🎉" : "Molt bé! 👏"}
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
              ⭐ {scoringCount}/{scoringCount} tasques
            </p>
            <p className="text-lg">🔥 Millor ratxa: {streak}</p>
          </motion.div>
          {!fullyComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-yellow-50 rounded-2xl p-4 max-w-xs border border-yellow-200"
            >
              <p className="text-sm font-semibold text-yellow-800">
                Algunes tasques tenen errors. Repeteix el tema per aconseguir la celebració completa! 🌟
              </p>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col gap-3 w-full max-w-xs mt-4"
          >
            {!fullyComplete && (
              <button
                onClick={() => {
                  setCurrentTaskIndex(0);
                  setShowCelebration(false);
                }}
                className="w-full py-3 text-white font-bold rounded-2xl text-lg"
                style={{ backgroundColor: theme.color }}
              >
                Repeteix per millorar! 💪
              </button>
            )}
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
            {fullyComplete && (
              <button
                onClick={() => {
                  setCurrentTaskIndex(0);
                  setShowCelebration(false);
                }}
                className="w-full py-3 bg-gray-100 text-[var(--text)] font-bold rounded-2xl text-lg"
              >
                Repeteix el tema
              </button>
            )}
          </motion.div>
        </motion.div>
      </>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* XP Gain Animation */}
      <XPGainAnimation amount={xpGained} visible={showXpAnimation} />

      {/* Level Up Celebration Modal */}
      {levelUpData && (
        <LevelUpCelebration
          previousLevel={levelUpData.prev}
          newLevel={levelUpData.new}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--background)] px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Torna a l'inici"
          >
            <Home size={24} className="text-[var(--text)]" />
          </button>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span
                className="text-sm font-bold truncate max-w-[120px] sm:max-w-none"
                style={{ color: theme.color }}
              >
                Tema {themeIndex + 1}: {theme.name}
              </span>
              <span className="text-sm text-[var(--text-light)]">
                {isBonus ? `${scoringCount}/${scoringCount} + bonus` : `${currentTaskIndex + 1}/${scoringCount}`}
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
          <button
            onClick={() => setMuted(toggleMute())}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label={muted ? "Activa so" : "Silencia"}
          >
            {muted ? (
              <VolumeX size={20} className="text-[var(--text-light)]" />
            ) : (
              <Volume2 size={20} className="text-[var(--text-light)]" />
            )}
          </button>
        </div>
      </header>

      {/* Task Content */}
      <main className="flex-1 px-4 pb-24 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTask.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-2 mb-4">
              <SpeakerButton text={currentTask.prompt} size={24} />
              <h2 className="text-xl font-bold text-[var(--text)]">
                {isBonus ? (
                  <span className="text-[var(--primary)]">Activitat extra! 🎨 </span>
                ) : (
                  <span className="text-[var(--text-light)]">{currentTaskIndex + 1}. </span>
                )}
                {currentTask.prompt}
              </h2>
            </div>
            <ErrorTrackingProvider themeSlug={slug} taskId={currentTask.id}>
              <TaskRenderer
                task={currentTask}
                onComplete={handleTaskComplete}
              />
            </ErrorTrackingProvider>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sparkle burst on correct answer */}
      <SparkleOverlay trigger={sparkleTrigger} />

      {/* Fixed Star Companion - bottom left, always visible */}
      <div className="fixed bottom-20 left-4 z-20">
        <AnimatePresence mode="wait">
          {feedbackReaction ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
            >
              <AnimatedStar
                size="md"
                reaction={feedbackReaction}
                message={feedbackMessage}
              />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatedStar
                size="sm"
                expression="happy"
                animation="idle"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <footer className="sticky bottom-0 bg-[var(--background)] px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between max-w-2xl mx-auto">
          <button
            onClick={() =>
              setCurrentTaskIndex(Math.max(0, currentTaskIndex - 1))
            }
            disabled={currentTaskIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white bg-[var(--primary)] disabled:opacity-30 hover:brightness-110 active:scale-95 transition-all shadow-md"
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white bg-[var(--secondary)] disabled:opacity-30 hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            Següent <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
