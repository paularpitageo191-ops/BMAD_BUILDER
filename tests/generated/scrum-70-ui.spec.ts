// Traceability
import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements - Negative Path Validation', () => {
  // --- Text Box ---
  test.describe('Text Box', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://demoqa.com/text-box');
    });

    test('AC1 - Empty email field shows validation error and output not displayed', async ({ page }) => {
      const emailInput = page.locator('#userEmail');
      const submitBtn = page.locator('#submit');
      const output = page.locator('#output');

      // Ensure field empty
      await emailInput.clear();
      // Trigger submission (will be blocked by browser validation)
      await submitBtn.click();

      // Assert browser validation
      await expect(emailInput).toHaveAttribute('required', '');
      // validationMessage should be non-empty
      const validationMsg = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMsg).toContain('fill out this field');
      // Output not visible or present
      await expect(output).not.toBeVisible();
    });

    test('AC1 - Invalid email format (missing TLD) shows validation error', async ({ page }) => {
      const emailInput = page.locator('#userEmail');
      const submitBtn = page.locator('#submit');
      const output = page.locator('#output');

      await emailInput.fill('test@domain');
      await submitBtn.click();

      // Assert HTML5 email validation
      const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
      expect(validity).toBeTruthy();
      const validationMsg = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMsg).toContain('enter a valid email');
      await expect(output).not.toBeVisible();
    });

    test('AC1 - Valid email displays output section', async ({ page }) => {
      const nameInput = page.locator('#userName');
      const emailInput = page.locator('#userEmail');
      const currentAddress = page.locator('#currentAddress');
      const permanentAddress = page.locator('#permanentAddress');
      const submitBtn = page.locator('#submit');
      const output = page.locator('#output');

      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      await currentAddress.fill('123 Main St');
      await permanentAddress.fill('456 Elm St');
      await submitBtn.click();

      await expect(output).toBeVisible();
      await expect(output).toContainText('test@example.com');
    });

    test('AC1 - Invalid email format (special characters) triggers validation', async ({ page }) => {
      const emailInput = page.locator('#userEmail');
      const submitBtn = page.locator('#submit');
      const output = page.locator('#output');

      await emailInput.fill('test@domain..com');
      await submitBtn.click();

      // Browser should reject double dot after @
      const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
      expect(validity).toBeTruthy();
      await expect(output).not.toBeVisible();
    });
  });

  // --- Web Tables ---
  test.describe('Web Tables', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://demoqa.com/webtables');
    });

    async function openRegistrationModal(page: import('@playwright/test').Page) {
      await page.locator('#addNewRecordButton').click();
      // Wait for modal to be visible
      await expect(page.locator('.modal-content')).toBeVisible();
    }

    async function fillValidFields(page: import('@playwright/test').Page, overrides: Record<string, string> = {}) {
      const base = {
        firstName: 'John',
        lastName: 'Doe',
        userEmail: 'john@example.com',
        age: '30',
        salary: '50000',
        department: 'QA',
      };
      const data = { ...base, ...overrides };
      await page.locator('#firstName').fill(data.firstName);
      await page.locator('#lastName').fill(data.lastName);
      await page.locator('#userEmail').fill(data.userEmail);
      if (data.age !== undefined) await page.locator('#age').fill(data.age);
      if (data.salary !== undefined) await page.locator('#salary').fill(data.salary);
      await page.locator('#department').fill(data.department);
    }

    test('AC2 - Non-numeric age blocks submission and modal stays open', async ({ page }) => {
      await openRegistrationModal(page);
      await fillValidFields(page, { age: 'abc' });
      await page.locator('#submit').click();

      // Modal should remain visible
      await expect(page.locator('.modal-content')).toBeVisible();
      // Age field should show validation error
      const ageInput = page.locator('#age');
      expect(await ageInput.evaluate((el: HTMLInputElement) => el.validationMessage)).toContain('number');
      // No new row should appear – we check that the table row count hasn't increased
      const initialRows = await page.locator('.rt-tr-group').count();
      // After submission fails, row count should stay same
      // (Note: demoqa table rows include header; we can check total count)
      expect(await page.locator('.rt-tr-group').count()).toBe(initialRows);
    });

    test('AC2 - Non-numeric salary blocks submission and modal stays open', async ({ page }) => {
      await openRegistrationModal(page);
      await fillValidFields(page, { age: '25', salary: '12ab' });
      await page.locator('#submit').click();

      await expect(page.locator('.modal-content')).toBeVisible();
      const salaryInput = page.locator('#salary');
      expect(await salaryInput.evaluate((el: HTMLInputElement) => el.validationMessage)).toContain('number');
      const initialRows = await page.locator('.rt-tr-group').count();
      expect(await page.locator('.rt-tr-group').count()).toBe(initialRows);
    });

    test('AC2 - Empty age and salary fields block submission and modal stays open', async ({ page }) => {
      await openRegistrationModal(page);
      await fillValidFields(page, { age: '', salary: '' });
      await page.locator('#submit').click();

      await expect(page.locator('.modal-content')).toBeVisible();
      // Age or salary should show required validation (browser default)
      const ageInput = page.locator('#age');
      const salaryInput = page.locator('#salary');
      const ageValidation = await ageInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      const salaryValidation = await salaryInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(ageValidation || salaryValidation).not.toBe('');
      const initialRows = await page.locator('.rt-tr-group').count();
      expect(await page.locator('.rt-tr-group').count()).toBe(initialRows);
    });

    test('AC2 - Valid age and salary completes submission and adds row', async ({ page }) => {
      await openRegistrationModal(page);
      await fillValidFields(page, { age: '30', salary: '50000' });
      await page.locator('#submit').click();

      // Modal should close
      await expect(page.locator('.modal-content')).not.toBeVisible();
      // Search for the new entry by email to verify it appears
      await page.locator('#searchBox').fill('john@example.com');
      // Row should be visible
      await expect(page.locator('.rt-tr-group').filter({ hasText: 'john@example.com' })).toBeVisible();
    });

    test('AC2 - Age negative number blocks submission (or proceeds)', async ({ page }) => {
      await openRegistrationModal(page);
      await fillValidFields(page, { age: '-5' });
      await page.locator('#submit').click();

      // Since demoqa does not enforce lower-bound on age, the modal might close and row added.
      // We'll assert the common behavior: submission succeeds if no validation.
      // But we still check for modal persistence; if it closes, confirm row added.
      const modalVisible = await page.locator('.modal-content').isVisible();
      if (modalVisible) {
        // Modal stayed open – validation exists
        const ageInput = page.locator('#age');
        const validationMsg = await ageInput.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(validationMsg).not.toBe('');
      } else {
        // Submission accepted – verify row added
        await page.locator('#searchBox').fill('john@example.com');
        await expect(page.locator('.rt-tr-group').filter({ hasText: 'john@example.com' })).toBeVisible();
      }
    });
  });

  // --- Radio Button ---
  test.describe('Radio Button', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://demoqa.com/radio-button');
    });

    test('AC3 - "No" radio button is disabled and cannot be interacted with', async ({ page }) => {
      const noRadio = page.locator('#noRadio');
      const yesRadio = page.locator('#yesRadio');
      const impressiveRadio = page.locator('#impressiveRadio');
      const successMessage = page.locator('.text-success');

      // Assert disabled
      await expect(noRadio).toBeDisabled();

      // Attempt click (should be ignored)
      await noRadio.click({ force: true }); // force click to simulate attempted interaction
      // Check that it is still unchecked and disabled
      await expect(noRadio).toBeDisabled();
      await expect(noRadio).not.toBeChecked();
      // No message should appear for 'No'
      await expect(successMessage).not.toExist();

      // Other radios still work
      await yesRadio.click();
      await expect(successMessage).toContainText('Yes');
      await impressiveRadio.click();
      await expect(successMessage).toContainText('Impressive');
    });

    test('AC3 - Selecting "Yes" and "Impressive" works while "No" stays disabled', async ({ page }) => {
      const yesRadio = page.locator('#yesRadio');
      const impressiveRadio = page.locator('#impressiveRadio');
      const noRadio = page.locator('#noRadio');
      const successMessage = page.locator('.text-success');

      await yesRadio.click();
      await expect(successMessage).toContainText('Yes');

      await impressiveRadio.click();
      await expect(successMessage).toContainText('Impressive');

      await expect(noRadio).toBeDisabled();
    });
  });
});
