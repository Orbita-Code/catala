"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StarSpeechBubbleProps {
  message: string | null;
  position?: "right" | "top" | "bottom";
}

export default function StarSpeechBubble({
  message,
  position = "right",
}: StarSpeechBubbleProps) {
  const positionClasses: Record<string, string> = {
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  };

  const tailElement: Record<string, React.ReactNode> = {
    right: (
      <div className="absolute left-[-7px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[7px] border-r-white" />
    ),
    top: (
      <div className="absolute bottom-[-7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-white" />
    ),
    bottom: (
      <div className="absolute top-[-7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[7px] border-b-white" />
    ),
  };

  const initDir =
    position === "right" ? { x: -8 } : position === "top" ? { y: 8 } : { y: -8 };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, ...initDir }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, ...initDir }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`absolute whitespace-nowrap ${positionClasses[position]}`}
        >
          <div className="relative bg-white rounded-2xl px-3 py-1.5 shadow-md border border-gray-100 max-w-[200px]">
            {tailElement[position]}
            <p className="text-sm font-bold text-[var(--text)] whitespace-normal">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
