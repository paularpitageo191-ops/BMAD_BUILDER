import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';

test.beforeAll(async ({ browser }) => {
  // Ensure the base page loads correctly; subsequent tests will navigate individually
  const page = await browser.newPage();
  await page.goto(BASE_URL);
  await expect(page.locator('body')).toBeVisible();
  await page.close();
});

test.describe('SCRUM-70: Negative Path Validation for Elements Module', () => {

  test('AC1 – Email Validation: invalid email triggers validation error and no output', async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    await page.waitForSelector('#userEmail');

    // Fill invalid email (missing TLD)
    const invalidEmail = 'test@domain';
    await page.fill('#userEmail', invalidEmail);

    // Click submit button
    await page.click('#submit');

    // Assert that email input is invalid (HTML5 validation)
    const isInvalid = await page.evaluate(() => {
      const el = document.querySelector('#userEmail') as HTMLInputElement;
      return el && !el.validity.valid;
    });
    expect(isInvalid).toBe(true);

    // Assert that output section is not displayed
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('AC2 – Web Tables Validation: non-numeric Age/Salary blocks submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/webtables`);
    await page.waitForSelector('#addNewRecordButton');

    // Open registration form modal
    await page.click('#addNewRecordButton');
    await expect(page.locator('.modal-content')).toBeVisible();

    // Fill fields with non-numeric values for Age and Salary
    await page.fill('#age', 'abc');
    await page.fill('#salary', '12ab');
    // Fill other required fields to ensure form can attempt submission
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#userEmail', 'test@example.com');
    await page.fill('#department', 'QA');

    // Click Submit button
    await page.click('#submit');

    // Assert that modal remains open (submission blocked)
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('AC3 – Radio Button Validation: "No" option remains disabled', async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);
    await page.waitForSelector('#noRadio');

    // Verify "No" radio button is disabled initially
    await expect(page.locator('#noRadio')).toBeDisabled();

    // Attempt to click the disabled radio button using force to simulate user action
    await page.click('#noRadio', { force: true });

    // Assert the radio button remains disabled after attempted click
    await expect(page.locator('#noRadio')).toBeDisabled();

    // Assert that no state change occurred (e.g., no success message for "No")
    await expect(page.locator('.text-success')).not.toContainText('No');
  });

  test('AC4 – UI Stability under obstruction: elements remain interactable', async ({ page }) => {
    await page.goto(`${BASE_URL}/elements`);
    await page.waitForSelector('body');

    // Introduce an overlay covering the page to simulate obstruction
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999;';
      document.body.appendChild(overlay);
    });

    // Select a target element further down the page (e.g., "Text Box" card)
    const targetCard = page.locator('.card:has-text("Text Box")').first();
    await targetCard.scrollIntoViewIfNeeded();

    // Attempt to click the target element – should still be interactable
    await targetCard.click();

    // Verify that the page navigated to the text box page (or at least that no error occurred)
    await expect(page).toHaveURL(/\/text-box/);
  });
});
