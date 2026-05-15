import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation - DemoQA Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('Invalid email shows validation error on Text Box submission', async ({ page }) => {
    // Use stable selectors from DOM context
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');

    await emailInput.fill('invalid-email');
    await submitButton.click();

    // Browser native validation: check that the field is invalid
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    // Alternatively, check for validation message
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('Registration modal remains open on invalid age input', async ({ page }) => {
    // Open registration modal
    const addNewRecordButton = page.locator('#addNewRecordButton');
    await addNewRecordButton.click();
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Fill age with invalid text
    const ageInput = page.locator('#age');
    await ageInput.fill('abc');

    // Submit modal
    const modalSubmitButton = page.locator('#submit');
    await modalSubmitButton.click();

    // Modal should remain visible
    await expect(modal).toBeVisible();

    // Age field should show validation error (HTML5 type=number validation)
    await expect(ageInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('Disabled radio button is non-interactable', async ({ page }) => {
    // Locate the disabled "No" radio button
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // Attempt to click and verify state unchanged
    const initialState = await noRadio.isChecked();
    await noRadio.click({ force: true });
    await expect(noRadio).toBeDisabled();
    expect(await noRadio.isChecked()).toBe(false);
  });

  test('Overlay obstruction does not break UI stability', async ({ page }) => {
    // Simulate an overlay (if not naturally present, we can create one for test)
    // For this test, we assume an overlay exists; otherwise we can skip.
    // Check that any overlay present can be dismissed.
    const overlay = page.locator('.overlay, .modal-backdrop, .popup-overlay');
    if (await overlay.isVisible()) {
      await overlay.click({ force: true });
      // Verify overlay dismissed
      await expect(overlay).not.toBeVisible();
    }
    // Verify core elements are still in expected state (no regression)
    await expect(page.locator('#userEmail')).toBeVisible();
    await expect(page.locator('#submit')).toBeVisible();
  });
});
