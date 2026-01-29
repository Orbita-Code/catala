"use client";

import { UserProgress } from "@/types/tasks";

const STORAGE_KEY = "catala-progress";

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

export function completeTask(slug: string, taskId: string, correct: boolean) {
  const current = getThemeProgress(slug);
  const completedTasks = current.completedTasks.includes(taskId)
    ? current.completedTasks
    : [...current.completedTasks, taskId];
  const streak = correct ? current.streak + 1 : 0;
  const bestStreak = Math.max(streak, current.bestStreak);
  const stars = completedTasks.length;

  saveThemeProgress(slug, {
    currentTask: current.currentTask + 1,
    completedTasks,
    streak,
    bestStreak,
    stars,
  });

  return { streak, bestStreak, stars, completedTasks };
}
