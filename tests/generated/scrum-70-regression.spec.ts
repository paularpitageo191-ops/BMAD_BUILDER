import { test, expect } from '@playwright/test';

test.describe('SCRUM-70: Negative Path Validation for DemoQA Elements', () => {
  const baseUrl = 'https://demoqa.com';

  test('AC1 – Email Validation invalid input', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const emailInput = page.locator('#userEmail');
    const submitBtn = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('test@domain');
    await submitBtn.click();

    // Verify HTML5 validation error (email field is invalid)
    await expect(emailInput).toHaveJSProperty('validationMessage', expect.stringMatching(/@/));
    // Output section should remain hidden
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2 – Web Tables non-numeric Age and Salary', async ({ page }) => {
    await page.goto(`${baseUrl}/webtables`);
    const addBtn = page.locator('#addNewRecordButton');
    await addBtn.click();

    const modal = page.locator('#registration-form-modal');
    await expect(modal).toBeVisible();

    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const submitBtn = page.locator('#submit', { page: modal });

    await ageInput.fill('abc');
    await salaryInput.fill('12ab');
    await submitBtn.click();

    // Modal remains open (submission blocked)
    await expect(modal).toBeVisible();
    // Fields show validation errors (browser-native or custom)
    await expect(ageInput).toHaveJSProperty('validationMessage', expect.stringMatching(/abc/));
    await expect(salaryInput).toHaveJSProperty('validationMessage', expect.stringMatching(/12ab/));
  });

  test('AC3 – Radio Button disabled option', async ({ page }) => {
    await page.goto(`${baseUrl}/radio-button`);
    const noRadio = page.locator('#noRadio');

    // Verify it is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click (using force because disabled elements block clicks)
    await noRadio.click({ force: true });

    // No state change: still disabled and not checked
    await expect(noRadio).toBeDisabled();
    await expect(noRadio).not.toBeChecked();
  });

  test('AC4 – UI stability under overlay', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    // Inject a fixed banner overlay at the top (100px high)
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = '__testOverlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100px;background:yellow;z-index:9999;pointer-events:none;';
      document.body.prepend(overlay);
    });

    const emailInput = page.locator('#userEmail');
    const submitBtn = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Scroll to the email field (it may be below the overlay)
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('test@example.com');
    await submitBtn.click();

    // Output section should appear for valid email
    await expect(outputSection).toBeVisible();
    // Ensure field value was accepted
    await expect(emailInput).toHaveValue('test@example.com');
  });
});
