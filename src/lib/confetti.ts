import confetti from "canvas-confetti";

const COLORS_DEFAULT = ["#6C5CE7", "#FDCB6E", "#00CECE"];
const COLORS_BIG = ["#6C5CE7", "#FDCB6E", "#00CECE", "#FF6B6B"];

/**
 * Small celebration — fires from both sides so it doesn't block the UI.
 */
export function celebrate(colors?: string[]) {
  const c = colors ?? COLORS_DEFAULT;
  confetti({
    particleCount: 15,
    spread: 45,
    origin: { x: 0, y: 0.6 },
    angle: 60,
    colors: c,
  });
  confetti({
    particleCount: 15,
    spread: 45,
    origin: { x: 1, y: 0.6 },
    angle: 120,
    colors: c,
  });
}

/**
 * Big celebration — for completing a whole task or theme.
 */
export function celebrateBig(colors?: string[]) {
  const c = colors ?? COLORS_BIG;
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { x: 0, y: 0.5 },
    angle: 60,
    colors: c,
  });
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { x: 1, y: 0.5 },
    angle: 120,
    colors: c,
  });
}
