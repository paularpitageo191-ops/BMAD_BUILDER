Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831 @AC1
  Scenario: Invalid email input triggers validation error and no output is displayed
    Given the user is on the Text Box page of the Elements module
    When the user enters an invalid email address (e.g., "test@domain")
    And the user clicks the Submit button
    Then an error class "field-error" or validation message is visible on the #userEmail input field
    And the #output section is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831 @AC2
  Scenario: Non-numeric Age blocks Web Tables registration submission
    Given the user is on the Web Tables page of the Elements module
    When the user clicks the Add button to open the registration modal
    And the user enters non-numeric text (e.g., "abc") in the Age field
    And the user enters valid data in all other required fields
    And the user clicks the Submit button
    Then the registration modal remains open
    And no new record is added to the table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831 @AC3
  Scenario: "No" radio button remains disabled and does not change state when clicked
    Given the user is on the Radio Button page of the Elements module
    Then the #noRadio element should have a "disabled" attribute or class
    When the user attempts to click the #noRadio element
    Then the element's state remains unchanged (no selection highlight, no message displayed)

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831 @AC4
  Scenario: UI remains stable and elements are interactable after an overlay is displayed and handled
    Given the user is on the Text Box page of the Elements module
    When an overlay is injected covering the page
    And the user scrolls the email input field into view
    Then the user can still type into the #userEmail field
    And the visibility of #output remains unaffected after overlay removal