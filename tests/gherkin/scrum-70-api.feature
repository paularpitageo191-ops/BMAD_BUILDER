@SCRUM-70 @Forensic-AEGIS-2026-MAY-C711
Feature: Elements Negative Path Validation
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  Background:
    Given I am on the DemoQA Elements page

  Scenario: AC1 – Email Validation triggers error and hides output
    When I enter an invalid email format into the "Email" field
    Then a validation error is visible on the #userEmail input
    And the #output section is not displayed

  Scenario: AC2 – Web Tables reject non-numeric Age/Salary
    Given I open the Web Tables registration form
    When I enter non-numeric values in the Age and Salary fields
    And I click "Submit" in the modal
    Then the registration modal remains open
    And the fields contain the invalid values

  Scenario: AC3 – Radio Button "No" remains disabled
    Given I navigate to the Radio Button section
    Then the "No" option (#noRadio) is disabled
    When I click on the "No" option
    Then no state change occurs:
      * The "No" option remains disabled
      * The result text (if any) does not change

  Scenario: AC4 – UI Stability under overlay obstruction
    Given I am on the Radio Button section
    When I inject a fixed overlay that covers the page
    Then I can still interact with the "Yes" radio button by scrolling or using visibility handling
    And the radio button selection changes correctly
    And the overlay does not break the page layout