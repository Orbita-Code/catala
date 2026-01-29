"use client";

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
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}

export function resetSettings(): AppSettings {
  localStorage.removeItem(SETTINGS_KEY);
  return defaults;
}

export function resetAllProgress() {
  localStorage.removeItem("catala-progress");
  localStorage.removeItem("catala-settings");
  localStorage.removeItem("catala-muted");
  localStorage.removeItem("catala-tts-enabled");
}
