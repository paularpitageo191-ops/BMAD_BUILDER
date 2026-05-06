import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation - DemoQA Elements (@SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('AC1 – Invalid email shows validation error and no output', async ({ page }) => {
    // Navigate to Text Box section (assumed already on page, but ensure it's visible)
    await page.locator('#userEmail').scrollIntoViewIfNeeded();
    // Enter invalid email
    await page.locator('#userEmail').fill('test@domain');
    // Click Submit button (inside #userForm to avoid ambiguity)
    await page.locator('#userForm #submit').click();
    // Validate that the email input shows browser validation error
    const emailInput = page.locator('#userEmail');
    // Check that the validation message is displayed (Playwright's checkValidity approach)
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe('');
    // Validate that #output is not present
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('AC1 – Missing TLD email also triggers validation', async ({ page }) => {
    await page.locator('#userEmail').scrollIntoViewIfNeeded();
    await page.locator('#userEmail').fill('invalid@');
    await page.locator('#userForm #submit').click();
    const emailInput = page.locator('#userEmail');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe('');
  });

  test('AC2 – Non-numeric Age blocks Web Tables submission', async ({ page }) => {
    // Open the Web Tables registration modal by clicking Add button
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('#registration-form-modal');
    await expect(modal).toBeVisible();
    // Enter non-numeric age
    await page.locator('#age').fill('abc');
    // Click modal Submit button
    await page.locator('#registration-form-modal #submit').click();
    // Modal should remain open
    await expect(modal).toBeVisible();
    // Age field should still contain the value
    await expect(page.locator('#age')).toHaveValue('abc');
  });

  test('AC2 – Non-numeric Salary blocks Web Tables submission', async ({ page }) => {
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('#registration-form-modal');
    await expect(modal).toBeVisible();
    await page.locator('#salary').fill('12ab');
    await page.locator('#registration-form-modal #submit').click();
    await expect(modal).toBeVisible();
    await expect(page.locator('#salary')).toHaveValue('12ab');
  });

  test('AC3 – No radio button is disabled and unclickable', async ({ page }) => {
    // Scroll to Radio Button section (selector based on DOM: #noRadio)
    const noRadio = page.locator('#noRadio');
    await noRadio.scrollIntoViewIfNeeded();
    // Verify it is disabled
    await expect(noRadio).toBeDisabled();
    // Attempt to click (should have no effect)
    await noRadio.click({ force: true }).catch(() => {}); // catch if click fails due to disabled
    // Verify it remains disabled
    await expect(noRadio).toBeDisabled();
    // Verify no state change: checked property should remain false
    const isChecked = await noRadio.evaluate((el: HTMLInputElement) => el.checked);
    expect(isChecked).toBe(false);
  });

  test('AC4 – UI remains stable under overlay obstruction', async ({ page }) => {
    // Add a fixed overlay covering the page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '9999';
      document.body.appendChild(overlay);
    });
    // Interact with email field: scroll and use force for visibility handling
    const emailInput = page.locator('#userEmail');
    await emailInput.scrollIntoViewIfNeeded();
    // Use fill with force option because overlay may intercept
    await emailInput.fill('test@example.com', { force: true });
    // Click Submit with force
    await page.locator('#userForm #submit').click({ force: true });
    // Wait for output to appear (should succeed)
    await expect(page.locator('#output')).toBeVisible({ timeout: 5000 });
  });
});
