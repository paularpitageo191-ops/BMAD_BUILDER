```gherkin
@SCRUM-70 @Forensic-AEGIS-2026-MAY-5252
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given the DemoQA Elements page is loaded

  @AC1
  Scenario Outline: Email validation rejects invalid formats and hides output
    When the user enters "<invalidEmail>" in the email field #userEmail
    And the user clicks the submit button
    Then a validation error is displayed on #userEmail
    And the output section #output is not visible
    Examples:
      | invalidEmail          |
      | test@domain           |
      | user@.com             |
      | @domain.com           |
      | user@domain           |
      |                        |

  @AC2
  Scenario Outline: Web Tables reject non-numeric values in Age and Salary fields
    Given the user opens the "Web Tables" section
    And the registration modal is displayed
    When the user enters "<value>" in the "<field>" field
    And the user clicks the submit button inside the modal
    Then the modal remains open
    And the submission is blocked
    Examples:
      | value | field          |
      | abc   | Age            |
      | 12ab  | Age            |
      | abc   | Salary         |
      | 12ab  | Salary         |
      |       | Age            |
      |       | Salary         |

  @AC3
  Scenario: "No" radio button remains disabled and does not change state
    Given the "Radio Button" section is visible
    Then the "No" option #noRadio is disabled
    When the user clicks the "No" option
    Then the "No" option remains disabled
    And no state change occurs

  @AC4
  Scenario: UI remains stable under obstruction (overlay)
    Given an overlay is present covering the page
    When the user attempts to interact with elements behind the overlay
    Then elements remain interactable after scrolling into view
    And no unexpected behavior occurs
```