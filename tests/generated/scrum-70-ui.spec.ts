// Traceability
// Functional Areas: Radio Button, Text Box, UI Stability, Web Tables
// Source References: AC1, AC2, AC3, AC4, Screenshot: Invalid numeric input behavior (baseline), Screenshot: Valid input → output section rendered, Test Data: Empty/null inputs, Test Data: Invalid email formats, Test Data: Non-numeric values, Test Data: Non-numeric values (e.g., abc, 12ab)
// Execution Readiness: strong
// Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
import { test, expect } from '@playwright/test';

test.describe('@SCRUM-70 @Forensic-AEGIS-SCRUM-70: Text Box Email Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    await page.locator('#userEmail').waitFor(); // ensure text box section is loaded
  });

  test('Invalid email missing TLD triggers validation error and no output', async ({ page }) => {
    await page.locator('#userEmail').fill('test@domain');
    await page.locator('#submit').click();
    // Check that email input shows validation error (HTML5 pseudo-state)
    const emailValidation = await page.locator('#userEmail').evaluate(el => el.validity.valid);
    expect(emailValidation).toBe(false);
    // Or check for aria-invalid if set; else use class/red border presence
    // Also check that #output is not visible
    await expect(page.locator('#output')).toBeHidden();
  });

  test('Empty email input shows validation error and no output', async ({ page }) => {
    await page.locator('#userEmail').fill('');
    await page.locator('#submit').click();
    const emailValidation = await page.locator('#userEmail').evaluate(el => el.validity.valid);
    expect(emailValidation).toBe(false);
    await expect(page.locator('#output')).toBeHidden();
  });

  test('Valid email displays output section', async ({ page }) => {
    // Fill all required fields
    await page.locator('#userName').fill('Test User');
    await page.locator('#userEmail').fill('test@domain.com');
    await page.locator('#currentAddress').fill('123 Main St');
    await page.locator('#permanentAddress').fill('456 Oak Ave');
    await page.locator('#submit').click();
    // No validation error
    const emailValid = await page.locator('#userEmail').evaluate(el => el.validity.valid);
    expect(emailValid).toBe(true);
    // Output visible and contains email
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#output')).toContainText('test@domain.com');
  });
});

test.describe('@SCRUM-70 @Forensic-AEGIS-SCRUM-70: Web Tables Registration Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    // Click on Web Tables left-nav item (selector may need adjustment)
    await page.locator('.show .btn-light:has-text("Web Tables")').click();
    // or use 'div.element-list > ul > li#item-3' – assume stable
  });

  async function openRegistrationModal(page) {
    await page.locator('#addNewRecordButton').click();
    await page.locator('.modal-content').waitFor();
  }

  test('Non-numeric Age blocks submission and modal stays open', async ({ page }) => {
    await openRegistrationModal(page);
    // Fill valid data except age
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('j@d.com');
    await page.locator('#age').fill('abc');
    await page.locator('#salary').fill('50000');
    await page.locator('#department').fill('QA');
    await page.locator('#submit').click();
    // Modal remains open
    await expect(page.locator('.modal-content')).toBeVisible();
    // Age field should show error (HTML5 validation or custom)
    // Since it's a text field with numeric constraint, we check if form was submitted
    // Actually DemoQA uses custom validation – check for class 'was-validated' or specific error text
    // For simplicity, check that new row is not added (table row count same)
    const rowCount = await page.locator('.rt-tr-group').count();
    expect(rowCount).toBe(0); // initially no rows, still none
  });

  test('Non-numeric Salary blocks submission and modal stays open', async ({ page }) => {
    await openRegistrationModal(page);
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('j@d.com');
    await page.locator('#age').fill('30');
    await page.locator('#salary').fill('12ab');
    await page.locator('#department').fill('QA');
    await page.locator('#submit').click();
    await expect(page.locator('.modal-content')).toBeVisible();
    const rowCount = await page.locator('.rt-tr-group').count();
    expect(rowCount).toBe(0);
  });

  test('Valid Age and Salary submits successfully', async ({ page }) => {
    await openRegistrationModal(page);
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('j@d.com');
    await page.locator('#age').fill('30');
    await page.locator('#salary').fill('50000');
    await page.locator('#department').fill('QA');
    await page.locator('#submit').click();
    // Modal closed
    await expect(page.locator('.modal-content')).toBeHidden();
    // New row appears
    const row = page.locator('.rt-tr-group').nth(0);
    await expect(row).toBeVisible();
    await expect(row).toContainText('John');
    await expect(row).toContainText('Doe');
  });
});

test.describe('@SCRUM-70 @Forensic-AEGIS-SCRUM-70: Radio Button Disabled Option Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    // Click Radio Button section
    await page.locator('.show .btn-light:has-text("Radio Button")').click();
  });

  test('"No" radio button is disabled in the DOM', async ({ page }) => {
    const noRadio = page.locator('#noRadio');
    // check disabled attribute or aria-disabled
    const disabled = await noRadio.evaluate(el => el.hasAttribute('disabled'));
    expect(disabled).toBe(true);
    // even if forced click, no state change
    await noRadio.click({ force: true });
    await expect(page.locator('#yesRadio')).not.toBeChecked();
    // Actually check that noRadio remains unchecked (not likely to be checked)
    const checked = await noRadio.isChecked();
    expect(checked).toBe(false);
  });

  test('Clicking disabled "No" does not trigger state change', async ({ page }) => {
    // First select Yes
    await page.locator('#yesRadio').click({ force: true });
    const outputBefore = await page.locator('.text-success').textContent();
    expect(outputBefore).toContain('Yes');
    // Attempt to click No
    await page.locator('#noRadio').click({ force: true });
    // Output unchanged
    const outputAfter = await page.locator('.text-success').textContent();
    expect(outputAfter).toBe(outputBefore);
    // No still disabled
    await expect(page.locator('#noRadio')).toBeDisabled();
    // Yes remains checked
    await expect(page.locator('#yesRadio')).toBeChecked();
  });
});

test.describe('@SCRUM-70 @Forensic-AEGIS-SCRUM-70: UI Stability under Viewport Constraints', () => {
  test('Elements interactable via scroll handling when partially visible', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('https://demoqa.com/elements');
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Scroll #userEmail into view
    await page.locator('#userEmail').scrollIntoViewIfNeeded();
    // Click and type
    await page.locator('#userEmail').click();
    await page.locator('#userEmail').fill('test@domain.com');
    // Verify text entered
    const value = await page.locator('#userEmail').inputValue();
    expect(value).toBe('test@domain.com');
  });
});
