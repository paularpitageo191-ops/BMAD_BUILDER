Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given the user navigates to "https://demoqa.com/elements"

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8 @AC1
  Scenario: Invalid email input triggers validation error and no output is displayed
    When the user enters an invalid email "test@domain" in the Text Box email field
    And the user clicks the "Submit" button in the Text Box section
    Then a validation error is displayed on the email input field with CSS class "field-error" or similar
    And the output section with id "output" is not visible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8 @AC2
  Scenario: Non-numeric Age value blocks Web Tables submission and modal stays open
    Given the Web Tables modal is opened by clicking the "Add" button
    When the user enters non-numeric value "abc" in the Age field
    And the user attempts to submit the registration form by clicking the modal's "Submit" button
    Then the modal remains open and the form is not submitted
    And the Age field shows a validation warning/error

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8 @AC3
  Scenario: Disabled "No" radio button does not become selected on click
    When the user clicks on the radio button with id "noRadio"
    Then the "noRadio" element remains disabled
    And no state change occurs (aria-checked or class "active" remains unchanged)

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8 @AC4
  Scenario: UI remains stable and interactable under an overlay obstruction
    Given an overlay (e.g., an ad or popup) appears on the page
    When the user scrolls to the "Yes" radio button and clicks it
    Then the "Yes" radio button becomes selected
    And the "Yes" radio button remains visible and enabled after interaction