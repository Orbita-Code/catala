"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

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

type Tool = "brush" | "bucket" | "sticker" | "eraser";

const COLORS = [
  "#2D3436", "#FF6B6B", "#0984E3", "#00B894",
  "#FDCB6E", "#E84393", "#FF9F43", "#6C5CE7",
];

const STICKERS = ["⭐", "🌈", "❤️", "🌸", "🦋", "😊", "🎵", "✨"];

const TOOL_ICONS: Record<Tool, { emoji: string; label: string }> = {
  brush: { emoji: "🖌️", label: "Pinzell" },
  bucket: { emoji: "🪣", label: "Omplir" },
  sticker: { emoji: "🏷️", label: "Adhesius" },
  eraser: { emoji: "🧹", label: "Goma" },
};

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

  // Don't fill if already the same color
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

export default function DrawingCanvas({ task, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [tool, setTool] = useState<Tool>("brush");
  const [selectedSticker, setSelectedSticker] = useState(STICKERS[0]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const lineWidth = tool === "eraser" ? 20 : 6;

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
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
    setHasDrawn(true);
  }, [color, lineWidth, tool]);

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
      return;
    }

    setDrawing(true);
    lastPos.current = pos;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="space-y-3">
      {/* Tool buttons */}
      <div className="flex items-center gap-2 justify-center">
        {(Object.keys(TOOL_ICONS) as Tool[]).map((t) => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTool(t)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
              tool === t
                ? "bg-[var(--primary)] text-white shadow-md scale-105"
                : "bg-gray-100 text-[var(--text)]"
            }`}
          >
            <span className="text-xl">{TOOL_ICONS[t].emoji}</span>
            <span className="text-[10px] font-bold">{TOOL_ICONS[t].label}</span>
          </motion.button>
        ))}
      </div>

      {/* Color palette */}
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {COLORS.map((c) => (
          <motion.button
            key={c}
            whileTap={{ scale: 0.9 }}
            onClick={() => setColor(c)}
            className={`w-9 h-9 rounded-full transition-all ${
              color === c && tool !== "sticker" ? "ring-3 ring-[var(--primary)] scale-110" : ""
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Sticker picker - only visible when sticker tool active */}
      {tool === "sticker" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 justify-center flex-wrap"
        >
          {STICKERS.map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedSticker(s)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-all ${
                selectedSticker === s ? "bg-purple-100 ring-2 ring-[var(--primary)] scale-110" : "bg-gray-50"
              }`}
            >
              {s}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Canvas */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-gray-100">
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
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          className="px-6 py-3 bg-gray-100 text-[var(--text)] font-bold rounded-2xl text-base"
        >
          Esborra tot
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete({ allCorrect: true, erroredItems: [] })}
          disabled={!hasDrawn}
          className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg disabled:opacity-40 shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
        >
          Fet!
        </motion.button>
      </div>
    </div>
  );
}
