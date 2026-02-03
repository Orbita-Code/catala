"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Snowflake, Gift, Calendar } from "lucide-react";
import {
  getDailyStreak,
  getStreakFreezes,
  getCalendarHistory,
  updateDailyStreak,
  claimDailyReward,
} from "@/lib/progress";
import { addXP } from "@/lib/xp";
import { celebrate } from "@/lib/confetti";
import { playCorrect } from "@/lib/audio";

interface DailyRewardModalProps {
  onClose: () => void;
}

export default function DailyRewardModal({ onClose }: DailyRewardModalProps) {
  const [step, setStep] = useState<"streak" | "reward">("streak");
  const [streakResult, setStreakResult] = useState({
    newStreak: 0,
    streakBroken: false,
    freezeUsed: false,
    earnedFreeze: false,
  });
  const [freezes, setFreezes] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(0);

  // Get calendar data
  const calendarHistory = useMemo(() => getCalendarHistory(), []);
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  useEffect(() => {
    // Update streak on mount
    const result = updateDailyStreak();
    setStreakResult(result);
    setFreezes(getStreakFreezes());

    // Calculate daily reward XP (base 10 + streak bonus)
    const dailyBonus = 10 + Math.min(result.newStreak, 7) * 2;
    setXpAwarded(dailyBonus);
  }, []);

  const handleClaimReward = () => {
    claimDailyReward();
    addXP(xpAwarded);
    playCorrect();
    celebrate(["#fdcb6e", "#6c5ce7", "#00cece"]);
    onClose();
  };

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: (number | null)[] = [];

    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentMonth, currentYear]);

  const isDayPracticed = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarHistory.includes(dateStr);
  };

  const isToday = (day: number) => {
    return day === today.getDate();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>

          <AnimatePresence mode="wait">
            {step === "streak" ? (
              <motion.div
                key="streak"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-center"
              >
                {/* Streak header */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="mb-4"
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <Flame size={40} className="text-white" />
                  </div>

                  {streakResult.streakBroken ? (
                    <>
                      <h2 className="text-xl font-bold text-gray-700 mb-1">
                        Oh no! Ratxa trencada
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Però avui comences de nou!
                      </p>
                    </>
                  ) : streakResult.freezeUsed ? (
                    <>
                      <h2 className="text-xl font-bold text-cyan-600 mb-1">
                        Congelador utilitzat! <Snowflake size={20} className="inline" />
                      </h2>
                      <p className="text-gray-500 text-sm">
                        La teva ratxa s&apos;ha salvat!
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-orange-600 mb-1">
                        Hola de nou!
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Continua la teva ratxa!
                      </p>
                    </>
                  )}
                </motion.div>

                {/* Streak count */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 text-4xl font-black text-orange-500 mb-4"
                >
                  <Flame size={36} />
                  {streakResult.newStreak}
                  <span className="text-lg font-semibold text-gray-400">
                    {streakResult.newStreak === 1 ? "dia" : "dies"}
                  </span>
                </motion.div>

                {/* Streak freezes earned */}
                {streakResult.earnedFreeze && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-4 p-3 bg-cyan-50 rounded-xl border border-cyan-200"
                  >
                    <div className="flex items-center justify-center gap-2 text-cyan-600 font-bold">
                      <Snowflake size={20} />
                      +1 Congelador guanyat!
                    </div>
                    <p className="text-xs text-cyan-500 mt-1">
                      Ara tens {freezes} congelador{freezes !== 1 ? "s" : ""}
                    </p>
                  </motion.div>
                )}

                {/* Mini calendar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-50 rounded-xl p-3 mb-4"
                >
                  <div className="flex items-center justify-center gap-2 mb-2 text-sm font-semibold text-gray-600">
                    <Calendar size={16} />
                    {today.toLocaleDateString("ca", { month: "long", year: "numeric" })}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"].map((day) => (
                      <div key={day} className="text-center text-gray-400 font-medium p-1">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day, i) => (
                      <div
                        key={i}
                        className={`text-center p-1 rounded-lg ${
                          day === null
                            ? ""
                            : isToday(day)
                            ? "bg-purple-500 text-white font-bold"
                            : isDayPracticed(day)
                            ? "bg-orange-400 text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep("reward")}
                  className="w-full py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold rounded-2xl text-lg shadow-lg"
                >
                  Continua
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="reward"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                {/* Reward header */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="mb-4"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg"
                  >
                    <Gift size={40} className="text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-purple-600 mb-1">
                    Recompensa diària!
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Per tornar avui
                  </p>
                </motion.div>

                {/* XP reward */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-4xl font-black text-purple-600">+{xpAwarded}</span>
                    <span className="text-xl font-bold text-purple-400">XP</span>
                  </div>
                  {streakResult.newStreak > 1 && (
                    <p className="text-xs text-purple-500">
                      Inclou bonus de ratxa de {streakResult.newStreak} dies!
                    </p>
                  )}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClaimReward}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-2xl text-lg shadow-lg"
                >
                  Recull! 🎁
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
