import { test, expect } from '@playwright/test';

const APP_URL = 'https://demoqa.com';

test.describe('Negative Path Validation - DemoQA Elements Module @SCRUM-70 @Forensic-AEGIS-2026-MAY-C711', () => {

  // AC1: Email Validation
  test.describe('AC1 - Email Validation', () => {
    test('Invalid email "test@domain" shows validation error and no output', async ({ page }) => {
      await page.goto(`${APP_URL}/text-box`);
      const emailInput = page.locator('#userEmail');
      const output = page.locator('#output');
      const submitBtn = page.locator('#submit');

      await emailInput.fill('test@domain');
      await submitBtn.click();
      // Expect validation error (class field-error) or :invalid CSS pseudo-class
      await expect(emailInput).toHaveClass(/field-error/i);
      // Output section should not be visible
      await expect(output).not.toBeVisible();
    });

    test('Empty email submission does not show output', async ({ page }) => {
      await page.goto(`${APP_URL}/text-box`);
      const emailInput = page.locator('#userEmail');
      const output = page.locator('#output');
      const submitBtn = page.locator('#submit');

      await emailInput.fill('');
      await submitBtn.click();
      // After fill(''), the field may be empty, but validation should still fire on submit.
      await expect(emailInput).toHaveClass(/field-error/i);
      await expect(output).not.toBeVisible();
    });
  });

  // AC2: Web Tables Validation
  test.describe('AC2 - Web Tables Validation', () => {
    test('Non-numeric Age blocks submission and modal stays open', async ({ page }) => {
      await page.goto(`${APP_URL}/webtables`);
      // Click "Add" button to open registration modal (id="addNewRecordButton")
      await page.locator('#addNewRecordButton').click();
      const modal = page.locator('.modal-content');
      await expect(modal).toBeVisible();

      const ageField = page.locator('#age');
      const submitBtn = modal.locator('#submit');

      await ageField.fill('abc');
      await submitBtn.click();

      // Modal should remain open
      await expect(modal).toBeVisible();
      // Expect validation error on age field (e.g., class "is-invalid")
      await expect(ageField).toHaveClass(/is-invalid/i);
    });

    test('Non-numeric Salary blocks submission and modal stays open', async ({ page }) => {
      await page.goto(`${APP_URL}/webtables`);
      await page.locator('#addNewRecordButton').click();
      const modal = page.locator('.modal-content');
      await expect(modal).toBeVisible();

      const salaryField = page.locator('#salary');
      const submitBtn = modal.locator('#submit');

      await salaryField.fill('12ab');
      await submitBtn.click();

      await expect(modal).toBeVisible();
      await expect(salaryField).toHaveClass(/is-invalid/i);
    });
  });

  // AC3: Radio Button Validation
  test.describe('AC3 - Radio Button Validation', () => {
    test('"No" radio button remains disabled', async ({ page }) => {
      await page.goto(`${APP_URL}/radio-button`);
      const noRadio = page.locator('#noRadio');
      // Check it is disabled
      await expect(noRadio).toBeDisabled();

      // Attempt to click via JavaScript to avoid Playwright's auto-wait that might skip disabled
      await page.evaluate(() => {
        const radio = document.querySelector('#noRadio') as HTMLInputElement;
        if (radio) radio.click();
      });

      // Verify still disabled and not checked
      await expect(noRadio).toBeDisabled();
      await expect(noRadio).not.toBeChecked();
    });
  });

  // AC4: UI Stability
  test.describe('AC4 - UI Stability', () => {
    test('UI remains stable under overlay obstruction', async ({ page }) => {
      await page.goto(`${APP_URL}/text-box`);
      const emailInput = page.locator('#userEmail');
      const submitBtn = page.locator('#submit');
      const output = page.locator('#output');

      // Add a fixed overlay that partially covers the form
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.id = 'test-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; pointer-events:auto;';
        document.body.appendChild(overlay);
      });

      // Scroll the email field into view if needed (playwright scrollIntoViewIfNeeded)
      await emailInput.scrollIntoViewIfNeeded();
      // Now interact with the field - since overlay has pointer-events:auto, we need to click using force
      await emailInput.fill('test@example.com', { force: true });
      await submitBtn.click({ force: true });

      // Since we used valid email, output should be visible (confirms stability)
      await expect(output).toBeVisible();
      // Clean up overlay
      await page.evaluate(() => {
        const overlay = document.querySelector('#test-overlay');
        if (overlay) overlay.remove();
      });
    });
  });
});
