import { test, expect } from '@playwright/test';

test.describe('Negative Path Validation - Elements Module - SCRUM-70', () => {
  test('Email Validation - Invalid email triggers validation error and output not displayed', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await page.fill('#userEmail', 'test@domain');
    await page.click('#submit');
    await expect(page.locator('#userEmail')).toHaveClass(/is-invalid/);
    await expect(page.locator('#output')).toBeHidden();
  });

  test('Email Validation - Valid email renders output section', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
