// Traceability
import { test, expect, Page } from '@playwright/test';

const TARGET_URL = 'https://iventures.in/feeds/blog/gift-city-mutual-fund';
const FUND_NAME = 'GC Multi Cap Fund'; // Placeholder from FUND-GC-001 – update from Excel
const KEY_PHRASES = [
  'GIFT City',
  'mutual fund',
  'IFSC',
  'global securities',
  'NSE IFSC',
  'investment',
];

// Helper: check that page loads without console errors
async function assertNoConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
}

test('TC01: Guide page loads with GIFT City MF content', async ({ page }) => {
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // Title check
  await expect(page).toHaveTitle(/GIFT City|Mutual Fund/i);

  // Content reference check
  await expect(page.locator('body')).toContainText(/GIFT City|IFSC|global securities/i);

  // Console error check
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toEqual([]);
});

test('TC02: Discover and interact with visible CTAs', async ({ page }) => {
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // Look for CTA links
  const ctaLocator = page.getByRole('link', {
    name: /invest|enquire|contact|get started/i,
  });
  await expect(ctaLocator.first()).toBeVisible({ timeout: 5000 });

  // Click first CTA and ensure no 404
  const [response] = await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }),
    ctaLocator.first().click(),
  ]);
  expect(response?.status()).not.toBe(404);
});

test('TC08: Fund display references FUND-GC-001 on guide page', async ({ page }) => {
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // Check fund name appears
  await expect(page.getByText(FUND_NAME)).toBeVisible({ timeout: 5000 });

  // Optionally check asset class – adapt based on actual content
  // Expect to see something like 'Equity' or 'Hybrid' – using a flexible pattern
  const assetKeywords = ['Equity', 'Debt', 'Hybrid', 'Multi Cap', 'Large Cap', 'Sectoral'];
  const bodyContent = await page.locator('body').textContent();
  const foundAsset = assetKeywords.some((keyword) =>
    bodyContent?.toLowerCase().includes(keyword.toLowerCase())
  );
  expect(foundAsset).toBe(true);
});

test('TC09: Regression: Guide page content stability', async ({ page }) => {
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // 1. Verify key phrases still present
  const bodyText = await page.locator('body').textContent();
  for (const phrase of KEY_PHRASES) {
    expect(bodyText).toContain(phrase);
  }

  // 2. Check number of fund items (e.g., list items mentioning funds)
  const fundItems = page.locator('body').getByText(/fund|scheme/i);
  const count = await fundItems.count();
  // Baseline: assume > 0. In a real regression suite we compare against stored value.
  expect(count).toBeGreaterThan(0);

  // 3. Verify first CTA text is unchanged (sample)
  const firstCTA = page.getByRole('link', {
    name: /invest|enquire|contact|get started/i,
  });
  if (await firstCTA.count() > 0) {
    const ctaText = await firstCTA.first().textContent();
    // Example baseline – store actual expected value from initial run
    expect(ctaText?.trim()).toBeDefined();
    // Could compare against a snapshot variable here
  }
});
