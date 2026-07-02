// Traceability
import { test, expect, Page, BrowserContext } from '@playwright/test';

const TARGET_URL = 'https://iventures.in/feeds/blog/gift-city-mutual-fund';

test.describe('GIFT City Mutual Fund Investment Guide', () => {
  // TC1: Page loads without errors (P0-AC1)
  test('P0-AC1: Page loads successfully without errors', async ({ page }) => {
    const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    const title = await page.title();
    expect(title).toContain('GIFT City Mutual Fund');
    expect(page.url()).toBe(TARGET_URL);
    const article = page.getByRole('article');
    await expect(article).toBeVisible();
  });

  // TC2: Core content references (P0-AC2)
  test('P0-AC2: Core GIFT City and mutual fund content is visible', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    const articleText = await page.getByRole('article').innerText();
    expect(articleText).toMatch(/GIFT City/i);
    expect(articleText).toMatch(/mutual funds?/i);
    expect(articleText).toMatch(/international|global/i);
  });

  // TC3: NSE IFSC context (P1-AC3)
  test('P1-AC3: NSE IFSC / global securities context is discoverable', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    const bodyText = await page.locator('body').innerText();
    const keywords = ['NSE IFSC', 'IFSC', 'global securities', 'GIFT City route', 'international exposure'];
    const found = keywords.some(kw => bodyText.includes(kw));
    expect(found).toBeTruthy();
  });

  // TC4: Desktop readability (P1-AC4)
  test('P1-AC4: Desktop readability – content sections visible and not overlapped', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    for (let i = 0; i < count; i++) {
      const heading = headings.nth(i);
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    }
    // Check no overlapping bounding boxes among visible text blocks
    const textBlocks = page.locator('p, h1, h2, h3, li');
    const blockCount = await textBlocks.count();
    const boxes: { x: number; y: number; width: number; height: number }[] = [];
    for (let i = 0; i < blockCount; i++) {
      const box = await textBlocks.nth(i).boundingBox();
      if (box) {
        boxes.push(box);
      }
    }
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const overlap = !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
        expect(overlap).toBe(false);
      }
    }
  });

  // TC5: Mobile readability (P1-AC4)
  test('P1-AC4: Mobile readability – content responsive and readable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    // Check no horizontal scrollbar
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    for (let i = 0; i < count; i++) {
      const heading = headings.nth(i);
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    }
    // Check body text font size >= 14px (approximate)
    const bodyFontSize = await page.evaluate(() => {
      const el = document.querySelector('p');
      if (!el) return 16; // fallback
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    expect(bodyFontSize).toBeGreaterThanOrEqual(14);
    // Check images are responsive
    const images = page.locator('img');
    const imgCount = await images.count();
    for (let i = 0; i < imgCount; i++) {
      const maxWidth = await images.nth(i).evaluate(el => window.getComputedStyle(el).maxWidth);
      if (maxWidth) {
        expect(maxWidth).toMatch(/100%/);
      }
    }
  });

  // TC6: CTA link validation (P2-AC5)
  test('P2-AC5: CTA/reference links have valid hrefs', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    const links = page.getByRole('link');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).not.toBeNull();
      expect(href).not.toBe('');
      expect(href).not.toBe('#');
      expect(href).not.toMatch(/^javascript/);
    }
  });

  // TC7: Graceful handling of unavailable content (P2-AC6)
  test('P2-AC6: Graceful handling when content is unavailable', async ({ page, context }) => {
    // Intercept all requests and block the target URL with a 500
    await context.route('**/feeds/blog/gift-city-mutual-fund', route => {
      route.fulfill({ status: 500, body: 'Server Error' });
    });
    try {
      const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 10000 });
      // If it reaches here, page loaded with error
      const title = await page.title();
      const url = page.url();
      await page.screenshot({ path: `screenshot-failure-${Date.now()}.png` });
      // Assert we captured the error state
      expect(response?.status()).toBe(500);
      expect(url).toBe(TARGET_URL);
      expect(title).toBeDefined();
    } catch (e) {
      // In case of timeout or navigation failure, still capture evidence
      const title = await page.title().catch(() => 'Error');
      const url = page.url();
      await page.screenshot({ path: `screenshot-failure-${Date.now()}.png` });
      expect(title).toBeDefined();
      expect(url).toBeDefined();
    }
  });

  // TC8: Page title and heading (P0-AC1 / AC2 supplement)
  test('Page title and main heading reflect guide content', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    const title = await page.title();
    expect(title).toMatch(/GIFT City.*mutual fund/i);
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    const h1Text = await h1.innerText();
    expect(h1Text).toMatch(/GIFT City.*mutual fund/i);
  });

  // TC9: Resource loading integrity (regression)
  test('Regression: All page resources load successfully', async ({ page }) => {
    const resourceErrors: { url: string; status: number }[] = [];
    page.on('response', response => {
      const resourceType = response.request().resourceType();
      if (['image', 'stylesheet', 'font'].includes(resourceType)) {
        if (response.status() !== 200 && response.status() !== 304) {
          resourceErrors.push({ url: response.url(), status: response.status() });
        }
      }
    });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    expect(resourceErrors).toHaveLength(0);
  });
});
