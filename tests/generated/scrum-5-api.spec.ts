import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid'; // optional for generating unique IDs

// Assume an onboarding API endpoint
const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';

// Helper to build valid onboarding payload
function validPayload() {
  return {
    pan: 'ABCDE1234F',
    aadhaar: '123456789012',
    name: 'Test User',
    email: 'test@example.com',
    disclosures: ['terms', 'privacy', 'risk'], // SEC compliant
  };
}

function invalidPanPayload() {
  const p = validPayload();
  delete p.pan;
  return p;
}

function invalidAadhaarPayload() {
  const p = validPayload();
  p.aadhaar = '12345'; // invalid format
  return p;
}

function missingDisclosuresPayload() {
  const p = validPayload();
  delete p.disclosures;
  return p;
}

function duplicatePanPayload() {
  const p = validPayload();
  p.pan = 'DUPLICATE123'; // assume this PAN already exists
  return p;
}

function partialDocumentPayload() {
  const p = validPayload();
  // simulate partial upload: only PAN, no Aadhaar
  delete p.aadhaar;
  return p;
}

test.describe('Customer Onboarding - KYC/KRA/SEC Compliance', () => {

  // AC1: Successful onboarding
  test('AC1: Successful onboarding with valid data', async ({ request }) => {
    const payload = validPayload();
    const response = await request.post(`${API_BASE}/onboard`, { data: payload });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('success');
    expect(body.message).toContain('onboarded successfully');
  });

  // AC2: KYC validation failure - missing PAN
  test('AC2: KYC validation failure - missing PAN', async ({ request }) => {
    const payload = invalidPanPayload();
    const response = await request.post(`${API_BASE}/onboard`, { data: payload });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.errors).toContainEqual(expect.objectContaining({ field: 'pan', message: 'PAN is required' }));
  });

  // AC2: KYC validation failure - invalid Aadhaar format
  test('AC2: KYC validation failure - invalid Aadhaar format', async ({ request }) => {
    const payload = invalidAadhaarPayload();
    const response = await request.post(`${API_BASE}/onboard`, { data: payload });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.errors).toContainEqual(expect.objectContaining({ field: 'aadhaar', message: 'Invalid Aadhaar format' }));
  });

  // AC3: KRA verification failure
  test('AC3: KRA verification failure', async ({ request }) => {
    // Use a PAN that is valid KYC but not found in KRA registry
    const payload = validPayload();
    payload.pan = 'KRAFOUND999'; // assume this triggers KRA not found
    const response = await request.post(`${API_BASE}/onboard`, { data: payload });
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.status).toBe('blocked');
    expect(body.message).toContain('KRA verification failed');
  });

  // AC4: SEC compliance violation
  test('AC4: SEC compliance rule violation - missing disclosures', async ({ request }) => {
    const payload = missingDisclosuresPayload();
    const response = await request.post(`${API_BASE}/onboard`, { data: payload });
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.status).toBe('denied');
    expect(body.message).toContain('Missing required disclosures');
  });

  // AC5: Audit logging for successful onboarding
  test('AC5: Audit logging for successful onboarding', async ({ request }) => {
    const payload = validPayload();
    const onboardResp = await request.post(`${API_BASE}/onboard`, { data: payload });
    const body = await onboardResp.json();
    // After onboarding, fetch logs
    const logsResp = await request.get(`${API_BASE}/logs?userId=${body.userId}`);
    const logs = await logsResp.json();
    expect(logs.length).toBeGreaterThan(0);
    logs.forEach(log => {
      expect(log).toHaveProperty('timestamp');
      expect(log).toHaveProperty('rule');
      expect(log).toHaveProperty('outcome');
    });
  });

  // AC5: Audit logging for failed onboarding
  test('AC5: Audit logging for failed onboarding', async ({ request }) => {
    const payload = invalidPanPayload();
    const onboardResp = await request.post(`${API_BASE}/onboard`, { data: payload });
    // Even though it fails, logs should still be generated
    const logsResp = await request.get(`${API_BASE}/logs?userId=anonymous`); // or use correlation id from response
    const logs = await logsResp.json();
    expect(logs.length).toBeGreaterThan(0);
    logs.forEach(log => {
      expect(log).toHaveProperty('timestamp');
      expect(log).toHaveProperty('rule');
      expect(log).toHaveProperty('outcome');
    });
  });

  // Edge: Boundary values for ID formats
  test('Edge: Boundary Aadhaar exactly 12 digits', async ({ request }) => {
    const payload = validPayload();
    payload.aadhaar = '000000000000'; // 12 zeros, still valid format
    const response = await request.post(`${API_BASE}/onboard`, { data: payload });
    expect(response.status()).toBe(200); // assuming other checks pass
  });

  // Edge: Partial document upload
  test('Edge: Partial document upload - missing Aadhaar', async ({ request }) => {
    const payload = partialDocumentPayload();
    const response = await request.post(`${API_BASE}/onboard`, { data: payload });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors).toContainEqual(expect.objectContaining({ message: 'Aadhaar is required' }));
  });

  // Edge: Duplicate onboarding attempt
  test('Edge: Duplicate onboarding attempt with same PAN', async ({ request }) => {
    const payload = duplicatePanPayload();
    // First attempt
    await request.post(`${API_BASE}/onboard`, { data: payload });
    // Second attempt with same PAN
    const response = await request.post(`${API_BASE}/onboard`, { data: payload });
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.message).toContain('Duplicate user');
  });

  // Edge: Timeout in KRA verification
  test('Edge: KRA verification timeout', async ({ request }) => {
    const payload = validPayload();
    payload.pan = 'TIMEOUT999'; // PAN that triggers timeout
    const response = await request.post(`${API_BASE}/onboard`, { data: payload });
    expect(response.status()).toBe(503);
    const body = await response.json();
    expect(body.message).toContain('KRA verification timed out');
  });
});
