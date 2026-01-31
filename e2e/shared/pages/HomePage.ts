import { Page, expect } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async getThemeCards() {
    return this.page.locator('[href^="/tema/"]').all();
  }

  async clickTheme(slug: string) {
    await this.page.click(`[href="/tema/${slug}"]`);
    await this.page.waitForLoadState("networkidle");
  }

  async verifyThemeCount(expected: number) {
    const cards = await this.getThemeCards();
    expect(cards.length).toBe(expected);
  }
}
