```gherkin
@SCRUM-70
@Forensic-AEGIS-2026-MAY-5252
Feature: Negative Path Validation for DemoQA Elements Module

  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  Background:
    Given the user navigates to the DemoQA Elements module

  @AC1
  Scenario: Email validation with invalid input
    Given the user is on the Text Box page
    When the user enters an invalid email format in the email field
    Then a validation error is displayed on the email field
    And the output section is not displayed

  @AC2
  Scenario: Web tables validation rejects non-numeric age or salary
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And the user enters non-numeric values in the Age field
    Then the submission is blocked
    And the registration modal remains open

  @AC2
  Scenario: Web tables validation rejects non-numeric salary
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And the user enters non-numeric values in the Salary field
    Then the submission is blocked
    And the registration modal remains open

  @AC3
  Scenario: "No" radio button remains disabled and does not trigger state change
    Given the user is on the Radio Button page
    Then the "No" option radio button is disabled
    When the user clicks on the disabled "No" option
    Then no state change occurs

  @AC4
  Scenario: UI remains stable when interacting under an overlay obstruction
    Given the user is on the Elements module
    When an overlay is present covering interactive elements
    And the user scrolls and uses visibility handling to interact with elements
    Then all required elements remain interactable
    And the UI does not become unstable
```