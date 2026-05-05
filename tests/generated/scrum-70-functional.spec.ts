import { test, expect, Locator, Page } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';

async function handleOverlays(page: Page): Promise<void> {
  // Close any visible consent banner or overlay if present
  const consentButton = page.locator('button:has-text("Consent")');
  const closeOverlay = page.locator('.fc-cta-consent, .fc-button, [aria-label="Close ad"]');
  const overlays = [consentButton, closeOverlay];
  for (const overlay of overlays) {
    if (await overlay.isVisible({ timeout: 1000 }).catch(() => false)) {
      await overlay.click({ force: true });
    }
  }
}

test.describe('Negative Path Validation – DemoQA Elements', () => {
  test.beforeEach(async ({ page }) => {
    await handleOverlays(page);
  });

  test('AC1 – Email validation blocks invalid input', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('test@domain');
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click({ force: true });

    // Output should not be displayed for invalid input
    await expect(outputSection).not.toBeVisible();
    // Input should have red border indicating error (aria-invalid or class)
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    await expect(emailInput).toHaveClass(/field-error/);
  });

  test('AC2 – Web Tables rejects non-numeric Age/Salary', async ({ page }) => {
    await page.goto(`${BASE_URL}/webtables`);
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    // Fill only the required fields, Age and Salary with invalid data
    const firstName = page.locator('#firstName');
    const lastName = page.locator('#lastName');
    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const departmentInput = page.locator('#department');
    const modalSubmit = page.locator('#submit');

    await firstName.fill('John');
    await lastName.fill('Doe');
    await ageInput.fill('abc');
    await salaryInput.fill('12x');
    await departmentInput.fill('QA');
    await modalSubmit.click({ force: true });

    // Modal should remain open
    const modal = page.locator('#registration-form-modal');
    await expect(modal).toBeVisible();
    // Form fields still contain invalid values
    await expect(ageInput).toHaveValue('abc');
    await expect(salaryInput).toHaveValue('12x');
  });

  test('AC3 – Radio Button "No" remains disabled', async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);
    const noRadio = page.locator('#noRadio');

    // Verify initially disabled
    await expect(noRadio).toBeDisabled();
    // Attempt to click (using force due to disabled)
    await noRadio.click({ force: true });
    // Still disabled and not checked
    await expect(noRadio).toBeDisabled();
    await expect(noRadio).not.toBeChecked();
  });

  test('AC4 – UI stability under obstruction – Web Tables validation with overlay', async ({ page }) => {
    // Simulate an overlay by adding a fixed element (but we trust existing overlays)
    // We will first navigate, then close any overlays, then proceed
    await page.goto(`${BASE_URL}/webtables`);

    // If an overlay is present, close it (already done in beforeEach, but do it again for robustness)
    await handleOverlays(page);

    // Wait a moment for any dynamic overlay to appear
    await page.waitForTimeout(500);
    await handleOverlays(page);

    const addButton = page.locator('#addNewRecordButton');
    await addButton.scrollIntoViewIfNeeded();
    await addButton.click({ force: true });

    const ageInput = page.locator('#age');
    await ageInput.fill('abc');

    const modalSubmit = page.locator('#submit');
    await modalSubmit.click({ force: true });

    const modal = page.locator('#registration-form-modal');
    await expect(modal).toBeVisible();
    // Ensure the form is still interactable (age field still has value)
    await expect(ageInput).toHaveValue('abc');
  });
});
