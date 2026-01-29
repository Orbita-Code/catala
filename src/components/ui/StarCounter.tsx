"use client";

import { motion } from "framer-motion";

interface StarCounterProps {
  count: number;
  total: number;
}

export default function StarCounter({ count, total }: StarCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200"
    >
      <span className="text-2xl">⭐</span>
      <span className="text-lg font-black text-amber-700">
        {count}
        <span className="text-sm font-semibold text-amber-500">/{total}</span>
      </span>
    </motion.div>
  );
}
