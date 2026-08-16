"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usloviZvuka } from "@/lib/mikrofon";

/**
 * SNIMANJE GLASA — mikrofon koji radi na svakom uređaju.
 *
 * ZAŠTO JE OVO NAPISANO (16.08.2026, posle više neuspelih krugova)
 *
 * Do sada je ceo mikrofon u aplikaciji zavisio od `SpeechRecognition` —
 * pregledačevog PREPOZNAVANJA GOVORA. To nije mikrofon nego usluga: Chrome
 * šalje zvuk Guglovim serverima i čeka odgovor. Ta usluga radi na jednom
 * računaru, a na drugom ćuti, i kad zataji ne kaže ništa — dugme se upali
 * zeleno, stoji tridesetak sekundi i ugasi se. Tačno to je vlasnica prijavila.
 * Popravljati dozvole i tajmere oko toga bilo je lečenje pogrešne bolesti.
 *
 * Ovaj hook koristi SAMO ono što postoji u svakom pregledaču i ne zavisi ni od
 * interneta ni od ičije usluge:
 *   • `getUserMedia`  — otvara mikrofon (jedino traži dozvolu)
 *   • `AnalyserNode`  — meri jačinu zvuka, uživo, pa dete VIDI da ga čuje
 *   • `MediaRecorder` — snimi glas, pa dete može da se ČUJE
 *
 * Zahvaljujući tome mikrofon ne može više „tiho da ne radi": ili se traka
 * pomera dok dete govori, ili se ne pomera — i onda odmah znamo da zvuk ne
 * stiže do pregledača, što je kvar uređaja, a ne aplikacije, i pišemo šta da
 * se uradi. Prepoznavanje govora ostaje kao DODATAK koji, kad radi, sam
 * proveri reč; kad ne radi, zadatak i dalje radi.
 */

/** Ispod ovoga nema govora — samo tišina i šum sobe. Skala je 0–128. */
const PRAG_TISINE = 6;
/** Najduži snimak. Reč od pet slova ne traje duže od ovoga ni kod najsporijeg deteta. */
const NAJDUZE_MS = 5000;
/** Posle ovoliko tišine PO govoru, snimanje se samo zaustavlja. */
const TISINA_ZA_KRAJ_MS = 1200;
/** Ne gasi se pre ovoga, da dete stigne da udahne i počne. */
const NAJKRACE_MS = 1500;

export type IshodSnimka = {
  /** Da li je u snimku uopšte bilo glasa. */
  imaGlasa: boolean;
  /** Najjači izmereni nivo (0–128) — ide u dijagnostiku. */
  vrhunac: number;
  /** Adresa snimka za `<audio>`, ili `null` ako pregledač ne ume da snima. */
  snimak: string | null;
  /** Ime ulaznog uređaja koji je pregledač stvarno koristio. */
  uredjaj: string;
  trajanjeMs: number;
};

export type GreskaMikrofona =
  | "nema-dozvole"
  | "nema-mikrofona"
  | "zauzet"
  | "nije-podrzano"
  | "nepoznato";

type Opcije = {
  onGotovo?: (ishod: IshodSnimka) => void;
  onGreska?: (kod: GreskaMikrofona, detalj: string) => void;
};

