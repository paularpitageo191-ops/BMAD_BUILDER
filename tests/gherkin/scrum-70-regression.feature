@SCRUM-70 @Forensic-AEGIS-2026-MAY-C711
Feature: Negative Path Validation for Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @AC1 @EmailValidation
  Scenario: Invalid email blocks output and shows validation error
    Given I am on the Text Box page
    When I enter an invalid email address with missing TLD into "email" field
    And I click the "Submit" button
    Then I see a validation error on the email field
    And the output section is not displayed

  @AC2 @WebTablesValidation
  Scenario: Non-numeric age/salary values block registration submission
    Given I am on the Web Tables page and the registration modal is open
    When I enter non-numeric values into the "Age" and "Salary" fields
    And I click the "Submit" button in the registration modal
    Then the registration modal remains open
    And no new record is added to the table

  @AC3 @RadioButtonValidation
  Scenario: Disabled "No" radio button cannot be selected
    Given I am on the Radio Button page
    Then the "No" radio button is disabled
    When I click the "No" radio button
    Then the "No" radio button remains disabled
    And no state change occurs

  @AC4 @UIStability
  Scenario: Overlay obstruction does not prevent element interaction
    Given I am on the Text Box page
    And an overlay div covers part of the page
    When I scroll the "Submit" button into view
    And I click the "Submit" button
    Then the click is performed successfully (no error)
    And the UI remains stable and interactable