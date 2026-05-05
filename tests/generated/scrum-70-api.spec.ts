import { test, expect } from '@playwright/test';

test.use({ baseURL: 'https://demoqa.com' });

test.describe('Elements Module Negative Path Validation - SCRUM-70', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the main Elements page (Text Box page for AC1/AC4, but we navigate per test)
    await page.goto('/text-box');
  });

  test('AC1 - Invalid email triggers validation error and no output', async ({ page }) => {
    // Fill in a valid name and address to satisfy required fields? The form has no mandatory fields besides email? Based on screenshots, we fill all fields.
    await page.fill('#userName', 'TestUser');
    await page.fill('#userEmail', 'test@domain');
    await page.fill('#currentAddress', '123 Street');
    await page.fill('#permanentAddress', '456 Avenue');
    await page.click('#submit');

    // Validate error on email field
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveClass(/field-error|error/); // common validation class
    // Check that output section is not displayed (hidden or not present)
    await expect(page.locator('#output')).toBeHidden();
  });

  test('AC2 - Non-numeric age blocks submission and modal stays open', async ({ page }) => {
    // Navigate to Web Tables page
    await page.goto('/webtables');
    // Click "Add" button to open registration modal
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Fill required fields with valid data except age
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'john@example.com');
    await page.fill('#age', 'abc');               // invalid
    await page.fill('#salary', '50000');
    await page.fill('#department', 'Engineering');

    // Submit via the modal submit button
    await page.click('#submit');

    // Modal should remain open
    await expect(modal).toBeVisible();
    // Age field should still contain the invalid value
    await expect(page.locator('#age')).toHaveValue('abc');
  });

  test('AC2 - Non-numeric salary blocks submission and modal stays open', async ({ page }) => {
    await page.goto('/webtables');
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Fill with valid data except salary
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Smith');
    await page.fill('#userEmail', 'jane@example.com');
    await page.fill('#age', '30');
    await page.fill('#salary', '12ab');           // invalid
    await page.fill('#department', 'Finance');

    await page.click('#submit');

    await expect(modal).toBeVisible();
    await expect(page.locator('#salary')).toHaveValue('12ab');
  });

  test('AC3 - "No" radio button remains disabled and click does not change state', async ({ page }) => {
    await page.goto('/radio-button');
    const noRadio = page.locator('#noRadio');
    // Verify it is disabled
    await expect(noRadio).toBeDisabled();
    // Click it – should do nothing
    await noRadio.click({ force: true });
    // Still disabled
    await expect(noRadio).toBeDisabled();
    // Verify no visual change: the "No" label should not have any selected class
    // The demoqa radio buttons typically have a 'custom-control-input' and label. But we check the input itself is not checked.
    await expect(noRadio).not.toBeChecked();
  });

  test('AC4 - UI remains stable under overlay obstruction', async ({ page }) => {
    // Navigate to Text Box page
    await page.goto('/text-box');
    // Inject a semi-transparent overlay that partially covers the form
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '50%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
      overlay.style.zIndex = '9999';
      document.body.appendChild(overlay);
    });

    // Attempt to interact with the email field
    const emailInput = page.locator('#userEmail');
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.click();
    await emailInput.fill('test@demoqa.com');

    // Verify the value was entered successfully
    await expect(emailInput).toHaveValue('test@demoqa.com');
    // Check no unexpected console errors (we can listen for errors)
    page.on('pageerror', (err) => {
      test.fail(true, `Unexpected page error: ${err.message}`);
    });
    // Also check that the output section can be displayed with valid input later (optional)
    await page.fill('#userName', 'User');
    await page.fill('#userEmail', 'valid@example.com');
    await page.fill('#currentAddress', 'Addr');
    await page.fill('#permanentAddress', 'Addr2');
    await page.click('#submit');
    await expect(page.locator('#output')).toBeVisible();
  });
});
