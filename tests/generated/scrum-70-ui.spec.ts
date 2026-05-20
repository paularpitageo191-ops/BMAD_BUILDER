// Traceability
import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements - Negative Path Validation', () => {

  test('Text Box - Invalid email without TLD triggers validation error and suppresses output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('user@domain');
    await submitButton.click();

    // Native HTML5 validation should prevent submission; check validation message
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
    // Output should remain hidden
    await expect(outputSection).not.toBeVisible();
  });

  test('Text Box - Email missing "@" handled as invalid', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('userdomain.com');
    await submitButton.click();

    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toContain('@');
    await expect(outputSection).not.toBeVisible();
  });

  test('Text Box - Empty email triggers required field validation', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('');
    await submitButton.click();

    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
    await expect(outputSection).not.toBeVisible();
  });

  test('Web Tables - Non-numeric age blocks submission', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.locator('#addNewRecordButton').click();
    await page.waitForSelector('.modal-content', { state: 'visible' });

    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const submitButton = page.locator('#submit');

    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('john@example.com');
    await ageInput.fill('abc');
    await salaryInput.fill('50000');
    await page.locator('#department').fill('QA');
    await submitButton.click();

    // Modal should remain open
    await expect(page.locator('.modal-content')).toBeVisible();
    // No new row – verify by checking that search for John Doe yields no results
    await page.locator('#close-modal').click(); // close modal if still open
    const rowCount = await page.locator('.rt-tr-group').count();
    // Since no row was added, count should remain unchanged from initial (assume initial > 0)
    // A more robust check: search for the email and expect zero visible rows
    await page.locator('#searchBox').fill('john@example.com');
    await page.waitForTimeout(500);
    const visibleRows = await page.locator('.rt-tr-group:not(.rt-tr--hidden)').count();
    expect(visibleRows).toBe(0);
  });

  test('Web Tables - Non-numeric salary blocks submission', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.locator('#addNewRecordButton').click();
    await page.waitForSelector('.modal-content', { state: 'visible' });

    await page.locator('#firstName').fill('Jane');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('jane@example.com');
    await page.locator('#age').fill('30');
    await page.locator('#salary').fill('12ab');
    await page.locator('#department').fill('Engineering');
    await page.locator('#submit').click();

    // Modal remains open
    await expect(page.locator('.modal-content')).toBeVisible();

    // No row added
    await page.locator('#close-modal').click();
    await page.locator('#searchBox').fill('jane@example.com');
    await page.waitForTimeout(500);
    const visibleRows = await page.locator('.rt-tr-group:not(.rt-tr--hidden)').count();
    expect(visibleRows).toBe(0);
  });

  test('Web Tables - Empty age and salary fields block submission', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.locator('#addNewRecordButton').click();
    await page.waitForSelector('.modal-content', { state: 'visible' });

    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');

    await page.locator('#firstName').fill('Alice');
    await page.locator('#lastName').fill('Smith');
    await page.locator('#userEmail').fill('alice@example.com');
    await ageInput.fill('');
    await salaryInput.fill('');
    await page.locator('#department').fill('HR');
    await page.locator('#submit').click();

    // Modal remains open
    await expect(page.locator('.modal-content')).toBeVisible();

    // Check that age and salary have validation messages (they are required)
    const ageValidation = await ageInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    const salaryValidation = await salaryInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(ageValidation).toBeTruthy();
    expect(salaryValidation).toBeTruthy();

    // No row added
    await page.locator('#close-modal').click();
    await page.locator('#searchBox').fill('alice@example.com');
    await page.waitForTimeout(500);
    const visibleRows = await page.locator('.rt-tr-group:not(.rt-tr--hidden)').count();
    expect(visibleRows).toBe(0);
  });

  test('Radio Button - Disabled "No" option cannot be interacted with', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    const noRadio = page.locator('#noRadio');
    const output = page.locator('.text-success');

    // Verify disabled state
    await expect(noRadio).toBeDisabled();

    // Attempt to click using label (the input itself is disabled)
    await noRadio.click({ force: true });

    // Still disabled and no output change
    await expect(noRadio).toBeDisabled();
    await expect(output).not.toContainText('No');
  });

  test('Radio Button - Disabled "No" cannot override existing selection', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    const yesRadio = page.locator('#yesRadio');
    const noRadio = page.locator('#noRadio');
    const output = page.locator('.text-success');

    // Select Yes
    await yesRadio.click({ force: true });
    await expect(output).toContainText('Yes');

    // Attempt to click No
    await noRadio.click({ force: true });

    // Yes still selected
    await expect(output).toContainText('Yes');
    // No remains disabled
    await expect(noRadio).toBeDisabled();
  });

  test('UI Stability - Elements interactable under overlay obstruction', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    // Inject a semi-transparent overlay covering the form area
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:30%; background:rgba(0,0,0,0.5); z-index:9999;';
      document.body.appendChild(overlay);
    });

    // Scroll email input into view (it may be under overlay)
    await emailInput.scrollIntoViewIfNeeded();
    await expect(emailInput).toBeVisible();

    await emailInput.fill('valid@example.com');
    await submitButton.click({ force: true });

    // Output should appear for valid input
    await expect(outputSection).toBeVisible();
    await expect(outputSection).toContainText('valid@example.com');
  });

  test('UI Stability - Elements interactable via scrolling when viewport is small', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('https://demoqa.com/elements');

    // Navigate to Text Box via left nav
    await page.locator('text=Text Box').click();
    await page.waitForURL('**/text-box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    await emailInput.fill('test@example.com');
    await submitButton.click();
    await expect(page.locator('#output')).toBeVisible();

    // Navigate to Radio Button via left nav
    await page.locator('text=Radio Button').click();
    await page.waitForURL('**/radio-button');
    const yesRadio = page.locator('#yesRadio');
    await yesRadio.click({ force: true });
    await expect(page.locator('.text-success')).toContainText('Yes');
  });
});
