import { test, expect } from '@playwright/test';

test.describe('SCRUM-70: Negative Path Validation for DemoQA Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('AC1 – Email Validation rejects invalid input', async ({ page }) => {
    // Navigate to Text Box page
    await page.goto('https://demoqa.com/text-box');

    // Fill invalid email
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('test@domain');

    // Click Submit
    await page.locator('#submit').click();

    // Verify validation error: HTML5 validity fails
    const isEmailValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isEmailValid).toBe(false);

    // Verify output section is not displayed
    const output = page.locator('#output');
    await expect(output).not.toBeVisible();
  });

  test('AC2 – Web Tables blocks non-numeric Age', async ({ page }) => {
    // Navigate to Web Tables page
    await page.goto('https://demoqa.com/webtables');

    // Click Add button to open modal
    await page.locator('#addNewRecordButton').click();
    await expect(page.locator('.modal-content')).toBeVisible();

    // Fill non-numeric Age
    await page.locator('#age').fill('abc');

    // Click Submit
    await page.locator('#submit').click();

    // Modal should remain open
    await expect(page.locator('.modal-content')).toBeVisible();

    // Verify no row added (assumes zero rows initially, check count remains same)
    const rowCount = await page.locator('.rt-tr-group').count();
    expect(rowCount).toBe(0); // after click, still zero
  });

  test('AC3 – Radio Button "No" remains disabled', async ({ page }) => {
    // Navigate to Radio Button page
    await page.goto('https://demoqa.com/radio-button');

    const noRadio = page.locator('#noRadio');

    // Initially disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click with force (regular click would fail)
    await noRadio.click({ force: true });

    // Still disabled
    await expect(noRadio).toBeDisabled();

    // Not checked
    const isChecked = await noRadio.isChecked();
    expect(isChecked).toBe(false);
  });

  test('AC4 – UI remains stable under overlay obstruction', async ({ page }) => {
    // Navigate to a page with a clickable element
    await page.goto('https://demoqa.com/buttons');

    // Inject an overlay covering the whole page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;';
      document.body.appendChild(overlay);
    });

    // Locate a target element that is now behind the overlay
    const doubleClickBtn = page.locator('#doubleClickBtn');

    // Scroll into view and click with force to simulate visibility handling
    await doubleClickBtn.scrollIntoViewIfNeeded();
    await doubleClickBtn.click({ force: true });

    // Verify click succeeded: double click message appears
    await expect(page.locator('#doubleClickMessage')).toBeVisible();

    // Cleanup overlay
    await page.evaluate(() => {
      document.getElementById('test-overlay')?.remove();
    });
  });
});
