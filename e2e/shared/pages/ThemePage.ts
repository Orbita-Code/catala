import { Page, expect } from "@playwright/test";

export class ThemePage {
  constructor(
    private page: Page,
    private slug: string
  ) {}

  async navigate() {
    await this.page.goto(`/tema/${this.slug}`);
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToTask(index: number) {
    // Clear progress and start from beginning, then advance to the desired task
    await this.page.goto(`/tema/${this.slug}`);
    await this.page.waitForLoadState("networkidle");

    // If we need to go to a specific task, click "Següent" buttons
    for (let i = 0; i < index; i++) {
      // Wait for any task to render
      await this.page.waitForTimeout(300);
      const nextBtn = this.page.getByRole("button", { name: /següent/i });
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await this.page.waitForTimeout(300);
      }
    }
  }

  async clearProgress() {
    await this.page.evaluate((slug) => {
      localStorage.removeItem(`catala-progress-${slug}`);
    }, this.slug);
  }

  async verifyTaskComplete() {
    // After solving a task, we expect either:
    // 1. A success message / confetti
    // 2. The "Següent" button to appear
    // 3. The task completion state
    const nextBtn = this.page.getByRole("button", { name: /següent/i });
    const completionIndicator = this.page.locator(".text-green-600, .bg-green-100");

    await expect(
      nextBtn.or(completionIndicator).first()
    ).toBeVisible({ timeout: 10000 });
  }
}
