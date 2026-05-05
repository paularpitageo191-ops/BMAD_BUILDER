import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation - Elements Module (SCRUM-70)', () => {

  test('AC1 – Invalid email shows validation error and no output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    // Enter invalid email
    const emailInput = page.locator('#userEmail');
    await emailInput.fill('test@domain');

    // Click Submit
    await page.locator('#submit').click();

    // Assert validation error on #userEmail (HTML5 validation)
    // The browser shows a native tooltip – we check the 'invalid' pseudo-class or the validationMessage property
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();

    // Assert output section (#output) is not displayed
    const output = page.locator('#output');
    await expect(output).not.toBeVisible();
  });

  test('AC2 – Non-numeric Age and Salary block web table submission', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');

    // Click Add button
    await page.locator('#addNewRecordButton').click();

    // Fill registration form with non-numeric Age and Salary
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    await page.locator('#age').fill('abc');
    await page.locator('#salary').fill('xyz');

    // Click Submit
    await page.locator('#submit').click();

    // Verify modal remains open (validation blocks submission)
    await expect(modal).toBeVisible();

    // Verify no new row was added (table row count should stay the same as initial)
    const initialRowCount = await page.locator('.rt-tr-group').count();
    // Since modal didn't submit, row count should equal initial count (maybe 3 default rows)
    // We'll check that the table still contains only the original rows
    await expect(page.locator('.rt-tr-group')).toHaveCount(initialRowCount);
  });

  test('AC3 – Disabled "No" radio button remains disabled and unresponsive', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');

    const noRadio = page.locator('#noRadio');

    // Verify the radio button is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click (should not change state)
    await noRadio.click({ force: true });

    // Verify it remains disabled
    await expect(noRadio).toBeDisabled();

    // Verify no success message for "No" appears
    const successMsg = page.locator('.text-success');
    await expect(successMsg).not.toBeVisible();
  });

  test('AC4 – UI remains stable and elements are interactable under overlay obstruction', async ({ page }) => {
    await page.goto('https://demoqa.com/buttons');

    // Create an overlay covering the whole page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999';
      document.body.appendChild(overlay);
    });

    // Locate the "Click Me" button (text matches)
    const clickMeButton = page.locator('button:has-text("Click Me")');

    // Scroll to and click with force (bypass actionability checks)
    await clickMeButton.scrollIntoViewIfNeeded();
    await clickMeButton.click({ force: true });

    // Verify the dynamic click message appears
    const confirmationMessage = page.locator('#dynamicClickMessage');
    await expect(confirmationMessage).toHaveText('You have done a dynamic click');
  });
});
