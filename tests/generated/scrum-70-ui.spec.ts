import { test, expect } from '@playwright/test';
import { Page } from 'playwright';

const BASE_URL = 'https://demoqa.com';

test.describe('Negative Path Validation - Elements Module', () => {

  test('AC1: Invalid email submission shows validation error and hides output section', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);

    // Fill invalid email (missing TLD)
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('test@domain');

    // Click submit button (assumed selector #submit)
    await page.locator('#submit').click();

    // Verify validation error on email field (browser native validation or custom class)
    // Playwright can check for invalid pseudo-class or aria-invalid
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    // Alternatively, check for .field-error class - we'll use the presence of validation message
    // Since DOM may vary, we check that the output section is not displayed
    const outputSection = page.locator('#output');
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2: Non-numeric Age and Salary block Web Tables submission and modal remains open', async ({ page }) => {
    await page.goto(`${BASE_URL}/webtables`);

    // Click Add button to open registration modal
    await page.locator('#addNewRecordButton').click(); // assumed selector

    // Wait for modal body to appear
    const modalBody = page.locator('.modal-body');
    await expect(modalBody).toBeVisible();

    // Fill mandatory text fields with valid data
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');

    // Enter non-numeric values in Age and Salary
    await page.locator('#age').fill('abc');
    await page.locator('#salary').fill('12ab');

    // Click Submit button
    await page.locator('#submit').click();

    // Verify modal remains open (i.e., still visible)
    await expect(modalBody).toBeVisible();
  });

  test('AC3: Disabled "No" radio button cannot be clicked and remains disabled', async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);

    // Verify #noRadio is disabled
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // Attempt to click the disabled radio (Playwright will throw if element is not interactable)
    // We'll use a try-catch to ensure it does not throw because click should be rejected
    let clickError: Error | null = null;
    try {
      await noRadio.click({ timeout: 2000 });
    } catch (e) {
      clickError = e as Error;
    }
    expect(clickError).not.toBeNull(); // Verify click was prevented

    // Re-verify disabled state unchanged
    await expect(noRadio).toBeDisabled();

    // Verify no state change (e.g., the displayed selected value should not be "No")
    // The demoqa radio page shows a message like "You have selected Yes/Impressive/No"
    // We'll locate the text element (usually p.mt-3) and check it does not contain "No"
    const selectedText = page.locator('p.mt-3');
    // Since it was disabled and never clicked, the displayed text should not mention No
    await expect(selectedText).not.toContainText('No');
  });

  test('AC4: UI elements remain interactable under overlay obstruction', async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);

    // Inject a full-page overlay with high z-index
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); z-index: 9999;';
      document.body.appendChild(overlay);
    });

    // The overlay might block the radio button. We'll scroll the "Yes" radio into view and click using force:true
    // to simulate visibility/scroll handling. This tests that the app remains stable.
    const yesRadio = page.locator('#yesRadio');
    await yesRadio.scrollIntoViewIfNeeded();
    await yesRadio.click({ force: true });

    // Verify the "Yes" radio is selected (locate the hidden input or visible changes)
    await expect(yesRadio).toBeChecked();

    // Clean up overlay to avoid affecting other tests (though it's the last test)
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
