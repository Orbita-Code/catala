"use client";

import { motion, AnimatePresence } from "framer-motion";

interface XPGainAnimationProps {
  amount: number;
  visible: boolean;
}

export default function XPGainAnimation({ amount, visible }: XPGainAnimationProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: -30, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg">
            <span className="text-white font-black text-xl">+{amount} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
