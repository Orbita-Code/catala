"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Volume2, Mic, RefreshCw } from "lucide-react";
import { getSettings, updateSettings, resetAllProgress, AppSettings } from "@/lib/settings";

export default function ConfiguracioPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  const toggle = (key: keyof AppSettings) => {
    const updated = updateSettings({ [key]: !settings[key] });
    setSettings(updated);
  };

  const handleSpeedChange = (speed: number) => {
    const updated = updateSettings({ ttsSpeed: speed });
    setSettings(updated);
  };

  const handleReset = () => {
    resetAllProgress();
    setShowReset(false);
    router.push("/");
  };

  return (
    <div className="min-h-dvh pb-8">
      <header className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-[var(--text)]" />
          </button>
          <h1 className="text-xl font-black text-[var(--text)]">Configuració</h1>
        </div>
      </header>

      <main className="px-4 max-w-lg mx-auto space-y-4">
        {/* Sound */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-1">
            <Volume2 size={20} className="text-[var(--primary)]" />
            <span className="font-bold text-[var(--text)]">Sons</span>
          </div>
          <div className="space-y-3 mt-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text)]">Efectes de so</span>
              <button
                onClick={() => toggle("soundEnabled")}
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.soundEnabled ? "bg-[var(--primary)]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.soundEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </motion.div>

        {/* TTS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-1">
            <Mic size={20} className="text-[var(--primary)]" />
            <span className="font-bold text-[var(--text)]">Veu</span>
          </div>
          <div className="space-y-3 mt-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text)]">Text a veu</span>
              <button
                onClick={() => toggle("ttsEnabled")}
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.ttsEnabled ? "bg-[var(--primary)]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.ttsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text)]">Lectura automàtica</span>
              <button
                onClick={() => toggle("autoRead")}
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.autoRead ? "bg-[var(--primary)]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.autoRead ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>

            <div>
              <span className="text-sm text-[var(--text)]">Velocitat de veu</span>
              <div className="grid grid-cols-2 sm:flex gap-2 mt-2">
                {[0.5, 0.8, 1.0, 1.2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
                      settings.ttsSpeed === speed
                        ? "bg-[var(--primary)] text-white"
                        : "bg-gray-100 text-[var(--text)]"
                    }`}
                  >
                    {speed === 0.5 ? "Lent" : speed === 0.8 ? "Normal" : speed === 1.0 ? "Ràpid" : "Molt ràpid"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reset */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-1">
            <RefreshCw size={20} className="text-[var(--error)]" />
            <span className="font-bold text-[var(--text)]">Reiniciar</span>
          </div>
          <p className="text-sm text-[var(--text-light)] mt-2 mb-3">
            Esborra tot el progrés, estrelles i insígnies.
          </p>
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full py-3 bg-red-50 text-[var(--error)] font-bold rounded-xl"
            >
              Reiniciar tot el progrés
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-bold text-[var(--error)]">
                N&apos;estàs segur/a? Això no es pot desfer.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-[var(--error)] text-white font-bold rounded-xl"
                >
                  Sí, reinicia
                </button>
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 py-3 bg-gray-100 text-[var(--text)] font-bold rounded-xl"
                >
                  Cancel·la
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-4 text-center">
        <a
          href="https://orbitacode.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--text-light)] hover:text-[var(--primary)] transition-colors"
        >
          Powered by <span className="font-semibold">Orbita Code</span> 🚀
        </a>
      </footer>
    </div>
  );
}
