"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface UseSpeechRecognitionOptions {
  lang?: string;
  onResult?: (transcript: string, alternatives?: string[]) => void;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  error: string | null;
}

// Normalize text for comparison (remove accents, lowercase, trim)
export function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " "); // Normalize spaces
}

// Check if two words match (fuzzy comparison for speech recognition)
export function wordsMatch(spoken: string, expected: string): boolean {
  const normalSpoken = normalizeForComparison(spoken);
  const normalExpected = normalizeForComparison(expected);

  // Exact match
  if (normalSpoken === normalExpected) return true;

  /**
   * MNOŽINA SE PRIZNAJE (17.08.2026, prijava vlasnice).
   *
   * Dete je u zadatku sa mikrofonom deset puta reklo „cames" umesto „cama",
   * jer na slici VIDI dve noge — i zadatak nije prolazio. Reč je znalo; falila
   * je samo jedna gramatička sitnica koju slika sama sugeriše.
   *
   * Zato se sada priznaje i množina tražene reči, i obrnuto. Ovo važi SAMO za
   * izgovor: tamo se proverava da li dete zna reč, a ne da li ume da je
   * napiše. U pisanim zadacima ostaje strogo.
   *
   * (Slika za `cama` je istog dana promenjena na JEDNU nogu — ovo je pojas i
   * tregeri: isto se dešava sa `ull`/`ulls`, `mà`/`mans`, `orella`/`orelles`.)
   */
  // Katalonska množina nije samo „+s": `cama`→`cames`, `orella`→`orelles`,
  // `mà`→`mans`, `ull`→`ulls`. Zato se skida završno „s", pa završno „n"
  // (zbog `mans`), pa se završno „e" vrati na „a" (`came`→`cama`).
  const osnova = (t: string) =>
    t.replace(/s$/, "").replace(/(.{2,})n$/, "$1").replace(/e$/, "a");
  if (osnova(normalSpoken) === osnova(normalExpected) && osnova(normalExpected).length >= 2) return true;

  // Check if spoken contains expected (child might say extra words)
  if (normalSpoken.includes(normalExpected)) return true;

  /**
   * PREPOZNAVANJE UME DA RASECE REČ NA DVA DELA (17.08.2026, prijava vlasnice:
   * „sto puta je rekla `mitjons` i ne prihvata").
   *
   * Usluga za prepoznavanje često vrati „mit jons" ili „mi tjons" — čula je
   * tačno, samo je razmak stavila gde mu nije mesto. Za dete je to isto,
   * a zadatak je padao. Zato se poređenje radi i BEZ IJEDNOG RAZMAKA.
   */
  const bezRazmaka = (t: string) => t.replace(/\s+/g, "");
  if (bezRazmaka(normalSpoken) === bezRazmaka(normalExpected)) return true;
  if (bezRazmaka(normalSpoken).includes(bezRazmaka(normalExpected))
      && bezRazmaka(normalExpected).length >= 4) return true;

  // Check if expected contains spoken (partial match)
  if (normalExpected.includes(normalSpoken) && normalSpoken.length > 2) return true;

  // Levenshtein distance for typo tolerance (allow 1-2 character differences)
  const distance = levenshteinDistance(normalSpoken, normalExpected);
  const maxAllowedDistance = Math.max(1, Math.floor(normalExpected.length * 0.25));
  if (distance <= maxAllowedDistance) return true;

  return false;
}

// Simple Levenshtein distance implementation
/**
 * NAJBLIŽA REČ IZ SAMOG ZADATKA (17.08.2026, prijava vlasnice: „sto puta je
 * rekla `mitjons` i ne prihvata").
 *
 * ZAŠTO OVAKO: usluga za prepoznavanje retko vrati baš „mitjons". Vrati
 * „mitjón", „michones", „mit jons" — čula je dete, ali je zapisala po svome.
 * Dosadašnja provera je dozvoljavala najviše ČETVRTINU reči razlike, što je za
 * reč od sedam slova jedno jedino slovo. Zato je dete govorilo tačno, a
 * zadatak padao.
 *
 * Popuštanje te granice za sve bilo bi opasno — počelo bi da prima i pogrešne
 * reči. Zato se ne popušta nego se pita drugačije: od SVIH reči u tom zadatku,
 * kojoj je izgovoreno najbliže? Ako je to tražena reč, i ako nije očigledno
 * daleko, priznaje se. Time se ne može proći sa drugom reči iz istog zadatka —
 * ona bi bila bliža sama sebi.
 */
