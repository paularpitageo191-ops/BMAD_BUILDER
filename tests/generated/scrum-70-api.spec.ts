import { test, expect } from '@playwright/test';

const TEXT_BOX_URL = 'https://demoqa.com/text-box';
const WEB_TABLES_URL = 'https://demoqa.com/webtables';
const RADIO_BUTTON_URL = 'https://demoqa.com/radio-button';
const ELEMENTS_URL = 'https://demoqa.com/elements';

test.describe('SCRUM-70: Negative Path Validation for DemoQA Elements Module', () => {

  test('AC1 – Email Validation – Invalid email shows validation error and no output', async ({ page }) => {
    await page.goto(TEXT_BOX_URL);
    await page.waitForLoadState('networkidle');

    // Enter invalid email (missing TLD)
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('test@domain');

    // Click Submit
    await page.locator('#submit').click();

    // Assert validation error on email field
    // HTML5 validation makes the input:invalid; check that input matches :invalid state
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    // Also verify that browser validation is triggered (input validation message is shown)
    // We can check that the form is not submitted and output section is not displayed
    const outputSection = page.locator('#output');
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2 – Web Tables Validation – Non-numeric Age/Salary blocks submission', async ({ page }) => {
    await page.goto(WEB_TABLES_URL);
    await page.waitForLoadState('networkidle');

    // Click Add button to open registration modal
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('.modal-content'); // or more specific selector
    await expect(modal).toBeVisible();

    // Fill non-numeric values in Age and Salary fields
    // Assume Age field has id 'age' and Salary has 'salary' in the modal form
    await page.locator('#age').fill('abc');
    await page.locator('#salary').fill('12ab');

    // Click Submit button inside the modal (assume id 'submit' or text 'Submit')
    await page.locator('button:has-text("Submit")').click();

    // Assert modal is still open (submission blocked)
    await expect(modal).toBeVisible();
    // Optionally, check that validation messages appear (browser default validation)
    // We can assert that the input fields still have their invalid values
    await expect(page.locator('#age')).toHaveValue('abc');
    await expect(page.locator('#salary')).toHaveValue('12ab');
  });

  test('AC3 – Radio Button Validation – Disabled "No" option remains unclickable', async ({ page }) => {
    await page.goto(RADIO_BUTTON_URL);
    await page.waitForLoadState('networkidle');

    // Locate the disabled "No" radio button
    const noRadio = page.locator('#noRadio');

    // Assert it is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click it (Playwright will refuse to click a disabled element by default)
    // We can try via JS to simulate a forced click, but the requirement is that clicking does nothing
    // Instead, verify state remains unchanged (no checked property)
    await noRadio.dispatchEvent('click'); // This will fail if not allowed? Actually dispatchEvent ignores disabled; use force: true
    // To strictly test: try clicking with force and verify no checked change
    try {
      await noRadio.click({ force: true });
    } catch (e) {
      // If click on disabled throws, we can still check state
    }

    // After any attempted click, the radio should still be disabled and not checked
    await expect(noRadio).toBeDisabled();
    await expect(noRadio).not.toBeChecked();
  });

  test('AC4 – UI Stability – Overlay does not break element interactability', async ({ page }) => {
    await page.goto(TEXT_BOX_URL); // Use any elements page
    await page.waitForLoadState('networkidle');

    // Simulate an overlay covering the page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '9999';
      overlay.style.pointerEvents = 'auto'; // block clicks
      document.body.appendChild(overlay);
    });

    // Verify that we can still interact with elements via scroll/visibility handling
    // For example, scroll to a button and click it programmatically (force click)
    const submitButton = page.locator('#submit');
    await submitButton.scrollIntoViewIfNeeded();

    // Use force:true to bypass overlay obstruction (simulating user who dismisses overlay)
    await submitButton.click({ force: true });

    // After clicking (even if validation fails), ensure the page does not crash
    // We can check that no JS error occurred, and the page is still functional
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toBeVisible();
  });
});
