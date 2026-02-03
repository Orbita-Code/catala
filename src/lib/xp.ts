"use client";

// XP rewards configuration
const BASE_TASK_XP = 10;
const PERFECT_BONUS = 5;         // No errors on task
const STREAK_MULTIPLIER = 0.1;   // +10% per streak task (max +50%)
const MAX_STREAK_BONUS = 0.5;    // Cap at 50% bonus
const DAILY_FIRST_BONUS = 20;    // First task of the day

const XP_STORAGE_KEY = "catala-xp";

export interface XPState {
  totalXP: number;
  dailyXP: number;
  lastXPDate: string;  // ISO date "2026-02-03"
  xpHistory: { date: string; amount: number }[];
}

function getDefaultXPState(): XPState {
  return {
    totalXP: 0,
    dailyXP: 0,
    lastXPDate: "",
    xpHistory: [],
  };
}

export function getXPState(): XPState {
  if (typeof window === "undefined") return getDefaultXPState();
  try {
    const data = localStorage.getItem(XP_STORAGE_KEY);
    if (!data) return getDefaultXPState();
    const state = JSON.parse(data) as XPState;

    // Reset daily XP if it's a new day
    const today = new Date().toISOString().split("T")[0];
    if (state.lastXPDate !== today) {
      state.dailyXP = 0;
      state.lastXPDate = today;
    }
    return state;
  } catch {
    return getDefaultXPState();
  }
}

function saveXPState(state: XPState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(state));
}

export function calculateTaskXP(
  allCorrect: boolean,
  streak: number,
  isFirstOfDay: boolean
): number {
  let xp = BASE_TASK_XP;

  // Perfect bonus for no errors
  if (allCorrect) {
    xp += PERFECT_BONUS;
  }

  // Streak multiplier (capped at 50%)
  const streakBonus = Math.min(streak * STREAK_MULTIPLIER, MAX_STREAK_BONUS);
  xp = Math.round(xp * (1 + streakBonus));

  // Daily first task bonus
  if (isFirstOfDay) {
    xp += DAILY_FIRST_BONUS;
  }

  return xp;
}

export function isFirstTaskOfDay(): boolean {
  const state = getXPState();
  const today = new Date().toISOString().split("T")[0];
  return state.lastXPDate !== today || state.dailyXP === 0;
}

export function addXP(amount: number): { totalXP: number; dailyXP: number; isLevelUp: boolean; previousLevel: number; newLevel: number } {
  const state = getXPState();
  const today = new Date().toISOString().split("T")[0];

  // Import level calculation (we'll use a simple lookup here to avoid circular imports)
  const getLevelForXP = (xp: number): number => {
    const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000];
    let level = 1;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (xp >= thresholds[i]) {
        level = i + 1;
        break;
      }
    }
    return Math.min(level, 12);
  };

  const previousLevel = getLevelForXP(state.totalXP);

  // Reset daily XP if new day
  if (state.lastXPDate !== today) {
    state.dailyXP = 0;
    state.lastXPDate = today;
  }

  state.totalXP += amount;
  state.dailyXP += amount;

  // Add to history
  const historyEntry = state.xpHistory.find((h) => h.date === today);
  if (historyEntry) {
    historyEntry.amount += amount;
  } else {
    state.xpHistory.push({ date: today, amount });
  }

  // Keep only last 30 days of history
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoff = thirtyDaysAgo.toISOString().split("T")[0];
  state.xpHistory = state.xpHistory.filter((h) => h.date >= cutoff);

  saveXPState(state);

  const newLevel = getLevelForXP(state.totalXP);

  return {
    totalXP: state.totalXP,
    dailyXP: state.dailyXP,
    isLevelUp: newLevel > previousLevel,
    previousLevel,
    newLevel,
  };
}

export function getTotalXP(): number {
  return getXPState().totalXP;
}

export function getXPToday(): number {
  return getXPState().dailyXP;
}

export function getXPHistory(): { date: string; amount: number }[] {
  return getXPState().xpHistory;
}
