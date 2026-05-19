// Traceability
// Functional Areas: Radio Button, Text Box, Web Tables
// Source References: Regression impact from negative changes, Screenshot: Radio button behavior, Screenshot: Valid input → output section rendered
// Execution Readiness: strong
// Readiness Rationale: There is enough technical context to support executable coverage where the approved scope requires it.
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class Scrum70RegressionTest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get("https://demoqa.com/elements");
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testValidEmailOutput() {
        // Navigate to Text Box section (assumed page loads with Text Box)
        driver.findElement(By.xpath("//span[text()='Text Box']")).click();

        WebElement emailInput = driver.findElement(By.id("userEmail"));
        emailInput.sendKeys("test@example.com");

        WebElement submitButton = driver.findElement(By.id("submit"));
        submitButton.click();

        WebElement output = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("output")));
        assertTrue(output.isDisplayed(), "Output section should be displayed");

        String outputText = output.getText();
        assertTrue(outputText.contains("Email:test@example.com"),
                "Output should contain the entered email. Actual: " + outputText);
    }

    @Test
    public void testValidWebTableEntry() {
        // Open Web Tables section
        driver.findElement(By.xpath("//span[text()='Web Tables']")).click();

        // Click Add button
        WebElement addButton = driver.findElement(By.id("addNewRecordButton"));
        addButton.click();

        // Fill form
        WebElement firstName = driver.findElement(By.id("firstName"));
        firstName.sendKeys("John");
        WebElement lastName = driver.findElement(By.id("lastName"));
        lastName.sendKeys("Doe");
        WebElement email = driver.findElement(By.id("userEmail"));
        email.sendKeys("john@test.com");
        WebElement age = driver.findElement(By.id("age"));
        age.sendKeys("25");
        WebElement salary = driver.findElement(By.id("salary"));
        salary.sendKeys("50000");
        WebElement department = driver.findElement(By.id("department"));
        department.sendKeys("QA");

        WebElement submit = driver.findElement(By.id("submit"));
        submit.click();

        // Wait for modal to close
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("modal-content")));

        // Verify new row present
        WebElement table = driver.findElement(By.className("rt-tbody"));
        String tableText = table.getText();
        assertTrue(tableText.contains("John"),
                "Table should contain the new entry. Actual: " + tableText);
        assertTrue(tableText.contains("25"),
                "Table should contain age 25. Actual: " + tableText);
    }

    @Test
    public void testRadioButtonYesWorks() {
        // Navigate to Radio Button section
        driver.findElement(By.xpath("//span[text()='Radio Button']")).click();

        WebElement yesRadio = driver.findElement(By.xpath("//label[@for='yesRadio']"));
        yesRadio.click();

        // Verify checked state
        WebElement yesRadioInput = driver.findElement(By.id("yesRadio"));
        String selectedClass = yesRadioInput.getAttribute("class");
        assertTrue(selectedClass != null && selectedClass.contains("checked"),
                "Yes radio button should be checked. Class: " + selectedClass);

        // Verify success message
        WebElement successMsg = driver.findElement(By.className("text-success"));
        String actualMsg = successMsg.getText();
        assertEquals("You have selected Yes", actualMsg,
                "Success message should match. Actual: " + actualMsg);
    }
}
