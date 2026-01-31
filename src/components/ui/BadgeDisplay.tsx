"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
              {badge.slug ? (
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image
                    src={`/covers/${badge.slug}.png`}
                    alt={badge.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <span className="text-4xl">{badge.emoji}</span>
              )}
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
