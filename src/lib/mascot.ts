/**
 * Maskota superheroj — dečak (donji desni ugao) i devojčica (donji levi ugao).
 *
 * Slike su gotove ilustracije (ChatGPT, 3D cartoon, isti lik u 12 varijanti po
 * detetu). Pokret dodaje SuperheroMascot kroz Framer Motion; ovde je samo
 * mapiranje "šta se desilo u igri" → "koja slika".
 *
 * Ista imena varijanti postoje za oba lika, pa je lik samo prefiks putanje.
 */

export type MascotCharacter = "decak" | "devojcica";

/** Varijante koje postoje kao slika za OBA lika (public/mascot/<lik>-<varijanta>.webp) */
export type MascotVariant =
  | "osnovni"
  | "poza"
  | "let-oblaci"
  | "vatra"
  | "led"
  | "munja"
  | "kosmos"
  | "carobnjak"
  | "stit"
  | "duh"
  | "brzina"
  | "snaga-kamen";

/**
 * Događaji su isti kao kod zvezde (`starReactions.ts`) plus `silence` —
 * reakcija na ćutanje, kad dete duže ne dira ekran.
 */
export type MascotEvent =
  | "correct"
  | "wrong"
  | "streak2"
  | "streak3"
  | "streak5"
  | "hintOffer"
  | "themeComplete"
  | "themePerfect"
  | "matchFail"
  | "idle"
  | "greeting"
  | "silence";

export interface MascotState {
  variant: MascotVariant;
  /** Kako se mrda — v. SuperheroMascot */
  motion: "float" | "pop" | "cheer" | "sway" | "appear" | "wiggle";
  /** Koliko stanje traje pre vraćanja na `idle`; bez vrednosti = ostaje */
  duration?: number;
  /** Uvećanje u odnosu na mirno stanje (1 = bez uvećanja) */
  scale?: number;
}

/**
 * Niska tačnih raste kroz moći: brzina → munja → vatra → kosmos.
 * Greška NIJE kazna — lik izvadi štit ("čuvam te, probaj ponovo").
 * Ćutanje je `duh`: providan, tih, ne skače i ne traži pažnju.
 */
const STATES: Record<MascotEvent, MascotState> = {
  idle: { variant: "let-oblaci", motion: "float" },
  greeting: { variant: "poza", motion: "pop", duration: 1800, scale: 1.1 },
  correct: { variant: "snaga-kamen", motion: "pop", duration: 1600, scale: 1.15 },
  streak2: { variant: "brzina", motion: "cheer", duration: 1800, scale: 1.2 },
  streak3: { variant: "munja", motion: "cheer", duration: 2000, scale: 1.25 },
  streak5: { variant: "vatra", motion: "cheer", duration: 2200, scale: 1.3 },
  themeComplete: { variant: "kosmos", motion: "cheer", duration: 2600, scale: 1.35 },
  themePerfect: { variant: "kosmos", motion: "cheer", duration: 2600, scale: 1.4 },
  wrong: { variant: "stit", motion: "sway", duration: 1600, scale: 1.05 },
  matchFail: { variant: "led", motion: "wiggle", duration: 1400 },
  hintOffer: { variant: "carobnjak", motion: "appear", duration: 2000, scale: 1.15 },
  // ĆUTANJE — bilo je `duh` (providan lik) i vlasnica ga je 03.08.2026. pročitala
  // kao kvar: „posle par sekundi se pretvore u providne, to jest ledene".
  // I s pravom — dete koje razmišlja nad zadatkom vidi kako mu heroji blede, a
  // to liči na grešku, ne na pitanje „jesi li tu". Sada lik ostaje pun i samo
  // mahne rukom u pozi. Providnost se više ne koristi ni u jednom stanju.
  silence: { variant: "poza", motion: "wiggle", duration: 1600, scale: 1.08 },
};

export function getMascotState(event: MascotEvent): MascotState {
  return STATES[event] ?? STATES.idle;
}

/** Isti prag kao kod zvezde, da lik i zvezda nikad ne kažu različito */
export function getMascotEvent(
  result: "correct" | "wrong",
  streakCount: number
): MascotEvent {
  if (result === "wrong") return "wrong";
  if (streakCount >= 5) return "streak5";
  if (streakCount >= 3) return "streak3";
  if (streakCount >= 2) return "streak2";
  return "correct";
}

export function mascotImage(character: MascotCharacter, variant: MascotVariant): string {
  return `/mascot/${character}-${variant}.webp`;
}

/**
 * TREPTAJ (03.08.2026) — postoji za mirno stanje, gde lik i provede najviše vremena.
 *
 * Slika sa zatvorenim očima nije nova generacija nego je napravljena IZ ISTE SLIKE
 * (`scripts/napravi-treptaj.py`): kapak se nacrta preko oka, a boja kože se uzme sa
 * te slike. Zato se dva kadra poklapaju u piksel i smena se ne primeti. Nova
 * generacija bi dala lik koji je sličan ali ne isti, pa bi treptaj izgledao kao
 * poskakivanje glave.
 *
 * Vraća `null` za varijante za koje kadar nije napravljen — tada lik prosto ne trepće.
 */
const IMA_TREPTAJ: MascotVariant[] = ["let-oblaci", "poza"];

export function mascotBlinkImage(
  character: MascotCharacter,
  variant: MascotVariant
): string | null {
  return IMA_TREPTAJ.includes(variant)
    ? `/mascot/${character}-${variant}-oci.webp`
    : null;
}

/**
 * POZA ZA CRTANI LIK (`SuperheroSvg`) — 03.08.2026.
 *
 * Gotove slike su ostale u `public/mascot/` i i dalje se koriste na početnoj
 * strani i u proslavama, ali lik koji stoji uz zadatak sada je crtež u
 * slojevima, pa mu treba POZA, ne ime slike. Ovde je jedino mesto koje
 * prevodi „šta se desilo u igri" u „kako lik stoji".
 */
export type MascotPoza = "mirno" | "navija" | "stit" | "maha" | "pita";

const POZE: Record<MascotEvent, MascotPoza> = {
  idle: "mirno",
  greeting: "maha",
  correct: "navija",
  streak2: "navija",
  streak3: "navija",
  streak5: "navija",
  themeComplete: "navija",
  themePerfect: "navija",
  wrong: "stit",
  matchFail: "stit",
  hintOffer: "pita",
  silence: "maha",
};

export function getMascotPoza(event: MascotEvent): MascotPoza {
  return POZE[event] ?? "mirno";
}

/**
 * Balon sa tekstom nosi SAMO jedan lik, da se dva govorna balona ne prekrivaju.
 * Devojčica je levo pa joj balon ide desno od glave, i obrnuto — zato ona govori
 * na parne, a dečak na neparne događaje; deluje kao da se smenjuju.
 */
export function speakingCharacter(turn: number): MascotCharacter {
  return turn % 2 === 0 ? "devojcica" : "decak";
}

/** Koliko mirovanja pre nego što lik tiho pita "jesi li tu" (ms) */
export const SILENCE_DELAY_MS = 20000;

/** Sve varijante — koristi se u pretpremanju slika (preload) */
export const ALL_VARIANTS: MascotVariant[] = [
  "osnovni",
  "poza",
  "let-oblaci",
  "vatra",
  "led",
  "munja",
  "kosmos",
  "carobnjak",
  "stit",
  "duh",
  "brzina",
  "snaga-kamen",
];
