@SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
Feature: Negative Path Validation for DemoQA Elements Module

  Scenario: AC1 – Email Validation
    Given I am on the Text Box page
    When I enter an invalid email "test@domain"
    And I click the Submit button
    Then I should see a validation error on the email input field
    And the output section should not be displayed

  Scenario: AC2 – Web Tables Validation
    Given I am on the Web Tables page
    When I click the Add button to open the registration modal
    And I enter non-numeric values in Age and Salary fields
    And I click the Submit button on the modal
    Then the registration modal should remain open
    And the fields should show validation errors

  Scenario: AC3 – Radio Button Validation
    Given I am on the Radio Button page
    Then the "No" radio button should be disabled
    When I click the "No" radio button
    Then the button should remain disabled
    And no state change should occur (no selection or success message)

  Scenario: AC4 – UI Stability
    Given I have performed invalid email input on the Text Box page
    When I scroll to the "Yes" radio button on the Radio Button page
    Then the "Yes" radio button should be visible and interactable
    And I should be able to click it successfully
    And the "No" radio button should still be disabled
    And no page crash or layout shift should occur