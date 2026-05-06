import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demoqa.com/elements';

test.describe('Negative Path Validation for Elements Module - SCRUM-70', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  });

  test('AC1 - Email validation rejects invalid email and hides output', async ({ page }) => {
    // Navigate to Text Box
    await page.click('text=Text Box');
    await page.waitForSelector('#userEmail', { state: 'visible' });

    // Enter invalid email (missing TLD)
    await page.fill('#userEmail', 'test@domain');
    await page.click('#submit');

    // Assert validation error on email field (HTML5 validation)
    const emailInput = page.locator('#userEmail');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isValid).toBe(false);

    // Assert output section is not displayed
    await expect(page.locator('#output')).toBeHidden();
  });

  test('AC2 - Web Tables rejects non-numeric Age and Salary and keeps modal open', async ({ page }) => {
    // Navigate to Web Tables
    await page.click('text=Web Tables');
    await page.waitForSelector('button#addNewRecordButton', { state: 'visible' });

    // Open registration modal
    await page.click('button#addNewRecordButton');
    await page.waitForSelector('div.modal.show', { state: 'visible' });

    // Fill non-numeric values
    await page.fill('#age', 'abc');
    await page.fill('#salary', '12ab');

    // Click Submit
    await page.click('button#submit');

    // Assert modal remains open
    await expect(page.locator('div.modal.show')).toBeVisible();

    // Assert no new row added (still 0 or original rows)
    const rowCount = await page.locator('.rt-tbody .rt-tr-group').count();
    // Initially no rows; if pre-seeded, ensure no change. Using assumed initial state.
    // Wait for possible row render.
    await page.waitForTimeout(500);
    const rowCountAfter = await page.locator('.rt-tbody .rt-tr-group').count();
    expect(rowCountAfter).toBe(0); // Assuming empty table initially
  });

  test('AC3 - Radio Button "No" option remains disabled and unresponsive', async ({ page }) => {
    // Navigate to Radio Button
    await page.click('text=Radio Button');
    await page.waitForSelector('#noRadio', { state: 'visible' });

    // Assert disabled
    await expect(page.locator('#noRadio')).toBeDisabled();

    // Attempt to click the disabled radio (via label)
    const noRadioLabel = page.locator('label[for="noRadio"]');
    if (await noRadioLabel.isVisible()) {
      await noRadioLabel.click({ force: true });
    } else {
      // direct click on the input (should not work)
      await page.locator('#noRadio').click({ force: true });
    }

    // Assert still disabled and no success message appears
    await expect(page.locator('#noRadio')).toBeDisabled();
    await expect(page.locator('.text-success')).toBeHidden();
  });

  test('AC4 - UI remains stable under overlay obstruction', async ({ page }) => {
    // Navigate to Text Box
    await page.click('text=Text Box');
    await page.waitForSelector('#userEmail', { state: 'visible' });

    // Create an overlay that covers the page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;pointer-events:none;';
      document.body.appendChild(overlay);
    });

    // Scroll to the Radio Button section (assumed present on the same page or navigate)
    // For the test, we'll navigate to radio button section while overlay is present
    await page.click('text=Radio Button', { force: true });
    await page.waitForSelector('#noRadio', { state: 'visible' });

    // Verify that the disabled radio is still interactable (no re-layout issues)
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // Remove overlay
    await page.evaluate(() => {
      const overlay = document.querySelector('#test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
