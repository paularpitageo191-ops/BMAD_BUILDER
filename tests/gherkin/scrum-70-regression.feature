@SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
Feature: Negative Path Validation for DemoQA Elements Module

  @AC1
  Scenario: AC1 – Email Validation with invalid input
    Given the user is on the DemoQA Text Box page
    When the user enters "test@domain" as the email in #userEmail
    And clicks the Submit button
    Then the #userEmail field shows a validation error
    And the #output section is not displayed

  @AC2
  Scenario: AC2 – Web Tables non-numeric Age/Salary
    Given the user is on the DemoQA Web Tables page with the Registration modal open
    When the user enters "abc" in the Age field and "xyz" in the Salary field
    And clicks the Submit button in the registration form
    Then the registration modal remains visible
    And no new row appears in the table

  @AC3
  Scenario: AC3 – Radio Button disabled No option
    Given the user is on the DemoQA Radio Button page
    When the user attempts to click the "#noRadio" element
    Then the "#noRadio" element remains disabled
    And its checked state does not change

  @AC4
  Scenario: AC4 – UI Stability under overlay obstruction
    Given the page contains an overlay or ad iframe
    When the test scrolls to an element and performs a click
    Then the element is interactable after visibility handling