@SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF
Feature: Negative Path Validation for DemoQA Elements Module

  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  Scenario: AC1 – Email Validation rejects invalid email and suppresses output
    Given the user navigates to the DemoQA Text Box page
    When the user enters the invalid email "test@domain" in the email field
    And the user clicks the Submit button
    Then the email field shows a validation error
    And the output section (#output) is not displayed

  Scenario: AC2 – Web Tables blocks submission for non-numeric Age and Salary
    Given the user navigates to the DemoQA Web Tables page
    When the user opens the registration modal and fills Age with "abc" and Salary with "12ab"
    And the user clicks the Submit button in the modal
    Then the registration modal remains open and no new row is added to the table

  Scenario: AC3 – Radio Button "No" remains disabled and does not change state
    Given the user navigates to the DemoQA Radio Button page
    Then the "No" radio button (#noRadio) is disabled
    When the user clicks the "No" radio button
    Then the "No" radio button remains disabled
    And no radio selection feedback message is shown

  Scenario: AC4 – UI remains stable under overlay obstruction
    Given the user navigates to the DemoQA Text Box page
    When a full‑page overlay is injected over the UI
    Then the Full Name input field remains interactable after scrolling to it
    And the user can type a value into the Full Name field
    And the output section (#output) is displayed after submission