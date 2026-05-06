Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
  Scenario: Invalid email input shows validation error and no output
    Given the user is on the Text Box page
    When the user enters an invalid email "test@domain" in the email field
    And clicks the Submit button
    Then the email input should show a validation error
    And the output section should not be displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
  Scenario: Non-numeric Age and Salary block Web Table submission
    Given the user is on the Web Tables page
    When the user opens the registration form
    And enters non-numeric values in Age and Salary fields
    And clicks the Submit button
    Then the registration modal should remain open
    And the submission should be blocked

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
  Scenario: "No" radio button remains disabled and unchangeable
    Given the user is on the Radio Button page
    When the user attempts to click the "No" radio button with id #noRadio
    Then the radio button should remain disabled
    And its state should not change

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
  Scenario: UI remains stable under overlay obstruction
    Given the user is on the Elements page
    When an overlay is introduced covering the page
    And the user scrolls to a target element and attempts to interact
    Then the target element should be interactable via scroll/visibility handling