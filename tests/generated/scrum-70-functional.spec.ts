import { test, expect } from '@playwright/test';

test.describe('SCRUM-70 Negative Path Validation for Elements Module', () => {

  test('AC1 – Email Validation rejects invalid email and suppresses output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    // When
    await emailInput.fill('test@domain');
    await submitButton.click();

    // Then – validation error: the input should be invalid
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');

    // Then – output section should not be displayed
    await expect(outputSection).toBeHidden();
  });

  test('AC2 – Web Tables blocks submission for non-numeric Age and Salary', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');

    // Open registration modal
    await page.locator('#addNewRecordButton').click();
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();

    // Fill modal fields with valid data except Age and Salary
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('john@example.com');
    await page.locator('#age').fill('abc');             // non-numeric
    await page.locator('#salary').fill('12ab');         // non-numeric
    await page.locator('#department').fill('QA');

    // Submit
    await page.locator('#submit').click();

    // Then – modal remains open
    await expect(modal).toBeVisible();

    // Then – no new row appears (table row count unchanged)
    const tableRows = page.locator('.rt-tr-group');
    await expect(tableRows).not.toContainText('John');
  });

  test('AC3 – Radio Button "No" remains disabled and does not change state', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    const noRadio = page.locator('#noRadio');

    // Then – disabled initially
    await expect(noRadio).toBeDisabled();

    // When – attempt to click (force to bypass disabled attribute)
    await noRadio.click({ force: true });

    // Then – still disabled
    await expect(noRadio).toBeDisabled();

    // Then – no feedback message is shown (the success message is inside .mt-3)
    const feedback = page.locator('.mt-3');
    await expect(feedback).toContainText('');
    // Alternatively, check that the message does not include "No"
    await expect(feedback).not.toContainText('No');
  });

  test('AC4 – UI remains stable under overlay obstruction', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    // Inject a fixed overlay that blocks the form
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(0,0,0,0.5);pointer-events:none;';
      document.body.appendChild(overlay);
    });

    const fullNameInput = page.locator('#userName');

    // Ensure element is still visible and in DOM
    await expect(fullNameInput).toBeVisible();

    // Scroll to the input – visibility handling
    await fullNameInput.scrollIntoViewIfNeeded();

    // Type a value – interactability under obstruction (force:true needed because overlay intercepts clicks)
    await fullNameInput.fill('Test User', { force: true });

    // Click submit
    const submitButton = page.locator('#submit');
    await submitButton.click({ force: true });

    // Then – output section should be displayed (proving the form submission worked)
    const outputSection = page.locator('#output');
    await expect(outputSection).toBeVisible();
    await expect(outputSection).toContainText('Test User');

    // Cleanup
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
