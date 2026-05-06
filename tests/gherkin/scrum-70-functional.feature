Feature: Negative Path Validation for DemoQA Elements Module
  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488

Scenario: Email Validation Failure - Invalid Email
  Given the user enters an invalid email on Text Box
  When they submit
  Then a validation error appears on #userEmail and #output is not displayed

Scenario: Web Tables Age/Salary Validation Failure - Non-Numeric Input
  Given the user enters non-numeric values in Age or Salary fields in Web Tables
  When they attempt to submit the registration modal
  Then submission is blocked and modal remains open

Scenario: Radio Button Disabled State Verification
  Given the user attempts to click the 'No' radio button
  Then no state change occurs because the button is disabled

Scenario: UI Stability Under Overlay Obstruction
  Given an overlay obstructs interaction
  When the user interacts with elements
  Then elements remain interactable via scroll and visibility handling

**CODE_TYPESCRIPT**

```typescript
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
```

**ASSUMPTIONS**

* None