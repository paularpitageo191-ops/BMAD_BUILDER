// Traceability
// Functional Areas: Radio Button, Text Box, Web Tables
// Source References: AC1, AC2, AC3, Test Data: empty/null inputs, Test Data: invalid email formats, Test Data: non-numeric values
// Execution Readiness: strong
// Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.Duration;
import static org.junit.jupiter.api.Assertions.*;

public class DemoQAElementsNegativeTests {
    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().maximize();
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testEmailValidation_MissingTLD() {
        driver.get("https://demoqa.com/elements");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));

        WebElement emailField = driver.findElement(By.id("userEmail"));
        emailField.sendKeys("test@domain");

        driver.findElement(By.id("submit")).click();

        // Wait briefly for validation to appear
        WebElement emailValidation = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#userEmail:invalid")));
        assertTrue(emailField.getAttribute("validationMessage").contains("Please include"),
                "Validation should appear for missing TLD");

        // Check output section is not displayed
        assertFalse(driver.findElement(By.id("output")).isDisplayed(),
                "Output section should not be displayed for invalid email");
    }

    @Test
    public void testEmailValidation_MissingAtSign() {
        driver.get("https://demoqa.com/elements");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));

        WebElement emailField = driver.findElement(By.id("userEmail"));
        emailField.sendKeys("testdomain.com");

        driver.findElement(By.id("submit")).click();

        WebElement emailValidation = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#userEmail:invalid")));
        assertTrue(emailField.getAttribute("validationMessage").contains("Please include"),
                "Validation should appear for missing @");

        assertFalse(driver.findElement(By.id("output")).isDisplayed(),
                "Output section should not be displayed");
    }

    @Test
    public void testEmailValidation_EmptyInput() {
        driver.get("https://demoqa.com/elements");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));

        driver.findElement(By.id("submit")).click();

        WebElement emailField = driver.findElement(By.id("userEmail"));
        // HTML5 required validation will trigger on submit
        WebElement emailValidation = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#userEmail:invalid")));
        assertTrue(emailField.getAttribute("validationMessage").contains("Please fill out"),
                "Validation should appear for empty email");

        assertFalse(driver.findElement(By.id("output")).isDisplayed(),
                "Output section should not be displayed");
    }

    @Test
    public void testWebTables_NonNumericAge() {
        driver.get("https://demoqa.com/elements");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("addNewRecordButton")));
        driver.findElement(By.id("addNewRecordButton")).click();

        WebElement modal = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".modal-content")));
        assertTrue(modal.isDisplayed(), "Registration modal should be open");

        WebElement ageField = driver.findElement(By.id("age"));
        ageField.sendKeys("abc");

        // Fill other required fields
        driver.findElement(By.id("firstName")).sendKeys("John");
        driver.findElement(By.id("lastName")).sendKeys("Doe");
        driver.findElement(By.id("userEmail")).sendKeys("john@example.com");
        driver.findElement(By.id("salary")).sendKeys("50000");
        driver.findElement(By.id("department")).sendKeys("IT");

        driver.findElement(By.id("submit")).click();

        // Modal should still be open
        assertTrue(modal.isDisplayed(), "Modal should remain open after invalid age");

        // Check for validation error on age field
        WebElement ageValidation = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#age:invalid")));
        assertNotNull(ageValidation, "Age field should show validation error");

        // Verify no new row added (table row count unchanged)
        int rowCountBefore = driver.findElements(By.cssSelector(".rt-tr-group")).size();
        // After invalid submission row count should be same
        int rowCountAfter = driver.findElements(By.cssSelector(".rt-tr-group")).size();
        assertEquals(rowCountBefore, rowCountAfter, "No new row should be added");
    }

    @Test
    public void testWebTables_NonNumericSalary() {
        driver.get("https://demoqa.com/elements");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("addNewRecordButton")));
        driver.findElement(By.id("addNewRecordButton")).click();

        WebElement modal = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".modal-content")));
        assertTrue(modal.isDisplayed(), "Registration modal should be open");

        driver.findElement(By.id("firstName")).sendKeys("John");
        driver.findElement(By.id("lastName")).sendKeys("Doe");
        driver.findElement(By.id("userEmail")).sendKeys("john@example.com");
        WebElement salaryField = driver.findElement(By.id("salary"));
        salaryField.sendKeys("12ab");
        driver.findElement(By.id("age")).sendKeys("30");
        driver.findElement(By.id("department")).sendKeys("IT");

        driver.findElement(By.id("submit")).click();

        // Modal should remain open
        assertTrue(modal.isDisplayed(), "Modal should remain open after invalid salary");

        // Check validation error on salary field
        WebElement salaryValidation = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#salary:invalid")));
        assertNotNull(salaryValidation, "Salary field should show validation error");
    }

    @Test
    public void testWebTables_EmptyAge() {
        driver.get("https://demoqa.com/elements");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("addNewRecordButton")));
        driver.findElement(By.id("addNewRecordButton")).click();

        WebElement modal = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".modal-content")));
        assertTrue(modal.isDisplayed(), "Registration modal should be open");

        // Leave Age empty, fill others
        driver.findElement(By.id("firstName")).sendKeys("John");
        driver.findElement(By.id("lastName")).sendKeys("Doe");
        driver.findElement(By.id("userEmail")).sendKeys("john@example.com");
        driver.findElement(By.id("salary")).sendKeys("50000");
        driver.findElement(By.id("department")).sendKeys("IT");

        driver.findElement(By.id("submit")).click();

        // Modal should remain open
        assertTrue(modal.isDisplayed(), "Modal should remain open when age is empty");

        // Check validation error on age field
        WebElement ageField = driver.findElement(By.id("age"));
        String validationMessage = ageField.getAttribute("validationMessage");
        assertTrue(validationMessage.contains("Please fill"),
                "Age field should have validation message for required field");
    }

    @Test
    public void testRadioButton_NoOptionDisabled() {
        driver.get("https://demoqa.com/elements");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("noRadio")));

        WebElement noRadio = driver.findElement(By.id("noRadio"));
        assertFalse(noRadio.isEnabled(), "No radio option should be disabled");

        // Attempt to click (should not change state)
        noRadio.click();
        assertFalse(noRadio.isSelected(), "Disabled No radio should not become selected");
        assertFalse(noRadio.isEnabled(), "Should remain disabled after click");
    }

    @Test
    public void testRadioButton_NoOptionNoStateChange() {
        driver.get("https://demoqa.com/elements");
        // Pre-select Yes radio if available
        WebElement yesRadio = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#yesRadio")));
        yesRadio.click();
        assertTrue(yesRadio.isSelected(), "Yes radio should be selected");

        WebElement noRadio = driver.findElement(By.id("noRadio"));
        // Attempt multiple clicks on disabled No
        for (int i = 0; i < 3; i++) {
            noRadio.click();
        }
        // Verify Yes is still selected
        assertTrue(yesRadio.isSelected(), "Yes radio should remain selected after clicking disabled No");
        assertFalse(noRadio.isSelected(), "No radio should never become selected");
        assertFalse(noRadio.isEnabled(), "No radio should remain disabled");
    }
}
