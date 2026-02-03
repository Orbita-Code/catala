"use client";

import type { UserProgress, TaskResult } from "@/types/tasks";

const STORAGE_KEY = "catala-progress";
const STREAK_STORAGE_KEY = "catala-daily-streak";

// Daily streak state - separate from theme progress
export interface DailyStreakState {
  dailyStreak: number;
  longestStreak: number;
  lastPracticeDate: string;  // ISO date "2026-02-03"
  streakFreezes: number;     // Earned streak freezes (max 2)
  calendarHistory: string[]; // Array of practice dates
  dailyRewardClaimed: boolean;
  lastDailyRewardDate: string;
}

function getDefaultStreakState(): DailyStreakState {
  return {
    dailyStreak: 0,
    longestStreak: 0,
    lastPracticeDate: "",
    streakFreezes: 0,
    calendarHistory: [],
    dailyRewardClaimed: false,
    lastDailyRewardDate: "",
  };
}

export function getDailyStreakState(): DailyStreakState {
  if (typeof window === "undefined") return getDefaultStreakState();
  try {
    const data = localStorage.getItem(STREAK_STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultStreakState();
  } catch {
    return getDefaultStreakState();
  }
}

function saveDailyStreakState(state: DailyStreakState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(state));
}

function getDateDiffDays(date1: string, date2: string): number {
  if (!date1 || !date2) return -1;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function updateDailyStreak(): {
  newStreak: number;
  streakBroken: boolean;
  freezeUsed: boolean;
  earnedFreeze: boolean;
} {
  const state = getDailyStreakState();
  const today = new Date().toISOString().split("T")[0];

  // Already practiced today - no update needed
  if (state.lastPracticeDate === today) {
    return {
      newStreak: state.dailyStreak,
      streakBroken: false,
      freezeUsed: false,
      earnedFreeze: false,
    };
  }

  const daysSinceLastPractice = getDateDiffDays(state.lastPracticeDate, today);

  let newStreak = state.dailyStreak;
  let streakBroken = false;
  let freezeUsed = false;
  let earnedFreeze = false;

  if (daysSinceLastPractice === 1) {
    // Practiced yesterday - increment streak
    newStreak = state.dailyStreak + 1;
  } else if (daysSinceLastPractice === 2 && state.streakFreezes > 0) {
    // Missed exactly one day but have a freeze - use it
    newStreak = state.dailyStreak + 1;
    state.streakFreezes -= 1;
    freezeUsed = true;
  } else if (daysSinceLastPractice > 1) {
    // Streak broken
    newStreak = 1;
    streakBroken = state.dailyStreak > 0;
  } else {
    // First time or same day
    newStreak = Math.max(1, state.dailyStreak);
  }

  // Award streak freeze every 7 consecutive days (max 2)
  if (newStreak > 0 && newStreak % 7 === 0 && state.streakFreezes < 2) {
    state.streakFreezes += 1;
    earnedFreeze = true;
  }

  state.dailyStreak = newStreak;
  state.longestStreak = Math.max(newStreak, state.longestStreak);
  state.lastPracticeDate = today;

  // Add to calendar history
  if (!state.calendarHistory.includes(today)) {
    state.calendarHistory.push(today);
    // Keep only last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const cutoff = ninetyDaysAgo.toISOString().split("T")[0];
    state.calendarHistory = state.calendarHistory.filter((d) => d >= cutoff);
  }

  saveDailyStreakState(state);

  return { newStreak, streakBroken, freezeUsed, earnedFreeze };
}

export function hasPracticedToday(): boolean {
  const state = getDailyStreakState();
  const today = new Date().toISOString().split("T")[0];
  return state.lastPracticeDate === today;
}

export function getCalendarHistory(): string[] {
  return getDailyStreakState().calendarHistory;
}

export function getDailyStreak(): number {
  return getDailyStreakState().dailyStreak;
}

export function getLongestStreak(): number {
  return getDailyStreakState().longestStreak;
}

export function getStreakFreezes(): number {
  return getDailyStreakState().streakFreezes;
}

export function shouldShowDailyReward(): boolean {
  const state = getDailyStreakState();
  const today = new Date().toISOString().split("T")[0];
  return state.lastDailyRewardDate !== today;
}

export function claimDailyReward(): void {
  const state = getDailyStreakState();
  const today = new Date().toISOString().split("T")[0];
  state.dailyRewardClaimed = true;
  state.lastDailyRewardDate = today;
  saveDailyStreakState(state);
}

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getThemeProgress(slug: string) {
  const progress = getProgress();
  return (
    progress[slug] || {
      currentTask: 0,
      completedTasks: [],
      streak: 0,
      bestStreak: 0,
      stars: 0,
      taskErrors: {},
    }
  );
}

export function saveThemeProgress(
  slug: string,
  update: Partial<UserProgress[string]>
) {
  const progress = getProgress();
  const current = getThemeProgress(slug);
  progress[slug] = { ...current, ...update };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function completeTask(
  slug: string,
  taskId: string,
  result: TaskResult,
  nextTaskIndex?: number,
  isBonus?: boolean
) {
  const current = getThemeProgress(slug);
  const completedTasks = current.completedTasks.includes(taskId)
    ? current.completedTasks
    : [...current.completedTasks, taskId];

  // Bonus tasks don't affect streak or stars
  const streak = isBonus ? current.streak : (result.allCorrect ? current.streak + 1 : 0);
  const bestStreak = Math.max(streak, current.bestStreak);
  const stars = isBonus ? current.stars : completedTasks.length;

  // Track errors per task
  const taskErrors = { ...(current.taskErrors || {}) };
  if (result.erroredItems.length > 0) {
    taskErrors[taskId] = result.erroredItems;
  } else {
    delete taskErrors[taskId];
  }

  // Use the actual next task index if provided, otherwise increment from stored value
  const newCurrentTask = nextTaskIndex !== undefined
    ? nextTaskIndex
    : current.currentTask + 1;

  saveThemeProgress(slug, {
    currentTask: newCurrentTask,
    completedTasks,
    streak,
    bestStreak,
    stars,
    taskErrors,
  });

  return { streak, bestStreak, stars, completedTasks, hasErrors: Object.keys(taskErrors).length > 0 };
}

export function isThemeFullyComplete(slug: string, totalTasks: number): boolean {
  const progress = getThemeProgress(slug);
  return (
    progress.completedTasks.length >= totalTasks &&
    Object.keys(progress.taskErrors || {}).length === 0
  );
}

export function getThemeErrors(slug: string): Record<string, string[]> {
  const progress = getThemeProgress(slug);
  return progress.taskErrors || {};
}
