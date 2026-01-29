// Theme-level emoji scene compositions
// Used for theme headers and richer ThemeCard illustrations

export interface ThemeScene {
  emoji: string; // main emoji composition
  background: string; // secondary/ambient emojis
}

export const themeScenes: Record<string, ThemeScene> = {
  "la-classe": {
    emoji: "✏️📓✂️🖊️🎒",
    background: "📚🖍️📐📏",
  },
  "l-escola": {
    emoji: "🏫📚🌳🍽️🏋️",
    background: "🚪🪜🧑‍🏫",
  },
  "el-cos": {
    emoji: "👁️👃👄👂✋",
    background: "🧠💪🦵🦶",
  },
  "la-roba": {
    emoji: "👕👖👗👟🧥",
    background: "🧦🧤🧣🎩",
  },
  "la-casa": {
    emoji: "🏠🍳🛁🛏️🌺",
    background: "🛋️🪜🅿️",
  },
  "la-familia": {
    emoji: "👨👩👦👧👴👵",
    background: "👶❤️🏠",
  },
  "les-botigues": {
    emoji: "🛒🍞🐟🍎💊",
    background: "🥩🍰📖👟",
  },
  "el-menjar": {
    emoji: "🍎🍌🧀🥕🍲",
    background: "🍊🍓🥬🥚🍴",
  },
  "els-animals": {
    emoji: "🐕🐱🦁🐘🐢",
    background: "🐰🐯🐦🦒🐬",
  },
  "la-ciutat": {
    emoji: "🏙️🚦⛲🏥🎬",
    background: "🏛️🌳🍽️🚉",
  },
  "els-vehicles": {
    emoji: "🚗🚌🚂✈️🚢",
    background: "🚲🏍️🚁🚕",
  },
  "els-oficis": {
    emoji: "👨‍🏫👨‍⚕️🧑‍🚒👮👨‍🍳",
    background: "👨‍✈️🦷🌱📮",
  },
};

export function getThemeScene(slug: string): ThemeScene {
  return themeScenes[slug] || { emoji: "📚", background: "✨" };
}
