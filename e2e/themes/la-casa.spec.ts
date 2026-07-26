import { test } from "@playwright/test";
import { ThemePage } from "../shared/pages/ThemePage";
import { solveTask } from "../shared/helpers/task-solvers";
import { themeAnswers } from "../shared/fixtures/theme-answers";

const slug = "la-casa";
const themeName = "La Casa";
const answers = themeAnswers[slug];

test.describe(`Theme: ${themeName}`, () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    // Neutrališi TTS (app izgovara svaku tačnu reč — na macOS-u ide na zvučnike)
    // i kreni od čistog progressa.
    const themePage = new ThemePage(page, slug);
    await themePage.stubTTS();
    await themePage.navigate();
    await themePage.clearProgress();
  });

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    test(`Task ${i + 1}/${answers.length}: ${answer.type} (${answer.id})`, async ({ page }) => {
      const themePage = new ThemePage(page, slug);
      await themePage.navigateToTask(i, answer.id.endsWith("-bonus"));
      await solveTask(page, answer);
      // Dokaz da je zadatak stvarno završen: app ga upisuje u catala-progress.
      await themePage.waitForTaskCompleted(answer.id);
    });
  }
});
