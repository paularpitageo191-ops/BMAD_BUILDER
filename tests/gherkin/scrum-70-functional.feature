@SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
Feature: DemoQA Elements Module Negative Path Validation

  Background:
    Given the user navigates to the DemoQA Elements page

  @AC1 @email-validation
  Scenario: Invalid email triggers validation error and no output
    Given the user opens the Text Box section
    When the user enters an invalid email address "test@domain"
    And the user clicks the Submit button
    Then the email input field #userEmail should have the CSS class "field-error" or show validation error
    And the output section #output should not be visible

  @AC2 @web-tables-validation
  Scenario: Non-numeric Age/Salary blocks submission and modal stays open
    Given the user opens the Web Tables section
    And the user clicks the Add button to open the registration modal
    When the user enters non-numeric values in the Age field "abc" and Salary field "12ab"
    And the user clicks the Submit button in the registration modal
    Then the registration modal should remain open
    And the modal should not close
    And no new row should appear in the web table

  @AC3 @radio-button-validation
  Scenario: "No" radio button remains disabled and unclickable
    Given the user opens the Radio Button section
    Then the "No" radio button identified by #noRadio should be disabled
    When the user attempts to click the #noRadio element
    Then the #noRadio element should still be disabled
    And no success message should appear (e.g., .text-success should not contain "No")

  @AC4 @ui-stability
  Scenario: UI remains stable after overlay obstruction
    Given the user opens the Web Tables section
    When the user opens the registration modal
    And the user closes the modal by clicking the close button
    Then the page should be scrollable and elements in the main content area remain interactable
    And the Add button should be clickable after modal close