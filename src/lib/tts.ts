"use client";

// Text-to-Speech for Catalan pronunciation using Web Speech API

let ttsEnabled = true;
const TTS_STORAGE_KEY = "catala-tts-enabled";

export function initTTS() {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem(TTS_STORAGE_KEY);
    if (saved !== null) ttsEnabled = saved === "true";
  } catch {}
}

export function isTTSEnabled(): boolean {
  return ttsEnabled;
}

export function setTTSEnabled(value: boolean) {
  ttsEnabled = value;
  try {
    localStorage.setItem(TTS_STORAGE_KEY, String(value));
  } catch {}
}

export function isTTSAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, rate: number = 0.8) {
  if (!ttsEnabled || !isTTSAvailable()) return;

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
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
