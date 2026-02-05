"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Play, Sparkles } from "lucide-react";
import Image from "next/image";

interface DrawingCanvasTask {
  id: string;
  type: "drawing-canvas";
  prompt: string;
  bonus?: boolean;
}

interface Props {
  task: DrawingCanvasTask;
  onComplete: (result: { allCorrect: boolean; erroredItems: string[] }) => void;
}

type Tool = "brush" | "rainbow" | "neon" | "magic" | "mirror" | "bucket" | "sticker" | "eraser";

const COLORS = [
  "#2D3436", "#FF6B6B", "#0984E3", "#00B894",
  "#FDCB6E", "#E84393", "#FF9F43", "#6C5CE7",
];

const NEON_COLORS = [
  "#FF0080", "#00FFFF", "#FF00FF", "#00FF00",
  "#FFFF00", "#FF6600", "#00FF80", "#8000FF",
];

const MAGIC_SHAPES = ["❤️", "⭐", "🌸", "💎", "🦋", "✨", "🌟", "💫"];

const STICKERS = [
  // Fun basics
  "⭐", "🌈", "❤️", "✨", "🎵", "😊", "🎉", "🎈",
  // Animals
  "🦋", "🐱", "🐶", "🐰", "🦁", "🐻", "🐼", "🦊",
  "🦄", "🐬", "🐢", "🦀", "🐝", "🐞", "🦖", "🦕",
  // Vehicles & boys stuff
  "🚗", "🚀", "✈️", "🚂", "🏎️", "🚁", "⚽", "🏀",
  // Nature & food
  "🌸", "🌻", "🌺", "🍎", "🍦", "🍕", "🧁", "🍭",
  // More fun
  "👑", "💎", "🎀", "🌟", "💫", "🔥", "⚡", "🎪",
];

const TOOL_CONFIG: Record<Tool, { emoji: string; label: string; description: string }> = {
  brush: { emoji: "🖌️", label: "Pinzell", description: "Dibuixa lliure" },
  rainbow: { emoji: "🌈", label: "Arc iris", description: "Colors màgics!" },
  neon: { emoji: "✨", label: "Neó", description: "Brilla en fosc!" },
  magic: { emoji: "💫", label: "Màgic", description: "Formes automàtiques" },
  mirror: { emoji: "🪞", label: "Mirall", description: "Dibuix simètric" },
  bucket: { emoji: "🪣", label: "Omplir", description: "Omple de color" },
  sticker: { emoji: "🏷️", label: "Adhesius", description: "Enganxa coses!" },
  eraser: { emoji: "🧹", label: "Goma", description: "Esborra" },
};

// Sound effects (using Web Audio API for simple sounds)
function playSound(type: "pop" | "sparkle" | "whoosh") {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "pop") {
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "sparkle") {
      osc.frequency.value = 1200;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "whoosh") {
      osc.frequency.value = 400;
      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch {
    // Audio not supported
  }
}

