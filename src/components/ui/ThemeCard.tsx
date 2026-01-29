"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeInfo } from "@/data/themes";

interface ThemeCardProps {
  theme: ThemeInfo;
  progress: number;
  index: number;
}

export default function ThemeCard({ theme, progress, index }: ThemeCardProps) {
  const completedCount = progress;
  const totalCount = theme.taskCount;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isCompleted = completedCount >= totalCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/tema/${theme.slug}`}>
        <motion.div
          className="relative overflow-hidden rounded-[20px] bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.1)] cursor-pointer"
          whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(108,92,231,0.2)" }}
          whileTap={{ scale: 0.97 }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[20px]"
            style={{ backgroundColor: theme.color }}
          />

          <div className="flex flex-col items-center gap-3 pt-2">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl text-3xl"
              style={{ backgroundColor: `${theme.color}15` }}
            >
              {theme.icon}
            </div>

            <h3 className="text-lg font-bold text-[var(--text)]">
              {theme.name}
            </h3>

            <div className="w-full">
              <div className="flex justify-between text-xs text-[var(--text-light)] mb-1">
                <span>
                  {completedCount}/{totalCount}
                </span>
                {isCompleted && <span>✅</span>}
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: theme.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ delay: index * 0.05 + 0.3, duration: 0.6 }}
                />
              </div>
            </div>

            <div
              className="w-full mt-1 py-2 rounded-xl text-center text-white font-bold text-sm"
              style={{ backgroundColor: theme.color }}
            >
              {completedCount === 0
                ? "Comença!"
                : isCompleted
                  ? "Repeteix"
                  : "Continua →"}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
