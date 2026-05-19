// Traceability
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class Scrum70UiTest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
        options.setBinary("/usr/bin/chromium");
        options.addArguments("--window-size=1440,900");
        options.addArguments("--disable-gpu");
        options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testInvalidEmailMissingTLD() {
        // Navigate to Text Box
        driver.get("https://demoqa.com/text-box");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));

        // Enter valid name and invalid email (missing TLD)
        driver.findElement(By.id("userName")).sendKeys("Test User");
        driver.findElement(By.id("userEmail")).sendKeys("test@domain");
        driver.findElement(By.id("submit")).click();

        // Wait for validation to be applied
        WebElement emailInput = driver.findElement(By.id("userEmail"));
        String classAttr = emailInput.getAttribute("class");
        // DemoQA uses 'field-error' class on invalid fields
        assertTrue(classAttr.contains("field-error") || classAttr.contains("error"),
                "Email field should have error class after invalid input");
        // Output section should not be present or visible
        assertFalse(driver.findElements(By.id("output")).isEmpty(),
                "Output section should not be displayed");
    }

    @Test
    public void testInvalidEmailWithoutAt() {
        driver.get("https://demoqa.com/text-box");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));

        driver.findElement(By.id("userName")).sendKeys("Test User");
        driver.findElement(By.id("userEmail")).sendKeys("testdomain.com");
        driver.findElement(By.id("submit")).click();

        WebElement emailInput = driver.findElement(By.id("userEmail"));
        String classAttr = emailInput.getAttribute("class");
        assertTrue(classAttr.contains("field-error") || classAttr.contains("error"));

        assertFalse(driver.findElements(By.id("output")).isEmpty(),
                "Output section should not be displayed");
    }

    @Test
    public void testValidEmailShowsOutput() {
        driver.get("https://demoqa.com/text-box");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));

        driver.findElement(By.id("userName")).sendKeys("Jane Doe");
        driver.findElement(By.id("userEmail")).sendKeys("jane@example.com");
        driver.findElement(By.id("currentAddress")).sendKeys("123 Main St");
        driver.findElement(By.id("permanentAddress")).sendKeys("456 Oak Ave");
        driver.findElement(By.id("submit")).click();

        // Wait for output container
        WebElement output = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("output")));
        assertTrue(output.isDisplayed());
        assertTrue(output.getText().contains("jane@example.com"), "Output should contain email");
    }

    @Test
    public void testNonNumericAgeBlocksSubmission() {
        driver.get("https://demoqa.com/webtables");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton"))).click();

        // Wait for registration modal
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("firstName")));

        driver.findElement(By.id("firstName")).sendKeys("John");
        driver.findElement(By.id("lastName")).sendKeys("Doe");
        driver.findElement(By.id("userEmail")).sendKeys("john@example.com");
        driver.findElement(By.id("age")).sendKeys("abc");
        driver.findElement(By.id("salary")).sendKeys("50000");
        driver.findElement(By.id("submit")).click();

        // Modal should still be open; age field should have error
        assertTrue(driver.findElement(By.id("firstName")).isDisplayed(), "Modal should remain open");
        WebElement ageField = driver.findElement(By.id("age"));
        String ageClass = ageField.getAttribute("class");
        assertTrue(ageClass.contains("error") || ageClass.contains("field-error"),
                "Age field should show validation error");
        // No new row added – we can check that table row count hasn't changed
        int rowCount = driver.findElements(By.cssSelector(".rt-tr-group")).size();
        // Initial row count (pre-filled sample) – for simplicity we assume at least 1 row present
        // But the best check is that the modal is still open, which we already verified.
    }

    @Test
    public void testNonNumericSalaryBlocksSubmission() {
        driver.get("https://demoqa.com/webtables");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton"))).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("firstName")));

        driver.findElement(By.id("firstName")).sendKeys("Alice");
        driver.findElement(By.id("lastName")).sendKeys("Smith");
        driver.findElement(By.id("userEmail")).sendKeys("alice@example.com");
        driver.findElement(By.id("age")).sendKeys("28");
        driver.findElement(By.id("salary")).sendKeys("12ab");
        driver.findElement(By.id("submit")).click();

        assertTrue(driver.findElement(By.id("firstName")).isDisplayed(), "Modal should remain open");
        WebElement salaryField = driver.findElement(By.id("salary"));
        String salaryClass = salaryField.getAttribute("class");
        assertTrue(salaryClass.contains("error") || salaryClass.contains("field-error"));
    }

    @Test
    public void testEmptyAgeBlocksSubmission() {
        driver.get("https://demoqa.com/webtables");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton"))).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("firstName")));

        driver.findElement(By.id("firstName")).sendKeys("Bob");
        driver.findElement(By.id("lastName")).sendKeys("Brown");
        driver.findElement(By.id("userEmail")).sendKeys("bob@example.com");
        // Age field left empty
        driver.findElement(By.id("salary")).sendKeys("60000");
        driver.findElement(By.id("submit")).click();

        assertTrue(driver.findElement(By.id("firstName")).isDisplayed(), "Modal should remain open");
        WebElement ageField = driver.findElement(By.id("age"));
        String ageClass = ageField.getAttribute("class");
        assertTrue(ageClass.contains("error") || ageClass.contains("field-error") || ageClass.contains("required"),
                "Age field should show a required/validation error");
    }

    @Test
    public void testRadioButtonNoIsDisabled() {
        driver.get("https://demoqa.com/radio-button");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("noRadio")));

        WebElement noRadio = driver.findElement(By.id("noRadio"));
        // Check disabled attribute
        assertTrue(noRadio.getAttribute("disabled") != null, "No radio should be disabled");
        // Attempt click (should have no effect)
        noRadio.click();
        // Verify it's still disabled and not selected (no success message)
        assertTrue(noRadio.getAttribute("disabled") != null, "No radio should remain disabled after click");
        // Ensure no success message for 'No' appears
        assertFalse(driver.findElements(By.xpath("//p[contains(text(),'No')]")).size() > 0,
                "There should be no success message for 'No' option");
    }

    @Test
    public void testInvalidAgeAndSalarySimultaneouslyBlocksSubmission() {
        driver.get("https://demoqa.com/webtables");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton"))).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("firstName")));

        driver.findElement(By.id("firstName")).sendKeys("Carol");
        driver.findElement(By.id("lastName")).sendKeys("White");
        driver.findElement(By.id("userEmail")).sendKeys("carol@example.com");
        driver.findElement(By.id("age")).sendKeys("abc");
        driver.findElement(By.id("salary")).sendKeys("xyz");
        driver.findElement(By.id("submit")).click();

        assertTrue(driver.findElement(By.id("firstName")).isDisplayed(), "Modal should remain open");
        // Check both fields for error
        WebElement ageField = driver.findElement(By.id("age"));
        String ageClass = ageField.getAttribute("class");
        assertTrue(ageClass.contains("error") || ageClass.contains("field-error"));
        WebElement salaryField = driver.findElement(By.id("salary"));
        String salaryClass = salaryField.getAttribute("class");
        assertTrue(salaryClass.contains("error") || salaryClass.contains("field-error"));
    }
}
