"use client";

import { motion, AnimatePresence } from "framer-motion";
import AnimatedStar from "@/components/star/AnimatedStar";

interface HintDialogProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function HintDialog({ visible, onAccept, onDecline }: HintDialogProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 30 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="flex justify-center mb-4">
              <AnimatedStar
                size="lg"
                expression="smart"
                animation="bounce"
              />
            </div>
            <h3 className="text-xl font-black text-center text-[var(--text)] mb-2">
              Necessites ajuda?
            </h3>
            <p className="text-center text-[var(--text-light)] text-sm mb-6">
              Et puc donar una pista!
            </p>
            <div className="flex flex-col gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onAccept}
                className="w-full py-3.5 bg-[var(--success)] text-white font-bold rounded-2xl text-lg shadow-md"
              >
                Sí, ajuda&apos;m!
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onDecline}
                className="w-full py-3.5 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
              >
                No, ho puc fer!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
