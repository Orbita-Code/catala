import { Page, expect } from "@playwright/test";

export class ThemePage {
  constructor(
    private page: Page,
    private slug: string
  ) {}

  /**
   * Neutrališe TTS: app zove speechSynthesis.speak() na svaki tačan odgovor,
   * a na macOS-u to ide kroz sistemski glas čak i iz headless browsera.
   */
  async stubTTS() {
    await this.page.addInitScript(() => {
      try {
        const noop = () => {};
        Object.defineProperty(window, "speechSynthesis", {
          configurable: true,
          value: {
            speak: noop,
            cancel: noop,
            pause: noop,
            resume: noop,
            getVoices: () => [],
            addEventListener: noop,
            removeEventListener: noop,
          },
        });
      } catch {
        /* ignore */
      }
    });
  }

  async navigate() {
    // NE koristiti networkidle — Next dev drži HMR websocket otvoren pa se on
    // nikad ne dostigne.
    await this.page.goto(`/tema/${this.slug}`, { waitUntil: "domcontentloaded" });
    await this.page.waitForSelector("main", { timeout: 15000 });
  }

  /**
   * Progress je jedinstveni `catala-progress` ključ (JSON sa svim temama),
   * plus streak i sačuvani crteži — brišemo sve za čist start.
   */
  async clearProgress() {
    await this.page.evaluate(() => {
      localStorage.removeItem("catala-progress");
      localStorage.removeItem("catala-daily-streak");
      Object.keys(localStorage)
        .filter((k) => k.startsWith("catala-drawing-"))
        .forEach((k) => localStorage.removeItem(k));
    });
  }

  /**
   * Skoči direktno na zadatak `index` preko sopstvenog resume mehanizma appke
   * (TemaContent pri mount-u čita progress.currentTask) — umesto kliktanja
   * "Següent" kroz sve prethodne zadatke.
   *
   * PAŽNJA: pri prvom renderu TemaContent kratko prikaže zadatak 0, pa tek
   * onda resume effect prebaci na sačuvani index — zato čekamo PRAVI naslov
   * ("N. ..." za scoring zadatke, "Activitat extra!" za bonus).
   */
  async navigateToTask(index: number, isBonus = false) {
    await this.navigate();
    await this.page.evaluate(
      ([slug, idx]) => {
        const progress = JSON.parse(localStorage.getItem("catala-progress") || "{}");
        progress[slug] = {
          currentTask: idx,
          completedTasks: [],
          streak: 0,
          bestStreak: 0,
          stars: 0,
          taskErrors: {},
        };
        localStorage.setItem("catala-progress", JSON.stringify(progress));
      },
      [this.slug, index] as const
    );
    await this.page.reload({ waitUntil: "domcontentloaded" });
    const h2 = this.page.locator("main h2").first();
    if (isBonus) {
      await expect(h2).toContainText("Activitat extra", { timeout: 15000 });
    } else {
      await expect(h2).toHaveText(new RegExp(`^\\s*${index + 1}\\.`), { timeout: 15000 });
    }
  }

  /**
   * Čeka da app zabeleži zadatak kao završen (completeTask piše u
   * `catala-progress` čim komponenta pozove onComplete).
   */
  async waitForTaskCompleted(taskId: string, timeout = 20000) {
    await this.page.waitForFunction(
      ([slug, id]) => {
        try {
          const p = JSON.parse(localStorage.getItem("catala-progress") || "{}");
          return (
            Array.isArray(p?.[slug]?.completedTasks) && p[slug].completedTasks.includes(id)
          );
        } catch {
          return false;
        }
      },
      [this.slug, taskId] as const,
      { timeout }
    );
  }
}
