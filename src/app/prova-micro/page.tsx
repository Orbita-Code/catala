"use client";

/**
 * PROVERA MIKROFONA — jedna strana koja odgovori zašto mikrofon ne radi.
 *
 * ZAŠTO POSTOJI (14.08.2026): mikrofon radi na maminom Mac-u, a na detetovom
 * laptopu ne. Bez podataka sa TOG uređaja svaka popravka je nagađanje, a
 * nagađanja su nas već koštala nekoliko krugova. Ova strana na jednom mestu
 * pokazuje sve što odlučuje: pregledač, bezbednu vezu, postojanje prepoznavanja
 * govora, stanje dozvole, broj mikrofona, i tačan naziv greške kad se proba.
 *
 * Otvara se na `/prova-micro`. Namerno nije u meniju — nije za dete.
 */

import { useEffect, useState } from "react";
import { Mic, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { javiKvarMikrofona } from "@/lib/dijagnostika";

type Red = { sta: string; vrednost: string; dobro: boolean | null };

export default function ProvaMicro() {
  const router = useRouter();
  const [redovi, setRedovi] = useState<Red[]>([]);
  const [ishodDozvole, setIshodDozvole] = useState<string | null>(null);
  const [ishodGovora, setIshodGovora] = useState<string | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const pregledac = /Edg\//.test(ua) ? "Edge"
      : /OPR\//.test(ua) ? "Opera"
      : /Chrome\//.test(ua) ? "Chrome"
      : /Firefox\//.test(ua) ? "Firefox"
      : /Safari\//.test(ua) ? "Safari"
      : "nepoznat";
    const verzija = (ua.match(/(?:Chrome|Firefox|Version|Edg|OPR)\/(\d+)/) || [])[1] || "?";
    const govor = (window as unknown as Record<string, unknown>).SpeechRecognition
      || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    const osnovno: Red[] = [
      { sta: "Navegador", vrednost: `${pregledac} ${verzija}`, dobro: pregledac === "Chrome" || pregledac === "Edge" },
      { sta: "Connexió segura (https)", vrednost: window.isSecureContext ? "sí" : "NO", dobro: window.isSecureContext },
      { sta: "Reconeixement de veu", vrednost: govor ? "disponible" : "NO DISPONIBLE", dobro: !!govor },
      { sta: "Accés al micròfon (API)", vrednost: navigator.mediaDevices ? "disponible" : "NO DISPONIBLE", dobro: !!navigator.mediaDevices },
    ];
    setRedovi(osnovno);

    // Stanje dozvole — ne pitaju svi pregledači isto, pa se greška ne prikazuje kao kvar.
    // `permissions.query` ne postoji svuda (Safari), pa se poziva oprezno.
    const dozvole = navigator.permissions;
    (dozvole ? dozvole.query({ name: "microphone" as PermissionName }) : Promise.reject())
      .then((p) => setRedovi((r) => [...r, { sta: "Permís del micròfon", vrednost: p.state, dobro: p.state !== "denied" }]))
      .catch(() => setRedovi((r) => [...r, { sta: "Permís del micròfon", vrednost: "no es pot consultar", dobro: null }]));

    navigator.mediaDevices?.enumerateDevices?.()
      .then((d) => {
        const n = d.filter((x) => x.kind === "audioinput").length;
        setRedovi((r) => [...r, { sta: "Micròfons trobats", vrednost: String(n), dobro: n > 0 }]);
      })
      .catch(() => {});

    // Sam dolazak na ovu stranu šalje izveštaj — tako je dovoljno da je
    // roditelj samo OTVORI, bez prepisivanja ijedne reči.
    void javiKvarMikrofona("prova-micro:otvaranje", "");
  }, []);

  const probajDozvolu = async () => {
    setIshodDozvole("provant…");
    try {
      const tok = await navigator.mediaDevices.getUserMedia({ audio: true });
      tok.getTracks().forEach((t) => t.stop());
      setIshodDozvole("✅ OK — el micròfon funciona");
    } catch (e) {
      const err = e as Error;
      setIshodDozvole(`❌ ${err.name}: ${err.message}`);
      void javiKvarMikrofona("prova-micro:dozvola", err.name);
    }
  };

  const probajGovor = () => {
    setIshodGovora("provant… digues «llapis»");
    const K = ((window as unknown as Record<string, unknown>).SpeechRecognition
      || (window as unknown as Record<string, unknown>).webkitSpeechRecognition) as
      (new () => {
        lang: string; onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
        onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null; start: () => void;
      }) | undefined;
    if (!K) { setIshodGovora("❌ aquest navegador no té reconeixement de veu"); return; }
    try {
      const r = new K();
      r.lang = "ca-ES";
      let stiglo = false;
      r.onresult = (e) => { stiglo = true; setIshodGovora(`✅ ha entès: «${e.results[0][0].transcript}»`); };
      r.onerror = (e) => {
        stiglo = true;
        setIshodGovora(`❌ error: ${e.error}`);
        void javiKvarMikrofona("prova-micro:govor", e.error);
      };
      r.onend = () => {
        if (!stiglo) {
          setIshodGovora("❌ s'ha aturat sense dir res (sovint: falta permís)");
          void javiKvarMikrofona("prova-micro:govor", "prekid-bez-rezultata");
        }
      };
      r.start();
    } catch (e) {
      setIshodGovora(`❌ no s'ha pogut iniciar: ${(e as Error).name}`);
    }
  };

  return (
    <div className="min-h-dvh p-4 max-w-lg mx-auto">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 min-h-[44px] text-[var(--text-light)] mb-3"
      >
        <ArrowLeft size={20} /> Inici
      </button>

      <h1 className="text-2xl font-black mb-1 flex items-center gap-2">
        <Mic /> Prova del micròfon
      </h1>
      <p className="text-sm text-[var(--text-light)] mb-4">
        Aquesta pàgina diu per què el micròfon no funciona en aquest ordinador.
      </p>

      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {redovi.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-3 p-3">
            <span className="text-sm text-[var(--text)]">{r.sta}</span>
            <span
              className={`text-sm font-bold ${
                r.dobro === true ? "text-green-600" : r.dobro === false ? "text-red-600" : "text-[var(--text-light)]"
              }`}
            >
              {r.vrednost}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={probajDozvolu}
          className="w-full min-h-[52px] rounded-2xl bg-[var(--primary)] text-white font-bold"
        >
          1. Prova el permís del micròfon
        </button>
        {ishodDozvole && (
          <p className="text-sm bg-white rounded-xl p-3 shadow-sm break-words">{ishodDozvole}</p>
        )}

        <button
          onClick={probajGovor}
          className="w-full min-h-[52px] rounded-2xl bg-[var(--secondary)] text-white font-bold"
        >
          2. Prova el reconeixement de veu
        </button>
        {ishodGovora && (
          <p className="text-sm bg-white rounded-xl p-3 shadow-sm break-words">{ishodGovora}</p>
        )}
      </div>
    </div>
  );
}
