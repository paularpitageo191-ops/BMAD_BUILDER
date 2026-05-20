// Traceability
import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://demoqa.com';

// Helper to navigate to a specific section inside Elements
async function navigateToSection(page: Page, sectionName: string) {
  await page.goto(`${BASE_URL}/elements`);
  // Click the section link in the left sidebar (assumes text-based locator)
  await page.getByText(sectionName, { exact: true }).click();
  await page.waitForLoadState('networkidle');
}

test.describe('Text Box - Email Validation (AC1)', () => {
  test('TC01: Invalid email (no TLD) triggers validation error and no output', async ({ page }) => {
    await navigateToSection(page, 'Text Box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('test@domain');
    await submitButton.click();

    // Assert validation error is displayed (class or aria-invalid indicator)
    await expect(emailInput).toHaveClass(/is-invalid|error/i);
    await expect(outputSection).not.toBeVisible();
  });

  test('TC02: Invalid email (no @) triggers validation error and no output', async ({ page }) => {
    await navigateToSection(page, 'Text Box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('testdomain.com');
    await submitButton.click();

    await expect(emailInput).toHaveClass(/is-invalid|error/i);
    await expect(outputSection).not.toBeVisible();
  });

  test('TC03: Empty email field triggers validation error and no output', async ({ page }) => {
    await navigateToSection(page, 'Text Box');
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('');
    await submitButton.click();

    await expect(emailInput).toHaveClass(/is-invalid|error/i);
    await expect(outputSection).not.toBeVisible();
  });

  test('TC04: Valid email produces output section with correct data', async ({ page }) => {
    await navigateToSection(page, 'Text Box');
    const emailInput = page.locator('#userEmail');
    const nameInput = page.locator('#userName');
    const addressInput = page.locator('#currentAddress');
    const submitButton = page.locator('#submit');
    const outputSection = page.locator('#output');

    await emailInput.fill('test@example.com');
    await nameInput.fill('John Doe');
    await addressInput.fill('123 Main St');
    await submitButton.click();

    // No validation error on email
    await expect(emailInput).not.toHaveClass(/is-invalid|error/i);
    // Output section should be visible and contain submitted data
    await expect(outputSection).toBeVisible();
    await expect(outputSection).toContainText('test@example.com');
    await expect(outputSection).toContainText('John Doe');
  });
});

test.describe('Web Tables - Numeric Validation (AC2)', () => {
  const openRegistrationModal = async (page: Page) => {
    await navigateToSection(page, 'Web Tables');
    await page.locator('#addNewRecordButton').click();
    // Wait for modal to appear
    await page.locator('.modal-content').waitFor({ state: 'visible' });
  };

  const fillRegistrationForm = async (
    page: Page,
    overrides: { age?: string; salary?: string } = {}
  ) => {
    const defaultData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      age: '30',
      salary: '50000',
      department: 'QA',
    };
    const data = { ...defaultData, ...overrides };

    await page.locator('#firstName').fill(data.firstName);
    await page.locator('#lastName').fill(data.lastName);
    await page.locator('#userEmail').fill(data.email);
    await page.locator('#age').fill(data.age);
    await page.locator('#salary').fill(data.salary);
    await page.locator('#department').fill(data.department);
  };

  test('TC05: Non-numeric age blocks submission and modal stays open', async ({ page }) => {
    await openRegistrationModal(page);
    await fillRegistrationForm(page, { age: 'abc' });
    await page.locator('button[type="submit"]', { hasText: 'Submit' }).click();

    // Modal should remain open
    await expect(page.locator('.modal-content')).toBeVisible();
    // Age field should have validation error class
    await expect(page.locator('#age')).toHaveClass(/is-invalid|error/i);
    // Table should not have the new row
    await expect(page.locator('.rt-tbody')).not.toContainText('Jane');
  });

  test('TC06: Non-numeric salary blocks submission and modal stays open', async ({ page }) => {
    await openRegistrationModal(page);
    await fillRegistrationForm(page, { salary: '12ab' });
    await page.locator('button[type="submit"]', { hasText: 'Submit' }).click();

    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('#salary')).toHaveClass(/is-invalid|error/i);
    await expect(page.locator('.rt-tbody')).not.toContainText('Jane');
  });
});

test.describe('Radio Button - Disabled No Option (AC3)', () => {
  test('TC07: Disabled “No” radio button remains disabled and unclickable', async ({ page }) => {
    await navigateToSection(page, 'Radio Button');
    const noRadio = page.locator('#noRadio');

    // Verify it is disabled via attribute
    await expect(noRadio).toBeDisabled();
    // Attempt a normal click (should do nothing)
    await noRadio.click({ force: false }).catch(() => {
      // Expected to fail or swallow
    });

    // Confirm no state change: the radio should still be disabled
    await expect(noRadio).toBeDisabled();
    // Check that no output appeared from this click
    await expect(page.locator('.text-success')).not.toBeVisible();
  });

  test('TC08: Force click on disabled “No” radio button does not change state', async ({ page }) => {
    await navigateToSection(page, 'Radio Button');
    const noRadio = page.locator('#noRadio');
    const yesRadio = page.locator('#yesRadio');
    const impressiveRadio = page.locator('#impressiveRadio');
    const outputMessage = page.locator('.text-success');

    // First, select 'Yes' to establish a baseline state
    await yesRadio.click({ force: true });
    const originalOutput = await outputMessage.textContent();

    // Force click disabled No radio
    await noRadio.click({ force: true });

    // Assert no change
    await expect(noRadio).toBeDisabled();
    // Other radio buttons should remain selected if they were selected
    await expect(yesRadio).toBeChecked();
    // Output message unchanged
    await expect(outputMessage).toHaveText(originalOutput!);
  });
});
