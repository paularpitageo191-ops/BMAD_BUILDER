@SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given the user is on the DemoQA Elements page

  @AC1
  Scenario: Email validation rejects invalid email and hides output
    Given the user navigates to the Text Box section
    When the user enters an invalid email address "test@domain"
    And the user presses the "Submit" button
    Then a validation error is displayed on the "#userEmail" field
    And the output section "#output" is not visible

  @AC2
  Scenario: Web Tables rejects non-numeric Age and Salary and keeps modal open
    Given the user navigates to the Web Tables section
    When the user clicks the "Add" button to open the registration modal
    And the user fills the Age field with "abc"
    And the user fills the Salary field with "12ab"
    And the user clicks the "Submit" button in the modal
    Then the registration modal remains open
    And no new row is added to the table

  @AC3
  Scenario: Radio Button "No" option remains disabled and unresponsive
    Given the user navigates to the Radio Button section
    Then the "#noRadio" option is disabled
    When the user clicks on the "#noRadio" label
    Then the "#noRadio" option remains disabled
    And the radio button state does not change

  @AC4
  Scenario: UI remains stable under overlay obstruction
    Given the user navigates to the Text Box section
    When an overlay is placed over the page
    Then the user can scroll to the permanent radio button section
    And the radio button elements remain interactable
    And no unintended UI shift occurs