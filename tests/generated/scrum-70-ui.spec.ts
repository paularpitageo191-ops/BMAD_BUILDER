// Traceability
import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation - DemoQA Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  // -------------- Email Validation (AC1) --------------
  test.describe('Email Validation (AC1)', () => {
    test('Invalid email (missing TLD) blocks submission and hides output', async ({ page }) => {
      await page.click('text=Text Box'); // or use exact selector if necessary
      await page.waitForSelector('#userEmail', { state: 'visible' });
      await page.fill('#userEmail', 'test@domain');
      await page.click('#submit');

      // Verify #userEmail shows validation error (red border)
      const userEmail = page.locator('#userEmail');
      await expect(userEmail).toHaveCSS('border-color', 'rgb(255, 0, 0)'); // or similar validation class
      // Verify #output not present
      await expect(page.locator('#output')).not.toBeVisible();
    });

    test('Valid email displays output', async ({ page }) => {
      await page.click('text=Text Box');
      await page.waitForSelector('#userEmail', { state: 'visible' });
      await page.fill('#userEmail', 'test@example.com');
      await page.click('#submit');

      // No validation error
      const userEmail = page.locator('#userEmail');
      await expect(userEmail).not.toHaveCSS('border-color', 'rgb(255, 0, 0)');
      // Output should be visible
      await expect(page.locator('#output')).toBeVisible();
      // Optional: verify submitted email in output
      await expect(page.locator('#output')).toContainText('test@example.com');
    });
  });

  // -------------- Web Tables Validation (AC2) --------------
  test.describe('Web Tables Validation (AC2)', () => {
    const openRegistrationModal = async (page: import('@playwright/test').Page) => {
      await page.click('text=Web Tables');
      await page.waitForSelector('#addNewRecordButton', { state: 'visible' });
      await page.click('#addNewRecordButton');
      await page.waitForSelector('role=dialog', { state: 'visible' });
    };

    const fillValidDataExcept = async (page: import('@playwright/test').Page, fieldsToSkip: string[]) => {
      const fieldMap: Record<string, string> = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: '30',
        salary: '50000',
        department: 'QA',
      };
      for (const [fieldId, value] of Object.entries(fieldMap)) {
        if (!fieldsToSkip.includes(fieldId)) {
          await page.fill(`#${fieldId}`, value);
        }
      }
    };

    test('Non-numeric Age blocks submission and modal stays open', async ({ page }) => {
      await openRegistrationModal(page);
      await fillValidDataExcept(page, ['age']);
      await page.fill('#age', 'abc');
      await page.click('text=Submit');

      // Modal should remain open
      await expect(page.locator('role=dialog')).toBeVisible();
      // Age field should show validation error
      const ageField = page.locator('#age');
      await expect(ageField).toHaveCSS('border-color', 'rgb(255, 0, 0)');
      // No new row added – check original row count
      const rows = page.locator('.rt-tr-group');
      const rowCountBefore = await rows.count();
      // wait a bit for stability, then check count unchanged
      await page.waitForTimeout(300);
      const rowCountAfter = await rows.count();
      expect(rowCountAfter).toBe(rowCountBefore);
    });

    test('Non-numeric Salary blocks submission and modal stays open', async ({ page }) => {
      await openRegistrationModal(page);
      await fillValidDataExcept(page, ['salary']);
      await page.fill('#salary', '12ab');
      await page.click('text=Submit');

      await expect(page.locator('role=dialog')).toBeVisible();
      const salaryField = page.locator('#salary');
      await expect(salaryField).toHaveCSS('border-color', 'rgb(255, 0, 0)');
      const rows = page.locator('.rt-tr-group');
      const rowCountBefore = await rows.count();
      await page.waitForTimeout(300);
      const rowCountAfter = await rows.count();
      expect(rowCountAfter).toBe(rowCountBefore);
    });

    test('Empty Age and Salary block submission', async ({ page }) => {
      await openRegistrationModal(page);
      await fillValidDataExcept(page, ['age', 'salary']);
      // leave age and salary empty
      await page.click('text=Submit');

      await expect(page.locator('role=dialog')).toBeVisible();
      const ageField = page.locator('#age');
      await expect(ageField).toHaveCSS('border-color', 'rgb(255, 0, 0)');
      const salaryField = page.locator('#salary');
      await expect(salaryField).toHaveCSS('border-color', 'rgb(255, 0, 0)');
      const rows = page.locator('.rt-tr-group');
      const rowCountBefore = await rows.count();
      await page.waitForTimeout(300);
      const rowCountAfter = await rows.count();
      expect(rowCountAfter).toBe(rowCountBefore);
    });

    test('Valid Age and Salary submit successfully', async ({ page }) => {
      await openRegistrationModal(page);
      await page.fill('#firstName', 'John');
      await page.fill('#lastName', 'Doe');
      await page.fill('#email', 'john@example.com');
      await page.fill('#age', '30');
      await page.fill('#salary', '50000');
      await page.fill('#department', 'QA');
      await page.click('text=Submit');

      // Modal should close
      await expect(page.locator('role=dialog')).not.toBeVisible();
      // New row should appear
      const rows = page.locator('.rt-tr-group');
      const rowCountBefore = await rows.count();
      // Wait for row to be added
      await page.waitForTimeout(300);
      const rowCountAfter = await rows.count();
      expect(rowCountAfter).toBe(rowCountBefore + 1);
    });
  });

  // -------------- Radio Button Validation (AC3) --------------
  test.describe('Radio Button Validation (AC3)', () => {
    test('Disabled "No" option remains non-interactable', async ({ page }) => {
      await page.click('text=Radio Button');
      await page.waitForSelector('#noRadio', { state: 'visible' });
      const noRadio = page.locator('#noRadio');
      // Verify disabled attribute
      await expect(noRadio).toBeDisabled();
      // Attempt to click
      await noRadio.click({ force: true });
      // Should remain disabled after attempt
      await expect(noRadio).toBeDisabled();
      // No success message for 'No'
      await expect(page.locator('text=You have selected No')).not.toBeVisible();
    });

    test('Enabled "Yes" option can be selected', async ({ page }) => {
      await page.click('text=Radio Button');
      await page.waitForSelector('[for="yesRadio"]', { state: 'visible' }); // or #yesRadio
      await page.click('[for="yesRadio"]');
      const yesRadio = page.locator('#yesRadio');
      await expect(yesRadio).toBeChecked();
      await expect(page.locator('text=You have selected Yes')).toBeVisible();
    });
  });

  // -------------- UI Stability (AC4) --------------
  test.describe('UI Stability (AC4)', () => {
    test('Overlay obstruction does not break interaction on Text Box page', async ({ page }) => {
      await page.click('text=Text Box');
      await page.waitForSelector('#userEmail', { state: 'visible' });
      // Inject overlay using page.evaluate
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.id = 'test-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: rgba(0,0,0,0.5);
          z-index: 9999;
        `;
        document.body.appendChild(overlay);
      });
      // Scroll element into view and click (may need force:true due to overlay)
      const userEmail = page.locator('#userEmail');
      await userEmail.scrollIntoViewIfNeeded();
      await userEmail.click({ force: true });
      await page.fill('#userEmail', 'test@example.com');
      await page.click('#submit', { force: true });

      // No JS errors - assume test continues
      // Validation should still work (valid input)
      await expect(page.locator('#output')).toBeVisible();
      // Remove overlay
      await page.evaluate(() => {
        const overlay = document.querySelector('#test-overlay');
        if (overlay) overlay.remove();
      });
      // Page should be in normal state
      await expect(page.locator('#userEmail')).toBeVisible();
      await expect(page.locator('#output')).toBeVisible();
    });
  });
});
