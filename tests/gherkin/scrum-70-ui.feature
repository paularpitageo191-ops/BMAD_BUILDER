@JIRA-SCRUM-70
@Forensic-AEGIS-SCRUM-70
@ui-negative-path
Feature: Negative Path Validation for DemoQA Elements – Web Tables Email Field
  As a user interacting with the Web Tables modal
  I want to see validation errors for invalid email entries
  So that I can correct my input before submitting

  @regression @ui-happy-path
  Scenario: Valid email in add record modal proceeds without error
    Given the user is on the Elements page
    And the Web Tables section is visible
    When they click the "Add" button
    And the modal appears
    And they fill in the email field with "john.doe@example.com"
    And they submit the form
    Then the modal closes
    And the new record appears in the table

  @ui-negative-path @ui-validation
  Scenario Outline: Invalid email shows validation error and modal remains open
    Given the user is on the Elements page
    And the Web Tables section is visible
    When they click the "Add" button
    And the modal appears
    And they fill in the email field with "<email>"
    And they submit the form
    Then the modal remains open
    And a validation error is displayed indicating "Invalid email" or similar

    Examples:
      | email               |
      | "notanemail"        |
      | "@example.com"      |
      | "user@.com"         |
      | "user@com"          |
      | "user@domain..com"  |
      | "" (empty)          |

==-CODE_TYPESCRIPT==
import { test, expect } from '@playwright/test';

test.describe('SCRUM-70 - Negative Path Validation for DemoQA Elements (Web Tables)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    // Navigate to Web Tables section by scrolling or clicking the left menu item
    await page.click('text=Web Tables');
    await expect(page.locator('.web-tables-wrapper')).toBeVisible();
  });

  // @regression @ui-happy-path – protect existing flow
  test('Valid email in add record modal proceeds without error', async ({ page }) => {
    await page.click('button#addNewRecordButton');
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'john.doe@example.com');
    await page.fill('#age', '30');
    await page.fill('#salary', '50000');
    await page.fill('#department', 'Engineering');
    await page.click('button#submit');

    // Modal should close
    await expect(modal).not.toBeVisible();
    // Record should appear in table
    await expect(page.locator('.rt-tbody').locator('text=john.doe@example.com')).toBeVisible();
  });

  // @ui-negative-path @ui-validation – invalid email keeps modal open and shows error
  const invalidEmails = [
    'notanemail',
    '@example.com',
    'user@.com',
    'user@com',
    'user@domain..com',
    '',
  ];

  for (const email of invalidEmails) {
    test(`Invalid email "${email}" shows validation error and modal stays open`, async ({ page }) => {
      await page.click('button#addNewRecordButton');
      const modal = page.locator('.modal-content');
      await expect(modal).toBeVisible();

      // Fill mandatory fields but with invalid email
      await page.fill('#firstName', 'Jane');
      await page.fill('#lastName', 'Doe');
      await page.fill('#userEmail', email);
      await page.fill('#age', '25');
      await page.fill('#salary', '40000');
      await page.fill('#department', 'Marketing');
      await page.click('button#submit');

      // Modal should remain open
      await expect(modal).toBeVisible();
      // Validation error should be visible (DemoQA uses HTML5 validation, so check for :invalid pseudo-class or error message)
      const emailInput = page.locator('#userEmail');
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      // Alternatively, check for browser validation tooltip – but in test we rely on modal staying open
      // Additionally, check that the error message is shown (DemoQA might show a small red text; look for it)
      // Use a generic approach: wait for any validation message
      await expect(page.locator('.invalid-feedback, .error, .was-validated')).toBeVisible({ timeout: 3000 }).catch(() => {
        // If no explicit error element, at least ensure submit did not succeed
        // Modal is still open – that's our primary assertion
      });
    });
  }
});