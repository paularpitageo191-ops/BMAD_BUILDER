Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario: AC1 - Email validation with invalid email format (missing TLD)
    Given the user is on the Text Box page of the Elements module
    When the user enters an invalid email "test@domain" in the #userEmail field
    And clicks the #submit button
    Then the #userEmail field shows a validation error
    And the output section #output is not visible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario: AC1 - Email validation with empty email input
    Given the user is on the Text Box page
    When the user leaves the email field empty
    And clicks the #submit button
    Then the output section #output is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario: AC2 - Web Tables reject non-numeric value in Age field
    Given the user is on the Web Tables page
    And the registration modal is opened by clicking the Add button
    When the user enters "abc" in the Age input field of the modal
    And clicks the modal's Submit button
    Then the registration modal remains open
    And no new row is added to the web table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario: AC2 - Web Tables reject non-numeric value in Salary field
    Given the user is on the Web Tables page
    And the registration modal is opened
    When the user enters "12ab" in the Salary input field of the modal
    And clicks the modal's Submit button
    Then the registration modal remains open
    And no new row is added to the web table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario: AC3 - Radio Button "No" option is disabled and non-interactable
    Given the user is on the Radio Button page
    When the user inspects the #noRadio element
    Then the #noRadio element is disabled
    And clicking #noRadio does not change its checked state

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario: AC4 - UI remains stable under obstruction (overlay)
    Given the user is on any Elements page with an overlay present
    When the user scrolls a target element into view
    Then the element remains interactable and can be clicked successfully