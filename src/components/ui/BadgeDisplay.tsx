"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { allBadges, getEarnedBadgeIds } from "@/lib/badges";

export default function BadgeDisplay() {
  const [earned, setEarned] = useState<Set<string>>(new Set());

  useEffect(() => {
    setEarned(getEarnedBadgeIds());
  }, []);

  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--text)] mb-3">
        Les meves insígnies ({earned.size}/{allBadges.length})
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {allBadges.map((badge, i) => {
          const isEarned = earned.has(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isEarned ? "" : "grayscale opacity-40"
              }`}
              title={badge.description}
            >
              <span className="text-3xl">{badge.emoji}</span>
              <span className="text-[10px] font-bold text-[var(--text)] text-center leading-tight">
                {badge.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
