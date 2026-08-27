"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CopyWordTask } from "@/types/tasks";
import type { TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import NavigacijaStavki from "@/components/ui/NavigacijaStavki";
import { sacuvajNapredak, ucitajNapredak, obrisiNapredak } from "@/lib/napredak-zadatka";
import LetterTile from "@/components/ui/LetterTile";
import SlotRow from "@/components/ui/SlotRow";
import SpeakerButton from "@/components/ui/SpeakerButton";
import InlineHintMascot from "@/components/ui/InlineHintMascot";
import { useHintSystem } from "@/hooks/useHintSystem";
import { speak } from "@/lib/tts";

import { ArrowLeft } from "lucide-react";
import { celebrate, celebrateBig } from "@/lib/confetti";
import MiniCelebration from "@/components/gamification/MiniCelebration";

/** After this many words the child gets a short celebration break before continuing. */
const WORDS_PER_ROUND = 7;

interface Props {
  task: CopyWordTask;
  onComplete: (result: TaskResult) => void;
  /** When true, show the solved state: the word already spelled out, all green. */
  review?: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Strip accents from a string (à→a, é→e, ï→i, etc.) but keep ç (it's a separate letter in Catalan)
/**
 * PONUĐENA SLOVA SU BEZ KVAČICA — TO JE NAMERNO (potvrdila vlasnica 27.08.2026).
 *
 * „Mi smo namerno stavili da ponuđena slova budu bez akcenta, a da reč ponuđena
 * bude tačno napisana i da im služi kao primer."
 *
 * Dakle: reč iznad polja stoji ISPRAVNO, sa kvačicom (`tomàquet`), a pločice sa
 * slovima su `a` bez kvačice. Dete gleda tačno napisanu reč kao uzor, a ne mora
 * da traži gde je kvačica na tastaturi od slova.
 *
 * **NE „POPRAVLJATI" OVO.** Provera koja traži pločicu `À` naći će samo `A` i
 * pomisliti da zadatak nije rešiv — to se već desilo 27.08. i bila je greška u
 * merenju, ne u igrici. Dete je reč `tomàquet` završilo bez problema.
 */
function stripAccents(str: string): string {
  // Preserve ç/Ç before NFD normalization (ç is a letter, not an accent)
  return str
    .replace(/ç/g, "\x01")
    .replace(/Ç/g, "\x02")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\x01/g, "ç")
    .replace(/\x02/g, "Ç");
}

export default function CopyWord({ task, onComplete, review = false }: Props) {
    /**
   * NASTAVAK TAMO GDE JE DETE STALO (17.08.2026, prijava vlasnice).
   *
   * Dete je stiglo do pete reči od šest, slučajno prešlo prstima preko dodirne
   * ploče i otišlo na prethodni zadatak. Vratilo se odmah — i zateklo 1/6.
   * Pet rešenih reči je nestalo.
   *
   * Ne pita se „hoćeš li izaći?" — dete od sedam godina to ne pročita nego
   * klikne bilo šta. A i ne dešava se samo klikom: poklopi se laptop, crkne
   * baterija, zvoni školsko zvono. Zato aplikacija pamti sama, tiho.
   * Zapis se briše čim se zadatak završi.
   */
  /**
   * POČETNA REČ SE RAČUNA JEDNOM I KORISTI SE SVUDA (27.08.2026).
   *
   * Prijava vlasnice, tema 7 zadatak 6: „reč `enciam` ne može da se popuni jer
   * nema dovoljno slova… bilo je ponuđeno samo 4 slova B E C A, i kad sam
   * upisala tako, rekao je da je greška; kad sam kliknula `Torna a provar`,
   * ponudio je onda ispravna slova."
   *
   * Bila je u pravu, i uzrok je bio ovaj: zadatak PAMTI dokle je dete stiglo,
   * pa kad se dete vrati, na ekranu stoji reč na kojoj je stalo (`enciam`) —
   * a polja i ponuda slova su se PRAVILI OD PRVE REČI U ZADATKU (`ceba`,
   * dakle B E C A). Reč od šest slova, a četiri ponuđena.
   *
   * `Torna a provar` je pravio ponudu od TEKUĆE reči i zato je posle njega sve
   * bilo u redu — što je i bio jedini način da dete nastavi.
   *
   * Kvar pogađa SVAKI zadatak prepisivanja koji je dete započelo pa mu se
   * vratilo — a to je 49 zadataka, 21% cele igre.
   */
  const pocetniIdx = (() => {
    if (review) return 0;
    const z = ucitajNapredak(task.id);
    return z && z.idx > 0 && z.idx < task.words.length ? z.idx : 0;
  })();
  const [currentWordIdx, setCurrentWordIdx] = useState(pocetniIdx);

  // Pamti se dokle je dete stiglo — v. objašnjenje gore. Zapis se briše čim
  // se zadatak završi, pa se sledeći put kreće ispočetka.
  useEffect(() => {
    if (review) return;
    if (currentWordIdx >= task.words.length - 1) return;
    sacuvajNapredak(task.id, { idx: currentWordIdx });
  }, [currentWordIdx, task.id, review]);

  // In review mode the word is already solved: fill every slot with the correct
  // (accent-stripped) letter and mark it checked+correct (SlotRow shows green).
  // Polja i ponuda slova prave se od REČI NA KOJOJ DETE POČINJE, ne od prve u
  // zadatku — v. objašnjenje uz `pocetniIdx` gore.
  const [slots, setSlots] = useState<(string | null)[]>(() =>
    review
      ? stripAccents(task.words[pocetniIdx].catalan).split("")
      : Array(task.words[pocetniIdx].catalan.length).fill(null)
  );
  const [bank, setBank] = useState<{ letter: string; used: boolean }[]>(() =>
    shuffleArray(task.words[pocetniIdx].catalan.split("")).map((l) => ({ letter: stripAccents(l), used: review }))
  );
  const [checked, setChecked] = useState(review);
  const [correct, setCorrect] = useState<boolean | null>(review ? true : null);
  const [completedCount, setCompletedCount] = useState(0);
  const [roundBreak, setRoundBreak] = useState(false);
  const [hintLetterIdx, setHintLetterIdx] = useState<number | null>(null);
  const hints = useHintSystem();

  const currentWord = task.words[currentWordIdx];
  /** Prvo `image` iz podataka, pa tek onda sama reč — v. objašnjenje niže. */
  const slikaReci =
    (currentWord.image && getWordIllustration(currentWord.image)) ||
    getWordIllustration(currentWord.catalan);
  const activeSlotIdx = slots.findIndex((s) => s === null);

  // When hint is accepted, find the correct letter in the bank and highlight it
  useEffect(() => {
    if (hints.showHint && hints.hintItemId === currentWord.catalan) {
      // Find the next empty slot index
      const nextSlotIdx = slots.findIndex((s) => s === null);
      if (nextSlotIdx === -1) return;
      // The correct letter for that slot (stripped of accents since bank has no accents)
      const correctLetter = stripAccents(currentWord.catalan[nextSlotIdx]);
      // Find that letter in the bank (unused)
      const bankIdx = bank.findIndex(
        (b) => !b.used && b.letter.toLowerCase() === correctLetter.toLowerCase()
      );
      setHintLetterIdx(bankIdx >= 0 ? bankIdx : null);
    } else {
      setHintLetterIdx(null);
    }
  }, [hints.showHint, hints.hintItemId, currentWord.catalan, slots, bank]);

  const handleLetterTap = useCallback((bankIdx: number) => {
    if (checked || bank[bankIdx].used) return;
    const slotIdx = slots.findIndex((s) => s === null);
    if (slotIdx === -1) return;

    const newSlots = [...slots];
    newSlots[slotIdx] = bank[bankIdx].letter;
    setSlots(newSlots);

    const newBank = [...bank];
    newBank[bankIdx] = { ...newBank[bankIdx], used: true };
    setBank(newBank);

    // Clear hint highlight after placing a letter
    setHintLetterIdx(null);
  }, [checked, bank, slots]);

  const handleSlotTap = useCallback((slotIdx: number) => {
    if (checked || slots[slotIdx] === null) return;
    const letter = slots[slotIdx]!;
    // Just empty the tapped slot — do NOT shift remaining letters left.
    // Shifting confused kids who watched their letters jump positions.
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);

    const bankIdx = bank.findIndex((b) => b.used && b.letter === letter);
    if (bankIdx !== -1) {
      const newBank = [...bank];
      newBank[bankIdx] = { ...newBank[bankIdx], used: false };
      setBank(newBank);
    }
  }, [checked, slots, bank]);

  const allFilled = slots.every((s) => s !== null);

  const moveToNext = useCallback(() => {
    if (currentWordIdx < task.words.length - 1) {
      const nextIdx = currentWordIdx + 1;
      const nextWord = task.words[nextIdx];
      setCurrentWordIdx(nextIdx);
      setSlots(Array(nextWord.catalan.length).fill(null));
      setBank(shuffleArray(nextWord.catalan.split("")).map((l) => ({ letter: stripAccents(l), used: false })));
      setChecked(false);
      setCorrect(null);
      setHintLetterIdx(null);
    } else {
      obrisiNapredak(task.id);
      onComplete({
        allCorrect: hints.erroredItems.length === 0,
        erroredItems: hints.erroredItems,
      });
    }
  }, [currentWordIdx, task.words, onComplete, hints.erroredItems]);

  /** Skok na bilo koju reč — koristi ga i strelica napred i strelica nazad. */
  const naStavku = useCallback((novi: number) => {
    const rec = task.words[novi];
    if (!rec) return;
    setCurrentWordIdx(novi);
    /**
     * U PREGLEDU SE NOVA REČ POKAZUJE VEĆ REŠENA (27.08.2026).
     *
     * Bez ovoga bi strelica u pregledu ispraznila polja: dete je reč rešilo,
     * a posle listanja bi ga dočekalo prazno mesto koje ne može da popuni
     * (pločice su zaključane). Izgledalo bi kao da se napredak izgubio.
     */
    setSlots(review
      ? stripAccents(rec.catalan).split("")
      : Array(rec.catalan.length).fill(null));
    setBank(shuffleArray(rec.catalan.split("")).map((l) => ({ letter: stripAccents(l), used: review })));
    setChecked(review);
    setCorrect(review ? true : null);
    setHintLetterIdx(null);
  }, [task.words, review]);

  const handleCheck = useCallback(() => {
    const answer = slots.join("").toLowerCase();
    const isCorrect = answer === stripAccents(currentWord.catalan).toLowerCase();
    setChecked(true);
    setCorrect(isCorrect);

    if (isCorrect) {
      const newCount = completedCount + 1;
      setCompletedCount(newCount);
      hints.dismissHint();
      setHintLetterIdx(null);
      celebrate();
      speak(currentWord.catalan);

      // Every WORDS_PER_ROUND words, pause for a mini celebration instead of
      // jumping straight to the next word — 21 words in one stretch is too long.
      const isRoundEnd =
        newCount % WORDS_PER_ROUND === 0 &&
        currentWordIdx < task.words.length - 1;
      if (isRoundEnd) {
        setTimeout(() => setRoundBreak(true), 1000);
      } else {
        setTimeout(() => moveToNext(), 1000);
      }
    } else {
      hints.recordWrongAttempt(currentWord.catalan);
    }
  }, [slots, currentWord, completedCount, hints, moveToNext]);

  // Auto-advance after 5 wrong attempts
  useEffect(() => {
    if (review) return;
    if (hints.shouldAutoAdvance(currentWord.catalan) && checked && !correct) {
      hints.addError(currentWord.catalan);
      hints.dismissHint();
      setTimeout(() => moveToNext(), 300);
    }
  }, [hints, currentWord.catalan, checked, correct, moveToNext]);

  const handleRetry = useCallback(() => {
    setSlots(Array(currentWord.catalan.length).fill(null));
    setBank(shuffleArray(currentWord.catalan.split("")).map((l) => ({ letter: stripAccents(l), used: false })));
    setChecked(false);
    setCorrect(null);
    setHintLetterIdx(null);
  }, [currentWord.catalan]);

  // Keyboard input support
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        /**
         * ENTER JE PRESKAKAO CEO ZADATAK (17.08.2026, prijava vlasnice:
         * „otkucam banyador i kliknem enter, a on ode na sledeći zadatak
         * umesto na sledeću reč").
         *
         * Uzrok: dete dođe na zadatak klikom na „Següent", pa žiža (fokus)
         * ostane na tom dugmetu. Zadatak nema polje za unos — slova se hvataju
         * sa cele strane — pa se žiža nikad ne pomeri. Kad dete otkuca reč i
         * pritisne Enter, pregledač Enter shvati kao ponovni klik na „Següent"
         * i preskoči ceo zadatak.
         *
         * `preventDefault` to zaustavlja: Enter ovde znači „proveri reč", i
         * ništa drugo.
         */
        e.preventDefault();
        if (checked && !correct) {
          handleRetry();
        } else if (!checked && allFilled) {
          handleCheck();
        }
        return;
      }

      if (checked) return;

      if (e.key === "Backspace") {
        // Find the last filled slot
        let lastFilledIdx = -1;
        for (let i = slots.length - 1; i >= 0; i--) {
          if (slots[i] !== null) {
            lastFilledIdx = i;
            break;
          }
        }
        if (lastFilledIdx !== -1) {
          handleSlotTap(lastFilledIdx);
        }
        return;
      }

      // Match letter keys (including accented Catalan characters) AND space
      if (e.key === " " || (e.key.length === 1 && /^[a-zA-ZàèéìòóùúïüçÀÈÉÌÒÓÙÚÏÜÇ]$/.test(e.key))) {
        const pressed = e.key === " " ? " " : stripAccents(e.key.toLowerCase());
        // Bank letters are already stripped of accents, so direct match works
        const bankIdx = bank.findIndex(
          (b) => !b.used && b.letter.toLowerCase() === pressed
        );
        if (bankIdx !== -1) {
          handleLetterTap(bankIdx);
        }
        // Prevent page scroll when pressing space
        if (e.key === " ") {
          e.preventDefault();
        }
      }
    },
    [checked, correct, allFilled, slots, bank, handleCheck, handleRetry, handleSlotTap, handleLetterTap]
  );

  useEffect(() => {
    if (review) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, review]);

  return (
    <div className="space-y-5">
      {/* STRELICE NAPRED I NAZAD KROZ REČI (17.08.2026, zahtev vlasnice).
          Ranije je postojala samo strelica UNAZAD, i to skrivena dok se ne
          predje prva reč. Dete koje hoće da pogleda sledeću reč nije imalo
          kako. Sada su obe strelice uvek tu; na krajevima posive umesto da
          nestanu, da dete vidi da dalje nema. */}
      <NavigacijaStavki
        idx={currentWordIdx}
        ukupno={task.words.length}
        naIdx={naStavku}
      />

      <motion.div
        key={currentWordIdx}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm max-w-3xl mx-auto"
      >
        {/* Word display with illustration or emoji */}
        <div className="text-center mb-4">
{/* POLJE `image` SE POŠTUJE (17.08.2026, prijava vlasnice: „zadatak 12
              nema slike za vell, baix, alt").
              Slika se tražila po SAMOJ REČI i polje `image` iz podataka se
              potpuno ignorisalo. Radilo je slučajno — samo kad se ime fajla i
              reč poklope (`boca` → `boca.webp`). Zato reči kao `jove`, `vell`,
              `alt`, `baix` nikad nisu imale sliku, iako su slike postojale i
              iako je `image` bio uredno upisan u podacima.
              Sad se prvo gleda `image`, pa tek onda sama reč. */}
          {slikaReci ? (
            <div className="mb-2 flex justify-center">
              <img
                src={slikaReci}
                alt={currentWord.catalan}
                className="w-44 h-44 object-contain"
              />
            </div>
          ) : null}
          <div className="flex items-center justify-center gap-2">
            <p className="text-3xl font-black text-[var(--primary)] font-handwriting">
              {currentWord.catalan}
            </p>
            <SpeakerButton text={currentWord.catalan} size={26} />
          </div>
          <p className="text-sm text-[var(--text-light)] mt-1">
            Copia la paraula tocant les lletres
          </p>
        </div>

        {/* Inline hint mascot */}
        <InlineHintMascot
          visible={hints.showHintDialog}
          onAccept={() => {
            hints.acceptHint();
            // Auto-reset slots so child can retry with hint visible
            setSlots(Array(currentWord.catalan.length).fill(null));
            setBank(shuffleArray(currentWord.catalan.split("")).map((l) => ({ letter: stripAccents(l), used: false })));
            setChecked(false);
            setCorrect(null);
          }}
          onDecline={hints.declineHint}
        />

        {/* Slots */}
        <div className="flex justify-center mb-5">
          <SlotRow
            slots={slots}
            activeIndex={activeSlotIdx >= 0 ? activeSlotIdx : undefined}
            correct={correct}
            onSlotTap={handleSlotTap}
          />
        </div>

        {/* Letter bank */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {bank.map((item, i) => (
            <div key={i} className={hintLetterIdx === i ? "hint-pulse rounded-xl" : ""}>
              <LetterTile
                letter={item.letter}
                disabled={item.used || checked}
                selected={false}
                onClick={() => handleLetterTap(i)}
              />
            </div>
          ))}
        </div>

        {/* Comprova button */}
        {allFilled && !checked && (
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

        {/* Retry button - only shown after wrong answer */}
        {checked && !correct && (
          <div className="flex justify-center gap-3">
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
      </motion.div>

      {/* Round break celebration every WORDS_PER_ROUND words */}
      <MiniCelebration
        show={roundBreak}
        message={`${completedCount} paraules escrites!`}
        subMessage="Molt bé! Descansa una mica i seguim."
        buttonText="Continua!"
        onDone={() => {
          setRoundBreak(false);
          moveToNext();
        }}
      />
    </div>
  );
}
