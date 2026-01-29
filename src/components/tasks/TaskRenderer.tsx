"use client";

import dynamic from "next/dynamic";
import { Task, TaskResult } from "@/types/tasks";

const CopyWord = dynamic(() => import("./CopyWord"));
const FillLetters = dynamic(() => import("./FillLetters"));
const Matching = dynamic(() => import("./Matching"));
const ClassifyColumns = dynamic(() => import("./ClassifyColumns"));
const WordSearch = dynamic(() => import("./WordSearch"));
const FillSentence = dynamic(() => import("./FillSentence"));
const MultipleChoice = dynamic(() => import("./MultipleChoice"));
const Unscramble = dynamic(() => import("./Unscramble"));
const SelfAssessment = dynamic(() => import("./SelfAssessment"));
const ColorByInstruction = dynamic(() => import("./ColorByInstruction"));
const LabelImage = dynamic(() => import("./LabelImage"));
const DrawingCanvas = dynamic(() => import("./DrawingCanvas"));

interface TaskRendererProps {
  task: Task;
  onComplete: (result: TaskResult) => void;
}

export default function TaskRenderer({ task, onComplete }: TaskRendererProps) {
  switch (task.type) {
    case "copy-word":
      return <CopyWord task={task} onComplete={onComplete} />;
    case "fill-letters":
      return <FillLetters task={task} onComplete={onComplete} />;
    case "matching":
      return <Matching task={task} onComplete={onComplete} />;
    case "classify-columns":
      return <ClassifyColumns task={task} onComplete={onComplete} />;
    case "word-search":
      return <WordSearch task={task} onComplete={onComplete} />;
    case "fill-sentence":
      return <FillSentence task={task} onComplete={onComplete} />;
    case "multiple-choice":
      return <MultipleChoice task={task} onComplete={onComplete} />;
    case "unscramble":
      return <Unscramble task={task} onComplete={onComplete} />;
    case "self-assessment":
      return <SelfAssessment task={task} onComplete={onComplete} />;
    case "color-by-instruction":
      return <ColorByInstruction task={task} onComplete={onComplete} />;
    case "label-image":
      return <LabelImage task={task} onComplete={onComplete} />;
    case "drawing-canvas":
      return <DrawingCanvas task={task} onComplete={onComplete} />;
    default:
      return (
        <div className="text-center p-8 text-[var(--text-light)]">
          Aquesta tasca encara no està disponible.
        </div>
      );
  }
}
