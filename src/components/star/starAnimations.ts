import type { StarAnimation } from "./starTypes";
import type { TargetAndTransition } from "framer-motion";

export const bodyAnimationVariants: Record<StarAnimation, TargetAndTransition> = {
  idle: {
    y: [0, -5, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
  bounce: {
    y: [0, -18, 0],
    scaleY: [1, 0.92, 1.05, 1],
    scaleX: [1, 1.06, 0.96, 1],
    transition: { duration: 0.5, repeat: 2, ease: "easeOut" },
  },
  spin: {
    rotate: [0, 360],
    scale: [1, 1.15, 1],
    transition: { duration: 0.8, ease: "easeInOut" },
  },
  dance: {
    rotate: [0, -12, 12, -12, 12, 0],
    x: [0, -4, 4, -4, 4, 0],
    scale: [1, 1.05, 1, 1.05, 1],
    transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
  },
  wave: {
    rotate: [0, -14, 14, -14, 0],
    transition: { duration: 0.6, repeat: 1, ease: "easeInOut" },
  },
  faint: {
    rotate: [0, 15, 90],
    y: [0, -8, 20],
    opacity: [1, 1, 0.7],
    transition: { duration: 1.2, ease: "easeIn" },
  },
  roll: {
    rotate: [0, 720],
    x: [0, 30, -30, 0],
    transition: { duration: 1.5, ease: "easeInOut" },
  },
  tremble: {
    x: [0, -3, 3, -3, 3, -2, 2, 0],
    transition: { duration: 0.4, repeat: 2 },
  },
  peek: {
    x: [-60, 0],
    opacity: [0, 1],
    transition: { duration: 0.5, ease: "easeOut" },
  },
  celebrate: {
    y: [0, -25, 0],
    rotate: [0, 360],
    scale: [1, 1.3, 1],
    transition: { duration: 1, ease: "easeOut" },
  },
  think: {
    rotate: [0, 12],
    transition: { duration: 0.4, ease: "easeOut" },
  },
  nod: {
    y: [0, 4, 0, 4, 0],
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  none: {},
};
