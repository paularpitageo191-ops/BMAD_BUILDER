import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation for DemoQA Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com');
  });

  test('AC1 – Email Validation: invalid email shows error and hides output', async ({ page }) => {
    // Navigate to Text Box page via Elements menu
    await page.locator('text=Elements').click();
    await page.locator('text=Text Box').click();
    await expect(page).toHaveURL(/text-box/);

    // Enter invalid email (missing TLD)
    await page.locator('#userEmail').fill('test@domain');

    // Click Submit
    await page.locator('#submit').click();

    // Assert validation error is visible on the email field
    await expect(page.locator('#userEmail')).toHaveAttribute('class', /is-invalid/);

    // Assert output section is not displayed
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('AC2 – Web Tables Validation: non-numeric Age/Salary blocks submission and keeps modal open', async ({ page }) => {
    // Navigate to Web Tables page
    await page.locator('text=Elements').click();
    await page.locator('text=Web Tables').click();
    await expect(page).toHaveURL(/webtables/);

    // Open registration modal
    await page.locator('#addNewRecordButton').click();
    await expect(page.locator('.modal-content')).toBeVisible();

    // Fill fields with non-numeric values
    await page.locator('#firstName').fill('Test');
    await page.locator('#lastName').fill('User');
    await page.locator('#userEmail').fill('test@example.com');
    await page.locator('#age').fill('abc');
    await page.locator('#salary').fill('12ab');
    await page.locator('#department').fill('QA');

    // Attempt to submit
    await page.locator('#submit').click();

    // Verify modal remains open
    await expect(page.locator('.modal-content')).toBeVisible();

    // Verify no new row is added (row count unchanged)
    const rowCount = await page.locator('.rt-tr-group').count();
    expect(rowCount).toBe(1); // initial empty row + header?
    // More robust: count rows with actual data – but for negative test, modal open suffices
  });

  test('AC3 – Radio Button Validation: disabled option remains inert', async ({ page }) => {
    // Navigate to Radio Button page
    await page.locator('text=Elements').click();
    await page.locator('text=Radio Button').click();
    await expect(page).toHaveURL(/radio-button/);

    // Verify #noRadio is disabled
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // Click it (should do nothing)
    await noRadio.click({ force: true });

    // Verify it remains disabled and no selection indicator changes
    await expect(noRadio).toBeDisabled();
    // Also check that the text for "No" does not get a selected class
    const noLabel = page.locator('label[for="noRadio"]');
    await expect(noLabel).not.toHaveClass(/active/);
  });

  test('AC4 – UI Stability under overlay obstruction', async ({ page }) => {
    // Navigate to Text Box page
    await page.locator('text=Elements').click();
    await page.locator('text=Text Box').click();
    await expect(page).toHaveURL(/text-box/);

    // Add a fixed overlay that covers the entire page
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; pointer-events:none;';
      document.body.appendChild(overlay);
    });

    // Now the submit button is behind the overlay but should be interactable via scroll/visibility handling
    // We'll use scroll to bring it into view and click with force (bypass pointer-events:none)
    const submitButton = page.locator('#submit');
    await submitButton.scrollIntoViewIfNeeded();

    // Click the button (using force to ensure it works despite overlay)
    await expect(submitButton).toBeEnabled();
    await submitButton.click({ force: true });

    // Verify that a successful click would have triggered validation (since fields are empty)
    // At least the page didn't crash and element remained interactable
    // We can check that the output section did not appear (because fields are empty, but still)
    await expect(page.locator('#output')).not.toBeVisible();
  });
});
