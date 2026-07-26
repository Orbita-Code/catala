import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { installBrowserGlobals } from "../helpers/local-storage-mock.mjs";
import {
  calculateTaskXP,
  addXP,
  getTotalXP,
  getXPToday,
  getXPHistory,
  isFirstTaskOfDay,
} from "../../src/lib/xp.ts";

// window + localStorage moraju postojati pre poziva funkcija modula
// (modul ih ne kesira — cita localStorage na svaki poziv).
const storage = installBrowserGlobals();

beforeEach(() => {
  storage.clear();
});

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().split("T")[0];
}

// ── calculateTaskXP ──

test("calculateTaskXP: bazni XP za zadatak bez savrsenog rezultata", () => {
  assert.equal(calculateTaskXP(false, 0, false), 10);
});

test("calculateTaskXP: perfect bonus bez gresaka (10 + 5)", () => {
  assert.equal(calculateTaskXP(true, 0, false), 15);
});

test("calculateTaskXP: streak bonus +10% po zadatku", () => {
  // 15 * 1.3 = 19.5 -> 20
  assert.equal(calculateTaskXP(true, 3, false), 20);
  // 10 * 1.2 = 12
  assert.equal(calculateTaskXP(false, 2, false), 12);
});

test("calculateTaskXP: streak bonus je ogranicen na +50%", () => {
  // 15 * 1.5 = 22.5 -> 23 (istina za streak 5 i za streak 10 — cap)
  assert.equal(calculateTaskXP(true, 5, false), 23);
  assert.equal(calculateTaskXP(true, 10, false), 23);
});

test("calculateTaskXP: bonus za prvi zadatak u danu (+20)", () => {
  assert.equal(calculateTaskXP(true, 0, true), 35);
  assert.equal(calculateTaskXP(false, 0, true), 30);
});

// ── addXP / getXP roundtrip ──

test("addXP: upisuje totalXP i dailyXP, getteri ih citaju", () => {
  const res = addXP(50);
  assert.equal(res.totalXP, 50);
  assert.equal(res.dailyXP, 50);
  assert.equal(getTotalXP(), 50);
  assert.equal(getXPToday(), 50);
});

test("addXP: sabira se na postojece stanje i vodi istoriju po danu", () => {
  addXP(30);
  addXP(20);
  assert.equal(getTotalXP(), 50);
  assert.equal(getXPToday(), 50);
  const history = getXPHistory();
  const today = new Date().toISOString().split("T")[0];
  assert.deepEqual(history, [{ date: today, amount: 50 }]);
});

test("addXP: detektuje level-up na 100 XP (level 1 -> 2)", () => {
  const res = addXP(100);
  assert.equal(res.previousLevel, 1);
  assert.equal(res.newLevel, 2);
  assert.equal(res.isLevelUp, true);
});

test("addXP: bez level-up-a unutar istog levela", () => {
  addXP(50);
  const res = addXP(30); // 80 < 100 -> i dalje level 1
  assert.equal(res.isLevelUp, false);
  assert.equal(res.previousLevel, 1);
  assert.equal(res.newLevel, 1);
});

test("addXP: preskace level kad XP predje vise pragova odjednom", () => {
  const res = addXP(350); // pragovi: 100 (2), 300 (3)
  assert.equal(res.previousLevel, 1);
  assert.equal(res.newLevel, 3);
  assert.equal(res.isLevelUp, true);
});

test("getXPToday: dailyXP se resetuje kad je lastXPDate od juce", () => {
  storage.setItem(
    "catala-xp",
    JSON.stringify({
      totalXP: 200,
      dailyXP: 80,
      lastXPDate: isoDaysAgo(1),
      xpHistory: [{ date: isoDaysAgo(1), amount: 80 }],
    })
  );
  assert.equal(getXPToday(), 0);
  assert.equal(getTotalXP(), 200); // total se ne resetuje
});

test("isFirstTaskOfDay: true na praznom stanju, false posle addXP", () => {
  assert.equal(isFirstTaskOfDay(), true);
  addXP(10);
  assert.equal(isFirstTaskOfDay(), false);
});
