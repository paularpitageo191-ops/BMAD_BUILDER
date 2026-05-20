# Traceability
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA engineer
  I want to validate negative scenarios in the Elements module
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given I navigate to DemoQA Elements Module

  @AC1 @negative @email-validation
  Scenario: Text Box - Invalid email without TLD triggers validation error and suppresses output
    Given I navigate to the Text Box page
    When I enter "user@domain" in the email field
    And I click the submit button
    Then the email field should show a validation error
    And the output section should not be visible

  @AC1 @negative @email-validation
  Scenario: Text Box - Email missing "@" handled as invalid
    Given I navigate to the Text Box page
    When I enter "userdomain.com" in the email field
    And I click the submit button
    Then the email field should show a validation error
    And the output section should not be visible

  @AC1 @negative @email-validation
  Scenario: Text Box - Empty email triggers required field validation
    Given I navigate to the Text Box page
    When I clear the email field
    And I click the submit button
    Then the email field should show a validation error
    And the output section should not be visible

  @AC2 @negative @web-tables @age-validation
  Scenario: Web Tables - Non-numeric age blocks submission
    Given I navigate to the Web Tables page
    When I click "Add" to open the registration modal
    And I enter "abc" in the age field
    And I fill the other fields with valid values
    And I click submit in the registration modal
    Then the registration modal should remain open
    And no new row should be added to the table

  @AC2 @negative @web-tables @salary-validation
  Scenario: Web Tables - Non-numeric salary blocks submission
    Given I navigate to the Web Tables page
    When I click "Add" to open the registration modal
    And I enter "12ab" in the salary field
    And I fill the other fields with valid values
    And I click submit in the registration modal
    Then the registration modal should remain open
    And no new row should be added to the table

  @AC2 @negative @web-tables @empty-fields
  Scenario: Web Tables - Empty age and salary fields block submission
    Given I navigate to the Web Tables page
    When I click "Add" to open the registration modal
    And I leave age and salary fields empty
    And I fill the other fields with valid values
    And I click submit in the registration modal
    Then the registration modal should remain open
    And both age and salary fields should show required field validation errors

  @AC3 @negative @radio-button
  Scenario: Radio Button - Disabled "No" option cannot be interacted with
    Given I navigate to the Radio Button page
    Then the "No" radio button should be disabled
    When I click on the "No" radio button label
    Then the "No" radio button should remain disabled
    And no selection text should appear indicating "No" is selected

  @AC3 @negative @radio-button @regression
  Scenario: Radio Button - Disabled "No" cannot override existing selection
    Given I navigate to the Radio Button page
    When I click the "Yes" radio button
    Then the output should show "Yes" is selected
    When I click on the "No" radio button label
    Then the "Yes" radio button should still be selected
    And the "No" radio button should remain disabled

  @AC4 @regression @ui-stability @overlay
  Scenario: UI Stability - Elements interactable under overlay obstruction
    Given I navigate to the Text Box page
    When I inject an overlay covering part of the form
    Then the email field should still be visible after scrolling into view
    When I enter a valid email in the email field
    And I click the submit button using force click
    Then the output section should be displayed with the entered email

  @AC4 @regression @ui-stability @scrolling
  Scenario: UI Stability - Elements interactable via scrolling when viewport is small
    Given I set viewport to 800x600
    When I navigate to the Elements page
    Then I should be able to scroll to the Text Box section and interact with its fields
    And I should be able to scroll to the Radio Button section and click the "Yes" radio button
    And all interactions should succeed without errors