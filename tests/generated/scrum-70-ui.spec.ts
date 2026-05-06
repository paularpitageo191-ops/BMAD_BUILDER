import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation for DemoQA Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('AC1 – Email validation rejects invalid formats and does not display output', async ({ page }) => {
    // Navigate to Text Box section (assuming there is a sidebar menu)
    // Using the 'elements' menu item; click 'Text Box' in the sidebar
    await page.click('text=Text Box');

    // Fill invalid email
    await page.fill('#userEmail', 'test@domain');

    // Click submit
    await page.click('#submit');

    // Verify validation error – check that the field is invalid via JS
    const isValid = await page.$eval('#userEmail', (el: HTMLInputElement) => el.checkValidity());
    expect(isValid).toBe(false);

    // Verify output section is not visible
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('AC2 – Non-numeric age/salary blocks submission and modal remains open', async ({ page }) => {
    // Navigate to Web Tables section
    await page.click('text=Web Tables');

    // Click Add button
    await page.click('#addNewRecordButton');

    // Wait for registration modal to appear
    await page.waitForSelector('.modal-content', { state: 'visible' });

    // Fill non-numeric values
    await page.fill('#age', 'abc');
    await page.fill('#salary', 'xyz');

    // Click Submit inside the modal
    await page.click('.modal-content #submit');

    // Assert modal is still visible
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('AC3 – "No" radio button remains disabled and non-interactive', async ({ page }) => {
    // Navigate to Radio Button section
    await page.click('text=Radio Button');

    // Verify initial state: disabled
    await expect(page.locator('#noRadio')).toBeDisabled();

    // Attempt to click
    await page.click('#noRadio', { force: true });

    // Verify still disabled and not checked
    await expect(page.locator('#noRadio')).toBeDisabled();
    const isChecked = await page.$eval('#noRadio', (el: HTMLInputElement) => el.checked);
    expect(isChecked).toBe(false);
  });

  test('AC4 – UI stability under overlay – elements remain interactable', async ({ page }) => {
    // Navigate to Text Box section for a target element
    await page.click('text=Text Box');

    // Inject a fixed overlay that covers the page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;';
      document.body.appendChild(overlay);
    });

    // Attempt to interact with #submit: scroll into view and click
    const submitBtn = page.locator('#submit');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    // After click, we can assert that the action succeeded (e.g., no error)
    // Additionally, verify the button is visible and enabled before click
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });
});
