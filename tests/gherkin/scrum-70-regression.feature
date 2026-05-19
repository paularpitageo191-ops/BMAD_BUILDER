# Traceability
Feature: Regression Guardrails for Negative Path Validation – DemoQA Elements
  As a regression agent
  I want to protect existing positive workflows from regression when negative validation logic is added
  So that the application remains stable and previously working behavior is not broken.

  Scenario: Regression – Text box valid email output still displays after negative validation implementation
    Given the user is on the Text Box page at https://demoqa.com/text-box
    And the #userEmail field is visible and editable
    When the user enters a valid email "test@example.com" in the Email field
    And clicks the #submit button
    Then the #output element should be displayed
    And #output should contain the submitted email

  Scenario: Regression – Web table row editing remains functional after negative Age validation
    Given the user is on the Web Tables page at https://demoqa.com/webtables
    And a row with valid data exists in the table (e.g., "John", "Doe", "john@example.com", "30", "50000", "QA")
    When the user clicks the edit icon for that row
    And changes the First Name to "RegressionTest"
    And clicks Submit in the registration modal
    Then the table should display "RegressionTest" in the first name column
    And no validation errors should be visible

  Scenario: Regression – Radio button "Impressive" selection still works after "No" is confirmed disabled
    Given the user is on the Radio Button page at https://demoqa.com/radio-button
    And the "No" radio button is disabled
    When the user clicks the "Impressive" radio button
    Then a success message "You have selected Impressive" should appear
    And the radio button for "Impressive" should have the “selected” state