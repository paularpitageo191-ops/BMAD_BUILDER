import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation - Elements Module (@SCRUM-70 @Forensic-AEGIS-2026-MAY-5252)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  // AC1 - Email Validation
  test.describe('AC1 - Email Validation', () => {
    const invalidEmails = [
      'test@domain',
      'user@.com',
      '@domain.com',
      'plainaddress',
      '',
    ];

    invalidEmails.forEach((email) => {
      test(`Invalid email "${email}" triggers validation error and no output`, async ({ page }) => {
        // Navigate to Text Box section
        await page.click('text=Text Box');
        await page.waitForSelector('#userEmail');

        // Fill invalid email
        await page.fill('#userEmail', email);
        await page.click('#submit');

        // Assert validation error is shown on the email field (using aria-invalid or CSS pseudo-class)
        const emailField = page.locator('#userEmail');
        await expect(emailField).toHaveAttribute('class', /invalid|error/);
        // Alternatively check for :invalid state
        await expect(emailField).toHaveAttribute('aria-invalid', 'true');

        // Assert output section is not displayed
        const output = page.locator('#output');
        await expect(output).not.toBeVisible();
      });
    });
  });

  // AC2 - Web Tables Validation
  test.describe('AC2 - Web Tables Validation', () => {
    const invalidAgeSalaryPairs = [
      { age: 'abc', salary: '123' },
      { age: '', salary: '45.6' },
      { age: '12ab', salary: 'abc' },
      { age: 'null', salary: '50000' },
    ];

    invalidAgeSalaryPairs.forEach(({ age, salary }) => {
      test(`Non-numeric Age "${age}" and Salary "${salary}" block submission and keep modal open`, async ({ page }) => {
        // Navigate to Web Tables
        await page.click('text=Web Tables');
        await page.waitForSelector('#addNewRecordButton');

        // Open registration modal
        await page.click('#addNewRecordButton');
        await page.waitForSelector('#registration-form-modal');

        // Fill age and salary
        await page.fill('#age', age);
        await page.fill('#salary', salary);
        // Fill required fields with valid data to isolate validation
        await page.fill('#firstName', 'Test');
        await page.fill('#lastName', 'User');
        await page.fill('#userEmail', 'valid@email.com');
        await page.fill('#department', 'QA');

        // Submit
        await page.click('text=Submit');

        // Modal remains open
        const modal = page.locator('#registration-form-modal');
        await expect(modal).toBeVisible();

        // Validation message for invalid fields (adjust selector as needed; DemoQA uses .field-error or class)
        const ageValidation = page.locator('#age + .field-error, #age:invalid');
        const salaryValidation = page.locator('#salary + .field-error, #salary:invalid');
        // Since the fields are of type number, invalid input should trigger browser validation
        // Check for :invalid pseudo-class or error message
        await expect(ageValidation).toHaveClass(/invalid/);
        await expect(salaryValidation).toHaveClass(/invalid/);
      });
    });
  });

  // AC3 - Radio Button Validation
  test.describe('AC3 - Radio Button Validation', () => {
    test('"No" radio button remains disabled and does not toggle', async ({ page }) => {
      // Navigate to Radio Button section
      await page.click('text=Radio Button');
      await page.waitForSelector('#noRadio');

      // Assert initially disabled
      const noRadio = page.locator('#noRadio');
      await expect(noRadio).toBeDisabled();
      await expect(noRadio).toHaveAttribute('disabled', '');

      // Try clicking (Playwright will throw error if disabled, but we handle gracefully)
      try {
        await noRadio.click({ force: true }); // force click should not change state
      } catch (e) {
        // Expected – element should not be interactable
      }

      // Verify still disabled and no state change
      await expect(noRadio).toBeDisabled();
      // Check no active class or checked attribute
      await expect(noRadio).not.toBeChecked();
    });
  });

  // AC4 - UI Stability
  test.describe('AC4 - UI Stability', () => {
    test('UI remains stable under obstruction and elements remain interactable', async ({ page }) => {
      // Simulate an overlay or obstruction (e.g., a fixed div)
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.id = 'obstruction-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; pointer-events:none;';
        document.body.appendChild(overlay);
      });

      // Navigate to Text Box section
      await page.click('text=Text Box');
      await page.waitForSelector('#userEmail');

      // Scroll to the email field (should work even with overlay since pointer-events are none on overlay)
      await page.locator('#userEmail').scrollIntoViewIfNeeded();

      // Fill field and submit
      const emailField = page.locator('#userEmail');
      await expect(emailField).toBeVisible();
      await emailField.fill('valid@example.com');
      await page.click('#submit');

      // Verify output is displayed (valid email case)
      const output = page.locator('#output');
      await expect(output).toBeVisible();
    });
  });
});