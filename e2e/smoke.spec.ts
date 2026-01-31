import { test, expect } from "@playwright/test";
import { HomePage } from "./shared/pages/HomePage";

test.describe("Smoke Tests", () => {
  test("Home page loads and shows 12 themes", async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate();

    // Verify page title or heading
    await expect(page.locator("h1, h2").first()).toBeVisible();

    // Verify all 12 theme cards are present
    await home.verifyThemeCount(12);
  });

  test("Can navigate to a theme", async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate();
    await home.clickTheme("la-classe");

    // Should be on the theme page
    await expect(page).toHaveURL(/\/tema\/la-classe/);
  });

  test("Theme page renders a task", async ({ page }) => {
    await page.goto("/tema/la-classe");
    await page.waitForLoadState("networkidle");

    // Should show some task content
    const taskContent = page.locator(".space-y-4, .space-y-3, [class*='task']").first();
    await expect(taskContent).toBeVisible({ timeout: 10000 });
  });
});
