// Traceability
import { test, expect } from '@playwright/test';

const PAGE_URL = 'https://iventures.in/feeds/blog/gift-city-mutual-fund';

test.describe('Regression: GIFT City investment guide structural integrity', () => {
  test('Page loads successfully without network errors', async ({ page }) => {
    const response = await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    const pageTitle = await page.title();
    expect(pageTitle).toContain('GIFT City');
    // Confirm no browser error page is displayed
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('This site can’t be reached');
    expect(bodyText).not.toContain('ERR_CONNECTION_REFUSED');
  });

  test('Article core metadata (h1, date, author) remains visible', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' });

    // Verify h1 exists and is non-empty
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const headingText = await heading.textContent();
    expect(headingText?.trim().length).toBeGreaterThan(0);

    // Verify date text is visible (common patterns: e.g., "January 5, 2025" or "05 Jan 2025")
    // Use a generic date regex or common month names
    const body = page.locator('body');
    const bodyText = await body.innerText();
    const datePattern = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/;
    expect(bodyText).toMatch(datePattern);

    // Verify author/byline is visible – often near top of article or in a meta element
    // Look for common author indicators: "By [Name]" or <span>Author Name</span>
    const authorLocator = page.locator('text=/By\\s+/').first();
    await expect(authorLocator).toBeVisible();
    const authorText = await authorLocator.textContent();
    expect(authorText?.length).toBeGreaterThan(0);
  });
});
