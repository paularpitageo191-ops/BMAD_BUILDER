import { test } from '@playwright/test';
import { page } from './page';

test('Email Validation', async ({ page }) => {
  await page.goto('https://demoqa.com/elements');
  // Enter invalid email and verify validation error message
  const userEmail = '#userEmail';
  const outputSection = '#output';
  await page.fill(userEmail, 'invalidEmail');
  await page.click(`[data-testid="submit"]`);
  expect(await page.textContent(userEmail)).toContain('Validation Error');

  // Verify output section is not displayed for invalid input
  expect(await page.isVisible(outputSection)).toBe(false);
});

test('Web Tables Validation', async ({ page }) => {
  await page.goto('https://demoqa.com/elements');
  // Enter non-numeric values for Age and Salary and verify submission block
  const ageField = '#age';
  const salaryField = '#salary';
  await page.fill(ageField, 'abc');
  await page.fill(salaryField, '12ab');
  await page.click(`[data-testid="submit"]`);
  expect(await page.textContent('[data-testid="submission-modal"]')).toContain('Invalid Input');

  // Verify registration modal remains open
  expect(await page.isVisible('[data-testid="registration-modal"]')).toBe(true);
});

test('Radio Button Validation', async ({ page }) => {
  await page.goto('https://demoqa.com/elements');
  // Click on "No" radio button and verify state does not change
  const noRadio = '#noRadio';
  await page.click(noRadio);
  expect(await page.evaluate(`document.querySelector('${noRadio}').checked`)).toBe(false);
});

test('UI Stability', async ({ page }) => {
  await page.goto('https://demoqa.com/elements');
  // Verify UI remains stable under obstruction (e.g., overlays)
  // ... test code ...
});
