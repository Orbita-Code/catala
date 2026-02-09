"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { getLevelByNumber, type Level } from "@/lib/levels";
import { celebrateBig } from "@/lib/confetti";
import { playThemeComplete } from "@/lib/audio";

interface LevelUpCelebrationProps {
  previousLevel: number;
  newLevel: number;
  onClose: () => void;
}

export default function LevelUpCelebration({
  previousLevel,
  newLevel,
  onClose,
}: LevelUpCelebrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const newLevelData = getLevelByNumber(newLevel);
  const prevLevelData = getLevelByNumber(previousLevel);

  useEffect(() => {
    // Trigger confetti and sound
    celebrateBig(["#6c5ce7", "#fdcb6e", "#00cece", "#ff6b6b"]);
    playThemeComplete();

    // Multiple confetti waves
    const timer1 = setTimeout(() => {
      celebrateBig(["#a29bfe", "#fdcb6e"]);
    }, 500);
    const timer2 = setTimeout(() => {
      celebrateBig(["#00cece", "#00b894"]);
    }, 1000);
    const timer3 = setTimeout(() => setShowDetails(true), 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (!newLevelData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Floating stars decoration */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: `${20 + Math.random() * 60}%`,
                  y: "110%",
                  rotate: 0,
                  opacity: 0.7,
                }}
                animate={{
                  y: "-10%",
                  rotate: 360,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "linear",
                }}
              >
                {["✨", "🌟", "⭐", "💫"][i % 4]}
              </motion.div>
            ))}
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="flex items-center justify-center gap-2 text-yellow-300 mb-2">
              <Sparkles size={24} />
              <span className="text-lg font-bold uppercase tracking-wider">Nivell Nou!</span>
              <Sparkles size={24} />
            </div>
          </motion.div>

          {/* Level transition */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3, damping: 10 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              {prevLevelData && (
                <>
                  <img
                    src={prevLevelData.image}
                    alt={prevLevelData.name}
                    className="w-14 h-14 object-contain opacity-50"
                  />
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-2xl text-white/70"
                  >
                    →
                  </motion.div>
                </>
              )}
              <motion.img
                src={newLevelData.image}
                alt={newLevelData.name}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-24 h-24 object-contain drop-shadow-lg"
              />
            </div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-black text-white mb-1"
            >
              {newLevelData.name}
            </motion.h2>
            <p className="text-purple-200 font-semibold">
              Nivell {newLevelData.level}
            </p>
          </motion.div>

          {/* Details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-white/90 text-lg">
                  {getEncouragementMessage(newLevel)}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full py-3 bg-white text-purple-600 font-bold rounded-2xl text-lg shadow-lg hover:bg-purple-50 transition-colors"
                >
                  Continua! 🚀
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getEncouragementMessage(level: number): string {
  const messages: Record<number, string> = {
    2: "Ja ets un estudiant! Continua aprenent!",
    3: "Ets un aprenent fantàstic!",
    4: "Explora el món del català!",
    5: "Les aventures esperen!",
    6: "Has descobert moltes coses noves!",
    7: "Ets un expert en català!",
    8: "El mestre del català!",
    9: "Campió increïble!",
    10: "Una llegenda del català!",
    11: "Heroi del llenguatge!",
    12: "SUPERESTRELLA! Has arribat al màxim!",
  };
  return messages[level] || "Molt bé! Continua així!";
}
