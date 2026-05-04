import { test, expect } from "@playwright/test";

test.describe("SCRUM-70 Negative Path Validation", () => {
  test("@smoke should block invalid email submission in Text Box", async ({ page }) => {
    await page.goto("/text-box");
    await page.locator("#userName").fill("Testing Hive");
    await page.locator("#userEmail").fill("userdomain.com");
    await page.locator("#currentAddress").fill("Synthetic address");
    await page.locator("#submit").click();

    await expect(page.locator("#output")).toHaveCount(0);
    await expect(page.locator("#userEmail")).toHaveJSProperty("validationMessage", expect.any(String));
  });

  test("should prevent disabled radio interaction", async ({ page }) => {
    await page.goto("/radio-button");
    await expect(page.locator("#noRadio")).toBeDisabled();
  });
});
