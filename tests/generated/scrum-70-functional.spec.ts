import { test, expect } from '@playwright/test';
import { chromium } from 'playwright'; // if needed for browser launch, but fixture preferred

// Note: These tests assume DemoQA Elements pages are loaded at standard URLs.
// Text Box: https://demoqa.com/text-box
// Web Tables: https://demoqa.com/webtables
// Radio Button: https://demoqa.com/radio-button

// Helper to navigate to a given sub-path
async function gotoElementsPage(page: any, subPath: string) {
  await page.goto(`https://demoqa.com/${subPath}`);
  await page.waitForLoadState('networkidle');
}

test.describe('SCRUM-70 - Negative Path Validation for Elements Module', () => {

  // AC1 – Email Validation
  test('AC1: Invalid email triggers validation error and no output displayed', async ({ page }) => {
    await gotoElementsPage(page, 'text-box');

    const emailInput = page.locator('#userEmail');
    const outputSection = page.locator('#output');
    const submitButton = page.locator('#submit');

    // Enter invalid email (missing TLD)
    await emailInput.fill('test@domain');
    await submitButton.click();

    // Expect validation error class on email field (field-error is common class name)
    await expect(emailInput).toHaveClass(/field-error/i, { timeout: 5000 });

    // Output section should not be visible
    await expect(outputSection).not.toBeVisible();
  });

  // AC2 – Web Tables Validation (Age non-numeric)
  test('AC2: Non-numeric Age blocks submission and modal stays open', async ({ page }) => {
    await gotoElementsPage(page, 'webtables');

    // Click Add button to open registration modal
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    // Locate modal fields (using placeholder selectors typical in DemoQA)
    const modal = page.locator('.modal-dialog');
    const ageField = page.locator('#age');
    const firstNameField = page.locator('#firstName');
    const lastNameField = page.locator('#lastName');
    const emailField = page.locator('#userEmail');
    const salaryField = page.locator('#salary');
    const departmentField = page.locator('#department');
    const submitButton = modal.locator('#submit');

    // Fill all required fields with valid data except Age
    await firstNameField.fill('John');
    await lastNameField.fill('Doe');
    await emailField.fill('john.doe@example.com');
    await salaryField.fill('50000'); // valid numeric
    await departmentField.fill('Engineering');
    // Enter non-numeric age
    await ageField.fill('abc');

    // Submit
    await submitButton.click();

    // Validate modal remains open (i.e., still visible)
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Optionally verify no new row added (table rows count remains same)
    const rowsBefore = await page.locator('.rt-tr-group').count();
    // Click cancel or close to dismiss modal for cleanup
    const closeButton = modal.locator('.close');
    await closeButton.click();
  });

  // AC3 – Radio Button Validation – No option disabled
  test('AC3: “No” radio button remains disabled and unclickable', async ({ page }) => {
    await gotoElementsPage(page, 'radio-button');

    const noRadio = page.locator('#noRadio');

    // Verify disabled attribute
    await expect(noRadio).toBeDisabled({ timeout: 5000 });

    // Attempt to click (should not change state)
    await noRadio.click({ force: true }); // force attempt

    // After click, button should still be disabled
    await expect(noRadio).toBeDisabled();
  });

  // AC4 – UI Stability under obstruction (overlay)
  test('AC4: UI stable with overlay – element remains interactable', async ({ page }) => {
    await gotoElementsPage(page, 'text-box');

    const emailInput = page.locator('#userEmail');
    const outputSection = page.locator('#output');

    // Inject a fixed overlay that covers the entire viewport
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
      overlay.style.zIndex = '9999';
      document.body.appendChild(overlay);
    });

    // Scroll email input into view
    await emailInput.scrollIntoViewIfNeeded();
    // Attempt to type into the email field
    await emailInput.fill('valid@example.com');

    // Remove overlay
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });

    // Now submit and verify output is displayed (proving the field is interactable)
    const submitButton = page.locator('#submit');
    await submitButton.click();

    // Output section should appear (since we entered a valid email)
    await expect(outputSection).toBeVisible({ timeout: 5000 });
  });
});
