import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Helper to fill form fields using accessibility-first selectors
async function fillForm(page: Page, data: { pan?: string; aadhaar?: string; kraStatus?: string; secDisclosures?: string }) {
  if (data.pan !== undefined) {
    await page.getByRole('textbox', { name: /pan/i }).fill(data.pan);
  }
  if (data.aadhaar !== undefined) {
    await page.getByRole('textbox', { name: /aadhaar/i }).fill(data.aadhaar);
  }
  if (data.kraStatus !== undefined) {
    await page.getByRole('combobox', { name: /kra status/i }).selectOption(data.kraStatus);
  }
  if (data.secDisclosures !== undefined) {
    await page.getByRole('checkbox', { name: /disclosures/i }).setChecked(data.secDisclosures === 'true');
  }
}

// Helper to intercept API calls and return synthetic responses
async function setupMockRoutes(page: Page, options: { kycValid?: boolean; kraValid?: boolean; secValid?: boolean; kraTimeout?: boolean }) {
  await page.route('**/api/kyc', route => {
    if (options.kycValid === undefined || options.kycValid) {
      route.fulfill({ status: 200, body: '{"valid":true}' });
    } else {
      route.fulfill({ status: 400, body: '{"valid":false,"reason":"PAN is required"}' });
    }
  });

  await page.route('**/api/kra', route => {
    if (options.kraTimeout) {
      route.abort('timeout');
    } else if (options.kraValid === undefined || options.kraValid) {
      route.fulfill({ status: 200, body: '{"found":true}' });
    } else {
      route.fulfill({ status: 404, body: '{"found":false,"reason":"KRA verification failed"}' });
    }
  });

  await page.route('**/api/sec', route => {
    if (options.secValid === undefined || options.secValid) {
      route.fulfill({ status: 200, body: '{"compliant":true}' });
    } else {
      route.fulfill({ status: 403, body: '{"compliant":false,"reason":"Missing disclosures"}' });
    }
  });

  // Audit log endpoint
  await page.route('**/api/audit', route => {
    route.fulfill({ status: 201, body: '{"logged":true}' });
  });
}

test.describe('Customer Onboarding Compliance (SCRUM-5)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding`);
  });

  test('AC1: Successful onboarding with valid data', async ({ page }) => {
    await setupMockRoutes(page, {});
    await fillForm(page, { pan: 'ABCDE1234F', aadhaar: '123456789012', kraStatus: 'verified', secDisclosures: 'true' });
    await page.getByRole('button', { name: /submit/i }).click();

    // Wait for success message
    await expect(page.getByRole('status')).toContainText(/successfully onboarded/i);
    // Verify audit log entry
    await expect(page.getByRole('log')).toContainText(/timestamp.*rule.*outcome/i);
  });

  test('AC2: KYC validation failure - Missing PAN', async ({ page }) => {
    await setupMockRoutes(page, { kycValid: false });
    await fillForm(page, { pan: '', aadhaar: '123456789012', kraStatus: 'verified', secDisclosures: 'true' });
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByRole('alert')).toContainText(/PAN is required/i);
  });

  test('AC2: KYC validation failure - Invalid Aadhaar format', async ({ page }) => {
    await setupMockRoutes(page, { kycValid: false });
    await fillForm(page, { pan: 'ABCDE1234F', aadhaar: '123', kraStatus: 'verified', secDisclosures: 'true' });
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByRole('alert')).toContainText(/invalid aadhaar/i);
  });

  test('AC3: KRA verification failure', async ({ page }) => {
    await setupMockRoutes(page, { kycValid: true, kraValid: false });
    await fillForm(page, { pan: 'ABCDE1234F', aadhaar: '123456789012', kraStatus: 'pending', secDisclosures: 'true' });
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByRole('alert')).toContainText(/KRA verification failed/i);
  });

  test('AC4: SEC compliance rule violation', async ({ page }) => {
    await setupMockRoutes(page, { kycValid: true, kraValid: true, secValid: false });
    await fillForm(page, { pan: 'ABCDE1234F', aadhaar: '123456789012', kraStatus: 'verified', secDisclosures: 'false' });
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByRole('alert')).toContainText(/Missing disclosures/i);
  });

  test('AC5: Audit logging for onboarding attempt', async ({ page }) => {
    await setupMockRoutes(page, {});
    // Use javascript console to capture audit logs if logged by frontend
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    await fillForm(page, { pan: 'ABCDE1234F', aadhaar: '123456789012', kraStatus: 'verified', secDisclosures: 'true' });
    await page.getByRole('button', { name: /submit/i }).click();

    // Wait for success to ensure logs are generated
    await expect(page.getByRole('status')).toBeVisible();
    // Verify audit log was sent (capture via network route or console)
    const auditLogCall = await page.waitForRequest(req => req.url().includes('/api/audit'));
    expect(auditLogCall).toBeTruthy();
  });

  test('Edge: Duplicate onboarding attempt', async ({ page }) => {
    await setupMockRoutes(page, { kycValid: true, kraValid: true, secValid: true });
    // First successful onboarding
    await fillForm(page, { pan: 'ABCDE1234F', aadhaar: '123456789012', kraStatus: 'verified', secDisclosures: 'true' });
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByRole('status')).toContainText(/successfully onboarded/i);

    // Duplicate attempt – modify routes to simulate rejection
    await page.route('**/api/kyc', route => {
      route.fulfill({ status: 409, body: '{"valid":false,"reason":"Duplicate user"}' });
    });
    await page.goto(`${BASE_URL}/onboarding`);
    await fillForm(page, { pan: 'ABCDE1234F', aadhaar: '123456789012', kraStatus: 'verified', secDisclosures: 'true' });
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByRole('alert')).toContainText(/Duplicate user/i);
  });

  test('Edge: KRA verification timeout', async ({ page }) => {
    await setupMockRoutes(page, { kraTimeout: true });
    await fillForm(page, { pan: 'ABCDE1234F', aadhaar: '123456789012', kraStatus: 'verified', secDisclosures: 'true' });
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByRole('alert')).toContainText(/timeout/i);
  });
});
