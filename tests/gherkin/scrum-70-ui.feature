@SCRUM-70 @Forensic-AEGIS-2026-MAY-0E05
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given the user is on the DemoQA Elements page

  @AC1
  Scenario: Email field rejects invalid input and output section is hidden
    When the user enters invalid email "test@domain" into the Email field
    And clicks the Submit button
    Then the Email field should show a validation error
    And the Output section should not be displayed

  @AC2
  Scenario: Web Tables reject non-numeric Age and Salary values
    Given the user navigates to the Web Tables section
    When the user clicks "Add" to open the registration modal
    And enters "abc" into the Age field
    And enters "12ab" into the Salary field
    And clicks "Submit" in the modal
    Then the registration modal should remain open
    And validation errors should be visible on the Age and Salary fields

  @AC3
  Scenario: Disabled radio button "No" cannot be selected or change state
    Given the user is on the Radio Button section
    Then the "No" radio button should be disabled
    When the user attempts to click the "No" radio button
    Then no state change should occur (selection remains unchanged)

  @AC4
  Scenario: UI remains stable and interactable under an overlay
    When an overlay (fixed banner) is added to the page
    Then the user can scroll to view all elements
    And elements such as the Email field remain clickable and fillable
    And no unexpected behavior occurs during interaction