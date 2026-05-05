@SCRUM-70 @Forensic-AEGIS-2026-MAY-C711
Feature: Negative Path Validation for DemoQA Elements Module

  Scenario: AC1 - Invalid email shows validation error and no output
    Given the user is on the Text Box page
    When the user enters an invalid email such as "test@domain"
    And clicks the Submit button
    Then the email field should show a validation error with class "field-error"
    And the output section with id "output" should not be displayed

  Scenario: AC1 - Empty email submission does not show output
    Given the user is on the Text Box page
    When the user leaves the email field empty
    And clicks the Submit button
    Then the email field should show a validation error with class "field-error"
    And the output section with id "output" should not be displayed

  Scenario: AC2 - Non-numeric Age blocks submission and modal stays open
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And enters non-numeric value "abc" in the Age field
    And submits the form
    Then the registration modal should remain open
    And the Age field should show a validation error or the submit should be prevented

  Scenario: AC2 - Non-numeric Salary blocks submission and modal stays open
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And enters non-numeric value "12ab" in the Salary field
    And submits the form
    Then the registration modal should remain open
    And the Salary field should show a validation error or the submit should be prevented

  Scenario: AC3 - "No" radio button remains disabled
    Given the user is on the Radio Button page
    Then the "No" radio button with id "noRadio" should be disabled
    When the user attempts to click the "No" radio button
    Then the "No" radio button should remain disabled
    And no "Yes" or other radio button state should change

  Scenario: AC4 - UI stability under overlay obstruction
    Given the user is on the Text Box page
    When a fixed overlay is added to the page to obstruct the email field
    Then the email field should still be interactable by scrolling into view
    And the user should be able to enter text and submit successfully after scrolling
    And the output section should be displayed for valid input