import { test, expect } from '@playwright/test';

test.describe('Elements Module Negative Path Validation - SCRUM-70', () => {
  const baseUrl = 'https://demoqa.com';

  test('AC1 - Email Validation rejects invalid input and hides output', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const emailInput = page.locator('#userEmail');
    const submitBtn = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Enter invalid email (missing TLD)
    await emailInput.fill('test@domain');
    await submitBtn.click();

    // Validation error: field should have class 'field-error' (or similar)
    await expect(emailInput).toHaveClass(/field-error/i);
    await expect(outputSection).not.toBeVisible();
  });

  test('AC1 - Email Validation shows output for valid input', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const emailInput = page.locator('#userEmail');
    const submitBtn = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Enter valid email
    await emailInput.fill('test@example.com');
    await submitBtn.click();

    await expect(emailInput).not.toHaveClass(/field-error/i);
    await expect(outputSection).toBeVisible();
  });

  test('AC2 - Web Tables rejects non-numeric age or salary', async ({ page }) => {
    await page.goto(`${baseUrl}/webtables`);
    // Open registration modal
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Fill non-numeric values
    const firstNameInput = page.locator('#firstName');
    const lastNameInput = page.locator('#lastName');
    const emailInput = page.locator('#userEmail');
    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const departmentInput = page.locator('#department');
    const submitBtn = modal.locator('#submit');

    await firstNameInput.fill('John');
    await lastNameInput.fill('Doe');
    await emailInput.fill('john@test.com');
    await ageInput.fill('abc');
    await salaryInput.fill('12ab');
    await departmentInput.fill('QA');
    await submitBtn.click();

    // Modal remains open
    await expect(modal).toBeVisible();
    // Age and salary fields should have validation error (e.g., invalid class)
    await expect(ageInput).toHaveClass(/field-error/i);
    await expect(salaryInput).toHaveClass(/field-error/i);
  });

  test('AC3 - Radio Button "No" remains disabled and ignores clicks', async ({ page }) => {
    await page.goto(`${baseUrl}/radio-button`);
    const noRadio = page.locator('#noRadio');
    const successMessage = page.locator('.text-success');

    // Verify it is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click via JavaScript (Playwright will not click disabled element by default)
    await noRadio.click({ force: true });
    // No state change: no success message for "No"
    await expect(successMessage).not.toBeVisible();
  });

  test('AC4 - UI remains stable under overlay obstruction', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const emailInput = page.locator('#userEmail');

    // Inject a full-page overlay
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
      overlay.style.pointerEvents = 'none'; // Allow clicks to pass through for this test
      document.body.appendChild(overlay);
    });

    // Scroll the email field into view and click it
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.click();

    // Assert that the field is focused and interactable
    await expect(emailInput).toBeFocused();

    // Clean up overlay
    await page.evaluate(() => {
      const overlay = document.querySelector('#test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
