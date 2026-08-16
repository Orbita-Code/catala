"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Volume2, Mic, RefreshCw, MicVocal } from "lucide-react";
import { getSettings, updateSettings, resetAllProgress, AppSettings } from "@/lib/settings";
import { imaKatalonskiGlas } from "@/lib/tts";
import { nadjiMikrofone, izabraniMikrofon, zapamtiMikrofon, usloviZvuka, type Mikrofon } from "@/lib/mikrofon";

export default function ConfiguracioPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [showReset, setShowReset] = useState(false);
  /**
   * Da li uređaj uopšte ima katalonski glas.
   * Ako nema, čitanje pada na španski i dete čuje pogrešan izgovor — a to se
   * dosad nigde nije videlo, pa se mislilo da je aplikacija pokvarena.
   * `null` = još se ne zna (glasovi stižu tek posle `voiceschanged`).
   */
  const [imaGlas, setImaGlas] = useState<boolean | null>(null);

  /**
   * IZBOR MIKROFONA (16.08.2026)
   *
   * Zašto ovo mora da postoji: na detetovom laptopu mikrofon se palio, a nije
   * čuo ništa. Najčešći uzrok je da pregledač uzme POGREŠAN ulazni uređaj
   * (monitor, kamera, virtuelni uređaj neke druge aplikacije) i to nikad ne
   * kaže. Iz aplikacije se to ne može popraviti drugačije nego izborom.
   *
   * Uz izbor ide i PROBA: traka se pomera dok se govori. To je jedini način
   * da roditelj za pet sekundi vidi da li zvuk uopšte stiže do pregledača.
   */
  const [mikrofoni, setMikrofoni] = useState<Mikrofon[]>([]);
  const [izabran, setIzabran] = useState<string | null>(null);
  const [proba, setProba] = useState<{ radi: boolean; nivo: number; ishod: string | null }>({ radi: false, nivo: 0, ishod: null });

  useEffect(() => {
    setIzabran(izabraniMikrofon());
  }, []);

  const ucitajMikrofone = async () => setMikrofoni(await nadjiMikrofone());

  const probajMikrofon = async () => {
    setProba({ radi: true, nivo: 0, ishod: null });
    try {
      const tok = await navigator.mediaDevices.getUserMedia(usloviZvuka());
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC!();
      if (ctx.state === "suspended") await ctx.resume();
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      ctx.createMediaStreamSource(tok).connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      let najvise = 0;
      const kraj = Date.now() + 6000;
      const meri = () => {
        an.getByteTimeDomainData(buf);
        let vrh = 0;
        for (const v of buf) { const d = Math.abs(v - 128); if (d > vrh) vrh = d; }
        if (vrh > najvise) najvise = vrh;
        setProba((p) => ({ ...p, nivo: Math.min(100, Math.round((vrh / 45) * 100)) }));
        if (Date.now() < kraj) requestAnimationFrame(meri);
        else {
          tok.getTracks().forEach((t) => t.stop());
          void ctx.close();
          setProba({
            radi: false,
            nivo: 0,
            ishod: najvise < 6
              ? "❌ No arriba cap so. Tria un altre micròfon de la llista."
              : najvise < 12
                ? "⚠️ El so és molt fluix. Parla més a prop."
                : "✅ El micròfon funciona!",
          });
        }
      };
      requestAnimationFrame(meri);
    } catch (e) {
      setProba({ radi: false, nivo: 0, ishod: `❌ ${(e as Error).name}` });
    }
  };

  useEffect(() => {
    setSettings(getSettings());
    const proveri = () => setImaGlas(imaKatalonskiGlas());
    proveri();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", proveri);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", proveri);
    }
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
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition-colors"
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
                role="switch"
                aria-checked={settings.soundEnabled}
                aria-label="Efectes de so"
                onClick={() => toggle("soundEnabled")}
                className={`w-12 h-7 rounded-full transition-colors relative after:absolute after:content-[''] after:-inset-y-2 after:inset-x-0 ${
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

          {/* Upozorenje kad uređaj nema katalonski glas — tada čitanje pada na
              španski i dete čuje pogrešan izgovor. Bez ove poruke se ne vidi
              zašto glas zvuči čudno; mislilo se da je aplikacija pokvarena. */}
          {imaGlas === false && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-[var(--text)]">
              <p className="font-bold mb-1">Aquest ordinador no té veu catalana</p>
              <p>
                Les paraules es llegiran en castellà, i la pronúncia no serà correcta.
                Per instal·lar-la: <span className="font-semibold">Configuració del sistema → Accessibilitat →
                Contingut parlat → Veu del sistema → Gestiona les veus → Català</span>.
              </p>
            </div>
          )}

          <div className="space-y-3 mt-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[var(--text)]">Text a veu</span>
              <button
                role="switch"
                aria-checked={settings.ttsEnabled}
                aria-label="Text a veu"
                onClick={() => toggle("ttsEnabled")}
                className={`w-12 h-7 rounded-full transition-colors relative after:absolute after:content-[''] after:-inset-y-2 after:inset-x-0 ${
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
                role="switch"
                aria-checked={settings.autoRead}
                aria-label="Lectura automàtica"
                onClick={() => toggle("autoRead")}
                className={`w-12 h-7 rounded-full transition-colors relative after:absolute after:content-[''] after:-inset-y-2 after:inset-x-0 ${
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {[0.5, 0.8, 1.0, 1.2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`min-h-[48px] py-3 px-2 rounded-xl font-bold text-sm transition-all ${
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

        {/* MIKROFON — izbor uređaja i proba (16.08.2026) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-1">
            <MicVocal size={20} className="text-[var(--primary)]" />
            <span className="font-bold text-[var(--text)]">Micròfon</span>
          </div>
          <p className="text-sm text-[var(--text-light)]">
            Si el micròfon no sent res, prova un altre aparell d&apos;aquesta llista.
          </p>

          <button
            onClick={ucitajMikrofone}
            className="mt-3 w-full min-h-[48px] rounded-xl bg-gray-100 font-bold text-sm"
          >
            Mostra els micròfons
          </button>

          {mikrofoni.length > 0 && (
            <div className="mt-3 space-y-2">
              {[{ id: "", ime: "Automàtic (el que triï el navegador)" }, ...mikrofoni].map((m) => (
                <button
                  key={m.id || "auto"}
                  onClick={() => { zapamtiMikrofon(m.id || null); setIzabran(m.id || null); setProba({ radi: false, nivo: 0, ishod: null }); }}
                  className={`w-full text-left px-3 min-h-[48px] py-2 rounded-xl text-sm font-bold transition-all ${
                    (izabran ?? "") === m.id ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-[var(--text)]"
                  }`}
                >
                  {m.ime}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={probajMikrofon}
            disabled={proba.radi}
            className="mt-3 w-full min-h-[48px] rounded-xl bg-[var(--accent)] text-[var(--text)] font-bold text-sm disabled:opacity-60"
          >
            {proba.radi ? "Parla ara… 🎤" : "Prova el micròfon (6 segons)"}
          </button>

          {/* Traka koja se pomera dok se govori — jedini brz način da se vidi
              STIŽE li zvuk do pregledača. Ako stoji na nuli, kvar nije u igrici. */}
          {(proba.radi || proba.nivo > 0) && (
            <div className="mt-2 h-4 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-green-500 transition-[width] duration-75" style={{ width: `${proba.nivo}%` }} />
            </div>
          )}
          {proba.ishod && <p className="mt-2 text-sm font-bold">{proba.ishod}</p>}
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
          className="text-sm text-[var(--text-light)] hover:text-[var(--primary)] transition-colors inline-flex items-center min-h-[44px]"
        >
          Powered by <span className="font-semibold">Orbita Code</span> 🚀
        </a>
      </footer>
    </div>
  );
}
