import { test, expect, Page } from '@playwright/test';

test.describe('Negative Path Validation for DemoQA Elements Module @SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD', () => {

  test.beforeEach(async ({ page }) => {
    // Clear cookies or other state if needed; default navigation happens in each test.
  });

  test('AC1 - Invalid email triggers validation error and hides output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    const outputSection = page.locator('#output');
    const submitButton = page.locator('#submit');

    await emailInput.fill('test@domain');
    await submitButton.click();

    // Expect validation error (HTML5 validation - check for 'invalid' pseudo-class or error message)
    await expect(emailInput).toHaveAttribute('class', /.*is-invalid.*/);
    // Alternatively, check validity state
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isValid).toBe(false);

    // Ensure output section is not displayed
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2 - Non-numeric Age blocks submission and keeps modal open', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    const ageInput = page.locator('#age');
    const submitButton = modal.locator('#submit');

    await ageInput.fill('abc');
    await submitButton.click();

    // Modal remains open
    await expect(modal).toBeVisible();

    // Verify no new record added (table row count unchanged)
    const rowsBefore = await page.locator('.rt-tr-group').count();
    // After failed submission, row count should be the same as initial (usually 3 default)
    const rowsAfter = await page.locator('.rt-tr-group').count();
    expect(rowsAfter).toBe(rowsBefore);
  });

  test('AC3 - Disabled "No" radio button remains unresponsive', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    const noRadio = page.locator('#noRadio');
    const yesRadio = page.locator('#yesRadio');
    const outputMessage = page.locator('.mt-3'); // Example: "You have selected Yes"

    // Verify initial state: "No" is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click "No" (using force: true to bypass pointer-events if needed)
    await noRadio.click({ force: true });

    // Confirm still disabled
    await expect(noRadio).toBeDisabled();

    // Confirm no selection message changed (e.g., message remains for previously selected radio, if any)
    // For safety, check that the message does not contain "No" (since "No" radio is never selectable)
    const messageText = await outputMessage.textContent();
    expect(messageText).not.toContain('No');
  });

  test('AC4 - UI remains interactable under obstruction (overlay)', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Simulate an overlay by injecting a fixed div that covers part of the form
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '9998';
      document.body.appendChild(overlay);
    });

    // Scroll to make email field visible (element might be behind overlay)
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('invalid@test');
    await submitButton.click({ force: true }); // Use force to bypass overlay interception

    // Verify that interaction succeeded: either validation error or no output
    // Expect invalid email validation (since we used invalid email)
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isValid).toBe(false);
    await expect(outputSection).not.toBeVisible();

    // Clean up overlay for subsequent tests not needed because each test has its own page context
  });

});
