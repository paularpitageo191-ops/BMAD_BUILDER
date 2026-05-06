import { test, expect } from '@playwright/test';

let page: PlaywrightPage;

test.beforeEach(async ({ baseURL }) => {
  page = await global.playwright.launch().then(() => page);
});

test('Email Validation', async () => {
  await page.goto('https://demoqa.com/elements');
  await page.fill('#userEmail', 'invalid email');
  expect(page.locator('#output').textContent()).toBe('');
});

test('Web Tables Validation', async () => {
  await page.goto('https://demoqa.com/elements');
  await page.fill('[data-test="age"]', 'abc');
  await page.fill('[data-test="salary"]', '12ab');
  expect(page.locator('.modal').textContent()).toBe('');
});

test('Radio Button Validation', async () => {
  await page.goto('https://demoqa.com/elements');
  await page.select('#noRadio', 'No');
  expect(await page.eval('return document.querySelector("#noRadio").disabled')).toBe(true);
});

test('UI Stability', async () => {
  await page.goto('https://demoqa.com/elements');
  await page.evaluate(() => {
    // simulate obstruction (e.g., overlay)
  });
  expect(page.locator('*').getCount()).toBeGreaterThanOrEqual(1);
});
