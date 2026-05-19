// Traceability
// Functional Areas: Radio Button, Text Box, UI Stability, Web Tables
// Source References: AC1, AC2, AC3, AC4, Test Data: empty/null inputs, Test Data: invalid email formats, Test Data: non-numeric values, UI Validation Reference screenshots
// Execution Readiness: strong
// Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class Scrum70UiTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private static final String BASE_URL = "https://demoqa.com/elements";

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get(BASE_URL);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // Helper method to safely check if an element is displayed
    private boolean isElementDisplayed(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    // Helper to check for validation error class on an input field
    private boolean hasValidationError(By inputLocator) {
        WebElement input = driver.findElement(inputLocator);
        String classAttr = input.getAttribute("class");
        return classAttr != null && (classAttr.contains("error") || classAttr.contains("invalid"));
    }

    // =================== Email Validation Tests ===================

    @Test
    public void testInvalidEmailMissingTLD() {
        // Navigate to Text Box section
        WebElement textBoxSection = driver.findElement(By.id("item-0"));
        textBoxSection.click();

        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        emailField.sendKeys("test@domain");

        driver.findElement(By.id("submit")).click();

        // Verify validation error on email field
        assertTrue(hasValidationError(By.id("userEmail")), "Validation error should appear on #userEmail");
        // Verify output section not displayed
        assertFalse(isElementDisplayed(By.id("output")), "#output should not be displayed for invalid email");
    }

    @Test
    public void testInvalidEmailMissingAtSymbol() {
        WebElement textBoxSection = driver.findElement(By.id("item-0"));
        textBoxSection.click();

        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        emailField.sendKeys("testdomain.com");

        driver.findElement(By.id("submit")).click();

        assertTrue(hasValidationError(By.id("userEmail")), "Validation error should appear on #userEmail");
        assertFalse(isElementDisplayed(By.id("output")), "#output should not be displayed");
    }

    @Test
    public void testInvalidEmailEmptyInput() {
        WebElement textBoxSection = driver.findElement(By.id("item-0"));
        textBoxSection.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));

        driver.findElement(By.id("submit")).click();

        // Depending on implementation, either validation error or no output
        // At least output should not be displayed
        assertFalse(isElementDisplayed(By.id("output")), "#output should not appear for empty email");
    }

    @Test
    public void testValidEmailPositiveBaseline() {
        WebElement textBoxSection = driver.findElement(By.id("item-0"));
        textBoxSection.click();

        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        emailField.sendKeys("test@example.com");

        // Optionally fill other fields
        driver.findElement(By.id("submit")).click();

        WebElement output = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("output")));
        assertTrue(output.isDisplayed(), "#output should be displayed");
        assertTrue(output.getText().contains("test@example.com"), "Output should contain the email");
    }

    // =================== Web Tables Validation Tests ===================

    private void openWebTablesRegistrationForm() {
        WebElement webTablesSection = driver.findElement(By.id("item-3"));
        webTablesSection.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("addNewRecordButton"))).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("registration-form-modal")));
    }

    private void fillRegistrationField(String fieldId, String value) {
        WebElement field = driver.findElement(By.id(fieldId));
        field.clear();
        field.sendKeys(value);
    }

    @Test
    public void testWebTablesNonNumericAge() {
        openWebTablesRegistrationForm();

        fillRegistrationField("firstName", "John");
        fillRegistrationField("lastName", "Doe");
        fillRegistrationField("userEmail", "john@doe.com");
        fillRegistrationField("age", "abc");
        fillRegistrationField("salary", "50000");
        fillRegistrationField("department", "Engineering");

        driver.findElement(By.id("submit")).click();

        // Modal should remain open
        assertTrue(isElementDisplayed(By.id("registration-form-modal")), "Modal should remain open");
        // No new row added – we can check by counting rows before and after, but simpler: check modal still visible
        // Also check age field has validation error
        assertTrue(hasValidationError(By.id("age")), "Age field should show validation error");
    }

    @Test
    public void testWebTablesNonNumericSalary() {
        openWebTablesRegistrationForm();

        fillRegistrationField("firstName", "Jane");
        fillRegistrationField("lastName", "Smith");
        fillRegistrationField("userEmail", "jane@smith.com");
        fillRegistrationField("age", "30");
        fillRegistrationField("salary", "12ab");
        fillRegistrationField("department", "Sales");

        driver.findElement(By.id("submit")).click();

        assertTrue(isElementDisplayed(By.id("registration-form-modal")), "Modal should remain open");
        assertTrue(hasValidationError(By.id("salary")), "Salary field should show validation error");
    }

    @Test
    public void testWebTablesEmptyAgeAndSalary() {
        openWebTablesRegistrationForm();

        fillRegistrationField("firstName", "Alice");
        fillRegistrationField("lastName", "Brown");
        fillRegistrationField("userEmail", "alice@brown.com");
        // Leave age and salary blank
        fillRegistrationField("age", "");
        fillRegistrationField("salary", "");
        fillRegistrationField("department", "Support");

        driver.findElement(By.id("submit")).click();

        assertTrue(isElementDisplayed(By.id("registration-form-modal")), "Modal should remain open");
        // At least one of age or salary should show validation error
        boolean ageError = hasValidationError(By.id("age"));
        boolean salaryError = hasValidationError(By.id("salary"));
        assertTrue(ageError || salaryError, "Validation error expected on Age or Salary fields");
    }

    // =================== Radio Button Tests ===================

    @Test
    public void testNoRadioButtonDisabled() {
        WebElement radioSection = driver.findElement(By.id("item-2"));
        radioSection.click();

        WebElement noRadio = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("noRadio")));
        assertTrue(noRadio.getAttribute("disabled") != null, "#noRadio should be disabled");

        // Attempt normal click
        noRadio.click();
        // Verify no state change – no selection message should appear
        assertFalse(isElementDisplayed(By.className("text-success")), "No selection message should appear");
    }

    @Test
    public void testNoRadioJavaScriptClick() {
        WebElement radioSection = driver.findElement(By.id("item-2"));
        radioSection.click();

        WebElement noRadio = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("noRadio")));

        // Force click via JavaScript
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].click();", noRadio);

        // Verify no UI update
        // The "You have selected" text for No should NOT appear; check that no success message is displayed
        assertFalse(isElementDisplayed(By.className("text-success")), "No success message should appear after JS click on disabled radio");
    }

    // =================== UI Stability Tests ===================

    @Test
    public void testUiStabilityScrollWebTables() {
        // Scroll to Web Tables section using element id
        WebElement webTablesSection = driver.findElement(By.id("item-3"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", webTablesSection);

        // Add a small wait to let scrolling finish
        try { Thread.sleep(500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }

        // Click Add button
        WebElement addButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton")));
        addButton.click();

        // Verify modal appears
        assertTrue(isElementDisplayed(By.id("registration-form-modal")), "Registration modal should open");
    }

    @Test
    public void testUiStabilityRadioButtonUnderScroll() {
        WebElement radioSection = driver.findElement(By.id("item-2"));
        // Scroll so that only top half of radio section is visible
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", radioSection);
        // Scroll up a bit to cut off the bottom
        ((JavascriptExecutor) driver).executeScript("window.scrollBy(0, -150);");

        // Wait for Yes radio to be visible and clickable
        WebElement yesRadio = wait.until(ExpectedConditions.elementToBeClickable(By.id("yesRadio")));
        yesRadio.click();

        // Verify selection message
        WebElement successMsg = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".text-success")));
        assertTrue(successMsg.getText().contains("Yes"), "Message should indicate 'Yes' selected");
    }
}
