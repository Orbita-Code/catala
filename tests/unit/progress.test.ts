import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { installBrowserGlobals } from "../helpers/local-storage-mock.mjs";
import {
  getThemeProgress,
  saveThemeProgress,
  completeTask,
  updateDailyStreak,
  getDailyStreak,
  getLongestStreak,
  getStreakFreezes,
  hasPracticedToday,
} from "../../src/lib/progress.ts";

const storage = installBrowserGlobals();

beforeEach(() => {
  storage.clear();
});

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().split("T")[0];
}

function seedStreakState(overrides: Record<string, unknown>) {
  storage.setItem(
    "catala-daily-streak",
    JSON.stringify({
      dailyStreak: 0,
      longestStreak: 0,
      lastPracticeDate: "",
      streakFreezes: 0,
      calendarHistory: [],
      dailyRewardClaimed: false,
      lastDailyRewardDate: "",
      ...overrides,
    })
  );
}

// ── getThemeProgress / saveThemeProgress ──

test("getThemeProgress: nepoznat slug vraca podrazumevano stanje", () => {
  assert.deepEqual(getThemeProgress("nepostojeci"), {
    currentTask: 0,
    completedTasks: [],
    streak: 0,
    bestStreak: 0,
    stars: 0,
    taskErrors: {},
  });
});

test("saveThemeProgress/getThemeProgress roundtrip sa merge-om defaulta", () => {
  saveThemeProgress("la-classe", { stars: 5, streak: 2 });
  const p = getThemeProgress("la-classe");
  assert.equal(p.stars, 5);
  assert.equal(p.streak, 2);
  // ostala polja zadrzavaju default
  assert.deepEqual(p.completedTasks, []);
  assert.equal(p.currentTask, 0);
});

// ── completeTask ──

test("completeTask: upisuje task u completedTasks i podize streak", () => {
  const res = completeTask("la-casa", "la-casa-1", { allCorrect: true, erroredItems: [] });
  assert.deepEqual(res.completedTasks, ["la-casa-1"]);
  assert.equal(res.streak, 1);
  assert.equal(res.bestStreak, 1);
  assert.equal(res.stars, 1);

  const p = getThemeProgress("la-casa");
  assert.deepEqual(p.completedTasks, ["la-casa-1"]);
  assert.equal(p.streak, 1);
});

test("completeTask: streak raste na uzastopne tacne, resetuje se na gresku", () => {
  completeTask("t", "t-1", { allCorrect: true, erroredItems: [] });
  const ok = completeTask("t", "t-2", { allCorrect: true, erroredItems: [] });
  assert.equal(ok.streak, 2);
  assert.equal(ok.bestStreak, 2);

  const bad = completeTask("t", "t-3", { allCorrect: false, erroredItems: ["rec-1"] });
  assert.equal(bad.streak, 0);
  assert.equal(bad.bestStreak, 2); // bestStreak se zadrzava
  assert.equal(bad.stars, 3);
  assert.equal(bad.hasErrors, true);
  assert.deepEqual(getThemeProgress("t").taskErrors, { "t-3": ["rec-1"] });
});

test("completeTask: isti task se ne upisuje dvaput", () => {
  completeTask("t", "t-1", { allCorrect: true, erroredItems: [] });
  const res = completeTask("t", "t-1", { allCorrect: true, erroredItems: [] });
  assert.deepEqual(res.completedTasks, ["t-1"]);
  assert.equal(res.stars, 1); // stars = broj jedinstvenih zavrsenih
});

test("completeTask: uspesno ponavljanje brise zabelezenu gresku", () => {
  completeTask("t", "t-1", { allCorrect: false, erroredItems: ["a"] });
  const res = completeTask("t", "t-1", { allCorrect: true, erroredItems: [] });
  assert.equal(res.hasErrors, false);
  assert.deepEqual(getThemeProgress("t").taskErrors, {});
});

// ── updateDailyStreak ──

test("updateDailyStreak: prvi dan zapocinje streak od 1", () => {
  const res = updateDailyStreak();
  assert.deepEqual(res, {
    newStreak: 1,
    streakBroken: false,
    freezeUsed: false,
    earnedFreeze: false,
  });
  assert.equal(getDailyStreak(), 1);
  assert.equal(getLongestStreak(), 1);
  assert.equal(hasPracticedToday(), true);
});

test("updateDailyStreak: ponovni poziv istog dana nista ne menja", () => {
  updateDailyStreak();
  const res = updateDailyStreak();
  assert.equal(res.newStreak, 1);
  assert.equal(res.streakBroken, false);
  assert.equal(getDailyStreak(), 1);
});

test("updateDailyStreak: uzastopan dan povecava streak", () => {
  seedStreakState({ dailyStreak: 3, longestStreak: 3, lastPracticeDate: isoDaysAgo(1) });
  const res = updateDailyStreak();
  assert.equal(res.newStreak, 4);
  assert.equal(res.streakBroken, false);
  assert.equal(res.freezeUsed, false);
  assert.equal(getLongestStreak(), 4);
});

test("updateDailyStreak: propusten dan bez freeze-a lomi streak", () => {
  seedStreakState({ dailyStreak: 5, longestStreak: 5, lastPracticeDate: isoDaysAgo(2) });
  const res = updateDailyStreak();
  assert.equal(res.newStreak, 1);
  assert.equal(res.streakBroken, true);
  assert.equal(res.freezeUsed, false);
  assert.equal(getDailyStreak(), 1);
  assert.equal(getLongestStreak(), 5); // longest ostaje
});

test("updateDailyStreak: propusten dan sa freeze-om cuva streak", () => {
  seedStreakState({
    dailyStreak: 5,
    longestStreak: 5,
    lastPracticeDate: isoDaysAgo(2),
    streakFreezes: 1,
  });
  const res = updateDailyStreak();
  assert.equal(res.newStreak, 6);
  assert.equal(res.streakBroken, false);
  assert.equal(res.freezeUsed, true);
  assert.equal(getStreakFreezes(), 0); // freeze potrosen
});

test("updateDailyStreak: svaki 7. uzastopan dan daje novi freeze", () => {
  seedStreakState({ dailyStreak: 6, longestStreak: 6, lastPracticeDate: isoDaysAgo(1) });
  const res = updateDailyStreak();
  assert.equal(res.newStreak, 7);
  assert.equal(res.earnedFreeze, true);
  assert.equal(getStreakFreezes(), 1);
});
