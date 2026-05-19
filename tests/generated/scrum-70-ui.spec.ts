// Traceability
// Functional Areas: Radio Button, Text Box, Web Tables
// Source References: AC1, AC2, AC3, Screenshots: Disabled option, Screenshots: Invalid numeric input, Screenshots: Text Box Validation, Screenshots: Valid input, Test Data: empty/null inputs, Test Data: invalid email formats, Test Data: non-numeric values
// Execution Readiness: strong
// Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
import { test, expect, Page } from '@playwright/test';

const ELEMENTS_URL = 'https://demoqa.com/elements';

test.describe('DemoQA Elements – Negative Path Validation (UI)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ELEMENTS_URL);
    await page.waitForLoadState('networkidle');
  });

  // Helper to click a left menu item by text
  async function clickLeftMenuItem(page: Page, label: string) {
    await page.locator(`text=${label}`).first().click();
    await page.waitForTimeout(500); // allow section to load
  }

  // Helper: check field validity (CSS pseudo-class :invalid)
  async function expectFieldInvalid(page: Page, selector: string) {
    const isInvalid = await page.locator(selector).evaluate(el => (el as HTMLInputElement).validity.valid === false);
    expect(isInvalid).toBe(true);
  }

  // Helper: check field has red border (class or computed style)
  async function expectFieldHasErrorStyle(page: Page, selector: string) {
    const borderColor = await page.locator(selector).evaluate(el =>
      window.getComputedStyle(el).getPropertyValue('border-color')
    );
    // DemoQA uses red rgb(220, 53, 69) or similar
    expect(borderColor).toMatch(/rgb\(220,\s*53,\s*69\)|rgba\(220,\s*53,\s*69,\s*1\)|#dc3545|red/i);
  }

  // Helper: check output section visibility
  async function expectOutputVisible(page: Page, visible: boolean) {
    const output = page.locator('#output');
    if (visible) {
      await expect(output).toBeVisible();
      await expect(output).not.toBeEmpty();
    } else {
      await expect(output).not.toBeVisible();
    }
  }

  // Helper: open registration modal in Web Tables
  async function openWebTableAddModal(page: Page) {
    await page.locator('#addNewRecordButton').click();
    await expect(page.locator('.modal-dialog')).toBeVisible();
  }

  // Helper: fill web table registration fields
  async function fillWebTableModal(page: Page, data: { firstName?: string; lastName?: string; email?: string; age?: string; salary?: string; department?: string }) {
    if (data.firstName) await page.locator('#firstName').fill(data.firstName);
    if (data.lastName) await page.locator('#lastName').fill(data.lastName);
    if (data.email) await page.locator('#userEmail').fill(data.email);
    if (data.age) await page.locator('#age').fill(data.age);
    if (data.salary) await page.locator('#salary').fill(data.salary);
    if (data.department) await page.locator('#department').fill(data.department);
  }

  // Helper: submit web table modal
  async function submitWebTableModal(page: Page) {
    await page.locator('button#submit').click();
  }

  // Helper: get number of rows in web table
  async function getWebTableRowCount(page: Page): Promise<number> {
    return await page.locator('.rt-tr-group').count();
  }

  // ==================== AC1 – Email Validation ====================

  test('Email validation rejects missing TLD', async ({ page }) => {
    await clickLeftMenuItem(page, 'Text Box');
    await page.locator('#userEmail').fill('test@domain');
    await page.locator('#submit').click();
    await expectFieldInvalid(page, '#userEmail');
    await expectOutputVisible(page, false);
  });

  test('Email validation rejects empty input', async ({ page }) => {
    await clickLeftMenuItem(page, 'Text Box');
    await page.locator('#userEmail').fill('');
    await page.locator('#submit').click();
    await expectFieldInvalid(page, '#userEmail');
    await expectOutputVisible(page, false);
  });

  test('Positive email path – output section appears', async ({ page }) => {
    await clickLeftMenuItem(page, 'Text Box');
    await page.locator('#userEmail').fill('test@example.com');
    await page.locator('#submit').click();
    const isInvalid = await page.locator('#userEmail').evaluate(el => (el as HTMLInputElement).validity.valid);
    expect(isInvalid).toBe(true);
    await expectOutputVisible(page, true);
    await expect(page.locator('#output')).toContainText('test@example.com');
  });

  // ==================== AC2 – Web Tables Validation ====================

  test('Web tables – invalid age field blocks submission', async ({ page }) => {
    await clickLeftMenuItem(page, 'Web Tables');
    await openWebTableAddModal(page);
    const initialRowCount = await getWebTableRowCount(page);
    await fillWebTableModal(page, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      age: 'abc',
      salary: '50000',
      department: 'QA'
    });
    await submitWebTableModal(page);
    // Modal should still be open
    await expect(page.locator('.modal-dialog')).toBeVisible();
    // Age field should be invalid
    await expectFieldInvalid(page, '#age');
    // No new row added
    const newRowCount = await getWebTableRowCount(page);
    expect(newRowCount).toBe(initialRowCount);
  });

  test('Web tables – invalid salary field blocks submission', async ({ page }) => {
    await clickLeftMenuItem(page, 'Web Tables');
    await openWebTableAddModal(page);
    const initialRowCount = await getWebTableRowCount(page);
    await fillWebTableModal(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      age: '30',
      salary: '12ab',
      department: 'Dev'
    });
    await submitWebTableModal(page);
    await expect(page.locator('.modal-dialog')).toBeVisible();
    await expectFieldInvalid(page, '#salary');
    const newRowCount = await getWebTableRowCount(page);
    expect(newRowCount).toBe(initialRowCount);
  });

  test('Web tables – positive submission', async ({ page }) => {
    await clickLeftMenuItem(page, 'Web Tables');
    await openWebTableAddModal(page);
    const initialRowCount = await getWebTableRowCount(page);
    await fillWebTableModal(page, {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@test.com',
      age: '28',
      salary: '60000',
      department: 'Engineering'
    });
    await submitWebTableModal(page);
    await expect(page.locator('.modal-dialog')).not.toBeVisible();
    const newRowCount = await getWebTableRowCount(page);
    expect(newRowCount).toBe(initialRowCount + 1);
  });

  test('Web tables – empty age and salary fields', async ({ page }) => {
    await clickLeftMenuItem(page, 'Web Tables');
    await openWebTableAddModal(page);
    const initialRowCount = await getWebTableRowCount(page);
    await fillWebTableModal(page, {
      firstName: 'Bob',
      lastName: 'Brown',
      email: 'bob@test.com',
      age: '',
      salary: '',
      department: 'Support'
    });
    await submitWebTableModal(page);
    await expect(page.locator('.modal-dialog')).toBeVisible();
    // Empty numeric fields should be invalid
    await expectFieldInvalid(page, '#age');
    await expectFieldInvalid(page, '#salary');
    const newRowCount = await getWebTableRowCount(page);
    expect(newRowCount).toBe(initialRowCount);
  });

  // ==================== AC3 – Radio Button Validation ====================

  test('Radio button – "No" option is disabled', async ({ page }) => {
    await clickLeftMenuItem(page, 'Radio Button');
    await expect(page.locator('#noRadio')).toBeDisabled();
  });

  test('Radio button – click disabled "No" does nothing', async ({ page }) => {
    await clickLeftMenuItem(page, 'Radio Button');
    // Ensure no radio is selected initially
    const yesRadio = page.locator('#yesRadio');
    const impressiveRadio = page.locator('#impressiveRadio');
    // Click an enabled radio first to have a baseline if not selected
    if (await yesRadio.isChecked() === false && await impressiveRadio.isChecked() === false) {
      await yesRadio.click();
      await expect(page.locator('.text-success')).toContainText('Yes');
    }
    const feedbackBefore = await page.locator('.text-success').textContent();
    const noRadio = page.locator('#noRadio');
    await noRadio.click({ force: true }); // force because disabled
    // Verify noRadio is still disabled
    await expect(noRadio).toBeDisabled();
    // Feedback text should not have changed to "No"
    const feedbackAfter = await page.locator('.text-success').textContent();
    expect(feedbackAfter).toBe(feedbackBefore);
  });

  test('Radio button – positive path for "Yes"', async ({ page }) => {
    await clickLeftMenuItem(page, 'Radio Button');
    await page.locator('#yesRadio').click();
    await expect(page.locator('#yesRadio')).toBeChecked();
    await expect(page.locator('.text-success')).toContainText('Yes');
  });

  // ==================== Email special characters ====================

  test('Email validation rejects special characters', async ({ page }) => {
    await clickLeftMenuItem(page, 'Text Box');
    await page.locator('#userEmail').fill('test!@example.com');
    await page.locator('#submit').click();
    await expectFieldInvalid(page, '#userEmail');
    await expectOutputVisible(page, false);
  });
});
