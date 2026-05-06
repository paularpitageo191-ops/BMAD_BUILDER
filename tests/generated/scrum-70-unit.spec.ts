import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';

test.describe('SCRUM-70 Negative Path Validation for Elements Module', () => {

  test('AC1 – Email Validation rejects invalid email @example', async ({ page }) => {
    const invalidEmails = [
      'test@domain',
      'invalid.email@',
      '@domain.com',
      'user@.com',
      '',
    ];

    for (const email of invalidEmails) {
      await page.goto(`${BASE_URL}/text-box`);
      await page.locator('#userEmail').fill(email);
      await page.locator('#submit').click();

      // Assert validation error is shown on the email field
      const emailInput = page.locator('#userEmail');
      await expect(emailInput).toHaveClass(/field-error|is-invalid/);
      // Assert output section is not visible
      await expect(page.locator('#output')).not.toBeVisible();
    }
  });

  test('AC2 – Web Tables blocks non-numeric Age or Salary', async ({ page }) => {
    const testData = [
      { field: 'age', value: 'abc' },
      { field: 'age', value: '12ab' },
      { field: 'salary', value: 'xyz' },
      { field: 'salary', value: 'ab12' },
    ];

    for (const { field, value } of testData) {
      await page.goto(`${BASE_URL}/webtables`);
      await page.locator('#addNewRecordButton').click();

      // Fill required fields with valid data except the targeted field
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: '20',
        salary: '50000',
        department: 'QA',
      };
      validData[field] = value;

      await page.locator('#firstName').fill(validData.firstName);
      await page.locator('#lastName').fill(validData.lastName);
      await page.locator('#userEmail').fill(validData.email);
      await page.locator('#age').fill(validData.age);
      await page.locator('#salary').fill(validData.salary);
      await page.locator('#department').fill(validData.department);

      await page.locator('#submit').click();

      // Assert modal remains open (registration form is still visible)
      await expect(page.locator('.modal-content')).toBeVisible();
      // Assert error indicator on the invalid field (assumes error state like border-color red)
      const fieldLocator = page.locator(`#${field}`);
      await expect(fieldLocator).toHaveClass(/field-error|is-invalid/);
    }
  });

  test('AC3 – Radio Button "No" remains disabled and unclickable', async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);

    const noRadio = page.locator('#noRadio');

    // Verify it is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt click
    await noRadio.click({ force: true });

    // Verify still disabled
    await expect(noRadio).toBeDisabled();

    // Verify no state change – the "No" radio should not be selected
    await expect(page.locator('.text-success')).not.toContainText('No');
  });

  test('AC4 – UI remains stable after overlay interaction', async ({ page }) => {
    await page.goto(`${BASE_URL}/webtables`);

    // Open registration modal
    await page.locator('#addNewRecordButton').click();
    await expect(page.locator('.modal-content')).toBeVisible();

    // Close modal by clicking the X button or cancel
    await page.locator('.modal-header .close').click(); // Bootstrap close button
    // Alternatively: await page.locator('button:has-text("Close")').click();

    // Verify the underlying page elements are still interactable
    const addButton = page.locator('#addNewRecordButton');
    await expect(addButton).toBeEnabled();
    await expect(addButton).toBeVisible();

    // Verify the table is still present
    const table = page.locator('.rt-table');
    await expect(table).toBeVisible();
  });

});
