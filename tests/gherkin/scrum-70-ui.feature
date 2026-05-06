@SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
Feature: Negative Path Validation for DemoQA Elements Module

  Scenario: AC1 - Email validation blocks invalid input and hides output section
    Given the user is on the Elements page
    When the user enters an invalid email "test@domain" into the #userEmail field
    And clicks the Submit button
    Then the #userEmail field displays a validation error
    And the #output section is not visible

  Scenario: AC2 - Non-numeric Age or Salary prevents Web Tables submission
    Given the user has opened the Registration modal in the Web Tables section
    When the user enters "abc" into the Age field
    And enters "12ab" into the Salary field
    And clicks the Submit button within the modal
    Then the registration modal remains open
    And no new record appears in the table

  Scenario: AC3 - #noRadio button remains disabled and unresponsive
    Given the user is on the Radio Button section
    When the user attempts to click the #noRadio element
    Then the #noRadio element is still disabled
    And its checked property remains false

  Scenario: AC4 - UI remains interactable under overlay obstruction
    Given the page may contain an overlay
    When the test scrolls to the #submit button in the Text Box section
    And clicks the #submit button
    Then the click action is performed successfully
    And the element is interactable via scroll and visibility handling