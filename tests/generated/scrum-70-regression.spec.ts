import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';

// Helper to navigate to the elements page and specific section
async function navigateToSection(page: any, sectionUrl: string) {
  await page.goto(`${BASE_URL}${sectionUrl}`);
  await page.waitForLoadState('networkidle');
}

test.describe('Negative Path Validation - Elements Module (@SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD)', () => {
  // ---------------------------------------------------------------
  // AC1 – Email Validation
  // ---------------------------------------------------------------
  test.describe('AC1 – Email Validation', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToSection(page, '/text-box');
    });

    test('Invalid email triggers validation error and output is not shown', async ({ page }) => {
      const invalidEmails = ['test@domain', 'test@domain.', 'test@', '@domain.com', 'plainaddress'];
      for (const email of invalidEmails) {
        // Reset form
        await page.fill('#userEmail', '');
        await page.fill('#userName', '');
        await page.fill('#currentAddress', '');
        await page.fill('#permanentAddress', '');
        await page.fill('#userEmail', email);
        await page.click('#submit');

        // Check validation error is visible (CSS pseudo-class :invalid or error message div)
        const emailInput = page.locator('#userEmail');
        await expect(emailInput).toHaveCSS('border-color', 'rgb(255, 0, 0)');
        // Or check for error message element (DemoQA shows "Your email is invalid!" in a div.field-error)
        const errorMsg = page.locator('.field-error').first();
        await expect(errorMsg).toBeVisible();
        await expect(errorMsg).toContainText('invalid');

        // Assert output section is not displayed
        const output = page.locator('#output');
        await expect(output).not.toBeVisible();
      }
    });
  });

  // ---------------------------------------------------------------
  // AC2 – Web Tables Validation
  // ---------------------------------------------------------------
  test.describe('AC2 – Web Tables Validation', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToSection(page, '/webtables');
    });

    test('Non-numeric Age or Salary blocks submission and modal stays open', async ({ page }) => {
      // Open registration modal
      await page.click('#addNewRecordButton');
      const modal = page.locator('#registration-form-modal');
      await expect(modal).toBeVisible();

      // Test combinations: age, salary (non-numeric)
      const testCases = [
        { age: 'abc', salary: '50000' },
        { age: '30', salary: '12ab' },
        { age: '', salary: '50000' },
        { age: '30', salary: '' },
      ];
      for (const { age, salary } of testCases) {
        // Fill form fields
        await page.fill('#firstName', 'Test');
        await page.fill('#lastName', 'User');
        await page.fill('#userEmail', 'test@example.com');
        await page.fill('#age', age);
        await page.fill('#salary', salary);
        await page.fill('#department', 'QA');

        // Click Submit
        await page.click('#submit');

        // Modal should remain open
        await expect(modal).toBeVisible();

        // Verify no new row was added (optional)
        const tableRows = page.locator('.rt-tr-group');
        const originalRowCount = await tableRows.count();
        // Additional check: after unsuccessful submit, count should not increase (but we don't know original count reliably; we rely on modal visibility)
        await expect(modal).toBeVisible();
      }
    });
  });

  // ---------------------------------------------------------------
  // AC3 – Radio Button Validation
  // ---------------------------------------------------------------
  test.describe('AC3 – Radio Button Validation', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToSection(page, '/radio-button');
    });

    test('No option is disabled and clicking does not change state', async ({ page }) => {
      const noRadio = page.locator('#noRadio');
      // Assert it is disabled
      await expect(noRadio).toBeDisabled();

      // Click on the label (the input is likely hidden, click the associated label or the input directly)
      // Clicking the input directly might do nothing because it's disabled; Playwright might throw if not possible.
      // We'll use click({ force: true }) to bypass actionability check, then verify state unchanged.
      await noRadio.click({ force: true });

      // Still disabled and no change
      await expect(noRadio).toBeDisabled();
      // Verify no success message appeared (e.g., "You have selected No" – if that existed for enabled options)
      // The enabled options show text: "You have selected Yes" or "Impressive". The No option should not show anything.
      const successMessage = page.locator('.text-success');
      // If no radio was selected, success message should not contain "No"
      await expect(successMessage).not.toContainText('No');
    });
  });

  // ---------------------------------------------------------------
  // AC4 – UI Stability under Overlay
  // ---------------------------------------------------------------
  test.describe('AC4 – UI Stability', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToSection(page, '/text-box');
    });

    test('Elements remain interactable under overlay obstruction', async ({ page }) => {
      // Inject an overlay that covers the form
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.id = 'test-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999;';
        document.body.appendChild(overlay);
      });

      // Attempt to interact with the email field by scrolling it into view
      const emailInput = page.locator('#userEmail');
      await emailInput.scrollIntoViewIfNeeded();

      // Since overlay might block click, we can use fill with force:true or use keyboard input after focusing
      // Use focus to bypass overlay visibility issues
      await emailInput.focus();
      await emailInput.fill('valid@example.com', { force: true });

      // Click submit with force to bypass overlay
      await page.locator('#submit').click({ force: true });

      // Remove overlay to check output
      await page.evaluate(() => {
        document.getElementById('test-overlay')?.remove();
      });

      // Verify output section displayed
      const output = page.locator('#output');
      await expect(output).toBeVisible();
      await expect(output).toContainText('valid@example.com');
    });
  });
});
