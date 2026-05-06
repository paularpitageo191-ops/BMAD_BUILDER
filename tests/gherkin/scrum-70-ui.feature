@SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
Feature: Negative Path Validation for DemoQA Elements Module

  Background: User is on DemoQA Elements page
    Given the user navigates to "https://demoqa.com/elements"

  @AC1
  Scenario: Email validation rejects invalid formats and does not display output
    Given the user is on the Text Box section
    When the user enters an invalid email "test@domain" in the #userEmail field
    And clicks the #submit button
    Then the #userEmail field should show a validation error
    And the #output section should not be visible

  @AC2
  Scenario: Web Tables - Non-numeric age/salary blocks submission and modal remains open
    Given the user is on the Web Tables section
    When the user clicks the Add button to open the registration modal
    And enters "abc" in the age field
    And enters "xyz" in the salary field
    And clicks the Submit button within the modal
    Then the registration modal should still be visible
    And no new record should be added to the table

  @AC3
  Scenario: Radio Button - "No" option remains disabled and non-interactive
    Given the user is on the Radio Button section
    Then the "No" radio button identified by #noRadio should be disabled
    When the user attempts to click the #noRadio element
    Then the #noRadio element should still be disabled
    And it should not be checked

  @AC4
  Scenario: UI stability under overlay - elements remain interactable via scroll/visibility
    Given an overlay obstructs the page
    When the user scrolls the #submit element into view and clicks it
    Then the #submit element should be visible and the click should succeed