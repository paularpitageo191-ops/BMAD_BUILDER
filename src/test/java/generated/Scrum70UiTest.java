// Traceability
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
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
    private static final String BASE_URL = "https://demoqa.com/elements";

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
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get(BASE_URL);

    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // TC01 – Email Validation - Invalid email missing TLD
    @Test
    public void testEmailInvalidMissingTLD() {
        WebElement emailInput = driver.findElement(By.cssSelector("#userEmail"));
        emailInput.sendKeys("test@domain");
        // Click on another element to trigger validation
        driver.findElement(By.cssSelector("#submit")).click();
        // Wait for possible validation error (UI may show red border)
        // Check that output is not displayed
        assertFalse(driver.findElements(By.cssSelector("#output")).size() > 0,
                "Output section should not be visible for invalid email");
        // Additionally, verify validation error presence (CSS class for error)
        String outerHtml = emailInput.getAttribute("outerHTML");
        // DemoQA uses invalid class on validation failure
        assertTrue(outerHtml.contains("field-error") || emailInput.getAttribute("class").contains("error"),
                "Validation error should be visible on email field");
    }

    // TC02 – Email Validation - Invalid email with special characters
    @Test
    public void testEmailInvalidSpecialChars() {
        WebElement emailInput = driver.findElement(By.cssSelector("#userEmail"));
        emailInput.sendKeys("test@domain..com");
        driver.findElement(By.cssSelector("#submit")).click();
        assertFalse(driver.findElements(By.cssSelector("#output")).size() > 0);
        String outerHtml = emailInput.getAttribute("outerHTML");
        assertTrue(outerHtml.contains("field-error") || emailInput.getAttribute("class").contains("error"));
    }

    // TC03 – Email Validation - Valid email produces output
    @Test
    public void testEmailValidProducesOutput() {
        WebElement emailInput = driver.findElement(By.cssSelector("#userEmail"));
        emailInput.sendKeys("test@domain.com");
        driver.findElement(By.cssSelector("#submit")).click();
        WebElement output = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#output")));
        assertTrue(output.isDisplayed());
        assertTrue(output.getText().contains("test@domain.com"));
    }

    // TC04 – Web Tables - Age field non-numeric entry
    @Test
    public void testWebTablesAgeNonNumeric() {
        // Open registration modal
        driver.findElement(By.cssSelector("#addNewRecordButton")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#age")));
        // Fill fields with valid data except age
        driver.findElement(By.cssSelector("#firstName")).sendKeys("John");
        driver.findElement(By.cssSelector("#lastName")).sendKeys("Doe");
        driver.findElement(By.cssSelector("#userEmail")).sendKeys("john@example.com");
        driver.findElement(By.cssSelector("#salary")).sendKeys("50000");
        driver.findElement(By.cssSelector("#department")).sendKeys("QA");
        // Enter non-numeric age
        WebElement ageField = driver.findElement(By.cssSelector("#age"));
        ageField.clear();
        ageField.sendKeys("abc");
        // Click submit
        driver.findElement(By.cssSelector("#submit")).click();
        // Modal should still be open
        WebElement modal = driver.findElement(By.cssSelector("#registration-form-modal"));
        assertTrue(modal.isDisplayed(), "Modal should remain open after invalid age entry");
        // Check validation indication (red border)
        String ageClass = ageField.getAttribute("class");
        assertTrue(ageClass.contains("error") || ageClass.contains("is-invalid") || 
                driver.findElements(By.cssSelector("#age ~ .invalid-feedback")).size() > 0,
                "Age field should show validation error");
    }

    // TC05 – Web Tables - Salary field non-numeric entry
    @Test
    public void testWebTablesSalaryNonNumeric() {
        driver.findElement(By.cssSelector("#addNewRecordButton")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#salary")));
        driver.findElement(By.cssSelector("#firstName")).sendKeys("Jane");
        driver.findElement(By.cssSelector("#lastName")).sendKeys("Doe");
        driver.findElement(By.cssSelector("#userEmail")).sendKeys("jane@example.com");
        WebElement ageField = driver.findElement(By.cssSelector("#age"));
        ageField.clear();
        ageField.sendKeys("30");
        driver.findElement(By.cssSelector("#department")).sendKeys("Engineering");
        WebElement salaryField = driver.findElement(By.cssSelector("#salary"));
        salaryField.clear();
        salaryField.sendKeys("12ab");
        driver.findElement(By.cssSelector("#submit")).click();
        WebElement modal = driver.findElement(By.cssSelector("#registration-form-modal"));
        assertTrue(modal.isDisplayed());
        String salaryClass = salaryField.getAttribute("class");
        assertTrue(salaryClass.contains("error") || salaryClass.contains("is-invalid") ||
                driver.findElements(By.cssSelector("#salary ~ .invalid-feedback")).size() > 0);
    }

    // TC06 – Web Tables - Age field negative number boundary
    @Test
    public void testWebTablesAgeNegativeBoundary() {
        driver.findElement(By.cssSelector("#addNewRecordButton")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#age")));
        driver.findElement(By.cssSelector("#firstName")).sendKeys("Alice");
        driver.findElement(By.cssSelector("#lastName")).sendKeys("Smith");
        driver.findElement(By.cssSelector("#userEmail")).sendKeys("alice@example.com");
        driver.findElement(By.cssSelector("#salary")).sendKeys("60000");
        driver.findElement(By.cssSelector("#department")).sendKeys("HR");
        WebElement ageField = driver.findElement(By.cssSelector("#age"));
        ageField.clear();
        ageField.sendKeys("-5");
        driver.findElement(By.cssSelector("#submit")).click();
        WebElement modal = driver.findElement(By.cssSelector("#registration-form-modal"));
        assertTrue(modal.isDisplayed(), "Modal should remain open with negative age");
        // Expect validation error on age field
        String ageClass = ageField.getAttribute("class");
        assertTrue(ageClass.contains("error") || ageClass.contains("is-invalid") ||
                driver.findElements(By.cssSelector("#age ~ .invalid-feedback")).size() > 0);
    }

    // TC07 – Web Tables - Empty mandatory fields
    @Test
    public void testWebTablesEmptyMandatoryFields() {
        driver.findElement(By.cssSelector("#addNewRecordButton")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#age")));
        driver.findElement(By.cssSelector("#firstName")).sendKeys("Bob");
        driver.findElement(By.cssSelector("#lastName")).sendKeys("Brown");
        driver.findElement(By.cssSelector("#userEmail")).sendKeys("bob@example.com");
        // Leave age and salary empty
        driver.findElement(By.cssSelector("#department")).sendKeys("Finance");
        driver.findElement(By.cssSelector("#submit")).click();
        WebElement modal = driver.findElement(By.cssSelector("#registration-form-modal"));
        assertTrue(modal.isDisplayed(), "Modal should remain open when mandatory fields are empty");
        // Check for validation indicators on age and salary
        WebElement ageField = driver.findElement(By.cssSelector("#age"));
        WebElement salaryField = driver.findElement(By.cssSelector("#salary"));
        String ageClass = ageField.getAttribute("class");
        String salaryClass = salaryField.getAttribute("class");
        boolean ageError = ageClass.contains("error") || ageClass.contains("is-invalid") ||
                driver.findElements(By.cssSelector("#age ~ .invalid-feedback")).size() > 0;
        boolean salaryError = salaryClass.contains("error") || salaryClass.contains("is-invalid") ||
                driver.findElements(By.cssSelector("#salary ~ .invalid-feedback")).size() > 0;
        assertTrue(ageError || salaryError, "At least one mandatory field should show validation error");
    }

    // TC08 – Radio Button - 'No' option remains disabled
    @Test
    public void testRadioButtonNoDisabled() {
        // Scroll to radio button section
        WebElement noRadio = driver.findElement(By.cssSelector("#noRadio"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", noRadio);
        assertTrue(noRadio.getAttribute("disabled") != null, "No radio button should be disabled");
        // Try clicking standard
        try {
            noRadio.click();
        } catch (Exception e) {
            // Expected - element not interactable
        }
        assertFalse(noRadio.isSelected(), "No radio should remain unselected after attempted click");
    }

    // TC09 – Radio Button - Click disabled 'No' does not trigger state change
    @Test
    public void testRadioButtonNoClickNoStateChange() {
        WebElement yesRadio = driver.findElement(By.cssSelector("#yesRadio"));
        WebElement noRadio = driver.findElement(By.cssSelector("#noRadio"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", noRadio);
        // Click Yes first to have a selected state
        yesRadio.click();
        assertTrue(yesRadio.isSelected(), "Yes radio should be selected");
        // Attempt to click No (should be disabled)
        try {
            noRadio.click();
        } catch (Exception e) {
            // Expected
        }
        assertTrue(yesRadio.isSelected(), "Yes radio should remain selected after clicking disabled No");
        assertFalse(noRadio.isSelected(), "No radio should still be unselected");
    }

    // TC10 – UI Stability - Overlay obstruction handling
    @Test
    public void testUIStabilityOverlayObstruction() {
        // Inject overlay covering #userEmail and #submit
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript(
            "var overlay = document.createElement('div');" +
            "overlay.id = 'test-overlay';" +
            "overlay.style.position = 'fixed';" +
            "overlay.style.top = '0';" +
            "overlay.style.left = '0';" +
            "overlay.style.width = '100%';" +
            "overlay.style.height = '100%';" +
            "overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';" +
            "overlay.style.zIndex = '9999';" +
            "document.body.appendChild(overlay);"
        );
        // Scroll #userEmail into view and attempt click
        WebElement emailInput = driver.findElement(By.cssSelector("#userEmail"));
        js.executeScript("arguments[0].scrollIntoView(true);", emailInput);
        // Use Actions to focus/click
        emailInput.click();
        assertTrue(emailInput.equals(driver.switchTo().activeElement()) || 
                emailInput.getAttribute("class").contains("focus"),
                "Email field should be interactable despite overlay");
        // Remove overlay
        js.executeScript("document.getElementById('test-overlay').remove();");
        // Ensure normal interaction works
        emailInput.sendKeys("test@domain.com");
        WebElement submitBtn = driver.findElement(By.cssSelector("#submit"));
        js.executeScript("arguments[0].scrollIntoView(true);", submitBtn);
        submitBtn.click();
        WebElement output = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#output")));
        assertTrue(output.isDisplayed(), "Normal interaction should work after overlay removed");
    }

    // TC11 – UI Stability - Scroll-to-view for hidden elements
    @Test
    public void testUIStabilityScrollToView() {
        // Resize window to small viewport
        driver.manage().window().setSize(new org.openqa.selenium.Dimension(400, 600));
        WebElement emailInput = driver.findElement(By.cssSelector("#userEmail"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", emailInput);
        emailInput.click();
        assertTrue(emailInput.equals(driver.switchTo().activeElement()) || 
                emailInput.getAttribute("class").contains("focus"),
                "Email field should be focused after scrolling");
        WebElement submitBtn = driver.findElement(By.cssSelector("#submit"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", submitBtn);
        submitBtn.click();
        // After click, verify no exception (implicitly passed)
        // Optionally check page not crashed
    }

    // TC12 – Email Validation - Invalid email with leading/trailing spaces
    @Test
    public void testEmailInvalidWithSpaces() {
        WebElement emailInput = driver.findElement(By.cssSelector("#userEmail"));
        emailInput.sendKeys(" test@domain.com");
        driver.findElement(By.cssSelector("#submit")).click();
        assertFalse(driver.findElements(By.cssSelector("#output")).size() > 0,
                "Output should not appear for email with leading spaces");
        // Validation error expected
        String outerHtml = emailInput.getAttribute("outerHTML");
        assertTrue(outerHtml.contains("field-error") || emailInput.getAttribute("class").contains("error"),
                "Validation error should be shown for spaces in email");
    }
}
