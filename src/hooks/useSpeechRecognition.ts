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
  onResult?: (transcript: string) => void;
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

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { lang = "ca-ES", onResult, onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  // Use refs for callbacks to avoid re-creating recognition on every render
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  // Keep refs updated
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition() as SpeechRecognitionInterface;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang;
      recognition.maxAlternatives = 3;

      // Add onstart to confirm recording has actually started
      (recognition as any).onstart = () => {
        console.log("[Speech] Recording started");
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript;
        console.log("[Speech] Got result:", result);
        setTranscript(result);
        onResultRef.current?.(result);
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.log("[Speech] Error:", event.error);
        let errorMsg: string;
        switch (event.error) {
          case "no-speech":
            errorMsg = "No s'ha detectat cap veu. Torna a provar!";
            break;
          case "not-allowed":
            errorMsg = "Permís de micròfon denegat. Demana a un adult que permeti el micròfon.";
            break;
          case "audio-capture":
            errorMsg = "No s'ha trobat cap micròfon. Connecta un micròfon i torna a provar.";
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
      };

      recognition.onend = () => {
        console.log("[Speech] Recording ended");
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.log("[Speech] Not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [lang]); // Only re-create when language changes

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.log("[Speech] No recognition instance");
      return;
    }

    setError(null);
    setTranscript("");
    // Don't set isListening here - wait for onstart event
    console.log("[Speech] Starting...");

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log("[Speech] Start error:", e);
      // Already started or other error
      setError("Error iniciant el micròfon. Torna a provar.");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
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
