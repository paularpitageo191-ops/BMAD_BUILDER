// Traceability
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.JavascriptExecutor;

import java.time.Duration;
import java.nio.file.StandardCopyOption;
import java.nio.file.Path;
import java.nio.file.Files;
import java.io.File;
import org.junit.jupiter.api.TestInfo;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.OutputType;

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
            captureEvidence(null);
            driver.quit();
        }
    }

    // TC-01: Email validation rejects input without TLD
    @Test
    public void testEmailRejectsWithoutTLD() {
        driver.get("https://demoqa.com/text-box");
        WebElement emailInput = driver.findElement(By.id("userEmail"));
        emailInput.sendKeys("test@domain");
        driver.findElement(By.id("submit")).click();

        // Check that validation message appears (HTML5 validation)
        String validationMessage = emailInput.getAttribute("validationMessage");
        assertNotNull(validationMessage, "Validation message should be present");
        assertFalse(validationMessage.isEmpty(), "Validation message should not be empty");

        // Check that output section is not visible (display:none or not in DOM)
        boolean outputDisplayed = driver.findElements(By.id("output")).stream()
                .anyMatch(WebElement::isDisplayed);
        assertFalse(outputDisplayed, "Output should not be displayed for invalid email");
    }

    // TC-02: Email validation rejects input without @
    @Test
    public void testEmailRejectsWithoutAtSign() {
        driver.get("https://demoqa.com/text-box");
        WebElement emailInput = driver.findElement(By.id("userEmail"));
        emailInput.sendKeys("testdomain.com");
        driver.findElement(By.id("submit")).click();

        String validationMessage = emailInput.getAttribute("validationMessage");
        assertNotNull(validationMessage);
        assertFalse(validationMessage.isEmpty());
        assertFalse(driver.findElement(By.id("output")).isDisplayed());
    }

    // TC-03: Email validation rejects empty input
    @Test
    public void testEmailRejectsEmpty() {
        driver.get("https://demoqa.com/text-box");
        WebElement emailInput = driver.findElement(By.id("userEmail"));
        emailInput.clear();
        driver.findElement(By.id("submit")).click();

        // For empty field, HTML5 required validation may fire if the field has 'required'
        // If not, just check that output remains hidden
        assertFalse(driver.findElement(By.id("output")).isDisplayed());
    }

    // TC-04: Email validation accepts valid input and shows output
    @Test
    public void testEmailAcceptsValid() {
        driver.get("https://demoqa.com/text-box");
        driver.findElement(By.id("userName")).sendKeys("John Doe");
        driver.findElement(By.id("userEmail")).sendKeys("test@example.com");
        driver.findElement(By.id("currentAddress")).sendKeys("123 Main St");
        driver.findElement(By.id("permanentAddress")).sendKeys("456 Oak Ave");
        driver.findElement(By.id("submit")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("output")));
        WebElement output = driver.findElement(By.id("output"));
        assertTrue(output.isDisplayed());
        assertTrue(output.getText().contains("Email:test@example.com"));
    }

    // TC-05: Web table rejects non-numeric Age
    @Test
    public void testWebTableRejectsNonNumericAge() {
        driver.get("https://demoqa.com/webtables");
        driver.findElement(By.id("addNewRecordButton")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".modal-content")));

        driver.findElement(By.id("firstName")).sendKeys("Alice");
        driver.findElement(By.id("lastName")).sendKeys("Smith");
        driver.findElement(By.id("userEmail")).sendKeys("alice@example.com");
        driver.findElement(By.id("age")).sendKeys("abc");
        driver.findElement(By.id("salary")).sendKeys("50000");
        driver.findElement(By.id("department")).sendKeys("QA");
        driver.findElement(By.id("submit")).click();

        // Modal should remain open
        assertTrue(driver.findElement(By.cssSelector(".modal-content")).isDisplayed());
        // Check that no new row appears for Alice
        long rowCount = driver.findElements(By.cssSelector(".rt-tr-group")).stream()
                .filter(row -> row.getText().contains("Alice"))
                .count();
        assertEquals(0, rowCount, "No new row should be added");
    }

    // TC-06: Web table rejects non-numeric Salary
    @Test
    public void testWebTableRejectsNonNumericSalary() {
        driver.get("https://demoqa.com/webtables");
        driver.findElement(By.id("addNewRecordButton")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".modal-content")));

        driver.findElement(By.id("firstName")).sendKeys("Bob");
        driver.findElement(By.id("lastName")).sendKeys("Jones");
        driver.findElement(By.id("userEmail")).sendKeys("bob@example.com");
        driver.findElement(By.id("age")).sendKeys("30");
        driver.findElement(By.id("salary")).sendKeys("12ab");
        driver.findElement(By.id("department")).sendKeys("Engineering");
        driver.findElement(By.id("submit")).click();

        assertTrue(driver.findElement(By.cssSelector(".modal-content")).isDisplayed());
        long rowCount = driver.findElements(By.cssSelector(".rt-tr-group")).stream()
                .filter(row -> row.getText().contains("Bob"))
                .count();
        assertEquals(0, rowCount);
    }

    // TC-07: Web table rejects empty Age and Salary
    @Test
    public void testWebTableRejectsEmptyAgeSalary() {
        driver.get("https://demoqa.com/webtables");
        driver.findElement(By.id("addNewRecordButton")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".modal-content")));

        driver.findElement(By.id("firstName")).sendKeys("Carol");
        driver.findElement(By.id("lastName")).sendKeys("White");
        driver.findElement(By.id("userEmail")).sendKeys("carol@example.com");
        // leave age and salary empty
        driver.findElement(By.id("department")).sendKeys("HR");
        driver.findElement(By.id("submit")).click();

        assertTrue(driver.findElement(By.cssSelector(".modal-content")).isDisplayed());
        long rowCount = driver.findElements(By.cssSelector(".rt-tr-group")).stream()
                .filter(row -> row.getText().contains("Carol"))
                .count();
        assertEquals(0, rowCount);
    }

    // TC-08: Radio Button No option is disabled and non-interactable
    @Test
    public void testRadioButtonNoIsDisabled() {
        driver.get("https://demoqa.com/radio-button");
        WebElement noRadio = driver.findElement(By.id("noRadio"));
        assertTrue(noRadio.getAttribute("disabled") != null, "#noRadio should be disabled");
        assertFalse(noRadio.isEnabled(), "#noRadio should not be enabled");

        // Record current selected state (any other radio)
        WebElement yesRadio = driver.findElement(By.id("yesRadio"));
        boolean wasYesSelected = yesRadio.isSelected();
        WebElement impressiveRadio = driver.findElement(By.id("impressiveRadio"));
        boolean wasImpressiveSelected = impressiveRadio.isSelected();

        // Attempt to click the disabled radio using JavaScript
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].click();", noRadio);

        // Verify that no state change occurred
        assertEquals(wasYesSelected, yesRadio.isSelected(), "Yes radio selection should not change");
        assertEquals(wasImpressiveSelected, impressiveRadio.isSelected(), "Impressive radio selection should not change");
        assertTrue(noRadio.getAttribute("disabled") != null, "#noRadio should still be disabled");
    }

    // TC-09: General negative boundary on empty inputs for Elements forms
    @Test
    public void testGeneralEmptyInputsBoundary() {
        // Part 1: Empty text box fields
        driver.get("https://demoqa.com/text-box");
        driver.findElement(By.id("submit")).click();
        assertFalse(driver.findElement(By.id("output")).isDisplayed());

        // Part 2: Empty web table fields
        driver.get("https://demoqa.com/webtables");
        driver.findElement(By.id("addNewRecordButton")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".modal-content")));
        driver.findElement(By.id("submit")).click();
        assertTrue(driver.findElement(By.cssSelector(".modal-content")).isDisplayed());

        // Part 3: Radio button disabled state persists after navigation
        driver.get("https://demoqa.com/radio-button");
        WebElement noRadio = driver.findElement(By.id("noRadio"));
        assertTrue(noRadio.getAttribute("disabled") != null, "#noRadio should remain disabled after navigation");
    }

    private void captureEvidence(TestInfo testInfo) {
        if (!(driver instanceof TakesScreenshot)) {
            return;
        }
        try {
            Path evidenceDir = Path.of("target", "selenium-evidence");
            Files.createDirectories(evidenceDir);
            String rawName = testInfo != null ? testInfo.getDisplayName() : "selenium-test-" + System.currentTimeMillis();
            String safeName = rawName.replaceAll("[^A-Za-z0-9._-]+", "_");
            File source = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            Files.copy(source.toPath(), evidenceDir.resolve(safeName + ".png"), StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception ignored) {
        }
    }

}
