// Traceability
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demoqa.com/elements';

// Helper: open web tables registration modal with default valid data
async function openRegistrationModal(page: import('@playwright/test').Page) {
  await page.goto(`${BASE_URL}/webtables`);
  await page.locator('#addNewRecordButton').click();
  await page.locator('#firstName').fill('John');
  await page.locator('#lastName').fill('Doe');
  await page.locator('#userEmail').fill('john@example.com');
  await page.locator('#department').fill('Engineering');
  // Age and Salary left for scenario-specific handling
}

// Helper: verify that a validation error is shown on a field (HTML5 constraint)
async function expectValidationError(page: import('@playwright/test').Page, selector: string) {
  const isValid = await page.locator(selector).evaluate((el: HTMLInputElement) => el.validity.valid);
  expect(isValid).toBe(false);
}

test.describe('DemoQA Elements – Negative Path Validation (SCRUM-70)', () => {

  // AC1 – Email Validation (negative & boundary)
  test('Invalid email – missing domain name blocks submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    await page.locator('#userEmail').fill('test@.com');
    await page.locator('#submit').click();
    // Expect validation error on email field
    await expectValidationError(page, '#userEmail');
    // Output section should remain hidden
    await expect(page.locator('#output')).toBeHidden();
  });

  test('Invalid email – missing top-level domain blocks submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    await page.locator('#userEmail').fill('test@domain');
    await page.locator('#submit').click();
    await expectValidationError(page, '#userEmail');
    await expect(page.locator('#output')).toBeHidden();
  });

  test('Valid email – positive control for baseline', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    await page.locator('#userEmail').fill('user@example.com');
    await page.locator('#submit').click();
    // No validation error
    const isValid = await page.locator('#userEmail').evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(true);
    // Output section visible
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#output')).toContainText('user@example.com');
  });

  // AC2 – Web Tables Validation
  test('Non-numeric Age blocks submission', async ({ page }) => {
    await openRegistrationModal(page);
    await page.locator('#age').fill('abc');
    await page.locator('#submit').click();
    // Modal should remain open
    await expect(page.locator('.modal-content')).toBeVisible();
    // Age field should have validation error
    await expectValidationError(page, '#age');
    // No row added – verify no new row with 'abc' age
    const tableRows = page.locator('.rt-tr-group');
    await expect(tableRows).not.toContainText('abc');
  });

  test('Non-numeric Salary blocks submission', async ({ page }) => {
    await openRegistrationModal(page);
    await page.locator('#salary').fill('12ab');
    await page.locator('#submit').click();
    await expect(page.locator('.modal-content')).toBeVisible();
    await expectValidationError(page, '#salary');
    // Verify no row added
    await expect(page.locator('.rt-tr-group')).not.toContainText('12ab');
  });

  test('Empty Age field blocks submission', async ({ page }) => {
    await openRegistrationModal(page);
    // Leave Age empty
    await page.locator('#salary').fill('50000');
    await page.locator('#submit').click();
    await expect(page.locator('.modal-content')).toBeVisible();
    // Age field should be invalid due to required constraint
    await expectValidationError(page, '#age');
  });

  test('Valid numeric inputs – positive regression', async ({ page }) => {
    await openRegistrationModal(page);
    await page.locator('#age').fill('25');
    await page.locator('#salary').fill('50000');
    await page.locator('#submit').click();
    // Modal should close
    await expect(page.locator('.modal-content')).toBeHidden();
    // New row should appear with entered data
    await expect(page.locator('.rt-tr-group')).toContainText('John');
    await expect(page.locator('.rt-tr-group')).toContainText('25');
  });

  // AC3 – Radio Button Validation
  test('"No" radio button remains disabled and non-interactable', async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);
    const noRadio = page.locator('#noRadio');
    // Verify disabled attribute initially
    await expect(noRadio).toBeDisabled();
    // Attempt to click – use force because it's disabled, Playwright click will throw
    // Use dispatchEvent to simulate click
    await noRadio.dispatchEvent('click');
    // Verify it's still disabled
    await expect(noRadio).toBeDisabled();
    // No output for "No"
    const output = page.locator('.text-success');
    await expect(output).not.toContainText('No');
    // If "Yes" was previously selected, verify it stays
    const yesRadio = page.locator('#yesRadio');
    const isYesSelected = await yesRadio.isChecked();
    expect(isYesSelected).toBe(false); // default unchecked
  });

  // AC4 – UI Stability (review-first – no automated executable for overlay injection)
  // These scenarios are left as design-only; no code generated.

  // Additional boundary: empty email
  test('Empty email input – edge case', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    // Ensure email field empty
    await page.locator('#userEmail').fill('');
    await page.locator('#submit').click();
    // Output should not appear
    await expect(page.locator('#output')).toBeHidden();
    // Email field should show validation error (required)
    const tooShort = await page.locator('#userEmail').evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    expect(tooShort).toBe(true);
  });

});
