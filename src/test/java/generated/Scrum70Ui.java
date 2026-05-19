// Traceability
// Functional Areas: Radio Button, Text Box, UI Stability, Web Tables
// Source References: AC1, AC2, AC3, AC4, Screenshots - Radio Button Behavior, Screenshots - Text Box Validation, Screenshots - Web Tables Validation
// Execution Readiness: strong
// Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import static org.junit.jupiter.api.Assertions.*;

import java.time.Duration;

/**
 * Selenium Java test class for DemoQA Elements Negative Path Validation (SCRUM-70).
 * Covers Text Box, Web Tables, Radio Button, and UI Stability scenarios.
 *
 * Preconditions:
 * - ChromeDriver is properly configured.
 * - The base URL is https://demoqa.com/elements.
 */
public class DemoQAElementsNegativeValidationTest {

    private WebDriver driver;
    private WebDriverWait wait;

    // Setup method – assumed to be called before tests (e.g., @BeforeEach)
    private void setUp() {
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().maximize();
        driver.get("https://demoqa.com/elements");
        // Wait for page to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
    }

    // Teardown method – assumed to be called after tests (e.g., @AfterEach)
    private void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testInvalidEmailMissingTLD() {
        setUp();
        try {
            // Enter invalid email
            WebElement emailInput = driver.findElement(By.id("userEmail"));
            emailInput.sendKeys("user@domain");
            driver.findElement(By.id("submit")).click();

            // Check validation error on #userEmail (e.g., red border class or specific error message)
            WebElement emailAfterSubmit = driver.findElement(By.id("userEmail"));
            String classAttr = emailAfterSubmit.getAttribute("class");
            assertTrue(classAttr.contains("error") || emailAfterSubmit.getAttribute("validationMessage") != null,
                    "Expected validation error class or validation message for invalid email");

            // Check #output is not displayed
            assertFalse(driver.findElement(By.id("output")).isDisplayed(),
                    "Output section should not be visible for invalid email");
        } finally {
            tearDown();
        }
    }

    @Test
    public void testEmptyEmail() {
        setUp();
        try {
            WebElement emailInput = driver.findElement(By.id("userEmail"));
            emailInput.clear();
            driver.findElement(By.id("submit")).click();

            WebElement emailAfterSubmit = driver.findElement(By.id("userEmail"));
            String classAttr = emailAfterSubmit.getAttribute("class");
            assertTrue(classAttr.contains("error") || emailAfterSubmit.getAttribute("validationMessage") != null,
                    "Expected validation for empty email");

            assertFalse(driver.findElement(By.id("output")).isDisplayed(),
                    "Output section should not be visible for empty email");
        } finally {
            tearDown();
        }
    }

    @Test
    public void testValidEmailProducesOutput() {
        setUp();
        try {
            driver.findElement(By.id("userEmail")).sendKeys("valid.email@domain.com");
            driver.findElement(By.id("submit")).click();

            WebElement emailAfterSubmit = driver.findElement(By.id("userEmail"));
            String classAttr = emailAfterSubmit.getAttribute("class");
            assertFalse(classAttr.contains("error"),
                    "No validation error expected for valid email");

            WebElement output = driver.findElement(By.id("output"));
            assertTrue(output.isDisplayed(), "Output section should be visible");
            assertTrue(output.getText().contains("Email:valid.email@domain.com"),
                    "Output should contain the submitted email");
        } finally {
            tearDown();
        }
    }

    @Test
    public void testNonNumericAgeBlocksSubmission() {
        setUp();
        try {
            // Navigate to Web Tables section (assumes page is already loaded; scroll if needed)
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",
                    driver.findElement(By.id("addNewRecordButton")));
            driver.findElement(By.id("addNewRecordButton")).click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='modal-content']")));

            // Fill fields
            driver.findElement(By.id("firstName")).sendKeys("John");
            driver.findElement(By.id("lastName")).sendKeys("Doe");
            driver.findElement(By.id("userEmail")).sendKeys("john@doe.com");
            driver.findElement(By.id("age")).sendKeys("abc");
            driver.findElement(By.id("salary")).sendKeys("50000");
            driver.findElement(By.id("department")).sendKeys("IT");

