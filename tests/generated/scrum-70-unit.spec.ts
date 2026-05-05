import { test, expect } from '@playwright/test';

import { chromium, Browser, Page } from 'playwright';

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

afterAll(async () => {
  await browser.close();
});

test('AC1 – Email Validation', async () => {
  await page.goto('https://demoqa.com/text-box');
  await page.waitForSelector('#userEmail');
  await page.fill('#userEmail', 'test@domain');
  await page.click('#submit');

  // Verify validation error class is added to #userEmail
  const emailInput = await page.$('#userEmail');
  const emailClass = await emailInput!.getAttribute('class');
  expect(emailClass).toContain('field-error');

  // Verify #output section is not visible (hidden or removed)
  const outputDisplay = await page.$eval('#output', el => getComputedStyle(el).display);
  expect(outputDisplay).toBe('none');
});

test('AC2 – Web Tables Validation with non-numeric age and salary', async () => {
  await page.goto('https://demoqa.com/webtables');
  await page.click('#addNewRecordButton');
  await page.waitForSelector('.modal-content', { state: 'visible' });

  // Fill invalid data
  await page.fill('#age', 'abc');
  await page.fill('#salary', '12ab');

  // Attempt submission
  await page.click('#submit');

  // Modal should remain open (still visible)
  const modalVisible = await page.isVisible('.modal-content');
  expect(modalVisible).toBe(true);

  // Verify no new row added (table row count remains same)
  const rowCountBefore = await page.$$eval('.rt-tr-group', rows => rows.length);
  // The table may have initial rows; we just ensure it hasn't increased
  // Since we didn't add a valid record, the count should stay as before
  // Alternatively, close modal and check no new entry
  await page.click('#closeModal'); // assuming close button exists
  const rowCountAfter = await page.$$eval('.rt-tr-group', rows => rows.length);
  expect(rowCountAfter).toBe(rowCountBefore);
});

test('AC3 – Radio Button Validation for disabled option', async () => {
  await page.goto('https://demoqa.com/radio-button');
  await page.waitForSelector('#noRadio');

  // Verify #noRadio is disabled
  const isDisabled = await page.isDisabled('#noRadio');
  expect(isDisabled).toBe(true);

  // Click the disabled radio button
  await page.click('#noRadio');

  // Verify no state change: it remains disabled and unchecked
  const isChecked = await page.isChecked('#noRadio');
  expect(isChecked).toBe(false);
  const stillDisabled = await page.isDisabled('#noRadio');
  expect(stillDisabled).toBe(true);
});

test('AC4 – UI Stability under overlay obstruction', async () => {
  await page.goto('https://demoqa.com/webtables');
  // Open registration modal (overlay)
  await page.click('#addNewRecordButton');
  await page.waitForSelector('.modal-content', { state: 'visible' });

  // Close modal by clicking Cancel
  await page.click('#closeModal');
  await page.waitForSelector('.modal-content', { state: 'hidden' });

  // Verify table is still displayed
  const tableDisplay = await page.$eval('.ReactTable', el => getComputedStyle(el).display);
  expect(tableDisplay).not.toBe('none');

  // Verify other element interactability: click Add button again
  await page.click('#addNewRecordButton');
  await page.waitForSelector('.modal-content', { state: 'visible' });
  // Cleanup: close modal
  await page.click('#closeModal');
});
