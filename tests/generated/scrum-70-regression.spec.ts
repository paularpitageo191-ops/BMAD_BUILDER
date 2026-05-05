import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F', () => {

  test('AC1 - Email Validation rejects invalid email and hides output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('test@domain');
    await page.locator('#submit').click();
    // Check validation error via :invalid CSS pseudo-class (HTML5 validation)
    const isInvalid = await emailInput.evaluate(el => el.matches(':invalid'));
    expect(isInvalid).toBeTruthy();
    // Output section should not be visible
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('AC2 - Web Tables rejects non-numeric Age and Salary', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    await modal.locator('#age').fill('abc');
    await modal.locator('#salary').fill('12ab');
    await modal.locator('#submit').click();
    // Modal remains open
    await expect(modal).toBeVisible();
    // Age and salary fields should have validation error (HTML5 :invalid)
    const ageInvalid = await modal.locator('#age').evaluate(el => el.matches(':invalid'));
    expect(ageInvalid).toBeTruthy();
    const salaryInvalid = await modal.locator('#salary').evaluate(el => el.matches(':invalid'));
    expect(salaryInvalid).toBeTruthy();
  });

  test('AC3 - Radio Button "No" remains disabled and unclickable', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();
    const initialChecked = await noRadio.isChecked();
    await noRadio.click({ force: true }); // force to bypass disabled but verify no change
    const finalChecked = await noRadio.isChecked();
    expect(finalChecked).toEqual(initialChecked); // should remain unchecked
    // Also verify aria-disabled or disabled attribute remains
    await expect(noRadio).toBeDisabled();
  });

  test('AC4 - UI remains stable under an overlay obstruction', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    // Inject a fixed overlay
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '9999';
      overlay.style.pointerEvents = 'none'; // allow clicks to pass through
      document.body.appendChild(overlay);
    });
    // Attempt to scroll and click an element (e.g., first element in the page)
    const firstElement = page.locator('.element-list .element-group:first-child');
    await firstElement.scrollIntoViewIfNeeded();
    await firstElement.click();
    // Check that the page is still functional - no error, element click should succeed
    await expect(firstElement).toBeVisible();
    // Remove overlay to avoid side effects
    await page.evaluate(() => {
      const overlay = document.querySelector('#test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
