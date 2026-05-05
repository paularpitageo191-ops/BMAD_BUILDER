Feature: Elements Module Negative Path Validation
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given I am on the DemoQA Elements page

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: AC1 - Invalid email triggers validation error and no output
    When I enter an invalid email "test@domain" in the email field
    Then I see a validation error on "#userEmail"
    And the output section "#output" is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: AC2 - Non-numeric age blocks submission and modal stays open
    When I enter non-numeric value "abc" in the age field of the Web Tables registration modal
    And I click the submit button
    Then the registration modal remains open
    And the age field value is preserved without submission

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: AC2 - Non-numeric salary blocks submission and modal stays open
    When I enter non-numeric value "12ab" in the salary field of the Web Tables registration modal
    And I click the submit button
    Then the registration modal remains open
    And the salary field value is preserved without submission

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: AC3 - "No" radio button remains disabled and click does not change state
    Given the "No" radio button "#noRadio" is disabled
    When I click on the "#noRadio" radio button
    Then the "#noRadio" radio button remains disabled
    And no state change occurs (no visual or selection change)

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: AC4 - UI remains stable under overlay obstruction
    Given an overlay is present that partially blocks the viewport
    When I attempt to interact with the email field by scrolling and focusing
    Then the email field is interactable and I can type into it
    And no overlay-related errors appear in the console