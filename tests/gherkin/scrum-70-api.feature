Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given the DemoQA application is accessible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: Email validation rejects invalid email and hides output
    Given the user navigates to the Text Box page
    When the user enters an invalid email ""test@domain"" (missing TLD) into the #userEmail field
    And clicks the Submit button
    Then the #userEmail field shows a validation error
    And the #output section is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: Web Tables rejects non-numeric Age/Salary and keeps modal open
    Given the user navigates to the Web Tables page
    When the user opens the registration modal
    And enters a non-numeric value ""abc"" into the Age field
    And enters a non-numeric value ""12ab"" into the Salary field
    And clicks the Submit button in the modal
    Then the registration modal remains open
    And no new row is added to the table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: Radio Button disabled option remains inert
    Given the user navigates to the Radio Button page
    When the user clicks the option with id #noRadio
    Then the #noRadio element remains disabled
    And no selection state change occurs

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: UI remains stable under overlay obstruction
    Given the user navigates to the Text Box page
    When an overlay is programmatically added to cover the full screen
    Then the user can scroll to and interact with the #submit button
    And the button click works as expected