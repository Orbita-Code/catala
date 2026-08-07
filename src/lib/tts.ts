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

/* ─────────────────────────────────────────────────────────────────────────
   KO GOVORI, TOME SE POMERAJU USTA

   Maskote treba da otvaraju usta dok aplikacija izgovara reč. Da bi to znale,
   `speak()` javlja kad govor počne i kad se završi. Pretplata je namerno
   ovakva (uzmi vrednost / pretplati se) jer je to oblik koji React očekuje u
   `useSyncExternalStore` — bez dodatnog `useEffect`-a i bez treperenja.
   ───────────────────────────────────────────────────────────────────────── */
let govoriSada = false;
const pretplatnici = new Set<() => void>();

function postaviGovor(vrednost: boolean) {
  if (govoriSada === vrednost) return;
  govoriSada = vrednost;
  pretplatnici.forEach((f) => f());
}

/** Da li se u ovom trenutku nešto izgovara (za pokret usta na maskoti) */
export function daLiGovori(): boolean {
  return govoriSada;
}

export function pretplatiSeNaGovor(naPromenu: () => void): () => void {
  pretplatnici.add(naPromenu);
  return () => pretplatnici.delete(naPromenu);
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

  // Maskote slušaju ova tri događaja i po njima pomeraju usta.
  // `onerror` je obavezan: bez njega bi usta ostala otvorena zauvek ako se
  // govor prekine (dete pređe na drugi zadatak usred izgovaranja).
  utterance.onstart = () => postaviGovor(true);
  utterance.onend = () => postaviGovor(false);
  utterance.onerror = () => postaviGovor(false);

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isTTSAvailable()) {
    window.speechSynthesis.cancel();
  }
  postaviGovor(false);
}
