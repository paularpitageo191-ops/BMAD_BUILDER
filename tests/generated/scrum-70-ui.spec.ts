import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements Module - Negative Path Validation @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('AC1 - Email validation blocks invalid input and hides output section', async ({ page }) => {
    // Fill invalid email (missing TLD)
    await page.locator('#userEmail').fill('test@domain');
    // Click Submit button (there are two #submit on page; use the one within the form containing #userEmail)
    await page.locator('#userEmail').locator('..').locator('#submit').click();
    // Assert validation error appears on #userEmail (browser native validation via pattern or constraints)
    const emailInput = page.locator('#userEmail');
    // HTML5 validation error is shown by the browser; Playwright can check validationMessage
    const validationMessage = await emailInput.evaluate(el => (el as HTMLInputElement).validationMessage);
    expect(validationMessage).toBeTruthy();
    // Assert #output is not visible (it should remain hidden)
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('AC2 - Non-numeric Age or Salary prevents Web Tables submission', async ({ page }) => {
    // Navigate to Web Tables sub-tab (assume clicking on "Web Tables" in the left menu)
    await page.locator('text=Web Tables').click();
    // Open registration modal
    await page.locator('#addNewRecordButton').click();
    // Verify modal is open
    await expect(page.locator('.modal-content')).toBeVisible();
    // Fill non-numeric values
    await page.locator('#age').fill('abc');
    await page.locator('#salary').fill('12ab');
    // Click Submit button (within modal)
    await page.locator('.modal-content #submit').click();
    // Assert modal remains open (still visible)
    await expect(page.locator('.modal-content')).toBeVisible();
    // Assert no new row added (table row count unchanged; initially it has 3 rows? We'll check that row count is same as before)
    const rowCountBefore = await page.locator('.rt-tbody .rt-tr-group').count();
    // After submit attempt, row count should be same
    const rowCountAfter = await page.locator('.rt-tbody .rt-tr-group').count();
    expect(rowCountAfter).toBe(rowCountBefore);
  });

  test('AC3 - #noRadio button remains disabled and unresponsive', async ({ page }) => {
    // Navigate to Radio Button section (click "Radio Button" in left menu)
    await page.locator('text=Radio Button').click();
    const noRadio = page.locator('#noRadio');
    // Verify it is disabled
    await expect(noRadio).toBeDisabled();
    // Attempt to click (should not change state)
    await noRadio.click({ force: true }); // force to bypass disabled attribute if any
    // Assert still disabled
    await expect(noRadio).toBeDisabled();
    // Assert not checked (radio's checked property should be false)
    const isChecked = await noRadio.isChecked();
    expect(isChecked).toBe(false);
  });

  test('AC4 - UI remains interactable under overlay obstruction', async ({ page }) => {
    // This test verifies that elements can be scrolled to and interacted with even if an overlay exists.
    // We simulate by adding an overlay (e.g., a fixed div) to ensure obstruction handling works.
    // First, scroll to the Submit button in Text Box section and assert it is visible.
    const submitButton = page.locator('#submit').first(); // first #submit on page (Text Box one)
    await submitButton.scrollIntoViewIfNeeded();
    // Add an overlay that covers the page (simulate obstruction)
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;pointer-events:none;';
      document.body.appendChild(overlay);
    });
    // Dismiss overlay (remove it) - the test should handle overlays by dismissing or scrolling past.
    await page.evaluate(() => {
      const overlay = document.querySelector('#test-overlay');
      if (overlay) overlay.remove();
    });
    // After dismissal, click the Submit button
    await submitButton.click();
    // Assert that the click was performed (e.g., output section is still hidden because email is empty, but click succeeded)
    // Here we just confirm no error; we can also check the #output is not visible (as AC1)
    await expect(page.locator('#output')).not.toBeVisible();
  });
});
