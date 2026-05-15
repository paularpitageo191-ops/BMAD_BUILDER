import { test, expect, type Page } from '@playwright/test';

test.describe('Negative path validation for DemoQA Elements', () => {
  test('Invalid email shows validation error on Text Box', async ({ page }: { page: Page }) => {
    await page.goto('https://demoqa.com/elements');
    // Navigate to Text Box (assumed default view, or click Text Box tab)
    // For stability, ensure Text Box section is visible
    await page.locator('#userEmail').scrollIntoViewIfNeeded();

    await page.locator('#userEmail').fill('invalid');
    await page.locator('#submit').click();

    // Validate native browser validation message
    const emailInput = page.locator('#userEmail');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
    expect(validationMessage).not.toBe('');

    // Output area should not display submitted data
    await expect(page.locator('#output')).toBeEmpty();
  });

  test('Registration modal stays open after invalid non-numeric age', async ({ page }: { page: Page }) => {
    await page.goto('https://demoqa.com/elements');
    // Open the Web Tables section (navigate to specific tab if needed; assume it's accessible)
    await page.locator('#addNewRecordButton').click();

    // Modal should be visible
    const modal = page.locator('.modal-dialog'); // generic modal selector; adjust if needed
    await expect(modal).toBeVisible();

    await modal.locator('#age').fill('abc');
    await modal.locator('button[type="submit"]').click();

    // Modal should remain open
    await expect(modal).toBeVisible();

    // Age field should show validation error
    const ageInput = modal.locator('#age');
    await expect(ageInput).toHaveAttribute('aria-invalid', 'true');
    const ageValidation = await ageInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(ageValidation).toBeTruthy();
  });

  test('Registration modal stays open after salary exceeding maxlength', async ({ page }: { page: Page }) => {
    await page.goto('https://demoqa.com/elements');
    await page.locator('#addNewRecordButton').click();

    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    await modal.locator('#salary').fill('12345678901'); // more than 10 digits
    await modal.locator('button[type="submit"]').click();

    await expect(modal).toBeVisible();

    // Salary field should have maxlength enforced; the input may be truncated or show error
    const salaryInput = modal.locator('#salary');
    const enteredValue = await salaryInput.inputValue();
    expect(enteredValue.length).toBeLessThanOrEqual(10); // maxlength constraint
    // Alternatively check validation message if HTML5 pattern/type is applied
    await expect(salaryInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('Disabled No radio button remains non-interactable', async ({ page }: { page: Page }) => {
    await page.goto('https://demoqa.com/elements');
    // Navigate to Radio Button section (assume tab navigation or direct URL)
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // Attempt clicking with force: false (will be blocked by Playwright)
    await noRadio.click({ force: false, trial: true }).catch(() => {});

    // Confirm state unchanged
    await expect(noRadio).toBeDisabled();
    await expect(noRadio).not.toBeChecked();
  });
});
