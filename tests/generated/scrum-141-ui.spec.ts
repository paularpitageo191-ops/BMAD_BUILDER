// Traceability
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://iventures.in/feeds/blog/gift-city-mutual-fund';

test.describe('GIFT City Mutual Fund Investment Guide', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('AC1 - Page loads successfully without errors', async ({ page }) => {
    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/GIFT City Mutual Fund/);
    // Check no visible browser error
    const errorAlert = page.locator('.browser-error, [class*="error"]');
    await expect(errorAlert).toHaveCount(0);
  });

  test('AC2 - Core GIFT City mutual fund content is visible', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await expect(page.getByText('GIFT City', { exact: false })).toBeVisible();
    await expect(page.getByText('mutual fund', { exact: false })).toBeVisible();
    const globalKeywords = ['international', 'global', 'worldwide'];
    let foundGlobal = false;
    for (const keyword of globalKeywords) {
      const el = page.getByText(keyword, { exact: false });
      if (await el.count() > 0) {
        foundGlobal = true;
        break;
      }
    }
    expect(foundGlobal).toBe(true);
  });

  test('AC3 - NSE IFSC / global securities context is discoverable', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const bodyText = await page.locator('article, main').textContent() || page.locator('body').textContent() || '';
    const hasIFSC = /NSE IFSC|IFSC/i.test(bodyText);
    expect(hasIFSC).toBe(true);
    const hasGlobalSecurities = /global securities|global investments|international securities/i.test(bodyText);
    expect(hasGlobalSecurities).toBe(true);
  });

  test('AC4 - Desktop viewport readability', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    // Scroll to bottom to trigger layout
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500); // allow lazy images to settle
    // Check for overlapping by ensuring no element has negative clip or hidden overflow
    const overlapCheck = await page.evaluate(() => {
      const all = document.querySelectorAll('h1, h2, h3, p, img, a');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        // Check if any part is outside viewport horizontally
        if (rect.right > window.innerWidth || rect.left < 0) return false;
      }
      return true;
    });
    expect(overlapCheck).toBe(true);
    // Check no horizontal scrollbar
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalScroll).toBe(false);
  });

  test('AC4 - Mobile viewport readability', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalScroll).toBe(false);
    // Check no overlapping text
    const noOverlap = await page.evaluate(() => {
      const texts = document.querySelectorAll('p, h1, h2, h3, li');
      for (const t of texts) {
        const rect = t.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        // Check if text is partially outside viewport (exception for overflow hidden)
        if (rect.right > window.innerWidth + 2 || rect.left < -2) return false;
      }
      return true;
    });
    expect(noOverlap).toBe(true);
  });

  test('AC5 - CTA / reference links are visible and have valid href', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const links = await page.locator('article a, main a').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).not.toBeNull();
      expect(href).not.toBe('');
      expect(href).not.toBe('#');
      expect(href).not.toBe('javascript:void(0)');
      await expect(link).toBeVisible();
    }
    // Click the first visible link that is internal (not external) to avoid navigation risks
    const internalLink = page.locator('article a[href^="/"], main a[href^="/"]').first();
    if (await internalLink.count() > 0) {
      await internalLink.click();
      // Wait briefly to ensure no crash
      await page.waitForTimeout(1000);
      const title = await page.title();
      expect(title).toBeTruthy();
    }
  });

  test('AC6 - Graceful evidence capture when content is unavailable (route interception)', async ({ page }) => {
    // Simulate a 404 on the main content
    await page.route(BASE_URL, route => {
      route.fulfill({ status: 404, body: '<html><title>Not Found</title><body>Not Found</body></html>' });
    });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const title = await page.title();
    expect(title).not.toBeNull();
    const url = page.url();
    expect(url).toBe(BASE_URL);
    // Take screenshot (file saved by Playwright test runner, but we just verify no exception)
    await page.screenshot({ path: 'test-results/ac6-unavailable.png' });
    // Assert failure condition (test would fail at expect)
    await expect(page.locator('body')).toContainText('Not Found');
  });

  test('AC6 - Page returns 404 when resource missing (broken URL)', async ({ page }) => {
    const brokenUrl = 'https://iventures.in/feeds/blog/gift-city-mutual-fund-broken';
    const response = await page.goto(brokenUrl, { waitUntil: 'networkidle' });
    const status = response?.status() || 0;
    expect(status === 404 || status >= 500).toBeTruthy();
    await page.screenshot({ path: 'test-results/ac6-broken-url.png' });
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('Regression - Expected content sections present (heading, date, author)', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    // Check H1
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    const h1Text = await h1.textContent();
    expect(h1Text?.trim().length).toBeGreaterThan(0);
    // Check date reference (e.g., "January 5, 2025" pattern)
    const datePattern = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/;
    const bodyText = await page.locator('article, main').textContent() || '';
    expect(bodyText).toMatch(datePattern);
    // Check author byline (try common patterns: "By Name" or <span> with author class)
    const authorElement = page.locator('.author, .byline, [class*="author"]');
    await expect(authorElement).toBeVisible();
    const authorText = await authorElement.textContent();
    expect(authorText?.trim().length).toBeGreaterThan(0);
  });
});
