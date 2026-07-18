"use client";

import dynamic from "next/dynamic";
import { Task, TaskResult } from "@/types/tasks";

const CopyWord = dynamic(() => import("./CopyWord"), { ssr: false });
const FillLetters = dynamic(() => import("./FillLetters"), { ssr: false });
const Matching = dynamic(() => import("./Matching"), { ssr: false });
const ClassifyColumns = dynamic(() => import("./ClassifyColumns"), { ssr: false });
const WordSearch = dynamic(() => import("./WordSearch"), { ssr: false });
const FillSentence = dynamic(() => import("./FillSentence"), { ssr: false });
const MultipleChoice = dynamic(() => import("./MultipleChoice"), { ssr: false });
const Unscramble = dynamic(() => import("./Unscramble"), { ssr: false });
const SelfAssessment = dynamic(() => import("./SelfAssessment"), { ssr: false });
const ColorByInstruction = dynamic(() => import("./ColorByInstruction"), { ssr: false });
const LabelImage = dynamic(() => import("./LabelImage"), { ssr: false });
const DrawingCanvas = dynamic(() => import("./DrawingCanvas"), { ssr: false });
const AddArticle = dynamic(() => import("./AddArticle"), { ssr: false });
const SeparateWords = dynamic(() => import("./SeparateWords"), { ssr: false });
const CountAndWrite = dynamic(() => import("./CountAndWrite"), { ssr: false });
const WriteAntonym = dynamic(() => import("./WriteAntonym"), { ssr: false });
const OrderWords = dynamic(() => import("./OrderWords"), { ssr: false });
const DecodeGrid = dynamic(() => import("./DecodeGrid"), { ssr: false });
const LabelWrite = dynamic(() => import("./LabelWrite"), { ssr: false });

interface TaskRendererProps {
  task: Task;
  onComplete: (result: TaskResult) => void;
  /** When true, render the task in its solved state (correct answers shown, no interaction). */
  review?: boolean;
}

export default function TaskRenderer({ task, onComplete, review }: TaskRendererProps) {
  switch (task.type) {
    case "copy-word":
      return <CopyWord task={task} onComplete={onComplete} review={review} />;
    case "fill-letters":
      return <FillLetters task={task} onComplete={onComplete} review={review} />;
    case "matching":
      return <Matching task={task} onComplete={onComplete} review={review} />;
    case "classify-columns":
      return <ClassifyColumns task={task} onComplete={onComplete} review={review} />;
    case "word-search":
      return <WordSearch task={task} onComplete={onComplete} review={review} />;
    case "fill-sentence":
      return <FillSentence task={task} onComplete={onComplete} review={review} />;
    case "multiple-choice":
      return <MultipleChoice task={task} onComplete={onComplete} review={review} />;
    case "unscramble":
      return <Unscramble task={task} onComplete={onComplete} review={review} />;
    case "self-assessment":
      return <SelfAssessment task={task} onComplete={onComplete} />;
    case "color-by-instruction":
      return <ColorByInstruction task={task} onComplete={onComplete} review={review} />;
    case "label-image":
      return <LabelImage task={task} onComplete={onComplete} review={review} />;
    case "drawing-canvas":
      return <DrawingCanvas task={task} onComplete={onComplete} />;
    case "add-article":
      return <AddArticle task={task} onComplete={onComplete} review={review} />;
    case "separate-words":
      return <SeparateWords task={task} onComplete={onComplete} review={review} />;
    case "count-and-write":
      return <CountAndWrite task={task} onComplete={onComplete} review={review} />;
    case "write-antonym":
      return <WriteAntonym task={task} onComplete={onComplete} review={review} />;
    case "order-words":
      return <OrderWords task={task} onComplete={onComplete} review={review} />;
    case "decode-grid":
      return <DecodeGrid task={task} onComplete={onComplete} review={review} />;
    case "label-write":
      return <LabelWrite task={task} onComplete={onComplete} review={review} />;
    default:
      return (
        <div className="text-center p-8 text-[var(--text-light)]">
          Aquesta tasca encara no està disponible.
        </div>
      );
  }
}
