"use client";

import { getTotalXP } from "./xp";

export interface Level {
  level: number;
  name: string;
  emoji: string;
  image: string;
  minXP: number;
}

// Catalan level names for kids - fun and encouraging progression
export const LEVELS: Level[] = [
  { level: 1, name: "Pollet", emoji: "🐣", image: "/levels/estrella-1.png", minXP: 0 },
  { level: 2, name: "Estudiant", emoji: "📚", image: "/levels/estrella-2.png", minXP: 100 },
  { level: 3, name: "Aprenent", emoji: "✏️", image: "/levels/estrella-3.png", minXP: 300 },
  { level: 4, name: "Explorador", emoji: "🔍", image: "/levels/estrella-4.png", minXP: 600 },
  { level: 5, name: "Aventurer", emoji: "🎒", image: "/levels/estrella-5.png", minXP: 1000 },
  { level: 6, name: "Descobridor", emoji: "🧭", image: "/levels/estrella-6.png", minXP: 1500 },
  { level: 7, name: "Expert", emoji: "🎯", image: "/levels/estrella-7.png", minXP: 2200 },
  { level: 8, name: "Mestre", emoji: "🎓", image: "/levels/estrella-8.png", minXP: 3000 },
  { level: 9, name: "Campió", emoji: "🏆", image: "/levels/estrella-9.png", minXP: 4000 },
  { level: 10, name: "Llegenda", emoji: "👑", image: "/levels/estrella-10.png", minXP: 5500 },
  { level: 11, name: "Heroi", emoji: "⚡", image: "/levels/estrella-11.png", minXP: 7500 },
  { level: 12, name: "Superestrella", emoji: "🌟", image: "/levels/estrella-12.png", minXP: 10000 },
];

export function getLevelForXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getCurrentLevel(): Level {
  const totalXP = getTotalXP();
  return getLevelForXP(totalXP);
}

export function getNextLevel(): Level | null {
  const current = getCurrentLevel();
  const nextIndex = LEVELS.findIndex((l) => l.level === current.level) + 1;
  if (nextIndex >= LEVELS.length) return null;
  return LEVELS[nextIndex];
}

export function getLevelProgress(): {
  currentLevel: Level;
  nextLevel: Level | null;
  currentXP: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
  progressPercent: number;
} {
  const currentXP = getTotalXP();
  const currentLevel = getLevelForXP(currentXP);
  const currentIndex = LEVELS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  const xpInCurrentLevel = currentXP - currentLevel.minXP;
  const xpNeededForNext = nextLevel ? nextLevel.minXP - currentLevel.minXP : 0;
  const progressPercent = nextLevel
    ? Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100))
    : 100;

  return {
    currentLevel,
    nextLevel,
    currentXP,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercent,
  };
}

export function getLevelByNumber(level: number): Level | undefined {
  return LEVELS.find((l) => l.level === level);
}
