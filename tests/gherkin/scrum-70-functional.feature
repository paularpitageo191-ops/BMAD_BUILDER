@SCRUM-70 @Forensic-AEGIS-2026-MAY-5252
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given I am on the DemoQA Elements home page

  @AC1
  Scenario: Invalid email triggers validation error and no output
    Given I navigate to the "Text Box" section
    When I enter an invalid email "test@domain"
    And I click the Submit button
    Then the email field should show a validation error
    And the output section should not be displayed

  @AC2
  Scenario Outline: Non-numeric value in "<field>" blocks submission and modal stays open
    Given I navigate to the "Web Tables" section
    When I click the Add button
    And I enter "<value>" in the "<field>" field
    And I submit the registration form
    Then the form submission is blocked
    And the registration modal remains open

    Examples:
      | field   | value |
      | Age     | abc   |
      | Salary  | 12ab  |

  @AC3
  Scenario: "No" radio button is disabled and does not change state on click
    Given I navigate to the "Radio Button" section
    Then the "No" radio button should be disabled
    When I click the "No" radio button
    Then the "No" radio button is still disabled
    And no success message is displayed

  @AC4
  Scenario: UI remains stable under overlay obstruction
    Given I navigate to the "Text Box" section
    When an overlay is injected covering the Submit button
    And I scroll the Submit button into view
    Then the Submit button should be clickable
    And clicking it should still trigger validation