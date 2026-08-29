"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeCard from "@/components/ui/ThemeCard";
import AnimatedStar from "@/components/star/AnimatedStar";
import { getStarReaction } from "@/lib/starReactions";
import BadgeDisplay from "@/components/ui/BadgeDisplay";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import InstallPrompt from "@/components/ui/InstallPrompt";
import { XPProgressHeader, DailyRewardModal } from "@/components/gamification";
import { themes } from "@/data/themes";
import { getScoringTaskCount, getCompletedScoringCount } from "@/data/task-data";
import { getProgress, shouldShowDailyReward } from "@/lib/progress";
import { brojSlicica } from "@/lib/album";
import { getLevelProgress } from "@/lib/levels";
import type { Level } from "@/lib/levels";
import type { UserProgress } from "@/types/tasks";

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress>({});
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [levelData, setLevelData] = useState<{
    currentLevel: Level;
    nextLevel: Level | null;
    currentXP: number;
    progressPercent: number;
    xpNeededForNext: number;
    xpInCurrentLevel: number;
  } | null>(null);

  useEffect(() => {
    setProgress(getProgress());
    setLevelData(getLevelProgress());

    // Check if we should show daily reward modal
    if (shouldShowDailyReward()) {
      // Small delay to let the page render first
      const timer = setTimeout(() => setShowDailyReward(true), 500);

      return () => clearTimeout(timer);
    }
  }, []);

  /**
   * Sve teme su gotove kad u SVAKOJ nema više nijednog zadatka koji se boduje.
   * Dodatna aktivnost (crtanje) se ne broji — ona nije uslov ni za jednu drugu
   * stvar u igri, pa ne sme da bude uslov ni ovde.
   */
  /** Koliko je sličica skupljeno — piše na ulazu u album. */
  const [brojAlbuma, setBrojAlbuma] = useState({ otkriveno: 0, ukupno: 0 });
  useEffect(() => setBrojAlbuma(brojSlicica()), [progress]);

  const sveTemeGotove = themes.every(
    (t) =>
      getScoringTaskCount(t.slug) > 0 &&
      getCompletedScoringCount(t.slug, progress[t.slug]?.completedTasks || []) >=
        getScoringTaskCount(t.slug)
  );

  return (
    <div className="min-h-dvh pb-8">
      {/* Daily Reward Modal */}
      {showDailyReward && (
        <DailyRewardModal onClose={() => setShowDailyReward(false)} />
      )}

      <header className="relative overflow-hidden px-4 pt-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          {/* Left: Mascot with speech bubble */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <HamburgerMenu />
            <AnimatedStar
              size="md"
              reaction={getStarReaction("greeting")}
              message="Hola! Vols jugar?"
            />
          </div>

          {/* Center: Title */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--primary)] leading-tight">
              Aprenc Català
            </h1>
          </div>

          {/* Right: XP Progress (compact) */}
          <div className="flex-shrink-0">
            <XPProgressHeader compact />
          </div>
        </motion.div>
      </header>

      <main className="px-4 max-w-5xl mx-auto">
        {/* Prominent Level Display
            Ovaj blok se UVEK iscrtava, i kad podaci o nivou još nisu učitani.
            Ranije je stajalo `{levelData && (...)}`, pa se blok visok 121 px ubacivao
            TEK posle čitanja iz localStorage-a i gurao sve kartice tema naniže:
            izmereno CLS 0,167 i skok kartice 170 → 300 px (nalaz V2, audit 30.07.2026).
            Dete koje klikne u prvih pola sekunde kliknulo bi POGREŠNU temu.
            Dok podaci ne stignu blok je `invisible` — mesto je zauzeto, ali se ne
            blesne pogrešan nivo detetu koje je npr. na 5. nivou. */}
        {(() => {
          const ucitano = levelData !== null;
          const nivo = levelData?.currentLevel;
          return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: ucitano ? 1 : 0, y: 0 }}
            transition={{ delay: ucitano ? 0.15 : 0 }}
            aria-hidden={!ucitano}
            className={`mb-5 bg-gradient-to-r from-purple-50 to-amber-50 rounded-2xl p-4 flex items-center gap-4 ${ucitano ? "" : "invisible"}`}
          >
            <img
              src={nivo?.image ?? "/levels/estrella-1.png"}
              alt={ucitano ? (nivo?.name ?? "") : ""}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-purple-600 font-medium">
                Nivell {nivo?.level ?? 1}
              </p>
              <p className="text-lg sm:text-xl font-black text-[var(--primary)]">
                {nivo?.name ?? " "}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-2.5 bg-purple-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelData?.progressPercent ?? 0}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs text-purple-600 font-bold whitespace-nowrap">
                  {levelData?.currentXP ?? 0} XP
                </span>
              </div>
              {/* Red se DRŽI i pre učitavanja (nbsp), da se visina bloka ne promeni */}
              <p className="text-[11px] text-gray-400 mt-0.5">
                {levelData?.nextLevel
                  ? `${levelData.nextLevel.minXP - levelData.currentXP} XP fins a ${levelData.nextLevel.name}`
                  : " "}
              </p>
            </div>
          </motion.div>
          );
        })()}

        {/**
          * PUT DO VELIKOG SLAVLJA (28.08.2026, zahtev vlasnice).
          *
          * Strana `/gran-final` je nagrada za SVE završene teme. Da se ne bi
          * desilo ono što se u ovom projektu već dešavalo — da gotova stvar
          * stoji napravljena, a nigde se ne pali — ovde stoji jedini ulaz u
          * nju, i pojavljuje se tek kad je dete stvarno zaslužilo.
          */}
        {sveTemeGotove && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 180, damping: 18 }}
            className="mb-5"
          >
            <Link
              href="/gran-final"
              className="flex min-h-[64px] items-center justify-between gap-3 rounded-2xl px-5 text-white shadow-[0_10px_28px_rgba(51,37,90,0.35)]"
              style={{ background: "linear-gradient(120deg,#33255a 0%,#6b4f8f 55%,#e58a6b 100%)" }}
            >
              <span className="text-lg font-black">Ho has acabat tot! Vine a celebrar-ho</span>
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden fill="none"
                   stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
          </motion.div>
        )}

        {/**
          * ULAZ U ALBUM (28.08.2026, zahtev vlasnice).
          *
          * „I onda imamo i pristup tom albumu… dete uvek može da lista svoje
          *  sličice." Zato album ima svoje mesto na početnoj, iznad tema, i
          *  odmah pokazuje koliko je sličica skupljeno — to je ono zbog čega
          *  se dete vraća.
          */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 190, damping: 20 }}
          className="mb-5"
        >
          <Link
            href="/album"
            className="flex min-h-[64px] items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-[0_8px_22px_rgba(43,31,74,0.3)]"
            style={{ background: "linear-gradient(115deg,#2b1f4a 0%,#59406f 62%,#8a5c9e 100%)" }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
              <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
            </svg>
            <span className="flex-1">
              <span className="block text-lg font-black leading-tight">El meu àlbum</span>
              <span className="block text-sm text-white/75">
                {brojAlbuma.otkriveno} de {brojAlbuma.ukupno} cromos
              </span>
            </span>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden fill="none"
                 stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </motion.div>

        <motion.h2
          className="text-xl font-bold text-[var(--text)] mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Temes
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {themes.map((theme, index) => (
            <ThemeCard
              key={theme.slug}
              theme={theme}
              progress={getCompletedScoringCount(theme.slug, progress[theme.slug]?.completedTasks || [])}
              totalTasks={getScoringTaskCount(theme.slug)}
              index={index}
            />
          ))}
        </div>

        {/* Badges section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <BadgeDisplay />
        </motion.div>
      </main>

      <InstallPrompt />

      {/* Footer */}
      <footer className="mt-12 pb-4 text-center">
        <a
          href="https://orbitacode.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--text-light)] hover:text-[var(--primary)] transition-colors inline-flex items-center min-h-[44px]"
        >
          Powered by <span className="font-semibold">Orbita Code</span> 🚀
        </a>
      </footer>
    </div>
  );
}
