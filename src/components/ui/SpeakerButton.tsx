"use client";

import { Volume2 } from "lucide-react";
import { speak } from "@/lib/tts";

interface SpeakerButtonProps {
  text: string;
  size?: number;
  className?: string;
  light?: boolean;
}

export default function SpeakerButton({
  text,
  size = 18,
  className = "",
  light = false,
}: SpeakerButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl ${light ? "hover:bg-white/20" : "hover:bg-purple-50"} active:scale-90 transition-all ${className}`}
      aria-label={`Escolta: ${text}`}
    >
      <Volume2 size={size} className={light ? "text-white" : "text-[var(--primary)]"} />
    </button>
  );
}
