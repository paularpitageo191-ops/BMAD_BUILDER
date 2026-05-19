# Traceability
# Functional Areas: Radio Button, Text Box, Web Tables
# Source References: AC1, AC2, AC3, Screenshot: Valid input => output section rendered, Screenshot: enabled radio behavior, Screenshot: valid numeric input, Test Data: empty/null inputs, Test Data: invalid email formats, Test Data: non-numeric values
# Execution Readiness: strong
# Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given the user navigates to the DemoQA Elements page

  @negative @email @AC1
  Scenario Outline: Invalid email input triggers validation error and output section is not displayed
    Given the user is on the Text Box form
    When the user enters "<email>" in the #userEmail field
    And clicks the #submit button
    Then the #userEmail field shows a validation error
    And the #output element is not visible or empty

    Examples:
      | email           |
      | test@domain     |
      | testdomain.com  |
      |                 |

  @positive @regression @email @AC1
  Scenario: Valid email input renders the output section
    Given the user is on the Text Box form
    When the user enters "test@example.com" in the #userEmail field
    And clicks the #submit button
    Then the #output element is displayed and contains the entered email

  @negative @webtables @age @AC2
  Scenario: Non-numeric age value blocks submission and modal stays open
    Given the user is on the Web Tables page
    When the user clicks "Add" to open the registration modal
    And enters "abc" in the Age field
    And clicks "Submit" in the registration modal
    Then the registration modal remains visible
    And the Age field shows a validation error
    And no new row is added to the table

  @negative @webtables @salary @AC2
  Scenario: Non-numeric salary value blocks submission and modal stays open
    Given the user is on the Web Tables page
    When the user clicks "Add" to open the registration modal
    And enters "12ab" in the Salary field
    And clicks "Submit" in the registration modal
    Then the registration modal remains visible
    And the Salary field shows a validation error
    And no new row is added to the table

  @negative @webtables @boundary @AC2
  Scenario: Empty age field submission behavior (AC2 focus on non-numeric)
    Given the user is on the Web Tables page
    When the user clicks "Add" to open the registration modal
    And fills all required fields with valid data except leaving Age blank
    And clicks "Submit" in the registration modal
    Then the registration modal remains visible with a validation error on Age
    Or the modal closes and a row with empty age is added (note: expected behavior per AC2)

  @positive @regression @webtables @AC2
  Scenario: Valid web tables submission adds a new row
    Given the user is on the Web Tables page
    When the user clicks "Add" to open the registration modal
    And enters valid data: FirstName="John", LastName="Doe", Email="john@example.com", Age="30", Salary="50000", Department="QA"
    And clicks "Submit"
    Then the registration modal is no longer visible
    And the table contains a row with the entered data

  @negative @radiobutton @disabled @AC3
  Scenario: "No" radio button is disabled and does not change state on click
    Given the user is on the Radio Button page
    Then the #noRadio element should be disabled
    When the user attempts to click #noRadio
    Then the #noRadio element remains disabled
    And no selected class is added
    And the output message (if any) remains unchanged

  @positive @regression @radiobutton @AC3
  Scenario: "Yes" radio button remains functional
    Given the user is on the Radio Button page
    Then the #yesRadio element should be enabled
    When the user clicks #yesRadio
    Then the #yesRadio element displays a selected or checked state
    And the output area shows "You have selected Yes"