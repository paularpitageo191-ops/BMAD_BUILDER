import { test, expect } from '@playwright/test';

test.describe('SCRUM-70 Negative Path Validation for DemoQA Elements Module', () => {

  test('AC1 – Email validation rejects invalid email and hides output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    const emailField = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Enter invalid email (missing TLD)
    await emailField.fill('test@domain');
    await submitButton.click();

    // Check validation error on email field (expect a class like 'field-error')
    await expect(emailField).toHaveClass(/field-error|is-invalid|error/);

    // Output section should not be visible
    await expect(outputSection).toBeHidden();
  });

  test('AC2 – Non-numeric inputs in Age or Salary block submission and keep modal open', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');

    // Click Add button to open registration modal
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    const ageField = page.locator('#age');
    const salaryField = page.locator('#salary');
    const submitButton = page.locator('#submit');
    const modal = page.locator('.modal-dialog');

    // Enter non-numeric values
    await ageField.fill('abc');
    await salaryField.fill('12ab');
    await submitButton.click();

    // Modal should remain open
    await expect(modal).toBeVisible();
  });

  test('AC3 – "No" radio button is disabled and cannot be interacted with', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');

    const noRadio = page.locator('#noRadio');

    // Check it is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click using JavaScript force to bypass disabled state
    await noRadio.click({ force: true });

    // Should still be disabled after click
    await expect(noRadio).toBeDisabled();
  });

  test('AC4 – UI remains stable under obstruction and elements remain interactable', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    const submitButton = page.locator('#submit');

    // Add a fixed overlay to simulate obstruction
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
      document.body.appendChild(overlay);
    });

    // Scroll to submit button and verify it is visible and enabled
    await submitButton.scrollIntoViewIfNeeded();
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    // Click the button (should succeed)
    await submitButton.click();
  });
});
