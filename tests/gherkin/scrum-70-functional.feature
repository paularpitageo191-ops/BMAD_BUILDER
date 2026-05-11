@SCRUM-70 @Forensic-AEGIS-2026-MAY-0E05
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given the user is on the DemoQA Elements page

  Scenario: AC1 - Email validation with invalid input
    When the user navigates to the Text Box page
    And enters invalid email "test@domain" into the #userEmail field
    And clicks the Submit button
    Then a validation error is triggered on the #userEmail field
    And the output section #output is not visible

  Scenario: AC2 - Web Tables age field rejects non-numeric input
    When the user navigates to the Web Tables page
    And clicks the Add button to open the registration modal
    And enters "abc" into the Age field
    And clicks the Submit button
    Then the registration modal remains open
    And no new row is added to the table

  Scenario: AC3 - Radio button "No" remains disabled
    When the user navigates to the Radio Button page
    Then the #noRadio option is disabled
    When the user clicks on the #noRadio option
    Then the #noRadio option remains disabled
    And no success message is displayed

  Scenario: AC4 - UI stability under overlay obstruction
    When the user navigates to the Text Box page
    And a full‑screen overlay is injected into the page
    Then the user should be able to interact with the #userEmail field via scroll or visibility handling
    When the user enters a valid email "user@example.com"
    And clicks the Submit button
    Then the output section #output is visible