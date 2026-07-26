"use client";

// Text-to-Speech for Catalan pronunciation using Web Speech API

import { getSettings, updateSettings } from "./settings";

const LEGACY_TTS_KEY = "catala-tts-enabled";

function migrateLegacy() {
  try {
    const legacy = localStorage.getItem(LEGACY_TTS_KEY);
    if (legacy !== null && !localStorage.getItem("catala-settings")) {
      updateSettings({ ttsEnabled: legacy === "true" });
      localStorage.removeItem(LEGACY_TTS_KEY);
    }
  } catch {}
}

export function initTTS() {
  if (typeof window === "undefined") return;
  migrateLegacy();
}

export function isTTSEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return getSettings().ttsEnabled;
}

export function setTTSEnabled(value: boolean) {
  try {
    updateSettings({ ttsEnabled: value });
  } catch {}
}

export function isTTSAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, rate?: number) {
  if (typeof window === "undefined") return;
  migrateLegacy();
  if (!getSettings().ttsEnabled || !isTTSAvailable()) return;

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  // Explicit rate wins; otherwise the speed from Configuració applies
  utterance.rate = rate ?? getSettings().ttsSpeed;
  utterance.pitch = 1.1; // Slightly higher for child-friendly tone

  // Try Catalan, fall back to generic Catalan, then Spanish
  const voices = window.speechSynthesis.getVoices();
  const catalanVoice = voices.find((v) => v.lang === "ca-ES")
    || voices.find((v) => v.lang.startsWith("ca"))
    || voices.find((v) => v.lang === "es-ES")
    || voices.find((v) => v.lang.startsWith("es"));

  if (catalanVoice) {
    utterance.voice = catalanVoice;
    utterance.lang = catalanVoice.lang;
  } else {
    utterance.lang = "ca-ES";
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isTTSAvailable()) {
    window.speechSynthesis.cancel();
  }
}
