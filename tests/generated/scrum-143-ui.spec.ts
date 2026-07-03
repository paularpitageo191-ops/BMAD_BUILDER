// Traceability
import { test, expect } from '@playwright/test';

const TARGET_URL = 'https://iventures.in/feeds/blog/gift-city-mutual-fund';

// Synthetic test data derived from GIFT_City_MF_Test_Data.xlsx
const INV_001 = {
  name: 'Ravi Kumar',
  email: 'ravi@example.com',
  pan: 'ABCDE1234F',
  residency: 'Indian',
  amount: 10000,
  kyc: true
};

const INV_003 = {
  name: 'Neha Singh',
  email: 'neha@example.com',
  pan: 'INCOMPLETE',
  residency: 'NRI',
  amount: 5000,
  kyc: false
};

const AMT_004 = { amount: 1000 };
const AMT_005 = { amount: 500000 };
const AMT_008 = { amount: -1000 };

test.describe('GIFT City Mutual Fund Investor Journey', () => {
  test('TC01: Guide page loads with core GIFT City MF content (AC1)', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    await expect(page).toHaveURL(TARGET_URL);
    // Check for no console errors (we attach listener)
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForLoadState('domcontentloaded');
    const bodyText = await page.locator('body').innerText();
    const containsGiftCity = /GIFT City|IFSC|global securities/i.test(bodyText);
    expect(containsGiftCity).toBeTruthy();
    expect(consoleErrors.length).toBe(0);
  });

  test('TC02: CTA discoverable and navigates correctly (AC2)', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    // Close any popups if visible
    const closeButton = page.getByRole('button', { name: /close|dismiss|×/i }).first();
    if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeButton.click();
    }
    // Find CTA links/buttons
    const ctaLinks = page.getByRole('link').filter({ hasText: /invest|enquiry|contact|get started|next step/i });
    const ctaButtons = page.getByRole('button').filter({ hasText: /invest|enquiry|contact|get started|next step/i });
    const ctaCount = await ctaLinks.count() + await ctaButtons.count();
    expect(ctaCount).toBeGreaterThanOrEqual(1);

    // Click the first visible CTA (prefer link)
    let clicked = false;
    for (const link of await ctaLinks.all()) {
      if (await link.isVisible()) {
        await link.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      const firstButton = ctaButtons.first();
      await firstButton.click();
    }
    await page.waitForLoadState('load');
    expect(page.url()).not.toBe(TARGET_URL);
    // Check no page error (we rely on Playwright not throwing)
  });

  test('TC03: Eligible investor INV-001 journey (AC3/AC6)', async ({ page }) => {
    // First navigate to CTA destination (reuse TC02 logic, but for simplicity go directly)
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    // Click first CTA
    const ctaLink = page.getByRole('link').filter({ hasText: /invest|enquiry|contact|get started|next step/i }).first();
    await ctaLink.click();
    await page.waitForLoadState('load');
    const formUrl = page.url();
    // Fill form fields generically
    const nameField = page.getByLabel(/name|full name/i).first();
    const emailField = page.getByLabel(/email/i).first();
    const panField = page.getByLabel(/pan/i).first();
    const amountField = page.getByLabel(/amount|investment|contribution/i).first();
    const submitButton = page.getByRole('button', { name: /submit|invest|enquire|send/i }).first();

    await nameField.fill(INV_001.name);
    await emailField.fill(INV_001.email);
    if (await panField.isVisible()) await panField.fill(INV_001.pan);
    await amountField.fill(String(INV_001.amount));
    await submitButton.click();

    await page.waitForLoadState('networkidle');
    // Verify success: URL changed or success message visible
    const successVisible = await page.getByText(/success|thank you|confirmed|next step/i).isVisible().catch(() => false);
    expect(page.url() !== formUrl || successVisible).toBeTruthy();
  });

  test('TC04: Ineligible investor INV-003 blocked (AC4)', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    const ctaLink = page.getByRole('link').filter({ hasText: /invest|enquiry|contact|get started|next step/i }).first();
    await ctaLink.click();
    await page.waitForLoadState('load');
    const formUrl = page.url();

    const nameField = page.getByLabel(/name|full name/i).first();
    const emailField = page.getByLabel(/email/i).first();
    const panField = page.getByLabel(/pan/i).first();
    const amountField = page.getByLabel(/amount|investment|contribution/i).first();
    const submitButton = page.getByRole('button', { name: /submit|invest|enquire|send/i }).first();

    await nameField.fill(INV_003.name);
    await emailField.fill(INV_003.email);
    await panField.fill(INV_003.pan);
    await amountField.fill(String(INV_003.amount));
    await submitButton.click();
    await page.waitForTimeout(2000); // wait for validation

    const currentUrl = page.url();
    const errorVisible = await page.getByText(/ineligible|KYC|error|invalid/).isVisible().catch(() => false);
    // The form should not have navigated away or should show error
    expect(currentUrl === formUrl || errorVisible).toBeTruthy();
  });

  test('TC05: Minimum amount 1000 accepted (AMT-004)', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    const ctaLink = page.getByRole('link').filter({ hasText: /invest|enquiry|contact|get started|next step/i }).first();
    await ctaLink.click();
    await page.waitForLoadState('load');
    const nameField = page.getByLabel(/name|full name/i).first();
    const emailField = page.getByLabel(/email/i).first();
    const amountField = page.getByLabel(/amount|investment|contribution/i).first();
    const submitButton = page.getByRole('button', { name: /submit|invest|enquire|send/i }).first();
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await amountField.fill(String(AMT_004.amount));
    await submitButton.click();
    await page.waitForLoadState('networkidle');
    // No amount-specific error expected
    const amountError = await page.getByText(/minimum|at least|must be/i).isVisible().catch(() => false);
    expect(amountError).toBeFalsy();
  });

  test('TC06: Maximum amount 500000 accepted (AMT-005)', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    const ctaLink = page.getByRole('link').filter({ hasText: /invest|enquiry|contact|get started|next step/i }).first();
    await ctaLink.click();
    await page.waitForLoadState('load');
    const nameField = page.getByLabel(/name|full name/i).first();
    const emailField = page.getByLabel(/email/i).first();
    const amountField = page.getByLabel(/amount|investment|contribution/i).first();
    const submitButton = page.getByRole('button', { name: /submit|invest|enquire|send/i }).first();
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await amountField.fill(String(AMT_005.amount));
    await submitButton.click();
    await page.waitForLoadState('networkidle');
    const maxError = await page.getByText(/maximum|exceed|limit/i).isVisible().catch(() => false);
    expect(maxError).toBeFalsy();
  });

  test('TC07: Negative amount -1000 rejected (AMT-008)', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    const ctaLink = page.getByRole('link').filter({ hasText: /invest|enquiry|contact|get started|next step/i }).first();
    await ctaLink.click();
    await page.waitForLoadState('load');
    const nameField = page.getByLabel(/name|full name/i).first();
    const emailField = page.getByLabel(/email/i).first();
    const amountField = page.getByLabel(/amount|investment|contribution/i).first();
    const submitButton = page.getByRole('button', { name: /submit|invest|enquire|send/i }).first();
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await amountField.fill(String(AMT_008.amount));
    await submitButton.click();
    await page.waitForTimeout(2000);
    const errorVisible = await page.getByText(/invalid amount|positive number|negative|error/i).isVisible().catch(() => false);
    expect(errorVisible).toBeTruthy();
  });

  test('TC08: Disclosure compliance DISC-002 (AC4)', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    const bodyText = await page.locator('body').innerText();
    // DISC-002 expected phrase: "Investment in mutual funds is subject to market risk"
    const discPattern = /subject to market risk|mutual fund investments are subject to market risk/i;
    expect(discPattern.test(bodyText)).toBeTruthy();
  });
});
