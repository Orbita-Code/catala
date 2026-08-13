"use client";

import { useState, useRef, useEffect, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { SelfAssessmentTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { speak } from "@/lib/tts";
import { Mic, MicOff, RefreshCcw } from "lucide-react";
import { useSpeechRecognition, wordsMatch } from "@/hooks/useSpeechRecognition";
import { celebrate, celebrateBig } from "@/lib/confetti";

interface Props {
  task: SelfAssessmentTask;
  onComplete: (result: TaskResult) => void;
}

export default function SelfAssessment({ task, onComplete }: Props) {
  const [results, setResults] = useState<Record<number, "correct" | "wrong" | "retry">>({});
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [forceFallback, setForceFallback] = useState(false);
  /** Kod greške koji je javio pregledač — jedini trag zašto mikrofon ne radi. */
  const [razlog, setRazlog] = useState<string | null>(null);
  const micEverStartedRef = useRef(false);
  /** Tajmer koji hvata "kliknuo sam, a ništa se ne dešava" (v. handleMicClick). */
  const cekanjeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isListening, isSupported, startListening } = useSpeechRecognition({
    lang: "ca-ES",
    onError: (kod) => {
      setRazlog(kod || null);
      setActiveIdx(null);
      // Only auto-fallback if mic NEVER started (broken API / iPad Safari).
      // If mic started before (laptop), just reset — user can tap mic again.
      if (!micEverStartedRef.current) {
        setForceFallback(true);
      }
    },
    onResult: (transcript, alternatives) => {
      if (activeIdx === null) return;

      const item = task.items[activeIdx];
      // Check best transcript and all alternatives for a match
      const allTranscripts = alternatives || [transcript];
      const isCorrect = allTranscripts.some((t) => wordsMatch(t, item.catalan));

      if (isCorrect) {
        setResults((prev) => ({ ...prev, [activeIdx]: "correct" }));
        celebrate();

        // Check if all done
        const newResults = { ...results, [activeIdx]: "correct" as const };
        const correctCount = Object.values(newResults).filter((r) => r === "correct").length;
        if (correctCount === task.items.length) {
          celebrateBig();
          setTimeout(() => {
            onComplete({ allCorrect: true, erroredItems: [] });
          }, 1200);
        }
      } else {
        setResults((prev) => ({ ...prev, [activeIdx]: "retry" }));
      }
      setActiveIdx(null);
    },
  });

  // Track if the mic ever successfully started (onstart fired → isListening became true)
  useEffect(() => {
    if (isListening) micEverStartedRef.current = true;
  }, [isListening]);

  const handleMicClick = (idx: number) => {
    if (results[idx] === "correct") return; // Already done
    setActiveIdx(idx);
    startListening();

    // AKO POSLE KLIKA NIŠTA NE KRENE — prebaci se sam.
    // Kad je dozvola za mikrofon odbijena ili ga drži drugi program, pregledač
    // ume da ne javi ni grešku ni početak slušanja: dugme izgleda mrtvo i dete
    // ne zna šta da radi. Zato se posle 4 s bez ijednog znaka života prelazi u
    // režim bez mikrofona. Tajmer poništava svaki znak da mikrofon radi.
    if (cekanjeRef.current) clearTimeout(cekanjeRef.current);
    cekanjeRef.current = setTimeout(() => {
      if (!micEverStartedRef.current) setForceFallback(true);
    }, 4000);
  };

  const handleSkip = (idx: number) => {
    setResults((prev) => ({ ...prev, [idx]: "wrong" }));
    speak(task.items[idx].catalan); // Speak the correct answer when skipped
  };

  const correctCount = Object.values(results).filter((r) => r === "correct").length;
  const allDone = correctCount === task.items.length;

  // Fallback for browsers without speech recognition or when mic doesn't work
  if (!isSupported || forceFallback) {
    return <FallbackSelfAssessment task={task} onComplete={onComplete} showWarning={!isSupported} razlog={razlog} />;
  }

  return (
    <div className="space-y-4">
      {/* IZLAZ KAD MIKROFON NE RADI (14.08.2026, prijava vlasnice: „na njenom
          laptopu ne radi mikrofon, uopšte nije klikabilan").
          Ovaj izlaz je POSTOJAO i ranije, ali kao siva podvučena rečenica koju
          ni odrasla osoba nije primetila — a kamoli dete. Zato je sada dugme sa
          okvirom, ikonicom precrtanog mikrofona i punom dodirnom metom od 44 px. */}
      <div className="flex justify-center">
        <button
          onClick={() => setForceFallback(true)}
          className="flex items-center gap-2 px-4 min-h-[44px] rounded-full border-2 border-gray-200 bg-white text-sm font-bold text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
        >
          <MicOff className="w-4 h-4" />
          El micròfon no funciona
        </button>
      </div>

      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {correctCount} / {task.items.length} paraules
      </div>

      {/* Grid of cards - full width */}
      <div
        className="task-cards"
        style={{ "--card-min": "150px", "--card-max": "230px", "--card-gap": "0.75rem" } as CSSProperties}
      >
        {task.items.map((item, idx) => {
          const status = results[idx];
          const isRecording = activeIdx === idx && isListening;
          const illustration = getWordIllustration(item.catalan);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`bg-white rounded-xl p-3 shadow-sm border-3 transition-all flex flex-col items-center ${
                status === "correct"
                  ? "border-green-500 bg-green-50"
                  : status === "retry"
                    ? "border-orange-400 bg-orange-50"
                    : status === "wrong"
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
              }`}
            >
              {/* Image - top (larger) */}
              <div className="mb-2">
                {illustration ? (
                  <img
                    src={illustration}
                    alt=""
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                    ❓
                  </div>
                )}
              </div>

              {/* Bottom - microphone and status */}
              <div className="flex flex-col items-center gap-1.5">
                {status === "correct" ? (
                  /* Correct - show checkmark */
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                  >
                    ✅
                  </motion.div>
                ) : status === "wrong" ? (
                  /* Wrong - show X */
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xl text-red-500 font-bold"
                  >
                    ✗
                  </motion.div>
                ) : (
                  /* Microphone button (smaller) */
                  <>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMicClick(idx)}
                      disabled={isListening && activeIdx !== idx}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isRecording
                          ? "bg-red-500 animate-pulse shadow-lg shadow-red-300"
                          : "bg-[var(--primary)] hover:bg-[var(--secondary)]"
                      } text-white disabled:opacity-50`}
                    >
                      <Mic className={`w-5 h-5 ${isRecording ? "animate-bounce" : ""}`} />
                    </motion.button>

                    {/* Recording indicator text */}
                    {isRecording && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 font-bold"
                      >
                        🎤 Escoltant...
                      </motion.span>
                    )}

                    {/* Retry indicator or skip button */}
                    {status === "retry" ? (
                      <div className="flex items-center gap-1">
                        <RefreshCcw className="w-4 h-4 text-orange-500" />
                        <button
                          onClick={() => handleSkip(idx)}
                          className="text-xs text-gray-500 underline"
                        >
                          Passa
                        </button>
                      </div>
                    ) : !isRecording && (
                      <button
                        onClick={() => handleSkip(idx)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        No ho sé
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Complete button when all done */}
      {allDone && (
        <div className="task-action-bar">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onComplete({ allCorrect: true, erroredItems: [] });
            }}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Molt bé! Continua! 🎉
          </motion.button>
        </div>
      )}
    </div>
  );
}

// Fallback when speech recognition not supported or mic failed
/**
 * ZAŠTO MIKROFON NE RADI — prevod koda greške u rečenicu koja kaže ŠTA URADITI.
 *
 * Pregledač uvek javi razlog, ali je do 14.08.2026. završavao samo u skrivenoj
 * konzoli. Zato se nije znalo zašto mikrofon ne radi na detetovom laptopu, pa se
 * umesto popravke nudio zaobilazni put (samoprocena), gde dete može i da slaže
 * da zna reč. Sada razlog piše na ekranu.
 */
const RAZLOZI: Record<string, { sta: string; kako: string }> = {
  "not-allowed": {
    sta: "El navegador no té permís per fer servir el micròfon.",
    kako: "Clica el cadenat a la barra d'adreces → Micròfon → Permet. Al Mac també: Configuració del sistema → Privadesa i seguretat → Micròfon → activa el navegador.",
  },
  "service-not-allowed": {
    sta: "Aquest navegador no permet el reconeixement de veu.",
    kako: "Obre el joc amb Google Chrome. El Safari sovint no ho permet.",
  },
  "audio-capture": {
    sta: "No s'ha trobat cap micròfon.",
    kako: "Comprova que l'ordinador té micròfon i que cap altra aplicació l'està fent servir.",
  },
  "language-not-supported": {
    sta: "Aquest navegador no reconeix el català.",
    kako: "Obre el joc amb Google Chrome.",
  },
  network: {
    sta: "El reconeixement de veu necessita internet.",
    kako: "Comprova la connexió i torna-ho a provar.",
  },
};

function FallbackSelfAssessment({
  task,
  onComplete,
  showWarning = true,
  razlog = null,
}: {
  task: SelfAssessmentTask;
  onComplete: (result: TaskResult) => void;
  showWarning?: boolean;
  /** Kod greške iz pregledača (`not-allowed`, `network`…) — zašto mikrofon ne radi. */
  razlog?: string | null;
}) {
  const [ratings, setRatings] = useState<Record<number, "yes" | "no">>({});

  const handleRate = (idx: number, rating: "yes" | "no", catalanWord: string) => {
    setRatings((prev) => ({ ...prev, [idx]: rating }));
    if (rating === "yes") {
      celebrate();
    }
    speak(catalanWord);
  };

  const allRated = task.items.every((_, i) => ratings[i]);
  const correctCount = Object.values(ratings).filter((r) => r === "yes").length;

  return (
    <div className="space-y-4">
      {/* ZAŠTO MIKROFON NE RADI — vidljivo, sa uputstvom.
          Ovaj režim je SAMOPROCENA: dete samo kaže „znam", pa može i da slaže.
          Zato ovde ne stoji samo „nije dostupan" nego i tačan razlog i šta se
          radi, da se mikrofon vrati u igru umesto da se zaobiđe. */}
      {(showWarning || razlog) && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2">
            <MicOff className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm font-bold text-amber-800">
              {razlog && RAZLOZI[razlog]
                ? RAZLOZI[razlog].sta
                : "El micròfon no està disponible."}
            </p>
          </div>
          <p className="text-sm text-amber-700">
            {razlog && RAZLOZI[razlog]
              ? RAZLOZI[razlog].kako
              : "Demana ajuda a un adult."}
          </p>
          {razlog && !RAZLOZI[razlog] && (
            <p className="text-xs text-amber-600">Codi: {razlog}</p>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {correctCount} / {task.items.length} paraules
      </div>

      {/* Grid of cards */}
      <div
        className="task-cards"
        style={{ "--card-min": "150px", "--card-max": "230px", "--card-gap": "0.75rem" } as CSSProperties}
      >
        {task.items.map((item, idx) => {
          const rating = ratings[idx];
          const illustration = getWordIllustration(item.catalan);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`bg-white rounded-xl p-3 shadow-sm border-3 transition-all flex flex-col items-center ${
                rating === "yes"
                  ? "border-green-500 bg-green-50"
                  : rating === "no"
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
              }`}
            >
              {/* Image (larger) */}
              <div className="mb-2">
                {illustration ? (
                  <img
                    src={illustration}
                    alt=""
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                    ❓
                  </div>
                )}
              </div>

              {/* Rating buttons or result */}
              {rating ? (
                <div className="text-center">
                  <p className="text-sm font-bold font-handwriting text-[var(--primary)]">
                    {item.catalan}
                  </p>
                  <span className="text-lg">{rating === "yes" ? "✅" : "😅"}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleRate(idx, "yes", item.catalan)}
                    className="px-3 py-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-bold"
                  >
                    Ho sé! ✅
                  </button>
                  <button
                    onClick={() => handleRate(idx, "no", item.catalan)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-bold"
                  >
                    No 😅
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Complete button */}
      {allRated && (
        <div className="task-action-bar">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const erroredItems = Object.entries(ratings)
                .filter(([, r]) => r === "no")
                .map(([idx]) => task.items[parseInt(idx)].catalan);
              onComplete({ allCorrect: erroredItems.length === 0, erroredItems });
            }}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Continua! 🎉
          </motion.button>
        </div>
      )}
    </div>
  );
}
