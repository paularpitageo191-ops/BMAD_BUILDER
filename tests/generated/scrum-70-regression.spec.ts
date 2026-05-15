import { test, expect, Page } from '@playwright/test';

test.describe('Negative Path Validation – DemoQA Elements (SCRUM-70)', () => {
  test('Invalid email shows validation on Text Box', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');

    // Enter invalid email into the email field (using stable selector)
    await page.fill('#userEmail', 'not-an-email');

    // Click submit button
    await page.click('#submit');

    // Expect validation error – email input should be invalid
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveAttribute('class', /is-invalid/); // adjust based on actual validation class
    // Alternative: check browser validation message
    // await expect(page.locator('#userEmail:invalid')).toBeVisible();
  });

  test('Modal remains open on invalid input in Web Tables registration', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');

    // Click "Add" button to open registration modal
    await page.click('#addNewRecordButton');

    // Locate the modal
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Fill first name (valid), but leave other required fields empty or with invalid data
    await page.fill('#firstName', 'John');
    // Do not fill email or age – they are required and should trigger validation

    // Click submit inside modal
    await page.click('#submit');

    // Modal should still be visible
    await expect(modal).toBeVisible();
  });

  test('Regression – modal blocking unchanged after code changes', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');

    // Open modal
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Submit without any data
    await page.click('#submit');

    // Modal stays open
    await expect(modal).toBeVisible();
  });
});
