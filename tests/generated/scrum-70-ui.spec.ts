import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation - Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('Invalid email blocks output in Text Box', async ({ page }) => {
    // Given the user is on the Text Box page
    await page.locator('text=Text Box').click();
    await page.waitForSelector('#userEmail');

    // When the user enters an invalid email "test@domain"
    await page.locator('#userEmail').fill('test@domain');

    // And the user clicks the Submit button
    await page.locator('#submit').click();

    // Then the email field shows a validation error
    const emailField = page.locator('#userEmail');
    await expect(emailField).toBeVisible();
    const isInvalid = await emailField.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();

    // And the output section is not displayed
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('Non-numeric age blocks registration in Web Tables', async ({ page }) => {
    // Given the user is on the Web Tables page
    await page.locator('text=Web Tables').click();
    await page.waitForSelector('#addNewRecordButton');

    // When the user opens the registration modal
    await page.locator('#addNewRecordButton').click();
    await expect(page.locator('.modal-content')).toBeVisible();

    // And the user enters non-numeric age "abc" in the age field
    await page.locator('#age').fill('abc');

    // And the user clicks the Submit button
    await page.locator('#submit').click();

    // Then the registration modal remains open
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('"No" radio button remains disabled', async ({ page }) => {
    // Given the user is on the Radio Button page
    await page.locator('text=Radio Button').click();
    await page.waitForSelector('#noRadio');

    // Then the "#noRadio" element is disabled
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();

    // When the user attempts to click the "#noRadio" element
    await noRadio.click({ force: true });

    // Then the "#noRadio" element remains disabled
    await expect(noRadio).toBeDisabled();

    // And no selection state change occurs
    const successText = page.locator('.text-success');
    await expect(successText).not.toBeVisible();
  });

  test('UI remains stable when scrolling to interactable elements', async ({ page }) => {
    // Given the user is on the Radio Button page
    await page.locator('text=Radio Button').click();
    await page.waitForSelector('#yesRadio');

    // When the user scrolls to the "Yes"
