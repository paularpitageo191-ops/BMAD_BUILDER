import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements Negative Validation', () => {
  test('Invalid email on Text Box shows validation error', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await page.fill('#userEmail', 'invalid-email');
    await page.click('#submit');
    // Output area should not appear for invalid input
    await expect(page.locator('#output')).not.toBeVisible();
    // Email input should have validation error (aria-invalid or red border class)
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveAttribute('class', /error/);
  });

  test('Invalid email in Web Tables modal keeps modal open and shows validation', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    await page.fill('#userEmail', 'bad-email@');
    await page.getByRole('button', { name: 'Submit' }).click();
    // Modal should still be open
    await expect(modal).toBeVisible();
    // Email input should have validation error
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveAttribute('class', /error/);
  });

  test('Disabled radio button remains non-interactable (regression)', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();
    // Attempt to click should not change state
    await noRadio.click({ force: true });
    await expect(noRadio).toBeDisabled();
    // Ensure no option is selected by verifying other selection
    await expect(page.locator('#yesRadio')).not.toBeChecked();
    await expect(page.locator('#impressiveRadio')).not.toBeChecked();
  });
});
