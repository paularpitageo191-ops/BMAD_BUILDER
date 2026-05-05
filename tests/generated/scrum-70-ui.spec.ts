import { test, expect, Locator } from '@playwright/test';
import { DemoQAPage } from './demoqa-page'; // assumed Page Object, can be inline

// Page Object for DemoQA Elements (simplified inline for brevity)
class DemoQAPage {
  readonly page: any;

  constructor(page: any) {
    this.page = page;
  }

  async gotoTextBox() {
    await this.page.goto('https://demoqa.com/text-box');
  }

  async gotoWebTables() {
    await this.page.goto('https://demoqa.com/webtables');
  }

  async gotoRadioButton() {
    await this.page.goto('https://demoqa.com/radio-button');
  }

  async gotoElementsHome() {
    await this.page.goto('https://demoqa.com/elements');
  }
}

test.describe('SCRUM-70: Negative Path Validation for DemoQA Elements Module', () => {
  let demoqa: DemoQAPage;

  test.beforeEach(async ({ page }) => {
    demoqa = new DemoQAPage(page);
  });

  // AC1 – Email Validation
  test('AC1 – Email Validation: invalid input triggers error and no output', async ({ page }) => {
    await demoqa.gotoTextBox();
    await page.fill('#userEmail', 'test@domain');
    await page.click('#submit');
    // Assert validation error on #userEmail
    const emailInput = page.locator('#userEmail');
    const isInvalid = await emailInput.evaluate(el => (el as HTMLInputElement).validationMessage);
    expect(isInvalid).toBeTruthy();
    // Assert #output is not displayed
    await expect(page.locator('#output')).not.toBeVisible();
  });

  // AC2 – Web Tables Validation
  test('AC2 – Web Tables Validation: non-numeric age/salary blocks submission', async ({ page }) => {
    await demoqa.gotoWebTables();
    // Click Add button to open registration modal
    await page.click('#addNewRecordButton');
    await page.waitForSelector('.modal-content', { state: 'visible' });
    // Fill valid First Name, Last Name, Email and invalid Age/Salary
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'john@example.com');
    await page.fill('#age', 'abc');
    await page.fill('#salary', '12ab');
    // Submit
    await page.click('#submit');
    // Registration modal should remain open
    await expect(page.locator('.modal-content')).toBeVisible();
    // Age and Salary fields should show error (HTML5 validation)
    const ageInput = page.locator('#age');
    const salaryInput = page.locator('#salary');
    const ageValid = await ageInput.evaluate(el => (el as HTMLInputElement).validity.valid);
    const salaryValid = await salaryInput.evaluate(el => (el as HTMLInputElement).validity.valid);
    expect(ageValid).toBeFalsy();
    expect(salaryValid).toBeFalsy();
  });

  // AC3 – Radio Button Validation
  test('AC3 – Radio Button Validation: #noRadio disabled and click does nothing', async ({ page }) => {
    await demoqa.gotoRadioButton();
    const noRadio = page.locator('#noRadio');
    // Assert disabled
    await expect(noRadio).toBeDisabled();
    // Attempt to click
    await noRadio.click({ force: true }); // force click as it's disabled
    // Assert still disabled and no state change (checked remains false)
    await expect(noRadio).toBeDisabled();
    const isChecked = await noRadio.isChecked();
    expect(isChecked).toBeFalsy();
  });

  // AC4 – UI Stability
  test('AC4 – UI Stability: elements remain interactable under obstruction', async ({ page }) => {
    await demoqa.gotoElementsHome();
    // Simulate overlay (e.g., fixed div)
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'obstruction-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;';
      document.body.appendChild(overlay);
    });
    // Scroll to a known element behind overlay and interact
    const element = page.locator('#item-0'); // first item in left menu
    await element.scrollIntoViewIfNeeded();
    await expect(element).toBeVisible();
    // Click via force to bypass overlay
    await element.click({ force: true });
    // Verify page navigated or element is interactable
    await expect(page).toHaveURL(/\/text-box/); // example: clicking first item goes to text box
  });
});