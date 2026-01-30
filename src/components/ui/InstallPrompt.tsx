"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import AnimatedStar from "@/components/star/AnimatedStar";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-30 bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-3">
          <AnimatedStar size="sm" expression="happy" animation="bounce" />
          <div className="flex-1">
            <p className="font-bold text-sm text-[var(--text)]">
              Afegeix a la pantalla d&apos;inici!
            </p>
            <p className="text-xs text-[var(--text-light)]">
              Juga sense connexió
            </p>
          </div>
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white font-bold rounded-xl text-sm"
          >
            <Download size={16} />
            Instal·la
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
