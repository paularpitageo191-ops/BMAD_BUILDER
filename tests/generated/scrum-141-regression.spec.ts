// Traceability
import { test, expect, Page } from '@playwright/test';

test.describe('GIFT City Mutual Fund Investment Guide - Regression', () => {
  const targetUrl = 'https://iventures.in/feeds/blog/gift-city-mutual-fund';

  test.beforeEach(async ({ page }) => {
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
  });

  test('Regression - Resource loading integrity for images, CSS, and fonts', async ({ page }) => {
    const brokenResources: string[] = [];

    // Intercept network responses and collect non-successful resource requests
    page.on('response', (response) => {
      const resourceType = response.request().resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        const status = response.status();
        if (status >= 400) {
          brokenResources.push(`${response.url()} -> ${status}`);
        }
      }
    });

    // Wait for all resources to finish loading
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow late-loading images

    expect(brokenResources).toHaveLength(0,
      `The following resources returned errors:\n${brokenResources.join('\n')}`
    );
  });

  test('Regression - Core content references to GIFT City and mutual funds persist', async ({ page }) => {
    // Use article role or main content selector
    const article = page.getByRole('article');
    const articleText = await article.textContent() || '';

    // Assert core keywords are present (case-insensitive)
    expect(articleText.toLowerCase()).toContain('gift city');
    expect(articleText.toLowerCase()).toContain('mutual fund');
    // At least one of global or international in investment context
    const containsGlobal = articleText.toLowerCase().includes('global');
    const containsInternational = articleText.toLowerCase().includes('international');
    expect(containsGlobal || containsInternational).toBeTruthy();
  });

  test('Regression - CTA and reference links have valid href attributes and are visible', async ({ page }) => {
    const links = page.getByRole('link');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      const isVisible = await link.isVisible();

      // Only validate visible links (skip hidden or decorative)
      if (isVisible) {
        expect(href).not.toBeNull();
        expect(href!.length).toBeGreaterThan(0);
      }
    }
  });

  test('Regression - Mobile viewport does not introduce horizontal scroll or content clipping', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(targetUrl, { waitUntil: 'networkidle' });

    // Check for horizontal scrollbar using page width
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 390;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);

    // Scroll to each heading and verify it is visible in the viewport
    const headings = page.getByRole('heading', { level: 1 }).or(page.getByRole('heading', { level: 2 })).or(page.getByRole('heading', { level: 3 }));
    const headingCount = await headings.count();
    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i);
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    }
  });
});
