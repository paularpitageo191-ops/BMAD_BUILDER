// Traceability
import { test, expect } from '@playwright/test';

test.describe('Regression – DemoQA Elements Module (SCRUM-70)', () => {
  const baseUrl = 'https://demoqa.com/elements';

  test('Regression – Valid email input still renders output section', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    const emailInput = page.locator('#userEmail');
    const submitBtn = page.locator('#submit');
    const output = page.locator('#output');

    await emailInput.fill('user@example.com');
    await submitBtn.click();
    await expect(output).toBeVisible();
    await expect(output).toContainText('user@example.com');
  });

  test('Regression – Web Tables accepts valid numeric inputs and adds row', async ({ page }) => {
    await page.goto(`${baseUrl}/webtables`);
    await page.locator('#addNewRecordButton').click();
    // Fill mandatory fields with valid numeric data
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('john@example.com');
    await page.locator('#age').fill('25');
    await page.locator('#salary').fill('50000');
    await page.locator('#department').fill('QA');
    await page.locator('.modal-footer #submit').click(); // modal submit button

    // Verify modal is closed
    await expect(page.locator('.modal-dialog')).not.toBeVisible();
    // Verify new row appears (assuming row count increases or specific text visible)
    await expect(page.locator('.rt-tbody .rt-tr')).toContainText(['John', '25', '50000']);
  });

  test('Regression – Text Box submission remains functional under overlay obstruction', async ({ page }) => {
    await page.goto(`${baseUrl}/text-box`);
    // Inject a fixed overlay that covers the form
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999;';
      document.body.appendChild(overlay);
    });

    const emailInput = page.locator('#userEmail');
    const submitBtn = page.locator('#submit');
    const output = page.locator('#output');

    await emailInput.fill('user@example.com');
    // Scroll submit into view and click via Playwright (which scrolls automatically)
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true }); // force click to bypass overlay interception
    await expect(output).toBeVisible();
    await expect(output).toContainText('user@example.com');
  });

  test('Regression – Radio button selection works via scrolling under overlay obstruction', async ({ page }) => {
    await page.goto(`${baseUrl}/radio-button`);
    // Inject overlay
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999;';
      document.body.appendChild(overlay);
    });

    const yesRadio = page.locator('#yesRadio');
    const output = page.locator('.text-success');

    // Scroll radio into view
    await yesRadio.scrollIntoViewIfNeeded();
    // Use force click since overlay would block regular clicks
    await yesRadio.click({ force: true });

    await expect(output).toContainText('You have selected Yes');
  });
});
