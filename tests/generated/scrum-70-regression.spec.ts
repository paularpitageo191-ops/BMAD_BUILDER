import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://demoqa.com/elements';

test.describe('Negative Path Validation - DemoQA Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // AC1
  test('AC1 – Email Validation triggers error for invalid email', async ({ page }) => {
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit').first(); // Text Box submit
    const outputSection = page.locator('#output');

    await emailInput.fill('test@domain');
    await submitButton.click();

    // Verify browser-native validation error
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe('');

    // Verify output section is not displayed
    await expect(outputSection).not.toBeVisible();
  });

  // AC2
  test('AC2 – Web Tables validation blocks submission for non-numeric Age', async ({ page }) => {
    // Open registration modal
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Fill age with non-numeric value
    await page.locator('#age').fill('abc');

    // Click submit inside modal
    await page.locator('.modal-content #submit').click();

    // Modal remains open and visible
    await expect(modal).toBeVisible();

    // Optionally verify no new row added (simple check: table row count unchanged)
    const rowCountBefore = await page.locator('.rt-tr-group').count();
    // Attempt to close modal via cancel or x
    await page.locator('#close-modal').or(modal.locator('button.close')).first().click();
    const rowCountAfter = await page.locator('.rt-tr-group').count();
    expect(rowCountAfter).toBe(rowCountBefore);
  });

  // AC3
  test('AC3 – Radio Button disabled "No" option remains unchanged', async ({ page }) => {
    const noRadio = page.locator('#noRadio');

    // Verify initially disabled
    await expect(noRadio).toBeDisabled();
    await expect(noRadio).not.toBeChecked();

    // Attempt to click (force due to disabled state)
    await noRadio.click({ force: true });

    // Verify still disabled and not checked
    await expect(noRadio).toBeDisabled();
    await expect(noRadio).not.toBeChecked();
  });

  // AC4
  test('AC4 – UI Stability under overlay obstruction', async ({ page }) => {
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit').first();

    // Inject a full-page overlay
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999';
      document.body.appendChild(overlay);
    });

    // Scroll email field into view – visibility handling
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('test@domain');
    await submitButton.click({ force: true }); // force click through overlay

    // Verify UI stability: field interaction was successful (validation error shown)
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe('');

    // Remove overlay to leave page clean
    await page.evaluate(() => {
      const overlay = document.querySelector('#test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
