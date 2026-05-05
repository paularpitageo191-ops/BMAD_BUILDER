Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D @AC1
  Scenario: Email validation rejects invalid email and hides output
    Given the user is on the Text Box page
    When the user enters an invalid email like "test@domain"
    And the user clicks the Submit button
    Then the email field should show a validation error
    And the output section should not be displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D @AC2
  Scenario: Web Tables blocks non-numeric age or salary
    Given the user is on the Registration Form modal
    When the user enters non-numeric age like "abc"
    And the user enters valid other fields
    And the user clicks Submit
    Then the registration modal should remain open
    And the age field should show validation error

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D @AC3
  Scenario: No radio button remains disabled and non-interactive
    Given the user is on the Radio Button page
    Then the "No" option should be disabled
    When the user clicks the "No" option
    Then the state of "No" should remain unchanged
    And no radio button selection should be indicated

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D @AC4
  Scenario: UI remains stable under overlay obstruction
    Given the user is on a page with an overlay
    When the user scrolls to the target element
    And the user clicks the element
    Then the element should respond as expected without layout shift