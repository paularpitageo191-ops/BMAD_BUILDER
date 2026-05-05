import { test, expect, Page } from '@playwright/test';

test.describe('Negative Path Validation for DemoQA Elements Module', () => {

  test('AC1 – Email validation blocks invalid input and hides output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('test@domain');
    await page.locator('#submit').click();
    // Check validation error (CSS class or validation message)
    await expect(emailInput).toHaveClass(/is-invalid/);
    // Output section should not be visible
    await expect(page.locator('#output')).toBeHidden();
  });

  test('AC2 – Web Tables rejects non-numeric age and salary', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('.modal-content');
    await modal.waitFor({ state: 'visible' });
    await page.locator('#age').fill('abc');
    await page.locator('#salary').fill('12ab');
    await page.locator('#submit').click();
    // Modal should remain open
    await expect(modal).toBeVisible();
    // Fields still contain invalid values
    await expect(page.locator('#age')).toHaveValue('abc');
    await expect(page.locator('#salary')).toHaveValue('12ab');
  });

  test('AC3 – Radio Button "No" remains disabled and unclickable', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    const noRadio = page.locator('#noRadio');
    // Verify disabled attribute
    await expect(noRadio).toBeDisabled();
    // Attempt to click (should not change state)
    await noRadio.click({ force: true });
    // Ensure still disabled and no selected class on label
    await expect(noRadio).toBeDisabled();
    await expect(page.locator('label[for="noRadio"]')).not.toHaveClass(/active/);
  });

  test('AC4 – UI remains stable under overlay obstruction', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    // Add a fixed overlay covering the whole page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;';
      document.body.appendChild(overlay);
    });
    const fullNameInput = page.locator('#userName');
    // Scroll into view if needed
    await fullNameInput.scrollIntoViewIfNeeded();
    await fullNameInput.fill('Valid Name');
    // Verify input accepted
    await expect(fullNameInput).toHaveValue('Valid Name');
    // Clean up overlay
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });

});
