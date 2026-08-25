"use client";

import { useState, useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { MultipleChoiceTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { RefreshCcw } from "lucide-react";

interface Props {
  task: MultipleChoiceTask;
  onComplete: (result: TaskResult) => void;
  /** When true, show the solved state: the correct option selected and marked green. */
  review?: boolean;
}

export default function MultipleChoice({ task, onComplete, review = false }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  // In review mode the task is already solved: pre-select the correct option for the
  // current (first) question and reveal the result (green + ✅).
  const [selected, setSelected] = useState<number | null>(() =>
    review ? task.questions[0].correct : null
  );
  const [showResult, setShowResult] = useState(review);
  /**
   * ISHOD PO PITANJU, PO REDNOM BROJU — ne spisak koji raste (16.08.2026).
   *
   * Prijava vlasnice: ćerka je celu temu uradila tačno, a na kraju je pisalo
   * „imaš još 9 reči za vežbanje" i vratilo je na zelene zadatke. Za dete tog
   * uzrasta je to najgore što aplikacija može da uradi.
   *
   * Prva popravka je iz spiska izbacivala pitanje kad ga dete ispravi, ali je
   * spisak i dalje bio jedan niz koji se prepisuje iz zatvorenog opsega —
   * zavisilo je od redosleda osvežavanja stanja, i izmereno je da ispravljeno
   * pitanje ipak ostane zapisano. Zato se sada pamti ISHOD SVAKOG PITANJA
   * posebno: poslednji odgovor prosto pregazi prethodni.
   * Greška je ono što je na KRAJU pogrešno — ništa drugo.
   */
  const [ishodi, setIshodi] = useState<Record<number, boolean>>({});
  const ishodiRef = useRef<Record<number, boolean>>({});
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  const question = task.questions[currentQ];
  const isCorrect = selected === question.correct;

  const handleSelect = (optionIdx: number) => {
    if (showResult) return;
    setSelected(optionIdx);
    setShowResult(true);

    const isRight = optionIdx === question.correct;
      // GREŠKA SE PONIŠTAVA ČIM DETE POPRAVI (16.08.2026, prijava vlasnice).
      //
      // Ranije je zapisana greška ostajala zauvek, i kad dete odmah zatim
      // odgovori tačno. Dete koje je celu temu uradilo tačno dobijalo je na
      // kraju „imaš još 9 reči za vežbanje" i bilo VRAĆENO na zadatke koji su
      // na ekranu zeleni. Za dete tog uzrasta to je najgore što aplikacija
      // može da uradi — oduzima smisao tome što se trudilo.
      //
      // Pravilo: greška je ono što je na KRAJU zadatka još pogrešno, a ne ono
      // što je nekad usput bilo pogrešno.
    // Ref se koristi zato što se završetak zadatka dešava u tajmeru — tamo
    // stanje iz zatvorenog opsega ume da bude zastarelo, a ref je uvek tekući.
    ishodiRef.current = { ...ishodiRef.current, [currentQ]: isRight };
    setIshodi(ishodiRef.current);
    const newWrong = task.questions
      .map((q, i) => (ishodiRef.current[i] === false ? q.question : null))
      .filter((x): x is string => x !== null);

    // Speak whichever option the kid picked, right or wrong
    speak(question.options[optionIdx]);
    if (isRight) {
      celebrate();
    }

    // Clear any existing timer
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }

    /**
     * POSLE POGREŠNOG ODGOVORA SE VIŠE NE IDE DALJE SAMO OD SEBE (16.08.2026).
     *
     * Ranije se prelazilo na sledeće pitanje 1,2 s posle SVAKOG odgovora, i kad
     * je pogrešan. Iz toga su izlazile dve stvari koje je vlasnica i prijavila:
     *   • dete klikne „pokušaj ponovo" i odgovori tačno, ali stari tajmer u
     *     međuvremenu okine — pa se JEDNO PITANJE PRESKOČI (izmereno: brojač
     *     skoči sa 5/8 na 7/8), a ispravljeni odgovor ostane zapisan kao greška;
     *   • dete nema vremena ni da vidi šta je tačno pre nego što ekran ode dalje.
     *
     * Sada se dalje ide SAMO kad je odgovor tačan. Na pogrešan se čeka dete —
     * ono klikne ikonicu i pokuša ponovo. Pitanja su „da/ne", pa se uvek može
     * doći do tačnog; nema zaglavljivanja.
     */
    if (!isRight) return;

    autoAdvanceTimer.current = setTimeout(() => {
      if (currentQ < task.questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        onComplete({
          allCorrect: newWrong.length === 0,
          erroredItems: newWrong,
        });
      }
    }, 1200);
  };

  const handleRetry = () => {
    // Cancel auto-advance
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div>
      {/* Reference image when provided */}
      {task.image && getWordIllustration(task.image) && (
        <div className="flex justify-center mb-3">
          <img
            src={getWordIllustration(task.image)!}
            alt=""
            className="w-full max-w-md h-auto object-contain rounded-2xl bg-white shadow-sm p-2"
          />
        </div>
      )}

      <div className="text-sm text-[var(--text-light)] mb-2 text-center">
        {currentQ + 1} / {task.questions.length}
      </div>

      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm max-w-4xl mx-auto"
      >
        {/* Per-question image (e.g. the animal the question is about) */}
        {question.image && getWordIllustration(question.image) && (
          <div className="flex justify-center mb-3">
            <img
              src={getWordIllustration(question.image)!}
              alt=""
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-1 mb-4">
          <SpeakerButton text={question.question} size={18} />
          <h3 className="text-xl font-bold text-[var(--text)] text-center font-handwriting">
            {question.question}
          </h3>
        </div>

        {/* Ponuđeni odgovori: na širokom ekranu stanu jedan pored drugog,
            na telefonu se sami slože jedan ispod drugog. */}
        <div
          className="task-cards-fill"
          style={{ "--card-min": "240px", "--card-gap": "0.5rem" } as CSSProperties}
        >
          {question.options.map((option, i) => (
            /**
             * STRELICA „POKUŠAJ PONOVO" STOJI PORED DUGMETA, NE U NJEMU
             * (25.08.2026, prijava vlasnice: „strelice uopšte ne rade kad
             * klikne na njih").
             *
             * Ranije je bila UNUTAR dugmeta. To je dvostruko loše:
             *   • dugme je u tom trenutku bilo `disabled`, a pregledač guta
             *     klik na sve što je u onemogućenom dugmetu — strelica nije
             *     mogla ni da primi klik;
             *   • dugme u dugmetu nije ispravan HTML, pa se i posle skidanja
             *     `disabled` ponašalo nepredvidivo (pogađanje cilja je padalo
             *     na ikonicu umesto na dugme).
             * Sada je zaseban element pored dugmeta i radi svuda.
             */
            <div key={i} className="flex items-center gap-1 w-full">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(i)}
              /**
               * NE KORISTI SE `disabled` (25.08.2026, prijava vlasnice:
               * „strelice uopšte ne rade kad klikne na njih").
               *
               * Strelica za ponovni pokušaj stoji UNUTAR ovog dugmeta. Kad je
               * dugme `disabled`, pregledač guta klik na SVE što je u njemu —
               * pa strelica nije mogla ni da primi klik. Dete odgovori
               * pogrešno, vidi narandžastu strelicu, klikne je, i ništa.
               *
               * Zaključavanje se sada radi u `handleSelect` (`if (showResult)
               * return;`), pa dugme ostaje „živo" i strelica u njemu radi.
               * `aria-disabled` čuva poruku za čitače ekrana.
               */
              aria-disabled={showResult}
              className={`w-full p-4 rounded-2xl text-left text-lg font-semibold font-handwriting transition-all ${
                showResult
                  ? i === question.correct
                    ? "bg-green-100 text-green-700 border-2 border-green-400"
                    : i === selected
                      ? "bg-red-100 text-red-700 border-2 border-red-400"
                      : "bg-gray-50 text-gray-400 border-2 border-gray-100"
                  : selected === i
                    ? "bg-purple-100 border-2 border-[var(--primary)] text-[var(--primary)]"
                    : "bg-gray-50 border-2 border-gray-200 text-[var(--text)] hover:bg-gray-100"
              }`}
            >
              {/* Sličicu prikazujemo SAMO uz zeleni tačan odgovor (ne odaje odgovor tokom pitanja) */}
              {showResult && i === question.correct && getWordIllustration(option) ? (
                <img src={getWordIllustration(option)!} alt="" className="w-12 h-12 object-contain inline mr-2 align-middle" />
              ) : null}
              {option}
              {showResult && i === question.correct && " ✅"}
            </motion.button>
            {showResult && i === selected && !isCorrect && (
              <button
                type="button"
                onClick={handleRetry}
                /* 44×44 px — dodirna meta za dete, po pravilu projekta.
                   Ranije je bila 28 px, a prst od sedam godina je promaši. */
                className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-orange-100 transition-colors"
                aria-label="Torna a provar"
              >
                {/* `pointer-events-none` — klik pripada dugmetu, ne ikonici;
                    inače pogađanje cilja padne na `svg` i klik se izgubi. */}
                <RefreshCcw className="w-6 h-6 text-orange-500 pointer-events-none" />
              </button>
            )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
