import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation – Practice Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/automation-practice-form');
  });

  test('Invalid email format triggers inline validation and blocks form submission', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('User');
    await page.getByPlaceholder('name@example.com').fill('invalid-email');

    await page.getByRole('button', { name: 'Submit' }).click();

    // Assert email field has validation error (class or CSS pseudo)
    await expect(page.getByPlaceholder('name@example.com')).toHaveCSS(':invalid', 'true');
    // Or check for visible validation message – typical HTML5 validation shows a tooltip; better to check field validity
    // Since Playwright doesn't expose validityState directly, we check for 'invalid' pseudo-class
    await expect(page.locator('#userEmail:invalid')).toBeVisible();
    // Modal should not appear
    await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
  });

  test('Valid email enables successful submission (regression guard)', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('User');
    await page.getByPlaceholder('name@example.com').fill('valid@example.com');

    await page.getByRole('button', { name: 'Submit' }).click();

    // Modal with success message should appear
    await expect(page.locator('#example-modal-sizes-title-lg')).toBeVisible();
    await expect(page.locator('#example-modal-sizes-title-lg')).toHaveText('Thanks for submitting the form');
    // Close the modal
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
  });

  test('Boundary – empty email field triggers required validation', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('User');
    // Leave email empty

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('#userEmail:invalid')).toBeVisible();
    await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
  });

  test('Boundary – email with double dots triggers validation failure', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('User');
    await page.getByPlaceholder('name@example.com').fill('user@domain..com');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('#userEmail:invalid')).toBeVisible();
    await expect(page.locator('#example-modal-sizes-title-lg')).not.toBeVisible();
  });
});
