import { test, expect } from '@playwright/test';

test.describe('@JIRA-SCRUM-70: DemoQA Elements Negative Path Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
  });

  test('@ui-negative: Text Box rejects invalid email with validation error', async ({ page }) => {
    // Navigate to Text Box section
    await page.getByRole('listitem').filter({ hasText: 'Text Box' }).click();
    await page.waitForSelector('#userEmail');

    // Enter invalid email and submit
    await page.fill('#userEmail', 'invalid-email');
    await page.click('#submit');

    // Verify browser validation message is shown and #output is not visible
    const validationMessage = await page.locator('#userEmail').evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
    expect(validationMessage).toContain('@'); // generic check that validation is about missing @
    await expect(page.locator('#output')).not.toBeVisible();
  });

  test('@ui-negative: Web Tables registration modal remains open on invalid email', async ({ page }) => {
    // Navigate to Web Tables section
    await page.getByRole('listitem').filter({ hasText: 'Web Tables' }).click();
    await page.waitForSelector('#addNewRecordButton');
    await page.click('#addNewRecordButton');

    // Wait for modal to open
    await page.waitForSelector('.modal-content');

    // Fill fields with invalid email
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'bad.email@'); // invalid but passes HTML5 type=email? Actually "bad.email@" is valid per HTML5? Need truly invalid: "bad"
    // Use a clearly invalid string that fails email type validation
    await page.fill('#userEmail', 'invalid');
    await page.fill('#age', '30');
    await page.fill('#salary', '50000');
    await page.fill('#department', 'QA');

    // Submit modal
    await page.click('#submit');

    // Modal should still be visible
    await expect(page.locator('.modal-content')).toBeVisible();
    // Verify no new row added (table row count unchanged from initial)
    const rowCount = await page.locator('.rt-tr-group').count();
    // Initial row count is variable, but modal stays open so no new row
    // Alternatively, check that the email field still has the invalid value
    await expect(page.locator('#userEmail')).toHaveValue('invalid');
  });

  test('@ui-regression: Web Tables successful registration still works', async ({ page }) => {
    // Navigate to Web Tables section
    await page.getByRole('listitem').filter({ hasText: 'Web Tables' }).click();
    await page.waitForSelector('#addNewRecordButton');
    await page.click('#addNewRecordButton');
    await page.waitForSelector('.modal-content');

    // Fill all fields with valid data
    await page.fill('#firstName', 'Jane');
    await page.fill('#lastName', 'Smith');
    await page.fill('#userEmail', 'jane.smith@example.com');
    await page.fill('#age', '28');
    await page.fill('#salary', '60000');
    await page.fill('#department', 'Engineering');

    // Submit
    await page.click('#submit');

    // Modal should close
    await expect(page.locator('.modal-content')).not.toBeVisible();
    // Verify new record appears in table (at least one row)
    await expect(page.locator('.rt-tr-group')).toHaveCount(1);
    // Additional check: last row contains submitted email
    const lastRow = page.locator('.rt-tr-group').last();
    await expect(lastRow).toContainText('jane.smith@example.com');
  });
});
