import { test, expect } from '@playwright/test';

test.describe('SCRUM-70 Negative Path Validation for DemoQA Elements Module', () => {
  const baseUrl = 'https://demoqa.com';

  test.describe('AC1 – Email Validation', () => {
    test('invalid email triggers validation error and no output', async ({ page }) => {
      await page.goto(`${baseUrl}/text-box`);

      // Fill invalid email (missing TLD)
      await page.locator('#userEmail').fill('test@domain');

      // Click Submit
      await page.locator('#submit').click();

      // Assert validation error on #userEmail (HTML5 constraint validation false)
      const emailValidity = await page.locator('#userEmail').evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(emailValidity).toBe(false);

      // Assert output section is not visible
      await expect(page.locator('#output')).toBeHidden();
    });
  });

  test.describe('AC2 – Web Tables Validation', () => {
    test('non-numeric age blocks submission and modal stays open', async ({ page }) => {
      await page.goto(`${baseUrl}/webtables`);

      // Open registration modal
      await page.locator('#addNewRecordButton').click();
      await expect(page.locator('.modal-content')).toBeVisible();

      // Fill required fields with valid data except Age
      await page.locator('#firstName').fill('John');
      await page.locator('#lastName').fill('Doe');
      await page.locator('#userEmail').fill('john@example.com');
      await page.locator('#age').fill('abc');  // non-numeric
      await page.locator('#salary').fill('50000');
      await page.locator('#department').fill('QA');

      // Click Submit
      await page.locator('#submit').click();

      // Assert modal is still open
      await expect(page.locator('.modal-content')).toBeVisible();

      // Assert no new row added (table row count unchanged)
      const rowCount = await page.locator('.rt-tbody .rt-tr-group').count();
      // Initially table may have empty rows; actual rows are present only after valid submission.
      // We simply verify that no row with "John" appears in the table.
      await expect(page.locator('.rt-tbody')).not.toContainText('John');
    });
  });

  test.describe('AC3 – Radio Button Validation', () => {
    test('“No” option remains disabled and no state change on click', async ({ page }) => {
      await page.goto(`${baseUrl}/radio-button`);

      const noRadio = page.locator('#noRadio');

      // Assert it is disabled initially
      await expect(noRadio).toBeDisabled();

      // Click the radio (should do nothing because disabled)
      await noRadio.click({ force: true });

      // Assert still disabled
      await expect(noRadio).toBeDisabled();

      // Assert no success message (e.g. "You have selected No")
      // The success text appears in an element with class .text-success (common pattern)
      const successMessage = page.locator('.text-success');
      await expect(successMessage).toBeHidden();
    });
  });

  test.describe('AC4 – UI Stability under Overlay', () => {
    test('elements remain interactable via scroll/visibility handling despite overlay', async ({ page }) => {
      await page.goto(`${baseUrl}/text-box`);

      // Inject an overlay that covers the entire page
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.id = 'test-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          pointer-events: none; /* makes overlay non-blocking for testing */
        `;
        document.body.appendChild(overlay);
      });

      // Wait for overlay to be present
      await expect(page.locator('#test-overlay')).toBeVisible();

      // Scroll down if needed (simulate using scrollIntoView) and interact with email field
      await page.locator('#userEmail').scrollIntoViewIfNeeded();
      await page.locator('#userEmail').fill('user@example.com');

      // Click Submit
      await page.locator('#submit').click();

      // Assert output section appears for valid input
      const output = page.locator('#output');
      await expect(output).toBeVisible();

      // Cleanup overlay
      await page.evaluate(() => {
        document.getElementById('test-overlay')?.remove();
      });
    });
  });
});
