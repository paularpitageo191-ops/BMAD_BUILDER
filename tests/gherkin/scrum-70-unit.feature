@SCRUM-70 @Forensic-AEGIS-2026-MAY-0E05
Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-0E05
  Scenario: Email Validation - invalid email blocks output display
    Given the user is on the DemoQA Text Box page
    When the user enters an invalid email format (e.g., "test@domain") into the email field
    And the user clicks the Submit button
    Then the email field shows a validation error
    And the output section (#output) is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-0E05
  Scenario: Web Tables Validation - non-numeric age/salary blocks submission
    Given the user is on the DemoQA Web Tables page
    When the user clicks the Add button to open the registration modal
    And the user enters a non-numeric value (e.g., "abc") into the Age field
    And the user enters a non-numeric value (e.g., "12ab") into the Salary field
    And the user clicks the Submit button within the modal
    Then the registration modal remains open
    And the form is not submitted

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-0E05
  Scenario: Radio Button Validation - disabled "No" option remains unclickable
    Given the user is on the DemoQA Radio Button page
    When the user attempts to click the "No" radio button (#noRadio)
    Then the radio button remains disabled
    And no state change occurs

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-0E05
  Scenario: UI Stability under obstruction - elements remain interactable
    Given the user is on the DemoQA Text Box page
    When an obstructive overlay is injected over the page
    And the user scrolls to and attempts to interact with the submit button
    Then the submit button is clickable
    And the user can enter text into the permanent address field
    And the UI does not break or become unresponsive