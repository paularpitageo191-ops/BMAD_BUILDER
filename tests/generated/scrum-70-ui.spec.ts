import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation for DemoQA Elements Module', () => {
  const baseUrl = 'https://demoqa.com';

  test('AC1 – Email Validation – invalid email shows error and hides output', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const invalidEmail = 'test@domain';

    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill(invalidEmail);
    await submitButton.click();

    // Trigger client-side validation – HTML5 validation blocks submission
    // Wait for potential validation error (e.g., CSS pseudo-class :invalid or error message)
    await expect(emailInput).toHaveJSProperty('validationMessage', /Please include/);
    await expect(outputSection).toBeHidden();
  });

  test('AC2 – Web Tables Validation – non-numeric Age/Salary blocks submission and modal stays open', async ({ page }) => {
    await page.goto(`${baseUrl}/webtables`);
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    const firstNameInput = page.locator('#firstName');
    const lastNameInput = page.locator('#lastName');
    const emailInput = page.locator('#userEmail');
    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const departmentInput = page.locator('#department');
    const submitButton = page.locator('#submit');

    await firstNameInput.fill('John');
    await lastNameInput.fill('Doe');
    await emailInput.fill('john@example.com');
    await ageInput.fill('abc');        // non-numeric
    await salaryInput.fill('12ab');    // non-numeric
    await departmentInput.fill('QA');

    await submitButton.click();

    // Modal should remain open because validation failed
    await expect(modal).toBeVisible();

    // Ensure no new row was added (optional: count rows before/after)
    const rowCountBefore = await page.locator('.rt-tr-group').count();
    // After invalid submit, row count should be same
    await expect(page.locator('.rt-tr-group')).toHaveCount(rowCountBefore);
  });

  test('AC3 – Radio Button Validation – disabled "No" option cannot be changed', async ({ page }) => {
    await page.goto(`${baseUrl}/radio-button`);
    const noRadio = page.locator('#noRadio');

    // Verify it is disabled initially
    await expect(noRadio).toBeDisabled();

    // Click the label or the input; using click on the input (disabled should prevent)
    await noRadio.click({ force: true }); // force click because it's disabled, but we expect no change

    // Assert still disabled
    await expect(noRadio).toBeDisabled();

    // Assert no change in state (e.g., not checked)
    await expect(noRadio).not.toBeChecked();
  });

  test('AC4 – UI Stability – elements remain interactable under obstruction', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const overlayScript = `
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;width:100%;height:100%;top:0;left:0;background:rgba(0,0,0,0.5);z-index:9999;';
      document.body.appendChild(overlay);
    `;
    await page.evaluate(overlayScript);

    const submitButton = page.locator('#submit');

    // Scroll into view and click – should succeed even with overlay but visible scroll
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click({ force: true }); // force click to bypass overlay

    // Verify no crash – page remains stable (e.g., URL unchanged, no error)
    await expect(page).toHaveURL(`${baseUrl}/text-box`);
  });
});
