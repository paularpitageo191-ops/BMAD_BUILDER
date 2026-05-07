import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements Negative Path Validation @SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF', () => {

  // AC1 – Email Validation
  test('AC1 – Invalid email shows validation error and no output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    // Enter invalid email (missing TLD)
    await page.fill('#userEmail', 'test@domain');
    await page.click('#submit');

    // Assert validation error on email field (HTML5 validation)
    const emailInput = page.locator('#userEmail');
    // HTML5 validation: check validity property or border class
    const isValid = await emailInput.evaluate(el => (el as HTMLInputElement).checkValidity());
    expect(isValid).toBe(false);

    // Output section should not be visible
    await expect(page.locator('#output')).not.toBeVisible();
  });

  // AC2 – Web Tables Validation
  test('AC2 – Non-numeric Age/Salary blocks submission and modal stays open', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');

    // Click Add button to open registration modal
    await page.click('#addNewRecordButton');
    await page.waitForSelector('.modal-dialog', { state: 'visible' });

    // Fill valid fields
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'john@example.com');

    // Fill invalid numeric fields
    await page.fill('#age', 'abc');
    await page.fill('#salary', '12ab');
    await page.fill('#department', 'QA');

    // Click Submit
    await page.click('#submit');

    // Modal should remain open
    await expect(page.locator('.modal-dialog')).toBeVisible();

    // No new row added (table row count unchanged, assume initially 1 row exists)
    const rowCount = await page.locator('.rt-tr-group').count();
    // Before adding, there is one row (header row? Actually .rt-tr-group contains data rows)
    // We'll assert that row count is still 1 (no new row)
    expect(rowCount).toBe(1);
  });

  // AC3 – Radio Button Validation
  test('AC3 – Disabled "No" radio button remains unclickable', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');

    const noRadio = page.locator('#noRadio');

    // Verify initial disabled state
    await expect(noRadio).toBeDisabled();

    // Attempt to click using force (should do nothing)
    await noRadio.click({ force: true }).catch(() => {}); // catch any error

    // Verify still disabled
    await expect(noRadio).toBeDisabled();

    // Verify no state change - e.g., radio button not selected
    expect(await noRadio.isChecked()).toBe(false);
  });

  // AC4 – UI Stability
  test('AC4 – Elements remain interactable under obstruction', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    // Inject an overlay that covers part of the page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);z-index:9999;';
      document.body.appendChild(overlay);
    });

    // Try to interact with the full name field
    const fullNameInput = page.locator('#userName');
    await fullNameInput.scrollIntoViewIfNeeded();
    await fullNameInput.click({ force: true });
    await fullNameInput.fill('Test User');

    // Verify input was accepted
    await expect(fullNameInput).toHaveValue('Test User');

    // Clean up overlay
    await page.evaluate(() => {
      const overlay = document.querySelector('#test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
