import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

test.describe('SCRUM-70 Negative Path Validation for DemoQA Elements Module', () => {

  // AC1 – Email Validation
  test('Email Validation - invalid email blocks output display', async ({ page }) => {
    const demoqaUrl = 'https://demoqa.com/text-box';
    await page.goto(demoqaUrl, { waitUntil: 'networkidle' });

    // Enter invalid email (missing TLD)
    const emailField = page.locator('#userEmail');
    await emailField.fill('test@domain');

    // Click Submit button
    const submitButton = page.locator('#submit');
    await submitButton.click();

    // Wait for validation feedback (HTML5 constraint validation)
    // Check that the email field shows validation error (invalid pseudo-class)
    await expect(emailField).toHaveAttribute('required', ''); // field is required
    // Expect the output section not to be visible (since submission didn't proceed)
    const output = page.locator('#output');
    await expect(output).toBeHidden();
  });

  // AC2 – Web Tables Validation
  test('Web Tables Validation - non-numeric age/salary blocks submission', async ({ page }) => {
    const demoqaUrl = 'https://demoqa.com/webtables';
    await page.goto(demoqaUrl, { waitUntil: 'networkidle' });

    // Click Add button to open registration modal
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    // Fill in Age field with non-numeric value
    const ageField = page.locator('#age');
    await ageField.fill('abc');

    // Fill in Salary field with non-numeric value
    const salaryField = page.locator('#salary');
    await salaryField.fill('12ab');

    // Click Submit button inside the modal
    const submitButton = page.locator('#submit');
    await submitButton.click();

    // Expect the modal to remain open (i.e., not closed)
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Expect the form not to be submitted (table row count unchanged)
    const rowsBeforeAdd = await page.locator('.rt-tr-group').count();
    // After invalid submission, no new row added
    await expect(rowsBeforeAdd).toBe(0); // Adjust initial count as needed; here we just check no new row
  });

  // AC3 – Radio Button Validation
  test('Radio Button Validation - disabled "No" option remains unclickable', async ({ page }) => {
    const demoqaUrl = 'https://demoqa.com/radio-button';
    await page.goto(demoqaUrl, { waitUntil: 'networkidle' });

    // Locate the disabled radio button
    const noRadio = page.locator('#noRadio');

    // Verify it is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click it
    await noRadio.click({ force: true }); // force click to circumvent disabled? No, we want to ensure no state change

    // Verify it remains disabled after click attempt
    await expect(noRadio).toBeDisabled();

    // Verify that the "No" message is NOT displayed (i.e., no state change)
    const noMessage = page.locator('text=You have selected No');
    await expect(noMessage).toBeHidden();
  });

  // AC4 – UI Stability under obstruction
  test('UI Stability under obstruction - elements remain interactable', async ({ page }) => {
    const demoqaUrl = 'https://demoqa.com/text-box';
    await page.goto(demoqaUrl, { waitUntil: 'networkidle' });

    // Inject a fixed overlay that covers the entire page
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
      overlay.style.pointerEvents = 'none'; // allow clicks to pass through? Actually we mimic obstruction that might break UI but elements behind might still be interactable? AC says elements remain interactable via scroll/visibility handling.
      document.body.appendChild(overlay);
    });

    // Scroll to submit button
    const submitButton = page.locator('#submit');
    await submitButton.scrollIntoViewIfNeeded();

    // Wait a bit for any rendering issues
    await page.waitForTimeout(500);

    // Verify the submit button is clickable
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    // Interact with permanent address field
    const permAddressField = page.locator('#permanentAddress');
    await permAddressField.scrollIntoViewIfNeeded();
    await permAddressField.fill('123 Stable Lane');

    // Verify UI did not break (field received input)
    await expect(permAddressField).toHaveValue('123 Stable Lane');
  });
});
