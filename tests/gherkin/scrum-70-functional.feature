@SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
Feature: DemoQA Elements Module Negative Path Validation

  @AC1
  Scenario: Invalid email triggers validation error and no output
    Given the user is on the Text Box page
    When the user enters invalid email "test@domain" and clicks Submit
    Then the email input field shows a validation error
    And the output section is not visible

  @AC2
  Scenario: Non-numeric values in Age or Salary block submission
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And enters non-numeric age "abc" and non-numeric salary "12ab"
    And clicks Submit
    Then the modal remains open
    And the fields still contain the invalid values

  @AC3
  Scenario: "No" radio button remains disabled and no state change on click
    Given the user is on the Radio Button page
    Then the "No" radio button is disabled
    When the user attempts to click the "No" radio button
    Then the radio button remains disabled
    And no selection state has changed

  @AC4
  Scenario: UI elements remain interactable under overlay obstruction
    Given the user is on the Text Box page
    And an overlay covers the entire page
    When the user scrolls to the email field and enters invalid email "test@domain"
    And clicks Submit using force
    Then the email validation error is still displayed
    And the output section is not displayed