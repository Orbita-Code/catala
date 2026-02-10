"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { WordSearchTask, TaskResult } from "@/types/tasks";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { speak } from "@/lib/tts";
import { getWordIllustration } from "@/lib/illustrations";

const WORD_COLORS = [
  { bg: "bg-green-200", text: "text-green-800" },
  { bg: "bg-blue-200", text: "text-blue-800" },
  { bg: "bg-pink-200", text: "text-pink-800" },
  { bg: "bg-yellow-200", text: "text-yellow-800" },
  { bg: "bg-purple-200", text: "text-purple-800" },
  { bg: "bg-orange-200", text: "text-orange-800" },
  { bg: "bg-teal-200", text: "text-teal-800" },
  { bg: "bg-red-200", text: "text-red-800" },
];

interface Props {
  task: WordSearchTask;
  onComplete: (result: TaskResult) => void;
}

export default function WordSearch({ task, onComplete }: Props) {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [foundCells, setFoundCells] = useState<Map<string, number>>(new Map());
  const gridRef = useRef<HTMLDivElement>(null);

  const cellKey = (r: number, c: number) => `${r}-${c}`;

  const stripAccents = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const checkWord = useCallback(
    (cells: [number, number][]) => {
      const letters = cells.map(([r, c]) => task.grid[r][c]).join("");
      const reversed = [...letters].reverse().join("");
      const lettersNorm = stripAccents(letters);
      const reversedNorm = stripAccents(reversed);

      for (const word of task.words) {
        const wordNorm = stripAccents(word);
        if (lettersNorm === wordNorm || reversedNorm === wordNorm) {
          return word;
        }
      }
      return null;
    },
    [task.grid, task.words]
  );

  const handleCellDown = (r: number, c: number) => {
    setSelecting(true);
    setSelectedCells([[r, c]]);
  };

  const handleCellEnter = useCallback(
    (r: number, c: number) => {
      if (!selecting) return;
      if (selectedCells.length === 0) return;

      const [startR, startC] = selectedCells[0];
      const dr = Math.sign(r - startR);
      const dc = Math.sign(c - startC);

      if (dr === 0 && dc === 0) return;
      if (dr !== 0 && dc !== 0 && Math.abs(r - startR) !== Math.abs(c - startC)) return;

      const cells: [number, number][] = [];
      let cr = startR,
        cc = startC;
      while (cr !== r + dr || cc !== c + dc) {
        cells.push([cr, cc]);
        cr += dr;
        cc += dc;
        if (cells.length > task.gridSize) break;
      }
      setSelectedCells(cells);
    },
    [selecting, selectedCells, task.gridSize]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!selecting) return;
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!el) return;
      const cell = el.closest("[data-cell]");
      if (!cell) return;
      const r = Number(cell.getAttribute("data-row"));
      const c = Number(cell.getAttribute("data-col"));
      if (!isNaN(r) && !isNaN(c)) {
        handleCellEnter(r, c);
      }
    },
    [selecting, handleCellEnter]
  );

  const handleCellUp = () => {
    setSelecting(false);
    const word = checkWord(selectedCells);
    if (word && !foundWords.has(word)) {
      const newFound = new Set(foundWords);
      newFound.add(word);
      setFoundWords(newFound);

      const colorIndex = task.words.indexOf(word) % WORD_COLORS.length;
      const newCells = new Map(foundCells);
      selectedCells.forEach(([r, c]) => newCells.set(cellKey(r, c), colorIndex));
      setFoundCells(newCells);

      // Speak the found word
      speak(word);
      // Mini celebration for each found word
      celebrate();

      if (newFound.size === task.words.length) {
        setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1000);
      }
    }
    setSelectedCells([]);
  };

  const isSelected = (r: number, c: number) =>
    selectedCells.some(([sr, sc]) => sr === r && sc === c);

  const getCellClass = (r: number, c: number) => {
    const key = cellKey(r, c);
    if (foundCells.has(key)) {
      const colorIndex = foundCells.get(key)!;
      const color = WORD_COLORS[colorIndex];
      return `${color.bg} ${color.text}`;
    }
    if (isSelected(r, c)) {
      return "bg-purple-200 text-[var(--primary)]";
    }
    return "bg-gray-50 text-[var(--text)] hover:bg-gray-100";
  };

  return (
    <div className="space-y-4">
      {/* Word list with illustrations */}
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {task.words.map((word, i) => {
          const isFound = foundWords.has(word);
          const color = WORD_COLORS[i % WORD_COLORS.length];
          const illustration = getWordIllustration(word);
          return (
            <motion.div
              key={word}
              className="flex flex-col items-center gap-0.5"
              animate={isFound ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {isFound && illustration ? (
                <motion.img
                  src={illustration}
                  alt={word}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 8, stiffness: 200 }}
                />
              ) : illustration ? (
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                  ❓
                </div>
              ) : null}
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold font-handwriting ${
                  isFound
                    ? `${color.bg} ${color.text} line-through`
                    : "bg-purple-100 text-[var(--primary)]"
                }`}
              >
                {word}
              </span>
            </motion.div>
          );
        })}
      </div>


      <div
        ref={gridRef}
        className="bg-white rounded-2xl p-3 shadow-sm inline-block mx-auto select-none touch-none"
        onMouseUp={handleCellUp}
        onMouseLeave={handleCellUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleCellUp}
      >
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${task.gridSize}, minmax(0, 1fr))`,
          }}
        >
          {task.grid.map((row, r) =>
            row.map((letter, c) => (
              <motion.div
                key={cellKey(r, c)}
                data-cell
                data-row={r}
                data-col={c}
                onMouseDown={() => handleCellDown(r, c)}
                onMouseEnter={() => handleCellEnter(r, c)}
                onTouchStart={() => handleCellDown(r, c)}
                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base font-bold rounded-md cursor-pointer select-none transition-colors ${getCellClass(r, c)}`}
              >
                {letter.toUpperCase()}
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="text-center text-sm text-[var(--text-light)]">
        {foundWords.size}/{task.words.length} paraules trobades
      </div>
    </div>
  );
}
