// Traceability
import { test, expect } from '@playwright/test';

test.describe('Regression – Elements Module Positive Path', () => {
  test('Valid email produces output section with correct data', async ({ page }) => {
    // Navigate to DemoQA Elements > Text Box
    await page.goto('https://demoqa.com/text-box');

    // Fill required fields
    await page.fill('#userName', 'John Doe');
    await page.fill('#userEmail', 'test@example.com');
    await page.fill('#currentAddress', '123 Main Street');

    // Submit the form
    await page.click('#submit');

    // Verify no validation error on email field
    const emailField = page.locator('#userEmail');
    await expect(emailField).toHaveCSS('border-color', 'rgb(40, 167, 69)'); // no error class

    // Verify output section is visible
    const outputSection = page.locator('#output');
    await expect(outputSection).toBeVisible();

    // Verify output contains submitted data
    await expect(outputSection.locator('#name')).toContainText('John Doe');
    await expect(outputSection.locator('#email')).toContainText('test@example.com');
    await expect(outputSection.locator('#currentAddress')).toContainText('123 Main Street');
  });
});
