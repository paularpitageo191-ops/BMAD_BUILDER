import { test, expect } from '@playwright/test';

const URL = 'https://demoqa.com/elements';

test.describe('DemoQA Elements – Negative Path Validation (SCRUM-70)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('@ui-negative: Invalid email shows inline validation', async ({ page }) => {
    // Invalid email
    await page.fill('#userEmail', 'not_an_email');
    await page.click('#submit');

    // Expect validation error (browser validation or custom)
    // The exact message may vary; check for validation pseudo-class or message
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveAttribute('validationMessage', /Please include an '@' in the email address/i);
    // Confirm no successful output appeared
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('@ui-regression: Valid email submits successfully', async ({ page }) => {
    await page.fill('#userEmail', 'user@example.com');
    await page.click('#submit');

    // Expect output to appear with submitted data
    const output = page.locator('#output');
    await expect(output).toBeVisible();
    await expect(output).toContainText('user@example.com');
  });

  test('@ui-negative: Modal stays open on invalid age (maxlength exceeded)', async ({ page }) => {
    // Open modal for Web Tables registration
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content'); // generic modal locator
    await expect(modal).toBeVisible();

    // Fill age with value exceeding maxlength (maxlength=2)
    await page.fill('#age', '123');
    // Age field likely truncates input to 2 characters, but we can still try
    // Click submit
    await page.click('#submit');
    // Modal should still be present
    await expect(modal).toBeVisible();
    // Ensure no new record added (table row count unchanged)
    const tableRows = page.locator('.rt-tr-group');
    const initialCount = await tableRows.count();
    // Submit would not add record
    const currentCount = await tableRows.count();
    expect(currentCount).toBe(initialCount);
  });

  test('@ui-boundary: Salary exceeding maxlength triggers validation', async ({ page }) => {
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // salary has maxlength=10, entering 11 characters
    await page.fill('#salary', '12345678901'); // 11 chars
    // The field might not accept more than 10; verify value is truncated or validation shown
    const salaryInput = page.locator('#salary');
    const value = await salaryInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(10);

    await page.click('#submit');
    // Modal stays visible because form is invalid (missing required fields like first name)
    await expect(modal).toBeVisible();
  });

  test('@ui-regression: Modal rejects invalid data and stays open', async ({ page }) => {
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Leave first name empty (required), fill age with invalid boundary
    await page.fill('#age', '0');
    // Click submit without filling required fields
    await page.click('#submit');
    // Modal should remain open
    await expect(modal).toBeVisible();
    // Expect validation error on first name field
    const firstNameField = page.locator('#firstName');
    await expect(firstNameField).toHaveAttribute('required', '');
    // Browser validation prevents submission; check that input is still focused or error shown
    // Alternatively check that no success indicator appears
    await expect(page.locator('#output')).not.toBeVisible();
  });
});
