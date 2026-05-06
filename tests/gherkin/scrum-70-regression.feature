Feature: Negative Path Validation for Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: Email validation rejects invalid input and hides output
    Given the user is on the Text Box page of the Elements module
    When the user enters an invalid email like "test@domain" in the email field
    And clicks the Submit button
    Then the email field should show a validation error
    And the output section should not be displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: Web Tables blocks non-numeric age/salary and keeps modal open
    Given the user is on the Web Tables page of the Elements module
    When the user clicks the Add button to open the registration modal
    And enters non-numeric values in the Age field and Salary field
    And clicks Submit in the modal
    Then the registration modal should remain open
    And no new row should be added to the table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: Disabled radio button does not respond to clicks
    Given the user is on the Radio Button page of the Elements module
    When the user attempts to click the "No" radio button
    Then the "No" radio button should remain disabled
    And its state should not change

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: UI remains stable under overlay obstruction
    Given the user is on a page of the Elements module
    When an overlay is placed on top of the page
    And the user scrolls to a target element and clicks it
    Then the target element should be interactable via visibility handling
    And the page should not crash