import { test, expect } from '@playwright/test';

test.describe('@JIRA-SCRUM-70: Negative path validation for DemoQA Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('Invalid email in Text Box shows validation error', async ({ page }) => {
    // Use the stable #userEmail selector
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('notanemail');
    await page.locator('#submit').click();
    
    // The browser's built-in email validation shows an error tooltip or pseudo-class
    // Check that the field is invalid via HTML5 validation
    await expect(emailInput).toHaveJSProperty('validity.valid', false);
  });

  test('Modal remains open on invalid email in Web Tables registration', async ({ page }) => {
    // Open registration modal
    await page.locator('#addNewRecordButton').click();
    
    // Locate modal form - assume a registration form modal
    const modal = page.locator('.modal-content'); // or a more specific selector
    await expect(modal).toBeVisible();
    
    // Fill invalid email in modal's email field (assume it exists with role=textbox)
    const modalEmailField = modal.locator('input[type="email"]');
    await modalEmailField.fill('bad@format');
    
    // Click submit button in modal (assume a submit button with text)
    const modalSubmitButton = modal.locator('button:has-text("Submit")');
    await modalSubmitButton.click();
    
    // Verify modal remains open and error shown
    await expect(modal).toBeVisible();
    // Assume an error message appears inside the modal
    const errorMessage = modal.locator('.error, .invalid-feedback, [class*="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('Valid submission still works after changes', async ({ page }) => {
    // Happy path regression check
    await page.locator('#userEmail').fill('test@example.com');
    await page.locator('#submit').click();
    
    // Expect output div to contain the email
    const output = page.locator('#output');
    await expect(output).toContainText('test@example.com');
  });
});
