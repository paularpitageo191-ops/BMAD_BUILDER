import { test, expect, Locator } from '@playwright/test';

const BASE_URL = 'https://demoqa.com/elements';

test.describe('Negative Path Validation for DemoQA Elements Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  });

  test('AC1: Invalid email shows validation error and hides output', async ({ page }) => {
    // locate elements
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('button#submit');
    const outputSection = page.locator('#output');

    // Given
    // When
    await emailInput.fill('test@domain');
    await submitButton.click();

    // Then
    // Check validation error class is present on email field
    await expect(emailInput).toHaveClass(/error/);

    // Check output section is not visible
    await expect(outputSection).not.toBeVisible();
  });

  test('AC2: Non-numeric age and salary block submission and modal stays open', async ({ page }) => {
    // locate elements
    const addButton = page.locator('#addNewRecordButton');
    const modal = page.locator('.modal-content');
    const ageInput = modal.locator('#age');
    const salaryInput = modal.locator('#salary');
    const modalSubmit = modal.locator('button#submit');
    const tableRows = page.locator('.rt-tr-group');

    // Given - open modal by clicking Add
    await addButton.click();
    await expect(modal).toBeVisible();

    // capture initial row count
    const initialRowCount = await tableRows.count();

    // When
    await ageInput.fill('abc');
    await salaryInput.fill('12ab');
    await modalSubmit.click();

    // Then - modal remains open
    await expect(modal).toBeVisible();

    // no new row added
    const newRowCount = await tableRows.count();
    expect(newRowCount).toBe(initialRowCount);
  });

  test('AC3: No radio button is disabled and cannot be interacted with', async ({ page }) => {
    // locate elements
    const noRadio = page.locator('#noRadio');
    const groupLabel = page.locator('.custom-control-label[for="noRadio"]');

    // Then - disabled initially
    await expect(noRadio).toBeDisabled();

    // When - attempt to click using label to ensure click triggers
    await groupLabel.click({ force: true });

    // Then - remains disabled
    await expect(noRadio).toBeDisabled();

    // Verify no state change - radio is still not selected (checked = false)
    await expect(noRadio).not.toBeChecked();
  });

  test('AC4: UI remains stable under obstruction using scroll and visibility handling', async ({ page }) => {
    const emailInput = page.locator('#userEmail');
    const submitButton = page.locator('button#submit');

    // When - scroll email field into view
    await emailInput.scrollIntoViewIfNeeded();

    // Then
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();

    // Verify ability to type
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Verify submit button is clickable after scrolling
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});
