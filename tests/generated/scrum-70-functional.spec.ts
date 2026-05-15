import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements - Negative Path Validation', () => {
  const BASE_URL = 'https://demoqa.com/elements';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Invalid email format triggers browser validation on Text Box submit', async ({ page }) => {
    // Fill invalid email
    await page.fill('#userEmail', 'invalid-email');
    // Submit the form
    await page.click('#submit');
    // Check that the email input shows validation message (using :invalid pseudo-class)
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveJSProperty('validationMessage', expect.not.stringMatching(/^$/));
    // Ensure no output is displayed
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('Empty email submission is blocked by validation', async ({ page }) => {
    // Clear and ensure empty
    await page.fill('#userEmail', '');
    await page.click('#submit');
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveJSProperty('validationMessage', expect.not.stringMatching(/^$/));
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('Registration modal stays open after invalid First Name submission', async ({ page }) => {
    // Open the registration modal
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    // Fill valid data except leave First Name empty
    await page.fill('#firstName', '');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'john@example.com');
    await page.fill('#age', '30');
    await page.fill('#salary', '50000');
    // Click modal Submit button (assuming immediate button with text "Submit")
    await page.click('button:has-text("Submit")');
    // Modal should remain visible
    await expect(modal).toBeVisible();
  });

  test('Registration modal stays open after non-numeric Age input', async ({ page }) => {
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'jane@example.com');
    await page.fill('#age', 'abc');
    await page.fill('#salary', '50000');
    await page.click('button:has-text("Submit")');
    await expect(modal).toBeVisible();
  });

  test('Valid email submission works correctly (regression baseline)', async ({ page }) => {
    await page.fill('#userEmail', 'valid.email@example.com');
    await page.click('#submit');
    // Wait for output to appear (demoqa shows submitted data)
    const output = page.locator('#output');
    await expect(output).toBeVisible();
    await expect(output).toContainText('valid.email@example.com');
  });

  test('Valid registration submission closes modal (regression baseline)', async ({ page }) => {
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'jane@example.com');
    await page.fill('#age', '28');
    await page.fill('#salary', '60000');
    await page.click('button:has-text("Submit")');
    // Modal should disappear
    await expect(modal).not.toBeVisible();
    // Optionally check that a new row appears in the table (depends on data)
    const tableRows = page.locator('.rt-tbody .rt-tr-group');
    await expect(tableRows).toContainText('Jane');
  });
});
