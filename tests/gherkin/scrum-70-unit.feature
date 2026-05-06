@SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8 @EmailValidation
Feature: Negative Path Validation for DemoQA Elements Module

  Scenario: AC1 – Email validation rejects invalid email and hides output
    Given the user is on the Text Box page
    When the user enters an invalid email "test@domain" in the email field
    And the user clicks the submit button
    Then the email field shows a validation error class
    And the output section is not visible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8 @WebTables
  Scenario: AC2 – Non-numeric inputs in Age or Salary block submission and keep modal open
    Given the user is on the Web Tables page
    When the user clicks the Add button to open the registration modal
    And the user enters non-numeric value "abc" in the Age field
    And the user enters non-numeric value "12ab" in the Salary field
    And the user clicks the Submit button
    Then the registration modal remains open

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8 @RadioButton
  Scenario: AC3 – "No" radio button is disabled and cannot be interacted with
    Given the user is on the Radio Button page
    When the user inspects the "No" option
    Then the "No" radio button is disabled
    When the user clicks on the "No" radio button
    Then the "No" radio button remains disabled

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8 @UIStability
  Scenario: AC4 – UI remains stable under obstruction and elements remain interactable
    Given the user is on the Text Box page
    When an overlay is added to the page
    Then the submit button is still visible and enabled after scrolling
    And the submit button can be clicked successfully