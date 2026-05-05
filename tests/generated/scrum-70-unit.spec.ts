import { test, expect, Locator } from '@playwright/test';
import { Page } from 'playwright';

test.describe('Negative Path Validation - Elements Module @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F', () => {
  const baseUrl = 'https://demoqa.com';

  test('AC1 – Invalid email shows validation error and no output', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);

    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Enter invalid email (missing TLD)
    await emailInput.fill('test@domain');
    await submitButton.click();

    // AC1: Email validation error appears
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');

    // AC1: Output section not displayed
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2 – Non-numeric age/salary blocks submission and modal stays open', async ({ page }) => {
    await page.goto(`${baseUrl}/webtables`);

    // Click Add button to open registration modal
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // Fill fields with non-numeric age and salary
    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const submitButton = modal.locator('#submit');

    await ageInput.fill('abc');
    await salaryInput.fill('12ab');

    await submitButton.click();

    // Modal should remain open
    await expect(modal).toBeVisible();

    // Age and salary fields should show validation (class 'field-error' or similar)
    // Here we check for aria-invalid attribute which Playwright uses
    await expect(ageInput).toHaveAttribute('aria-invalid', 'true');
    await expect(salaryInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('AC3 – "No" radio button is disabled and click does nothing', async ({ page }) => {
    await page.goto(`${baseUrl}/radio-button`);

    const noRadio = page.locator('#noRadio');

    // Check it is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click the disabled radio button
    await noRadio.click({ force: true, timeout: 1000 }).catch(() => {}); // suppress error

    // Verify it remains disabled
    await expect(noRadio).toBeDisabled();

    // No success message or selection change
    const successMessage = page.locator('.text-success');
    await expect(successMessage).not.toBeVisible();
  });

  test('AC4 – UI remains stable after negative input', async ({ page }) => {
    // First perform invalid email input on Text Box page to simulate potential instability
    await page.goto(`${baseUrl}/text-box`);
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    await emailInput.fill('test@domain');
    await submitButton.click();

    // Then navigate to Radio Button page
    await page.goto(`${baseUrl}/radio-button`);

    // Scroll to "Yes" radio button
    const yesRadio = page.locator('#yesRadio');
    await yesRadio.scrollIntoViewIfNeeded();

    // Verify it is visible and enabled
    await expect(yesRadio).toBeVisible();
    await expect(yesRadio).toBeEnabled();

    // Click the "Yes" radio button successfully
    await yesRadio.click();
    await expect(yesRadio).toBeChecked();

    // "No" radio button remains disabled even after interaction
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // No page crash (no console errors or broken layout) - check no unexpected errors
    // Simplified: ensure output section from text box is not present (page navigated away)
    const outputSection = page.locator('#output');
    await expect(outputSection).not.toBeVisible();
  });
});
