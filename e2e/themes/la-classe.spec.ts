import { test, expect } from "@playwright/test";
import { ThemePage } from "../shared/pages/ThemePage";
import { solveTask } from "../shared/helpers/task-solvers";
import { themeAnswers } from "../shared/fixtures/theme-answers";

const slug = "la-classe";
const themeName = "La Classe";
const answers = themeAnswers[slug];

test.describe(`Theme: ${themeName}`, () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    // Clear progress for fresh start
    await page.goto(`/tema/${slug}`);
    await page.evaluate((s) => {
      localStorage.removeItem(`catala-progress-${s}`);
    }, slug);
  });

  for (let i = 0; i < answers.length; i++) {
    test(`Task ${i + 1}/${answers.length}: ${answers[i].type}`, async ({ page }) => {
      const themePage = new ThemePage(page, slug);
      await themePage.navigateToTask(i);
      await solveTask(page, answers[i]);
      await page.waitForTimeout(1000);
    });
  }
});
