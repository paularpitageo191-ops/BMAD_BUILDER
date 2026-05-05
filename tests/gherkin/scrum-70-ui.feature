@SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
Feature: Negative Path Validation for DemoQA Elements Module

  Scenario: AC1 – Email Validation
    Given I am on the DemoQA Text Box page
    When I enter invalid email "test@domain" in the Email field
    And I click the Submit button
    Then the Email field should show a validation error
    And the output section should not be displayed

  Scenario: AC2 – Web Tables Validation
    Given I am on the DemoQA Web Tables page
    And I open the registration modal by clicking "Add"
    When I enter non-numeric value "abc" in the Age field
    And I enter non-numeric value "12ab" in the Salary field
    And I click the Submit button in the modal
    Then the registration modal should remain open
    And the Age and Salary fields should retain their invalid state

  Scenario: AC3 – Radio Button Validation
    Given I am on the DemoQA Radio Button page
    When I attempt to click the "No" radio button
    Then the radio button should remain disabled
    And its checked state should not change

  Scenario: AC4 – UI Stability under Obstruction
    Given I am on the DemoQA Text Box page
    When I add a full‑page overlay to obstruct the view
    And I scroll the Email field into view
    And I enter invalid email "test@domain" in the Email field
    And I click the Submit button
    Then the Email field should still show a validation error
    And the output section should still not be displayed