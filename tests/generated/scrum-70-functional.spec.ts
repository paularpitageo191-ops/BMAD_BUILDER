import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';

test.describe('Negative Path Validation for DemoQA Elements Module (@SCRUM-70)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('AC1 – Invalid email shows validation error and no output', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('test@domain');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(emailInput).toHaveCSS('border-color', 'rgb(255, 0, 0)');
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('AC2 – Non-numeric Age/Salary blocks submission, modal stays open', async ({ page }) => {
    await page.goto(`${BASE_URL}/webtables`);
    await page.getByRole('button', { name: 'Add' }).click();
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    await page.locator('#age').fill('abc');
    await page.locator('#salary').fill('12ab');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(modal).toBeVisible();
  });

  test('AC3 – Radio button "No" remains disabled and does not change state', async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();
    await noRadio.click({ force: true });
    await expect(noRadio).toBeDisabled();
    await expect(noRadio).not.toBeChecked();
  });

  test('AC4 – UI stable under overlay obstruction', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    // Create a fixed overlay covering the page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;pointer-events:auto;';
      document.body.appendChild(overlay);
    });
    // Try to scroll the email input into view
    const emailInput = page.locator('#userEmail');
    await emailInput.scrollIntoViewIfNeeded();
    await expect(emailInput).toBeInViewport();
    // The overlay blocks pointer events, but we can use force to simulate click after scroll
    await emailInput.click({ force: true });
    await expect(emailInput).toBeFocused();
  });
});
