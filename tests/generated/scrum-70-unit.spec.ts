import { test, expect } from '@playwright/test';

test.describe('SCRUM-70 Negative Path Validation - Elements Module', () => {

  test('AC1 - Email validation rejects invalid email and hides output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('button:has-text("Submit")');
    const outputDiv = page.locator('#output');

    await emailInput.fill('test@domain');
    await submitButton.click();

    await expect(emailInput).toHaveClass(/.*is-invalid.*/);
    await expect(outputDiv).toBeHidden();
  });

  test('AC2 - Web Tables reject non-numeric Age/Salary', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('.modal-content');

    await modal.locator('#firstName').fill('John');
    await modal.locator('#lastName').fill('Doe');
    await modal.locator('#userEmail').fill('john@example.com');
    await modal.locator('#age').fill('abc');
    await modal.locator('#salary').fill('12ab');
    await modal.locator('#department').fill('Engineering');

    await modal.locator('#submit').click();
    await expect(modal).toBeVisible();
    await expect(modal.locator('#age')).toBeVisible();
  });

  test('AC3 - "No" radio button remains disabled', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    const noRadio = page.locator('#noRadio');

    await expect(noRadio).toBeDisabled();
    await noRadio.click({ force: true });
    await expect(noRadio).toBeDisabled();

    const successMessage = page.locator('.text-success');
    await expect(successMessage).toBeHidden();
  });

  test('AC4 - UI remains stable under overlay obstruction', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

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
      document.body.appendChild(overlay);
    });

    const submitBtn = page.locator('button:has-text("Submit")');
    await submitBtn.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(submitBtn).toBeAttached();
    await expect(page.locator('#userEmail')).toBeVisible();

    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });

});
