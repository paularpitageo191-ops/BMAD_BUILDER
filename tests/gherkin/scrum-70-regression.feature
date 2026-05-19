# Traceability
# Functional Areas: Radio Button, Text Box, Web Tables
# Source References: AC1, AC2, AC3, Screenshots: Valid input
# Execution Readiness: strong
# Readiness Rationale: There is enough technical context to support executable coverage where the approved scope requires it.
Feature: Regression Guardrails for DemoQA Elements Module
  As a QA regression agent,
  I want to verify that existing positive workflows remain intact after introducing negative-validations changes,
  So that the module remains stable and regression-free.

  Background:
    Given the user is on the DemoQA Elements page (https://demoqa.com/elements)

  @regression @SCRUM-70 @AC1
  Scenario: Regression – Email acceptance still validates and shows output for valid email
    Given the "Text Box" section is displayed
    When the user enters "test@example.com" in the #userEmail field
    And clicks the #submit button
    Then no CSS validation error appears on #userEmail
    And the #output section is visible and displays the entered email

  @regression @SCRUM-70 @AC2
  Scenario: Regression – Web table registration still succeeds with valid numeric inputs
    Given the "Web Tables" section is displayed
    And the "Registration" modal is open and empty
    When the user enters valid data:
      | First Name | Jane |
      | Last Name  | Doe  |
      | Email      | jane.doe@example.com |
      | Age        | 28   |
      | Salary     | 65000 |
      | Department | Engineering |
    And clicks the Submit button in the modal
    Then the modal closes
    And a new row with the matching data appears in the web table

  @regression @SCRUM-70 @AC3
  Scenario: Regression – Radio button "Yes" remains selectable and shows feedback
    Given the "Radio Button" section is displayed
    When the user clicks the "#yesRadio" option
    Then the "#yesRadio" option is selected
    And feedback text "You have selected Yes" appears on the page
    And the "#noRadio" option remains disabled and unselectable