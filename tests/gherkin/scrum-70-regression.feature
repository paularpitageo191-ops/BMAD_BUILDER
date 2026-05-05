Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: Email Validation rejects invalid email and hides output
    Given the user is on the DemoQA Text Box page
    When the user enters an invalid email "test@domain" into the email field
    And the user clicks the Submit button
    Then the email field shows a validation error (CSS pseudo-class :invalid or aria-invalid="true")
    And the output section (#output) is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: Web Tables rejects non-numeric Age and Salary
    Given the user is on the DemoQA Web Tables page
    When the user clicks the Add button to open the registration modal
    And the user enters non-numeric value "abc" in the Age field
    And the user enters non-numeric value "12ab" in the Salary field
    And the user clicks the Submit button in the modal
    Then the registration modal remains open
    And the Age and Salary fields show validation errors

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: Radio Button "No" remains disabled and unclickable
    Given the user is on the DemoQA Radio Button page
    When the user attempts to click the "No" radio button (#noRadio)
    Then the #noRadio element is disabled (read-only or aria-disabled="true")
    And clicking the element does not change its state

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: UI remains stable under an overlay obstruction
    Given the user is on the DemoQA Elements page
    When an overlay covers part of the page
    Then the underlying elements remain interactable after scrolling or visibility adjustment
    And no unexpected element detachment or layout shift occurs