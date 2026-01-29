"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface DrawingCanvasTask {
  id: string;
  type: "drawing-canvas";
  prompt: string;
}

interface Props {
  task: DrawingCanvasTask;
  onComplete: (correct: boolean) => void;
}

const COLORS = [
  "#2D3436", "#FF6B6B", "#0984E3", "#00B894",
  "#FDCB6E", "#E84393", "#FF9F43", "#6C5CE7",
];

export default function DrawingCanvas({ task, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [lineWidth, setLineWidth] = useState(4);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

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
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
    setHasDrawn(true);
  }, [color, lineWidth]);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setDrawing(true);
    const pos = getPos(e);
    if (pos) lastPos.current = pos;
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
    // Redraw white background
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
    <div className="space-y-4">
      {/* Color palette */}
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {COLORS.map((c) => (
          <motion.button
            key={c}
            whileTap={{ scale: 0.9 }}
            onClick={() => setColor(c)}
            className={`w-10 h-10 rounded-full transition-all ${
              color === c ? "ring-3 ring-[var(--primary)] scale-110" : ""
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => setLineWidth(2)}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${lineWidth === 2 ? "border-[var(--primary)]" : "border-gray-200"}`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
          </button>
          <button
            onClick={() => setLineWidth(4)}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${lineWidth === 4 ? "border-[var(--primary)]" : "border-gray-200"}`}
          >
            <div className="w-3 h-3 rounded-full bg-current" />
          </button>
          <button
            onClick={() => setLineWidth(8)}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${lineWidth === 8 ? "border-[var(--primary)]" : "border-gray-200"}`}
          >
            <div className="w-5 h-5 rounded-full bg-current" />
          </button>
        </div>
      </div>

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
          onClick={() => onComplete(true)}
          disabled={!hasDrawn}
          className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg disabled:opacity-40 shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
        >
          Fet!
        </motion.button>
      </div>
    </div>
  );
}
