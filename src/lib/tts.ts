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

/* ─────────────────────────────────────────────────────────────────────────
   KOJI GLAS ČITA REČI (13.08.2026)

   Prijava vlasnice: „zašto se čuje mašinski muški glas".
   Uzrok: kad na uređaju NEMA katalonskog glasa, uzimao se PRVI španski sa
   spiska. Na Mac-u je to „Eddy" — muški i namerno izobličen „izražajni" glas.
   Dete uči izgovor po tome što čuje, pa glas nije ukras nego deo gradiva.

   Redosled biranja:
     1. katalonski (`ca`) — jedini koji izgovara ispravno; na Mac-u je Montse
     2. španski, ali BEZ šaljivih glasova i uz prednost ženskom
     3. bilo koji španski

   Šaljivi glasovi se prepoznaju po IMENU jer ih Web Speech nikako drugačije
   ne označava — nema ni oznaku pola ni oznaku kvaliteta.
   ───────────────────────────────────────────────────────────────────────── */

/** Glasovi koje macOS nudi kao „izražajne", a zvuče izobličeno — nikad se ne biraju. */
const SALJIVI = [
  "eddy", "flo", "grandma", "grandpa", "rocko", "sandy", "shelley", "reed",
  "bells", "boing", "bubbles", "jester", "organ", "superstar", "trinoids",
  "whisper", "wobble", "zarvox", "albert", "bad news", "good news", "cellos",
];

/** Pitomi ženski španski glasovi — koriste se kad katalonskog nema. */
const ZENSKI_SPANSKI = ["mónica", "monica", "paulina", "marisol", "esperanza", "sabina"];

function saljiv(v: SpeechSynthesisVoice): boolean {
  const ime = v.name.toLowerCase();
  return SALJIVI.some((s) => ime.includes(s));
}

function izaberiGlas(): SpeechSynthesisVoice | undefined {
  const svi = window.speechSynthesis.getVoices();
  if (!svi.length) return undefined;
  const pitomi = svi.filter((v) => !saljiv(v));

  const katalonski = pitomi.filter((v) => v.lang.toLowerCase().startsWith("ca"));
  if (katalonski.length) return katalonski[0];

  const spanski = pitomi.filter((v) => v.lang.toLowerCase().startsWith("es"));
  const zenski = spanski.find((v) =>
    ZENSKI_SPANSKI.some((z) => v.name.toLowerCase().includes(z))
  );
  return zenski || spanski[0] || svi.find((v) => v.lang.toLowerCase().startsWith("es"));
}

/** Da li uređaj uopšte ima katalonski glas — za poruku u Configuració. */
export function imaKatalonskiGlas(): boolean {
  if (!isTTSAvailable()) return false;
  return window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith("ca"));
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
  const catalanVoice = izaberiGlas();

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
