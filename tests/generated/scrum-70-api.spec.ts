import { test, expect } from '@playwright/test';

test.describe('Negative path validation for DemoQA Elements', () => {
  test('Invalid email shows validation message', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    // Assuming the text box is the main element; we'll use its role/placeholder
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await emailInput.fill('notanemail');
    // Submit or trigger validation (click submit button)
    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();
    // Expect validation error message visible
    const validationError = page.getByText(/valid email|email is not valid/i);
    await expect(validationError).toBeVisible();
  });

  test('Modal remains open on invalid input submission', async ({ page }) => {
    await page.goto('https://demoqa.com/modal-dialogs');
    // Open a modal (e.g., small modal)
    const openModalButton = page.getByRole('button', { name: /small modal/i });
    await openModalButton.click();
    // Wait for modal to appear
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    // Find text input inside modal (if any) – assume it has placeholder "Type here"
    const modalInput = modal.getByPlaceholder('Type here');
    await modalInput.fill('invalid');
    // Click modal's close or submit button (we assume a submit action)
    const modalSubmit = modal.getByRole('button', { name: /submit|save/i });
    await modalSubmit.click();
    // Modal should remain open because input is invalid
    await expect(modal).toBeVisible();
    // Error message should appear
    const modalError = modal.getByText(/invalid input|please correct/i);
    await expect(modalError).toBeVisible();
  });

  test('Regression – valid email submission still works after negative changes', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    const emailInput = page.getByRole('textbox', { name: /email/i });
    // First trigger validation with invalid email
    await emailInput.fill('bad');
    const submitButton = page.getByRole('button', { name: /submit/i });
    await submitButton.click();
    // Clear and enter valid email
    await emailInput.fill('user@example.com');
    await submitButton.click();
    // Expect success state (e.g., success message, modal closed, or no error)
    const successMessage = page.getByText(/success|submitted/i);
    const validationError = page.getByText(/valid email|email is not valid/i);
    await expect(validationError).not.toBeVisible();
    await expect(successMessage).toBeVisible();
  });
});
