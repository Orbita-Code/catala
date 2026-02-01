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
  pairs: { left: string; right: string }[];
}

export interface ClassifyColumnsTask extends BaseTask {
  type: "classify-columns";
  columns: { title: string; items: string[] }[];
  allItems: string[];
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
  sentences: {
    text: string;
    blank: string;
    options?: string[];
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
