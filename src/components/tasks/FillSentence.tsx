"use client";

import { useState, useCallback, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FillSentenceTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { RefreshCcw } from "lucide-react";
import { useErrorTracking } from "@/contexts/ErrorTrackingContext";

interface Props {
  task: FillSentenceTask;
  onComplete: (result: TaskResult) => void;
  /** When true, show the solved state: blanks pre-filled with the correct word, all green. */
  review?: boolean;
}

// Slika rečenice: eksplicitna `s.image` ako postoji, inače IZVEDENA iz SUBJEKTA —
// imenica ODMAH posle vodećeg člana na POČETKU rečenice (npr. „La serp..." → serp).
// Namerno gleda SAMO subjekt (ne bilo koju reč) da se ne bi hvatale pogrešne reči usred
// rečenice („té"→čaj, „cabell"→kosa) niti odavao odgovor u zagonetkama/opisima osoba.
function sentenceImageKey(s: { text: string; image?: string }): string | null {
  if (s.image && getWordIllustration(s.image)) return s.image;
  const m = s.text.match(
    /^\s*(?:l'|el\s+|la\s+|els\s+|les\s+|un\s+|una\s+|en\s+|na\s+)([a-zà-ÿ·'-]+)/i
  );
  if (m && getWordIllustration(m[1])) return m[1];
  return null;
}

