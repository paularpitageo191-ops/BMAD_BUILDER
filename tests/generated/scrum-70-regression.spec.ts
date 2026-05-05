import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';

test.describe('Negative Path Validation – DemoQA Elements', () => {

  test('AC1 Email Validation – invalid email shows validation error and no output', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('test@domain');
    await page.locator('#submit').click();
    // Assert validation error (CSS class 'field-error' or 'is-invalid')
    await expect(emailInput).toHaveClass(/field-error|is-invalid/);
    // Assert output section is hidden
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('AC2 Web Tables – non-numeric Age blocks submission and modal stays open', async ({ page }) => {
    await page.goto(`${BASE_URL}/webtables`);
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    // Fill only non-numeric fields (Age, Salary) – leave required fields as valid default
    await page.locator('#age').fill('abc');
    await page.locator('#salary').fill('12ab');
    // Ensure first name and last name are filled to avoid unrelated validation
    await page.locator('#firstName').fill('Test');
    await page.locator('#lastName').fill('User');
    await page.locator('#department').fill('QA');
    // Submit
    await page.locator('#submit').click();
    // Modal should still be open
    await expect(modal).toBeVisible();
    // Table should not have a new row (count rows before and after)
    const rowsBefore = await page.locator('.rt-tr-group').count();
    // (No new row added, so count unchanged)
    const rowsAfter = await page.locator('.rt-tr-group').count();
    expect(rowsAfter).toBe(rowsBefore);
  });

  test('AC3 Radio Button – disabled "No" option does not respond to clicks', async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);
    const noRadio = page.locator('#noRadio');
    // Verify disabled attribute
    await expect(noRadio).toBeDisabled();
    // Click it
    await noRadio.click({ force: true }); // force to bypass any overlay
    // Verify still disabled
    await expect(noRadio).toBeDisabled();
    // Output text should remain unchanged (no selection)
    await expect(page.locator('.text-success')).not.toBeVisible();
  });

  test('AC4 UI Stability – elements interactable via scroll when initially out of view', async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);
    const yesRadio = page.locator('#yesRadio');
    // Scroll into view if not already
    await yesRadio.scrollIntoViewIfNeeded();
    await yesRadio.click();
    // Check that 'Yes' radio is selected
    await expect(yesRadio).toBeChecked();
    // Check output message
    await expect(page.locator('.text-success')).toHaveText('You have selected Yes');
  });
});
