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

        WebElement submit = driver.findElement(By.id("submit"));
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", submit);
        wait.until(ExpectedConditions.elementToBeClickable(submit)).click();

        // Wait for modal to close
        wait.until(ExpectedConditions.invisibilityOf(modal));

        // Filter by the submitted email to make the rendered row deterministic.
        WebElement searchBox = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("searchBox")));
        searchBox.clear();
        searchBox.sendKeys("john@doe.com");

        WebElement emailCell = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//div[contains(@class,'rt-td')][normalize-space()='john@doe.com']")
                )
        );
        WebElement row = emailCell.findElement(By.xpath("./ancestor::div[contains(@class,'rt-tr-group')]"));
        assertTrue(row.getText().contains("John"), "Created row should contain the submitted first name");
        assertTrue(row.getText().contains("Doe"), "Created row should contain the submitted last name");
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
        // Navigate to the module landing page and ensure the UI remains usable.
        driver.get(BASE_URL + "/elements");
        WebElement textBoxNav = wait.until(
                ExpectedConditions.elementToBeClickable(By.xpath("//span[text()='Text Box']"))
        );
        textBoxNav.click();

        wait.until(ExpectedConditions.urlContains("/text-box"));
        WebElement submitButton = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("submit")));
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", submitButton);

        assertTrue(submitButton.isDisplayed(), "Text Box submit button should remain interactable after navigation");
        assertTrue(driver.getCurrentUrl().contains("/text-box"), "Navigation should land on the Text Box page");
    }
}
