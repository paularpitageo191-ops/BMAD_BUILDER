@SCRUM-70 @Forensic-AEGIS-2026-MAY-C711
Feature: Negative Path Validation for DemoQA Elements Module

  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  Background:
    Given the user is on the DemoQA Elements page

  @AC1 @email
  Scenario: Email validation rejects invalid format and hides output
    Given the user navigates to the Text Box section
    When the user enters an invalid email "test@domain" in the #userEmail field
    And the user clicks the Submit button
    Then the #userEmail field should show a validation error
    And the #output section should not be displayed

  @AC2 @web-tables
  Scenario: Web Tables blocks submission for non-numeric Age and keeps modal open
    Given the user navigates to the Web Tables section
    When the user clicks the Add button to open the registration modal
    And the user enters a non-numeric value "abc" in the Age field
    And the user clicks the Submit button in the modal
    Then the registration modal should remain open
    And the Age field should be marked as invalid
    And no new record should appear in the table

  @AC3 @radio-button
  Scenario: Radio Button "No" remains disabled and unresponsive
    Given the user navigates to the Radio Button section
    When the user verifies that the #noRadio option is disabled
    And the user clicks on the #noRadio label
    Then the #noRadio option should still be disabled
    And no selection message should appear

  @AC4 @ui-stability
  Scenario: UI remains stable under overlay obstruction
    Given the user is on the Text Box section
    When an overlay is placed over the page
    And the user attempts to interact with the #userEmail field using scroll and visibility handling
    Then the field should receive a valid input without errors
    And the #output section should be displayed after submission