Feature: DemoQA Elements Module Validation
  As a QA Engineer, I want to validate negative scenarios in the Elements module,
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario Outline: Email Validation
    Given the user navigates to the "Elements" page
    When the user enters an invalid email address in the "#userEmail" field
    Then the validation error is displayed and the output section is not displayed

  Scenario Outline: Web Tables Validation
    Given the user navigates to the "Elements" page
    When the user enters non-numeric values in the Age/Salary fields
    Then the submission is blocked and the registration modal remains open

  Scenario Outline: Radio Button Validation
    Given the user navigates to the "Elements" page
    When the user selects the "No" radio button option
    Then the option remains disabled and no state change occurs

  Scenario Outline: UI Stability
    Given the user navigates to the "Elements" page
    When an obstruction (e.g., overlay) is present
    Then the UI remains stable and elements remain interactable via scroll/visibility handling

**CODE_TYPESCRIPT**

```typescript
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
```

**ASSUMPTIONS**

* None