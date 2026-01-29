"use client";

import { Volume2 } from "lucide-react";
import { speak } from "@/lib/tts";

interface SpeakerButtonProps {
  text: string;
  size?: number;
  className?: string;
}

export default function SpeakerButton({
  text,
  size = 18,
  className = "",
}: SpeakerButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      className={`p-1.5 rounded-lg hover:bg-purple-50 transition-colors ${className}`}
      aria-label={`Escolta: ${text}`}
    >
      <Volume2 size={size} className="text-[var(--primary)]" />
    </button>
  );
}
