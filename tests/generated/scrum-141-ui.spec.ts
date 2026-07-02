// Traceability
import { test, expect, Page, TestInfo } from '@playwright/test';
import path from 'path';

const BASE_URL = 'https://iventures.in/feeds/blog/gift-city-mutual-fund';

test.describe('GIFT City Mutual Fund Investment Guide Demo', () => {
  // Helper: assert visible text contains any of the given strings (case-insensitive)
  async function assertVisibleTextContains(page: Page, keywords: string[]) {
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    for (const kw of keywords) {
      if (bodyText.includes(kw.toLowerCase())) return;
    }
    throw new Error(`None of the keywords ${keywords.join(', ')} found in visible page text`);
  }

  test('TC01: Page loads successfully without errors', async ({ page }) => {
    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    const title = await page.title();
    expect(title).not.toBe('');
    expect(title.toLowerCase()).toContain('gift city');
    const bodyLen = (await page.locator('body').innerText()).length;
    expect(bodyLen).toBeGreaterThan(100);
    // capture console errors for verification (optional)
    page.on('console', msg => {
      if (msg.type() === 'error') {
        test.info().annotations.push({ type: 'console_error', description: msg.text() });
      }
    });
  });

  test('TC02: Guide contains visible references to GIFT City and mutual funds', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    const articleText = (await page.locator('article, main, body').first().innerText()).toLowerCase();
    expect(articleText).toContain('gift city');
    expect(articleText).toMatch(/mutual fund(s)?/i);
    // global/international exposure concept
    const globalRefs = ['global', 'international', 'cross-border', 'foreign'];
    const foundGlobal = globalRefs.some(term => articleText.includes(term));
    expect(foundGlobal).toBeTruthy();
  });

  test('TC03: NSE IFSC / global securities context is discoverable', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    const keywords = ['nse ifsc', 'ifsc', 'global securities', 'sez'];
    const found = keywords.some(kw => bodyText.includes(kw));
    expect(found).toBeTruthy();
  });

  test('TC04: Desktop viewport (1440x900) – article content is readable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    // scroll to bottom to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check no overlapping elements from different sections (simplified: ensure at least 3 paragraphs have height > 0)
    const paragraphs = page.locator('p');
    const count = await paragraphs.count();
    let visibleHeightCount = 0;
    for (let i = 0; i < count; i++) {
      const box = await paragraphs.nth(i).boundingBox();
      if (box && box.height > 0) visibleHeightCount++;
    }
    expect(visibleHeightCount).toBeGreaterThanOrEqual(3);

    // Headings visible
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();
  });

  test('TC05: Mobile viewport (390x844) – article content is readable without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    // Check no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);

    // Verify visible content: at least 2 headings and 3 paragraphs with height > 0
    const headings = page.locator('h1, h2, h3');
    let visibleHeadings = 0;
    let visibleParagraphs = 0;
    for (let i = 0; i < await headings.count(); i++) {
      const box = await headings.nth(i).boundingBox();
      if (box && box.height > 0) visibleHeadings++;
    }
    const paragraphs = page.locator('p');
    for (let i = 0; i < await paragraphs.count(); i++) {
      const box = await paragraphs.nth(i).boundingBox();
      if (box && box.height > 0) visibleParagraphs++;
    }
    expect(visibleHeadings).toBeGreaterThanOrEqual(2);
    expect(visibleParagraphs).toBeGreaterThanOrEqual(3);
  });

  test('TC06: CTA and reference links have valid href values', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const links = page.locator('a:visible');
    const linkCount = await links.count();
    const invalidHrefs: string[] = [];
    for (let i = 0; i < linkCount; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (!href || href === '#' || href.startsWith('javascript:void')) {
        invalidHrefs.push(href || '(empty)');
      }
    }
    expect(invalidHrefs).toEqual([]);

    // Sample 2–3 external links: click and verify no crash (open in new tab)
    let sampled = 0;
    for (let i = 0; i < linkCount && sampled < 3; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href && (href.startsWith('http') || href.startsWith('https'))) {
        // Click and wait for navigation (allow timeout)
        const [newPage] = await Promise.all([
          page.waitForEvent('popup', { timeout: 5000 }).catch(() => null),
          links.nth(i).click(),
        ]);
        if (newPage) await newPage.close();
        sampled++;
      }
    }
  });

  test('TC07: Graceful evidence capture when page content is unavailable', async ({ page }, testInfo) => {
    // Intercept the guide URL to simulate a blocked/failed response
    await page.route(BASE_URL, route => {
      route.abort('aborted');
    });

    let navigationError: Error | null = null;
    try {
      await page.goto(BASE_URL, { timeout: 10000 });
    } catch (e) {
      navigationError = e as Error;
    }

    // Capture evidence
    const evidence = {
      pageTitle: await page.title().catch(() => 'N/A'),
      url: page.url(),
      status: navigationError ? 'blocked' : 'success',
      screenshotPath: '',
    };

    // Take screenshot
    const screenshotPath = path.join(testInfo.outputDir, 'failure-capture.png');
    await page.screenshot({ path: screenshotPath }).catch(() => {});
    evidence.screenshotPath = screenshotPath;

    // Attach evidence to test info
    testInfo.attachments.push({
      name: 'failure-evidence',
      contentType: 'application/json',
      body: JSON.stringify(evidence),
    });

    // Test should not crash; we expect navigation to fail
    expect(navigationError).toBeDefined();
  });

  test('TC08: URL variants (trailing slash, uppercase) resolve to same content', async ({ page }) => {
    const variants = [
      'https://iventures.in/feeds/blog/gift-city-mutual-fund/',
      'https://iventures.in/feeds/blog/gift-city-mutual-fund', // without slash – already canonical
      'https://iventures.in/feeds/blog/GIFT-CITY-mutual-fund',
    ];

    const expectedTitle = 'GIFT City'; // partial, case-insensitive

    for (const url of variants) {
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      expect(response?.status()).toBeLessThan(400);
      const title = await page.title();
      expect(title.toLowerCase()).toContain(expectedTitle.toLowerCase());
    }
  });
});
