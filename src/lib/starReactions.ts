import type { StarReaction } from "@/components/star/starTypes";

type ReactionEvent =
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
  | "greeting";

export function getStarReaction(event: ReactionEvent): StarReaction[] {
  switch (event) {
    case "correct":
      return [{ expression: "happy", animation: "bounce", sparkles: true, duration: 1500 }];
    case "wrong":
      return [
        { expression: "shocked", animation: "tremble", duration: 600 },
        { expression: "dizzy", animation: "faint", duration: 1200 },
      ];
    case "streak2":
      return [{ expression: "excited", animation: "bounce", sparkles: true, duration: 1500 }];
    case "streak3":
      return [{ expression: "excited", animation: "dance", sparkles: true, duration: 2000 }];
    case "streak5":
      return [{ expression: "celebrating", animation: "celebrate", sparkles: true, duration: 2000 }];
    case "hintOffer":
      return [{ expression: "smart", animation: "think", duration: 1500 }];
    case "themeComplete":
      return [{ expression: "celebrating", animation: "celebrate", sparkles: true, duration: 2500 }];
    case "themePerfect":
      return [{ expression: "loving", animation: "dance", sparkles: true, duration: 2500 }];
    case "matchFail":
      return [{ expression: "confused", animation: "roll", duration: 1200 }];
    case "idle":
      return [{ expression: "happy", animation: "idle", duration: 2500 }];
    case "greeting":
      return [{ expression: "happy", animation: "wave", sparkles: true, duration: 1500 }];
  }
}

/** Get the appropriate reaction event name from game state */
export function getReactionEvent(
  result: "correct" | "wrong",
  streakCount: number
): ReactionEvent {
  if (result === "wrong") return "wrong";
  if (streakCount >= 5) return "streak5";
  if (streakCount >= 3) return "streak3";
  if (streakCount >= 2) return "streak2";
  return "correct";
}
