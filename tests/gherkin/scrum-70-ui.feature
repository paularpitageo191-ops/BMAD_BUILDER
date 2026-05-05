Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
  Scenario: Invalid email blocks output in Text Box
    Given the user is on the Text Box page
    When the user enters an invalid email "test@domain" in the email field
    And the user clicks the Submit button
    Then the email field shows a validation error
    And the output section is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
  Scenario: Non-numeric age blocks registration in Web Tables
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And the user enters non-numeric age "abc" in the age field
    And the user clicks the Submit button
    Then the registration modal remains open
    And the form is not submitted

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
  Scenario: "No" radio button remains disabled
    Given the user is on the Radio Button page
    Then the "#noRadio" element is disabled
    When the user attempts to click the "#noRadio" element
    Then the "#noRadio" element remains disabled
    And no selection state change occurs

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
  Scenario: UI remains stable when scrolling to interactable elements
    Given the user is on the Radio Button page
    When the user scrolls to the "Yes" radio button
    And the user clicks the "Yes" radio button
    Then the page does not throw any errors
    And the selection is reflected in the output text