export default function FillSentence({ task, onComplete, review = false }: Props) {
  // In review mode the task is already solved, so pre-fill every blank with its
  // correct answer and mark it checked+correct (shown green with a ✅).
  const [answers, setAnswers] = useState<Record<number, string>>(() =>
    review
      ? Object.fromEntries(task.sentences.map((s, i) => [i, s.blank]))
      : {}
  );
  const [checked, setChecked] = useState(review);
  const [results, setResults] = useState<Record<number, boolean>>(() =>
    review
      ? Object.fromEntries(task.sentences.map((_, i) => [i, true]))
      : {}
  );
  const { trackError } = useErrorTracking();

  const handleSelect = (sentenceIdx: number, option: string) => {
    if (checked) return;
    setAnswers({ ...answers, [sentenceIdx]: option });
    // Speak every selection so kids hear what they picked, right or wrong
    speak(option);
  };

  const handleCheck = useCallback(() => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;
    task.sentences.forEach((s, i) => {
      const correct = answers[i]?.toLowerCase() === s.blank.toLowerCase();
      newResults[i] = correct;
      if (!correct) {
        allCorrect = false;
        // GREŠKA SE OVDE VIŠE NE ZAPISUJE (16.08.2026, prijava vlasnice).
        //
        // Ovaj zadatak se završava SAMO kad je sve tačno — dete dotle popravlja.
        // A zapis je nastajao na svaku medjuproveru, pa je jedan promašen klik
        // koji je dete odmah ispravilo zauvek ostajao u spisku „za vežbanje".
        // Tako je dete koje je temu uradilo tačno bilo vraćeno na zelene
        // zadatke. Greška je ono što je na KRAJU pogrešno, a ovde toga nema.
      }
    });
    setResults(newResults);
    setChecked(true);
    if (allCorrect) {
      // Celebration confetti (answers already spoken when selected)
      celebrateBig();
      setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
    }
  }, [answers, task.sentences, onComplete, trackError]);

  const handleRetry = () => {
    setChecked(false);
    setResults({});
    setAnswers({});
  };

  // Retry only a single wrong sentence
  const handleRetrySingle = (sentenceIdx: number) => {
    const newAnswers = { ...answers };
    delete newAnswers[sentenceIdx];
    setAnswers(newAnswers);

    const newResults = { ...results };
    delete newResults[sentenceIdx];
    setResults(newResults);

    setChecked(false);
  };

  const allAnswered = task.sentences.every((_, i) => answers[i]);
  const allCorrect = checked && Object.values(results).every(Boolean);

  /**
   * „POGLEDAJ OVDE" (03.08.2026)
   *
   * Kad dete 12 s ne dodirne ništa, prva NEODGOVORENA kartica dobije mek
   * prsten. Ne bira se nasumična kartica nego prva prazna — to je tačno ono
   * mesto na koje dete treba da klikne, pa savet ne odaje odgovor, samo
   * usmerava pogled.
   *
   * Tajmer se poništava na svaki odgovor: čim dete radi, pomoć nestaje.
   */
  const prvaPrazna = task.sentences.findIndex((_, i) => !answers[i]);
  const [pokaziPrstenu, setPokaziPrstenu] = useState(false);

  useEffect(() => {
    setPokaziPrstenu(false);
    if (checked || prvaPrazna === -1) return;
    const t = setTimeout(() => setPokaziPrstenu(true), 12000);
    return () => clearTimeout(t);
  }, [prvaPrazna, checked]);

  const hasMainImage = task.image && getWordIllustration(task.image);

  // Check if all sentences have (or can derive) an individual image.
  // Tasks can opt out (sentenceImages: false) when the subject illustration
  // would mislead the child — e.g. relationship questions where the answer
  // is a different person than the sentence's subject.
  // Per-sentence illustrations can be disabled per task (sentenceImages: false)
  // `i` je redni broj rečenice: kad je odgovor tačan i rečenica ima `imageAfter`,
  // slika se ZAMENI. Tako u „noi → noia" dete prvo vidi dečaka koji je viši od
  // drugog, pa kad napiše „alta" na tom mestu iskoči devojčica koja je viša —
  // reč i slika se poklope u istom trenutku, što je i cela poenta tog zadatka.
  const sentenceImg = (s: { text: string; image?: string; imageAfter?: string }, i?: number) => {
    if (task.sentenceImages === false) return null;
    if (i !== undefined && checked && results[i] && s.imageAfter && getWordIllustration(s.imageAfter)) {
      return s.imageAfter;
    }
    return sentenceImageKey(s);
  };
  const allSentencesHaveImages =
    task.sentenceImages !== false && task.sentences.every((s) => sentenceImageKey(s));

  // Render sentences list
  //
  // ŠIRINA: kartice se ranije nisu rastezale (`w-[140px] md:w-[160px]`), pa je
  // na širokom ekranu pet kartica padalo u dva reda i drugi red je završavao
  // ispod donje ivice. Sada broj kolona računa sam raspored („auto-fit"):
  // koliko kartica stane po 140 px, toliko ih je u redu.
  // Donja granica je spuštena sa 160 na 140 px 03.08.2026: na prozoru od
  // 1400 px (a to je stvarna širina na kojoj se radi) sa 160 px je sedma
  // kartica padala u drugi red. Sa 132 px staje svih sedam i na 1280 px, a pošto se kolone
  // rastežu do 240 px, na širem ekranu kartice i dalje budu velike.
  const renderSentences = () => (
    <div
      className={
        allSentencesHaveImages
          ? "task-cards"
          : "task-cards-fill"
      }
      style={
        allSentencesHaveImages
          ? ({ "--card-min": "132px", "--card-max": "240px", "--card-gap": "0.75rem" } as CSSProperties)
          // Rečenice bez slике stajale su u redovima preko CELE širine ekrana,
          // pa je polje bilo dugačko pola metra, a slika tačnog odgovora sitna
          // (prijava vlasnice 06.08.2026). Sada idu u kolone od najmanje 360 px:
          // red je kraći, oko ga obuhvati odjednom, a slika dobija mesta.
          : ({ "--card-min": "360px", "--card-gap": "0.6rem" } as CSSProperties)
      }
    >
      {task.sentences.map((sentence, i) => (
        <motion.div
          key={i}
          // v. objašnjenje uz `data-recenica` u `renderSentenceCard` — rečenice
          // se iscrtavaju DVEMA putanjama i obe moraju nositi oznaku, inače se
          // provera ne može obratiti pravoj rečenici.
          data-recenica={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`bg-white rounded-xl p-2 shadow-sm ${
            allSentencesHaveImages ? "w-full flex flex-col" : ""
          } ${pokaziPrstenu && i === prvaPrazna ? "pokazi-ovde" : ""} ${
            checked
              ? results[i]
                ? "ring-2 ring-[var(--success)]"
                : "ring-2 ring-[var(--error)]"
              : ""
          }`}
        >
          {/* Compact layout for image-based sentences */}
          {allSentencesHaveImages && sentenceImg(sentence, i) ? (
            <>
              <div className="flex justify-center">
                {/* Slika prati širinu kartice umesto da stoji na 120 px —
                    na širokom ekranu naraste do 200 px, na telefonu se skupi. */}
                <img
                  src={getWordIllustration(sentenceImg(sentence, i)!)!}
                  alt=""
                  className="w-full max-w-[200px] aspect-square object-contain"
                />
              </div>
              {/* Sentence text with name */}
              <p className="text-center text-base font-semibold text-[var(--text)] font-handwriting my-1">
                {sentence.text.split("___").map((part, j, arr) => (
                  <span key={j}>
                    {part}
                    {j < arr.length - 1 && (
                      <span
                        className={`inline-block px-2 py-0.5 mx-0.5 rounded-lg font-bold text-base ${
                          answers[i]
                            ? checked
                              ? results[i]
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              : "bg-purple-100 text-[var(--primary)]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {answers[i] || "___"}
                      </span>
                    )}
                  </span>
                ))}
                {checked && (
                  <span className="ml-1">
                    {results[i] ? "✅" : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetrySingle(i);
                        }}
                        className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-orange-100 transition-colors"
                        aria-label="Torna a provar"
                      >
                        <RefreshCcw className="w-4 h-4 text-orange-500" />
                      </button>
                    )}
                  </span>
                )}
              </p>
            </>
          ) : (
            <>
              {sentenceImg(sentence, i) && (
                <div className="flex justify-center mb-2">
                  <img
                    src={getWordIllustration(sentenceImg(sentence, i)!)!}
                    alt=""
                    className="w-20 h-20 object-contain"
                  />
                </div>
              )}
              <div className="mb-2">
                <div className="flex items-start gap-1">
                  <SpeakerButton text={sentence.text.replace(/\s*___\.?/, "")} size={14} />
                  <p className="flex-1 min-w-0 font-semibold text-[var(--text)] font-handwriting text-sm leading-tight">
                      {sentence.text.split("___").map((part, j, arr) => (
                        <span key={j}>
                          {part}
                          {j < arr.length - 1 && (
                            <span
                              className={`inline-block px-2 py-0.5 mx-0.5 rounded-lg font-bold text-sm ${
                                answers[i]
                                  ? checked
                                    ? results[i]
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                    : "bg-purple-100 text-[var(--primary)]"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {answers[i] || "___"}
                            </span>
                          )}
                        </span>
                      ))}
                      <AnimatePresence>
                        {checked && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-1"
                          >
                            {results[i] ? "✅" : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRetrySingle(i);
                                }}
                                className="inline-flex items-center justify-center p-1 rounded-full hover:bg-orange-100 transition-colors"
                                aria-label="Torna a provar aquesta frase"
                              >
                                <RefreshCcw className="w-4 h-4 text-orange-500" />
                              </button>
                            )}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </p>
                </div>
                {/* Show illustration of correct answer when selected correctly — own
                    row below the text so it never overlaps or spills on narrow cards */}
                <AnimatePresence>
                  {answers[i] && answers[i].toLowerCase() === sentence.blank.toLowerCase() && getWordIllustration(sentence.blank) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex justify-center mt-1"
                    >
                      {/* Slika tačnog odgovora je NAGRADA i potvrda — sa 64 px
                          je bila sitnija od samog teksta. Sada 112 px i po
                          sredini kartice, da je dete odmah vidi. */}
                      <img
                        src={getWordIllustration(sentence.blank)!}
                        alt={sentence.blank}
                        className="w-28 h-28 object-contain"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
          {/* U uskoj kartici se ponuđene reči lome nepravilno (2+1, pa 1+2),
              pa red izgleda razbijeno. Zato u karticama sa slikom stoje jedna
              ispod druge — uredno je i dugme je šire, lakše se pogodi prstom. */}
          <div className={allSentencesHaveImages ? "flex flex-col gap-1.5 mt-auto" : "flex flex-wrap gap-1.5 justify-center"}>
            {sentence.options?.map((option) => (
              <motion.button
                key={option}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(i, option)}
                disabled={checked}
                className={`rounded-lg font-bold font-handwriting transition-all px-4 py-2 min-h-[44px] text-base ${
                  answers[i] === option
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-100 text-[var(--text)] hover:bg-gray-200"
                } disabled:cursor-default`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Retry button inside grid for tasks with images */}
      {allSentencesHaveImages && checked && !allCorrect && (
        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="px-6 py-3 bg-[var(--secondary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Torna a provar!
          </motion.button>
        </div>
      )}
    </div>
  );

  // Split sentences for 3-column layout (left | image | right)
  const midPoint = Math.ceil(task.sentences.length / 2);
  const leftSentences = task.sentences.slice(0, midPoint);
  const rightSentences = task.sentences.slice(midPoint);

  // Render a single sentence card
  const renderSentenceCard = (sentence: typeof task.sentences[0], i: number) => (
    <motion.div
      key={i}
      /**
       * `data-recenica` — redni broj rečenice, da se provera može obratiti BAŠ
       * njoj (26.08.2026, zatvaranje rupe T2).
       *
       * Svaka rečenica ima SVOJU ponudu reči, i ista reč se često javlja u više
       * njih. QA prolaz je klikao prvu reč tog imena bilo gde na strani, pa je
       * odgovor završavao na pogrešnoj rečenici — zadatak nikad nije bio
       * popunjen do kraja, a prolaz je to prijavljivao kao „odigrano".
       * Ovo je 40 zadataka, 17% cele igre.
       */
      data-recenica={i}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className={`bg-white rounded-xl p-3 shadow-sm ${
        pokaziPrstenu && i === prvaPrazna ? "pokazi-ovde" : ""
      } ${
        checked
          ? results[i]
            ? "ring-2 ring-[var(--success)]"
            : "ring-2 ring-[var(--error)]"
          : ""
      }`}
    >
      {sentenceImg(sentence, i) && (
        <div className="flex justify-center mb-2">
          <img
            src={getWordIllustration(sentenceImg(sentence, i)!)!}
            alt=""
            className={allSentencesHaveImages ? "w-28 h-28 md:w-32 md:h-32 object-contain" : "w-20 h-20 object-contain"}
          />
        </div>
      )}
      <div className="mb-2">
        <div className="flex items-start gap-1">
          <SpeakerButton text={sentence.text.replace(/\s*___\.?/, "")} size={14} />
          <p className="flex-1 min-w-0 font-semibold text-[var(--text)] font-handwriting text-base md:text-lg leading-snug">
              {sentence.text.split("___").map((part, j, arr) => (
                <span key={j}>
                  {part}
                  {j < arr.length - 1 && (
                    <span
                      className={`inline-block px-2 py-0.5 mx-0.5 rounded-lg font-bold text-base md:text-lg ${
                        answers[i]
                          ? checked
                            ? results[i]
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            : "bg-purple-100 text-[var(--primary)]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {answers[i] || "___"}
                    </span>
                  )}
                </span>
              ))}
              <AnimatePresence>
                {checked && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1"
                  >
                    {results[i] ? "✅" : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetrySingle(i);
                        }}
                        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-orange-100 transition-colors"
                        aria-label="Torna a provar aquesta frase"
                      >
                        <RefreshCcw className="w-4 h-4 text-orange-500" />
                      </button>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </p>
        </div>
        {/* Show illustration of correct answer when selected correctly — own row
            below the text so it never overlaps or spills on narrow cards */}
        <AnimatePresence>
          {answers[i] && answers[i].toLowerCase() === sentence.blank.toLowerCase() && getWordIllustration(sentence.blank) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex justify-center mt-1"
            >
              <img
                src={getWordIllustration(sentence.blank)!}
                alt={sentence.blank}
                className="w-28 h-28 object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {sentence.options?.map((option) => (
          <motion.button
            key={option}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(i, option)}
            disabled={checked}
            className={`rounded-lg font-bold font-handwriting transition-all px-4 py-2 min-h-[44px] text-base ${
              answers[i] === option
                ? "bg-[var(--primary)] text-white"
                : "bg-gray-100 text-[var(--text)] hover:bg-gray-200"
            } disabled:cursor-default`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-3">
      {/* SPISAK LIKOVA (14.08.2026)
          Zadatak „Qui és qui?" bez ovoga nije bio rešiv nego se pogađao: dete
          čita „ima dugu crnu kosu i naočare", a nigde nema nijedne slike da vidi
          KO to jeste. Sada četiri lika stoje na vrhu, kao u svesci gde su
          nacrtani jedan pored drugog. Dete gleda opis pa traži lik koji mu
          odgovara. */}
      {task.referenceImages && task.referenceImages.length > 0 && (
        <div
          className="task-cards mb-1"
          style={{ "--card-min": "120px", "--card-max": "190px", "--card-gap": "0.5rem" } as CSSProperties}
        >
          {task.referenceImages.map((kljuc) => {
            const src = getWordIllustration(kljuc);
            if (!src) return null;
            return (
              <div key={kljuc} className="bg-white rounded-xl p-2 shadow-sm">
                <img src={src} alt="" draggable={false} className="w-full aspect-square object-contain select-none" />
              </div>
            );
          })}
        </div>
      )}

      {/* Layout with main reference image */}
      {hasMainImage && !allSentencesHaveImages ? (
        <>
          {/* Mobile/Tablet: Image, then description, then sentences */}
          <div className="md:hidden">
            <div className="flex justify-center mb-3">
              <img
                src={getWordIllustration(task.image!)!}
                alt=""
                className="w-64 h-64 object-contain rounded-xl bg-white p-3 shadow-lg"
              />
            </div>
            {task.imageLabel && (
              <p className="text-center font-handwriting font-black text-2xl text-[var(--primary)] mt-2">
                {task.imageLabel}
              </p>
            )}

            {task.description && (
              <div className="bg-amber-50 rounded-xl p-3 mb-4 text-sm space-y-1">
                {task.description.map((line, i) => (
                  <p key={i} className="text-[var(--text)]">{line}</p>
                ))}
              </div>
            )}
            <div className="space-y-2">
              {task.sentences.map((sentence, i) => renderSentenceCard(sentence, i))}
            </div>
          </div>

          {/* Desktop: 3-column layout */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
            {/* Left column - first half of sentences */}
            <div className="space-y-2">
              {leftSentences.map((sentence, i) => renderSentenceCard(sentence, i))}
            </div>

            {/* Center - image */}
            <div className="flex flex-col items-center justify-center sticky top-20">
              <img
                src={getWordIllustration(task.image!)!}
                alt=""
                className="w-64 h-auto max-h-[400px] object-contain rounded-xl bg-white p-3 shadow-sm"
              />
              {task.imageLabel && (
                <p className="font-handwriting font-black text-2xl text-[var(--primary)] mt-2">
                  {task.imageLabel}
                </p>
              )}
              <p className="text-xs text-center text-[var(--text-light)] mt-2">
                👆 Mira la imatge!
              </p>
              {task.description && (
                <div className="bg-amber-50 rounded-xl p-3 mt-3 text-sm space-y-1 max-w-[250px]">
                  {task.description.map((line, i) => (
                    <p key={i} className="text-[var(--text)]">{line}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Right column - second half of sentences */}
            <div className="space-y-2">
              {rightSentences.map((sentence, i) => renderSentenceCard(sentence, i + midPoint))}
            </div>
          </div>
        </>
      ) : hasMainImage && allSentencesHaveImages ? (
        // Glavna slika + slika uz svaku rečenicu.
        // Glavna slika stoji IZNAD, ali manja nego pre (160 px umesto 192 px),
        // a kartice dobijaju punu širinu strane. Probano je i da slika ide
        // levo, pored kartica: tada joj 250 px otme toliko prostora da sedam
        // kartica više ne stane u jedan red. Puna širina je bolja razmena —
        // slika se i onako gleda samo jednom, kartice se diraju sve vreme.
        <>
          <div className="flex flex-col items-center mb-3">
            <img
              src={getWordIllustration(task.image!)!}
              alt=""
              className="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 object-contain rounded-xl bg-white p-2 shadow-md"
            />
            {task.imageLabel && (
              <p className="font-handwriting font-black text-2xl md:text-3xl text-[var(--primary)] mt-2">
                {task.imageLabel}
              </p>
            )}
            {task.description && (
              <div className="bg-amber-50 rounded-xl px-4 py-2 mt-3 text-base md:text-lg space-y-1">
                {task.description.map((line, i) => (
                  <p key={i} className="text-[var(--text)] font-handwriting font-semibold text-center">{line}</p>
                ))}
              </div>
            )}
          </div>
          {renderSentences()}
        </>
      ) : (
        // No main image OR all sentences have images - use original grid layout
        renderSentences()
      )}

      {/* Comprova button — lepi se za dno ekrana (`task-action-bar`) da dete
          ne mora da pogodi da ispod ima još nešto. */}
      {allAnswered && !checked && (
        <div className="task-action-bar">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Comprova!
          </motion.button>
        </div>
      )}

      {/* Retry button - only show after wrong answer */}
      {!allSentencesHaveImages && checked && !allCorrect && (
        <div className="task-action-bar">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="px-8 py-3 bg-[var(--secondary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Torna a provar!
          </motion.button>
        </div>
      )}
    </div>
  );
}
