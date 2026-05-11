import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation - Elements Module (SCRUM-70)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com');
  });

  test('AC1 – Invalid email shows validation error and no output', async ({ page }) => {
    await page.click('text=Elements');
    await page.click('text=Text Box');
    await page.waitForSelector('#userEmail');

    const invalidEmails = ['test@domain', 'user@.com', '@domain.com', 'email@domain,com'];

    for (const email of invalidEmails) {
      await page.fill('#userEmail', email);
      await page.click('#submit');
      // verify validation error is shown (CSS pseudo-class or 'is-invalid' class)
      await expect(page.locator('#userEmail')).toHaveClass(/is-invalid/);
      // verify output section is not visible
      await expect(page.locator('#output')).not.toBeVisible();
    }
  });

  test('AC2 – Non-numeric Age/Salary blocks submission and modal stays open', async ({ page }) => {
    await page.click('text=Elements');
    await page.click('text=Web Tables');
    await page.click('#addNewRecordButton');
    await page.waitForSelector('#registration-form-modal', { state: 'visible' });

    const testCases = [
      { age: 'abc', salary: '12ab' },
      { age: '12ab', salary: '50000' },
      { age: '25', salary: 'abc' }
    ];

    for (const { age, salary } of testCases) {
      // Fill all required fields with some valid default for non-tested fields
      await page.fill('#firstName', 'Test');
      await page.fill('#lastName', 'User');
      await page.fill('#userEmail', 'test@example.com');
      await page.fill('#age', age);
      await page.fill('#salary', salary);
      await page.fill('#department', 'QA');
      await page.click('#submit');

      // modal should still be open
      await expect(page.locator('#registration-form-modal')).toBeVisible();
    }
  });

  test('AC3 – Disabled "No" radio button does not change state when clicked', async ({ page }) => {
    await page.click('text=Elements');
    await page.click('text=Radio Button');
    await page.waitForSelector('#noRadio');

    const noRadio = page.locator('#noRadio');
    // verify it is disabled
    await expect(noRadio).toBeDisabled();

    // attempt to click (Playwright will throw if element is disabled, so we use force: true)
    await noRadio.click({ force: true });

    // state must remain unchanged – still disabled
    await expect(noRadio).toBeDisabled();
    // and not selected (checked)
    await expect(noRadio).not.toBeChecked();
  });

  test('AC4 – UI remains stable and elements interactable under overlay obstruction', async ({ page }) => {
    await page.click('text=Elements');
    await page.click('text=Text Box');
    await page.waitForSelector('#userName');

    // Create a fixed overlay that covers the entire viewport
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999;';
      document.body.appendChild(overlay);
    });

    // Interact with the full name input field
    const nameInput = page.locator('#userName');
    await nameInput.scrollIntoViewIfNeeded();
    await nameInput.click();
    await nameInput.fill('Stability Test');

    // Verify the input still works
    await expect(nameInput).toHaveValue('Stability Test');

    // Cleanup overlay
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });
});
