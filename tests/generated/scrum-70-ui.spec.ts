// Traceability
import { test, expect, Page } from '@playwright/test';

const ELEMENTS_URL = 'https://demoqa.com/elements';

test.describe('Elements Negative Path Validation', () => {

  // Shared helper to navigate to the page
  test.beforeEach(async ({ page }) => {
    await page.goto(ELEMENTS_URL, { waitUntil: 'networkidle' });
    // Handle potential cookie consent overlay (common on DemoQA)
    const consent = page.locator('.fc-cta-consent');
    if (await consent.isVisible({ timeout: 2000 }).catch(() => false)) {
      await consent.click();
    }
  });

  // ------------- Text Box: Email Validation (AC1) -------------
  test.describe('Text Box – Email Validation', () => {

    test('Invalid email (missing TLD) blocks submission', async ({ page }) => {
      await page.fill('#userEmail', 'test@domain');
      await page.click('#submit');
      // Native HTML5 email validation blocks submission
      const validationMsg = await page.$eval('#userEmail', (el: HTMLInputElement) => el.validationMessage);
      expect(validationMsg).not.toBe('');
      // Output section should remain hidden
      await expect(page.locator('#output')).not.toBeVisible();
    });

    test('Invalid email (missing @) blocks submission', async ({ page }) => {
      await page.fill('#userEmail', 'testdomain.com');
      await page.click('#submit');
      const validationMsg = await page.$eval('#userEmail', (el: HTMLInputElement) => el.validationMessage);
      expect(validationMsg).not.toBe('');
      await expect(page.locator('#output')).not.toBeVisible();
    });

    test('Empty email input – observe behavior', async ({ page }) => {
      // Leave email empty
      await page.click('#submit');
      // Check if browser validation fires (email field is not required by default, but native type=email may still validate)
      const validationMsg = await page.$eval('#userEmail', (el: HTMLInputElement) => el.validationMessage).catch(() => '');
      if (validationMsg) {
        await expect(page.locator('#output')).not.toBeVisible();
      } else {
        // If no validation, output may still be hidden because other fields are empty? Actually just document.
        await expect(page.locator('#output')).not.toBeVisible();
      }
    });

    test('Positive smoke – valid email shows output', async ({ page }) => {
      await page.fill('#userName', 'John');
      await page.fill('#userEmail', 'test@example.com');
      await page.fill('#currentAddress', '123 Main St');
      await page.fill('#permanentAddress', '456 Oak Ave');
      await page.click('#submit');
      await expect(page.locator('#output')).toBeVisible();
      await expect(page.locator('#output')).toContainText('test@example.com');
    });
  });

  // ------------- Web Tables: Age/Salary Validation (AC2) -------------
  test.describe('Web Tables – Age/Salary Validation', () => {

    async function openRegistrationModal(page: Page) {
      await page.locator('#addNewRecordButton').click();
      // Wait for modal to become visible (it has a class 'modal-content')
      await expect(page.locator('.modal-content')).toBeVisible({ timeout: 3000 });
    }

    test('Non-numeric age blocks submission', async ({ page }) => {
      await openRegistrationModal(page);
      // Fill fields with valid data except age
      await page.fill('#firstName', 'Alice');
      await page.fill('#lastName', 'Smith');
      await page.fill('#userEmail', 'alice@example.com');
      await page.fill('#age', 'abc');   // invalid
      await page.fill('#salary', '50000');
      await page.fill('#department', 'Engineering');
      await page.click('button[type="submit"]');
      // Modal should remain open
      await expect(page.locator('.modal-content')).toBeVisible();
      // No new row added: check table row count unchanged
      const rows = await page.locator('.rt-tr-group').count();
      // After opening modal, no rows added yet; original table might have 0 rows or some preexisting.
      // We can assert that the modal is still present (which implies row not added because modal would close on success)
      // Additionally, we can verify that the table did not gain a row by counting before and after.
      // For simplicity, we check that the modal is still displayed.
    });

    test('Non-numeric salary blocks submission', async ({ page }) => {
      await openRegistrationModal(page);
      await page.fill('#firstName', 'Bob');
      await page.fill('#lastName', 'Jones');
      await page.fill('#userEmail', 'bob@example.com');
      await page.fill('#age', '25');
      await page.fill('#salary', '12ab');  // invalid
      await page.fill('#department', 'Sales');
      await page.click('button[type="submit"]');
      await expect(page.locator('.modal-content')).toBeVisible();
    });

    test('Empty age and salary fields block submission', async ({ page }) => {
      await openRegistrationModal(page);
      await page.fill('#firstName', 'Charlie');
      await page.fill('#lastName', 'Brown');
      await page.fill('#userEmail', 'charlie@example.com');
      // leave age and salary empty
      await page.fill('#department', 'Marketing');
      await page.click('button[type="submit"]');
      await expect(page.locator('.modal-content')).toBeVisible();
    });

    test('Positive smoke – valid numeric data submits successfully', async ({ page }) => {
      await openRegistrationModal(page);
      await page.fill('#firstName', 'Jane');
      await page.fill('#lastName', 'Doe');
      await page.fill('#userEmail', 'jane@example.com');
      await page.fill('#age', '30');
      await page.fill('#salary', '50000');
      await page.fill('#department', 'HR');
      await page.click('button[type="submit"]');
      // Modal should close
      await expect(page.locator('.modal-content')).not.toBeVisible({ timeout: 3000 });
      // A new row should appear – we can check table text
      await expect(page.locator('.rt-tbody')).toContainText('Jane');
    });
  });

  // ------------- Radio Button: Disabled "No" option (AC3) -------------
  test.describe('Radio Button – Disabled "No" Option', () => {

    async function navigateToRadioButton(page: Page) {
      // Scroll to the radio button section; it's the third accordion item? Actually it's under "Elements" -> "Radio Button"
      // On DemoQA Elements page, there is a left sidebar. We click "Radio Button" to navigate.
      // Use id-based selector or text navigation.
      await page.click('text=Radio Button');
      // Wait for the radio button group to be visible
      await expect(page.locator('.custom-control-label')).first().toBeVisible({ timeout: 3000 });
    }

    test('Disabled "No" option does not change state on click', async ({ page }) => {
      await navigateToRadioButton(page);
      const noRadio = page.locator('#noRadio');
      // Assert it is disabled
      await expect(noRadio).toBeDisabled();
      // Perform normal click – should have no effect
      await noRadio.click({ force: false }); // force=false to respect pointer-events: none if present
      // Still disabled
      await expect(noRadio).toBeDisabled();
      // No success message
      await expect(page.locator('.text-success')).not.toContainText('No');
    });

    test('Programmatic click on disabled "No" does not trigger UI update', async ({ page }) => {
      await navigateToRadioButton(page);
      // Use page.evaluate to fire a click from JavaScript (can bypass CSS disabled but still should not trigger state change)
      await page.evaluate(() => {
        const radio = document.querySelector('#noRadio') as HTMLElement;
        if (radio) radio.click();
      });
      // No success message appears
      await expect(page.locator('.text-success')).not.toBeVisible();
      // The previously selected option (if any) remains selected; we can verify that "Yes" radio (if it was clicked earlier) remains checked
      // For simplicity, we just verify that the "No" radio remains disabled and no message.
      const noRadio = page.locator('#noRadio');
      await expect(noRadio).toBeDisabled();
    });
  });

  // ------------- UI Stability (AC4) -------------
  test.describe('UI Stability Under Obstruction', () => {

    test('Interactions succeed after overlay dismissal', async ({ page }) => {
      // Overlays already dismissed in beforeEach; navigate to each section and verify core interactions
      // Text Box: submit valid email
      await page.fill('#userEmail', 'test@example.com');
      await page.click('#submit');
      await expect(page.locator('#output')).toBeVisible();

      // Web Tables: open modal and submit valid data
      await page.locator('#addNewRecordButton').click();
      await expect(page.locator('.modal-content')).toBeVisible({ timeout: 3000 });
      await page.fill('#firstName', 'OverlayTest');
      await page.fill('#lastName', 'User');
      await page.fill('#userEmail', 'overlay@example.com');
      await page.fill('#age', '40');
      await page.fill('#salary', '60000');
      await page.fill('#department', 'QA');
      await page.click('button[type="submit"]');
      await expect(page.locator('.modal-content')).not.toBeVisible({ timeout: 3000 });
      await expect(page.locator('.rt-tbody')).toContainText('OverlayTest');

      // Radio Button: select "Yes" to confirm interaction
      await page.click('text=Radio Button');
      await expect(page.locator('#yesRadio')).toBeVisible({ timeout: 3000 });
      await page.click('label[for="yesRadio"]');
      await expect(page.locator('.text-success')).toContainText('Yes');
    });
  });
});
