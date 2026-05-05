import { test, expect } from '@playwright/test';

test.describe('Elements Negative Path Validation - SCRUM-70', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  // AC1 – Email Validation
  test('AC1 – Email Validation triggers error and hides output', async ({ page }) => {
    // Given I am on the Text Box page
    await page.click('text=Text Box');
    await page.waitForSelector('#userEmail');

    // When I enter an invalid email
    const invalidEmail = 'test@domain';
    await page.fill('#userEmail', invalidEmail);
    await page.click('#submit'); // Click submit to trigger validation

    // Then validation error is visible on #userEmail
    // Bootstrap adds class 'is-invalid' on invalid fields
    await expect(page.locator('#userEmail')).toHaveClass(/is-invalid/);
    // And #output is not displayed
    await expect(page.locator('#output')).toBeHidden();
  });

  // AC2 – Web Tables reject non-numeric Age/Salary
  test('AC2 – Web Tables reject non-numeric Age/Salary', async ({ page }) => {
    // Given I open the Web Tables registration form
    await page.click('text=Web Tables');
    await page.click('#addNewRecordButton'); // Opens registration modal
    await page.waitForSelector('.modal-content', { state: 'visible' });

    // When I enter non-numeric values
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'j@d.com');
    await page.fill('#age', 'abc');
    await page.fill('#salary', '12ab');
    await page.fill('#department', 'QA');

    // And click Submit
    await page.click('#submit');

    // Then the modal remains open
    await expect(page.locator('.modal-content')).toBeVisible();
    // And the fields still contain invalid values
    await expect(page.locator('#age')).toHaveValue('abc');
    await expect(page.locator('#salary')).toHaveValue('12ab');
  });

  // AC3 – Radio Button "No" remains disabled
  test('AC3 – Radio Button "No" remains disabled', async ({ page }) => {
    // Given I navigate to Radio Button section
    await page.click('text=Radio Button');
    await page.waitForSelector('#noRadio');

    // Then the "No" option is disabled
    await expect(page.locator('#noRadio')).toBeDisabled();

    // When I click on the "No" option
    await page.click('label[for="noRadio"]'); // Click associated label

    // Then no state change – still disabled
    await expect(page.locator('#noRadio')).toBeDisabled();
    // Result text (if any) should remain unchanged
    const resultText = await page.locator('.text-success').textContent();
    expect(resultText).toBeNull(); // No success message for disabled option
  });

  // AC4 – UI Stability under overlay obstruction
  test('AC4 – UI Stability under overlay obstruction', async ({ page }) => {
    // Given I am on Radio Button section
    await page.click('text=Radio Button');
    await page.waitForSelector('#yesRadio');

    // When I inject a fixed overlay
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; pointer-events:none;';
      document.body.appendChild(overlay);
    });
    // Ensure overlay is present
    await expect(page.locator('#test-overlay')).toBeVisible();

    // Then I can still interact with "Yes" radio button after scrolling/visibility handling
    const yesRadio = page.locator('#yesRadio');
    await yesRadio.scrollIntoViewIfNeeded();
    await yesRadio.click({ force: true }); // Use force to bypass pointer-events: none

    // And the radio button selection changes correctly
    await expect(page.locator('#yesRadio')).toBeChecked();
    // And overlay is still present (page not broken)
    await expect(page.locator('#test-overlay')).toBeVisible();
  });
});
