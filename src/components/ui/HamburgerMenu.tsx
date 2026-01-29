"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Settings, Trophy, Star } from "lucide-react";
import Link from "next/link";
import { getTotalStars, getEarnedBadgeIds, allBadges } from "@/lib/badges";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    if (open) {
      setStars(getTotalStars());
      setBadgeCount(getEarnedBadgeIds().size);
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Menú"
      >
        <Menu size={24} className="text-[var(--text)]" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-black text-[var(--primary)]">Menú</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Stats */}
              <div className="p-4 bg-purple-50 mx-4 mt-4 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <Star size={20} className="text-amber-500" />
                  <span className="font-bold text-[var(--text)]">{stars} estrelles</span>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy size={20} className="text-[var(--primary)]" />
                  <span className="font-bold text-[var(--text)]">{badgeCount}/{allBadges.length} insígnies</span>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 p-4 space-y-2">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[var(--text)] hover:bg-gray-50 transition-colors"
                >
                  <Home size={20} />
                  Inici
                </Link>
                <Link
                  href="/configuracio"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[var(--text)] hover:bg-gray-50 transition-colors"
                >
                  <Settings size={20} />
                  Configuració
                </Link>
              </nav>

              <div className="p-4 text-xs text-center text-[var(--text-light)]">
                Català - Aprèn jugant! v1.0
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
