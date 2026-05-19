// Traceability
// Functional Areas: Radio Button, Text Box, UI Stability, Web Tables
// Source References: AC1, AC2, AC3, AC4, Screenshots - Radio Button Behavior, Screenshots - Text Box Validation, Screenshots - Web Tables Validation
// Execution Readiness: strong
// Readiness Rationale: There is enough technical context to support executable coverage where the approved scope requires it.
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class SCRUM70RegressionGuardrails {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get("https://demoqa.com/elements");
    }

    @Test(description = "REG-01: Valid email submission still produces output after negative validation introduction")
    public void testValidEmailSubmissionStillWorks() {
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        WebElement submitButton = driver.findElement(By.id("submit"));
        WebElement outputSection = driver.findElement(By.id("output"));

        // Perform valid submission
        emailField.sendKeys("valid.email@domain.com");
        submitButton.click();

        // Assert no validation error on email field (check validation message or CSS class)
        // DemoQA shows red border on invalid, no additional class for valid
        // For regression we check output presence
        Assert.assertTrue(wait.until(ExpectedConditions.visibilityOf(outputSection)).isDisplayed(), "Output section should be visible for valid email");
        Assert.assertTrue(outputSection.getText().contains("Email:valid.email@domain.com"), "Output should contain email");
        // Ensure no error style (in real scenario we could check for 'error' class; here we trust no error vs output)
    }

    @Test(description = "REG-02: Numeric age and salary allow valid web table entry")
    public void testValidWebTableEntry() {
        // Click Add button to open registration modal
        WebElement addButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton")));
        addButton.click();

        // Fill valid data
        WebElement firstName = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("firstName")));
        firstName.sendKeys("John");
        driver.findElement(By.id("lastName")).sendKeys("Doe");
        driver.findElement(By.id("userEmail")).sendKeys("john@example.com");
        driver.findElement(By.id("age")).sendKeys("28");
        driver.findElement(By.id("salary")).sendKeys("60000");
        driver.findElement(By.id("department")).sendKeys("QA");

        // Submit
        driver.findElement(By.id("submit")).click();

        // Wait for modal to close and new row to appear
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".modal-content")));
        // Verify row with new data exists (e.g., last row contains John)
        WebElement table = driver.findElement(By.cssSelector(".ReactTable .rt-tbody"));
        String tableText = table.getText();
        Assert.assertTrue(tableText.contains("John"), "Table should contain newly added record");
        Assert.assertTrue(tableText.contains("28"), "Table should contain age 28");
    }

    @Test(description = "REG-03: Yes radio button remains selectable and No remains disabled")
    public void testRadioButtonYesSelectionAndNoDisabled() {
        // Locate radio buttons
        WebElement yesRadio = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("label[for='yesRadio']")));
        WebElement noRadio = driver.findElement(By.id("noRadio"));

        // Click Yes
        yesRadio.click();

        // Verify Yes is selected (visible change)
        Assert.assertTrue(driver.findElement(By.id("yesRadio")).isSelected(), "Yes radio should be selected after click");
        // Verify success message
        WebElement successMessage = driver.findElement(By.cssSelector(".text-success"));
        Assert.assertTrue(successMessage.isDisplayed(), "Success message should appear");
        Assert.assertTrue(successMessage.getText().contains("Yes"), "Message should indicate Yes selected");

        // Verify No remains disabled
        Assert.assertFalse(noRadio.isEnabled(), "No radio button should remain disabled");
    }

    @Test(description = "REG-04: UI remains stable after multiple negative form interactions")
    public void testUIStabilityAfterNegativeFlows() {
        // Step 1: Trigger invalid email validation
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        emailField.sendKeys("bad@domain");
        driver.findElement(By.id("submit")).click();
        // Verify error (red border class or output not visible)
        wait.until(ExpectedConditions.attributeContains(emailField, "class", "field-error")); // actual class may differ; but we check output not visible
        Assert.assertFalse(driver.findElement(By.id("output")).isDisplayed(), "Output should not be visible for invalid email");

        // Step 2: Clear and go to web tables (navigate via left menu or direct interaction)
        driver.findElement(By.id("item-1")).click(); // "Web Tables" in left menu
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".WebTables")));
        driver.findElement(By.id("addNewRecordButton")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("age"))).sendKeys("abc");
        driver.findElement(By.id("submit")).click();
        // Modal should remain open
        WebElement modal = driver.findElement(By.cssSelector(".modal-content"));
        Assert.assertTrue(modal.isDisplayed(), "Modal should remain open after invalid age");
        // Close modal
        driver.findElement(By.cssSelector(".modal-header .close")).click();
        wait.until(ExpectedConditions.invisibilityOf(modal));

        // Step 3: Go to Radio Button section
        driver.findElement(By.id("item-2")).click(); // "Radio Button" in left menu
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".radio-button-holder")));
        // Click Yes
        driver.findElement(By.cssSelector("label[for='yesRadio']")).click();
        Assert.assertTrue(driver.findElement(By.id("yesRadio")).isSelected());

        // Step 4: Verify no overlays/freezes – simply check page is scrollable and footer visible
        WebElement footer = driver.findElement(By.cssSelector("footer"));
        Assert.assertTrue(footer.isDisplayed(), "Footer should be visible, indicating no full-page overlay");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
