"use client";

import { safeSetJSON, safeRemove } from "./storage";

export interface AppSettings {
  soundEnabled: boolean;
  ttsEnabled: boolean;
  autoRead: boolean;
  ttsSpeed: number; // 0.5 - 1.5
}

const SETTINGS_KEY = "catala-settings";

const defaults: AppSettings = {
  soundEnabled: true,
  ttsEnabled: true,
  autoRead: false,
  ttsSpeed: 0.8,
};

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return defaults;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...defaults, ...JSON.parse(data) } : defaults;
  } catch {
    return defaults;
  }
}

export function updateSettings(update: Partial<AppSettings>) {
  const current = getSettings();
  const next = { ...current, ...update };
  safeSetJSON(SETTINGS_KEY, next);
  return next;
}

export function resetSettings(): AppSettings {
  safeRemove(SETTINGS_KEY);
  return defaults;
}

export function resetAllProgress() {
  // Remove every catala-* key so a "full reset" really is full
  // (progress, xp, streaks, errors, drawings, settings, mute flags...).
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("catala-"));
    for (const k of keys) localStorage.removeItem(k);
  } catch {}
}
