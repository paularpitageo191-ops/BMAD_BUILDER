@SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD
Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD
  Scenario: Invalid email input triggers validation error and hides output section
    Given the user is on the Text Box page
    When the user enters an invalid email "test@domain" in the email field
    And the user clicks the Submit button
    Then the email field shows a validation error
    And the output section with id "output" is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD
  Scenario: Non-numeric Age blocks form submission and keeps modal open
    Given the user is on the Web Tables page
    When the user clicks the Add button to open the registration modal
    And the user enters a non-numeric value "abc" in the Age field
    And the user clicks the Submit button in the modal
    Then the registration modal remains visible
    And no new record is added to the table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD
  Scenario: Disabled "No" radio button remains unresponsive
    Given the user is on the Radio Button page
    When the user attempts to click the "No" radio button
    Then the "No" radio button remains disabled
    And no radio selection state change occurs (no "You have selected" message is updated)

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD
  Scenario: UI remains interactable under obstruction (overlay)
    Given the user is on the Text Box page
    When an overlay is present that covers part of the page
    And the user scrolls to the email field
    And the user enters text in the email field and submits
    Then the email field is interactable and the interaction completes without error
    And the output section is not displayed (invalid email) or the validation error appears