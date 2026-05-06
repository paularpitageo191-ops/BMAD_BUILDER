@SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given I am on the DemoQA Elements page

  Scenario: AC1 – Invalid email shows validation error and no output
    Given I am on the Text Box section
    When I enter an invalid email "test@domain" in the email field
    And I click the Submit button
    Then the email field should show a validation error
    And the output section should not be displayed

  Scenario: AC1 – Missing TLD email also triggers validation
    Given I am on the Text Box section
    When I enter "invalid@" in the email field
    And I click the Submit button
    Then the email field should show a validation error

  Scenario: AC2 – Non-numeric Age blocks Web Tables submission
    Given the Web Tables registration modal is open
    When I enter "abc" in the Age field
    And I click the Submit button in the modal
    Then the modal should remain open
    And the Age field should still contain "abc"

  Scenario: AC2 – Non-numeric Salary blocks Web Tables submission
    Given the Web Tables registration modal is open
    When I enter "12ab" in the Salary field
    And I click the Submit button in the modal
    Then the modal should remain open
    And the Salary field should still contain "12ab"

  Scenario: AC3 – No radio button is disabled and unclickable
    Given I am on the Radio Button section
    Then the "No" radio button should be disabled
    When I attempt to click the "No" radio button
    Then it should remain disabled
    And its state should not change

  Scenario: AC4 – UI remains stable under overlay obstruction
    Given an overlay is covering the page
    When I scroll to the email field
    And I enter a valid email and click Submit using visibility handling
    Then the form submission should succeed and output should be displayed