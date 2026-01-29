"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThemeCard from "@/components/ui/ThemeCard";
import { themes } from "@/data/themes";
import { getProgress } from "@/lib/progress";
import type { UserProgress } from "@/types/tasks";

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress>({});

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="min-h-dvh pb-8">
      <header className="relative overflow-hidden px-4 pt-8 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black text-[var(--primary)]">
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
      </main>
    </div>
  );
}
