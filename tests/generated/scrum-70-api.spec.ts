import { test, expect } from '@playwright/test';

test.describe('Web Table Registration - Email Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/webtables');
    // Open registration modal
    await page.getByRole('button', { name: 'Add' }).click();
    // Ensure modal is visible
    await expect(page.getByRole('dialog', { name: 'Registration' })).toBeVisible();
  });

  test('Invalid email format shows validation error', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: 'Email' });
    await emailInput.fill('invalid-email');

    await page.getByRole('button', { name: 'Submit' }).click();

    // Modal should remain open
    await expect(page.getByRole('dialog', { name: 'Registration' })).toBeVisible();

    // Email input should be invalid (HTML5 validation)
    await expect(emailInput).toBeInvalid();
  });

  test('Empty email field shows validation error', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: 'Email' });
    // Leave email empty (default is empty)

    await page.getByRole('button', { name: 'Submit' }).click();

    // Modal should remain open
    await expect(page.getByRole('dialog', { name: 'Registration' })).toBeVisible();

    // Email input should be invalid (required field)
    await expect(emailInput).toBeInvalid();
  });
});
