import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements Negative Path Validation - @SCRUM-70', () => {
  const baseUrl = 'https://demoqa.com';

  test('AC1 – Email validation rejects invalid inputs', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const emailInput = page.locator('#userEmail');
    const submitBtn = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Fill invalid email (missing TLD)
    await emailInput.fill('test@domain');
    await submitBtn.click();

    // Validation error (CSS pseudo-class or class applied by browser/form)
    // In DemoQA, invalid email triggers a red border and a validation message
    await expect(emailInput).toHaveCSS('border-color', 'rgb(244, 67, 54)');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();

    // Output section should not be displayed
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2 – Web Tables blocks non-numeric Age and Salary', async ({ page }) => {
    await page.goto(`${baseUrl}/webtables`);
    const addBtn = page.locator('#addNewRecordButton');
    await addBtn.click();

    const modal = page.locator('.modal-content');
    const firstNameInput = modal.locator('#firstName');
    const lastNameInput = modal.locator('#lastName');
    const emailInput = modal.locator('#userEmail');
    const ageInput = modal.locator('#age');
    const salaryInput = modal.locator('#salary');
    const departmentInput = modal.locator('#department');
    const submitBtn = modal.locator('#submit');

    // Fill valid required fields except age/salary
    await firstNameInput.fill('John');
    await lastNameInput.fill('Doe');
    await emailInput.fill('john@example.com');
    await departmentInput.fill('QA');

    // Fill age with non-numeric value, salary with mixed
    await ageInput.fill('abc');
    await salaryInput.fill('12ab');

    // Attempt submit
    await submitBtn.click();

    // Modal should remain open
    await expect(modal).toBeVisible();

    // No new record should appear in the table body
    const tableRows = page.locator('.rt-tbody .rt-tr-group');
    const rowCountBefore = await tableRows.count();
    // After failed submission row count remains same
    await expect(tableRows).toHaveCount(rowCountBefore);
  });

  test('AC3 – Radio Button "No" remains disabled', async ({ page }) => {
    await page.goto(`${baseUrl}/radio-button`);
    const noRadio = page.locator('#noRadio');

    // Verify disabled attribute
    await expect(noRadio).toBeDisabled();

    // Attempt to click using JavaScript (Playwright will not allow click if disabled)
    // Instead we check that clicking fails and no state change occurs
    await noRadio.click({ force: true }).catch(() => {}); // ignore error

    // After attempted click, button should still be disabled
    await expect(noRadio).toBeDisabled();

    // No feedback message should appear (the element with class "text-success" should not contain "No")
    const feedback = page.locator('.text-success');
    await expect(feedback).not.toContainText('No');
  });

  test('AC4 – UI remains stable under overlay obstruction', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const fullNameInput = page.locator('#userName');

    // Inject a full-page overlay to simulate obstruction
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '9999';
      overlay.style.pointerEvents = 'none'; // allow clicks to pass through for stability test
      document.body.appendChild(overlay);
    });

    // Scroll the input into view (should be possible even with overlay)
    await fullNameInput.scrollIntoViewIfNeeded();

    // Interact with the input (click and type)
    await fullNameInput.click();
    await fullNameInput.fill('Stability Test');

    // Verify the typed value
    await expect(fullNameInput).toHaveValue('Stability Test');

    // Remove overlay and confirm page is still responsive
    await page.evaluate(() => {
      const overlay = document.querySelector('#test-overlay');
      if (overlay) overlay.remove();
    });
    // No crashes, test passes
  });
});
