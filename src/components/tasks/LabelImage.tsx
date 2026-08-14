"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { LabelImageTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { speak } from "@/lib/tts";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import DragOverlay from "@/components/ui/DragOverlay";
import { RefreshCcw } from "lucide-react";

interface Props {
  task: LabelImageTask;
  onComplete: (result: TaskResult) => void;
  /** When true, show the solved state: every label placed correctly, all green. */
  review?: boolean;
}

export default function LabelImage({ task, onComplete, review = false }: Props) {
  // In review mode pre-place every label's correct word and mark it checked+correct.
  const [placed, setPlaced] = useState<Record<number, string>>(() =>
    review ? Object.fromEntries(task.labels.map((l, i) => [i, l.text])) : {}
  );
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [checked, setChecked] = useState(review);
  const [results, setResults] = useState<Record<number, boolean>>(() =>
    review ? Object.fromEntries(task.labels.map((_, i) => [i, true])) : {}
  );

  const usedWords = new Set(Object.values(placed));

  const handleDrop = useCallback(
    (item: string, targetId: string) => {
      if (checked) return;
      const idx = parseInt(targetId.replace("slot-", ""), 10);
      if (isNaN(idx)) return;
      // Remove item from any other slot first
      const newPlaced = { ...placed };
      for (const [key, val] of Object.entries(newPlaced)) {
        if (val === item) delete newPlaced[Number(key)];
      }
      newPlaced[idx] = item;
      setPlaced(newPlaced);
      setSelectedWord(null);
      speak(item);
    },
    [placed, checked]
  );

  const { dragState, handlePointerDown } =
    useDragAndDrop({ onDrop: handleDrop, disabled: checked });

  const handleHotspotTap = (labelIdx: number) => {
    if (checked) return;
    if (dragState.isDragging) return;
    if (!selectedWord) {
      // If slot has a word, remove it
      if (placed[labelIdx]) {
        const newPlaced = { ...placed };
        delete newPlaced[labelIdx];
        setPlaced(newPlaced);
      }
      return;
    }
    // Remove selected word from other slots
    const newPlaced = { ...placed };
    for (const [key, val] of Object.entries(newPlaced)) {
      if (val === selectedWord) delete newPlaced[Number(key)];
    }
    newPlaced[labelIdx] = selectedWord;
    setPlaced(newPlaced);
    const placedWord = selectedWord;
    setSelectedWord(null);
    speak(placedWord);
  };

  const handleWordTap = (word: string) => {
    if (checked) return;
    if (dragState.isDragging) return;
    if (usedWords.has(word)) {
      // Unplace word
      const newPlaced = { ...placed };
      for (const [key, val] of Object.entries(newPlaced)) {
        if (val === word) delete newPlaced[Number(key)];
      }
      setPlaced(newPlaced);
      setSelectedWord(null);
      return;
    }
    setSelectedWord(word === selectedWord ? null : word);
  };

  const allPlaced = task.labels.every((_, i) => placed[i]);

  const handleCheck = useCallback(() => {
    const newResults: Record<number, boolean> = {};
    let allCorrect = true;

    const rowGroups: Record<number, number[]> = {};
    task.labels.forEach((label, i) => {
      const y = label.y;
      if (!rowGroups[y]) rowGroups[y] = [];
      rowGroups[y].push(i);
    });

    for (const indices of Object.values(rowGroups)) {
      const expectedTexts = indices.map((i) => task.labels[i].text.toLowerCase());
      const consumed = new Set<string>();

      // Pass 1: exact slot matches (claim the expected word for this slot)
      for (const i of indices) {
        const placedWord = placed[i]?.toLowerCase();
        const expected = task.labels[i].text.toLowerCase();
        if (placedWord && placedWord === expected) {
          newResults[i] = true;
          consumed.add(placedWord);
        }
      }

      // Pass 2: row-swap bonus — a word placed in the wrong slot but still
      // belonging to this row counts as correct if its rightful slot hasn't
      // already claimed it
      for (const i of indices) {
        if (newResults[i]) continue;
        const placedWord = placed[i]?.toLowerCase();
        if (placedWord && expectedTexts.includes(placedWord) && !consumed.has(placedWord)) {
          newResults[i] = true;
          consumed.add(placedWord);
        } else {
          newResults[i] = false;
          allCorrect = false;
        }
      }
    }

    setResults(newResults);
    setChecked(true);
    if (allCorrect) {
      const words = task.labels.map((l) => l.text).join(", ");
      speak(words);
      setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
    }
  }, [placed, task.labels, onComplete]);

  const handleRetry = () => {
    setPlaced({});
    setChecked(false);
    setResults({});
    setSelectedWord(null);
  };

  // Retry only a single wrong label
  const handleRetrySingle = (labelIdx: number) => {
    const newPlaced = { ...placed };
    delete newPlaced[labelIdx];
    setPlaced(newPlaced);

    const newResults = { ...results };
    delete newResults[labelIdx];
    setResults(newResults);

    setChecked(false);
    setSelectedWord(null);
  };

  const allCorrect = checked && Object.values(results).every(Boolean);

  const rowGroups = useMemo(() => {
    const groups: { y: number; indices: number[] }[] = [];
    const yMap = new Map<number, number[]>();
    task.labels.forEach((label, i) => {
      const y = label.y;
      if (!yMap.has(y)) yMap.set(y, []);
      yMap.get(y)!.push(i);
    });
    [...yMap.entries()]
      .sort(([a], [b]) => a - b)
      .forEach(([y, indices]) => groups.push({ y, indices }));
    return groups;
  }, [task.labels]);

  const hasMultipleRows = rowGroups.length > 1;

  /** Slika na koju se kače oznake; ako je nema, ide zamenski raspored u redovima. */
  const slikaNaSlici = task.image ? getWordIllustration(task.image) : null;

  return (
    <div
      className="space-y-4"
      style={{ touchAction: dragState.isDragging ? "none" : "auto" }}
    >
      {/* OZNAKE STOJE NA SLICI, NE ISPOD NJE (14.08.2026)
          ==================================================================
          Prijava vlasnice: „objasni kako je moguće da je ovo rešivo" — i bila
          je u pravu, nije bilo.

          Podaci za svaku etiketu odvajkada nose `x` i `y` u procentima, dakle
          MESTO NA SLICI. Komponenta ih je koristila samo da grupiše redove, pa
          je crtala prazna polja ISPOD slike. Kad red ima jedno polje — a to je
          bio slučaj u ČETIRI od pet ovakvih zadataka — detetu ništa ne govori
          koja reč u koje polje ide. Zadatak je bio nerešiv po konstrukciji.

          Sada oznaka stoji tačno na mestu koje opisuje: na brkovima, na
          naočarima, na kapi. Dete vidi GDE se pita i zato zna ŠTA da stavi.
          Slika je i povećana — na 192 px se šest oznaka nije moglo razdvojiti.

          Provera ostaje popustljiva kao i pre (reči iz istog reda su međusobno
          zamenljive), pa porodično stablo radi kako je i radilo. */}
      {slikaNaSlici ? (
        <div className="flex justify-center">
          <div className="relative w-full max-w-[440px]">
            {/* `draggable={false}`: bez toga pregledač dozvoli da se sama slika
                odvuče (i pojavi se njena providna senka), pa detetu izgleda kao
                da je nešto pokvarilo. */}
            <img src={slikaNaSlici} alt="" draggable={false} className="w-full rounded-2xl bg-white shadow-sm p-2 select-none" />
            {task.labels.map((label, i) => (
              /* ZAMKA KOJA JE POMERALA TAČKE (14.08.2026)
                 Tačka je ranije bila jedno dugme koje je i STAJALO na mestu
                 (`transform: translate(-50%,-50%)`) i ANIMIRALO se na dodir
                 (`whileTap` = smanji na 0,95). Animacija piše u to isto polje
                 `transform` — pa čim se tačka pritisne, njeno `translate` se
                 obriše i tačka odskoči za pola svoje širine. Više dodira =
                 tačka „šeta" po licu.
                 Zato su sada DVA elementa: spoljni drži položaj i njega niko ne
                 animira, unutrašnji se smanjuje na dodir. Položaj se ne miče. */
              <div
                key={i}
                className="absolute z-10"
                style={{ left: `${label.x}%`, top: `${label.y}%`, transform: "translate(-50%, -50%)" }}
              >
              <motion.button
                data-drop-target={`slot-${i}`}
                whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
                onClick={() => handleHotspotTap(i)}
                className={`min-h-[30px] px-1.5 rounded-full border-2 text-xs sm:text-sm font-bold shadow-sm whitespace-nowrap transition-all ${
                  dragState.isDragging && !placed[i]
                    ? "border-[var(--primary)] bg-purple-100 border-dashed animate-pulse"
                    : checked
                      ? results[i]
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-400 bg-red-50 text-red-700"
                      : placed[i]
                        ? "border-[var(--primary)] bg-white text-[var(--primary)]"
                        : "border-dashed border-[var(--primary)] bg-white/90 w-9"
                }`}
                aria-label={placed[i] || "Lloc buit"}
              >
                {placed[i] ? (
                  <span className="flex items-center gap-1">
                    {placed[i]}
                    {checked && (results[i] ? " ✅" : (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); handleRetrySingle(i); }}
                        className="inline-flex items-center justify-center rounded-full hover:bg-orange-100"
                        aria-label="Torna a provar"
                      >
                        <RefreshCcw className="w-4 h-4 text-orange-500" />
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="block w-3 h-3 mx-auto rounded-full bg-[var(--primary)]" />
                )}
              </motion.button>
              </div>
            ))}
          </div>
        </div>
      ) : (

      /* Bez slike nema gde da se stane — ostaje stari raspored u redovima. */
      <div className="relative bg-white rounded-2xl p-4 shadow-sm min-h-[200px]">
        <div className="space-y-3">
          {rowGroups.map((row, rowIdx) => (
            <div key={row.y}>
              {hasMultipleRows && rowIdx > 0 && (
                <div className="border-t border-dashed border-gray-200 mb-3" />
              )}
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${row.indices.length}, 1fr)` }}>
                {row.indices.map((i) => (
                  <motion.button
                    key={i}
                    data-drop-target={`slot-${i}`}
                    whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
                    onClick={() => handleHotspotTap(i)}
                    className={`min-h-[60px] rounded-xl border-2 flex items-center justify-center gap-2 p-3 text-base font-bold transition-all ${
                      dragState.isDragging && !placed[i]
                        ? "border-[var(--primary)] bg-purple-50 border-dashed animate-pulse"
                        : checked
                          ? results[i]
                            ? "border-green-400 bg-green-50 text-green-700"
                            : "border-red-400 bg-red-50 text-red-700"
                          : placed[i]
                            ? "border-[var(--primary)] bg-purple-50 text-[var(--primary)]"
                            : "border-dashed border-gray-300 bg-gray-50 text-gray-400"
                    }`}
                  >
                    {placed[i] ? (
                      <>
                        {getWordIllustration(placed[i]) ? <img src={getWordIllustration(placed[i])!} alt="" className="w-10 h-10 object-contain inline" /> : null}
                        {placed[i]}
                        {checked && (results[i] ? " ✅" : (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetrySingle(i);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                handleRetrySingle(i);
                              }
                            }}
                            className="inline-flex items-center justify-center p-1 ml-1 rounded-full hover:bg-orange-100 transition-colors cursor-pointer"
                            aria-label="Torna a provar"
                          >
                            <RefreshCcw className="w-4 h-4 text-orange-500" />
                          </span>
                        ))}
                      </>
                    ) : (
                      /* PRAZNO MESTO — bez znaka pitanja (14.08.2026, zahtev vlasnice).
                           Znak pitanja je izgledao kao da slika nedostaje ili da je
                           aplikacija pokvarena. Sada je prazan isprekidan krug: „ovde
                           nešto ide", bez poruke da nešto fali. */
                      <span className="block w-6 h-6 rounded-full border-2 border-dashed border-current opacity-60">{dragState.isDragging ? "" : ""}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Word bank - drag sources */}
      <div>
        <p className="text-sm text-[var(--text-light)] mb-2">
          {dragState.isDragging
            ? "Arrossega la paraula al lloc correcte!"
            : selectedWord
              ? `Col·loca "${selectedWord}" en el lloc correcte`
              : "Tria o arrossega una paraula:"}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {task.options.map((word) => {
            const isBeingDragged = dragState.isDragging && dragState.draggedItem === word;
            return (
              <motion.div
                key={word}
                role="button"
                tabIndex={checked ? -1 : 0}
                whileTap={dragState.isDragging ? undefined : { scale: 0.95 }}
                onClick={() => { if (!checked) handleWordTap(word); }}
                onKeyDown={(e) => {
                  if (!checked && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleWordTap(word);
                  }
                }}
                onPointerDown={(e) => {
                  if (!checked && !usedWords.has(word)) {
                    handlePointerDown(word, "bank", e);
                  }
                }}
                aria-disabled={checked}
                className={`px-4 py-3 min-h-[48px] rounded-xl font-bold text-base transition-all select-none ${
                  isBeingDragged
                    ? "opacity-40 bg-gray-100 text-gray-300"
                    : usedWords.has(word)
                      ? "bg-gray-100 text-gray-300 line-through"
                      : selectedWord === word
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--accent)] text-[var(--text)]"
                }`}
                style={{ cursor: checked || usedWords.has(word) ? "default" : "grab" }}
              >
                {getWordIllustration(word) ? <img src={getWordIllustration(word)!} alt="" className="w-12 h-12 object-contain inline mr-1" /> : null}
                {word}
                {!checked && !usedWords.has(word) && (
                  <SpeakerButton text={word} size={14} className="ml-1 inline-block" light={selectedWord === word} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Comprova button */}
      {allPlaced && !checked && (
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
      {checked && !allCorrect && (
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

      {/* Drag overlay */}
      <DragOverlay word={dragState.draggedItem} position={dragState.dragPosition} />
    </div>
  );
}
