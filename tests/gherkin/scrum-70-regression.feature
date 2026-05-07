@SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given the user is on the DemoQA Elements page

  @AC1 @EmailValidation
  Scenario: Invalid email input triggers validation error and hides output section
    When the user enters an invalid email "test@domain" in the email field
    And clicks the Submit button
    Then the email field should show a validation error
    And the output section "#output" should not be displayed

  @AC2 @WebTablesValidation
  Scenario: Non-numeric Age and Salary values block registration submission and keep modal open
    Given the user clicks the "Add" button to open the registration modal
    When the user enters "abc" in the Age field
    And enters "12ab" in the Salary field
    And clicks the Submit button inside the modal
    Then the registration modal should remain open
    And no new row should appear in the web table

  @AC3 @RadioButtonValidation
  Scenario: "No" radio button remains disabled and does not change state when clicked
    Given the user is on the Radio Button section
    Then the "No" radio button should be disabled
    When the user attempts to click the "No" radio button
    Then the radio button should remain disabled
    And no success message should appear

  @AC4 @UIStability
  Scenario: UI remains stable and elements are interactable under overlay obstruction
    Given an overlay is present on the page
    When the user scrolls to and attempts to interact with a standard element
    Then the element should be visible and clickable
    And the UI should not exhibit layout shifts or unresponsive behavior