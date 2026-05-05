@SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D
Feature: Negative Path Validation for DemoQA Elements Module

  Scenario: AC1 – Email validation blocks invalid input and hides output
    Given the user is on the Text Box page
    When the user enters an email without a top-level domain "test@domain" in the email field
    And clicks the Submit button
    Then the email field should show a validation error
    And the output section #output should not be displayed

  Scenario: AC2 – Web Tables rejects non-numeric age and salary
    Given the user is on the Web Tables page
    When the user clicks the Add button to open the registration modal
    And enters non-numeric value "abc" in the Age field and "12ab" in the Salary field
    And clicks the Submit button in the modal
    Then the modal should remain open
    And the form fields should still contain the invalid input

  Scenario: AC3 – Radio Button 'No' remains disabled and unclickable
    Given the user is on the Radio Button page
    When the user attempts to click the "No" option (#noRadio)
    Then the "No" option should remain disabled
    And no selection state change should occur

  Scenario: AC4 – UI remains stable under overlay obstruction
    Given the user is on the Text Box page
    And an overlay covers the entire page
    When the user scrolls the full name field into view
    And enters text "Valid Name" into the full name field
    Then the field should accept the input
    And the page should remain interactable without errors