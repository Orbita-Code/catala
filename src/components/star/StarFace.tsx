"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { StarExpression } from "./starTypes";
import { expressionData } from "./starExpressions";

interface StarFaceProps {
  expression: StarExpression;
}

function Pupil({
  type,
  cx,
  cy,
  r,
}: {
  type: "circle" | "heart" | "x" | "spiral" | "star";
  cx: number;
  cy: number;
  r: number;
}) {
  switch (type) {
    case "heart":
      return (
        <path
          d={`M ${cx},${cy + r * 0.4}
              C ${cx},${cy - r * 0.6} ${cx - r * 1.2},${cy - r * 0.6} ${cx - r * 1.2},${cy}
              C ${cx - r * 1.2},${cy + r * 0.6} ${cx},${cy + r * 1.2} ${cx},${cy + r * 1.2}
              C ${cx},${cy + r * 1.2} ${cx + r * 1.2},${cy + r * 0.6} ${cx + r * 1.2},${cy}
              C ${cx + r * 1.2},${cy - r * 0.6} ${cx},${cy - r * 0.6} ${cx},${cy + r * 0.4} Z`}
          fill="#E84393"
          transform={`scale(0.6) translate(${cx * (1 / 0.6 - 1) * -1}, ${cy * (1 / 0.6 - 1) * -1})`}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      );
    case "x":
      return (
        <g stroke="#333" strokeWidth={1.5} strokeLinecap="round">
          <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r} />
          <line x1={cx + r} y1={cy - r} x2={cx - r} y2={cy + r} />
        </g>
      );
    case "spiral":
      return (
        <g>
          <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="#333" strokeWidth={1} />
          <path
            d={`M ${cx},${cy - r * 0.2} A ${r * 0.5} ${r * 0.5} 0 1 1 ${cx + r * 0.5},${cy}`}
            fill="none"
            stroke="#333"
            strokeWidth={1}
          />
        </g>
      );
    case "star": {
      const points = 5;
      const outer = r;
      const inner = r * 0.4;
      const d = Array.from({ length: points * 2 }, (_, i) => {
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? outer : inner;
        return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
      }).join(" ");
      return <polygon points={d} fill="#333" />;
    }
    default:
      return <circle cx={cx} cy={cy} r={r} fill="#333" />;
  }
}

export default function StarFace({ expression }: StarFaceProps) {
  const prefersReduced = useReducedMotion();
  const blinkRef = useRef<NodeJS.Timeout | null>(null);
  const eyelidLeftRef = useRef<SVGEllipseElement>(null);
  const eyelidRightRef = useRef<SVGEllipseElement>(null);

  const data = expressionData[expression];

  const blink = useCallback(() => {
    const leftEl = eyelidLeftRef.current;
    const rightEl = eyelidRightRef.current;
    if (!leftEl || !rightEl) return;

    leftEl.setAttribute("ry", "5.5");
    rightEl.setAttribute("ry", "5.5");

    setTimeout(() => {
      leftEl.setAttribute("ry", String(data.eyelidClose * 5.5));
      rightEl.setAttribute("ry", String(data.eyelidClose * 5.5));
    }, 150);
  }, [data.eyelidClose]);

  useEffect(() => {
    if (prefersReduced) return;

    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 3000;
      blinkRef.current = setTimeout(() => {
        blink();
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();

    return () => {
      if (blinkRef.current) clearTimeout(blinkRef.current);
    };
  }, [blink, prefersReduced]);

  const springTransition = { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <g>
      {/* Left Eye */}
      <g>
        <motion.ellipse
          cx={46}
          cy={50}
          rx={7}
          ry={5}
          fill="white"
          stroke="#333"
          strokeWidth={0.8}
          animate={{
            scaleX: data.eyeScaleX,
            scaleY: data.eyeScaleY,
          }}
          transition={springTransition}
          style={{ transformOrigin: "46px 50px" }}
        />
        <motion.g
          animate={{
            x: data.pupilOffsetX,
            y: data.pupilOffsetY,
          }}
          transition={springTransition}
        >
          <Pupil type={data.pupilType} cx={46} cy={51} r={data.pupilRadius} />
        </motion.g>
        {/* Eyelid */}
        <ellipse
          ref={eyelidLeftRef}
          cx={46}
          cy={45.5}
          rx={8}
          ry={data.eyelidClose * 5.5}
          fill="#FDCB6E"
          style={{ pointerEvents: "none" }}
        />
      </g>

      {/* Right Eye */}
      <g>
        <motion.ellipse
          cx={74}
          cy={50}
          rx={7}
          ry={5}
          fill="white"
          stroke="#333"
          strokeWidth={0.8}
          animate={{
            scaleX: data.eyeScaleX,
            scaleY: data.eyeScaleY,
          }}
          transition={springTransition}
          style={{ transformOrigin: "74px 50px" }}
        />
        <motion.g
          animate={{
            x: data.pupilOffsetX,
            y: data.pupilOffsetY,
          }}
          transition={springTransition}
        >
          <Pupil type={data.pupilType} cx={74} cy={51} r={data.pupilRadius} />
        </motion.g>
        {/* Eyelid */}
        <ellipse
          ref={eyelidRightRef}
          cx={74}
          cy={45.5}
          rx={8}
          ry={data.eyelidClose * 5.5}
          fill="#FDCB6E"
          style={{ pointerEvents: "none" }}
        />
      </g>

      {/* Left Eyebrow */}
      <motion.path
        d={`M 39,42 Q 46,${42 - data.browCurve} 53,42`}
        fill="none"
        stroke="#5D4E37"
        strokeWidth={1.8}
        strokeLinecap="round"
        animate={{
          y: data.browOffsetY,
          rotate: -data.browRotation,
        }}
        transition={springTransition}
        style={{ transformOrigin: "46px 42px" }}
      />

      {/* Right Eyebrow */}
      <motion.path
        d={`M 67,42 Q 74,${42 - data.browCurve} 81,42`}
        fill="none"
        stroke="#5D4E37"
        strokeWidth={1.8}
        strokeLinecap="round"
        animate={{
          y: data.browOffsetY,
          rotate: data.browRotation,
        }}
        transition={springTransition}
        style={{ transformOrigin: "74px 42px" }}
      />

      {/* Mouth */}
      <motion.g
        animate={{ scale: data.mouthScale }}
        transition={springTransition}
        style={{ transformOrigin: "60px 65px" }}
      >
        <path
          d={data.mouthPath}
          fill="none"
          stroke="#333"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(60, 65)"
          key={data.mouthPath}
        />
      </motion.g>

      {/* Tongue */}
      {data.showTongue && (
        <motion.ellipse
          cx={60}
          cy={73}
          rx={4}
          ry={3}
          fill="#E84393"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          style={{ transformOrigin: "60px 70px" }}
        />
      )}

      {/* Left Cheek */}
      <motion.circle
        cx={36}
        cy={60}
        r={5}
        fill="#FFB6C1"
        animate={{ opacity: data.cheekOpacity }}
        transition={{ duration: 0.3 }}
      />

      {/* Right Cheek */}
      <motion.circle
        cx={84}
        cy={60}
        r={5}
        fill="#FFB6C1"
        animate={{ opacity: data.cheekOpacity }}
        transition={{ duration: 0.3 }}
      />

      {/* Sweat drop */}
      {data.showSweat && (
        <motion.path
          d="M 82,40 Q 84,36 83,40 Q 84,44 82,44 Z"
          fill="#87CEEB"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </g>
  );
}
