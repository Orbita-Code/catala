"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface UseSpeechRecognitionOptions {
  lang?: string;
  onResult?: (transcript: string, alternatives?: string[]) => void;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  error: string | null;
}

// Normalize text for comparison (remove accents, lowercase, trim)
export function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " "); // Normalize spaces
}

// Check if two words match (fuzzy comparison for speech recognition)
export function wordsMatch(spoken: string, expected: string): boolean {
  const normalSpoken = normalizeForComparison(spoken);
  const normalExpected = normalizeForComparison(expected);

  // Exact match
  if (normalSpoken === normalExpected) return true;

  // Check if spoken contains expected (child might say extra words)
  if (normalSpoken.includes(normalExpected)) return true;

  // Check if expected contains spoken (partial match)
  if (normalExpected.includes(normalSpoken) && normalSpoken.length > 2) return true;

  // Levenshtein distance for typo tolerance (allow 1-2 character differences)
  const distance = levenshteinDistance(normalSpoken, normalExpected);
  const maxAllowedDistance = Math.max(1, Math.floor(normalExpected.length * 0.25));
  if (distance <= maxAllowedDistance) return true;

  return false;
}

// Simple Levenshtein distance implementation
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function getSpeechRecognitionClass(): (new () => SpeechRecognitionInterface) | null {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { lang = "ca-ES", onResult, onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(() => getSpeechRecognitionClass() !== null);

  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gotResultRef = useRef(false);
  const didStartRef = useRef(false);
  // Use refs for callbacks to avoid stale closures
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const langRef = useRef(lang);

  // Keep refs updated
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
    langRef.current = lang;
  }, [onResult, onError, lang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognitionClass();
    if (!SpeechRecognition) {
      console.log("[Speech] Not supported");
      return;
    }

    // Abort any existing instance first
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Cancel any ongoing TTS — it can block mic input on tablets
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setError(null);
    setTranscript("");
    gotResultRef.current = false;
    didStartRef.current = false;
    console.log("[Speech] Creating fresh instance...");

    // Create a fresh instance each time to avoid stale state on iOS/tablets
    const recognition = new SpeechRecognition() as SpeechRecognitionInterface;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = langRef.current;
    recognition.maxAlternatives = 5;

    (recognition as any).onstart = () => {
      didStartRef.current = true;
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      console.log("[Speech] Recording started");
      setIsListening(true);

      // Safety timeout: if no result within 8 seconds, stop and show error
      timeoutRef.current = setTimeout(() => {
        console.log("[Speech] Timeout - no result received");
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch {}
          recognitionRef.current = null;
        }
        if (!gotResultRef.current) {
          const msg = "No s'ha detectat cap veu. Torna a provar!";
          setError(msg);
          onErrorRef.current?.(msg);
        }
        setIsListening(false);
      }, 8000);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      gotResultRef.current = true;

      // Check all alternatives, not just the first one
      const allTranscripts: string[] = [];
      for (let i = 0; i < event.results[0].length; i++) {
        allTranscripts.push(event.results[0][i].transcript);
      }
      const bestTranscript = allTranscripts[0];
      console.log("[Speech] Got results:", allTranscripts);

      setTranscript(bestTranscript);
      // Pass all alternatives so the caller can check each one
      onResultRef.current?.(bestTranscript, allTranscripts);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      console.log("[Speech] Error:", event.error);

      // Permanent errors: mic not available or permission denied — switch to fallback immediately
      if (event.error === "not-allowed" || event.error === "audio-capture") {
        console.log("[Speech] Permanent error, switching to fallback");
        setIsListening(false);
        setIsSupported(false);
        recognitionRef.current = null;
        return;
      }

      let errorMsg: string;
      switch (event.error) {
        case "no-speech":
          errorMsg = "No s'ha detectat cap veu. Torna a provar!";
          break;
        case "network":
          errorMsg = "Error de xarxa. Comprova la connexió a internet.";
          break;
        case "aborted":
          errorMsg = ""; // Don't show error for user-initiated abort
          break;
        default:
          errorMsg = `Error del micròfon: ${event.error}`;
      }
      if (errorMsg) {
        setError(errorMsg);
        onErrorRef.current?.(errorMsg);
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      console.log("[Speech] Recording ended, didStart:", didStartRef.current, "gotResult:", gotResultRef.current);
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // If onend fires but onstart never did, the API is broken (iPad Safari)
      if (!didStartRef.current) {
        console.log("[Speech] API broken — onend fired without onstart, switching to fallback");
        setIsListening(false);
        setIsSupported(false);
        recognitionRef.current = null;
        return;
      }
      // If ended without a result or error, show feedback
      if (!gotResultRef.current && recognitionRef.current) {
        const msg = "No s'ha detectat cap veu. Torna a provar!";
        setError(msg);
        onErrorRef.current?.(msg);
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();

      // Detect broken Speech API (e.g. iPad Safari): class exists but start() silently fails.
      // If onstart is not called within 3 seconds, mark as unsupported and switch to fallback.
      startTimeoutRef.current = setTimeout(() => {
        if (!didStartRef.current) {
          console.log("[Speech] API broken — onstart never fired, switching to fallback");
          try { recognition.abort(); } catch {}
          recognitionRef.current = null;
          setIsListening(false);
          setIsSupported(false);
        }
      }, 3000);
    } catch (e) {
      console.log("[Speech] Start error:", e);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      setError("Error iniciant el micròfon. Torna a provar.");
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch {}
    setIsListening(false);
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    error,
  };
}
