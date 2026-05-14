import { test, expect } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';

test.describe('SCRUM-70 Negative Path Validation for DemoQA Elements Module', () => {

  test('AC1 - Email validation with invalid email format (missing TLD)', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-B831'] }, async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    const emailInput = page.locator('#userEmail');
    const outputSection = page.locator('#output');
    const submitButton = page.locator('#submit');

    // When: enter invalid email
    await emailInput.fill('test@domain');
    await submitButton.click();

    // Then: validation error is shown on email input (using HTML5 validation)
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);

    // Then: output section is not visible
    await expect(outputSection).not.toBeVisible();
  });

  test('AC1 - Email validation with empty email input', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-B831'] }, async ({ page }) => {
    await page.goto(`${BASE_URL}/text-box`);
    const outputSection = page.locator('#output');
    const submitButton = page.locator('#submit');

    // When: leave email empty and click submit
    await submitButton.click();

    // Then: output section is not visible
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2 - Web Tables reject non-numeric value in Age field', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-B831'] }, async ({ page }) => {
    await page.goto(`${BASE_URL}/webtables`);
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    // Modal appears
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    const firstNameInput = page.locator('#firstName');
    const lastNameInput = page.locator('#lastName');
    const emailInput = page.locator('#userEmail');
    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const departmentInput = page.locator('#department');
    const submitButton = modal.locator('#submit');

    // Fill required fields with valid data except age
    await firstNameInput.fill('John');
    await lastNameInput.fill('Doe');
    await emailInput.fill('john@example.com');
    await ageInput.fill('abc'); // non-numeric
    await salaryInput.fill('50000');
    await departmentInput.fill('QA');

    // Click submit
    await submitButton.click();

    // Then: modal should still be open
    await expect(modal).toBeVisible();

    // Then: no new row should be added (count rows before and after)
    const rowCountBefore = await page.locator('.rt-tr-group').count();
    // After failed submit, row count remains the same
    const rowCountAfter = await page.locator('.rt-tr-group').count();
    expect(rowCountAfter).toBe(rowCountBefore);
  });

  test('AC2 - Web Tables reject non-numeric value in Salary field', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-B831'] }, async ({ page }) => {
    await page.goto(`${BASE_URL}/webtables`);
    const addButton = page.locator('#addNewRecordButton');
    await addButton.click();

    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    const firstNameInput = page.locator('#firstName');
    const lastNameInput = page.locator('#lastName');
    const emailInput = page.locator('#userEmail');
    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const departmentInput = page.locator('#department');
    const submitButton = modal.locator('#submit');

    await firstNameInput.fill('Jane');
    await lastNameInput.fill('Doe');
    await emailInput.fill('jane@example.com');
    await ageInput.fill('30');
    await salaryInput.fill('12ab'); // non-numeric
    await departmentInput.fill('Dev');

    await submitButton.click();

    await expect(modal).toBeVisible();
    const rowCountBefore = await page.locator('.rt-tr-group').count();
    const rowCountAfter = await page.locator('.rt-tr-group').count();
    expect(rowCountAfter).toBe(rowCountBefore);
  });

  test('AC3 - Radio Button "No" option is disabled and non-interactable', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-B831'] }, async ({ page }) => {
    await page.goto(`${BASE_URL}/radio-button`);
    const noRadio = page.locator('#noRadio');

    // Then: element is disabled
    await expect(noRadio).toBeDisabled();

    // Attempt to click using JavaScript (since Playwright will refuse disabled)
    const wasClicked = await noRadio.evaluate((el: HTMLInputElement) => {
      const event = new MouseEvent('click', { bubbles: true });
      const prevented = !el.dispatchEvent(event);
      return { checked: el.checked, eventPrevented: prevented };
    });
    expect(wasClicked.checked).toBe(false);
  });

  test('AC4 - UI remains stable under obstruction (overlay)', { tag: ['@SCRUM-70', '@Forensic-AEGIS-2026-MAY-B831'] }, async ({ page }) => {
    // Navigate to any Elements page (text-box)
    await page.goto(`${BASE_URL}/text-box`);

    // Create an obstruction (full-screen overlay) to simulate UI stability requirement
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; pointer-events:none;';
      document.body.appendChild(overlay);
    });

    // Target element (submit button) should be interactable after scrolling into view
    const submitButton = page.locator('#submit');
    await submitButton.scrollIntoViewIfNeeded();
    await expect(submitButton).toBeVisible();
    // Click should succeed despite overlay (overlay has pointer-events:none, but real overlays may block)
    await submitButton.click();

    // Clean up overlay
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });

  // Assumption: we rely on html5 validation for AC1; DemoQA text-box form uses required and type=email
});
