import { Page, expect } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    // NE koristiti networkidle — Next dev drži HMR websocket otvoren.
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
    await this.page.waitForSelector('[href^="/tema/"]', { timeout: 15000 });
    await this.dismissDailyReward();
  }

  /**
   * DailyRewardModal (fixed overlay, z-50) prekriva kartice na svežem kontekstu
   * i montira se tek ~500ms posle učitavanja. Zatvara se klikom na pozadinu
   * (overlay ima onClick=onClose; close dugme nema aria-label).
   * Napomena: locator.isVisible() NE čeka element koji još ne postoji u DOM-u,
   * pa zato waitFor({ state: "visible" }).
   */
  async dismissDailyReward() {
    const overlay = this.page.locator("div.fixed.inset-0.z-50").first();
    try {
      await overlay.waitFor({ state: "visible", timeout: 2500 });
    } catch {
      return; // modal se nije pojavio
    }
    await overlay.click({ position: { x: 8, y: 8 } });
    await overlay.waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});
  }

  async getThemeCards() {
    return this.page.locator('[href^="/tema/"]').all();
  }

  async clickTheme(slug: string) {
    await this.dismissDailyReward();
    await this.page.click(`[href="/tema/${slug}"]`);
    await this.page.waitForURL(new RegExp(`/tema/${slug}`));
    await this.page.waitForSelector("main", { timeout: 15000 });
  }

  async verifyThemeCount(expected: number) {
    const cards = await this.getThemeCards();
    expect(cards.length).toBe(expected);
  }
}
