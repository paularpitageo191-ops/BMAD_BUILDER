@SCRUM-70 @Forensic-AEGIS-2026-MAY-0E05
Feature: Negative Path Validation for DemoQA Elements

  Scenario: Email field rejects invalid input
    Given the user is on the Text Box page of DemoQA Elements
    When the user enters an invalid email "test@domain" into the Email field
    And clicks the Submit button
    Then the Email field should show a validation error
    And the Output section should not be displayed

  Scenario: Web Tables reject non-numeric Age and Salary
    Given the user is on the Web Tables page of DemoQA Elements
    When the user clicks Add to open the registration modal
    And enters non-numeric Age "abc" and Salary "12ab"
    And clicks Submit
    Then the registration modal should remain open and display validation errors

  Scenario: Disabled radio button cannot be selected
    Given the user is on the Radio Button page of DemoQA Elements
    Then the "No" option should be disabled and not clickable
    When the user attempts to click the disabled option
    Then no state change should occur

  Scenario: UI remains stable under overlay obstruction
    Given the user is on the Text Box page of DemoQA Elements
    When a fixed banner overlay obstructs the top of the page
    And the user scrolls to the Email field
    And enters a valid email "test@example.com"
    And clicks Submit
    Then the Output section should be displayed
    And the Email field should not show a validation error