export function najblizaRec(izgovoreno: string, sveReci: string[]): string | null {
  const g = normalizeForComparison(izgovoreno).replace(/\s+/g, "");
  if (!g) return null;
  let najbolja: string | null = null;
  let najmanja = Infinity;
  for (const r of sveReci) {
    const d = levenshteinDistance(g, normalizeForComparison(r).replace(/\s+/g, ""));
    if (d < najmanja) { najmanja = d; najbolja = r; }
  }
  if (najbolja === null) return null;
  // Granica: pola dužine reči. Dalje od toga nije „malo pogrešno zapisano"
  // nego druga reč, i ne priznaje se ni ako je najbliža.
  const granica = Math.max(2, Math.floor(normalizeForComparison(najbolja).length / 2));
  return najmanja <= granica ? najbolja : null;
}

function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Redosled jezika. Prvo pravi katalonski, pa kratka oznaka, pa španski kao
 * poslednja odbrana — bolje blizak izgovor nego nem mikrofon.
 */
const REZERVNI_JEZICI = ["ca-ES", "ca", "es-ES"];

function getSpeechRecognitionClass(): (new () => SpeechRecognitionInterface) | null {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { lang = "ca-ES", onResult, onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(() => getSpeechRecognitionClass() !== null);

  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gotResultRef = useRef(false);
  /** Koji jezik po redu se trenutno proba (v. REZERVNI_JEZICI). */
  const pokusajJezikaRef = useRef(0);
  /** Da bi greška mogla da pozove ponovni pokušaj, a da nastane pre nje. */
  const startListeningRef = useRef<(() => Promise<void>) | null>(null);
  const didStartRef = useRef(false);
  // Use refs for callbacks to avoid stale closures
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const langRef = useRef(lang);

  // Keep refs updated
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
    langRef.current = lang;
  }, [onResult, onError, lang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  /**
   * IZRIČITO TRAŽENJE DOZVOLE ZA MIKROFON (14.08.2026)
   *
   * Prijava: na detetovom laptopu mikrofon „uopšte ne radi", bez ijedne poruke.
   * Uzrok je gotovo uvek isti: prepoznavanje govora se oslanja na to da će
   * pregledač SAM zatražiti dozvolu — a Safari to često ne uradi, pa se ništa
   * ne desi i dugme deluje mrtvo.
   *
   * `getUserMedia` traži dozvolu OTVORENO: prozorčić iskoči, i kad se jednom
   * dozvoli, radi i prepoznavanje govora. Zvuk se odmah gasi (`stop()`) — ovo
   * ne snima ništa, samo pita.
   *
   * Uz to razdvaja dva sasvim različita kvara koja su dosad izgledala isto:
   * „nema dozvole / nema mikrofona" naspram „pregledač ne ume da prepozna govor".
   */
  const traziDozvolu = useCallback(async (): Promise<string | null> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return null; // stariji pregledač — ne prekidamo, neka proba prepoznavanje
    }
    try {
      const tok = await navigator.mediaDevices.getUserMedia({ audio: true });
      tok.getTracks().forEach((t) => t.stop());
      return null;
    } catch (e) {
      const ime = (e as Error)?.name || "";
      if (ime === "NotAllowedError" || ime === "SecurityError") return "not-allowed";
      if (ime === "NotFoundError" || ime === "DevicesNotFoundError") return "audio-capture";
      return "audio-capture";
    }
  }, []);

  /**
   * DOZVOLA SE ČEKA, PA SE TEK ONDA SLUŠA (14.08.2026).
   *
   * Prva verzija je tražila dozvolu i U ISTOM DAHU pokretala prepoznavanje.
   * Dok prozorčić „Dozvoli mikrofon?" stoji na ekranu, prepoznavanje se ugasi
   * samo od sebe (`onend` bez `onstart`) — a to je kod tumačio kao „pregledač
   * ne ume" i TRAJNO gasio mikrofon. Zato je klik na prvu reč rušio ceo zadatak
   * u samoprocenu. Sada se dozvola SAČEKA (`await`), pa se sluša.
   */
  /**
   * SAFARI: PREPOZNAVANJE MORA DA KRENE U SAMOM KLIKU (28.08.2026).
   *
   * Prijava vlasnice, ponovljena više puta: „mikrofon u Safariju i dalje ne
   * radi — ponaša se kao da čuje šta pričam, ali ne registruje šta kažem."
   * Taj opis je tačno pokazao gde puca. Traka jačine se pomera, dakle
   * `getUserMedia` radi i zvuk stiže; ne radi ONO ŠTO PRESUĐUJE — prepoznavanje.
   *
   * Uzrok: Safari pušta `SpeechRecognition.start()` SAMO dok traje korisnikov
   * klik. Naš kod je pre toga čekao dozvolu (`await traziDozvolu()`), a svako
   * čekanje prekida vezu sa klikom — pa Safari `start()` tiho odbije. Chrome
   * to dozvoljava, zato je na jednom računaru radilo, a na drugom ne.
   *
   * Popravka: sve do `start()` je sada BEZ IJEDNOG ČEKANJA. Dozvola se traži
   * tek ako `start()` ne uspe ili ako stigne greška „nema dozvole", pa se
   * pokuša ponovo. Snimanje ionako traži dozvolu uporedo, pa prozorčić iskoči
   * kao i pre.
   *
   * Ovim se NE ukida popravka od 14.08.2026 (mikrofon se ne gasi trajno posle
   * jedne greške) — ona je u `onerror` i `onend` i ostaje netaknuta.
   */
  const dozvolaTrazenaRef = useRef(false);

  const startListening = useCallback(async () => {
    const SpeechRecognition = getSpeechRecognitionClass();
    if (!SpeechRecognition) {
      console.log("[Speech] Not supported");
      return;
    }

    // Abort any existing instance first
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Cancel any ongoing TTS — it can block mic input on tablets
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setError(null);
    setTranscript("");
    gotResultRef.current = false;
    didStartRef.current = false;
    console.log("[Speech] Creating fresh instance...");

    // Create a fresh instance each time to avoid stale state on iOS/tablets
    const recognition = new SpeechRecognition() as SpeechRecognitionInterface;
    recognition.continuous = false;
    recognition.interimResults = false;
    /**
     * JEZIK SE MENJA AKO GA UREĐAJ NE PODRŽAVA (16.08.2026).
     *
     * Ovo je najverovatniji odgovor na pitanje „zašto radi na mom Mac-u a ne na
     * ćerkinom, ako je isti sajt": prepoznavanje govora NIJE deo sajta nego
     * usluga pregledača, i katalonski nije svuda instaliran. Kad ga nema,
     * pregledač vrati `language-not-supported` ili prosto ćuti tridesetak
     * sekundi — tačno kako je prijavljeno.
     *
     * Zato se sada redom probaju `ca-ES`, pa `ca`, pa `es-ES`. Španski nije
     * savršen za katalonske reči, ali izgovor je blizak, a provera je popustljiva
     * (dozvoljeno je 1–2 slova razlike), pa dete dobije zeleno kad kaže tačno —
     * umesto da mu se ništa ne desi.
     */
    recognition.lang = REZERVNI_JEZICI[pokusajJezikaRef.current] || langRef.current;
    recognition.maxAlternatives = 5;

    (recognition as any).onstart = () => {
      didStartRef.current = true;
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      console.log("[Speech] Recording started");
      setIsListening(true);

      // Safety timeout: if no result within 8 seconds, stop and show error
      timeoutRef.current = setTimeout(() => {
        console.log("[Speech] Timeout - no result received");
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch {}
          recognitionRef.current = null;
        }
        if (!gotResultRef.current) {
          const msg = "No s'ha detectat cap veu. Torna a provar!";
          setError(msg);
          onErrorRef.current?.(msg);
        }
        setIsListening(false);
      }, 8000);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      gotResultRef.current = true;

      // Check all alternatives, not just the first one
      const allTranscripts: string[] = [];
      for (let i = 0; i < event.results[0].length; i++) {
        allTranscripts.push(event.results[0][i].transcript);
      }
      const bestTranscript = allTranscripts[0];
      console.log("[Speech] Got results:", allTranscripts);

      setTranscript(bestTranscript);
      // Pass all alternatives so the caller can check each one
      onResultRef.current?.(bestTranscript, allTranscripts);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      console.log("[Speech] Error:", event.error);

      // MIKROFON SE VIŠE NIKAD NE GASI SAM (14.08.2026).
      // Ranije je jedna greška postavljala `isSupported = false`, pa je ceo
      // zadatak padao u samoprocenu — gde dete klikne „znam" i preskoči reč.
      // Greška se sada samo PRIJAVI; dete odmah može da pokuša ponovo, a u
      // režim bez mikrofona prelazi jedino ručno, svojim dugmetom.
      if (event.error === "not-allowed" || event.error === "audio-capture") {
        setIsListening(false);
        recognitionRef.current = null;
        /**
         * „Nema dozvole" na PRVOM pokušaju u Safariju ne znači da je dete
         * odbilo mikrofon — znači da dozvola još nije zatražena. Zato se ovde
         * jednom zatraži pa pokuša ponovo; tek ako i tada ne prođe, javlja se
         * greška. (28.08.2026, uz popravku redosleda iznad.)
         */
        if (event.error === "not-allowed" && !dozvolaTrazenaRef.current) {
          dozvolaTrazenaRef.current = true;
          void traziDozvolu().then((g) => {
            if (g) { setError(g); onErrorRef.current?.(g); return; }
            void startListeningRef.current?.();
          });
          return;
        }
        setError(event.error);
        onErrorRef.current?.(event.error);
        return;
      }

      // Nepodržan jezik ili nem odgovor → probaj sledeći jezik sa spiska.
      // Bez ovoga se na uređaju bez katalonskog nikad ništa ne desi.
      if ((event.error === "language-not-supported" || event.error === "no-speech" || event.error === "network")
          && pokusajJezikaRef.current < REZERVNI_JEZICI.length - 1) {
        pokusajJezikaRef.current += 1;
        setIsListening(false);
        recognitionRef.current = null;
        void startListeningRef.current?.();
        return;
      }

      let errorMsg: string;
      switch (event.error) {
        case "no-speech":
          errorMsg = "No s'ha detectat cap veu. Torna a provar!";
          break;
        case "network":
          errorMsg = "Error de xarxa. Comprova la connexió a internet.";
          break;
        case "aborted":
          errorMsg = ""; // Don't show error for user-initiated abort
          break;
        default:
          errorMsg = `Error del micròfon: ${event.error}`;
      }
      if (errorMsg) {
        setError(errorMsg);
        onErrorRef.current?.(errorMsg);
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      console.log("[Speech] Recording ended, didStart:", didStartRef.current, "gotResult:", gotResultRef.current);
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // `onend` bez `onstart` NIJE dokaz da pregledač ne ume — najčešće znači da
      // je prozorčić za dozvolu bio otvoren dok se instanca gasila. Ranije je
      // ovo TRAJNO gasilo mikrofon i rušilo ceo zadatak u samoprocenu. Sada se
      // samo javi i pusti dete da pokuša ponovo.
      if (!didStartRef.current) {
        setIsListening(false);
        recognitionRef.current = null;
        onErrorRef.current?.("no-start");
        return;
      }
      // KRAJ BEZ IJEDNOG REZULTATA — tačno prijavljeni simptom: „upali se
      // zeleno, stoji, pa se ugasi". Najčešće znači da uređaj nema taj jezik.
      // Zato se prvo probaju ostali jezici sa spiska, pa tek onda javlja greška.
      if (!gotResultRef.current && recognitionRef.current) {
        if (pokusajJezikaRef.current < REZERVNI_JEZICI.length - 1) {
          pokusajJezikaRef.current += 1;
          recognitionRef.current = null;
          setIsListening(false);
          void startListeningRef.current?.();
          return;
        }
        const msg = "No s'ha detectat cap veu. Torna a provar!";
        setError(msg);
        onErrorRef.current?.(msg);
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();

      // Catch-all timeout: if nothing happens within 10 seconds (accounting for
      // permission dialogs which can take 5+ seconds), abort and report error.
      // We do NOT set isSupported=false here because the API might work on retry
      // (e.g. first call was slow due to permission dialog).
      // The definitive "broken API" detection is in onend (onend without onstart).
      startTimeoutRef.current = setTimeout(() => {
        if (!didStartRef.current) {
          console.log("[Speech] Start timeout — no callbacks fired in 10s");
          try { recognition.abort(); } catch {}
          recognitionRef.current = null;
          setIsListening(false);
          const msg = "El micròfon no respon. Prova el mode manual.";
          setError(msg);
          onErrorRef.current?.(msg);
        }
      }, 10000);
    } catch (e) {
      console.log("[Speech] Start error:", e);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      /**
       * `start()` NIJE PROŠAO — najčešće zato što dozvola još nije data.
       * Tek sada se dozvola traži (to sme da čeka, klik je ionako potrošen),
       * pa se pokuša još JEDNOM. Drugi put dozvola već postoji, pa Safari
       * pusti prepoznavanje.
       */
      recognitionRef.current = null;
      setIsListening(false);
      if (!dozvolaTrazenaRef.current) {
        dozvolaTrazenaRef.current = true;
        const greskaDozvole = await traziDozvolu();
        if (greskaDozvole) {
          setError(greskaDozvole);
          onErrorRef.current?.(greskaDozvole);
          return;
        }
        void startListeningRef.current?.();
        return;
      }
      setError("Error iniciant el micròfon. Torna a provar.");
    }
  }, [traziDozvolu]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch {}
    setIsListening(false);
  }, []);

  startListeningRef.current = startListening;

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    error,
  };
}
