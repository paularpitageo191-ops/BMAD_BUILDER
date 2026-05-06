Feature: Elements Module Negative Path Validation
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8
  Scenario: AC1 - Email Validation rejects invalid input and hides output
    Given the user navigates to the Text Box page
    When the user enters an invalid email "test@domain" and clicks Submit
    Then the email field shows a validation error (class "field-error" applied)
    And the output section #output is not visible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8
  Scenario: AC1 - Email Validation shows output for valid input
    Given the user navigates to the Text Box page
    When the user enters a valid email "test@example.com" and clicks Submit
    Then the email field shows no validation error
    And the output section #output becomes visible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8
  Scenario: AC2 - Web Tables rejects non-numeric age or salary
    Given the user navigates to the Web Tables page
    When the user opens the registration modal and enters non-numeric age "abc" and salary "12ab"
    And clicks Submit
    Then the registration modal remains open
    And the age and salary fields show validation errors

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8
  Scenario: AC3 - Radio Button "No" remains disabled and ignores clicks
    Given the user navigates to the Radio Button page
    When the user attempts to click the disabled "#noRadio" option
    Then the "#noRadio" element remains disabled
    And no state change is observed (no success message for "No")

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8
  Scenario: AC4 - UI remains stable under overlay obstruction
    Given the user navigates to the Text Box page
    When an overlay is injected over the page
    And the user scrolls the email field into view and clicks it
    Then the email field receives focus and is interactable
    And no element shift or error occurs