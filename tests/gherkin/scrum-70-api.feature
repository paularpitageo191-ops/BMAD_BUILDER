@SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  Background:
    Given the user is on the DemoQA Elements page

  @AC1 @email_validation
  Scenario: Invalid email triggers validation error and no output is displayed
    When the user enters an invalid email address "test@domain" into the Email field
    And clicks the Submit button
    Then the Email field should show a validation error
    And the output section "#output" should not be visible

  @AC2 @web_tables_validation
  Scenario: Non-numeric Age blocks submission and modal stays open
    When the user opens the Web Tables registration form
    And enters "abc" into the Age field
    And clicks Submit in the registration modal
    Then the registration modal remains open
    And the Age field shows validation error

  @AC2 @web_tables_validation
  Scenario: Non-numeric Salary blocks submission and modal stays open
    When the user opens the Web Tables registration form
    And enters "12ab" into the Salary field
    And clicks Submit in the registration modal
    Then the registration modal remains open
    And the Salary field shows validation error

  @AC2 @web_tables_validation
  Scenario: Empty fields in registration modal block submission
    When the user opens the Web Tables registration form
    And leaves all fields empty
    And clicks Submit in the registration modal
    Then the registration modal remains open

  @AC3 @radio_button_validation
  Scenario: "No" radio button remains disabled and clicking does nothing
    When the user locates the "No" radio button "#noRadio"
    Then the "#noRadio" element should be disabled
    When the user clicks on "#noRadio"
    Then the "#noRadio" element should remain disabled
    And no visual state change (like checked style) should occur

  @AC4 @ui_stability
  Scenario: UI remains stable under overlay obstruction
    Given an overlay is added to cover part of the page
    When the user scrolls to the Text Box section and enters valid data
    And clicks Submit
    Then the output section "#output" should become visible
    And the overlay does not prevent interaction after scrolling