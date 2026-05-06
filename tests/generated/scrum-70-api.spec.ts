import { test, expect } from '@playwright/test';

test.describe('SCRUM-70: Negative Path Validation for DemoQA Elements Module', () => {
  const baseUrl = 'https://demoqa.com';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('AC1 – Email validation rejects invalid input', async ({ page }) => {
    // Navigate to Text Box page
    await page.goto(`${baseUrl}/text-box`);

    // Enter invalid email
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('test@domain');
    await page.locator('#submit').click();

    // Assert validation error – the input should be invalid
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBeTruthy();

    // Assert output section is not visible
    const output = page.locator('#output');
    await expect(output).not.toBeVisible();
  });

  test('AC2 – Web Tables blocks non-numeric Age and Salary', async ({ page }) => {
    // Navigate to Web Tables page
    await page.goto(`${baseUrl}/webtables`);

    // Click Add button to open the registration modal
    await page.locator('text=Add').click();

    // Wait for the modal to be visible
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    // Fill Age and Salary fields with non-numeric values
    const ageField = modal.locator('#age');
    const salaryField = modal.locator('#salary');
    await ageField.fill('abc');
    await salaryField.fill('12ab');

    // Click Submit
    await page.locator('text=Submit').click();

    // Assert modal still open
    await expect(modal).toBeVisible();

    // Assert Age field shows validation error (check for invalid pseudo-class)
    const ageInvalid = await ageField.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(ageInvalid).toBeTruthy();

    const salaryInvalid = await salaryField.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(salaryInvalid).toBeTruthy();
  });

  test('AC3 – Radio Button "No" remains disabled', async ({ page }) => {
    // Navigate to Radio Button page
    await page.goto(`${baseUrl}/radio-button`);

    // Locate the "No" radio button
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // Attempt to click (should not cause any state change)
    await noRadio.click({ force: true });

    // Confirm still disabled
    await expect(noRadio).toBeDisabled();

    // Confirm its selected state is unchanged (not checked)
    const isChecked = await noRadio.isChecked();
    expect(isChecked).toBeFalsy();
  });

  test('AC4 – UI stability under overlay obstruction', async ({ page }) => {
    // Navigate to Text Box page
    await page.goto(`${baseUrl}/text-box`);

    // Inject a fixed overlay that covers the entire viewport
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.background = 'rgba(0,0,0,0.5)';
      overlay.style.zIndex = '9999';
      document.body.appendChild(overlay);
    });

    // Scroll the email field into view and verify it can be interacted with
    const emailInput = page.locator('#userEmail');
    await emailInput.scrollIntoViewIfNeeded();
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();

    // Fill a value to confirm real interaction
    await emailInput.fill('valid@example.com');
    // Optionally submit and verify output is shown (positive check to confirm stability)
    await page.locator('#submit').click();
    const output = page.locator('#output');
    await expect(output).toBeVisible();
  });
});
