"use client";

import { UserProgress, TaskResult } from "@/types/tasks";

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
