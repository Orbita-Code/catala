"use client";

// Text-to-Speech for Catalan pronunciation using Web Speech API

import { getSettings, updateSettings } from "./settings";
import { SNIMLJENO } from "./audio-reci";

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

/* ─────────────────────────────────────────────────────────────────────────
   SNIMLJEN IZGOVOR — glas pripada IGRICI, ne uređaju (13.08.2026)

   Do sada je aplikacija molila RAČUNAR da izgovori reč, pa je glas zavisio od
   toga koje glasove uređaj ima: kod vlasnice katalonska Montse, kod deteta
   nijedan katalonski — pa španski, koji „estoig" čita slovo po slovo.

   Sada se prvo traži SNIMAK (glas Montse, napravljen jednom, putuje sa
   igricom). Ako ga za taj tekst nema — čita se glasom uređaja, kao i pre.
   Zato dodavanje nove reči ništa ne kvari; samo joj fali snimak dok se ne
   pusti `node scripts/snimi-izgovor.mjs`.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * MORA da se poklapa sa `zaIzgovor()` u `scripts/snimi-izgovor.mjs`, inače se
 * snimak ne pronađe i tiho se pređe na računarov glas.
 * Strelice (→ ← ↓ ↑ ↗) su uputstvo za oko, ne za uvo, pa se izbacuju; isto i
 * crta za prazninu. `\s` u JavaScriptu obuhvata i tvrdi razmak.
 */
function kljucTeksta(t: string): string {
  return t
    .replace(/[→←↓↑↗↘↙↖⇒⇐]/g, " ")
    // PRAZNINA SE UKLANJA ZAJEDNO SA TAČKOM IZA NJE (17.08.2026).
    //
    // Prijava vlasnice: „14. zadatak tekst zadatka čita neki čudan glas".
    // Merenjem se pokazalo da to nije bio naslov nego SVE REČENICE — i to u
    // celoj igrici, u svakom zadatku sa dopunjavanjem.
    //
    // Uzrok: u podacima rečenica glasi „Les portem als peus: ___.", a zvučnik
    // izgovara „Les portem als peus:" (praznina i tačka se sklone pre čitanja).
    // Ključ snimka se pravio od PRVOG oblika, pa je ispadao „les portem als
    // peus: ." — sa razmakom i tačkom na kraju. Traženje po drugom obliku ga
    // nije nalazilo i aplikacija je tiho prelazila na glas uređaja.
    // Jedan znak razlike, a čulo se kroz celu igru.
    // OD 24.08.2026: briše se praznina i SAMO TAČKA iza nje — tačno kako to
    // radi `FillSentence` (`text.replace(/\s*___\.?/, "")`). Upitnik ostaje.
    // Ranije se brisao i upitnik, pa „Què ___? — Per dinar…" nije nalazilo
    // svoj snimak i čitalo se glasom uređaja.
    .replace(/\s*_{2,}\.?/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

let tekuciSnimak: HTMLAudioElement | null = null;

/**
 * Podrazumevana brzina u postavkama je 0,8 i namenjena je RAČUNAROVOM glasu.
 * Snimci su već usporeni pri snimanju (tempo 0,85), pa bi im 0,8 oduzelo još
 * jednom. Zato se 0,8 preslikava u 1,0 — a klizač u Configuració i dalje radi:
 * pomeranje naviše ubrza snimak, naniže ga uspori.
 */
function brzinaSnimka(postavka: number): number {
  return Math.min(2, Math.max(0.5, postavka / 0.8));
}

/** Vraća `true` ako je tekst pušten iz snimka. */
function pustiSnimak(text: string): boolean {
  const kljuc = SNIMLJENO[kljucTeksta(text)];
  if (!kljuc) return false;
  try {
    if (tekuciSnimak) {
      tekuciSnimak.pause();
      tekuciSnimak = null;
    }
    const a = new Audio(`/audio/${kljuc}.m4a`);
    a.playbackRate = brzinaSnimka(getSettings().ttsSpeed);
    // Maskote pomeraju usta po istim događajima kao i kod računarovog glasa.
    a.onplay = () => postaviGovor(true);
    a.onended = () => postaviGovor(false);
    a.onerror = () => postaviGovor(false);
    tekuciSnimak = a;
    void a.play().catch(() => postaviGovor(false));
    return true;
  } catch {
    return false;
  }
}

export function speak(text: string, rate?: number) {
  if (typeof window === "undefined") return;
  migrateLegacy();
  if (!getSettings().ttsEnabled) return;

  // Prvo snimak — on zvuči isto na svakom uređaju.
  window.speechSynthesis?.cancel();
  if (pustiSnimak(text)) return;

  if (!isTTSAvailable()) return;

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
  // I snimak se mora zaustaviti — inače dete pređe na sledeći zadatak, a
  // prethodna reč nastavi da se izgovara preko nove.
  if (tekuciSnimak) {
    tekuciSnimak.pause();
    tekuciSnimak = null;
  }
  postaviGovor(false);
}

/**
 * Ima li ovaj tekst snimak glasom Montse?
 *
 * Koristi se pre nego što se nešto zapamti za vežbanje: u vežbu sme da uđe
 * samo ono što će se ČUTI PRAVIM GLASOM. Sve ostalo bi čitao glas uređaja, a
 * to je vlasnica prijavljivala više puta („tuđi glas").
 */
export function imaSnimak(text: string): boolean {
  return Boolean(SNIMLJENO[kljucTeksta(text)]);
}
