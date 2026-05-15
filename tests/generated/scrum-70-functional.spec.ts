import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements Negative Path Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('Invalid email displays validation error on Text Box', async ({ page }) => {
    // Navigate to Text Box tab
    await page.getByText('Text Box').click();
    
    // Enter invalid email
    await page.locator('#userEmail').fill('invalid-email');
    
    // Click Submit
    await page.locator('#submit').click();
    
    // Expect validation error (browser-native or custom)
    // Using HTML5 validation, the input should show validity error
    const emailInput = page.locator('#userEmail');
    await expect(emailInput).toHaveAttribute('validationMessage');
    // Or check that the form is not submitted (output not visible)
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('Valid email submission succeeds (Regression)', async ({ page }) => {
    // Navigate to Text Box tab
    await page.getByText('Text Box').click();
    
    // Enter valid email
    await page.locator('#userEmail').fill('test@example.com');
    
    // Click Submit
    await page.locator('#submit').click();
    
    // Expect output to show the submitted data
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#output')).toContainText('test@example.com');
  });

  test('Modal remains open when invalid age is entered', async ({ page }) => {
    // Navigate to Web Tables tab
    await page.getByText('Web Tables').click();
    
    // Click Add button to open registration modal
    await page.locator('#addNewRecordButton').click();
    
    // Wait for modal to appear
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Enter an invalid age (non-numeric)
    await page.locator('#age').fill('abc');
    
    // Click Submit in the modal
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Modal should remain open (not disappear)
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('Modal remains open when invalid salary is entered', async ({ page }) => {
    // Navigate to Web Tables tab
    await page.getByText('Web Tables').click();
    
    // Click Add button to open registration modal
    await page.locator('#addNewRecordButton').click();
    
    // Wait for modal to appear
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Enter an invalid salary (non-numeric)
    await page.locator('#salary').fill('xyz');
    
    // Click Submit in the modal
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Modal should remain open
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('Disabled radio button cannot be selected', async ({ page }) => {
    // Navigate to Radio Button tab
    await page.getByText('Radio Button').click();
    
    // Attempt to click the disabled "No" option
    const noRadio = page.locator('#noRadio');
    await noRadio.click({ force: true }); // force to bypass disabled attribute for the click
    
    // Verify it remains unchecked
    await expect(noRadio).not.toBeChecked();
  });
});
