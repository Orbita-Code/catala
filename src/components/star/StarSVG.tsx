"use client";

import type { StarExpression } from "./starTypes";
import StarFace from "./StarFace";

interface StarSVGProps {
  expression: StarExpression;
}

// 5-pointed star path centered at (60, 60), outer ~50, inner ~22
function starPath(): string {
  const cx = 60;
  const cy = 60;
  const outerR = 50;
  const innerR = 22;
  const points = 5;
  const parts: string[] = [];

  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    parts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

const STAR_PATH = starPath();

export default function StarSVG({ expression }: StarSVGProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="starBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDCB6E" />
          <stop offset="100%" stopColor="#F9A825" />
        </linearGradient>
      </defs>

      {/* Star body */}
      <path
        d={STAR_PATH}
        fill="url(#starBodyGrad)"
        stroke="#F39C12"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Face group */}
      <StarFace expression={expression} />
    </svg>
  );
}
