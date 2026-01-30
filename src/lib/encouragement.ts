// Catalan encouragement phrases for the star mascot

import type { StarExpression } from "@/components/star/starTypes";
import { getThemePhrase } from "./themeEncouragement";

/** Backward-compatible alias */
export type StarMood = StarExpression;

export const starMoods: Record<string, string> = {
  happy: "/star-mascot.png",
  smart: "/star-mascot.png",
  confused: "/star-mascot.png",
  sad: "/star-mascot.png",
  loving: "/star-mascot.png",
};

const correctPhrases = [
  "Molt bé!",
  "Fantàstic!",
  "Excel·lent!",
  "Perfecte!",
  "Genial!",
  "Increïble!",
  "Bravo!",
  "Magnífic!",
  "Ets una estrella!",
  "Continues molt bé!",
  "Ho has encertat!",
  "Meravellós!",
  "Quin crack!",
  "Vas per bon camí!",
  "Ets un/a campió/na!",
];

const wrongPhrases = [
  "Quasi! Torna-ho a provar!",
  "No et preocupis, prova una altra vegada!",
  "Pensa-hi una mica més...",
  "Ànims! Tu pots!",
  "Gairebé! Una mica més...",
  "No passa res, segueix intentant-ho!",
  "Vinga, tu pots fer-ho!",
  "Prova de nou, ets capaç!",
];

const funnyWrongPhrases = [
  "Ui ui ui! Això no era! Però m'has fet riure!",
  "Au, que m'he caigut de l'ensurt!",
  "Ups! M'he marejat de la sorpresa!",
  "Ai ai ai! Quasi m'he desmaiat!",
  "Oh no! Tinc les puntes girades!",
];

const streakPhrases = [
  "2 seguides! Continues!",
  "3 seguides! Increïble!",
  "4 seguides! Imparable!",
  "5 seguides! Ets una superestrella!",
  "Quina ratxa! No pares!",
];

const completionPhrases = [
  "Has completat el tema!",
  "Enhorabona! Tema acabat!",
  "Fantàstic! Tot completat!",
];

const hintPhrases = [
  "Pista: fixa't bé...",
  "Mira amb atenció...",
  "Una ajuda: pensa en el so...",
  "Recorda el vocabulari...",
];

const greetingPhrases = [
  "Hola! Vols jugar?",
  "Bon dia! Anem a aprendre!",
  "Ei! Preparat per jugar?",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getEncouragement(
  type: "correct" | "wrong" | "streak" | "completion" | "hint" | "greeting",
  options?: { streakCount?: number; themeSlug?: string; correctInRow?: number }
): { text: string; mood: StarMood } {
  // backward compat: second arg can be a number (streakCount)
  const streakCount =
    typeof options === "number" ? options : options?.streakCount;
  const themeSlug = typeof options === "object" ? options?.themeSlug : undefined;
  const correctInRow =
    typeof options === "object" ? options?.correctInRow : undefined;

  switch (type) {
    case "correct": {
      // Every 3rd correct answer, show a theme tip if available
      if (themeSlug && correctInRow && correctInRow > 0 && correctInRow % 3 === 0) {
        const themePhrase = getThemePhrase(themeSlug);
        if (themePhrase) {
          return { text: themePhrase, mood: "smart" as StarMood };
        }
      }
      return { text: pick(correctPhrases), mood: "happy" as StarMood };
    }
    case "wrong":
      return {
        text: Math.random() < 0.3 ? pick(funnyWrongPhrases) : pick(wrongPhrases),
        mood: "confused" as StarMood,
      };
    case "streak": {
      const idx = Math.min((streakCount || 2) - 2, streakPhrases.length - 1);
      return { text: streakPhrases[idx], mood: "excited" as StarMood };
    }
    case "completion":
      return { text: pick(completionPhrases), mood: "loving" as StarMood };
    case "hint":
      return { text: pick(hintPhrases), mood: "smart" as StarMood };
    case "greeting":
      return { text: pick(greetingPhrases), mood: "happy" as StarMood };
  }
}
