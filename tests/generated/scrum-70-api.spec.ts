import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation for DemoQA Elements Module - SCRUM-70', () => {
  const baseUrl = 'https://demoqa.com';

  test('AC1: Invalid email triggers validation error and hides output', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('test@domain');
    await submitButton.click();

    // Verify validation error styling (Bootstrap invalid class)
    await expect(emailInput).toHaveClass(/is-invalid/);
    // Verify output section is not visible
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2: Non-numeric age blocks submission - modal stays open', async ({ page }) => {
    await page.goto(`${baseUrl}/webtables`);
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    const ageInput = page.locator('#age');
    await ageInput.fill('abc');

    const submitButton = modal.locator('#submit');
    await submitButton.click();

    // Modal should remain open
    await expect(modal).toBeVisible();
    // Table should not contain the invalid value
    const table = page.locator('.rt-tbody');
    await expect(table).not.toContainText('abc');
  });

  test('AC2: Non-numeric salary blocks submission - modal stays open', async ({ page }) => {
    await page.goto(`${baseUrl}/webtables`);
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    const salaryInput = page.locator('#salary');
    await salaryInput.fill('xyz');

    const submitButton = modal.locator('#submit');
    await submitButton.click();

    await expect(modal).toBeVisible();
    const table = page.locator('.rt-tbody');
    await expect(table).not.toContainText('xyz');
  });

  test('AC3: "No" radio button remains disabled and no state change on click', async ({ page }) => {
    await page.goto(`${baseUrl}/radio-button`);
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // Attempt to click – should have no effect
    await noRadio.click({ force: true }); // force to bypass disabled click rejection
    // Element must still be disabled
    await expect(noRadio).toBeDisabled();
    // No visual change: check that no "active" class is applied (the "Yes" button has class "custom-control-input" but selection state is indicated by label background)
    const noLabel = page.locator('label[for="noRadio"]');
    const activeClassPresent = await noLabel.evaluate(el => el.classList.contains('active'));
    expect(activeClassPresent).toBe(false);
  });

  test('AC4: UI stability under overlay – interaction still possible', async ({ page }) => {
    await page.goto(`${baseUrl}/radio-button`);
    // Add a full‑page overlay via JavaScript
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;pointer-events:none;';
      document.body.appendChild(overlay);
    });

    // Scroll to the "Yes" radio button and make sure it’s visible
    const yesRadio = page.locator('#yesRadio');
    await yesRadio.scrollIntoViewIfNeeded();
    await yesRadio.waitFor({ state: 'visible', timeout: 5000 });

    // Click the "Yes" radio button
    await yesRadio.click();

    // Verify the radio button is selected (text "Yes" appears in result)
    const resultText = page.locator('.text-success');
    await expect(resultText).toHaveText('Yes');

    // Clean up: remove the overlay
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
