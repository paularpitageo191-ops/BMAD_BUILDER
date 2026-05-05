Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E84D
  Scenario: AC1 – Invalid email shows validation error and no output
    Given the user is on the Text Box page
    When the user enters an invalid email "test@domain" in the email field
    And the user clicks the Submit button
    Then the email field should show a validation error
    And the output section should not be displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E84D
  Scenario: AC2 – Non-numeric Age and Salary block web table submission
    Given the user is on the Web Tables page
    When the user clicks the Add button
    And the user enters non-numeric value "abc" in the Age field
    And the user enters non-numeric value "xyz" in the Salary field
    And the user clicks the Submit button in the registration modal
    Then the registration modal should remain open
    And a new row should not be added to the table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E84D
  Scenario: AC3 – Disabled "No" radio button remains disabled and unresponsive
    Given the user is on the Radio Button page
    Then the "No" radio button should be disabled
    When the user attempts to click the "No" radio button
    Then the radio button should remain disabled
    And no success message for "No" should appear

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E84D
  Scenario: AC4 – UI remains stable and elements are interactable under overlay obstruction
    Given the user is on the Buttons page under Elements
    When the user creates an overlay that covers the entire page
    And the user scrolls to and clicks the "Click Me" button with force scrolling
    Then the button click should succeed and a confirmation message should appear