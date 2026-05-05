@SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given the DemoQA application is loaded

  @SCRUM-70 @AC1 @EmailValidation
  Scenario: Email validation – invalid input shows error and no output
    When the user navigates to the Text Box section
    And fills the email field with "test@domain"
    And clicks the "Submit" button
    Then the email field should show validation error
    And the output section (#output) should not be visible

  @SCRUM-70 @AC2 @WebTablesValidation
  Scenario: Web Tables – non-numeric Age blocks submission and modal stays open
    When the user navigates to the Web Tables section
    And clicks the "Add" button to open the registration modal
    And fills the "Age" field with "abc"
    And fills the "Salary" field with "12ab"
    And clicks the "Submit" button inside the modal
    Then the registration modal should remain open
    And the table should not have a new row added

  @SCRUM-70 @AC3 @RadioButtonValidation
  Scenario: Radio Button – disabled "No" option does not respond to clicks
    When the user navigates to the Radio Button section
    Then the "No" radio button (#noRadio) should be disabled
    When the user clicks the "No" radio button
    Then the radio button should remain disabled
    And the output message should not change

  @SCRUM-70 @AC4 @UIStability
  Scenario: UI Stability – elements interactable via scroll when initially out of view
    When the user navigates to the Radio Button section
    And the "Yes" radio button is not visible in the viewport
    When the user scrolls the "Yes" radio button into view and clicks it
    Then the "Yes" radio button should become selected
    And the output message should display "You have selected Yes"