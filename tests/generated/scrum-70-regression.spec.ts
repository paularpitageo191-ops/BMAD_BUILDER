import { test, expect } from '@playwright/test';

test.describe('Negative path validation for DemoQA Web Table email field', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    // Navigate to Web Tables section
    await page.getByText('Web Tables').click();
  });

  test('Invalid email keeps modal open with validation error', async ({ page }) => {
    // Open add record modal
    await page.getByRole('button', { name: 'Add' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Fill valid fields (synthetic data)
    await modal.getByLabel('First Name').fill('John');
    await modal.getByLabel('Last Name').fill('Doe');
    await modal.getByLabel('Age').fill('30');
    await modal.getByLabel('Salary').fill('50000');
    await modal.getByLabel('Department').fill('QA');
    // Enter invalid email
    const emailInput = modal.getByLabel('Email');
    await emailInput.fill('invalid-email');

    // Submit the modal
    await modal.getByRole('button', { name: 'Submit' }).click();

    // Assert modal is still visible
    await expect(modal).toBeVisible();

    // Assert browser validation message is shown
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test('Boundary – email with no @ symbol triggers validation', async ({ page }) => {
    await page.getByRole('button', { name: 'Add' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    await modal.getByLabel('First Name').fill('Jane');
    await modal.getByLabel('Last Name').fill('Smith');
    await modal.getByLabel('Age').fill('25');
    await modal.getByLabel('Salary').fill('60000');
    await modal.getByLabel('Department').fill('Engineering');
    const emailInput = modal.getByLabel('Email');
    await emailInput.fill('userexample.com'); // missing @

    await modal.getByRole('button', { name: 'Submit' }).click();

    await expect(modal).toBeVisible();
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test('Regression – modal does not close on invalid email submission', async ({ page }) => {
    await page.getByRole('button', { name: 'Add' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    await modal.getByLabel('First Name').fill('Alice');
    await modal.getByLabel('Last Name').fill('Brown');
    await modal.getByLabel('Age').fill('35');
    await modal.getByLabel('Salary').fill('70000');
    await modal.getByLabel('Department').fill('Marketing');
    const emailInput = modal.getByLabel('Email');
    await emailInput.fill('user@.com'); // technically invalid

    await modal.getByRole('button', { name: 'Submit' }).click();

    // Modal should remain open
    await expect(modal).toBeVisible();

    // Check that no success indicator appears (e.g., new row in table)
    // Since the form failed to submit, the table should not change.
    // We can verify the modal is still displayed and the form is still present.
    // Additionally, the email input should still be invalid.
    const validState = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validState).toBe(false);

    // Ensure the modal's submit button is still present (form was not processed)
    await expect(modal.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});
