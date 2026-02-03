"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Snowflake } from "lucide-react";
import { getLevelProgress } from "@/lib/levels";
import { getDailyStreak, getStreakFreezes } from "@/lib/progress";
import { getTotalStars } from "@/lib/badges";

interface XPProgressHeaderProps {
  compact?: boolean;
}

export default function XPProgressHeader({ compact = false }: XPProgressHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [levelData, setLevelData] = useState({
    currentLevel: { level: 1, name: "Pollet", emoji: "🐣", minXP: 0 },
    nextLevel: null as { level: number; name: string; emoji: string; minXP: number } | null,
    currentXP: 0,
    xpInCurrentLevel: 0,
    xpNeededForNext: 100,
    progressPercent: 0,
  });
  const [dailyStreak, setDailyStreak] = useState(0);
  const [freezes, setFreezes] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    setMounted(true);
    setLevelData(getLevelProgress());
    setDailyStreak(getDailyStreak());
    setFreezes(getStreakFreezes());
    setTotalStars(getTotalStars());
  }, []);

  if (!mounted) return null;

  const { currentLevel, nextLevel, currentXP, progressPercent } = levelData;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Level badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 rounded-full">
          <span className="text-lg">{currentLevel.emoji}</span>
          <span className="text-sm font-bold text-purple-700">Nv.{currentLevel.level}</span>
        </div>

        {/* Daily streak */}
        {dailyStreak > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
            <Flame size={16} className="text-orange-500" />
            <span className="text-sm font-bold text-orange-600">{dailyStreak}</span>
          </div>
        )}

        {/* Stars */}
        <div className="flex items-center gap-1">
          <span className="text-lg">⭐</span>
          <span className="text-sm font-bold text-amber-600">{totalStars}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-purple-100"
    >
      <div className="flex items-center gap-3">
        {/* Level indicator */}
        <div className="flex items-center gap-2">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-xl shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            {currentLevel.emoji}
          </motion.div>
          <div className="hidden sm:block">
            <p className="text-xs text-purple-600 font-medium">{currentLevel.name}</p>
            <p className="text-[10px] text-gray-500">Nivell {currentLevel.level}</p>
          </div>
        </div>

        {/* XP Progress bar */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-purple-700">{currentXP} XP</span>
            {nextLevel && (
              <span className="text-[10px] text-gray-400">
                {nextLevel.minXP} XP
              </span>
            )}
          </div>
          <div className="h-2.5 bg-purple-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* Daily streak */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center gap-1.5"
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              {dailyStreak > 0 ? (
                <motion.div
                  key="streak"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full"
                >
                  <Flame size={18} className="text-orange-500" />
                  <span className="text-sm font-bold text-orange-600">{dailyStreak}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="no-streak"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full"
                >
                  <Flame size={18} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-400">0</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Streak freezes */}
          {freezes > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 bg-cyan-100 rounded-full"
              title={`${freezes} congelador${freezes > 1 ? 's' : ''} de ratxa`}
            >
              <Snowflake size={14} className="text-cyan-500" />
              <span className="text-xs font-bold text-cyan-600">{freezes}</span>
            </motion.div>
          )}

          {/* Stars */}
          <motion.div
            className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg">⭐</span>
            <span className="text-sm font-bold text-amber-600">{totalStars}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
