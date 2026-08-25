export type TaskType =
  | "copy-word"
  | "fill-letters"
  | "unscramble"
  | "matching"
  | "classify-columns"
  | "word-search"
  | "color-by-instruction"
  | "fill-sentence"
  | "label-image"
  | "multiple-choice"
  | "self-assessment"
  | "drawing-canvas"
  | "add-article"
  | "separate-words"
  | "count-and-write"
  | "write-antonym"
  | "order-words"
  | "decode-grid"
  | "label-write";

export interface BaseTask {
  id: string;
  type: TaskType;
  prompt: string;
  audioPrompt?: string;
  bonus?: boolean;
}

export interface CopyWordTask extends BaseTask {
  type: "copy-word";
  words: { catalan: string; image?: string }[];
}

export interface FillLettersTask extends BaseTask {
  type: "fill-letters";
  words: { word: string; hint?: string; image?: string }[];
}

export interface UnscrambleTask extends BaseTask {
  type: "unscramble";
  words: { scrambled: string; correct: string; image?: string }[];
}

export interface MatchingTask extends BaseTask {
  type: "matching";
  /**
   * `rightImage` — slika za desnu stranu kad se ona NE MOŽE pogoditi iz teksta.
   * Odgovor „És a la teulada" je rečenica, pa traženje slike po celom tekstu ne
   * nalazi ništa iako `teulada.webp` postoji. Ovim se slika imenuje ručno.
   * Ima prednost i nad `rightTextOnly` (24.08.2026 — v. `la-casa-16`).
   *
   * `rightNoImage` — IZRIČITO nema slike, iako u biblioteci postoji nešto tog
   * imena. Piše se kad je slika koja bi se našla POGREŠNA za taj odgovor.
   * Bez toga provera `proveri-parove-bez-slike.mjs` doveka javlja upozorenje,
   * a upozorenje koje se nikad ne rešava prestaje da se čita.
   */
  pairs: { left: string; right: string; leftImage?: string; rightImage?: string; rightNoImage?: boolean }[];
  illustrationMatch?: boolean;
  /** When true, the right column shows text only (no auto illustrations) — e.g. abstract categories. */
  rightTextOnly?: boolean;
  /**
   * `joinParts` — zadatak spaja DELOVE JEDNE REČI („CUI" + „NA" = „cuina").
   * Bez ovoga je aplikacija naglas čitala „CUI, NA" — što nije reč, nema
   * snimak, pa je išlo glasom uređaja. Sada se izgovara spojena reč.
   * (24.08.2026, prijava vlasnice o tuđim glasovima.)
   */
  joinParts?: boolean;
}

export interface ClassifyColumnsTask extends BaseTask {
  type: "classify-columns";
  columns: { title: string; items: string[] }[];
  allItems: string[];
  circleMode?: boolean;
}

export interface WordSearchTask extends BaseTask {
  type: "word-search";
  gridSize: number;
  words: string[];
  grid: string[][];
}

export interface ColorByInstructionTask extends BaseTask {
  type: "color-by-instruction";
  instructions: { text: string; targetColor: string; targetItem: string }[];
  image: string;
}

export interface FillSentenceTask extends BaseTask {
  type: "fill-sentence";
  image?: string;
  /**
   * `imageLabel` — ime ispod glavne slike („Albert").
   * Piše se u KODU, ne na samoj slici: tekst na ilustraciji je zabranjen jer
   * se iste slike dele za sve jezike. (24.08.2026, zahtev vlasnice.)
   */
  imageLabel?: string;
  /** Set to false to hide the per-sentence illustrations (e.g. when the subject
   * image would mislead — the answer is a different person than the subject). */
  sentenceImages?: boolean;
  description?: string[];
  columns?: number;
  /** Slike koje stoje IZNAD rečenica kao spisak likova — dete ih gleda da bi
   *  odgovorilo (npr. „Qui és qui?": četiri lica sa imenima). Bez njih takav
   *  zadatak nije rešiv, nego se pogađa. */
  referenceImages?: string[];
  sentences: {
    text: string;
    blank: string;
    options?: string[];
    image?: string;
    /** Slika koja ZAMENI `image` kad dete odgovori tačno. Za „noi → noia":
     *  prvo se vidi dečak koji je viši od drugog, a kad dete napiše „alta",
     *  na tom istom mestu se pojavi devojčica koja je viša od druge. */
    imageAfter?: string;
  }[];
}

export interface LabelImageTask extends BaseTask {
  type: "label-image";
  image: string;
  labels: { text: string; x: number; y: number }[];
  options: string[];
}

export interface MultipleChoiceTask extends BaseTask {
  type: "multiple-choice";
  image?: string;
  questions: {
    question: string;
    options: string[];
    correct: number;
    image?: string;
  }[];
}

export interface SelfAssessmentTask extends BaseTask {
  type: "self-assessment";
  items: { catalan: string; translation: string; image?: string }[];
}

export interface DrawingCanvasTask extends BaseTask {
  type: "drawing-canvas";
}

export interface AddArticleTask extends BaseTask {
  type: "add-article";
  words: { word: string; article: string }[];
}

export interface SeparateWordsTask extends BaseTask {
  type: "separate-words";
  items: { joined: string; words: string[] }[];
}

export interface CountAndWriteTask extends BaseTask {
  type: "count-and-write";
  items: { description: string; count: number; word: string; image?: string }[];
}

export interface WriteAntonymTask extends BaseTask {
  type: "write-antonym";
  pairs: { word: string; antonym: string; options?: string[] }[];
}

export interface OrderWordsTask extends BaseTask {
  type: "order-words";
  sentences: { scrambled: string[]; correct: string[] }[];
}

export interface DecodeGridTask extends BaseTask {
  type: "decode-grid";
  codeGrid: Record<string, string>;
  words: { codes: string[]; answer: string }[];
}

export interface LabelWriteTask extends BaseTask {
  type: "label-write";
  image: string;
  labels: { text: string; x: number; y: number }[];
}

export type Task =
  | CopyWordTask
  | FillLettersTask
  | UnscrambleTask
  | MatchingTask
  | ClassifyColumnsTask
  | WordSearchTask
  | ColorByInstructionTask
  | FillSentenceTask
  | LabelImageTask
  | MultipleChoiceTask
  | SelfAssessmentTask
  | DrawingCanvasTask
  | AddArticleTask
  | SeparateWordsTask
  | CountAndWriteTask
  | WriteAntonymTask
  | OrderWordsTask
  | DecodeGridTask
  | LabelWriteTask;

export interface Theme {
  slug: string;
  name: string;
  color: string;
  icon: string;
  tasks: Task[];
}

export interface TaskResult {
  allCorrect: boolean;
  erroredItems: string[];
}

export interface UserProgress {
  [themeSlug: string]: {
    currentTask: number;
    completedTasks: string[];
    streak: number;
    bestStreak: number;
    stars: number;
    taskErrors?: Record<string, string[]>;
  };
}
