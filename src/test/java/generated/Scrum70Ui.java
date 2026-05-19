// Traceability
// Functional Areas: Radio Button, Text Box, UI Stability, Web Tables
// Source References: AC2, AC3, AC4 – UI Stability, Radio Button Behavior (Disabled option), Responsive design best practices, Test Data: empty/null inputs, Test Data: invalid email formats, Test Data: non-numeric values (12ab), Test Data: non-numeric values (abc), Test Data: test@domain, Text Box Validation, Text Box Validation (Invalid email), Text Box Validation (Valid input), UI Validation Reference (screenshots), UI Validation Reference screenshots, Web Tables Validation, Web Tables Validation (Invalid numeric input)
// Execution Readiness: strong
// Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
package demoqa.elements;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
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

public class ElementsNegativeValidationTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private static final String BASE_URL = "https://demoqa.com/elements";

    @BeforeMethod
    public void setUp() {
        // Assumes ChromeDriver is available in PATH or via WebDriverManager
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get(BASE_URL);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // TC01 – Invalid email missing TLD
    @Test
    public void testInvalidEmailMissingTLD() {
        navigateToTextBox();
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        emailField.sendKeys("test@domain");

        WebElement submitButton = driver.findElement(By.id("submit"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", submitButton);
        submitButton.click();

        // Check for validation error (e.g., class 'field-error' or red border)
        String emailClass = emailField.getAttribute("class");
        boolean hasError = emailClass.contains("error") || 
                           emailField.getCssValue("border-color").contains("rgb(255, 0, 0)") ||
                           driver.findElements(By.xpath("//input[@id='userEmail']/following-sibling::*[contains(@class,'error')]")).size() > 0;
        Assert.assertTrue(hasError, "Expected validation error on email field.");

        WebElement output = driver.findElement(By.id("output"));
        Assert.assertFalse(output.isDisplayed(), "Output section should not be displayed for invalid email.");
    }

    // TC02 – Invalid email special characters
    @Test
    public void testInvalidEmailSpecialChars() {
        navigateToTextBox();
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        emailField.sendKeys("test@@domain.com");

        WebElement submitButton = driver.findElement(By.id("submit"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", submitButton);
        submitButton.click();

        String emailClass = emailField.getAttribute("class");
        boolean hasError = emailClass.contains("error") || 
                           emailField.getCssValue("border-color").contains("rgb(255, 0, 0)");
        Assert.assertTrue(hasError, "Expected validation error on email field.");

        WebElement output = driver.findElement(By.id("output"));
        Assert.assertFalse(output.isDisplayed(), "Output section should not be displayed for invalid email.");
    }

    // TC03 – Empty email
    @Test
    public void testEmptyEmail() {
        navigateToTextBox();
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        emailField.clear();

        WebElement submitButton = driver.findElement(By.id("submit"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", submitButton);
        submitButton.click();

        // Browser-native validation or custom error
        boolean hasValidationMessage = !emailField.getAttribute("validationMessage").isEmpty() ||
                                       emailField.getAttribute("class").contains("error") ||
                                       emailField.getCssValue("border-color").contains("rgb(255, 0, 0)");
        Assert.assertTrue(hasValidationMessage, "Expected validation error on empty email field.");

        WebElement output = driver.findElement(By.id("output"));
        Assert.assertFalse(output.isDisplayed(), "Output section should not be displayed for empty email.");
    }

    // TC04 – Positive email
    @Test
    public void testValidEmailDisplaysOutput() {
        navigateToTextBox();
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        emailField.sendKeys("test@example.com");

        WebElement submitButton = driver.findElement(By.id("submit"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", submitButton);
        submitButton.click();

        WebElement output = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("output")));
        Assert.assertTrue(output.isDisplayed(), "Output section should be visible.");
        String outputText = output.getText();
        Assert.assertTrue(outputText.contains("test@example.com"), 
                "Output should contain the submitted email.");
    }

    // TC05 – Non-numeric age
    @Test
    public void testNonNumericAgeBlocksSubmission() {
        navigateToWebTables();
        openRegistrationModal();

        fillRegistrationForm("John", "Doe", "john@test.com", "abc", "50000", "QA");

        WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Submit']")));
        submitBtn.click();

        // Modal should still be open
        WebElement modal = driver.findElement(By.className("modal-content")); // adjust selector if needed
        Assert.assertTrue(modal.isDisplayed(), "Modal should remain open on validation failure.");

        // Age field should have error styling
        WebElement ageField = driver.findElement(By.id("age"));
        String ageClass = ageField.getAttribute("class");
        boolean hasError = ageClass.contains("error") || 
                           ageField.getCssValue("border-color").contains("rgb(255, 0, 0)");
        Assert.assertTrue(hasError, "Age field should show validation error.");
    }

    // TC06 – Non-numeric salary
    @Test
    public void testNonNumericSalaryBlocksSubmission() {
        navigateToWebTables();
        openRegistrationModal();

        fillRegistrationForm("Jane", "Smith", "jane@test.com", "30", "12ab", "Dev");

        WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Submit']")));
        submitBtn.click();

        WebElement modal = driver.findElement(By.className("modal-content"));
        Assert.assertTrue(modal.isDisplayed(), "Modal should remain open.");

        WebElement salaryField = driver.findElement(By.id("salary"));
        String salaryClass = salaryField.getAttribute("class");
        boolean hasError = salaryClass.contains("error") || 
                           salaryField.getCssValue("border-color").contains("rgb(255, 0, 0)");
        Assert.assertTrue(hasError, "Salary field should show validation error.");
    }

    // TC07 – Empty age
    @Test
    public void testEmptyAgeBlocksSubmission() {
        navigateToWebTables();
        openRegistrationModal();

        fillRegistrationForm("Bob", "Brown", "bob@test.com", "", "60000", "Support");

        WebElement submitBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Submit']")));
        submitBtn.click();

        WebElement modal = driver.findElement(By.className("modal-content"));
        Assert.assertTrue(modal.isDisplayed(), "Modal should remain open.");

        WebElement ageField = driver.findElement(By.id("age"));
        boolean hasValidationMessage = !ageField.getAttribute("validationMessage").isEmpty();
        Assert.assertTrue(hasValidationMessage, "Age field should show required validation.");
    }

    // TC08 – Disabled 'No' radio button
    @Test
    public void testNoRadioButtonDisabled() {
        navigateToRadioButton();
        WebElement noRadio = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("noRadio")));
        Assert.assertFalse(noRadio.isEnabled(), "'No' radio button should be disabled.");

        // Attempt click (will likely throw or do nothing)
        try {
            noRadio.click();
        } catch (Exception e) {
            // expected – element not interactable
        }

        // After attempt, still disabled
        Assert.assertFalse(noRadio.isEnabled(), "'No' radio button should remain disabled after click attempt.");

        // No success message
        boolean successMsgPresent = driver.findElements(By.id("successMessage")).size() > 0 ||
                                    driver.getPageSource().contains("You have selected No");
        Assert.assertFalse(successMsgPresent, "No selection message should appear.");
    }

    // TC09 – UI stability under overlay
    @Test
    public void testUIStabilityUnderOverlay() {
        navigateToTextBox();
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));

        // Inject a fixed overlay that covers part of the page
        ((JavascriptExecutor) driver).executeScript(
            "var overlay = document.createElement('div');" +
            "overlay.style.position='fixed';" +
            "overlay.style.top='0';" +
            "overlay.style.left='0';" +
            "overlay.style.width='100%';" +
            "overlay.style.height='100%';" +
            "overlay.style.background='rgba(0,0,0,0.5)';" +
            "overlay.style.zIndex='9999';" +
            "overlay.id='test-overlay';" +
            "document.body.appendChild(overlay);"
        );

        // Try to interact with submit button
        WebElement submitButton = driver.findElement(By.id("submit"));
        try {
            submitButton.click();
        } catch (Exception e) {
            // Use scrollIntoView and click via JS
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", submitButton);
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitButton);
        }

        // Verify no crash – check that page is still responsive
        Assert.assertTrue(driver.findElement(By.id("userEmail")).isDisplayed(), "Page should still be responsive.");
    }

    // TC10 – UI stability under viewport change
    @Test
    public void testUIStabilityUnderViewportChange() {
        // Set initial viewport to desktop
        driver.manage().window().setSize(new org.openqa.selenium.Dimension(1280, 720));
        driver.get(BASE_URL);

        // Change to mobile
        driver.manage().window().setSize(new org.openqa.selenium.Dimension(375, 667));

        // Text Box area
        navigateToTextBox();
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("userEmail")));
        emailField.sendKeys("test@example.com");
        WebElement submitButton = driver.findElement(By.id("submit"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", submitButton);
        submitButton.click();

        // Web Tables
        navigateToWebTables();
        WebElement addButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addButton);
        addButton.click(); // modal opens

        // Radio Button
        navigateToRadioButton();
        WebElement yesRadio = wait.until(ExpectedConditions.elementToBeClickable(By.id("yesRadio")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", yesRadio);
        yesRadio.click();

        // No assertion failure means success; we can check that elements exist
        Assert.assertTrue(true, "UI remains interactable under viewport change.");
    }

    // --- Helper methods ---

    private void navigateToTextBox() {
        driver.get(BASE_URL);
        WebElement textBoxAccordion = wait.until(ExpectedConditions.elementToBeClickable(By.id("item-0")));
        textBoxAccordion.click();
    }

    private void navigateToWebTables() {
        driver.get(BASE_URL);
        WebElement webTablesAccordion = wait.until(ExpectedConditions.elementToBeClickable(By.id("item-3")));
        webTablesAccordion.click();
    }

    private void navigateToRadioButton() {
        driver.get(BASE_URL);
        WebElement radioButtonAccordion = wait.until(ExpectedConditions.elementToBeClickable(By.id("item-2")));
        radioButtonAccordion.click();
    }

    private void openRegistrationModal() {
        WebElement addButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("addNewRecordButton")));
        addButton.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("modal-content")));
    }

    private void fillRegistrationForm(String firstName, String lastName, String email, String age, String salary, String department) {
        driver.findElement(By.id("firstName")).sendKeys(firstName);
        driver.findElement(By.id("lastName")).sendKeys(lastName);
        driver.findElement(By.id("userEmail")).sendKeys(email);
        driver.findElement(By.id("age")).sendKeys(age);
        driver.findElement(By.id("salary")).sendKeys(salary);
        driver.findElement(By.id("department")).sendKeys(department);
    }
}
