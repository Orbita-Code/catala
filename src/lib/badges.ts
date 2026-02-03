"use client";

import { getProgress } from "./progress";
import { themes } from "@/data/themes";
import { getScoringTaskCount } from "@/data/task-data";

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: "theme" | "streak" | "star" | "special";
  slug?: string;
}

// 12 theme badges + streak + star collection badges
export const allBadges: Badge[] = [
  // Theme completion badges
  ...themes.map((t) => ({
    id: `theme-${t.slug}`,
    name: t.name,
    description: `Completa el tema "${t.name}"`,
    emoji: t.icon,
    category: "theme" as const,
    slug: t.slug,
  })),
  // Streak badges
  { id: "streak-3", name: "Ratxa de 3", description: "Aconsegueix una ratxa de 3", emoji: "🔥", category: "streak" },
  { id: "streak-5", name: "Ratxa de 5", description: "Aconsegueix una ratxa de 5", emoji: "🔥🔥", category: "streak" },
  { id: "streak-10", name: "Ratxa de 10", description: "Aconsegueix una ratxa de 10", emoji: "💥", category: "streak" },
  // Star collection badges
  { id: "stars-10", name: "10 estrelles", description: "Aconsegueix 10 estrelles", emoji: "⭐", category: "star" },
  { id: "stars-50", name: "50 estrelles", description: "Aconsegueix 50 estrelles", emoji: "🌟", category: "star" },
  { id: "stars-all", name: "Totes!", description: "Aconsegueix totes les estrelles", emoji: "🏆", category: "star" },
  // Special
  { id: "all-themes", name: "Mestre del Català", description: "Completa tots els 12 temes", emoji: "👑", category: "special" },
];

export function getEarnedBadgeIds(): Set<string> {
  const progress = getProgress();
  const earned = new Set<string>();

  let totalStars = 0;
  let maxStreak = 0;
  let completedThemes = 0;

  themes.forEach((theme) => {
    const tp = progress[theme.slug];
    if (!tp) return;

    totalStars += tp.completedTasks?.length || 0;
    maxStreak = Math.max(maxStreak, tp.bestStreak || 0);

    if ((tp.completedTasks?.length || 0) >= getScoringTaskCount(theme.slug)) {
      earned.add(`theme-${theme.slug}`);
      completedThemes++;
    }
  });

  if (maxStreak >= 3) earned.add("streak-3");
  if (maxStreak >= 5) earned.add("streak-5");
  if (maxStreak >= 10) earned.add("streak-10");
  if (totalStars >= 10) earned.add("stars-10");
  if (totalStars >= 50) earned.add("stars-50");
  const totalPossibleStars = themes.reduce((sum, t) => sum + getScoringTaskCount(t.slug), 0);
  if (totalStars >= totalPossibleStars) earned.add("stars-all");
  if (completedThemes >= 12) earned.add("all-themes");

  return earned;
}

export function getTotalStars(): number {
  const progress = getProgress();
  let total = 0;
  themes.forEach((theme) => {
    total += progress[theme.slug]?.completedTasks?.length || 0;
  });
  return total;
}