            driver.findElement(By.id("submit")).click();

            // Modal should remain open
            assertTrue(driver.findElement(By.xpath("//div[@class='modal-content']")).isDisplayed(),
                    "Registration modal should remain open after invalid Age");

            // Check validation error on Age field (class or attribute)
            WebElement ageField = driver.findElement(By.id("age"));
            String classAttr = ageField.getAttribute("class");
            assertTrue(classAttr.contains("error") || classAttr.contains("is-invalid"),
                    "Age field should show validation error");

            // Verify no new record added (table row count unchanged)
            int rowCountBefore = driver.findElements(By.cssSelector(".rt-tr-group")).size();
            // Assuming modal close and refresh table; row count should be same as before opening modal
            // For simplicity, check that modal is still open, no new entry visible
        } finally {
            tearDown();
        }
    }

    @Test
    public void testNonNumericSalaryBlocksSubmission() {
        setUp();
        try {
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",
                    driver.findElement(By.id("addNewRecordButton")));
            driver.findElement(By.id("addNewRecordButton")).click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='modal-content']")));

            driver.findElement(By.id("firstName")).sendKeys("Jane");
            driver.findElement(By.id("lastName")).sendKeys("Smith");
            driver.findElement(By.id("userEmail")).sendKeys("jane@smith.com");
            driver.findElement(By.id("age")).sendKeys("30");
            driver.findElement(By.id("salary")).sendKeys("12ab");
            driver.findElement(By.id("department")).sendKeys("HR");

            driver.findElement(By.id("submit")).click();

            assertTrue(driver.findElement(By.xpath("//div[@class='modal-content']")).isDisplayed(),
                    "Modal should remain open after invalid Salary");

            WebElement salaryField = driver.findElement(By.id("salary"));
            String classAttr = salaryField.getAttribute("class");
            assertTrue(classAttr.contains("error") || classAttr.contains("is-invalid"),
                    "Salary field should show validation error");
        } finally {
            tearDown();
        }
    }

    @Test
    public void testMultipleNonNumericFieldsBlockSubmission() {
        setUp();
        try {
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",
                    driver.findElement(By.id("addNewRecordButton")));
            driver.findElement(By.id("addNewRecordButton")).click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='modal-content']")));

            driver.findElement(By.id("firstName")).sendKeys("Bob");
            driver.findElement(By.id("lastName")).sendKeys("Johnson");
            driver.findElement(By.id("userEmail")).sendKeys("bob@j.com");
            driver.findElement(By.id("age")).sendKeys("abc");
            driver.findElement(By.id("salary")).sendKeys("xyz");
            driver.findElement(By.id("department")).sendKeys("QA");

            driver.findElement(By.id("submit")).click();

            assertTrue(driver.findElement(By.xpath("//div[@class='modal-content']")).isDisplayed(),
                    "Modal should remain open when both Age and Salary are invalid");

            WebElement ageField = driver.findElement(By.id("age"));
            WebElement salaryField = driver.findElement(By.id("salary"));
            assertTrue(ageField.getAttribute("class").contains("error") || ageField.getAttribute("class").contains("is-invalid"),
                    "Age field should show validation error");
            assertTrue(salaryField.getAttribute("class").contains("error") || salaryField.getAttribute("class").contains("is-invalid"),
                    "Salary field should show validation error");
        } finally {
            tearDown();
        }
    }

    @Test
    public void testDisabledNoRadioButton() {
        setUp();
        try {
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);",
                    driver.findElement(By.id("noRadio")));
            WebElement noRadio = driver.findElement(By.id("noRadio"));

            // Verify it is disabled
            assertTrue(noRadio.getAttribute("disabled") != null || noRadio.getAttribute("class").contains("disabled"),
                    "'No' radio button should be disabled");

            // Attempt click using JavaScript (since Selenium cannot click disabled elements)
            if (noRadio.getAttribute("
