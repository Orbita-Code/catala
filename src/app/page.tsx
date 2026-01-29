"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThemeCard from "@/components/ui/ThemeCard";
import StarCompanion from "@/components/ui/StarCompanion";
import StarCounter from "@/components/ui/StarCounter";
import BadgeDisplay from "@/components/ui/BadgeDisplay";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import InstallPrompt from "@/components/ui/InstallPrompt";
import { themes } from "@/data/themes";
import { getProgress } from "@/lib/progress";
import { getTotalStars } from "@/lib/badges";
import type { UserProgress } from "@/types/tasks";

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress>({});
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    setProgress(getProgress());
    setTotalStars(getTotalStars());
  }, []);

  return (
    <div className="min-h-dvh pb-8">
      <header className="relative overflow-hidden px-4 pt-4 pb-6 text-center">
        <div className="flex justify-start mb-2">
          <HamburgerMenu />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <StarCompanion
            size="lg"
            mood="happy"
            animation="idle"
            message="Hola! Vols jugar?"
          />
          <div className="mt-2">
            <StarCounter count={totalStars} />
          </div>
          <h1 className="mt-3 text-4xl font-black text-[var(--primary)]">
            Català
          </h1>
          <p className="mt-1 text-base text-[var(--text-light)] font-semibold">
            Aprèn jugant! 🎮
          </p>
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
