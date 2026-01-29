"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
          className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_4px_20px_rgba(108,92,231,0.1)] cursor-pointer"
          whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(108,92,231,0.2)" }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Cover image */}
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={`/covers/${theme.slug}.png`}
              alt={theme.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div
              className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md"
              style={{ backgroundColor: theme.color }}
            >
              {index + 1}
            </div>
            {isCompleted && (
              <div className="absolute top-2 right-2 text-lg">✅</div>
            )}
          </div>

          {/* Card info */}
          <div className="p-3 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-[var(--text)] text-center leading-tight">
              {theme.name}
            </h3>

            <div className="w-full">
              <div className="flex justify-between text-[10px] text-[var(--text-light)] mb-1">
                <span>
                  {completedCount}/{totalCount}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
              className="w-full py-1.5 rounded-xl text-center text-white font-bold text-xs"
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
