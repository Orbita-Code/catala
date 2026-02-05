"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flame, Snowflake, Calendar, Trophy, Target } from "lucide-react";
import { getLevelProgress, LEVELS } from "@/lib/levels";
import { getTotalXP, getXPHistory } from "@/lib/xp";
import {
  getDailyStreak,
  getLongestStreak,
  getStreakFreezes,
  getCalendarHistory,
} from "@/lib/progress";
import { getTotalStars, getEarnedBadgeIds, allBadges } from "@/lib/badges";
import { themes } from "@/data/themes";
import { getScoringTaskCount } from "@/data/task-data";

export default function StatsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [levelData, setLevelData] = useState(getLevelProgress());
  const [totalXP, setTotalXP] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [freezes, setFreezes] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [totalPossibleStars, setTotalPossibleStars] = useState(0);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<Set<string>>(new Set());
  const [calendarHistory, setCalendarHistory] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    setLevelData(getLevelProgress());
    setTotalXP(getTotalXP());
    setDailyStreak(getDailyStreak());
    setLongestStreak(getLongestStreak());
    setFreezes(getStreakFreezes());
    setTotalStars(getTotalStars());
    setTotalPossibleStars(
      themes.reduce((sum, t) => sum + getScoringTaskCount(t.slug), 0)
    );
    setEarnedBadgeIds(getEarnedBadgeIds());
    setCalendarHistory(getCalendarHistory());
  }, []);

  // Generate calendar for current and previous month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const generateMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const currentMonthDays = useMemo(
    () => generateMonthDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthDays = useMemo(
    () => generateMonthDays(prevMonthYear, prevMonth),
    [prevMonthYear, prevMonth]
  );

  const isDayPracticed = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarHistory.includes(dateStr);
  };

  const isToday = (year: number, month: number, day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  if (!mounted) return null;

  const { currentLevel, nextLevel, progressPercent } = levelData;

  return (
    <div className="min-h-dvh pb-8 bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--background)] px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-[var(--text)]" />
          </button>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Les meves estadístiques
          </h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              {currentLevel.emoji}
            </div>
            <div>
              <p className="text-purple-200 text-sm font-medium">Nivell {currentLevel.level}</p>
              <h2 className="text-2xl font-black">{currentLevel.name}</h2>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-200">XP Total</span>
              <span className="font-bold">{totalXP} XP</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            {nextLevel && (
              <p className="text-purple-200 text-xs text-right">
                {nextLevel.minXP - totalXP} XP per {nextLevel.name}
              </p>
            )}
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flame size={24} className="text-orange-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Ratxa actual</p>
            <p className="text-2xl font-black text-orange-600">{dailyStreak} dies</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Trophy size={24} className="text-red-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Millor ratxa</p>
            <p className="text-2xl font-black text-red-600">{longestStreak} dies</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">Estrelles</p>
            <p className="text-2xl font-black text-amber-600">
              {totalStars}
              <span className="text-sm font-semibold text-amber-400">
                /{totalPossibleStars}
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Snowflake size={24} className="text-cyan-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Congeladors</p>
            <p className="text-2xl font-black text-cyan-600">{freezes}</p>
          </motion.div>
        </div>

        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-purple-500" />
            <h3 className="font-bold text-[var(--text)]">Calendari de pràctica</h3>
          </div>

          {/* Current month */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600 mb-2 text-center">
              {today.toLocaleDateString("ca", { month: "long", year: "numeric" })}
            </p>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"].map((day) => (
                <div
                  key={day}
                  className="text-center text-gray-400 font-medium p-1"
                >
                  {day}
                </div>
              ))}
              {currentMonthDays.map((day, i) => (
                <div
                  key={i}
                  className={`text-center p-1.5 rounded-lg text-sm ${
                    day === null
                      ? ""
                      : isToday(currentYear, currentMonth, day)
                      ? "bg-purple-500 text-white font-bold ring-2 ring-purple-300"
                      : isDayPracticed(currentYear, currentMonth, day)
                      ? "bg-orange-400 text-white font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Previous month (smaller) */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 mb-2 text-center">
              {new Date(prevMonthYear, prevMonth).toLocaleDateString("ca", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="grid grid-cols-7 gap-0.5 text-[10px] opacity-75">
              {prevMonthDays.map((day, i) => (
                <div
                  key={i}
                  className={`text-center p-1 rounded ${
                    day === null
                      ? ""
                      : isDayPracticed(prevMonthYear, prevMonth, day)
                      ? "bg-orange-300 text-white"
                      : "text-gray-300"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-purple-500" />
            <h3 className="font-bold text-[var(--text)]">Progrés de nivells</h3>
          </div>

          <div className="space-y-2">
            {LEVELS.map((level) => {
              const isUnlocked = totalXP >= level.minXP;
              const isCurrent = level.level === currentLevel.level;
              return (
                <div
                  key={level.level}
                  className={`flex items-center gap-3 p-2 rounded-xl ${
                    isCurrent
                      ? "bg-purple-50 border border-purple-200"
                      : isUnlocked
                      ? "bg-gray-50"
                      : "opacity-50"
                  }`}
                >
                  <span className="text-xl">{level.emoji}</span>
                  <div className="flex-1">
                    <p
                      className={`font-semibold text-sm ${
                        isCurrent ? "text-purple-600" : "text-gray-700"
                      }`}
                    >
                      Nv.{level.level} {level.name}
                    </p>
                    <p className="text-xs text-gray-400">{level.minXP} XP</p>
                  </div>
                  {isUnlocked && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🏅</span>
            <h3 className="font-bold text-[var(--text)]">Insígnies</h3>
            <span className="text-sm text-gray-400">
              {earnedBadgeIds.size}/{allBadges.length}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {allBadges.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`text-center p-2 rounded-xl ${
                    isEarned ? "bg-amber-50" : "bg-gray-100 opacity-40"
                  }`}
                  title={badge.description}
                >
                  <span className={`text-2xl ${isEarned ? "" : "grayscale"}`}>
                    {badge.emoji}
                  </span>
                  <p className="text-[10px] font-medium text-gray-600 mt-1 truncate">
                    {badge.name}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-8 pb-4 text-center">
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
