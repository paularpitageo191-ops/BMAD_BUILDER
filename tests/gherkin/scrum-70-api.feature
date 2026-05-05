@SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D
Feature: Negative Path Validation for DemoQA Elements Module

  Scenario: AC1 – Email Validation rejects invalid input
    Given the user is on the DemoQA Text Box page
    When the user fills the email field with an invalid email "test@domain"
    And the user clicks the "Submit" button
    Then the email input should have a validation error
    And the output section "#output" should not be displayed

  Scenario: AC2 – Web Tables blocks non-numeric Age
    Given the user is on the DemoQA Web Tables page
    When the user clicks the "Add" button to open the registration modal
    And the user fills the Age field with non-numeric value "abc"
    And the user clicks the "Submit" button in the registration modal
    Then the registration modal should remain open
    And no new row should appear in the table

  Scenario: AC3 – Radio Button "No" remains disabled
    Given the user is on the DemoQA Radio Button page
    Then the "#noRadio" element should be disabled
    When the user attempts to click the "#noRadio" element
    Then the "#noRadio" element should still be disabled
    And the "#noRadio" element should not be checked

  Scenario: AC4 – UI remains stable under overlay obstruction
    Given the user is on the DemoQA Elements page
    And an overlay div is placed over the page
    When the user scrolls a target element into view
    And the user clicks the target element
    Then the click should succeed and no errors occur