import { test, expect } from '@playwright/test';

test.describe('Negative path validation for DemoQA Elements – Web Tables Add Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
  });

  test('Invalid email shows validation error and modal remains open', async ({ page }) => {
    await test.step('Open the Add modal', async () => {
      await page.getByRole('button', { name: 'Add' }).click();
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
    });

    const modal = page.getByRole('dialog');
    const emailInput = page.getByLabel('Email');

    await test.step('Enter an invalid email and submit', async () => {
      await emailInput.fill('invalid-email');
      await modal.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Verify validation error appears and modal stays open', async () => {
      // DemoQA displays a red border and tooltip-like validation message
      const validationError = page.locator('#email-field + .invalid-feedback');
      // Alternatively, use the native validation message via HTML5 validity
      // Since DemoQA uses HTML5 validation, we can check the validationMessage property
      await expect(emailInput).toHaveAttribute('class', /is-invalid/);
      // Wait for any dynamic validation message (if custom)
      await expect(modal).toBeVisible();
    });
  });

  test('Modal remains open on invalid input – combined check', async ({ page }) => {
    await test.step('Open modal and submit with invalid email', async () => {
      await page.getByRole('button', { name: 'Add' }).click();
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      await page.getByLabel('Email').fill('bad-email');
      await modal.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Modal should still be open and validation present', async () => {
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByLabel('Email')).toHaveAttribute('class', /is-invalid/);
    });
  });

  test('Regression – valid email after invalid attempt succeeds', async ({ page }) => {
    await test.step('Open modal and submit invalid email first', async () => {
      await page.getByRole('button', { name: 'Add' }).click();
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      const emailInput = page.getByLabel('Email');
      await emailInput.fill('wrong');
      await modal.getByRole('button', { name: 'Submit' }).click();
      // Wait for validation to appear
      await expect(emailInput).toHaveAttribute('class', /is-invalid/);
    });

    const modal = page.getByRole('dialog');
    const emailInput = page.getByLabel('Email');

    await test.step('Correct the email and submit again', async () => {
      await emailInput.fill('valid.user@example.com');
      await modal.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Modal closes and new record appears in table', async () => {
      await expect(modal).not.toBeVisible();
      // Verify the table contains the new email
      await expect(page.getByRole('gridcell', { name: 'valid.user@example.com' })).toBeVisible();
    });
  });
});
