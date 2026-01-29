"use client";

import { Task } from "@/types/tasks";
import CopyWord from "./CopyWord";
import FillLetters from "./FillLetters";
import Matching from "./Matching";
import ClassifyColumns from "./ClassifyColumns";
import WordSearch from "./WordSearch";
import FillSentence from "./FillSentence";
import MultipleChoice from "./MultipleChoice";
import Unscramble from "./Unscramble";
import SelfAssessment from "./SelfAssessment";

interface TaskRendererProps {
  task: Task;
  onComplete: (correct: boolean) => void;
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
    default:
      return (
        <div className="text-center p-8 text-[var(--text-light)]">
          Aquesta tasca encara no està disponible.
        </div>
      );
  }
}
