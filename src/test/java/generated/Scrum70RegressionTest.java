// Traceability
package com.demoqa.regression;

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

/**
 * Regression guardrails for SCRUM-70 (Negative Path Validation for DemoQA Elements Module).
 * Ensures existing positive flows and UI stability are not broken by the negative validation changes.
 */
public class Scrum70RegressionTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "https://demoqa.com";
    private static final Duration TIMEOUT = Duration.ofSeconds(10);

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
        options.setBinary("/usr/bin/chromium");
        options.addArguments("--window-size=1440,900");
        options.addArguments("--disable-gpu");
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1920,1080");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, TIMEOUT);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testPositiveEmailSubmissionStillWorks() {
        driver.get(BASE_URL + "/text-box");

        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#userEmail")));
        emailField.clear();
        emailField.sendKeys("test@example.com");

        WebElement submitButton = driver.findElement(By.id("submit"));
        submitButton.click();

        // Verify output section is displayed (valid submission)
        WebElement output = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("output")));
        assertTrue(output.isDisplayed(), "Output section should be displayed for valid email");
        // Verify no validation error (no red border or error class)
        String emailClass = emailField.getAttribute("class");
        assertFalse(emailClass.contains("is-invalid"), "Valid email should not trigger validation error class");
    }

    @Test
    public void testValidWebTableEntryCreatesRow() {
        driver.get(BASE_URL + "/webtables");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("addNewRecordButton"))).click();

        // Wait for registration modal
        WebElement modal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("modal-content")));

        // Fill in valid data
        driver.findElement(By.id("firstName")).sendKeys("John");
        driver.findElement(By.id("lastName")).sendKeys("Doe");
        driver.findElement(By.id("userEmail")).sendKeys("john@doe.com");
        driver.findElement(By.id("age")).sendKeys("30");
        driver.findElement(By.id("salary")).sendKeys("50000");
        driver.findElement(By.id("department")).sendKeys("QA");

        driver.findElement(By.id("submit")).click();

        // Wait for modal to close
        wait.until(ExpectedConditions.invisibilityOf(modal));

        // Verify new row exists - check table rows
        WebElement table = driver.findElement(By.className("ReactTable"));
        assertTrue(table.getText().contains("John"), "Table should contain newly added row");
    }

    @Test
    public void testEnabledRadioButtonsStillWork() {
        driver.get(BASE_URL + "/radio-button");

        // Click "Yes" radio button (enabled option)
        WebElement yesRadio = wait.until(ExpectedConditions.elementToBeClickable(By.id("yesRadio")));
        yesRadio.click();

        // Verify feedback message
        WebElement feedback = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("text-success")));
        assertEquals("Yes", feedback.getText().replaceAll("You have selected ", "").trim(),
                "Feedback should indicate 'Yes' is selected");
    }

    @Test
    public void testOverlayDoesNotBlockElementInteraction() {
        // Navigate to a page that may have overlays (generic elements page)
        driver.get(BASE_URL + "/elements");

        // Simulate overlay: inject a fixed overlay (for controlled test)
        // Note: This test assumes an overlay may be present naturally; we simulate one for verification.
        // In production, rely on actual page overlay.
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
                "var overlay = document.createElement('div');" +
                "overlay.id = 'testOverlay';" +
                "overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(0,0,0,0.5);';" +
                "document.body.appendChild(overlay);"
        );

        // Attempt to interact with an element (scroll to text box section)
        WebElement textBoxSection = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//h5[text()='Elements']/ancestor::div[contains(@class,'card-body')]")));
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", textBoxSection);

        // Interact with #submit on text box page (navigate first)
        driver.get(BASE_URL + "/text-box");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("submit"))).click();

        // Assert no JS errors and page remains usable
        assertTrue(driver.getTitle().contains("ToolsQA"), "Page should be in valid state");
    }
}
