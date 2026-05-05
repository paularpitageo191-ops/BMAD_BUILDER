@SCRUM-70 @Forensic-AEGIS-2026-MAY-E84D
Feature: Negative Path Validation for DemoQA Elements Module

  @AC1
  Scenario: Email Validation - Invalid Input
    Given the user is on the DemoQA Text Box page
    When the user enters an invalid email "test@domain" in the #userEmail field
    And clicks the #submit button
    Then a validation error is displayed on the #userEmail element
    And the #output section is not visible

  @AC2
  Scenario: Web Tables - Non-numeric Age/Salary
    Given the user is on the DemoQA Web Tables page
    And the registration modal is opened
    When the user enters a non-numeric value "abc" in the Age field
    And attempts to submit the registration form
    Then the submission is blocked
    And the registration modal remains visible

  @AC3
  Scenario: Radio Button - Disabled Option
    Given the user is on the DemoQA Radio Button page
    When the user attempts to click the #noRadio element
    Then the #noRadio element remains disabled
    And no state change (selected/unselected) occurs

  @AC4
  Scenario: UI Stability Under Obstruction
    Given the user is on any DemoQA Elements page
    When a fixed overlay is added to the page
    Then the user can scroll to and interact with a target element
    And the target element remains visible and interactable