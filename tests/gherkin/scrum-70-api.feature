@SCRUM-70 @Forensic-AEGIS-2026-MAY-E84D
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @SCRUM-70 @AC1
  Scenario: Invalid email input triggers validation error and no output
    Given I navigate to the Text Box page on DemoQA
    When I enter an invalid email "test@domain" into the "email" field
    And I click the Submit button
    Then I see a validation error on the email field (class "field-error" or similar)
    And the output section with id "output" is not displayed

  @SCRUM-70 @AC2
  Scenario: Non-numeric values in Age and Salary fields block submission in Web Tables
    Given I navigate to the Web Tables page on DemoQA
    When I click the Add button to open the registration modal
    And I fill the Age field with "abc" and the Salary field with "12ab"
    And I click the Submit button in the modal
    Then the registration modal remains open (i.e., still visible)
    And I see validation messages indicating invalid input (e.g., red border, error text)

  @SCRUM-70 @AC3
  Scenario: "No" radio button remains disabled and cannot be selected
    Given I navigate to the Radio Button page on DemoQA
    Then the "No" radio button with id "noRadio" is disabled
    When I click the "No" radio button
    Then the button remains disabled and its selected state does not change (no success message displayed)

  @SCRUM-70 @AC4
  Scenario: UI remains stable and interactable under an overlay obstruction
    Given I navigate to the Text Box page on DemoQA
    And I inject a fixed overlay that covers the input area
    When I scroll the email field into view
    And I enter a valid email "test@example.com" into the field
    And I click the Submit button
    Then the output section with id "output" is displayed
    And no JavaScript errors occur during the interaction