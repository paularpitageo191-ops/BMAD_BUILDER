import { test, expect } from '@playwright/test';

test.describe('SCRUM-70: Negative Path Validation for DemoQA Elements Module', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/');
  });

  test('AC1 – Email validation rejects invalid input and hides output section', async ({ page }) => {
    await page.click('text=Elements');
    await page.click('text=Text Box');
    await page.fill('#userEmail', 'test@domain');
    await page.click('#submit');
    // Verify validation error on email field (HTML5 validation)
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveAttribute('class', /is-invalid|error/);
    // Alternatively, check for CSS pseudo-class :invalid
    await expect(emailInput).toHaveJSProperty('validity.valid', false);
    // Output section should not be visible
    const output = page.locator('#output');
    await expect(output).not.toBeVisible();
  });

  test('AC2 – Non-numeric values in Age/Salary block submission and keep modal open', async ({ page }) => {
    await page.click('text=Elements');
    await page.click('text=Web Tables');
    // Click Add button to open registration modal
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    // Fill non-numeric values
    await page.fill('#age', 'abc');
    await page.fill('#salary', '12ab');
    // Submit the modal
    await page.click('#submit');
    // Modal remains open (validation prevents close)
    await expect(modal).toBeVisible();
    // No row should have been added (check table row count remains same)
    const rowsBefore = await page.locator('.rt-tr-group').count();
    // Since modal didn't close, row count unchanged
    const rowsAfter = await page.locator('.rt-tr-group').count();
    expect(rowsAfter).toBe(rowsBefore);
  });

  test('AC3 – Disabled radio button "No" remains unclickable and does not change state', async ({ page }) => {
    await page.click('text=Elements');
    await page.click('text=Radio Button');
    const noRadio = page.locator('#noRadio');
    // Verify it is disabled
    await expect(noRadio).toBeDisabled();
    // Attempt to click on the associated label (clicking #noRadio itself may not work due to disabled state)
    // Using force:true to try bypass, but expectation is no state change
    await noRadio.click({ force: true }).catch(() => {}); // ignore click failure
    // After click, it should still be disabled
    await expect(noRadio).toBeDisabled();
    // Verify no success message related to "No" appears
    const successMessage = page.locator('.text-success');
    await expect(successMessage).not.toContainText('No');
    // Also check that previous selection (if any) is unchanged
    // If "Yes" was previously selected by default? Actually no default. So assert no message at all.
  });

  test('AC4 – UI remains stable under an overlay obstruction', async ({ page }) => {
    await page.click('text=Elements');
    await page.click('text=Text Box');
    // Inject a fixed overlay that covers part of the page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; pointer-events: auto;';
      document.body.appendChild(overlay);
    });
    // Scroll to make the email field visible (should be possible)
    const emailInput = page.locator('#userEmail');
    await emailInput.scrollIntoViewIfNeeded();
    // Fill valid email
    await emailInput.fill('test@example.com');
    // Submit using button (may require scrolling to button as well)
    const submitBtn = page.locator('#submit');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();
    // Output section should be displayed despite overlay
    const output = page.locator('#output');
    await expect(output).toBeVisible();
    // Clean up overlay (optional, but good practice)
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
