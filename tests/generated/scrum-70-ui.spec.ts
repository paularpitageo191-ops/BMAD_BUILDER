// Traceability
import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements – Negative Path Validation', () => {

  // TC01 – Valid email displays output (positive baseline)
  test('TC01 – Text Box: Valid email displays output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await page.fill('#userEmail', 'valid.email@example.com');
    await page.click('#submit');
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#output')).toContainText('valid.email@example.com');
  });

  // TC02 – Invalid email formats trigger validation error
  test('TC02 – Text Box: Invalid email formats trigger validation error', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    // First invalid email
    await page.fill('#userEmail', 'test@domain');
    await page.click('#submit');
    // Check HTML5 validation state
    await expect(page.locator('#userEmail')).toHaveJSProperty('validationMessage', expect.not.stringContaining(''));
    await expect(page.locator('#output')).toBeHidden();

    // Clear and enter second invalid email
    await page.fill('#userEmail', '');
    await page.fill('#userEmail', 'missingatsymbol.com');
    await page.click('#submit');
    await expect(page.locator('#userEmail')).toHaveJSProperty('validationMessage', expect.not.stringContaining(''));
    await expect(page.locator('#output')).toBeHidden();
  });

  // TC03 – Non-numeric Age blocks submission
  test('TC03 – Web Tables: Non-numeric Age blocks submission', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.waitForSelector('#addNewRecordButton');
    await page.click('#addNewRecordButton');
    await page.waitForSelector('.modal-content');
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'j@d.com');
    await page.fill('#age', 'abc');
    await page.click('#submit');
    // Modal should still be visible
    await expect(page.locator('.modal-content')).toBeVisible();
    // No new row (count rows before and after)
    const rowCountBefore = await page.locator('.rt-tr-group').count();
    await expect(page.locator('.rt-tr-group')).toHaveCount(rowCountBefore);
    // Validation error on age field
    await expect(page.locator('#age')).toHaveJSProperty('validationMessage', expect.not.stringContaining(''));
  });

  // TC04 – Non-numeric Salary blocks submission
  test('TC04 – Web Tables: Non-numeric Salary blocks submission', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.click('#addNewRecordButton');
    await page.waitForSelector('.modal-content');
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'j@d.com');
    await page.fill('#age', '25');
    await page.fill('#salary', 'abc');
    await page.click('#submit');
    await expect(page.locator('.modal-content')).toBeVisible();
    const rowCountBefore = await page.locator('.rt-tr-group').count();
    await expect(page.locator('.rt-tr-group')).toHaveCount(rowCountBefore);
    await expect(page.locator('#salary')).toHaveJSProperty('validationMessage', expect.not.stringContaining(''));
  });

  // TC05 – Both Age and Salary non-numeric blocks submission
  test('TC05 – Web Tables: Both Age and Salary non-numeric blocks submission', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.click('#addNewRecordButton');
    await page.waitForSelector('.modal-content');
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'j@d.com');
    await page.fill('#age', 'abc');
    await page.fill('#salary', '12xy');
    await page.click('#submit');
    await expect(page.locator('.modal-content')).toBeVisible();
    const rowCountBefore = await page.locator('.rt-tr-group').count();
    await expect(page.locator('.rt-tr-group')).toHaveCount(rowCountBefore);
    await expect(page.locator('#age')).toHaveJSProperty('validationMessage', expect.not.stringContaining(''));
    await expect(page.locator('#salary')).toHaveJSProperty('validationMessage', expect.not.stringContaining(''));
  });

  // TC06 – Disabled 'No' radio button does not change state on click
  test('TC06 – Radio Button: Disabled No option does not change state on click', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    await expect(page.locator('#noRadio')).toBeDisabled();
    // Attempt click with force to simulate user attempt
    await page.locator('#noRadio').click({ force: true });
    await expect(page.locator('#noRadio')).toBeDisabled();
    // No success message
    await expect(page.locator('.text-success')).toBeHidden();
    // No radio button indicator changed (check that Yes is not accidentally selected)
    const yesSelected = await page.locator('#yesRadio').isChecked();
    expect(yesSelected).toBe(false);
  });

  // TC07 – Select Yes radio button (positive baseline)
  test('TC07 – Radio Button: Select Yes option works', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    await page.click('label:has-text("Yes")');
    await expect(page.locator('#yesRadio')).toBeChecked();
    await expect(page.locator('.text-success')).toHaveText('You have selected Yes');
  });

  // TC09 – UI Stability: Web Tables remain interactable under scroll after page resize
  test('TC09 – UI Stability: Web Tables remain interactable under scroll after page resize', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('https://demoqa.com/webtables');
    await page.waitForSelector('#addNewRecordButton');
    await page.locator('#addNewRecordButton').scrollIntoViewIfNeeded();
    await page.click('#addNewRecordButton');
    await expect(page.locator('.modal-content')).toBeVisible();
  });

});
