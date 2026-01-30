export type StarExpression =
  | "happy"
  | "excited"
  | "celebrating"
  | "confused"
  | "sad"
  | "shocked"
  | "dizzy"
  | "loving"
  | "smart"
  | "sleeping"
  | "laughing"
  | "fainted"
  | "nervous"
  | "proud";

export type StarAnimation =
  | "idle"
  | "bounce"
  | "spin"
  | "dance"
  | "wave"
  | "faint"
  | "roll"
  | "tremble"
  | "peek"
  | "celebrate"
  | "think"
  | "nod"
  | "none";

export interface StarReaction {
  expression: StarExpression;
  animation: StarAnimation;
  sparkles?: boolean;
  duration?: number;
}

/** Backward-compatible alias */
export type StarMood = StarExpression;
