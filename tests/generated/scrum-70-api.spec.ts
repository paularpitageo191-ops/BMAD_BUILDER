import { test, expect } from '@playwright/test';

const BaseURL = 'https://demoqa.com';

test.describe('SCRUM-70: Negative Path Validation for Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state for each test
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('AC1 – Email Validation rejects invalid format and hides output', async ({ page }) => {
    const invalidEmails = [
      'test@domain',
      'user@.com',
      '@example.com',
      '123@456',
      '',
    ];

    for (const email of invalidEmails) {
      await page.goto(`${BaseURL}/text-box`);
      await page.locator('#userEmail').fill(email);
      await page.locator('#submit').click();

      // Verify validation error on #userEmail
      const emailInput = page.locator('#userEmail');
      // DemoQA applies CSS class 'field-error' on invalid input
      await expect(emailInput).toHaveClass(/field-error/, { timeout: 2000 });

      // Verify output section is not displayed
      const output = page.locator('#output');
      await expect(output).not.toBeVisible();

      // Also check browser validation message (if triggered)
      // Optionally: assert that the input has the 'required' or pattern validation active
      // For empty string, the HTML5 required pattern may trigger a popup, but we trust class assertion.
    }
  });

  test('AC2 – Web Tables rejects non-numeric values in Age/Salary', async ({ page }) => {
    const testCases = [
      { age: 'abc', salary: '12ab' },
      { age: '12.5', salary: '$1000' },
      { age: '-5', salary: '0' },
    ];

    for (const { age, salary } of testCases) {
      await page.goto(`${BaseURL}/webtables`);
      // Click "Add" button to open registration modal
      await page.locator('#addNewRecordButton').click();
      const modal = page.locator('.modal-content');
      await expect(modal).toBeVisible();

      // Fill Age and Salary with invalid values
      const ageInput = modal.locator('#age');
      const salaryInput = modal.locator('#salary');
      await ageInput.fill(age);
      await salaryInput.fill(salary);

      // Click Submit
      await modal.locator('#submit').click();

      // Modal should remain open
      await expect(modal).toBeVisible();

      // Age or Salary field should have validation error class
      // DemoQA uses 'field-error' class on invalid fields
      const isAgeInvalid = await ageInput.evaluate(el => el.classList.contains('field-error'));
      const isSalaryInvalid = await salaryInput.evaluate(el => el.classList.contains('field-error'));
      expect(isAgeInvalid || isSalaryInvalid).toBeTruthy();

      // Close modal for next iteration
      await modal.locator('.close').click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('AC3 – Radio Button "No" option remains disabled', async ({ page }) => {
    await page.goto(`${BaseURL}/radio-button`);

    const noRadio = page.locator('#noRadio');
    // Assert disabled
    await expect(noRadio).toBeDisabled();

    // Capture initial state of the 'No' label (if any) - it should have 'disabled' class
    const noLabel = page.locator('label[for="noRadio"]');
    await expect(noLabel).toHaveClass(/disabled/);

    // Click the label (since radio itself is disabled, click label does nothing)
    await noLabel.click();

    // Verify radio remains disabled
    await expect(noRadio).toBeDisabled();

    // Verify no state change: the 'Yes' or 'Impressive' radios should still be unchecked
    const yesRadio = page.locator('#yesRadio');
    const impressiveRadio = page.locator('#impressiveRadio');
    await expect(yesRadio).not.toBeChecked();
    await expect(impressiveRadio).not.toBeChecked();

    // Also ensure that the result message still says nothing (or is hidden)
    const result = page.locator('.text-success');
    await expect(result).not.toBeVisible();
  });

  test('AC4 – UI remains stable under overlay obstruction', async ({ page }) => {
    // Use Web Tables registration modal as an overlay obstruction
    await page.goto(`${BaseURL}/webtables`);
    // Open registration modal
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Verify the overlay (modal backdrop) is present
    const backdrop = page.locator('.modal-backdrop');
    await expect(backdrop).toBeVisible();

    // Check that the page behind the modal can be scrolled
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 500);
    // Wait a bit for scroll to happen
    await page.waitForTimeout(500);
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBeGreaterThan(scrollYBefore);

    // The registration modal should remain open and interactable
    await expect(modal).toBeVisible();
    // Try interacting with a field inside the modal
    const ageInput = modal.locator('#age');
    await ageInput.fill('25');
    // Close modal to confirm it's still functional
    await modal.locator('.close').click();
    await expect(modal).not.toBeVisible();
  });
});
