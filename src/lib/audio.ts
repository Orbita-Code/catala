"use client";

// Synthesized sound effects using Web Audio API - no external files needed

let audioCtx: AudioContext | null = null;
let muted = false;

const STORAGE_KEY = "catala-muted";

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function initAudio() {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    muted = saved === "true";
  } catch {
    muted = false;
  }
}

export function isMuted(): boolean {
  return muted;
}

export function toggleMute(): boolean {
  muted = !muted;
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {}
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {}
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", gain: number = 0.3) {
  if (muted || typeof window === "undefined") return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

// Tap sound - short click
export function playTap() {
  playTone(800, 0.08, "sine", 0.15);
}

// Correct answer - ascending two-tone
export function playCorrect() {
  if (muted || typeof window === "undefined") return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      g.gain.setValueAtTime(0.25, now + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.2);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.2);
    });
  } catch {}
}

// Wrong answer - descending tone
export function playWrong() {
  if (muted || typeof window === "undefined") return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    [350, 280].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      g.gain.setValueAtTime(0.2, now + i * 0.15);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.25);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.25);
    });
  } catch {}
}

// Combo/streak - triumphant arpeggio
export function playCombo() {
  if (muted || typeof window === "undefined") return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      g.gain.setValueAtTime(0.2, now + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  } catch {}
}

// Task complete - cheerful melody
export function playTaskComplete() {
  if (muted || typeof window === "undefined") return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    [523, 659, 784, 1047, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      g.gain.setValueAtTime(0.25, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.2);
    });
  } catch {}
}

// Theme complete - grand fanfare
export function playThemeComplete() {
  if (muted || typeof window === "undefined") return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    const melody = [523, 523, 659, 784, 659, 784, 1047];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.15);
      g.gain.setValueAtTime(0.3, now + i * 0.15);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.3);
    });
  } catch {}
}

// Applause and cheering sound - synthesized crowd noise
export function playApplause(duration: number = 4) {
  if (muted || typeof window === "undefined") return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Create multiple noise sources for crowd effect
    for (let i = 0; i < 6; i++) {
      // White noise for clapping
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        output[j] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      // Band-pass filter for more natural clap sound
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1000 + i * 200;
      filter.Q.value = 1;

      const gain = ctx.createGain();
      const delay = i * 0.1;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.3);
      gain.gain.setValueAtTime(0.08, now + delay + duration - 0.5);
      gain.gain.linearRampToValueAtTime(0, now + delay + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now + delay);
      noise.stop(now + delay + duration);
    }

    // Add some whistles/cheers
    const whistleFreqs = [1200, 1400, 1600, 1800];
    whistleFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + 0.5 + i * 0.8);
      osc.frequency.linearRampToValueAtTime(freq * 1.2, now + 0.8 + i * 0.8);
      g.gain.setValueAtTime(0.05, now + 0.5 + i * 0.8);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1 + i * 0.8);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + 0.5 + i * 0.8);
      osc.stop(now + 1.2 + i * 0.8);
    });
  } catch {}
}
