import { test } from '@playwright/test';
import { expect } from 'chai';

test('email validation failure', async ({ page }) => {
  await page.goto('https://demoqa.com/elements');
  await page.fill('#userEmail', 'invalid-email');
  await page.click('[data-test="submit"]');
  expect(await page.$eval('#output', el => el.textContent)).toBe('');
});

test('web tables validation failure', async ({ page }) => {
  await page.goto('https://demoqa.com/elements');
  await page.fill('input[name="age"]', 'abc');
  await page.fill('input[name="salary"]', 'xyz');
  await page.click('[data-test="submit"]');
  expect(await page.$eval('.registration-modal', el => el.textContent)).toBe('');
});

test('radio button validation failure', async ({ page }) => {
  await page.goto('https://demoqa.com/elements');
  await page.click('[name="noRadio"]');
  expect(await page.$eval('[name="noRadio"]', el => el.disabled), true);
});

test('ui stability under obstruction', async ({ page }) => {
  await page.goto('https://demoqa.com/elements');
  await page.setOverlay(true);
  await page.interactWithElements();
  expect(await page.$eval('.overlay', el => el.style.display), 'block');
});
