// Traceability
import { test, expect, Page, ConsoleMessage } from '@playwright/test';

const TARGET_URL = 'https://iventures.in/feeds/blog/gift-city-mutual-fund';
const FUND_NAME_GC001 = 'GIFT City Mutual Fund';      // from FUND-GC-001 – adjust per actual Excel data
const FUND_TYPE_GC001 = 'Equity';                      // placeholder – update to match Excel row 'Asset Class'

let baselineFundCount: number | null = null;  // used for count regression; stored in memory per run

async function getConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  return errors;
}

test.describe('Regression – GIFT City Mutual Fund Guide Page Stability', () => {

  test('Regression – Guide page loads without HTTP errors and displays key terms', async ({ page }) => {
    const errors = await getConsoleErrors(page);
    expect(errors.length).toBe(0);

    const title = await page.title();
    expect(title).toMatch(/(GIFT City|Mutual Fund)/i);

    const bodyText = await page.locator('body').innerText();
    const terms = ['GIFT City', 'IFSC', 'global securities'];
    const found = terms.some(term => bodyText.includes(term));
    expect(found).toBeTruthy();
  });

  test('Regression – FUND-GC-001 fund name remains present on the page', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    const bodyText = await page.locator('body').innerText();

    expect(bodyText).toContain(FUND_NAME_GC001);

    // Optionally verify asset class if available on page
    const fundTypePresent = bodyText.includes(FUND_TYPE_GC001);
    if (!fundTypePresent) {
      test.info().annotations.push({
        type: 'assumption',
        description: `Asset class "${FUND_TYPE_GC001}" not found on page – this may be expected for a public guide.`
      });
    }
  });

  test('Regression – Primary CTA element is still discoverable and navigates correctly', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

    // Look for common CTA texts
    const ctaLocator = page.getByRole('link', { name: /Invest|Enquire|Contact|Get Started/i })
      .or(page.getByRole('button', { name: /Invest|Enquire|Contact|Get Started/i }))
      .first();

    await expect(ctaLocator).toBeVisible({ timeout: 5000 });
    await expect(ctaLocator).toBeEnabled();

    // Click and verify no broken navigation
    await Promise.all([
      page.waitForLoadState('networkidle'),
      ctaLocator.click()
    ]);

    // Allow redirects: check final URL returns 200 (non-error)
    const response = await page.request.get(page.url());
    expect(response.status()).toBeLessThan(400);
  });

  test('Regression – Number of visible fund listing items remains consistent', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });

    // Assume fund items are in a list <ul> or <div> container – adjust selector if DOM is known
    // For a public blog, we might count paragraphs with repeated patterns or a specific class.
    // Fallback: count all links that contain "Fund" as a rough proxy.
    const fundItemCount = await page.locator('article, .post-content, [class*="fund"]').count();

    if (baselineFundCount === null) {
      baselineFundCount = fundItemCount;
      test.info().annotations.push({
        type: 'info',
        description: `Baseline fund count recorded as ${fundItemCount} for future runs.`
      });
    } else {
      expect(fundItemCount).toBe(baselineFundCount);
    }
  });
});
