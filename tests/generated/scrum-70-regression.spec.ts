// Traceability
import { test, expect } from '@playwright/test';

test.describe('Regression Guardrails - DEMOQA Elements Negative Path', () => {

  test('Regression – Text box valid email output still displays after negative validation implementation', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await expect(page.locator('#userEmail')).toBeVisible();
    await page.locator('#userEmail').fill('test@example.com');
    await page.locator('#submit').click();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#output')).toContainText('test@example.com');
  });

  test('Regression – Web table row editing remains functional after negative Age validation', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    // Add a sample row first
    await page.locator('#addNewRecordButton').click();
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('john@example.com');
    await page.locator('#age').fill('30');
    await page.locator('#salary').fill('50000');
    await page.locator('#department').fill('QA');
    await page.locator('#submit').click();
    // Verify row added
    await expect(page.locator('.rt-tr-group')).toContainText('John');
    // Click edit on first row
    const editButton = page.locator('span[id^="edit-record-"]').first();
    await editButton.click();
    await page.locator('#firstName').clear();
    await page.locator('#firstName').fill('RegressionTest');
    await page.locator('#submit').click();
    // Verify edit persisted
    await expect(page.locator('.rt-tr-group')).toContainText('RegressionTest');
    // Cleanup: delete the row to maintain test independence
    const deleteButton = page.locator('span[id^="delete-record-"]').first();
    await deleteButton.click();
  });

  test('Regression – Radio button "Impressive" selection still works after "No" is confirmed disabled', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    // Confirm No radio is disabled
    await expect(page.locator('#noRadio')).toBeDisabled();
    // Click Impressive
    await page.locator('label[for="impressiveRadio"]').click();
    // Verify success message
    await expect(page.locator('.text-success')).toHaveText('Impressive');
  });

});
