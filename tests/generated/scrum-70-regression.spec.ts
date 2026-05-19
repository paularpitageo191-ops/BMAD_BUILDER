// Traceability
// Functional Areas: Radio Button, Text Box, Web Tables
// Source References: AC1, AC2, AC3, Screenshots: Valid input
// Execution Readiness: strong
// Readiness Rationale: There is enough technical context to support executable coverage where the approved scope requires it.
import { test, expect } from '@playwright/test';

test.describe('Regression guardrails – DemoQA Elements module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('SCRUM-70-REG-001: Email acceptance still validates and shows output for valid email', async ({ page }) => {
    // Navigate to Text Box section
    await page.getByText('Text Box').click();
    await expect(page.locator('#userEmail')).toBeVisible();

    // Enter valid email and submit
    await page.fill('#userEmail', 'test@example.com');
    await page.click('#submit');

    // Assert no validation error
    const emailInput = page.locator('#userEmail');
    const hasValidationError = await emailInput.evaluate(el =>
      el.matches(':invalid') || el.getAttribute('aria-invalid') === 'true'
    );
    expect(hasValidationError).toBe(false);

    // Assert output section appears with the email
    const outputSection = page.locator('#output');
    await expect(outputSection).toBeVisible();
    await expect(outputSection).toContainText('Email:test@example.com');
  });

  test('SCRUM-70-REG-002: Web table registration still succeeds with valid numeric inputs', async ({ page }) => {
    // Navigate to Web Tables section
    await page.getByText('Web Tables').click();
    await expect(page.locator('#addNewRecordButton')).toBeVisible();

    // Open registration modal
    await page.click('#addNewRecordButton');
    await expect(page.locator('.modal-body')).toBeVisible();

    // Fill valid data
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'jane.doe@example.com');
    await page.fill('#age', '28');
    await page.fill('#salary', '65000');
    await page.fill('#department', 'Engineering');

    // Submit
    await page.click('#submit');

    // Modal closed
    await expect(page.locator('.modal-body')).not.toBeVisible();

    // New row with entered data present in table
    const table = page.locator('.ReactTable');
    await expect(table).toContainText('Jane');
    await expect(table).toContainText('Doe');
    await expect(table).toContainText('28');
    await expect(table).toContainText('65000');
  });

  test('SCRUM-70-REG-003: Radio button "Yes" remains selectable and shows feedback', async ({ page }) => {
    // Navigate to Radio Button section
    await page.getByText('Radio Button').click();
    await expect(page.locator('#yesRadio')).toBeVisible();

    // Click "Yes"
    await page.click('label[for="yesRadio"]');  // DemoQA radio uses label click

    // Verify selected state
    await expect(page.locator('#yesRadio')).toBeChecked();

    // Feedback text
    const feedback = page.locator('.text-success');
    await expect(feedback).toHaveText('You have selected Yes');

    // Verify "No" remains disabled
    await expect(page.locator('#noRadio')).toBeDisabled();
  });
});
