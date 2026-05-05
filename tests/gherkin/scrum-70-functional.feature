Feature: Negative Path Validation for Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
  Scenario: Email Validation - Invalid email triggers validation error and output not displayed
    Given the user is on the Text Box page
    When the user enters an invalid email "test@domain"
    And the user clicks the submit button
    Then a validation error is displayed on #userEmail
    And the output section #output is not visible

  @SCRUM-70
  Scenario: Email Validation - Valid email renders output section
    Given the user is on the Text Box page
    When the user enters a valid email "test@example.com"
    And the user clicks the submit button
    Then the output section #output is visible

  @SCRUM-70
  Scenario: Web Tables Validation - Non-numeric values block submission
    Given the user is on the Web Tables page
    And the user opens the registration modal
    When the user enters a non-numeric value "abc" in the Age field
    And the user clicks the submit button in the modal
    Then the registration modal remains open
    And the form is not submitted

  @SCRUM-70
  Scenario: Radio Button Validation - "No" option remains disabled and unclickable
    Given the user is on the Radio Button page
    Then the #noRadio element should be disabled
    When the user attempts to click on #noRadio
    Then the element remains disabled
    And no state change is triggered

  @SCRUM-70
  Scenario: UI Stability under potential obstruction
    Given the user is on the Radio Button page
    And an overlay is added to obstruct the page
    When the user removes the overlay (visibility handling)
    And the user scrolls the "Yes" radio button into view
    And the user clicks the "Yes" radio button
    Then the "Yes" radio button is selected