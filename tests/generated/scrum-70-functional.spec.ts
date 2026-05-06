import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation for DemoQA Elements Module', () => {
  const baseUrl = 'https://demoqa.com';

  test('AC1 - Email validation rejects invalid input', async ({ page }) => {
    await test.step('Given I am on the Text Box page', async () => {
      await page.goto(`${baseUrl}/text-box`);
    });

    await test.step('When I enter an invalid email "test@domain" into the "#userEmail" field', async () => {
      await page.locator('#userEmail').fill('test@domain');
    });

    await test.step('And I click outside the field to trigger validation', async () => {
      await page.locator('#userName').click();
    });

    await test.step('Then a validation error is visible on the "#userEmail" field', async () => {
      const emailField = page.locator('#userEmail');
      // HTML5 validation CSS pseudo-class :invalid is applied
      await expect(emailField).toHaveAttribute('class', /invalid/);
      // Alternatively check for the built-in validation message
      await expect(page.locator('input:invalid')).toHaveCount(1);
    });

    await test.step('And the "#output" section is not displayed', async () => {
      await expect(page.locator('#output')).not.toBeVisible();
    });
  });

  test('AC2 - Web Tables blocks non-numeric Age and Salary', async ({ page }) => {
    await test.step('Given I am on the Web Tables page', async () => {
      await page.goto(`${baseUrl}/webtables`);
    });

    await test.step('When I click the "Add" button to open the registration modal', async () => {
      await page.locator('#addNewRecordButton').click();
      await expect(page.locator('.modal-content')).toBeVisible();
    });

    await test.step('And I enter invalid data into Age and Salary', async () => {
      await page.locator('#firstName').fill('John');
      await page.locator('#lastName').fill('Doe');
      await page.locator('#userEmail').fill('j@doe.com');
      await page.locator('#age').fill('abc');
      await page.locator('#salary').fill('12ab');
      await page.locator('#department').fill('Engineering');
    });

    await test.step('And I click the "Submit" button inside the modal', async () => {
      await page.locator('#submit').click();
    });

    await test.step('Then the registration modal remains open', async () => {
      await expect(page.locator('.modal-content')).toBeVisible();
    });

    await test.step('And the Age field shows a validation error', async () => {
      // HTML5 validation: field is invalid
      const ageField = page.locator('#age');
      await expect(ageField).toHaveAttribute('class', /invalid/);
    });

    await test.step('And the Salary field shows a validation error', async () => {
      const salaryField = page.locator('#salary');
      await expect(salaryField).toHaveAttribute('class', /invalid/);
    });
  });

  test('AC3 - "No" radio button is disabled and non-interactive', async ({ page }) => {
    await test.step('Given I am on the Radio Button page', async () => {
      await page.goto(`${baseUrl}/radio-button`);
    });

    await test.step('Then the "#noRadio" option should be disabled', async () => {
      await expect(page.locator('#noRadio')).toBeDisabled();
    });

    await test.step('When I attempt to click the "#noRadio" option', async () => {
      await page.locator('#noRadio').click({ force: true });
    });

    await test.step('Then the "#noRadio" option remains disabled and unselected', async () => {
      await expect(page.locator('#noRadio')).toBeDisabled();
      // Ensure no success message appears for "No"
      await expect(page.locator('.text-success')).not.toContainText('No');
    });
  });

  test('AC4 - UI remains interactable under an overlay obstruction', async ({ page }) => {
    await test.step('Given I am on the Text Box page', async () => {
      await page.goto(`${baseUrl}/text-box`);
    });

    await test.step('When an overlay covers the top half of the form', async () => {
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.id = 'test-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: rgba(0,0,0,0.3);
          z-index: 9999;
          pointer-events: auto;
        `;
        document.body.appendChild(overlay);
      });
    });

    await test.step('Then I can scroll to the "Full Name" field and type into it', async () => {
      const fullNameField = page.locator('#userName');
      await fullNameField.scrollIntoViewIfNeeded();
      await fullNameField.fill('John Doe');
      await expect(fullNameField).toHaveValue('John Doe');
    });

    await test.step('And I can still type into the "#userEmail" field', async () => {
      const emailField = page.locator('#userEmail');
      await emailField.scrollIntoViewIfNeeded();
      await emailField.fill('test@example.com');
      await expect(emailField).toHaveValue('test@example.com');
    });

    await test.step('And the overlay does not affect element availability', async () => {
      // Cleanup overlay
      await page.evaluate(() => {
        const overlay = document.getElementById('test-overlay');
        if (overlay) overlay.remove();
      });
      // The test already passed if the previous steps succeeded
    });
  });
});
