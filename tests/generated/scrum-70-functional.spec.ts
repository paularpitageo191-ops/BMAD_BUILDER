import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements – Web Table Registration Negative Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    // Click 'Web Tables' sidebar item
    await page.getByText('Web Tables').click();
    // Wait for web table page to load
    await page.waitForSelector('.web-tables-wrapper');
  });

  test('Invalid email shows validation error', async ({ page }) => {
    // Click Add button to open registration modal
    await page.getByRole('button', { name: 'Add' }).click();
    const modal = page.getByRole('dialog');
    // Fill in invalid email (leave other fields optional)
    await modal.getByLabel('Email').fill('notanemail');
    // Submit the form
    await modal.getByRole('button', { name: 'Submit' }).click();
    // Assert that validation error appears (typically a red border or message)
    const emailField = modal.getByLabel('Email');
    await expect(emailField).toHaveClass(/is-invalid/);  // or specific error element
    // Optionally assert a specific error text
    // await expect(page.getByText('Invalid email')).toBeVisible();
  });

  test('Modal remains open after invalid input', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: 'Add' }).click();
    const modal = page.getByRole('dialog');
    // Submit with invalid email
    await modal.getByLabel('Email').fill('bad');
    await modal.getByRole('button', { name: 'Submit' }).click();
    // Assert modal is still visible
    await expect(modal).toBeVisible();
  });

  test('Regression – Valid submission adds a row and closes the modal', async ({ page }) => {
    // Open modal
    await page.getByRole('button', { name: 'Add' }).click();
    const modal = page.getByRole('dialog');
    // Fill all required fields with valid data
    await modal.getByLabel('First Name').fill('John');
    await modal.getByLabel('Last Name').fill('Doe');
    await modal.getByLabel('Email').fill('john.doe@example.com');
    await modal.getByLabel('Age').fill('30');
    await modal.getByLabel('Salary').fill('50000');
    await modal.getByLabel('Department').fill('QA');
    // Submit
    await modal.getByRole('button', { name: 'Submit' }).click();
    // Wait for modal to close
    await expect(modal).not.toBeVisible({ timeout: 5000 });
    // Verify row appears in the table – look for the email value
    await expect(page.getByRole('row', { name: /john.doe@example.com/ })).toBeVisible();
  });
});
