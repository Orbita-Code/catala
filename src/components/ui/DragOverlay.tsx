"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { getWordEmoji, getWordIllustration } from "@/lib/illustrations";

interface DragOverlayProps {
  word: string | null;
  position: { x: number; y: number } | null;
}

export default function DragOverlay({ word, position }: DragOverlayProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !word || !position) return null;

  return createPortal(
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="px-5 py-3 rounded-2xl bg-[var(--primary)] text-white font-bold text-lg shadow-xl scale-110 opacity-90">
        {getWordIllustration(word) ? <img src={getWordIllustration(word)!} alt="" className="w-6 h-6 object-contain inline mr-1" /> : getWordEmoji(word) ? <span className="mr-1">{getWordEmoji(word)}</span> : null}
        {word}
      </div>
    </div>,
    document.body
  );
}
