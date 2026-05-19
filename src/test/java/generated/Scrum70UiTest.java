// Traceability
// Functional Areas: Radio Button, Text Box, Web Tables
// Source References: AC1 – Email Validation, AC2 – Web Tables Validation, AC3 – Radio Button Validation, Regression impact from negative changes, Screenshot: Disabled option → no interaction or state change, Screenshot: Invalid email → validation error, no output, Screenshot: Invalid numeric input → submission blocked, modal remains open, Screenshot: Radio button behavior, Screenshot: Valid input → output section rendered, Test Data: Empty/null inputs, Test Data: Invalid email formats, Test Data: Invalid email formats (e.g., test@domain, missing TLD), Test Data: Non-numeric values for numeric fields (e.g., abc, 12ab)
// Execution Readiness: strong
// Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class Scrum70UiTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private static final String BASE_URL = "https://demoqa.com/elements";

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.setBinary("/usr/bin/chromium");
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1440,900");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // Helper to scroll element into view
    private void scrollToElement(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
    }

    // Helper to click using JS if element is obstructed
    private void clickViaJs(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    // ========== TC01: Email Validation – Missing TLD ==========
    @Test
    public void testEmailValidationMissingTLD() {
        driver.get(BASE_URL);
        // Navigate to Text Box section (click accordion item)
        WebElement textBoxAccordion = driver.findElement(By.id("item-0"));
        scrollToElement(textBoxAccordion);
        textBoxAccordion.click();

        // Wait for text box fields to be visible
        WebElement userEmail = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        WebElement submitBtn = driver.findElement(By.id("submit"));

        userEmail.sendKeys("test@domain");
        scrollToElement(submitBtn);
        submitBtn.click();

        // Check for validation error (HTML5 validation message or custom class)
        // DemoQA uses HTML5 validation; we check the validation message property
        String validationMessage = (String) ((JavascriptExecutor) driver)
                .executeScript("return arguments[0].validationMessage;", userEmail);
        assertFalse(validationMessage.isEmpty(), "Validation message should be present for invalid email");

        // Verify output not displayed
        WebElement outputSection = driver.findElement(By.id("output"));
        assertFalse(outputSection.isDisplayed(), "#output should not be visible for invalid input");
    }

    // ========== TC02: Email Validation – Missing @ ==========
    @Test
    public void testEmailValidationMissingAt() {
        driver.get(BASE_URL);
        WebElement textBoxAccordion = driver.findElement(By.id("item-0"));
        scrollToElement(textBoxAccordion);
        textBoxAccordion.click();

        WebElement userEmail = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        WebElement submitBtn = driver.findElement(By.id("submit"));

        userEmail.sendKeys("testdomain.com");
        scrollToElement(submitBtn);
        submitBtn.click();

        String validationMessage = (String) ((JavascriptExecutor) driver)
                .executeScript("return arguments[0].validationMessage;", userEmail);
        assertFalse(validationMessage.isEmpty(), "Validation message should appear for email without @");

        WebElement outputSection = driver.findElement(By.id("output"));
        assertFalse(outputSection.isDisplayed(), "#output should remain hidden");
    }

    // ========== TC03: Email Validation – Empty Input ==========
    @Test
    public void testEmailValidationEmpty() {
        driver.get(BASE_URL);
        WebElement textBoxAccordion = driver.findElement(By.id("item-0"));
        scrollToElement(textBoxAccordion);
        textBoxAccordion.click();

        WebElement userEmail = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        WebElement submitBtn = driver.findElement(By.id("submit"));

        userEmail.clear();
        scrollToElement(submitBtn);
        submitBtn.click();

        // HTML5 required validation fires for empty field
        String validationMessage = (String) ((JavascriptExecutor) driver)
                .executeScript("return arguments[0].validationMessage;", userEmail);
        assertFalse(validationMessage.isEmpty(), "Empty email should trigger validation message");

        WebElement outputSection = driver.findElement(By.id("output"));
        assertFalse(outputSection.isDisplayed(), "#output should not appear for empty input");
    }

    // ========== TC04: Web Tables – Invalid Age (non-numeric) ==========
    @Test
    public void testWebTablesInvalidAge() {
        driver.get(BASE_URL);
        // Navigate to Web Tables section
        WebElement webTablesAccordion = driver.findElement(By.id("item-3"));
        scrollToElement(webTablesAccordion);
        webTablesAccordion.click();

        WebElement addBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton")));
        addBtn.click();

        // Wait for registration modal
        WebElement modal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("modal-content")));
        WebElement firstName = driver.findElement(By.id("firstName"));
        WebElement lastName = driver.findElement(By.id("lastName"));
        WebElement userEmail = driver.findElement(By.id("userEmail"));
        WebElement age = driver.findElement(By.id("age"));
        WebElement salary = driver.findElement(By.id("salary"));
        WebElement department = driver.findElement(By.id("department"));
        WebElement submitBtn = driver.findElement(By.id("submit"));

        firstName.sendKeys("Jane");
        lastName.sendKeys("Doe");
        userEmail.sendKeys("jane@example.com");
        age.sendKeys("abc");
        salary.sendKeys("50000");
        department.sendKeys("QA");

        scrollToElement(submitBtn);
        submitBtn.click();

        // Modal should remain open
        assertTrue(modal.isDisplayed(), "Modal should remain open after invalid age");

        // Check age field validation message
        String validationMessage = (String) ((JavascriptExecutor) driver)
                .executeScript("return arguments[0].validationMessage;", age);
        assertFalse(validationMessage.isEmpty(), "Age field should show validation error");
    }

    // ========== TC05: Web Tables – Invalid Salary (12ab) ==========
    @Test
    public void testWebTablesInvalidSalary() {
        driver.get(BASE_URL);
        WebElement webTablesAccordion = driver.findElement(By.id("item-3"));
        scrollToElement(webTablesAccordion);
        webTablesAccordion.click();

        WebElement addBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton")));
        addBtn.click();

        WebElement modal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("modal-content")));
        WebElement firstName = driver.findElement(By.id("firstName"));
        WebElement lastName = driver.findElement(By.id("lastName"));
        WebElement userEmail = driver.findElement(By.id("userEmail"));
        WebElement age = driver.findElement(By.id("age"));
        WebElement salary = driver.findElement(By.id("salary"));
        WebElement department = driver.findElement(By.id("department"));
        WebElement submitBtn = driver.findElement(By.id("submit"));

        firstName.sendKeys("John");
        lastName.sendKeys("Smith");
        userEmail.sendKeys("john@example.com");
        age.sendKeys("30");
        salary.sendKeys("12ab");
        department.sendKeys("IT");

        scrollToElement(submitBtn);
        submitBtn.click();

        assertTrue(modal.isDisplayed(), "Modal should remain open after invalid salary");

        String validationMessage = (String) ((JavascriptExecutor) driver)
                .executeScript("return arguments[0].validationMessage;", salary);
        assertFalse(validationMessage.isEmpty(), "Salary field should show validation error");
    }

    // ========== TC06: Radio Button – Disabled State Verification ==========
    @Test
    public void testRadioButtonDisabledState() {
        driver.get(BASE_URL);
        WebElement radioBtnAccordion = driver.findElement(By.id("item-2"));
        scrollToElement(radioBtnAccordion);
        radioBtnAccordion.click();

        WebElement noRadio = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("noRadio")));
        // Check disabled attribute
        String disabledAttr = noRadio.getAttribute("disabled");
        assertNotNull(disabledAttr, "#noRadio should have disabled attribute");
        // or use isEnabled()
        assertFalse(noRadio.isEnabled(), "#noRadio should be disabled");

        // Try to click using JS (since Selenium will throw if element not interactable)
        try {
            clickViaJs(noRadio);
        } catch (Exception e) {
            // Click may be ignored; we still verify state
        }

        // Verify still unchecked
        assertNull(noRadio.getAttribute("checked"), "Radio should remain unchecked after click");

        // No success message should appear
        boolean successMessagePresent = driver.findElements(By.xpath("//*[contains(text(),'You have selected No')]")).size() > 0;
        assertFalse(successMessagePresent, "No success message should appear for disabled radio");
    }

    // ========== TC07: Radio Button – No Interaction Effect ==========
    @Test
    public void testRadioButtonNoInteractionEffect() {
        driver.get(BASE_URL);
        WebElement radioBtnAccordion = driver.findElement(By.id("item-2"));
        scrollToElement(radioBtnAccordion);
        radioBtnAccordion.click();

        WebElement noRadio = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("noRadio")));
        assertFalse(noRadio.isEnabled(), "#noRadio must be disabled");

        // Attempt click
        clickViaJs(noRadio);

        // Verify checked attribute absent
        assertNull(noRadio.getAttribute("checked"), "Radio should remain unchecked after click");

        // No success message
        assertTrue(driver.findElements(By.xpath("//*[text()='You have selected No']")).isEmpty(),
                "No success message should appear");

        // Other radios unchanged – just verify 'Yes' still clickable
        WebElement yesRadio = driver.findElement(By.id("yesRadio"));
        assertTrue(yesRadio.isEnabled(), "Yes radio should remain enabled");
    }

    // ========== TC08: Regression – Valid Email Output ==========
    @Test
    public void testValidEmailOutput() {
        driver.get(BASE_URL);
        WebElement textBoxAccordion = driver.findElement(By.id("item-0"));
        scrollToElement(textBoxAccordion);
        textBoxAccordion.click();

        WebElement userEmail = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        WebElement submitBtn = driver.findElement(By.id("submit"));

        userEmail.sendKeys("test@example.com");
        scrollToElement(submitBtn);
        submitBtn.click();

        // Wait for output section to be visible
        WebElement outputSection = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("output")));
        assertTrue(outputSection.isDisplayed(), "#output should be visible");

        String outputText = outputSection.getText();
        assertTrue(outputText.contains("Email:test@example.com"), "Output should contain the entered email");
    }

    // ========== TC09: Regression – Valid Web Table Entry ==========
    @Test
    public void testValidWebTableEntry() {
        driver.get(BASE_URL);
        WebElement webTablesAccordion = driver.findElement(By.id("item-3"));
        scrollToElement(webTablesAccordion);
        webTablesAccordion.click();

        WebElement addBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton")));
        addBtn.click();

        WebElement modal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("modal-content")));
        WebElement firstName = driver.findElement(By.id("firstName"));
        WebElement lastName = driver.findElement(By.id("lastName"));
        WebElement userEmail = driver.findElement(By.id("userEmail"));
        WebElement age = driver.findElement(By.id("age"));
        WebElement salary = driver.findElement(By.id("salary"));
        WebElement department = driver.findElement(By.id("department"));
        WebElement submitBtn = driver.findElement(By.id("submit"));

        firstName.sendKeys("Alice");
        lastName.sendKeys("Johnson");
        userEmail.sendKeys("alice@example.com");
        age.sendKeys("25");
        salary.sendKeys("50000");
        department.sendKeys("Engineering");

        scrollToElement(submitBtn);
        submitBtn.click();

        // Wait for modal to close
        wait.until(ExpectedConditions.invisibilityOf(modal));

        // Verify new row appears in table
        WebElement tableBody = driver.findElement(By.className("rt-tbody"));
        String tableText = tableBody.getText();
        assertTrue(tableText.contains("Alice"), "Table should contain new entry with first name Alice");
        assertTrue(tableText.contains("Johnson"), "Table should contain new entry with last name Johnson");
        assertTrue(tableText.contains("alice@example.com"), "Table should contain new email");
        assertTrue(tableText.contains("25"), "Table should contain age 25");
        assertTrue(tableText.contains("50000"), "Table should contain salary 50000");
        assertTrue(tableText.contains("Engineering"), "Table should contain department Engineering");
    }

    // ========== TC10: Regression – Radio Button 'Yes' Works ==========
    @Test
    public void testRadioButtonYesWorks() {
        driver.get(BASE_URL);
        WebElement radioBtnAccordion = driver.findElement(By.id("item-2"));
        scrollToElement(radioBtnAccordion);
        radioBtnAccordion.click();

        WebElement yesRadio = wait.until(ExpectedConditions.elementToBeClickable(By.id("yesRadio")));
        // Use JS click to avoid overlay issues
        clickViaJs(yesRadio);

        // Verify checked
        assertTrue(yesRadio.isSelected(), "Yes radio should be selected after click");

        // Verify success message
        WebElement successMsg = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(text(),'You have selected Yes')]")));
        assertTrue(successMsg.isDisplayed(), "Success message should appear for Yes radio");
    }
}
