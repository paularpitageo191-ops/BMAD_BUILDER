// Traceability
import { test, expect } from '@playwright/test';

test.describe('DemoQA Elements Negative Path Validation', () => {

  // AC1 – Email Validation
  test('Email invalid – missing TLD blocks submission and hides output', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await page.waitForLoadState('networkidle');
    await page.fill('#userEmail', 'test@domain');
    await page.click('#submit');
    await expect(page.locator('#output')).toBeHidden();
    await expect(page).toHaveURL('https://demoqa.com/text-box');
  });

  test('Email invalid – missing @ symbol blocks submission', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await page.waitForLoadState('networkidle');
    await page.fill('#userEmail', 'testdomain.com');
    await page.click('#submit');
    await expect(page.locator('#output')).toBeHidden();
    await expect(page).toHaveURL('https://demoqa.com/text-box');
  });

  test('Valid email renders output section with correct data', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await page.waitForLoadState('networkidle');
    await page.fill('#userName', 'John Doe');
    await page.fill('#userEmail', 'john.doe@example.com');
    await page.fill('#currentAddress', '123 Main St');
    await page.fill('#permanentAddress', '456 Oak Ave');
    await page.click('#submit');
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#output')).toContainText('John Doe');
    await expect(page.locator('#output')).toContainText('john.doe@example.com');
  });

  // AC2 – Web Tables Validation
  test('Non-numeric age blocks registration', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.waitForLoadState('networkidle');
    await page.click('#addNewRecordButton');
    await page.waitForSelector('.modal-content', { state: 'visible' });
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Smith');
    await page.fill('#userEmail', 'jane.smith@test.com');
    await page.fill('#age', 'abc');
    await page.fill('#salary', '50000');
    await page.fill('#department', 'QA');
    await page.click('#submit');
    await expect(page.locator('.modal-content')).toBeVisible();
    // Verify no new row: search by email and expect no results
    await page.fill('#searchBox', 'jane.smith@test.com');
    await expect(page.locator('.rt-tr-group')).toHaveCount(0);
  });

  test('Non-numeric salary blocks registration', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.waitForLoadState('networkidle');
    await page.click('#addNewRecordButton');
    await page.waitForSelector('.modal-content', { state: 'visible' });
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Smith');
    await page.fill('#userEmail', 'jane.smith@test.com');
    await page.fill('#age', '30');
    await page.fill('#salary', '12ab');
    await page.fill('#department', 'QA');
    await page.click('#submit');
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.fill('#searchBox', 'jane.smith@test.com');
    await expect(page.locator('.rt-tr-group')).toHaveCount(0);
  });

  test('Empty age and salary fields block registration', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');
    await page.waitForLoadState('networkidle');
    await page.click('#addNewRecordButton');
    await page.waitForSelector('.modal-content', { state: 'visible' });
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Smith');
    await page.fill('#userEmail', 'jane.smith@test.com');
    // leave age and salary empty
    await page.fill('#department', 'QA');
    await page.click('#submit');
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.fill('#searchBox', 'jane.smith@test.com');
    await expect(page.locator('.rt-tr-group')).toHaveCount(0);
  });

  // AC3 – Radio Button Validation
  test('No radio button is disabled and unclickable', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    await page.waitForLoadState('networkidle');
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();
    // Try normal click
    await noRadio.click({ timeout: 3000 }).catch(() => {});  // click will likely fail, catch error
    await expect(noRadio).toBeDisabled();
    // Ensure no success message for "No"
    await expect(page.locator('.text-success')).toBeHidden();
  });

  test('No state change after force-clicking disabled No radio', async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    await page.waitForLoadState('networkidle');
    const noRadio = page.locator('#noRadio');
    await expect(noRadio).toBeDisabled();
    // Force click
    await noRadio.click({ force: true });
    await expect(noRadio).toBeDisabled();
    await expect(page.locator('.text-success')).toBeHidden();
  });
});
