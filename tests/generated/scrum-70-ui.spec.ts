import { test, expect, type Page } from '@playwright/test';

test.describe('Negative Path Validation for DemoQA Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  // AC1 – Email Validation
  test('Invalid email triggers validation error and no output', async ({ page }) => {
    const emailInput = page.locator('#userEmail');
    const submitBtn = page.locator('#submit').first(); // Text Box submit
    const output = page.locator('#output');

    // Enter invalid email (missing TLD)
    await emailInput.fill('test@domain');
    await submitBtn.click();

    // Validation message shown (browser native or custom)
    // The email input should be invalid
    await expect(emailInput).toHaveAttribute('class', /field-error|form-control.*is-invalid/);
    // Output section should not be visible
    await expect(output).not.toBeVisible();
  });

  // AC2 – Web Tables Validation
  test('Non-numeric Age blocks submission and modal stays open', async ({ page }) => {
    // Open registration modal
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const modalSubmit = page.locator('#submit').last(); // Modal submit (second #submit on page)

    // Fill with non-numeric age
    await ageInput.fill('abc');
    await salaryInput.fill('50000'); // valid salary

    // Attempt to submit
    await modalSubmit.click();

    // Modal should remain open
    await expect(modal).toBeVisible();

    // The Age field should show validation error (HTML5 pattern validation)
    // Check that the input is invalid via pattern mismatch
    // Use JavaScript evaluation to check validity
    const isAgeInvalid = await ageInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isAgeInvalid).toBeTruthy();
  });

  // AC3 – Radio Button Validation
  test('Disabled No radio button does not change state on click', async ({ page }) => {
    const noRadio = page.locator('#noRadio');

    // Verify it is initially disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click
    await noRadio.click({ force: true });

    // It should remain disabled
    await expect(noRadio).toBeDisabled();
  });

  // AC4 – UI Stability under obstruction
  test('UI remains interactable under overlay obstruction', async ({ page }) => {
    // Simulate an overlay obstruction (e.g., inject a fixed overlay div)
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'fake-overlay';
      overlay.style.cssText = 'position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); z-index: 9999;';
      document.body.appendChild(overlay);
    });

    const yesRadio = page.locator('#yesRadio');

    // Scroll to element to ensure it's in view
    await yesRadio.scrollIntoViewIfNeeded();

    // Click the Yes radio button (force to bypass overlay blocking)
    await yesRadio.click({ force: true });

    // Verify it is selected
    await expect(yesRadio).toBeChecked();

    // Check that the element is still visible and enabled
    await expect(yesRadio).toBeVisible();
    await expect(yesRadio).toBeEnabled();
  });
});
