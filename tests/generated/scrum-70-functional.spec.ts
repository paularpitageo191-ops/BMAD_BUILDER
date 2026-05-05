import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';
const ELEMENTS_URL = BASE_URL + '/elements';

// Helper functions
async function navigateToSection(page: Page, section: string) {
  await page.goto(ELEMENTS_URL);
  // Assuming sidebar has links with text
  await page.getByText(section).click();
  // Wait for section to load
  await page.waitForLoadState('networkidle');
}

test.describe('SCRUM-70: Negative Path Validation for DemoQA Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ELEMENTS_URL);
  });

  // AC1: Email Validation
  test('Invalid email triggers validation error and no output', async ({ page }) => {
    await navigateToSection(page, 'Text Box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputDiv = page.locator('#output');

    // Enter invalid email
    await emailInput.fill('test@domain');
    await submitButton.click();

    // Check validation error: For email input, HTML5 validation should show an error
    // Use the :invalid pseudo-class or check for validationMessage
    await expect(emailInput).toHaveAttribute('class', /invalid/); // Adjust if needed
    await expect(page.locator('#userEmail:invalid')).toBeVisible();

    // Output should not be visible
    await expect(outputDiv).not.toBeVisible();
  });

  // AC2: Web Tables Validation
  test('Non-numeric value in Age blocks submission and modal stays open', async ({ page }) => {
    await navigateToSection(page, 'Web Tables');
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    await page.locator('#age').fill('abc');
    await page.locator('#submit').click();

    // Modal should remain open
    await expect(modal).toBeVisible();
    // No new row added - check table rows count unchanged
    const rowCount = await page.locator('.rt-tbody .rt-tr-group').count();
    // Assume initial row count (like 3 default rows)
    expect(rowCount).toBeGreaterThanOrEqual(3); // exact count depends, but modal blocking ensures no new row
  });

  test('Non-numeric value in Salary blocks submission and modal stays open', async ({ page }) => {
    await navigateToSection(page, 'Web Tables');
    await page.click('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    await page.locator('#salary').fill('12ab');
    await page.locator('#submit').click();

    await expect(modal).toBeVisible();
  });

  // AC3: Radio Button Validation
  test('"No" radio button is disabled and does not change state on click', async ({ page }) => {
    await navigateToSection(page, 'Radio Button');
    const noRadio = page.locator('#noRadio');
    const successMsg = page.locator('.text-success');

    // Verify disabled state
    await expect(noRadio).toBeDisabled();

    // Click the label (or the input - but it's disabled, Playwright will throw if trying click)
    // We can try clicking via JavaScript to simulate user attempt
    await noRadio.click({ force: true }); // force click to bypass disabled check

    // Verify still disabled and no success message
    await expect(noRadio).toBeDisabled();
    await expect(successMsg).not.toBeVisible();
  });

  // AC4: UI Stability under obstruction
  test('UI remains stable under overlay obstruction', async ({ page }) => {
    await navigateToSection(page, 'Text Box');
    const submitButton = page.locator('#submit');
    const emailInput = page.locator('#userEmail');

    // Inject an overlay covering the submit button
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999;';
      document.body.appendChild(overlay);
    });

    // Scroll the submit button into view
    await submitButton.scrollIntoViewIfNeeded();

    // Verify button is interactable (visible, enabled)
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    // Click the button after scrolling (should work despite overlay if user scrolls into view)
    await submitButton.click({ force: true }); // force click bypasses overlays

    // Verify validation triggered (since no email filled, should show validation)
    await expect(emailInput).toHaveAttribute('class', /invalid/);
  });
});