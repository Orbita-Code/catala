"use client";

import { useState, useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { SelfAssessmentTask, TaskResult } from "@/types/tasks";
import { getWordIllustration } from "@/lib/illustrations";
import { speak } from "@/lib/tts";
import { Mic, MicOff, RefreshCcw, Play, Volume2 } from "lucide-react";
import { useSpeechRecognition, wordsMatch } from "@/hooks/useSpeechRecognition";
import { useSnimanjeGlasa, type IshodSnimka, type GreskaMikrofona } from "@/hooks/useSnimanjeGlasa";
import { celebrate, celebrateBig } from "@/lib/confetti";
import { javiKvarMikrofona } from "@/lib/dijagnostika";

interface Props {
  task: SelfAssessmentTask;
  onComplete: (result: TaskResult) => void;
}

/**
 * SAMOPROCENA IZGOVORA — mikrofon koji radi na svakom uređaju (16.08.2026).
 *
 * ŠTA JE BILO POGREŠNO DO SADA
 * Ceo zadatak je zavisio od `SpeechRecognition` — pregledačeve usluge koja zvuk
 * šalje na tuđi server i vraća prepoznat tekst. Ta usluga na jednom računaru
 * radi, na drugom ćuti, i kad zataji NE JAVI ništa: dugme se upali zeleno,
 * stoji tridesetak sekundi i ugasi se. Vlasnica je to prijavila više puta, a ja
 * sam popravljao dozvole i tajmere — dakle pogrešnu stvar.
 *
 * KAKO SADA RADI
 * Osnova je SNIMANJE, ne prepoznavanje. Snimanje koristi samo ono što postoji
 * u svakom pregledaču (`getUserMedia` + `MediaRecorder` + merač jačine) i ne
 * zavisi ni od interneta ni od ičije usluge:
 *
 *   1. Dete pritisne mikrofon → traka se pomera dok govori. Time se VIDI da ga
 *      aplikacija čuje. Mikrofon više ne može „tiho da ne radi".
 *   2. Snimak se sačuva, pa dete može da ČUJE sebe i da uporedi sa tačnim
 *      izgovorom. To je i pedagoški bolje: uči se slušanjem svog glasa.
 *   3. Prepoznavanje govora radi USPOREDO, kao dodatak. Ako odgovori — reč se
 *      proverava sama, kao i pre. Ako ne odgovori, zadatak i dalje radi.
 *   4. Ako u snimku NEMA glasa, piše tačno to i šta da se uradi. Ranije se to
 *      nije razlikovalo od „usluga nije odgovorila", pa se nije znalo ni gde
 *      je kvar.
 *
 * PROTIV VARANJA: „Ho he dit bé" se pojavljuje TEK POSLE snimka u kom stvarno
 * ima glasa. Bez izgovorene reči nema dugmeta kojim bi se zadatak preskočio.
 */
export default function SelfAssessment({ task, onComplete }: Props) {
  const [results, setResults] = useState<Record<number, "correct" | "wrong" | "retry">>({});
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [forceFallback, setForceFallback] = useState(false);
  /** Kod greške koji je javio pregledač — jedini trag zašto mikrofon ne radi. */
  const [razlog, setRazlog] = useState<string | null>(null);
  /** Snimak deteta po reči: dete može da se čuje i uporedi sa tačnim izgovorom. */
  const [snimci, setSnimci] = useState<Record<number, string>>({});
  /** Reč koja čeka da je dete samo oceni, jer prepoznavanje govora nije odgovorilo. */
  const [naOceni, setNaOceni] = useState<number | null>(null);
  /** Snimak je bio tih — piše se detetu umesto da ćutke ne radi ništa. */
  const [tiho, setTiho] = useState<number | null>(null);

  /** Da li je prepoznavanje već presudilo za tekući pokušaj. */
  const presudjenoRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const zavrsiAko = (novi: Record<number, "correct" | "wrong" | "retry">) => {
    const tacnih = Object.values(novi).filter((r) => r === "correct").length;
    if (tacnih === task.items.length) {
      celebrateBig();
      setTimeout(() => onComplete({ allCorrect: true, erroredItems: [] }), 1200);
    }
  };

  const { isSupported: prepoznavanjePostoji, startListening, stopListening } = useSpeechRecognition({
    lang: "ca-ES",
    onError: () => {
      // Greška prepoznavanja se NE prikazuje detetu i NE ruši zadatak: snimanje
      // je osnova i radi i bez nje. Prava greška mikrofona stiže iz snimanja.
    },
    onResult: (transcript, alternatives) => {
      if (activeIdx === null || presudjenoRef.current) return;
      presudjenoRef.current = true;
      const item = task.items[activeIdx];
      const sve = alternatives || [transcript];
      const tacno = sve.some((t) => wordsMatch(t, item.catalan));
      const novi = { ...results, [activeIdx]: (tacno ? "correct" : "retry") as "correct" | "retry" };
      setResults(novi);
      if (tacno) { celebrate(); zavrsiAko(novi); }
      setNaOceni(null);
      setActiveIdx(null);
    },
  });

  const { snima, nivo, pocni, stani } = useSnimanjeGlasa({
    onGotovo: (ishod: IshodSnimka) => {
      const idx = activeIdx;
      if (idx === null) return;
      if (ishod.snimak) setSnimci((p) => ({ ...p, [idx]: ishod.snimak! }));

      // Prepoznavanju se ostavlja još trenutak — ono ume da odgovori tek pošto
      // se snimanje zaustavi. Bez ove pauze bi dete dobilo samoprocenu i za reč
      // koju je prepoznavanje upravo priznalo kao tačnu.
      setTimeout(() => {
        if (presudjenoRef.current) return;
        try { stopListening(); } catch {}
        if (!ishod.imaGlasa) {
          setTiho(idx);
          setActiveIdx(null);
          void javiKvarMikrofona("samoprocena:tisina", `vrh=${ishod.vrhunac} ureaj=${ishod.uredjaj}`);
          return;
        }
        // Zvuk je stigao, a prepoznavanje nije odgovorilo → dete sluša sebe i
        // ocenjuje. Ovo NIJE zaobilaženje: reč je morala biti izgovorena.
        setNaOceni(idx);
        setActiveIdx(null);
      }, 900);
    },
    onGreska: (kod: GreskaMikrofona, detalj) => {
      setRazlog(kod);
      setActiveIdx(null);
      void javiKvarMikrofona("samoprocena:snimanje", `${kod} ${detalj}`);
    },
  });

  const handleMicClick = (idx: number) => {
    if (results[idx] === "correct" || snima) return;
    setActiveIdx(idx);
    setRazlog(null);
    setTiho(null);
    setNaOceni(null);
    presudjenoRef.current = false;
    void pocni();
    // Prepoznavanje se pušta uporedo, ali njegov neuspeh nikoga ne zanima.
    if (prepoznavanjePostoji) { try { void startListening(); } catch {} }
  };

  const pustiSnimak = (idx: number) => {
    const url = snimci[idx];
    if (!url) return;
    try { window.speechSynthesis?.cancel(); } catch {}
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = url;
    void audioRef.current.play().catch(() => {});
  };

  const oceni = (idx: number, dobro: boolean) => {
    const novi = { ...results, [idx]: (dobro ? "correct" : "retry") as "correct" | "retry" };
    setResults(novi);
    setNaOceni(null);
    if (dobro) { celebrate(); zavrsiAko(novi); }
  };

  const handleSkip = (idx: number) => {
    setResults((prev) => ({ ...prev, [idx]: "wrong" }));
    setNaOceni(null);
    speak(task.items[idx].catalan);
  };

  const correctCount = Object.values(results).filter((r) => r === "correct").length;
  const allDone = correctCount === task.items.length;

  // U samoprocenu bez mikrofona ide se SAMO ako pregledač uopšte ne ume da
  // otvori mikrofon, ili ako roditelj to ručno izabere. Nikad automatski zbog
  // jedne greške — to je ranije rušilo ceo zadatak na prvom kliku.
  const nemaMikrofonaUopste =
    typeof navigator !== "undefined" && !navigator.mediaDevices?.getUserMedia;
  if (nemaMikrofonaUopste || forceFallback) {
    return <FallbackSelfAssessment task={task} onComplete={onComplete} showWarning razlog={razlog} />;
  }

  return (
    <div className="space-y-4">
      {/* Izlaz se nudi TEK kad mikrofon stvarno zataji. Dok radi, nema dugmeta
          kojim bi se zadatak preskočio bez izgovaranja — to je bio način da se
          vara („kliknem znam i gotovo"). */}
      {razlog && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <MicOff className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm font-bold text-amber-800">
              {RAZLOZI[razlog]?.sta ?? "El micròfon no ha funcionat."}
            </p>
          </div>
          <p className="text-sm text-amber-700">{RAZLOZI[razlog]?.kako ?? `Codi: ${razlog}`}</p>
          <button
            onClick={() => setForceFallback(true)}
            className="flex items-center gap-2 px-3 min-h-[44px] rounded-full border-2 border-amber-300 bg-white text-sm font-bold"
          >
            <MicOff className="w-4 h-4" /> Continua sense micròfon
          </button>
        </div>
      )}

      {/* Snimak bez glasa je SASVIM DRUGI kvar od „usluga nije odgovorila", a
          ranije su izgledali isto. Sada se kaže tačno šta se desilo. */}
      {tiho !== null && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-bold text-blue-800">No hem sentit res. 🤫</p>
          <p className="text-sm text-blue-700">
            Parla més a prop del micròfon i una mica més fort. Si continua igual,
            demana a un adult que triï un altre micròfon a Configuració.
          </p>
        </div>
      )}

      <div className="text-sm text-[var(--text-light)] text-center">
        {correctCount} / {task.items.length} paraules
      </div>

      <div
        className="task-cards"
        style={{ "--card-min": "150px", "--card-max": "230px", "--card-gap": "0.75rem" } as CSSProperties}
      >
        {task.items.map((item, idx) => {
          const status = results[idx];
          const snimaOvu = activeIdx === idx && snima;
          const ocenjujeOvu = naOceni === idx;
          const illustration = getWordIllustration(item.catalan);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`bg-white rounded-xl p-3 shadow-sm border-3 transition-all flex flex-col items-center ${
                status === "correct"
                  ? "border-green-500 bg-green-50"
                  : status === "retry"
                    ? "border-orange-400 bg-orange-50"
                    : status === "wrong"
                      ? "border-red-400 bg-red-50"
                      : ocenjujeOvu
                        ? "border-[var(--primary)]"
                        : "border-gray-200"
              }`}
            >
              <div className="mb-2">
                {illustration ? (
                  <img src={illustration} alt="" draggable={false}
                       className="w-28 h-28 sm:w-32 sm:h-32 object-contain select-none" />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 rounded-lg" />
                )}
              </div>

              <div className="flex flex-col items-center gap-1.5 w-full">
                {status === "correct" ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">✅</motion.div>
                ) : status === "wrong" ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xl text-red-500 font-bold">✗</motion.div>
                ) : ocenjujeOvu ? (
                  /* SAM SEBE SLUŠA PA OCENJUJE — samo kad je zvuk stvarno stigao.
                     Ovo je i najbolji način učenja izgovora: dete čuje sebe
                     odmah pored tačnog izgovora i samo čuje razliku. */
                  <div className="w-full flex flex-col items-center gap-1.5">
                    <p className="text-sm font-bold font-handwriting text-[var(--primary)]">{item.catalan}</p>
                    <div className="flex gap-1.5">
                      <button onClick={() => pustiSnimak(idx)}
                              className="flex items-center gap-1 px-2 min-h-[40px] rounded-lg bg-gray-100 text-xs font-bold">
                        <Play className="w-4 h-4" /> Jo
                      </button>
                      <button onClick={() => speak(item.catalan)}
                              className="flex items-center gap-1 px-2 min-h-[40px] rounded-lg bg-gray-100 text-xs font-bold">
                        <Volume2 className="w-4 h-4" /> Model
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => oceni(idx, true)}
                              className="px-2 py-1.5 min-h-[40px] bg-green-100 hover:bg-green-200 rounded-lg text-xs font-bold">
                        Igual ✅
                      </button>
                      <button onClick={() => oceni(idx, false)}
                              className="px-2 py-1.5 min-h-[40px] bg-orange-100 hover:bg-orange-200 rounded-lg text-xs font-bold">
                        Un altre cop
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => (snimaOvu ? stani() : handleMicClick(idx))}
                      disabled={snima && !snimaOvu}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        snimaOvu ? "bg-red-500 shadow-lg shadow-red-300" : "bg-[var(--primary)] hover:bg-[var(--secondary)]"
                      } text-white disabled:opacity-40`}
                      aria-label={snimaOvu ? "Atura" : `Digues ${item.catalan}`}
                    >
                      <Mic className="w-6 h-6" />
                    </motion.button>

                    {/* TRAKA KOJA SE POMERA DOK DETE GOVORI.
                        Ovo je najvažniji deo cele popravke: dosad se nije moglo
                        znati da li mikrofon uopšte čuje. Sada se vidi. */}
                    {snimaOvu && (
                      <div className="w-full">
                        <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-green-500 transition-[width] duration-75"
                               style={{ width: `${nivo}%` }} />
                        </div>
                        <p className="text-[11px] text-center text-red-500 font-bold mt-0.5">
                          {nivo > 8 ? "Et sento! 🎤" : "Parla…"}
                        </p>
                      </div>
                    )}

                    {status === "retry" && !snimaOvu && (
                      <div className="flex items-center gap-1">
                        <RefreshCcw className="w-4 h-4 text-orange-500" />
                        <button onClick={() => handleSkip(idx)} className="text-xs text-gray-500 underline">
                          Passa
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {allDone && (
        <div className="task-action-bar">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete({ allCorrect: true, erroredItems: [] })}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Molt bé! Continua! 🎉
          </motion.button>
        </div>
      )}
    </div>
  );
}

// Fallback when speech recognition not supported or mic failed
/**
 * ZAŠTO MIKROFON NE RADI — prevod koda greške u rečenicu koja kaže ŠTA URADITI.
 *
 * Pregledač uvek javi razlog, ali je do 14.08.2026. završavao samo u skrivenoj
 * konzoli. Zato se nije znalo zašto mikrofon ne radi na detetovom laptopu, pa se
 * umesto popravke nudio zaobilazni put (samoprocena), gde dete može i da slaže
 * da zna reč. Sada razlog piše na ekranu.
 */
const RAZLOZI: Record<string, { sta: string; kako: string }> = {
  // Kodovi iz snimanja (16.08.2026) — snimanje je sada osnova, pa njegove
  // greške stižu prve i moraju imati jasnu poruku.
  "nema-dozvole": {
    sta: "El navegador no té permís per fer servir el micròfon.",
    kako: "Clica el cadenat  a la barra d'adreces → Micròfon → Permet. Al Mac també: Configuració del sistema → Privadesa i seguretat → Micròfon → activa el navegador.",
  },
  "nema-mikrofona": {
    sta: "No s'ha trobat cap micròfon.",
    kako: "Comprova que l'ordinador en té un. A Configuració del joc pots triar quin micròfon vols fer servir.",
  },
  zauzet: {
    sta: "Una altra aplicació està fent servir el micròfon.",
    kako: "Tanca Zoom, Teams, Meet o qualsevol programa que gravi, i torna-ho a provar.",
  },
  "nije-podrzano": {
    sta: "Aquest navegador no pot obrir el micròfon.",
    kako: "Obre el joc amb Google Chrome.",
  },
  nepoznato: {
    sta: "El micròfon no ha funcionat.",
    kako: "Torna-ho a provar. Si continua igual, tria un altre micròfon a Configuració.",
  },
  "not-allowed": {
    sta: "El navegador no té permís per fer servir el micròfon.",
    kako: "Clica el cadenat a la barra d'adreces → Micròfon → Permet. Al Mac també: Configuració del sistema → Privadesa i seguretat → Micròfon → activa el navegador.",
  },
  "service-not-allowed": {
    sta: "Aquest navegador no permet el reconeixement de veu.",
    kako: "Obre el joc amb Google Chrome. El Safari sovint no ho permet.",
  },
  "audio-capture": {
    sta: "No s'ha trobat cap micròfon.",
    kako: "Comprova que l'ordinador té micròfon i que cap altra aplicació l'està fent servir.",
  },
  "language-not-supported": {
    sta: "Aquest navegador no reconeix el català.",
    kako: "Obre el joc amb Google Chrome.",
  },
  network: {
    sta: "El reconeixement de veu necessita internet.",
    kako: "Comprova la connexió i torna-ho a provar.",
  },
};

function FallbackSelfAssessment({
  task,
  onComplete,
  showWarning = true,
  razlog = null,
}: {
  task: SelfAssessmentTask;
  onComplete: (result: TaskResult) => void;
  showWarning?: boolean;
  /** Kod greške iz pregledača (`not-allowed`, `network`…) — zašto mikrofon ne radi. */
  razlog?: string | null;
}) {
  const [ratings, setRatings] = useState<Record<number, "yes" | "no">>({});

  const handleRate = (idx: number, rating: "yes" | "no", catalanWord: string) => {
    setRatings((prev) => ({ ...prev, [idx]: rating }));
    if (rating === "yes") {
      celebrate();
    }
    speak(catalanWord);
  };

  const allRated = task.items.every((_, i) => ratings[i]);
  const correctCount = Object.values(ratings).filter((r) => r === "yes").length;

  return (
    <div className="space-y-4">
      {/* ZAŠTO MIKROFON NE RADI — vidljivo, sa uputstvom.
          Ovaj režim je SAMOPROCENA: dete samo kaže „znam", pa može i da slaže.
          Zato ovde ne stoji samo „nije dostupan" nego i tačan razlog i šta se
          radi, da se mikrofon vrati u igru umesto da se zaobiđe. */}
      {(showWarning || razlog) && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2">
            <MicOff className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm font-bold text-amber-800">
              {razlog && RAZLOZI[razlog]
                ? RAZLOZI[razlog].sta
                : "El micròfon no està disponible."}
            </p>
          </div>
          <p className="text-sm text-amber-700">
            {razlog && RAZLOZI[razlog]
              ? RAZLOZI[razlog].kako
              : "Demana ajuda a un adult."}
          </p>
          {razlog && !RAZLOZI[razlog] && (
            <p className="text-xs text-amber-600">Codi: {razlog}</p>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="text-sm text-[var(--text-light)] text-center">
        {correctCount} / {task.items.length} paraules
      </div>

      {/* Grid of cards */}
      <div
        className="task-cards"
        style={{ "--card-min": "150px", "--card-max": "230px", "--card-gap": "0.75rem" } as CSSProperties}
      >
        {task.items.map((item, idx) => {
          const rating = ratings[idx];
          const illustration = getWordIllustration(item.catalan);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className={`bg-white rounded-xl p-3 shadow-sm border-3 transition-all flex flex-col items-center ${
                rating === "yes"
                  ? "border-green-500 bg-green-50"
                  : rating === "no"
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
              }`}
            >
              {/* Image (larger) */}
              <div className="mb-2">
                {illustration ? (
                  <img
                    src={illustration}
                    alt=""
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                  />
                ) : (
                  /* Reč bez ilustracije: prazan okvir, BEZ znaka pitanja.
                     Znak pitanja je detetu govorio da je nešto pokvareno, a fali
                     samo slika — reč se i dalje uči normalno. */
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-100 rounded-lg" />
                )}
              </div>

              {/* Rating buttons or result */}
              {rating ? (
                <div className="text-center">
                  <p className="text-sm font-bold font-handwriting text-[var(--primary)]">
                    {item.catalan}
                  </p>
                  <span className="text-lg">{rating === "yes" ? "✅" : "😅"}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleRate(idx, "yes", item.catalan)}
                    className="px-3 py-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-bold"
                  >
                    Ho sé! ✅
                  </button>
                  <button
                    onClick={() => handleRate(idx, "no", item.catalan)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-bold"
                  >
                    No 😅
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Complete button */}
      {allRated && (
        <div className="task-action-bar">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const erroredItems = Object.entries(ratings)
                .filter(([, r]) => r === "no")
                .map(([idx]) => task.items[parseInt(idx)].catalan);
              onComplete({ allCorrect: erroredItems.length === 0, erroredItems });
            }}
            className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl text-lg shadow-md"
          >
            Continua! 🎉
          </motion.button>
        </div>
      )}
    </div>
  );
}
