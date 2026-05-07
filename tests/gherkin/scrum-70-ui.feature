@SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF
Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF
  Scenario: Invalid email shows validation error and hides output
    Given the user is on the Elements page
    When the user enters an invalid email "test@domain" in the email field
    And clicks the Submit button
    Then the email field should have a validation error class
    And the output section should not be visible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF
  Scenario: Non-numeric age and salary block submission and modal stays open
    Given the user is on the Elements page
    When the user clicks the Add button to open registration modal
    And enters non-numeric age "abc" and salary "12ab"
    And clicks the Submit button in the modal
    Then the registration modal should remain open
    And no new row should appear in the table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF
  Scenario: No radio button is disabled and cannot be interacted with
    Given the user is on the Elements page
    Then the "No" radio button should be disabled
    When the user clicks the "No" radio button
    Then the "No" radio button should remain disabled
    And the radio button group should not indicate any selection change

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF
  Scenario: UI remains stable under obstruction using scroll and visibility handling
    Given the user is on the Elements page
    When the user scrolls the email field into view
    Then the email field should be visible and enabled
    And the user can type text into the email field without errors
    And the Submit button remains clickable