// Traceability
// Functional Areas: Elements - Radio Button, Elements - Text Box, Elements - Web Tables
// Source References: Screenshot: Radio Button Behavior - Disabled Option, Screenshot: Text Box Validation - Invalid Email, Screenshot: Text Box Validation - Valid Input, Screenshot: Web Tables Validation - Invalid Input, Screenshot: Web Tables Validation - Valid Input (implied), Test data: empty/null inputs, Test data: invalid email formats (e.g., test@domain, missing TLD)
// Execution Readiness: strong
// Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
package qa.scrum70;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class Scrum70UiTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "https://demoqa.com/elements";
    private static final String SIDEBAR_TEXT_BOX = "Text Box";
    private static final String SIDEBAR_WEB_TABLES = "Web Tables";
    private static final String SIDEBAR_RADIO_BUTTON = "Radio Button";

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get(BASE_URL);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // ============ Helper Methods ============

    private void clickSidebarItem(String itemText) {
        WebElement sidebarItem = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//div[@class='element-group']//span[text()='" + itemText + "']/..")));
        sidebarItem.click();
    }

    private void clickSubmit() {
        WebElement submitButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
        submitButton.click();
    }

    private boolean isValidationErrorShown(By fieldLocator) {
        WebElement field = driver.findElement(fieldLocator);
        String classAttr = field.getAttribute("class");
        return classAttr != null && (classAttr.contains("is-invalid") || classAttr.contains("error"));
    }

    private boolean isOutputDisplayed() {
        try {
            WebElement output = driver.findElement(By.id("output"));
            return output.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private void openRegistrationModal() {
        WebElement addButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton")));
        addButton.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("registration-form-modal")));
    }

    private void fillRegistrationField(String fieldId, String value) {
        WebElement field = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(fieldId)));
        field.clear();
        if (value != null) {
            field.sendKeys(value);
        }
    }

    private boolean isModalOpen() {
        try {
            return driver.findElement(By.id("registration-form-modal")).isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    // ============ Test Cases ============

    // TC-01: Invalid Email (missing TLD)
    @Test
    public void testEmailInvalidMissingTLD() {
        clickSidebarItem(SIDEBAR_TEXT_BOX);
        driver.findElement(By.id("userEmail")).sendKeys("test@domain");
        clickSubmit();
        assertTrue(isValidationErrorShown(By.id("userEmail")), "Validation error should appear on email field");
        assertFalse(isOutputDisplayed(), "Output should not be displayed for invalid email");
    }

    // TC-02: Empty email
    @Test
    public void testEmailEmpty() {
        clickSidebarItem(SIDEBAR_TEXT_BOX);
        driver.findElement(By.id("userEmail")).clear();
        clickSubmit();
        assertTrue(isValidationErrorShown(By.id("userEmail")), "Validation error should appear on empty email");
        assertFalse(isOutputDisplayed(), "Output should not be displayed for empty email");
    }

    // TC-03: Valid email produces output
    @Test
    public void testEmailValidProducesOutput() {
        clickSidebarItem(SIDEBAR_TEXT_BOX);
        driver.findElement(By.id("userName")).sendKeys("Test User");
        driver.findElement(By.id("userEmail")).sendKeys("test@example.com");
        driver.findElement(By.id("currentAddress")).sendKeys("123 Main St");
        driver.findElement(By.id("permanentAddress")).sendKeys("456 Oak Ave");
        clickSubmit();
        assertFalse(isValidationErrorShown(By.id("userEmail")), "No validation error for valid email");
        assertTrue(isOutputDisplayed(), "Output should be displayed for valid submission");
    }

    // TC-04: Web Tables - non-numeric Age
    @Test
    public void testWebTablesNonNumericAge() {
        clickSidebarItem(SIDEBAR_WEB_TABLES);
        openRegistrationModal();
        fillRegistrationField("firstName", "John");
        fillRegistrationField("lastName", "Doe");
        fillRegistrationField("userEmail", "j@test.com");
        fillRegistrationField("age", "abc");
        fillRegistrationField("salary", "50000");
        fillRegistrationField("department", "QA");
        WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
        submitBtn.click();
        assertTrue(isModalOpen(), "Modal should remain open after invalid age");
        assertTrue(isValidationErrorShown(By.id("age")), "Validation error should appear on Age field");
    }

    // TC-05: Web Tables - non-numeric Salary
    @Test
    public void testWebTablesNonNumericSalary() {
        clickSidebarItem(SIDEBAR_WEB_TABLES);
        openRegistrationModal();
        fillRegistrationField("firstName", "John");
        fillRegistrationField("lastName", "Doe");
        fillRegistrationField("userEmail", "j@test.com");
        fillRegistrationField("age", "30");
        fillRegistrationField("salary", "12ab");
        fillRegistrationField("department", "QA");
        WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
        submitBtn.click();
        assertTrue(isModalOpen(), "Modal should remain open after invalid salary");
        assertTrue(isValidationErrorShown(By.id("salary")), "Validation error should appear on Salary field");
    }

    // TC-06: Web Tables - empty Age and Salary
    @Test
    public void testWebTablesEmptyAgeAndSalary() {
        clickSidebarItem(SIDEBAR_WEB_TABLES);
        openRegistrationModal();
        fillRegistrationField("firstName", "John");
        fillRegistrationField("lastName", "Doe");
        fillRegistrationField("userEmail", "j@test.com");
        fillRegistrationField("age", null);
        fillRegistrationField("salary", null);
        fillRegistrationField("department", "QA");
        WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
        submitBtn.click();
        assertTrue(isModalOpen(), "Modal should remain open when Age and Salary empty");
        assertTrue(isValidationErrorShown(By.id("age")), "Validation error on Age field");
        assertTrue(isValidationErrorShown(By.id("salary")), "Validation error on Salary field");
    }

    // TC-07: Web Tables - valid data submission
    @Test
    public void testWebTablesValidSubmission() {
        clickSidebarItem(SIDEBAR_WEB_TABLES);
        openRegistrationModal();
        fillRegistrationField("firstName", "John");
        fillRegistrationField("lastName", "Doe");
        fillRegistrationField("userEmail", "j@test.com");
        fillRegistrationField("age", "30");
        fillRegistrationField("salary", "50000");
        fillRegistrationField("department", "QA");
        WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
        submitBtn.click();
        assertFalse(isModalOpen(), "Modal should close after valid submission");
        // Verify new row appears - assume table id is 'app' or 'welcome'? Use a generic check.
        WebElement table = driver.findElement(By.className("rt-table"));
        assertTrue(table.getText().contains("John"), "Table should contain the newly added first name");
    }

    // TC-08: Radio Button - 'No' remains disabled
    @Test
    public void testRadioButtonNoDisabled() {
        clickSidebarItem(SIDEBAR_RADIO_BUTTON);
        WebElement noRadio = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("noRadio")));
        assertFalse(noRadio.isEnabled(), "#noRadio should be disabled initially");
        // Attempt click – should not change state
        noRadio.click();
        assertFalse(noRadio.isEnabled(), "#noRadio should remain disabled after click");
        // Verify no selection indicator (e.g., no 'checked' class)
        String classAfter = noRadio.getAttribute("class");
        assertFalse(classAfter.contains("checked"), "No checked class should appear");
    }

    // TC-09: Multiple invalid email formats (data-driven)
    @ParameterizedTest
    @ValueSource(strings = {"test@domain", "test@.com", "@domain.com", "test@domain.", ""})
    public void testEmailMultipleInvalidFormats(String invalidEmail) {
        clickSidebarItem(SIDEBAR_TEXT_BOX);
        WebElement emailField = driver.findElement(By.id("userEmail"));
        emailField.clear();
        emailField.sendKeys(invalidEmail);
        clickSubmit();
        assertTrue(isValidationErrorShown(By.id("userEmail")), "Validation error expected for invalid email: " + invalidEmail);
        assertFalse(isOutputDisplayed(), "Output should not be displayed for invalid email: " + invalidEmail);
    }
}
