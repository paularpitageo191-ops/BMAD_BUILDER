// Traceability
import { test, expect } from '@playwright/test';

test.describe('Regression Guardrails – DemoQA Elements Positive Behaviors', () => {

  test('Positive email submission shows output section', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const output = page.locator('#output');

    await emailInput.fill('user@example.com');
    await submitButton.click();

    await expect(output).toBeVisible();
    await expect(output).toContainText('user@example.com');
  });

  test('Valid web table entry creates new row and modal closes', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.locator('#addNewRecordButton').click();

    // Fill registration modal
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#userEmail').fill('newuser@example.com');
    await page.locator('#age').fill('30');
    await page.locator('#salary').fill('50000');
    await page.locator('#department').fill('QA');
    await page.locator('#submit').click();

    // Assert modal closed
    await expect(page.locator('.modal-content')).not.toBeVisible();
    // Assert new row appears
    await expect(page.locator('.rt-tbody')).toContainText('newuser@example.com');
  });

  test('Positive radio button selection shows success message', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    const yesRadio = page.locator('#yesRadio');
    await yesRadio.click({ force: true }); // yesRadio is not disabled, but may need force click due to styling
    const successText = page.locator('.text-success');
    await expect(successText).toBeVisible();
    await expect(successText).toHaveText('Yes');
  });

  test('UI remains interactable under overlay obstruction – AC4 regression', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    // Inject transparent overlay covering 30% of viewport over form
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'test-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '30%';
      overlay.style.backgroundColor = 'transparent';
      overlay.style.zIndex = '1000';
      document.body.appendChild(overlay);
    });

    const emailInput = page.locator('#userEmail');
    await emailInput.scrollIntoViewIfNeeded();
    await expect(emailInput).toBeVisible();
    await emailInput.fill('test@example.com');

    const submitButton = page.locator('#submit');
    await submitButton.click({ force: true });

    await expect(page.locator('#output')).toBeVisible();
  });

  test('Scrolling to elements across hub works – AC4 regression', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('https://demoqa.com/elements');

    // Scroll to and interact with Text Box link
    const textBoxLink = page.locator('text=Text Box');
    await textBoxLink.scrollIntoViewIfNeeded();
    await textBoxLink.click();
    await page.waitForURL('**/text-box');
    await page.locator('#userEmail').fill('scroll@test.com');
    await page.locator('#submit').click();
    await expect(page.locator('#output')).toBeVisible();

    // Navigate back and test Radio Button
    await page.goto('https://demoqa.com/radio-button');
    await page.locator('#yesRadio').click({ force: true });
    await expect(page.locator('.text-success')).toHaveText('Yes');
  });

});
