// Traceability
import { test, expect } from '@playwright/test';

const TARGET_URL = 'https://iventures.in/feeds/blog/gift-city-mutual-fund';
const KEY_PHRASES = ['GIFT City', 'mutual fund'];
const KEY_VARIATIONS = ['IFSC', 'global', 'international'];

test.describe('GIFT City Mutual Fund Guide – Regression Guardrails', () => {

  test('Page loads with 200 status and meaningful content', async ({ page }) => {
    const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);

    const title = await page.title();
    expect(title).not.toBe('');
    expect(title.toLowerCase()).toContain('gift city');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(100);
  });

  test('Core educational keywords are present in the article', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

    // Use the main article or fall back to body
    const articleLocator = page.locator('article').or(page.locator('main')).or(page.locator('body'));
    const articleText = await articleLocator.innerText();
    const lowerText = articleText.toLowerCase();

    // Assert required terms
    for (const phrase of KEY_PHRASES) {
      expect(lowerText).toContain(phrase.toLowerCase());
    }

    // Assert at least one of the related terms exists
    const foundRelated = KEY_VARIATIONS.some(term => lowerText.includes(term.toLowerCase()));
    expect(foundRelated).toBeTruthy();
  });

  test('All visible links have non-empty href values', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

    // Collect all visible links
    const links = page.locator('a:visible');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).not.toBeNull();
      expect(href!.trim()).not.toBe('');
    }
  });

  test('Desktop viewport (1440×900): no overlapping content sections', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

    // Scroll to bottom to trigger lazy-loaded content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check for overlaps among all visible elements (excluding script/style meta)
    const hasOverlap = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*:not(script):not(style):not(meta)')).filter(
        el => (el as HTMLElement).offsetHeight > 0 && (el as HTMLElement).offsetWidth > 0
      );
      const rects = elements.map(el => (el as HTMLElement).getBoundingClientRect());
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i];
          const b = rects[j];
          const isOverlap = !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
          if (isOverlap) {
            // Ignore parent-child overlaps (typical nested structure)
            const parentContainsChild = (a.left <= b.left && a.top <= b.top && a.right >= b.right && a.bottom >= b.bottom) ||
                                        (b.left <= a.left && b.top <= a.top && b.right >= a.right && b.bottom >= a.bottom);
            if (!parentContainsChild) return true;
          }
        }
      }
      return false;
    });

    expect(hasOverlap).toBe(false);

    // Ensure at least three paragraphs have visible height
    const paragraphCount = await page.locator('p').count();
    expect(paragraphCount).toBeGreaterThanOrEqual(3);
  });

  test('Mobile viewport (390×844): article readable without overlap', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const hasOverlap = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*:not(script):not(style):not(meta)')).filter(
        el => (el as HTMLElement).offsetHeight > 0 && (el as HTMLElement).offsetWidth > 0
      );
      const rects = elements.map(el => (el as HTMLElement).getBoundingClientRect());
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i];
          const b = rects[j];
          const isOverlap = !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
          if (isOverlap) {
            const parentContainsChild = (a.left <= b.left && a.top <= b.top && a.right >= b.right && a.bottom >= b.bottom) ||
                                        (b.left <= a.left && b.top <= a.top && b.right >= a.right && b.bottom >= a.bottom);
            if (!parentContainsChild) return true;
          }
        }
      }
      return false;
    });

    expect(hasOverlap).toBe(false);

    // Check headings are visible
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    for (let i = 0; i < headingCount; i++) {
      await expect(headings.nth(i)).toBeVisible();
    }
  });

  test('Page failure is captured with evidence for defect reporting', async ({ page }) => {
    // Simulate failure by navigating to a non-existent page
    const response = await page.goto('https://iventures.in/feeds/blog/does-not-exist', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => null);
    const screenshotPath = 'test-results/failure-capture.png';

    // Capture evidence regardless of status
    const title = await page.title();
    const url = page.url();
    const statusCode = response?.status() ?? 0;
    const consoleLogs: string[] = [];
    page.on('console', msg => consoleLogs.push(msg.text()));

    await page.screenshot({ path: screenshotPath, fullPage: true });

    // Assert that we captured what we need (the test will fail with evidence)
    expect(statusCode).not.toBe(200);
    console.log(`Failure captured. Title: ${title}, URL: ${url}, Status: ${statusCode}, Console: ${consoleLogs.join('; ')}`);
    // Re-throw a descriptive error to make test fail with evidence
    throw new Error(`Page failed to load. Evidence captured: title='${title}', url='${url}', status=${statusCode}, screenshot='${screenshotPath}'`);
  });

});
