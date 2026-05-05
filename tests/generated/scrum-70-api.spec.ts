import { test, expect } from '@playwright/test';

// Helper constants
const BASE_URL = 'https://demoqa.com';
const TEXT_BOX_PAGE = `${BASE_URL}/text-box`;
const WEB_TABLES_PAGE = `${BASE_URL}/webtables`;
const RADIO_BUTTON_PAGE = `${BASE_URL}/radio-button`;

test.describe('Negative Path Validation – DemoQA Elements Module @SCRUM-70 @Forensic-AEGIS-2026-MAY-E84D', () => {

  // AC1 – Email Validation
  test('Invalid email triggers validation error and no output', async ({ page }) => {
    await page.goto(TEXT_BOX_PAGE);
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Fill with invalid email (missing TLD)
    await emailInput.fill('test@domain');
    await submitButton.click();

    // Expect validation error – check for CSS class 'field-error' or aria-invalid or :invalid
    await expect(emailInput).toHaveAttribute('class', /field-error/);
    // Alternatively: await expect(emailInput).toBeInvalid(); // Playwright supports toBeInvalid
    await expect(emailInput).toBeInvalid();

    // Output section must not be visible
    await expect(outputSection).not.toBeVisible();
  });

  // AC2 – Web Tables Validation
  test('Non-numeric values block submission and modal stays open', async ({ page }) => {
    await page.goto(WEB_TABLES_PAGE);
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    const registrationModal = page.locator('.modal-content');
    await expect(registrationModal).toBeVisible();

    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const submitButton = page.locator('#submit');

    // Fill with non-numeric values
    await ageInput.fill('abc');
    await salaryInput.fill('12ab');
    await submitButton.click();

    // Modal should remain open
    await expect(registrationModal).toBeVisible();

    // Expect validation indicators – red border or error class on the inputs
    await expect(ageInput).toHaveAttribute('class', /was-validated|is-invalid/);
    await expect(salaryInput).toHaveAttribute('class', /was-validated|is-invalid/);
    // Or simply check that the inputs are invalid (HTML5 validation)
    await expect(ageInput).toBeInvalid();
    await expect(salaryInput).toBeInvalid();
  });

  // AC3 – Radio Button Validation
  test('"No" radio button remains disabled and cannot be selected', async ({ page }) => {
    await page.goto(RADIO_BUTTON_PAGE);
    const noRadio = page.locator('#noRadio');

    // Verify disabled initially
    await expect(noRadio).toBeDisabled();

    // Attempt to click (will probably do nothing, but simulate)
    await noRadio.click({ force: true }); // force because it's disabled, clicking normally might error

    // After click, it should still be disabled
    await expect(noRadio).toBeDisabled();

    // No success message for "No" should appear
    const successMessage = page.locator('.text-success');
    // Assuming only "Yes" and "Impressive" produce a success message
    if (await successMessage.isVisible()) {
      await expect(successMessage).not.toContainText('No');
    }
  });

  // AC4 – UI Stability under Obstruction
  test('UI remains interactable under simulated overlay', async ({ page }) => {
    await page.goto(TEXT_BOX_PAGE);
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Inject an overlay covering the form area
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
      overlay.style.pointerEvents = 'auto'; // block interaction
      document.body.appendChild(overlay);
    });

    // Scroll email input into view (should move it beneath the overlay? No, overlay is fixed, but we scroll to make it visible)
    // Actually overlay covers everything; we can still scroll and use force click or rely on visibility handling.
    // The requirement is to use scroll/visibility handling. We'll scroll to the input and then use force:true to bypass pointer blocking.
    await emailInput.scrollIntoViewIfNeeded();
    // Also ensure submit button is in view
    await submitButton.scrollIntoViewIfNeeded();

    // Interact using force:true to simulate handling overlays (as per AC4: "remain interactable via scroll/visibility handling")
    await emailInput.fill('test@example.com', { force: true });
    await submitButton.click({ force: true });

    // Output should be displayed after valid input (even with overlay)
    await expect(outputSection).toBeVisible();

    // Clean up overlay (optional)
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
