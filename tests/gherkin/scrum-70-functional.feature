@SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given the user is on the DemoQA Elements module page

  Scenario: Email field rejects invalid email formats
    When the user enters an invalid email (e.g., "test@domain") into the #userEmail field
    And clicks the Submit button
    Then the #userEmail field shows a validation error
    And the #output section is not displayed

  Scenario: Web tables reject non-numeric Age and Salary values
    Given the user opens the Web Tables section
    When the user clicks the Add button to open the registration modal
    And enters non-numeric values in the Age and Salary fields
    And clicks the Submit button
    Then the registration modal remains open
    And the form does not submit

  Scenario: Radio button "No" remains disabled
    Given the user is on the Radio Button section
    Then the #noRadio element is disabled
    When the user clicks on the #noRadio element
    Then the element remains disabled
    And no state change occurs

  Scenario: UI remains stable under overlay obstruction
    Given the user is on the DemoQA Elements page
    When the page displays an overlay covering interactive elements
    Then the user can scroll to make elements visible
    And the user can interact with elements after scrolling
    And no element becomes permanently hidden or non-interactive