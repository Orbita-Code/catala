// Catalan encouragement phrases for the star mascot
// 5 star moods: happy (correct), smart (hint), confused (wrong), sad (give up), loving (complete)

export type StarMood = "happy" | "smart" | "confused" | "sad" | "loving";

export const starMoods: Record<StarMood, string> = {
  happy: "/star-mascot.png",
  smart: "/star-mascot.png",
  confused: "/star-mascot.png",
  sad: "/star-mascot.png",
  loving: "/star-mascot.png",
};

const correctPhrases = [
  "Molt bé! 🌟",
  "Fantàstic!",
  "Excel·lent!",
  "Perfecte!",
  "Genial!",
  "Increïble!",
  "Bravo!",
  "Magnífic!",
  "Ets una estrella! ⭐",
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

const streakPhrases = [
  "2 seguides! Continues! 🔥",
  "3 seguides! Increïble! 🔥🔥",
  "4 seguides! Imparable! 🔥🔥🔥",
  "5 seguides! Ets una superestrella! 🌟🔥",
  "Quina ratxa! No pares! 💪",
];

const completionPhrases = [
  "Has completat el tema! 🏆",
  "Enhorabona! Tema acabat! 🎉",
  "Fantàstic! Tot completat! 🌟",
];

const hintPhrases = [
  "Pista: fixa't bé...",
  "Mira amb atenció...",
  "Una ajuda: pensa en el so...",
  "Recorda el vocabulari...",
];

export function getEncouragement(
  type: "correct" | "wrong" | "streak" | "completion" | "hint",
  streakCount?: number
): { text: string; mood: StarMood } {
  switch (type) {
    case "correct":
      return {
        text: correctPhrases[Math.floor(Math.random() * correctPhrases.length)],
        mood: "happy",
      };
    case "wrong":
      return {
        text: wrongPhrases[Math.floor(Math.random() * wrongPhrases.length)],
        mood: "confused",
      };
    case "streak": {
      const idx = Math.min((streakCount || 2) - 2, streakPhrases.length - 1);
      return {
        text: streakPhrases[idx],
        mood: "happy",
      };
    }
    case "completion":
      return {
        text: completionPhrases[
          Math.floor(Math.random() * completionPhrases.length)
        ],
        mood: "loving",
      };
    case "hint":
      return {
        text: hintPhrases[Math.floor(Math.random() * hintPhrases.length)],
        mood: "smart",
      };
  }
}
