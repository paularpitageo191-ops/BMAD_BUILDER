import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation - SCRUM-70', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('AC1: Email field rejects invalid input and output section is hidden', async ({ page }) => {
    // Navigate to Text Box section (usually first in Elements)
    await page.click('//span[text()="Text Box"]');

    // Fill with invalid email
    await page.fill('#userEmail', 'test@domain');

    // Click Submit
    await page.click('#submit');

    // Verify validation error is shown (browser native validation or custom)
    // Validate that #userEmail has the 'is-invalid' class or aria-invalid="true"
    const emailField = page.locator('#userEmail');
    await expect(emailField).toHaveAttribute('aria-invalid', 'true'); // common pattern

    // Verify output section is not displayed
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('AC2: Web Tables reject non-numeric Age and Salary values', async ({ page }) => {
    // Navigate to Web Tables
    await page.click('//span[text()="Web Tables"]');

    // Click Add to open registration modal
    await page.click('#addNewRecordButton');

    // Wait for modal to appear
    const modal = page.locator('#registration-form-modal');
    await expect(modal).toBeVisible();

    // Fill Age and Salary with non-numeric values
    await page.fill('#age', 'abc');
    await page.fill('#salary', '12ab');

    // Click Submit
    await page.click('//button[text()="Submit"]');

    // Modal should still be open
    await expect(modal).toBeVisible();

    // Validation errors should be present (either native or custom)
    // Check if fields have validation error class or pattern
    const ageField = page.locator('#age');
    const salaryField = page.locator('#salary');
    // Common patterns: bootstrap validation classes
    await expect(ageField).toHaveClass(/is-invalid/);
    await expect(salaryField).toHaveClass(/is-invalid/);
  });

  test('AC3: Disabled radio button "No" cannot be selected or change state', async ({ page }) => {
    // Navigate to Radio Button section
    await page.click('//span[text()="Radio Button"]');

    // Locate the "No" radio button
    const noRadio = page.locator('#noRadio');

    // Verify it is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click it
    await noRadio.click({ force: true }); // force because disabled would normally stop click

    // Verify no state change: the button remains disabled, no selected class
    await expect(noRadio).toBeDisabled();
    // Also verify that no success message appeared (common DemoQA pattern)
    const successMessage = page.locator('.text-success');
    await expect(successMessage).not.toBeVisible();
  });

  test('AC4: UI remains stable and interactable under an overlay', async ({ page }) => {
    // Add a fixed overlay to simulate obstruction (e.g., sticky banner)
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100px; background:rgba(0,0,0,0.5); z-index:9999; pointer-events:none;';
      document.body.prepend(overlay);
    });

    // Navigate to Text Box section
    await page.click('//span[text()="Text Box"]');

    // Scroll the email field into view and interact
    const emailField = page.locator('#userEmail');
    await emailField.scrollIntoViewIfNeeded();

    // Verify it is visible and can be filled
    await expect(emailField).toBeVisible();
    await emailField.fill('test@example.com');

    // Click Submit
    await page.click('#submit');

    // Verify output section is displayed (valid input)
    await expect(page.locator('#output')).toBeVisible();

    // Clean up overlay (not required for test, but good practice)
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
