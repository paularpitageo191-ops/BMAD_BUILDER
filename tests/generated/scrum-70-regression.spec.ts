import { test, expect } from '@playwright/test';

const BASE = 'https://demoqa.com';

test.describe('Negative Path Validation – Elements Module @SCRUM-70 @Forensic-AEGIS-2026-MAY-E84D', () => {

  // AC1: Email Validation – Invalid Input
  test('AC1 – Invalid email triggers validation error and hides #output', async ({ page }) => {
    await page.goto(`${BASE}/text-box`);

    // Fill with invalid email (missing TLD)
    await page.fill('#userEmail', 'test@domain');
    await page.click('#submit');

    // Check validation error on #userEmail (expects class 'field-error' or aria-invalid)
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveClass(/field-error/i); // adjust class if different
    // Alternatively, can check aria-invalid attribute: await expect(emailInput).toHaveAttribute('aria-invalid', 'true');

    // #output must not be visible
    const outputSection = page.locator('#output');
    await expect(outputSection).toBeHidden();
  });

  // AC2: Web Tables – Non-numeric Age/Salary blocks submission, modal stays open
  test('AC2 – Non-numeric Age blocks registration submission and keeps modal open', async ({ page }) => {
    await page.goto(`${BASE}/webtables`);

    // Open registration modal
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // Fill a non-numeric age (invalid)
    // Assuming Age field has id 'age' inside the form
    await page.fill('#age', 'abc');
    // Fill other required fields with valid data to isolate age failure
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#userEmail', 'valid@example.com');
    await page.fill('#salary', '50000');
    await page.fill('#department', 'QA');

    // Attempt to submit
    await page.click('#submit');

    // Submission blocked => modal should still be visible
    await expect(modal).toBeVisible();
    // Additionally, verify the age input still contains the invalid value (not cleared)
    await expect(page.locator('#age')).toHaveValue('abc');
  });

  // AC3: Radio Button – Disabled "No" option
  test('AC3 – #noRadio remains disabled and clicking does nothing', async ({ page }) => {
    await page.goto(`${BASE}/radio-button`);

    const noRadio = page.locator('#noRadio');

    // Verify it is disabled initially
    await expect(noRadio).toBeDisabled();

    // Attempt to click (should have no effect)
    await noRadio.click({ force: true });

    // Radio should still be disabled and not selected
    await expect(noRadio).toBeDisabled();
    await expect(noRadio).not.toBeChecked();
  });

  // AC4: UI Stability under obstruction (overlay)
  test('AC4 – UI remains stable with overlay – elements interactable via scroll/visibility', async ({ page }) => {
    await page.goto(`${BASE}/text-box`);

    // Add a fixed overlay that covers the whole page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; pointer-events:none;';
      document.body.appendChild(overlay);
    });

    // Target element that is otherwise visible (e.g., #submit button)
    const target = page.locator('#submit');

    // Scroll into view (if needed)
    await target.scrollIntoViewIfNeeded();

    // Verify the element is visible and interactable (e.g., can receive focus)
    await expect(target).toBeVisible();
    await expect(target).toBeEnabled();
    // Clean up overlay for subsequent tests (not required but good practice)
    await page.evaluate(() => document.getElementById('test-overlay')?.remove());
  });
});
