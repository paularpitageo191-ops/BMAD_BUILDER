# Traceability
Feature: Elements Negative Path Validation
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  Background:
    Given I am on the DemoQA Elements page

  # AC1 – Email Validation
  @negative @AC1 @email @textbox
  Scenario: Email validation – invalid format missing TLD blocks submission
    When I enter "test@domain" in the email field
    And I click the submit button
    Then the email field displays a browser validation error
    And the output section is not visible

  @negative @AC1 @email @textbox
  Scenario: Email validation – invalid format missing @ blocks submission
    When I enter "testdomain.com" in the email field
    And I click the submit button
    Then the email field displays a browser validation error
    And the output section is not visible

  @negative @AC1 @email @textbox @boundary
  Scenario: Email validation – empty input may or may not be blocked (observe behavior)
    When I leave the email field empty
    And I click the submit button
    Then either a validation error appears or the output section remains hidden (document actual behavior)

  @positive @AC1 @email @textbox
  Scenario: Positive smoke – valid email submission shows output
    When I fill the text box form with valid data including "test@example.com" as email
    And I click the submit button
    Then the output section is displayed
    And the submitted email appears in the output

  # AC2 – Web Tables Validation
  @negative @AC2 @webtables @age
  Scenario: Web tables – non-numeric age blocks submission
    Given the registration modal is open
    When I fill all fields with valid data except age which I set to "abc"
    And I click the submit button in the modal
    Then the registration modal remains open
    And no new row is added to the table

  @negative @AC2 @webtables @salary
  Scenario: Web tables – non-numeric salary blocks submission
    Given the registration modal is open
    When I fill all fields with valid data except salary which I set to "12ab"
    And I click the submit button in the modal
    Then the registration modal remains open
    And no new row is added to the table

  @negative @AC2 @webtables @boundary
  Scenario: Web tables – empty age and salary fields block submission
    Given the registration modal is open
    When I fill all fields with valid data but leave age and salary empty
    And I click the submit button in the modal
    Then the registration modal remains open
    And no new row is added to the table

  @positive @AC2 @webtables
  Scenario: Positive smoke – valid numeric data submits successfully
    Given the registration modal is open
    When I fill all fields with valid numeric data (age 30, salary 50000)
    And I click the submit button in the modal
    Then the registration modal closes
    And a new row with the submitted data appears in the table

  # AC3 – Radio Button Validation
  @negative @AC3 @radiobutton @disabled
  Scenario: Radio button – disabled "No" option does not change state on click
    When I scroll to the radio button section
    Then the "No" radio option is disabled
    When I click the "No" radio option
    Then the "No" radio option remains disabled and unchecked
    And no success message for "No" appears

  @negative @AC3 @radiobutton @resilience
  Scenario: Radio button – programmatic click on "No" does not trigger UI update
    When I force a JavaScript click event on the disabled "No" radio
    Then no success message appears
    And the radio button group state is unchanged

  # AC4 – UI Stability
  @regression @AC4 @stability
  Scenario: UI remains interactable after overlay dismissal
    Given any overlays (e.g., cookie consent) are dismissed
    When I perform normal interactions on Text Box, Web Tables, and Radio Button sections
    Then all interactions succeed without "element not interactable" errors