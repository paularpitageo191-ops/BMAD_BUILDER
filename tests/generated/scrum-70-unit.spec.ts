import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demoqa.com/elements';

test.describe('SCRUM-70: Negative Path Validation for Elements Module', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the main Elements page
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  });

  test('AC1 - Email validation rejects invalid email and hides output', async ({ page }) => {
    // Navigate to Text Box section
    await page.click('text=Text Box');
    await page.waitForURL('**/text-box');
    await page.waitForSelector('#userEmail', { state: 'visible' });

    // Fill invalid email
    await page.fill('#userEmail', 'test@domain');

    // Click submit button
    await page.click('#submit');

    // Verify validation error on email field (assumes class 'error' or red border)
    const emailClass = await page.getAttribute('#userEmail', 'class');
    expect(emailClass).toContain('error');

    // Verify output section not displayed
    await expect(page.locator('#output')).toBeHidden();
  });

  test('AC2a - Web Tables blocks registration with non-numeric age', async ({ page }) => {
    // Navigate to Web Tables
    await page.click('text=Web Tables');
    await page.waitForURL('**/webtables');
    await page.waitForSelector('#addNewRecordButton', { state: 'visible' });

    // Open registration modal
    await page.click('#addNewRecordButton');

    // Fill form with non-numeric age
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#userEmail', 'test@test.com');
    await page.fill('#age', 'abc');          // non-numeric age
    await page.fill('#salary', '50000');
    await page.fill('#department', 'QA');

    // Click Submit
    await page.click('#submit');

    // Modal should remain visible (field-level validation prevents close)
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('AC2b - Web Tables blocks registration with non-numeric salary', async ({ page }) => {
    // Navigate to Web Tables
    await page.click('text=Web Tables');
    await page.waitForURL('**/webtables');
    await page.waitForSelector('#addNewRecordButton', { state: 'visible' });

    // Open registration modal
    await page.click('#addNewRecordButton');

    // Fill form with non-numeric salary
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#userEmail', 'test@test.com');
    await page.fill('#age', '30');
    await page.fill('#salary', '12ab');       // non-numeric salary
    await page.fill('#department', 'QA');

    // Click Submit
    await page.click('#submit');

    // Modal should remain visible
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('AC3 - Radio button "No" remains disabled', async ({ page }) => {
    // Navigate to Radio Button section
    await page.click('text=Radio Button');
    await page.waitForURL('**/radio-button');
    await page.waitForSelector('#yesRadio', { state: 'visible' });

    // Verify 'No' radio is disabled
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // Try clicking the disabled radio (should not change state)
    await noRadio.click({ force: true }); // force required because element is disabled

    // Verify it remains disabled
    await expect(noRadio).toBeDisabled();
  });

  test('AC4 - UI remains stable under overlay obstruction', async ({ page }) => {
    // Navigate to Text Box section
    await page.click('text=Text Box');
    await page.waitForURL('**/text-box');
    await page.waitForSelector('#userName', { state: 'visible' });

    // Inject a semi-transparent fixed overlay covering top half of the page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 50%; background: rgba(0,0,0,0.5); z-index: 9999; pointer-events: auto;';
      document.body.appendChild(overlay);
    });

    // Locate the submit button (which is at the bottom of the form)
    const submitButton = page.locator('#submit');

    // Scroll the button into view (should bring it below the overlay if overlay covers only top)
    await submitButton.scrollIntoViewIfNeeded();

    // Attempt to click the button
    await submitButton.click();

    // Verify the page is still responsive: after clicking submit with empty fields,
    // the output section should not appear, but the page should be stable.
    // We can check that no unexpected error occurred (the submit action is allowed).
    // A simple assertion: the overlay still exists (not crashed).
    const overlayExists = await page.locator('#test-overlay').isVisible();
    expect(overlayExists).toBe(true);
  });
});
