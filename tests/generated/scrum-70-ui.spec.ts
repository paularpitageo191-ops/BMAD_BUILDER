import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';
const INVALID_EMAIL = 'test@domain';
const NON_NUMERIC_AGE = 'abc';
const NON_NUMERIC_SALARY = '12ab';

async function addOverlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    const overlay = document.createElement('div');
    overlay.id = 'test-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);
  });
}

test.describe('Negative Path Validation – Elements Module', () => {
  test('AC1 – Email Validation', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-F97F'] }, async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);

    const emailField = page.getByLabel('Email');
    const submitButton = page.getByRole('button', { name: 'Submit' });
    const outputSection = page.locator('#output');

    await emailField.fill(INVALID_EMAIL);
    await submitButton.click();

    // Verify validation error (browser built‑in validation for email input)
    const isInvalid = await emailField.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBe(true);

    // Output section should not be displayed
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2 – Web Tables Validation', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-F97F'] }, async ({ page }) => {
    await page.goto(`${BASE_URL}/webtables`);

    const addButton = page.getByRole('button', { name: 'Add' });
    await addButton.click();

    const modal = page.getByRole('dialog'); // registration modal
    const ageField = page.getByLabel('Age');
    const salaryField = page.getByLabel('Salary');
    const submitModalButton = page.getByRole('button', { name: 'Submit' });

    // Enter non‑numeric values
    await ageField.fill(NON_NUMERIC_AGE);
    await salaryField.fill(NON_NUMERIC_SALARY);
    await submitModalButton.click();

    // Modal should remain open
    await expect(modal).toBeVisible();

    // Fields should not have accepted non‑numeric input (value remains empty for number fields)
    const ageValue = await ageField.inputValue();
    const salaryValue = await salaryField.inputValue();
    expect(ageValue).toBe('');
    expect(salaryValue).toBe('');
  });

  test('AC3 – Radio Button Validation', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-F97F'] }, async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);

    const noRadio = page.locator('#noRadio');

    // Verify it is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click using Playwright (should do nothing because disabled)
    await noRadio.click({ force: true });
    // After click, it should still be disabled and not checked
    await expect(noRadio).toBeDisabled();
    const isChecked = await noRadio.isChecked();
    expect(isChecked).toBe(false);
  });

  test('AC4 – UI Stability under Obstruction', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-F97F'] }, async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);

    // Add a full‑page overlay
    await addOverlay(page);

    // Scroll the email field into view (overlay does not block scrolling)
    const emailField = page.getByLabel('Email');
    await emailField.scrollIntoViewIfNeeded();
    await expect(emailField).toBeVisible();

    // Still able to interact and trigger validation
    const submitButton = page.getByRole('button', { name: 'Submit' });
    const outputSection = page.locator('#output');

    await emailField.fill(INVALID_EMAIL);
    await submitButton.click();

    // Validation should still work
    const isInvalid = await emailField.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBe(true);

    // Output section not displayed
    await expect(outputSection).not.toBeVisible();
  });
});
