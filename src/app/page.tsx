"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThemeCard from "@/components/ui/ThemeCard";
import AnimatedStar from "@/components/star/AnimatedStar";
import { getStarReaction } from "@/lib/starReactions";
import StarCounter from "@/components/ui/StarCounter";
import BadgeDisplay from "@/components/ui/BadgeDisplay";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import InstallPrompt from "@/components/ui/InstallPrompt";
import { themes } from "@/data/themes";
import { getScoringTaskCount } from "@/data/task-data";
import { getProgress } from "@/lib/progress";
import { getTotalStars } from "@/lib/badges";
import type { UserProgress } from "@/types/tasks";

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress>({});
  const [totalStars, setTotalStars] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    setProgress(getProgress());
    setTotalStars(getTotalStars());
    setTotalTasks(themes.reduce((sum, t) => sum + getScoringTaskCount(t.slug), 0));
  }, []);

  return (
    <div className="min-h-dvh pb-8">
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

          {/* Right: Star counter */}
          <div className="flex-shrink-0">
            <StarCounter count={totalStars} total={totalTasks} />
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
    </div>
  );
}