function colorMatch(r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number, tolerance: number): boolean {
  return (
    Math.abs(r1 - r2) <= tolerance &&
    Math.abs(g1 - g2) <= tolerance &&
    Math.abs(b1 - b2) <= tolerance &&
    Math.abs(a1 - a2) <= tolerance
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function floodFill(ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string, width: number, height: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const [fr, fg, fb] = hexToRgb(fillColor);

  const sx = Math.round(startX);
  const sy = Math.round(startY);
  if (sx < 0 || sx >= width || sy < 0 || sy >= height) return;

  const startIdx = (sy * width + sx) * 4;
  const sr = data[startIdx];
  const sg = data[startIdx + 1];
  const sb = data[startIdx + 2];
  const sa = data[startIdx + 3];

  if (sr === fr && sg === fg && sb === fb && sa === 255) return;

  const tolerance = 30;
  const stack: [number, number][] = [[sx, sy]];
  const visited = new Uint8Array(width * height);

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const pi = idx * 4;
    if (!colorMatch(data[pi], data[pi + 1], data[pi + 2], data[pi + 3], sr, sg, sb, sa, tolerance)) continue;

    data[pi] = fr;
    data[pi + 1] = fg;
    data[pi + 2] = fb;
    data[pi + 3] = 255;

    if (x > 0) stack.push([x - 1, y]);
    if (x < width - 1) stack.push([x + 1, y]);
    if (y > 0) stack.push([x, y - 1]);
    if (y < height - 1) stack.push([x, y + 1]);
  }

  ctx.putImageData(imageData, 0, 0);
}

// Rainbow color generator
function getRainbowColor(t: number): string {
  const r = Math.sin(t * 0.1) * 127 + 128;
  const g = Math.sin(t * 0.1 + 2) * 127 + 128;
  const b = Math.sin(t * 0.1 + 4) * 127 + 128;
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export default function DrawingCanvas({ task, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[1]); // Start with red
  const [tool, setTool] = useState<Tool>("brush");
  const [selectedSticker, setSelectedSticker] = useState(STICKERS[0]);
  const [selectedMagicShape, setSelectedMagicShape] = useState(MAGIC_SHAPES[0]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isNeonMode, setIsNeonMode] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const rainbowT = useRef(0);
  const drawHistory = useRef<ImageData[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);

  const lineWidth = tool === "eraser" ? 20 : tool === "neon" ? 12 : 6;

  // Save canvas state for replay
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Save every 10th frame to avoid memory issues
    if (drawHistory.current.length < 100) {
      drawHistory.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
  }, []);

  const getPos = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const draw = useCallback((pos: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPos.current) return;

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);

    if (tool === "eraser") {
      ctx.strokeStyle = isNeonMode ? "#1a1a2e" : "#FFFFFF";
    } else if (tool === "rainbow") {
      rainbowT.current += 1;
      ctx.strokeStyle = getRainbowColor(rainbowT.current);
    } else if (tool === "neon") {
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
    } else if (tool === "mirror") {
      // Draw on both sides
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Mirror stroke
      ctx.beginPath();
      ctx.moveTo(canvas.width - lastPos.current.x, lastPos.current.y);
      ctx.lineTo(canvas.width - pos.x, pos.y);
    } else {
      ctx.strokeStyle = color;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Reset shadow for neon
    if (tool === "neon") {
      ctx.shadowBlur = 0;
    }

    lastPos.current = pos;
    setHasDrawn(true);
    saveState();
  }, [color, lineWidth, tool, isNeonMode, saveState]);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;

    if (tool === "bucket") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      floodFill(ctx, pos.x, pos.y, color, canvas.width, canvas.height);
      setHasDrawn(true);
      playSound("whoosh");
      saveState();
      return;
    }

    if (tool === "sticker") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = "48px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(selectedSticker, pos.x, pos.y);
      setHasDrawn(true);
      playSound("pop");
      saveState();
      return;
    }

    if (tool === "magic") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = "36px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(selectedMagicShape, pos.x, pos.y);
      setHasDrawn(true);
      playSound("sparkle");

      // Add sparkle effect
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 500);
      saveState();
      return;
    }

    setDrawing(true);
    lastPos.current = pos;

    if (tool === "neon" || tool === "rainbow") {
      playSound("sparkle");
    }
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    if (pos) draw(pos);
  };

  const handleEnd = () => {
    setDrawing(false);
    lastPos.current = null;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = isNeonMode ? "#1a1a2e" : "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    drawHistory.current = [];
    playSound("whoosh");
  };

  const handleReplay = async () => {
    if (drawHistory.current.length === 0 || isReplaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsReplaying(true);
    ctx.fillStyle = isNeonMode ? "#1a1a2e" : "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drawHistory.current.length; i++) {
      ctx.putImageData(drawHistory.current[i], 0, 0);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setIsReplaying(false);
  };

  const toggleNeonMode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newMode = !isNeonMode;
    setIsNeonMode(newMode);

    if (!hasDrawn) {
      ctx.fillStyle = newMode ? "#1a1a2e" : "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (newMode) {
      setColor(NEON_COLORS[0]);
      setTool("neon");
    } else {
      setColor(COLORS[1]);
      setTool("brush");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const currentColors = isNeonMode ? NEON_COLORS : COLORS;

  return (
    <div className="space-y-3">
      {/* Sparkle overlay effect */}
      <AnimatePresence>
        {showSparkles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 2, rotate: 180 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-6xl"
            >
              ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neon mode toggle */}
      <div className="flex justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleNeonMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
            isNeonMode
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/50"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Sparkles size={18} />
          {isNeonMode ? "Mode Neó ACTIVAT! ✨" : "Activa Mode Neó"}
        </motion.button>
      </div>

      {/* Tool buttons */}
      <div className="flex items-center gap-1.5 justify-center flex-wrap">
        {(Object.keys(TOOL_CONFIG) as Tool[]).map((t) => {
          const config = TOOL_CONFIG[t];
          const isActive = tool === t;
          return (
            <motion.button
              key={t}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTool(t)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                isActive
                  ? isNeonMode
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                    : "bg-[var(--primary)] text-white shadow-md scale-105"
                  : "bg-gray-100 text-[var(--text)] hover:bg-gray-200"
              }`}
              title={config.description}
            >
              <span className="text-lg">{config.emoji}</span>
              <span className="text-[9px] font-bold">{config.label}</span>
            </motion.button>
          );
        })}
        {/* Replay button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleReplay}
          disabled={!hasDrawn || isReplaying}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-40 transition-all"
          title="Mira el teu dibuix!"
        >
          <Play size={18} className={isReplaying ? "animate-pulse" : ""} />
          <span className="text-[9px] font-bold">{isReplaying ? "..." : "Replay"}</span>
        </motion.button>
        {/* Reset button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleClear}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl bg-red-100 text-red-500 hover:bg-red-200 transition-all"
          title="Torna a començar"
        >
          <RefreshCcw size={18} />
          <span className="text-[9px] font-bold">Esborra</span>
        </motion.button>
      </div>

      {/* Color palette */}
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {currentColors.map((c) => (
          <motion.button
            key={c}
            whileTap={{ scale: 0.9 }}
            onClick={() => setColor(c)}
            className={`w-8 h-8 rounded-full transition-all ${
              color === c ? "ring-3 ring-offset-2 ring-[var(--primary)] scale-110" : ""
            } ${isNeonMode ? "shadow-lg" : ""}`}
            style={{
              backgroundColor: c,
              boxShadow: isNeonMode ? `0 0 10px ${c}` : undefined
            }}
          />
        ))}
      </div>

      {/* Magic shape picker */}
      {tool === "magic" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2 justify-center flex-wrap bg-purple-50 rounded-xl p-2"
        >
          <span className="text-xs text-purple-600 font-bold">Tria forma:</span>
          {MAGIC_SHAPES.map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedMagicShape(s)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl transition-all ${
                selectedMagicShape === s ? "bg-purple-200 ring-2 ring-purple-400 scale-105" : "bg-white"
              }`}
            >
              {s}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Sticker picker */}
      {tool === "sticker" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-xl p-2 max-h-32 overflow-y-auto"
        >
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
            {STICKERS.map((s) => (
              <motion.button
                key={s}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedSticker(s)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl transition-all ${
                  selectedSticker === s ? "bg-purple-200 ring-2 ring-[var(--primary)] scale-105" : "bg-white hover:bg-purple-50"
                }`}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Canvas */}
      <div className={`rounded-2xl shadow-sm overflow-hidden border-2 ${
        isNeonMode ? "border-purple-500 shadow-purple-500/30 shadow-lg" : "border-gray-100"
      }`}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full touch-none cursor-crosshair"
          style={{ aspectRatio: "3/2" }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete({ allCorrect: true, erroredItems: [] })}
          disabled={!hasDrawn}
          className={`px-8 py-3 font-bold rounded-2xl text-lg disabled:opacity-40 shadow-lg transition-all ${
            isNeonMode
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white"
              : "bg-[var(--primary)] text-white shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
          }`}
        >
          Fet! 🎨
        </motion.button>
      </div>
    </div>
  );
}
