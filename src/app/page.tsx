"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThemeCard from "@/components/ui/ThemeCard";
import AnimatedStar from "@/components/star/AnimatedStar";
import { getStarReaction } from "@/lib/starReactions";
import BadgeDisplay from "@/components/ui/BadgeDisplay";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import InstallPrompt from "@/components/ui/InstallPrompt";
import { XPProgressHeader, DailyRewardModal } from "@/components/gamification";
import { themes } from "@/data/themes";
import { getScoringTaskCount } from "@/data/task-data";
import { getProgress, shouldShowDailyReward } from "@/lib/progress";
import type { UserProgress } from "@/types/tasks";

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress>({});
  const [showDailyReward, setShowDailyReward] = useState(false);

  useEffect(() => {
    setProgress(getProgress());

    // Check if we should show daily reward modal
    if (shouldShowDailyReward()) {
      // Small delay to let the page render first
      const timer = setTimeout(() => setShowDailyReward(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-dvh pb-8">
      {/* Daily Reward Modal */}
      {showDailyReward && (
        <DailyRewardModal onClose={() => setShowDailyReward(false)} />
      )}

      <header className="relative overflow-hidden px-4 pt-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          {/* Left: Mascot with speech bubble */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <HamburgerMenu />
            <AnimatedStar
              size="md"
              reaction={getStarReaction("greeting")}
              message="Hola! Vols jugar?"
            />
          </div>

          {/* Center: Title */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--primary)] leading-tight">
              Aprenc Català
            </h1>
          </div>

          {/* Right: XP Progress (compact) */}
          <div className="flex-shrink-0">
            <XPProgressHeader compact />
          </div>
        </motion.div>
      </header>

      <main className="px-4 max-w-5xl mx-auto">
        <motion.h2
          className="text-xl font-bold text-[var(--text)] mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Temes
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {themes.map((theme, index) => (
            <ThemeCard
              key={theme.slug}
              theme={theme}
              progress={progress[theme.slug]?.completedTasks?.length || 0}
              totalTasks={getScoringTaskCount(theme.slug)}
              index={index}
            />
          ))}
        </div>

        {/* Badges section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <BadgeDisplay />
        </motion.div>
      </main>

      <InstallPrompt />

      {/* Footer */}
      <footer className="mt-12 pb-4 text-center">
        <a
          href="https://orbitacode.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--text-light)] hover:text-[var(--primary)] transition-colors"
        >
          Powered by <span className="font-semibold">Orbita Code</span> 🚀
        </a>
      </footer>
    </div>
  );
}
