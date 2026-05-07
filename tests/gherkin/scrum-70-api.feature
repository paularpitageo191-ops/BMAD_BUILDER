@SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given the user is on the DemoQA homepage

  @email-validation
  Scenario: AC1 – Email validation rejects invalid input and hides output section
    When the user navigates to the Text Box page
    And the user enters an invalid email address "test@domain" in the #userEmail input
    And the user clicks the submit button
    Then the #userEmail field shows a validation error
    And the #output element is not visible

  @web-tables-validation
  Scenario: AC2 – Non-numeric values in Age/Salary block submission and keep modal open
    When the user navigates to the Web Tables page
    And the user clicks the "Add" button to open the registration modal
    And the user enters non-numeric value "abc" in the age field
    And the user enters non-numeric value "12ab" in the salary field
    And the user clicks the submit button within the modal
    Then the registration modal remains open
    And no new row is added to the table

  @radio-button-validation
  Scenario: AC3 – Disabled radio button "No" remains unclickable and does not change state
    When the user navigates to the Radio Button page
    Then the element #noRadio is disabled
    When the user attempts to click the #noRadio label or input
    Then the #noRadio element remains disabled
    And no selection state is changed (no "You have selected" message appears for "No")

  @ui-stability
  Scenario: AC4 – UI remains stable under an overlay obstruction
    Given the user navigates to the Text Box page
    When a fixed overlay is injected over the page
    And the user scrolls to bring the #userEmail field into view
    And the user enters a valid email "test@example.com"
    And the user clicks the submit button
    Then the output section #output is displayed
    And no layout shift or visibility issues occur