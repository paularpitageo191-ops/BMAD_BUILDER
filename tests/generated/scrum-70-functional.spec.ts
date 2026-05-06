import { test, expect } from '@playwright/test';

let page;

test('Email Validation Failure - Invalid Email', async () => {
  await page.fill('#userEmail', 'invalid email');
  await page.press('#submit', 'Enter');
  await expect(page.locator('#userEmail')).toHaveAttribute('aria-invalid', true);
  await expect(page.locator('#output')).not.toBeVisible();
});

test('Web Tables Age/Salary Validation Failure - Non-Numeric Input', async () => {
  await page.fill('#age', 'abc');
  await page.fill('#salary', '123abc');
  await page.click('#addNewRecordButton');
  await expect(page.locator('.modal-content')).toBeVisible();
  await expect(page.locator('#output')).not.toBeVisible();
});

test('Radio Button Disabled State Verification', async () => {
  await expect(page.locator('#noRadio')).toBeDisabled();
  await page.click('#noRadio');
  await expect(page.locator('#noRadio')).toBeDisabled();
});

test('UI Stability Under Overlay Obstruction', async () => {
  await page.waitForSelector('.overlay');
  await page.scrollIntoViewIfNeeded('#element-1');
  await expect(page.locator('#element-1')).toBeVisible() && expect(page.locator('#element-1')).toBeEnabled();
});