export function useSnimanjeGlasa({ onGotovo, onGreska }: Opcije = {}) {
  const [snima, setSnima] = useState(false);
  /** Trenutna jačina 0–100, za traku koja se pomera dok dete govori. */
  const [nivo, setNivo] = useState(0);

  const tokRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const snimacRef = useRef<MediaRecorder | null>(null);
  const delovi = useRef<Blob[]>([]);
  const vrhunacRef = useRef(0);
  const pocetakRef = useRef(0);
  const zadnjiGlasRef = useRef(0);
  const zavrsenRef = useRef(false);
  const onGotovoRef = useRef(onGotovo);
  const onGreskaRef = useRef(onGreska);

  useEffect(() => { onGotovoRef.current = onGotovo; onGreskaRef.current = onGreska; });

  /** Sve se gasi na jednom mestu — inače mikrofon ostane upaljen i lampica gori. */
  const ugasiSve = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    try { snimacRef.current?.state !== "inactive" && snimacRef.current?.stop(); } catch {}
    try { tokRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
    try { void ctxRef.current?.close(); } catch {}
    snimacRef.current = null;
    tokRef.current = null;
    ctxRef.current = null;
    setNivo(0);
    setSnima(false);
  }, []);

  useEffect(() => ugasiSve, [ugasiSve]);

  const stani = useCallback(() => {
    if (!snimacRef.current || zavrsenRef.current) { ugasiSve(); return; }
    zavrsenRef.current = true;
    try { snimacRef.current.stop(); } catch { ugasiSve(); }
  }, [ugasiSve]);

  const pocni = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      onGreskaRef.current?.("nije-podrzano", "nema getUserMedia");
      return;
    }

    // Govor aplikacije se prekida: na tabletima zvučnik i mikrofon ne rade
    // istovremeno, pa bi snimak bio glas aplikacije, ne deteta.
    try { window.speechSynthesis?.cancel(); } catch {}

    zavrsenRef.current = false;
    vrhunacRef.current = 0;
    delovi.current = [];

    let tok: MediaStream;
    try {
      tok = await navigator.mediaDevices.getUserMedia(usloviZvuka());
    } catch (e) {
      const ime = (e as Error)?.name || "";
      const kod: GreskaMikrofona =
        ime === "NotAllowedError" || ime === "SecurityError" ? "nema-dozvole"
        : ime === "NotFoundError" || ime === "DevicesNotFoundError" ? "nema-mikrofona"
        : ime === "NotReadableError" || ime === "TrackStartError" ? "zauzet"
        : ime === "OverconstrainedError" ? "nema-mikrofona"
        : "nepoznato";
      onGreskaRef.current?.(kod, ime);
      return;
    }
    tokRef.current = tok;
    const uredjaj = tok.getAudioTracks()[0]?.label || "nepoznat";

    // ── merenje jačine uživo ─────────────────────────────────────────────
    const AC = window.AudioContext
      || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    let analiza: AnalyserNode | null = null;
    if (AC) {
      const ctx = new AC();
      ctxRef.current = ctx;
      // Neki pregledači otvore AudioContext „uspavan" — bez ovoga merač stoji na nuli.
      if (ctx.state === "suspended") { try { await ctx.resume(); } catch {} }
      analiza = ctx.createAnalyser();
      analiza.fftSize = 512;
      ctx.createMediaStreamSource(tok).connect(analiza);
    }
    const podaci = new Uint8Array(analiza ? analiza.frequencyBinCount : 0);

    pocetakRef.current = Date.now();
    zadnjiGlasRef.current = Date.now();

    const meri = () => {
      if (analiza) {
        analiza.getByteTimeDomainData(podaci);
        let vrh = 0;
        for (const v of podaci) { const d = Math.abs(v - 128); if (d > vrh) vrh = d; }
        if (vrh > vrhunacRef.current) vrhunacRef.current = vrh;
        if (vrh >= PRAG_TISINE) zadnjiGlasRef.current = Date.now();
        // 0–128 se pretvara u 0–100, ali se skala steže na 45 jer normalan
        // govor retko prelazi tu vrednost — inače traka jedva mrdne i deluje
        // kao da mikrofon ne radi baš kad radi.
        setNivo(Math.min(100, Math.round((vrh / 45) * 100)));
      }
      const proteklo = Date.now() - pocetakRef.current;
      const tisina = Date.now() - zadnjiGlasRef.current;
      if (proteklo >= NAJDUZE_MS || (proteklo > NAJKRACE_MS && tisina > TISINA_ZA_KRAJ_MS && vrhunacRef.current >= PRAG_TISINE)) {
        stani();
        return;
      }
      rafRef.current = requestAnimationFrame(meri);
    };
    rafRef.current = requestAnimationFrame(meri);

    // ── snimanje ──────────────────────────────────────────────────────────
    // MediaRecorder ne postoji na nekim starijim iPad-ovima. To NIJE razlog da
    // mikrofon ne radi: merenje jačine i dalje radi, samo nema reprodukcije.
    let snimac: MediaRecorder | null = null;
    try {
      const tip = ["audio/webm", "audio/mp4", "audio/ogg"]
        .find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(t));
      snimac = new MediaRecorder(tok, tip ? { mimeType: tip } : undefined);
      snimac.ondataavailable = (e) => { if (e.data.size) delovi.current.push(e.data); };
      snimac.onstop = () => {
        const blob = delovi.current.length ? new Blob(delovi.current, { type: snimac!.mimeType }) : null;
        const ishod: IshodSnimka = {
          imaGlasa: vrhunacRef.current >= PRAG_TISINE,
          vrhunac: vrhunacRef.current,
          snimak: blob ? URL.createObjectURL(blob) : null,
          uredjaj,
          trajanjeMs: Date.now() - pocetakRef.current,
        };
        ugasiSve();
        onGotovoRef.current?.(ishod);
      };
      snimacRef.current = snimac;
      snimac.start();
    } catch {
      // Bez snimača se i dalje meri jačina; kraj javljamo sami.
      snimacRef.current = null;
      const kraj = () => {
        const ishod: IshodSnimka = {
          imaGlasa: vrhunacRef.current >= PRAG_TISINE,
          vrhunac: vrhunacRef.current,
          snimak: null,
          uredjaj,
          trajanjeMs: Date.now() - pocetakRef.current,
        };
        ugasiSve();
        onGotovoRef.current?.(ishod);
      };
      setTimeout(kraj, NAJDUZE_MS);
    }

    setSnima(true);
  }, [stani, ugasiSve]);

  return { snima, nivo, pocni, stani, PRAG_TISINE };
}
